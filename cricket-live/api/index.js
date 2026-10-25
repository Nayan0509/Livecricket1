const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");
const scraper = require("./scraper");
const espnCricket = require("./espnCricket");
const cricsheet = require("./cricsheet");
const multiSport = require("./multiSportScraper");
const kachufulEngine = require("./kachufulRooms");

// Suppress noisy deprecation warnings
process.removeAllListeners("warning");
process.on("warning", (w) => {
  if (w.name === "DeprecationWarning") return;
  console.warn(w);
});

const cache      = new NodeCache({ stdTTL: 30  }); // 30s — live data
const staticCache = new NodeCache({ stdTTL: 3600 }); // 1h  — static data

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Connection": "keep-alive",
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

function getTeamImageUrl(teamName) {
  if (!teamName) return null;
  const map = {
    "India": "2", "Australia": "4", "England": "1", "Pakistan": "7",
    "South Africa": "3", "New Zealand": "5", "West Indies": "10", "Sri Lanka": "6",
    "Bangladesh": "8", "Afghanistan": "96", "Zimbabwe": "9", "Ireland": "29",
    "Netherlands": "15", "Scotland": "30",
    "Mumbai Indians": "62", "Chennai Super Kings": "59",
    "Royal Challengers Bangalore": "64", "Kolkata Knight Riders": "63",
    "Delhi Capitals": "61", "Punjab Kings": "65", "Rajasthan Royals": "66",
    "Sunrisers Hyderabad": "255", "Gujarat Titans": "971", "Lucknow Super Giants": "966",
  };
  const id = map[teamName];
  return id ? `https://static.cricbuzz.com/a/img/v1/75x75/i1/c${id}/team_flag.jpg` : null;
}

function getTeamShortName(name) {
  if (!name) return "TBD";
  const map = {
    "India":"IND","Australia":"AUS","England":"ENG","Pakistan":"PAK",
    "South Africa":"SA","New Zealand":"NZ","West Indies":"WI","Sri Lanka":"SL",
    "Bangladesh":"BAN","Afghanistan":"AFG","Zimbabwe":"ZIM","Ireland":"IRE",
    "Netherlands":"NED","Scotland":"SCO","Nepal":"NEP","USA":"USA","Canada":"CAN",
    "Mumbai Indians":"MI","Chennai Super Kings":"CSK","Royal Challengers Bangalore":"RCB",
    "Kolkata Knight Riders":"KKR","Delhi Capitals":"DC","Punjab Kings":"PBKS",
    "Rajasthan Royals":"RR","Sunrisers Hyderabad":"SRH","Gujarat Titans":"GT",
    "Lucknow Super Giants":"LSG",
  };
  return map[name] || name.slice(0, 3).toUpperCase();
}

function parseScore(s) {
  if (!s) return { r: 0, w: 0, o: 0 };
  const r = s.match(/(\d+)[\-\/](\d+)/);
  const o = s.match(/\((\d+(?:\.\d+)?)\s*(?:ov)?\)/);
  return {
    r: r ? parseInt(r[1]) : 0,
    w: r ? parseInt(r[2]) : 0,
    o: o ? parseFloat(o[1]) : 0,
  };
}

// ─── Query-param helper ──────────────────────────────────────────────────────
function qp(req, name) {
  try { return new URL(req.url, `http://${req.headers.host || "localhost"}`).searchParams.get(name); }
  catch { return null; }
}

