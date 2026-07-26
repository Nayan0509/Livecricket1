const axios = require("axios");
const NodeCache = require("node-cache");

// ─── Cache ────────────────────────────────────────────────────────────────────
const scrapeCache = new NodeCache({ stdTTL: 30 });   // 30s – live/upcoming/recent
const newsCache = new NodeCache({ stdTTL: 300 });    // 5min – news

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
};

// Our public sport keys vs. ESPN's own sport slugs (ESPN calls football "soccer").
const ESPN_SPORT_SLUG = {
  football: "soccer",
  basketball: "basketball",
  tennis: "tennis",
};

// ─── Sport → league config ────────────────────────────────────────────────────
// Each entry is one ESPN "site API" scoreboard endpoint: /sports/{espnSport}/{slug}/scoreboard
const SPORT_LEAGUES = {
  football: [
    { slug: "eng.1", name: "Premier League" },
    { slug: "esp.1", name: "La Liga" },
    { slug: "ita.1", name: "Serie A" },
    { slug: "ger.1", name: "Bundesliga" },
    { slug: "fra.1", name: "Ligue 1" },
    { slug: "uefa.champions", name: "UEFA Champions League" },
    { slug: "usa.1", name: "MLS" },
  ],
  basketball: [
    { slug: "nba", name: "NBA" },
    { slug: "mens-college-basketball", name: "NCAA Men's Basketball" },
    { slug: "womens-college-basketball", name: "NCAA Women's Basketball" },
  ],
  tennis: [
    { slug: "atp", name: "ATP Tour" },
    { slug: "wta", name: "WTA Tour" },
  ],
};

function teamLogo(team) {
  if (!team) return "";
  return team.logo || (team.logos && team.logos[0] && team.logos[0].href) || "";
}

async function fetchScoreboard(sport, leagueSlug) {
  const url = `${ESPN_BASE}/${ESPN_SPORT_SLUG[sport]}/${leagueSlug}/scoreboard`;
  const { data } = await axios.get(url, { headers, timeout: 10000 });
  return data;
}

// Football/basketball share the same team-vs-team ESPN event shape.
function normalizeTeamEvent(event, sport, league) {
  const comp = (event.competitions && event.competitions[0]) || {};
  const competitors = comp.competitors || [];
  const home = competitors.find(c => c.homeAway === "home") || competitors[0] || {};
  const away = competitors.find(c => c.homeAway === "away") || competitors[1] || {};
  const statusType = (event.status && event.status.type) || {};

  const side = (c) => ({
    name: (c.team && c.team.displayName) || "TBD",
    shortName: (c.team && (c.team.abbreviation || c.team.shortDisplayName)) || "",
    logo: teamLogo(c.team),
    score: c.score != null ? String(c.score) : "",
    winner: !!c.winner,
  });

  return {
    id: `${sport}-${event.id}`,
    sport,
    league,
    name: event.shortName || event.name,
    venue: (comp.venue && comp.venue.fullName) || "",
    date: event.date,
    status: statusType.shortDetail || statusType.description || "",
    isLive: statusType.state === "in",
    matchStarted: statusType.state === "in" || statusType.state === "post",
    matchEnded: statusType.state === "post",
    teams: [side(home), side(away)],
  };
}

// Tennis events are tournaments; each has groupings (draws) of individual matches.
function normalizeTennisEvent(event, league) {
  const matches = [];
  (event.groupings || []).forEach(g => {
    (g.competitions || []).forEach(comp => {
      const competitors = comp.competitors || [];
      const statusType = (comp.status && comp.status.type) || {};
      const player = (c) => ({
        name: (c.athlete && (c.athlete.displayName || c.athlete.shortName)) || "TBD",
        shortName: (c.athlete && c.athlete.shortName) || "",
        logo: (c.athlete && c.athlete.flag && c.athlete.flag.href) || "",
        score: (c.linescores || []).map(l => l.value).join("-"),
        winner: !!c.winner,
      });
      const names = competitors.map(c => (c.athlete && c.athlete.shortName) || "TBD");
      matches.push({
        id: `tennis-${comp.id}`,
        sport: "tennis",
        league: `${league} — ${(g.grouping && g.grouping.displayName) || ""} — ${event.shortName || event.name}`,
        name: names.join(" vs "),
        venue: (comp.venue && comp.venue.fullName) || "",
        date: comp.date || event.date,
        status: statusType.shortDetail || statusType.description || "",
        isLive: statusType.state === "in",
        matchStarted: statusType.state === "in" || statusType.state === "post",
        matchEnded: statusType.state === "post",
        teams: competitors.map(player),
      });
    });
  });
  return matches;
}

async function getSportMatches(sport) {
  const leagues = SPORT_LEAGUES[sport];
  if (!leagues) throw new Error(`Unsupported sport: ${sport}`);

  const cacheKey = `matches_${sport}`;
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  const results = await Promise.allSettled(leagues.map(l => fetchScoreboard(sport, l.slug)));

  let all = [];
  results.forEach((r, i) => {
    if (r.status !== "fulfilled") return;
    const league = leagues[i].name;
    const events = r.value.events || [];
    if (sport === "tennis") {
      events.forEach(ev => { all = all.concat(normalizeTennisEvent(ev, league)); });
    } else {
      events.forEach(ev => all.push(normalizeTeamEvent(ev, sport, league)));
    }
  });

  const live = all.filter(m => m.isLive);
  const recent = all
    .filter(m => m.matchEnded)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 30);
  const upcoming = all
    .filter(m => !m.matchStarted)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 30);

  const payload = { live, recent, upcoming };
  scrapeCache.set(cacheKey, payload);
  return payload;
}

async function getSportNews(sport) {
  const leagues = SPORT_LEAGUES[sport];
  if (!leagues) throw new Error(`Unsupported sport: ${sport}`);

  const cacheKey = `news_${sport}`;
  const cached = newsCache.get(cacheKey);
  if (cached) return cached;

  // Pull from the sport's primary league only — avoids one duplicate-content
  // feed per league for what is ultimately the same global news wire.
  const primary = leagues[0];
  const url = `${ESPN_BASE}/${ESPN_SPORT_SLUG[sport]}/${primary.slug}/news`;
  let articles = [];
  try {
    const { data } = await axios.get(url, { headers, timeout: 10000, params: { limit: 20 } });
    articles = (data.articles || []).map(a => ({
      id: String(a.id),
      title: a.headline,
      description: a.description,
      url: (a.links && a.links.web && a.links.web.href) || "",
      img: (a.images && a.images[0] && a.images[0].url) || "",
      source: "ESPN",
      date: a.published,
    }));
  } catch (_) {}

  newsCache.set(cacheKey, articles);
  return articles;
}

module.exports = { getSportMatches, getSportNews, SPORT_LEAGUES };
