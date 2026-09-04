const axios = require("axios");
const NodeCache = require("node-cache");

// ─── Cache ────────────────────────────────────────────────────────────────────
// ESPN's public site API rate-limits (returns 403) if hammered. With ~18 football
// leagues, one uncached call fans out to 18 upstream requests, so TTLs are kept
// generous and every successful result is also kept in `lastGood` forever —
// if upstream starts failing we serve the last real data instead of a blank page.
const scrapeCache = new NodeCache({ stdTTL: 120 });   // 2 min – live/upcoming/recent
const newsCache = new NodeCache({ stdTTL: 1800 });    // 30 min – news
const lastGood = new NodeCache({ stdTTL: 0 });        // never expires – outage fallback

// Max simultaneous upstream requests. Firing all 18 leagues at once is what
// triggers ESPN's rate limiter.
const FETCH_CONCURRENCY = 4;

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
};

// Run `fn` over `items` with bounded concurrency. Never rejects: each slot
// resolves to {ok:true,value} or {ok:false,error} like Promise.allSettled.
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      try { out[i] = { ok: true, value: await fn(items[i]) }; }
      catch (error) { out[i] = { ok: false, error }; }
    }
  });
  await Promise.all(workers);
  return out;
}

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
    { slug: "uefa.europa", name: "UEFA Europa League" },
    { slug: "usa.1", name: "MLS" },
    { slug: "ned.1", name: "Eredivisie" },
    { slug: "por.1", name: "Primeira Liga" },
    { slug: "bra.1", name: "Brasileirão" },
    { slug: "mex.1", name: "Liga MX" },
    { slug: "eng.2", name: "EFL Championship" },
    { slug: "sco.1", name: "Scottish Premiership" },
    { slug: "tur.1", name: "Süper Lig" },
    { slug: "arg.1", name: "Argentine Primera División" },
    { slug: "conmebol.libertadores", name: "Copa Libertadores" },
    { slug: "fifa.world", name: "FIFA World Cup" },
  ],
  basketball: [
    { slug: "nba", name: "NBA" },
    { slug: "wnba", name: "WNBA" },
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

  const results = await mapLimit(leagues, FETCH_CONCURRENCY, l => fetchScoreboard(sport, l.slug));

  let all = [];
  let okCount = 0;
  results.forEach((r, i) => {
    if (!r || !r.ok) return;
    okCount++;
    const league = leagues[i].name;
    const events = r.value.events || [];
    if (sport === "tennis") {
      events.forEach(ev => { all = all.concat(normalizeTennisEvent(ev, league)); });
    } else {
      events.forEach(ev => all.push(normalizeTeamEvent(ev, sport, league)));
    }
  });

  // Every upstream league failed (rate limit / outage) — serve the last known
  // real data rather than caching an empty result and blanking the page.
  if (okCount === 0) {
    const stale = lastGood.get(cacheKey);
    if (stale) return stale;
  }

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
  if (okCount > 0) lastGood.set(cacheKey, payload);
  return payload;
}

async function getSportNews(sport) {
  const leagues = SPORT_LEAGUES[sport];
  if (!leagues) throw new Error(`Unsupported sport: ${sport}`);

  const cacheKey = `news_${sport}`;
  const cached = newsCache.get(cacheKey);
  if (cached) return cached;

  // Pull from each league's own news feed and merge — genuinely distinct
  // real articles per league, not one feed duplicated under many labels.
  const results = await mapLimit(leagues, FETCH_CONCURRENCY, l =>
    axios.get(`${ESPN_BASE}/${ESPN_SPORT_SLUG[sport]}/${l.slug}/news`, {
      headers, timeout: 10000, params: { limit: 15 },
    })
  );

  const seen = new Set();
  const articles = [];
  let okCount = 0;
  results.forEach(r => {
    if (!r || !r.ok) return;
    okCount++;
    (r.value.data.articles || []).forEach(a => {
      const id = String(a.id);
      if (seen.has(id)) return;
      seen.add(id);
      articles.push({
        id,
        title: a.headline,
        description: a.description,
        url: (a.links && a.links.web && a.links.web.href) || "",
        img: (a.images && a.images[0] && a.images[0].url) || "",
        source: "ESPN",
        date: a.published,
      });
    });
  });

  if (okCount === 0) {
    const stale = lastGood.get(cacheKey);
    if (stale) return stale;
  }

  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  newsCache.set(cacheKey, articles);
  if (okCount > 0) lastGood.set(cacheKey, articles);
  return articles;
}

module.exports = { getSportMatches, getSportNews, SPORT_LEAGUES };