// ─── Player search (Cricbuzz search API) ──────────────────────────────────────
async function searchPlayers(query) {
  const key = `players:search:${query}`;
  const hit = staticCache.get(key);
  if (hit) return hit;
  try {
    const url = `https://www.cricbuzz.com/api/cricket-search/v2?action=cricketers&q=${encodeURIComponent(query)}&callback=`;
    const { data } = await axios.get(url, { headers, timeout: 8000 });
    const json = data.replace(/^[^(]+\(/, "").replace(/\);?\s*$/, "");
    const parsed = JSON.parse(json);
    const results = (parsed?.player || []).map(p => ({ id: p.id, name: p.name, country: p.teamName || "", role: p.role || "" }));
    if (results.length) { staticCache.set(key, results); return results; }
  } catch (_) {}
  // Real search failed — return empty rather than substituting a fixed
  // fake result set.
  return [];
}

// ─── ALL MATCHES (JSON extraction from Cricbuzz) ─────────────────────────────

async function getCricbuzzMatches() {
  const cacheKey = "cricbuzz-matches";
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = { live: [], recent: [], upcoming: [] };

  try {
    const { data } = await axios.get(
      "https://www.cricbuzz.com/cricket-match/live-scores",
      { headers, timeout: 12000 }
    );

    const plain = data.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    const idx = plain.indexOf('"typeMatches":[');
    if (idx === -1) throw new Error("typeMatches not found");

    let brackets = 0, start = idx + 14, end = -1;
    for (let i = start; i < plain.length; i++) {
      if (plain[i] === "[") brackets++;
      else if (plain[i] === "]") { brackets--; if (brackets === 0) { end = i; break; } }
    }

    if (end === -1) throw new Error("Could not find end of typeMatches");

    const typeMatches = JSON.parse(plain.substring(start, end + 1));

    typeMatches.forEach(typeMatch => {
      (typeMatch.seriesMatches || []).forEach(series => {
        const s = series.seriesAdWrapper || series;
        (s.matches || []).forEach(matchObj => {
          const info  = matchObj.matchInfo;
          const score = matchObj.matchScore;
          if (!info) return;

          const st = (info.state || "").toLowerCase();
          const fs = (info.status || "").toLowerCase();
          let cat = "live";
          if (st === "preview" || st === "upcoming") cat = "upcoming";
          else if (st === "complete" || st === "recent" || fs.includes("won") || fs.includes("drawn") || fs.includes("tied") || fs.includes("abandoned") || fs.includes("no result")) cat = "recent";

          const scoreArr = [];
          if (score) {
            ["team1Score", "team2Score"].forEach((k, ki) => {
              const team = ki === 0 ? info.team1 : info.team2;
              const ts   = score[k];
              if (ts?.inngs1) scoreArr.push({ r: ts.inngs1.runs || 0, w: ts.inngs1.wickets || 0, o: ts.inngs1.overs || 0, inning: `${team.teamSName} INN 1` });
              if (ts?.inngs2) scoreArr.push({ r: ts.inngs2.runs || 0, w: ts.inngs2.wickets || 0, o: ts.inngs2.overs || 0, inning: `${team.teamSName} INN 2` });
            });
          }

          let matchDate = new Date();
          if (info.startDate) {
            const d = new Date(Number(info.startDate));
            if (!isNaN(d)) matchDate = d;
          }

          const formatted = {
            id: info.matchId ? String(info.matchId) : String(Math.random()),
            name: info.team1 && info.team2 ? `${info.team1.teamName} vs ${info.team2.teamName}` : "Match",
            matchType: info.matchFormat || "Match",
            series: info.seriesName || s.seriesName || "",
            seriesId: info.seriesId || s.seriesId || null,
            status: info.status || info.state || "Scheduled",
            venue: info.venueInfo ? `${info.venueInfo.ground}, ${info.venueInfo.city}` : "",
            date: matchDate.toLocaleDateString(),
            dateTimeGMT: matchDate.toISOString(),
            teams: info.team1 && info.team2 ? [info.team1.teamName, info.team2.teamName] : [],
            teamInfo: info.team1 && info.team2 ? [
              { name: info.team1.teamName, shortname: info.team1.teamSName || getTeamShortName(info.team1.teamName), img: getTeamImageUrl(info.team1.teamName) },
              { name: info.team2.teamName, shortname: info.team2.teamSName || getTeamShortName(info.team2.teamName), img: getTeamImageUrl(info.team2.teamName) },
            ] : [],
            score: scoreArr,
            matchStarted: cat !== "upcoming",
            matchEnded: cat === "recent",
            source: "cricbuzz",
          };

          result[cat].push(formatted);
        });
      });
    });

    cache.set(cacheKey, result);
    console.log(`[API] cricbuzz: live=${result.live.length} recent=${result.recent.length} upcoming=${result.upcoming.length}`);
    return result;
  } catch (e) {
    console.error("[API] getAllMatches failed:", e.message);
    return result;
  }
}

// ─── ALL MATCHES: Cricbuzz first, ESPN adds competitions Cricbuzz's feed misses ──
// and covers for it when Cricbuzz fails. Duplicates are dropped in favour of the
// Cricbuzz entry (see mergeMatchLists in api/espnCricket.js).
async function getAllMatches() {
  const cached = cache.get("all-matches");
  if (cached) return cached;

  const [cb, espn] = await Promise.all([
    getCricbuzzMatches(),
    espnCricket.getEspnMatches().catch(() => ({ live: [], recent: [], upcoming: [] })),
  ]);
  // ESPN lists some matches as live with no coverage at all (no score): leave those out.
  espn.live = (espn.live || []).filter(m => m.score && m.score.length);

  const merged = espnCricket.mergeMatchLists(cb, espn);
  const time = m => new Date(m.dateTimeGMT).getTime() || 0;
  merged.upcoming.sort((a, b) => time(a) - time(b));
  merged.recent.sort((a, b) => time(b) - time(a));

  cache.set("all-matches", merged);
  console.log(`[API] allMatches: live=${merged.live.length} recent=${merged.recent.length} upcoming=${merged.upcoming.length} (cricbuzz ${cb.live.length}/${cb.recent.length}/${cb.upcoming.length})`);
  return merged;
}

// ─── CRICSHEET: head-to-head and venue records for international matches ─────
// Figures are computed from Cricsheet's open ball-by-ball data (see
// api/cricsheet.js); every response that carries them includes the attribution.

// Cricsheet only covers internationals: map the site's matchType to its format.
function cricsheetFormat(matchType) {
  const t = String(matchType || "").toUpperCase();
  if (t === "TEST") return "test";
  if (t === "ODI") return "odi";
  if (t === "T20" || t === "T20I") return "t20i";
  return null;
}
const isWomen = names => names.some(n => /\bwomen\b|\bw$/i.test(String(n || "").trim()));

async function matchHeadToHead(match) {
  const fmt = cricsheetFormat(match && match.matchType);
  const [a, b] = (match && match.teams) || [];
  if (!fmt || !a || !b) return null;
  const h2h = cricsheet.getHeadToHead(a, b, fmt, isWomen([a, b]) ? "women" : "men");
  return h2h ? { ...h2h, attribution: cricsheet.ATTRIBUTION } : null;
}

function venueRecord(venueName, matchType, teams) {
  const fmt = cricsheetFormat(matchType);
  if (!fmt || !venueName) return null;
  const v = cricsheet.getVenue(venueName);
  const stats = v && v.formats && v.formats[fmt] && v.formats[fmt][isWomen(teams || []) ? "women" : "men"];
  if (!stats || !stats.matches) return null;
  return { name: v.label || v.name, format: fmt, firstDate: v.firstDate, lastDate: v.lastDate, ...stats, attribution: cricsheet.ATTRIBUTION };
}

// ─── MATCH INFO ──────────────────────────────────────────────────────────────

async function getMatchInfo(matchId) {
  const cacheKey = `match-info-${matchId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // 1. Try the full all-matches JSON first (most accurate)
  try {
    const all = await getAllMatches();
    const every = [...all.live, ...all.recent, ...all.upcoming];
    const found = every.find(m => m.id === matchId || m.id === String(matchId));
    if (found) {
      cache.set(cacheKey, found);
      return found;
    }
  } catch (_) {}

  // 2. Fallback: scrape the individual match page
  try {
    const { data } = await axios.get(
      `https://www.cricbuzz.com/live-cricket-scores/${matchId}`,
      { headers, timeout: 12000 }
    );
    const $ = cheerio.load(data);

    const title = $(".cb-nav-hdr.cb-font-18").first().text().trim();
    const status = $(".cb-text-complete,.cb-text-live,.cb-text-stumps,.cb-text-preview").first().text().trim() || "Scheduled";
    const venueRaw = $(".cb-nav-subhdr.cb-font-12").text().trim();
    const venue = venueRaw.split(",")[0]?.replace(/^at\s+/i, "").trim() || "Venue TBA";

    const teams = [], teamInfo = [], score = [];
    const vsM = title.match(/(.+?)\s+vs\s+(.+?)(?:,|$)/i);
    if (vsM) {
      [vsM[1].trim(), vsM[2].trim()].forEach(n => {
        teams.push(n);
        teamInfo.push({ name: n, shortname: getTeamShortName(n), img: getTeamImageUrl(n) });
      });
    }

    $(".cb-col.cb-col-100.cb-ltst-wgt-hdr").each((_, el) => {
      const team = $(el).find(".cb-col-84").text().trim();
      const sc   = $(el).find(".cb-col-16").text().trim();
      if (team && sc) {
        const rm = sc.match(/(\d+)\/(\d+)/);
        const om = sc.match(/\((\d+(?:\.\d+)?)\)/);
        if (rm) score.push({ r: +rm[1], w: +rm[2], o: om ? +om[1] : 0, inning: team });
      }
    });

    let tossWinner = "", tossChoice = "";
    const tossM = $(".cb-text-preview,.cb-text-complete,.cb-text-live").text()
      .match(/(.+?)\s+won\s+the\s+toss\s+and\s+(?:chose|elected)\s+to\s+(bat|bowl)/i);
    if (tossM) { tossWinner = tossM[1].trim(); tossChoice = tossM[2].toLowerCase(); }

    const info = {
      id: matchId, name: teams.length >= 2 ? `${teams[0]} vs ${teams[1]}` : title || "Match",
      matchType: title.split(",")[1]?.trim() || "Match",
      status, venue, date: new Date().toLocaleDateString(),
      dateTimeGMT: new Date().toISOString(),
      teams, teamInfo, score,
      matchStarted: /live|innings|stumps|need/i.test(status),
      matchEnded:   /won|drawn|tied|abandoned/i.test(status),
      tossWinner, tossChoice,
    };
    cache.set(cacheKey, info);
    return info;
  } catch (e) {
    console.error(`[API] getMatchInfo(${matchId}) failed:`, e.message);
    return { id: matchId, name: "Match", teams: [], teamInfo: [], score: [], matchStarted: false };
  }
}

// ─── SCORECARD ───────────────────────────────────────────────────────────────

async function getMatchScorecard(matchId) {
  const cacheKey = `scorecard-${matchId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data: html } = await axios.get(
      `https://www.cricbuzz.com/live-cricket-scorecard/${matchId}`,
      { headers, timeout: 12000 }
    );
    const $ = cheerio.load(html);
    const innings = [];
    let jsonExtracted = false;

    $("script").each((_, el) => {
      if (jsonExtracted) return false;
      const sc = $(el).html() || "";
      if (!sc.includes("scoreCard")) return;
      try {
        const si = sc.indexOf('\\"scoreCard\\":[');
        if (si === -1) return;
        let brackets = 0, inArr = false, ei = si + '\\"scoreCard\\":'.length;
        for (let j = ei; j < sc.length; j++) {
          if (sc[j] === "[") { brackets++; inArr = true; }
          else if (sc[j] === "]") { brackets--; if (inArr && brackets === 0) { ei = j + 1; break; } }
        }
        let json = sc.substring(si + '\\"scoreCard\\":'.length, ei).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
        const data = JSON.parse(json);

        data.forEach(inn => {
          if (!inn.batTeamDetails?.batsmenData) return;
          const batsmen = Object.values(inn.batTeamDetails.batsmenData)
            .filter(b => b.batName)
            .map(b => ({
              name: b.batName,
              dismissal: b.outDesc || "not out",
              r: String(b.runs || 0), b: String(b.balls || 0),
              fours: String(b.fours || 0), sixes: String(b.sixes || 0),
              sr: b.strikeRate ? b.strikeRate.toFixed(2) : "0.00",
            }));

          const bowlers = inn.bowlTeamDetails?.bowlersData
            ? Object.values(inn.bowlTeamDetails.bowlersData)
                .filter(b => b.bowlName)
                .map(b => ({
                  name: b.bowlName,
                  o: String(b.overs || 0), m: String(b.maidens || 0),
                  r: String(b.runs || 0), w: String(b.wickets || 0),
                  eco: b.economy ? b.economy.toFixed(2) : "0.00",
                }))
            : [];

          // Fall of wickets (ordered by wicket number)
          const fow = inn.wicketsData
            ? Object.values(inn.wicketsData)
                .sort((a, b) => (a.wktNbr || 0) - (b.wktNbr || 0))
                .map(w => `${w.wktRuns}-${w.wktNbr} (${w.batName}, ${w.wktOver} ov)`)
            : [];

          // Partnerships
          const partnerships = inn.partnershipsData
            ? Object.values(inn.partnershipsData).map(p => ({
                batsman1: p.bat1Name, batsman2: p.bat2Name,
                runs: String(p.totalRuns ?? 0), balls: String(p.totalBalls ?? 0),
              }))
            : [];

          // Full extras breakdown
          const ex = inn.extrasData || {};
          const extrasBreakdown = `b ${ex.byes || 0}, lb ${ex.legByes || 0}, w ${ex.wides || 0}, nb ${ex.noBalls || 0}, p ${ex.penalty || 0}`;

          const sd = inn.scoreDetails || {};
          const oversStr = sd.overs ? ` (${sd.overs} Ov)` : "";

          innings.push({
            team: inn.batTeamDetails.batTeamName || "Team",
            score: `${sd.runs || 0}/${sd.wickets || 0}${oversStr}`,
            overs: String(sd.overs || ""),
            runRate: sd.runRate ? String(sd.runRate) : "",
            batsmen, bowlers,
            extras: `${ex.total || 0} (${extrasBreakdown})`,
            partnerships,
            fow,
          });
        });
        jsonExtracted = true;
      } catch (_) {}
    });

    // HTML fallback
    if (!jsonExtracted) {
      ["1","2","3","4"].forEach(num => {
        const div = $(`#innings_${num}`);
        if (!div.length) return;
        const teamName = div.find(".cb-scrd-hdr-rw .cb-col-84").first().text().split("Innings")[0].trim();
        const score    = div.find(".cb-scrd-hdr-rw .cb-col-16").first().text().trim();

        const batsmen = [];
        div.find(".cb-scrd-itms").each((_, row) => {
          const $r = $(row);
          const name = $r.find("a.cb-text-link").first().text().trim();
          if (!name || name.includes("Extras") || name.includes("Total")) return;
          const cols = $r.find(".cb-col-8");
          batsmen.push({
            name,
            dismissal: $r.find(".text-gray").first().text().trim() || "not out",
            r: $(cols[0]).text().trim() || "0",
            b: $(cols[1]).text().trim() || "0",
            fours: $(cols[2]).text().trim() || "0",
            sixes: $(cols[3]).text().trim() || "0",
            sr: $(cols[4]).text().trim() || "0.00",
          });
        });

        const bowlers = [];
        div.find(".cb-ltst-wgt-hdr:contains('Bowling')").parent().find(".cb-scrd-itms").each((_, row) => {
          const $r = $(row);
          const name = $r.find("a.cb-text-link").first().text().trim();
          if (!name) return;
          const cols = $r.find(".cb-col-8");
          bowlers.push({ name, o: $(cols[0]).text().trim()||"0", m: $(cols[1]).text().trim()||"0", r: $(cols[2]).text().trim()||"0", w: $(cols[3]).text().trim()||"0", eco: $(cols[4]).text().trim()||"0.00" });
        });

        if (batsmen.length) innings.push({ team: teamName, score, batsmen, bowlers, extras: "0", fow: [] });
      });
    }

    const result = { innings };
    cache.set(cacheKey, result);
    console.log(`[API] Scorecard(${matchId}): ${innings.length} innings (JSON:${jsonExtracted})`);
    return result;
  } catch (e) {
    console.error(`[API] getMatchScorecard(${matchId}) failed:`, e.message);
    return { innings: [] };
  }
}

// ─── COMMENTARY ──────────────────────────────────────────────────────────────

async function getMatchCommentary(matchId) {
  const cacheKey = `commentary-${matchId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data: html } = await axios.get(
      `https://www.cricbuzz.com/live-cricket-scorecard/${matchId}`,
      { headers, timeout: 12000 }
    );
    const $ = cheerio.load(html);
    const commentary = [];
    let found = false;

    $("script").each((_, el) => {
      if (found) return false;
      const sc = $(el).html() || "";
      if (!sc.includes('"commentaryList"')) return;
      try {
        const si = sc.indexOf('\\"commentaryList\\":[');
        if (si === -1) return;
        let brackets = 0, inArr = false, ei = si + '\\"commentaryList\\":'.length;
        for (let j = ei; j < sc.length; j++) {
          if (sc[j] === "[") { brackets++; inArr = true; }
          else if (sc[j] === "]") { brackets--; if (inArr && brackets === 0) { ei = j + 1; break; } }
        }
        let json = sc.substring(si + '\\"commentaryList\\":'.length, ei).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
        const list = JSON.parse(json);
        list.forEach(c => {
          if (c.commText) {
            commentary.push({
              over: c.overNumber ?? c.overNum ?? "",
              ball: c.ballNbr ?? "",
              event: c.event || "default",
              text: c.commText || "",
              batsmanStriker: c.batsmanStriker?.batName || "",
              bowlerStriker: c.bowlerStriker?.bowlName || "",
              runs: c.runs || 0,
            });
          }
        });
        found = true;
      } catch (_) {}
    });

    cache.set(cacheKey, commentary);
    return commentary;
  } catch (e) {
    console.error(`[API] getMatchCommentary(${matchId}) failed:`, e.message);
    return [];
  }
}

// ─── NEWS ────────────────────────────────────────────────────────────────────

async function getNews() {
  const cached = cache.get("news");
  if (cached) return cached;
  try {
    const { data } = await axios.get(
      // Broad query — over-specific queries surface only stale stories,
      // which the freshness cutoff then filters to zero.
      "https://news.google.com/rss/search?q=cricket&hl=en-IN&gl=IN&ceid=IN:en",
      { timeout: 10000 }
    );
    const $ = cheerio.load(data, { xmlMode: true });
    const news = [];
    const now = new Date();
    const cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);
    $("item").each((i, el) => {
      if (i >= 50) return false;
      const pub = new Date($(el).find("pubDate").text());
      if (pub < cutoff) return;
      news.push({
        id: $(el).find("link").text(),
        title: $(el).find("title").text(),
        description: $(el).find("description").text().replace(/<[^>]*>/gm, "").split(" - ")[0],
        date: pub.toLocaleDateString(),
        source: $(el).find("source").text() || "Google News",
        url: $(el).find("link").text(),
        publishedAt: pub.toISOString(),
        hoursAgo: Math.floor((now - pub) / 3600000),
      });
    });
    news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    cache.set("news", news);
    return news;
  } catch (e) {
    console.error("[API] getNews failed:", e.message);
    return [];
  }
}

// ─── STATIC META: SITEMAP, RSS, ROBOTS, ADS.TXT ───────────────────────────────

const { STATIC_ROUTES, ROUTE_REDIRECTS } = require("../client/src/content/routeMeta");
const { GUIDES } = require("../client/src/content/guides");
const { TOOLS } = require("../client/src/content/tools");
const { retiredArticleTarget } = require("../client/src/content/retiredArticles");
const { renderPage, isNoindex } = require("./render");

const xmlEscape = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// "17 September 2026" → "2026-09-17"
function isoDate(human) {
  const d = new Date(`${human} UTC`);
  return isNaN(d) ? null : d.toISOString().split("T")[0];
}

const EMPTY_URLSET = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;

function serveMeta(url, res, req) {
  const reqPath = [
    url,
    req?.headers?.["x-matched-path"],
    req?.headers?.["x-forwarded-uri"],
    req?.headers?.["x-original-url"],
    req?.headers?.["x-invoke-path"],
  ].filter(Boolean).join(" ");

  const base = "https://www.livecricketzone.com";

  // The news and video sitemaps listed retired articles and pages without
  // real video files. Kept as valid empty sitemaps in case Search Console
  // still has them registered.
  if (reqPath.includes("sitemap-news.xml") || reqPath.includes("sitemap-videos.xml")) {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=86400");
    res.status(200).send(EMPTY_URLSET);
    return true;
  }

  // Main sitemap: every indexable static route (which includes /guides and
  // /tools), plus every guide and every calculator page.
  if (reqPath.includes("sitemap.xml") || reqPath.includes("sitemap-main.xml")) {
    const pages = Object.keys(STATIC_ROUTES)
      .filter(p => !isNoindex(p))
      .map(p => `  <url><loc>${base}${p}</loc></url>`);
    const guides = GUIDES.map(g => {
      const lastmod = isoDate(g.reviewed);
      return `  <url><loc>${base}/guides/${g.slug}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
    });
    const tools = TOOLS.map(t => `  <url><loc>${base}/tools/${t.slug}</loc></url>`);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=300");
    res.status(200).send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.concat(guides, tools).join("\n")}\n</urlset>`
    );
    return true;
  }

  // RSS: the guides library.
  if (reqPath.includes("rss.xml") || reqPath.includes("feed.xml")) {
    const items = GUIDES.map(g => {
      const date = isoDate(g.reviewed);
      return `
    <item>
      <title>${xmlEscape(g.title)}</title>
      <link>${base}/guides/${g.slug}</link>
      <guid>${base}/guides/${g.slug}</guid>${date ? `\n      <pubDate>${new Date(date).toUTCString()}</pubDate>` : ""}
      <description>${xmlEscape(g.description)}</description>
      <category>${xmlEscape(g.category)}</category>
    </item>`;
    }).join("");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=300");
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Live Cricket Zone Guides</title>
    <link>${base}/guides</link>
    <description>Plain-English guides to how cricket works: scorecards, DLS, net run rate, DRS, rankings and competitions.</description>
    <language>en</language>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`);
    return true;
  }

  if (reqPath.includes("robots.txt")) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=86400");
    res.status(200).send(
      "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /*?*utm_source=\nDisallow: /*?*sessionid=\nDisallow: /*?*fbclid=\n\n" +
      "Sitemap: https://www.livecricketzone.com/sitemap.xml\n"
    );
    return true;
  }

  if (reqPath.includes("ads.txt")) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.status(200).send("google.com, pub-8179151029580359, DIRECT, f08c47fec0942fa0\n");
    return true;
  }

  return false;
}

// Old and alias URLs get a permanent redirect to their one canonical page.
function redirectTarget(pathname) {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (ROUTE_REDIRECTS[p]) return ROUTE_REDIRECTS[p];
  const news = p.match(/^\/news\/([^/]+)$/);
  if (news) return retiredArticleTarget(news[1]);
  return null;
}

// ─── MAIN VERCEL HANDLER ─────────────────────────────────────────────────────

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (serveMeta(req.url || "", res, req)) return;

  // ── Page requests: one response for every visitor (see api/render.js) ──
  let pathname = "/";
  try {
    pathname = new URL(req.url, `http://${req.headers.host || "localhost"}`).pathname;
  } catch (_) {
    pathname = (req.url || "/").split("?")[0];
  }

  if (!pathname.startsWith("/api/") && !pathname.includes(".")) {
    const target = redirectTarget(pathname);
    if (target) {
      res.setHeader("Location", target);
      res.setHeader("Cache-Control", "s-maxage=86400");
      return res.status(301).end();
    }
    const page = renderPage(pathname);
    if (!page) {
      return res.status(503).send("The site build is missing. Run the client build first.");
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    if (page.noindex) res.setHeader("X-Robots-Tag", "noindex, follow");
    return res.status(page.status).send(page.html);
  }

  // ── Parse path for API routes ─────────────────────────────────────────────
  let path = "";
  try {
    const u = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    path = u.pathname.replace(/^\/api\//, "").replace(/^\/+|\/+$/g, "");
  } catch (_) {
    path = (req.url || "").split("?")[0].replace(/^\/api\//, "").replace(/^\/+|\/+$/g, "");
  }
  const parts = path.split("/").filter(Boolean);

  try {
    // ── Health ──────────────────────────────────────────────────────────────
    if (path === "health") {
      return res.json({ status: "ok", mode: "Vercel Serverless", timestamp: new Date().toISOString(), version: "3.0.0" });
    }

    // ── News ────────────────────────────────────────────────────────────────
    if (path === "news") {
      const data = await getNews();
      return res.json({ status: "success", data });
    }

    // ── Other sports (football, basketball, tennis) ──────────────────────────
    if (parts[0] === "sports" && parts[1] && (parts[2] === "matches" || parts[2] === "news")) {
      const sport = parts[1];
      if (!multiSport.SPORT_LEAGUES[sport]) {
        return res.status(404).json({ status: "error", message: `Unsupported sport: ${sport}` });
      }
      const data = parts[2] === "matches"
        ? await multiSport.getSportMatches(sport)
        : await multiSport.getSportNews(sport);
      // Cache at the CDN edge. On serverless each cold instance starts with an
      // empty in-process cache, so without this every instance re-fans-out to
      // ESPN (18 leagues) and trips its rate limiter.
      res.setHeader("Cache-Control", parts[2] === "matches"
        ? "s-maxage=120, stale-while-revalidate=600"
        : "s-maxage=1800, stale-while-revalidate=3600");
      return res.json({ status: "success", data });
    }

    // ── All matches ─────────────────────────────────────────────────────────
    if (path === "matches/all") {
      const data = await getAllMatches();
      return res.json({ status: "success", data });
    }

    // ── IPL points table ──────────────────────────────────────────────────────
    if (path === "matches/standings") {
      const data = await scraper.scrapeIPLStandings();
      return res.json({ status: "success", data });
    }

    // ── Live matches (SSE Stream & standard) ────────────────────────────────
    if (path === "matches/live-stream") {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Access-Control-Allow-Origin", "*");
      const all = await getAllMatches();
      res.write(`data: ${JSON.stringify(all)}\n\n`);
      return res.end();
    }

    if (path === "matches/live" || path === "matches/current") {
      const all = await getAllMatches();
      return res.json({ status: "success", data: all.live });
    }

    // ── Upcoming matches ────────────────────────────────────────────────────
    if (path === "matches/upcoming") {
      const all = await getAllMatches();
      return res.json({ status: "success", data: all.upcoming });
    }

    // ── Schedule (upcoming grouped by date + series; client reads response.schedules) ──
    if (path === "matches/schedule") {
      const all = await getAllMatches();
      const byDate = new Map();
      (all.upcoming || []).forEach(m => {
        const d = m.dateTimeGMT ? new Date(m.dateTimeGMT) : null;
        const dateKey = d && !isNaN(d) ? d.toDateString() : (m.date || "Upcoming");
        if (!byDate.has(dateKey)) byDate.set(dateKey, new Map());
        const bySeries = byDate.get(dateKey);
        const sName = m.series || m.matchType || "Cricket";
        if (!bySeries.has(sName)) bySeries.set(sName, []);
        const [ground, city] = (m.venue || "").split(",").map(x => x.trim());
        bySeries.get(sName).push({
          matchId: m.id,
          team1: { teamName: m.teams?.[0] || m.teamInfo?.[0]?.name || "TBA" },
          team2: { teamName: m.teams?.[1] || m.teamInfo?.[1]?.name || "TBA" },
          matchDesc: m.status || m.matchType || "",
          matchFormat: m.matchType || "",
          startDate: d && !isNaN(d) ? String(d.getTime()) : "",
          venueInfo: { ground: ground || "", city: city || "" },
        });
      });
      const schedules = [];
      byDate.forEach((bySeries, dateKey) => {
        schedules.push({
          scheduleAdWrapper: {
            date: dateKey,
            matchScheduleList: [...bySeries.entries()].map(([seriesName, matchInfo]) => ({ seriesName, matchInfo })),
          },
        });
      });
      return res.json({ status: "success", response: { schedules } });
    }

    // ── ESPN matches (ids "espn-<league>-<event>") ──────────────────────────
    if (parts[0] === "matches" && /^espn-\d+-\d+$/.test(parts[1] || "")) {
      const sm = await espnCricket.getEspnMatchSummary(null, parts[1]);
      const sub = parts[2] || "";
      let data = null;
      if (sm) {
        if (!sub) data = espnCricket.summaryToMatchInfo(sm);
        else if (sub === "scorecard") data = espnCricket.summaryToScorecard(sm);
        else if (sub === "commentary") data = espnCricket.summaryToCommentary(sm);
        else if (sub === "score") data = espnCricket.summaryToMatchInfo(sm).score;
        else if (sub === "info") {
          data = espnCricket.summaryToInfoTab(sm);
          data.venueRecord = venueRecord(sm.venue, sm.matchType, (sm.teams || []).map(t => t.name));
        }
        else if (sub === "h2h") data = await matchHeadToHead(espnCricket.summaryToMatchInfo(sm));
      }
      // Tabs ESPN has no data for (live-data, overs, squad) get an empty answer.
      if (data == null) data = ["commentary", "overs"].includes(sub) ? [] : null;
      return res.json({ status: "success", data });
    }

    // ── Match commentary ─────────────────────────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "commentary") {
      let data = await scraper.scrapeCommentary(parts[1]);
      if (!data || !data.length) data = await getMatchCommentary(parts[1]);
      return res.json({ status: "success", data });
    }

    // ── Match scorecard ──────────────────────────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "scorecard") {
      let data = await scraper.scrapeScorecard(parts[1]);
      if (!data || !data.innings || !data.innings.length) {
        data = await getMatchScorecard(parts[1]);
      }
      return res.json({ status: "success", data });
    }

    // ── Match score (live minimal) ───────────────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "score") {
      const info = await getMatchInfo(parts[1]);
      return res.json({ status: "success", data: info.score || [] });
    }

    // ── Match live-data (batsmen, bowler, partnership, RRR) ───────────────────
    if (parts[0] === "matches" && parts[2] === "live-data") {
      const data = await scraper.scrapeMatchLiveData(parts[1]);
      return res.json({ status: "success", data });
    }

    // ── Match squad / playing XI ─────────────────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "squad") {
      const data = await scraper.scrapeMatchSquad(parts[1]);
      return res.json({ status: "success", data });
    }

    // ── Match recent overs (latest 10 from Cricbuzz) ─────────────────────────
    if (parts[0] === "matches" && parts[2] === "overs") {
      const data = await scraper.scrapeMatchOvers(parts[1]);
      return res.json({ status: "success", data });
    }

    // ── Match info: toss, officials, venue ──────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "info") {
      const data = await scraper.scrapeMatchInfoFull(parts[1]);
      if (data) {
        const match = await getMatchInfo(parts[1]);
        data.venueRecord = venueRecord(data.venue && data.venue.fullName, data.matchType || match.matchType, match.teams);
      }
      return res.json({ status: "success", data });
    }

    // ── Match head-to-head ───────────────────────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "h2h") {
      const data = await matchHeadToHead(await getMatchInfo(parts[1]));
      return res.json({ status: "success", data });
    }

    // ── Match info ───────────────────────────────────────────────────────────
    if (parts[0] === "matches" && parts[1] && !parts[2]) {
      const data = await getMatchInfo(parts[1]);
      return res.json({ status: "success", data });
    }

    // ── Rankings (ICC) ────────────────────────────────────────────────────────
    if (parts[0] === "rankings") {
      const type = qp(req, "type") || "batting";
      const format = qp(req, "format") || "tests";
      const category = qp(req, "category") || "men";
      const arr = await scraper.scrapeCricbuzzRankings(category, type, format);
      return res.json({ status: true, response: Array.isArray(arr) ? arr : [] });
    }

    // ── Teams ───────────────────────────────────────────────────────────────
    if (parts[0] === "teams" && parts[1]) {
      const data = await scraper.scrapeTeamDetail(parts[1]);
      return res.json({ status: "success", data });
    }
    if (parts[0] === "teams") {
      const data = await scraper.scrapeCricbuzzTeams();
      return res.json({ status: true, response: data });
    }

    // ── Series ──────────────────────────────────────────────────────────────
    if (parts[0] === "series" && parts[1] === "archive" && parts[2]) {
      const data = await scraper.scrapeSeriesArchive(parts[2]);
      return res.json({ status: "success", data });
    }
    if (parts[0] === "series" && parts[1] && parts[2] === "schedule") {
      const data = await scraper.scrapeSeriesSchedule(parts[1]);
      return res.json({ status: "success", data });
    }
    if (parts[0] === "series" && parts[1] && parts[2] === "standings") {
      const data = await scraper.scrapeSeriesStandings(parts[1]);
      return res.json({ status: "success", data });
    }
    if (parts[0] === "series" && parts[1] && parts[2] === "stats") {
      const data = await scraper.scrapeSeriesStats(parts[1]);
      return res.json({ status: "success", data });
    }
    if (parts[0] === "series" && parts[1] && !parts[2]) {
      const [schedule, standings, stats] = await Promise.allSettled([
        scraper.scrapeSeriesSchedule(parts[1]),
        scraper.scrapeSeriesStandings(parts[1]),
        scraper.scrapeSeriesStats(parts[1]),
      ]);
      return res.json({ status: "success", data: {
        schedule:  schedule.status  === "fulfilled" ? schedule.value  : [],
        standings: standings.status === "fulfilled" ? standings.value : [],
        stats:     stats.status     === "fulfilled" ? stats.value     : { batting: [], bowling: [] },
      }});
    }
    if (parts[0] === "series") {
      const data = await scraper.scrapeCricbuzzSeries();
      return res.json({ status: "success", data });
    }

    // ── Players ───────────────────────────────────────────────────────────────
    if (parts[0] === "players" && parts[1]) {
      const data = await scraper.scrapePlayerDetails(parts[1]);
      if (!data) return res.status(404).json({ error: "Player not found" });
      return res.json({ status: "success", data });
    }
    if (parts[0] === "players") {
      const query = qp(req, "search") || "virat";
      const data = await scraper.searchPlayers(query);
      return res.json({ status: "success", data });
    }

    // ── Records computed from Cricsheet (replaces a hard-coded list) ─────────
    if (parts[0] === "stats") {
      const format = ["test", "odi", "t20i"].includes(qp(req, "format")) ? qp(req, "format") : "test";
      const gender = qp(req, "gender") === "women" ? "women" : "men";
      const records = cricsheet.getRecords(format, gender);
      res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
      return res.json({ status: "success", data: records ? { ...records, attribution: cricsheet.ATTRIBUTION } : null });
    }

    // ── Venue info ──────────────────────────────────────────────────────────
    if (parts[0] === "venues" && parts[1]) {
      const data = await scraper.scrapeVenueInfo(parts[1]);
      if (!data) return res.status(404).json({ error: "Venue not found" });
      return res.json({ status: "success", data });
    }

    // ── Detailed schedule (by type/month/year) ───────────────────────────────
    if (path === "schedule") {
      const type = qp(req, "type") || "international";
      const month = qp(req, "month");
      const year = qp(req, "year") || 2026;
      const data = await scraper.scrapeDetailedSchedule(type, month, year);
      return res.json({ status: "success", data });
    }

    // ── IndexNow submit-all & Search Engine Ping ────────────────────────────
    if (path === "indexnow/submit-all") {
      const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";
      const base = "https://www.livecricketzone.com";
      const urls = [
        `${base}/`, `${base}/live`, `${base}/ipl`, `${base}/t20-world-cup`,
        `${base}/champions-trophy`, `${base}/asia-cup`, `${base}/world-cup`,
        `${base}/county-championship`, `${base}/county-cricket`, `${base}/womens-cricket`,
        `${base}/t20`, `${base}/odi`, `${base}/test`,
        `${base}/psl`, `${base}/bbl`, `${base}/cpl`, `${base}/bpl`,
        `${base}/schedule`, `${base}/upcoming`, `${base}/results`,
        `${base}/news`, `${base}/rankings`, `${base}/stats`,
        `${base}/series`, `${base}/teams`, `${base}/players`,
        `${base}/fantasy`, `${base}/watch-live`, `${base}/videos`,
        `${base}/football`, `${base}/basketball`, `${base}/tennis`,
        `${base}/cricket-website`, `${base}/about`,
        `${base}/news/ipl-2026-auction-tactical-breakdown`,
        `${base}/news/world-test-championship-2026-standings`,
        `${base}/news/t20-world-cup-powerplay-batting-trends`,
      ];
      try {
        const [indexNowRes, bingRes] = await Promise.allSettled([
          fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ host: "www.livecricketzone.com", key: INDEXNOW_KEY, keyLocation: `${base}/${INDEXNOW_KEY}.txt`, urlList: urls }),
          }),
          fetch("https://www.bing.com/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ host: "www.livecricketzone.com", key: INDEXNOW_KEY, keyLocation: `${base}/${INDEXNOW_KEY}.txt`, urlList: urls }),
          })
        ]);
        return res.json({
          status: "success",
          indexnow: indexNowRes.status === "fulfilled" ? indexNowRes.value.status : "failed",
          bing: bingRes.status === "fulfilled" ? bingRes.value.status : "failed",
          count: urls.length,
          urls
        });
      } catch (e) {
        return res.json({ status: "error", message: e.message });
      }
    }

    // ── YouTube search ───────────────────────────────────────────────────────
    if (path === "youtube/search") {
      const q = new URL(req.url, `http://${req.headers.host || "localhost"}`).searchParams.get("q");
      if (!q) return res.status(400).json({ error: "Missing query" });
      const cacheKey = `yt-${q}`;
      const ytCached = cache.get(cacheKey);
      if (ytCached) return res.json(ytCached);
      try {
        // Plain search (no live filter). Only official-channel HIGHLIGHTS are returned.
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
        const { data: ytHtml } = await axios.get(searchUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "Accept-Language": "en-US,en;q=0.9" },
          timeout: 10000,
        });
        const ytMatch = ytHtml.match(/var ytInitialData = ({.+?});<\/script>/s);
        if (!ytMatch) throw new Error("ytInitialData not found");
        const ytData = JSON.parse(ytMatch[1]);
        const contents = ytData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
        const OFFICIAL_CHANNELS = [
          "ipl", "bcci", "icc", "star sports", "sony sports", "sony liv", "sony ten",
          "jiocinema", "jiohotstar", "sky sports cricket", "cricket australia",
          "ecb", "england cricket", "pcb", "pakistan cricket", "cricket west indies",
          "sri lanka cricket", "bangladesh cricket", "willow", "espncricinfo", "espn cricinfo",
        ];
        const isOfficial = (c = "") => OFFICIAL_CHANNELS.some(n => c.toLowerCase().includes(n));
        const videos = [];
        for (const item of contents) {
          const vr = item.videoRenderer;
          if (!vr?.videoId) continue;
          const isLive = !!vr.badges?.some(b => b.metadataBadgeRenderer?.label === "LIVE");
          if (isLive) continue; // never surface live rebroadcasts
          const channel = vr.ownerText?.runs?.[0]?.text || "";
          if (!isOfficial(channel)) continue; // official highlights only
          videos.push({
            videoId: vr.videoId,
            title: vr.title?.runs?.[0]?.text || "",
            thumbnail: `https://img.youtube.com/vi/${vr.videoId}/mqdefault.jpg`,
            isLive: false,
            channel,
          });
          if (videos.length >= 6) break;
        }
        const ytResult = { videos };
        cache.set(cacheKey, ytResult, 600);
        return res.json(ytResult);
      } catch (e) {
        return res.json({ videos: [], error: e.message });
      }
    }

    // ── Kachuful Multiplayer Room Routes ──────────────────────────────────────
    if (parts[0] === "games" && parts[1] === "kachuful" && parts[2] === "rooms") {
      let body = {};
      if (req.body && typeof req.body === "object") body = req.body;
      else if (req.body && typeof req.body === "string") {
        try { body = JSON.parse(req.body); } catch (_) {}
      }

      const roomId = parts[3];
      const subAction = parts[4];
      const playerName = qp(req, "player") || body.player || body.playerName || "Player";

      // POST /api/games/kachuful/rooms (Create or Join)
      if (!roomId && req.method === "POST") {
        if (body.action === "create") {
          const room = kachufulEngine.createRoom(body.hostName || "Host");
          return res.json({ status: "success", room });
        }
        if (body.action === "join") {
          const result = kachufulEngine.joinRoom(body.roomId, body.playerName);
          if (result.error) return res.status(400).json({ status: "error", message: result.error });
          return res.json({ status: "success", room: result.room, assignedName: result.assignedName });
        }
      }

      // Room actions
      if (roomId) {
        if (subAction === "action" && req.method === "POST") {
          let result;
          if (body.action === "start") {
            result = kachufulEngine.startMatch(roomId, playerName);
          } else if (body.action === "bid") {
            result = kachufulEngine.submitBid(roomId, playerName, body.bid);
          } else if (body.action === "play_card") {
            result = kachufulEngine.playCard(roomId, playerName, body.cardId);
          } else if (body.action === "next_round") {
            result = kachufulEngine.nextRound(roomId);
          } else if (body.action === "reaction") {
            result = kachufulEngine.addReaction(roomId, playerName, body.emoji);
          }
          if (result?.error) return res.status(400).json({ status: "error", message: result.error });
          const sanitized = kachufulEngine.getSanitizedRoom(roomId, playerName);
          return res.json({ status: "success", room: sanitized });
        }

        // GET room state
        const sanitized = kachufulEngine.getSanitizedRoom(roomId, playerName);
        if (!sanitized) return res.status(404).json({ status: "error", message: "Room not found" });
        return res.json({ status: "success", room: sanitized });
      }
    }

    // ── Fallback ─────────────────────────────────────────────────────────────
    console.log(`[API] Unhandled route: /${path}`);
    return res.json({ status: "success", data: [], path });

  } catch (err) {
    console.error(`[API] Error on /${path}:`, err.message);
    return res.status(500).json({ status: "error", message: err.message });
  }
};
