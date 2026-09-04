const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");
const scraper = require("./scraper");
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

async function getAllMatches() {
  const cacheKey = "all-matches";
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
    console.log(`[API] allMatches: live=${result.live.length} recent=${result.recent.length} upcoming=${result.upcoming.length}`);
    return result;
  } catch (e) {
    console.error("[API] getAllMatches failed:", e.message);
    return result;
  }
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

// ─── ORIGINAL ARTICLES DATA FOR SEO & BOT RENDERING ───────────────────────
const { ORIGINAL_ARTICLES } = require("./articlesData");

// ─── STATIC META & MULTI-SITEMAP ENGINE ───────────────────────────────────────

function serveMeta(url, res, req) {
  const reqPath = [
    url,
    req?.headers?.["x-matched-path"],
    req?.headers?.["x-forwarded-uri"],
    req?.headers?.["x-original-url"],
    req?.headers?.["x-invoke-path"],
  ].filter(Boolean).join(" ");

  const base = "https://www.livecricketzone.com";
  const now = new Date().toISOString().split("T")[0];

  const articlePages = ORIGINAL_ARTICLES.map(a => ({
    loc: `/news/${a.id}`,
    pri: "0.75",
    freq: "monthly"
  }));

  const CORE_PAGES = [
    { loc: "/",                        pri: "1.0",  freq: "always"  },
    { loc: "/live",                    pri: "1.0",  freq: "always"  },
    { loc: "/ipl",                     pri: "0.98", freq: "hourly"  },
    { loc: "/t20-world-cup",           pri: "0.95", freq: "hourly"  },
    { loc: "/champions-trophy",        pri: "0.95", freq: "hourly"  },
    { loc: "/asia-cup",                pri: "0.95", freq: "hourly"  },
    { loc: "/world-cup",               pri: "0.95", freq: "hourly"  },
    { loc: "/womens-cricket",          pri: "0.90", freq: "hourly"  },
    { loc: "/county-championship",     pri: "0.95", freq: "hourly"  },
    { loc: "/county-cricket",          pri: "0.92", freq: "hourly"  },
    { loc: "/t20",                     pri: "0.90", freq: "hourly"  },
    { loc: "/odi",                     pri: "0.90", freq: "hourly"  },
    { loc: "/test",                    pri: "0.90", freq: "hourly"  },
    { loc: "/psl",                     pri: "0.90", freq: "hourly"  },
    { loc: "/bbl",                     pri: "0.85", freq: "hourly"  },
    { loc: "/cpl",                     pri: "0.85", freq: "hourly"  },
    { loc: "/bpl",                     pri: "0.85", freq: "hourly"  },
    { loc: "/schedule",                pri: "0.90", freq: "hourly"  },
    { loc: "/upcoming",                pri: "0.90", freq: "hourly"  },
    { loc: "/results",                 pri: "0.85", freq: "hourly"  },
    { loc: "/news",                    pri: "0.90", freq: "hourly"  },
    { loc: "/rankings",                pri: "0.85", freq: "daily"   },
    { loc: "/stats",                   pri: "0.80", freq: "daily"   },
    { loc: "/series",                  pri: "0.80", freq: "daily"   },
    { loc: "/teams",                   pri: "0.75", freq: "weekly"  },
    { loc: "/players",                 pri: "0.80", freq: "daily"   },
    { loc: "/fantasy",                 pri: "0.80", freq: "daily"   },
    { loc: "/watch-live",              pri: "0.75", freq: "hourly"  },
    { loc: "/videos",                  pri: "0.70", freq: "daily"   },
    { loc: "/football",                pri: "0.85", freq: "hourly"  },
    { loc: "/basketball",              pri: "0.85", freq: "hourly"  },
    { loc: "/tennis",                  pri: "0.85", freq: "hourly"  },
    { loc: "/cricket-website",         pri: "0.75", freq: "weekly"  },
    { loc: "/games",                   pri: "0.85", freq: "weekly"  },
    { loc: "/about",                   pri: "0.60", freq: "monthly" },
    { loc: "/contact",                 pri: "0.60", freq: "monthly" },
    { loc: "/editorial-policy",        pri: "0.60", freq: "monthly" },
    { loc: "/privacy-policy",          pri: "0.50", freq: "monthly" },
    { loc: "/terms-of-use",            pri: "0.50", freq: "monthly" },
    { loc: "/dmca-copyright",          pri: "0.50", freq: "monthly" },
    ...articlePages
  ];

  // 1. Google News Sitemap
  if (reqPath.includes("sitemap-news.xml")) {
    const articles = ORIGINAL_ARTICLES.map(a => `
  <url>
    <loc>${base}/news/${a.id}</loc>
    <news:news>
      <news:publication>
        <news:name>Live Cricket Zone</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.date}T09:00:00+05:30</news:publication_date>
      <news:title>${a.title.replace(/&/g, "&amp;")}</news:title>
    </news:news>
  </url>`).join("");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=300");
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles}
</urlset>`);
    return true;
  }

  // 2. Google Video Sitemap
  if (reqPath.includes("sitemap-videos.xml")) {
    const videoEntries = [
      {
        loc: `${base}/watch-live`,
        thumb: `${base}/og-image.png`,
        title: "Live Cricket Highlights & Official Match Recaps - Live Cricket Zone",
        desc: "Watch official cricket match highlights for IPL 2026, T20 World Cup, ODI, and Test matches from authorized broadcasters.",
        url: `${base}/watch-live`
      },
      {
        loc: `${base}/videos`,
        thumb: `${base}/og-image.png`,
        title: "Cricket Videos & Post-Match Highlights 2026",
        desc: "Official post-match highlights, player interviews, and match summaries embedded from verified YouTube channels.",
        url: `${base}/videos`
      }
    ].map(v => `
  <url>
    <loc>${v.loc}</loc>
    <video:video>
      <video:thumbnail_loc>${v.thumb}</video:thumbnail_loc>
      <video:title>${v.title.replace(/&/g, "&amp;")}</video:title>
      <video:description>${v.desc.replace(/&/g, "&amp;")}</video:description>
      <video:player_loc>${v.url}</video:player_loc>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>
  </url>`).join("");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=300");
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoEntries}
</urlset>`);
    return true;
  }

  // 3. Main Sitemap
  if (reqPath.includes("sitemap.xml") || reqPath.includes("sitemap-main.xml")) {
    const urlEntries = CORE_PAGES.map(p =>
      `  <url><loc>${base}${p.loc}</loc><changefreq>${p.freq}</changefreq><priority>${p.pri}</priority><lastmod>${now}</lastmod></url>`
    ).join("\n");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=300");
    res.status(200).send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`
    );
    return true;
  }

  // 4. RSS Feed (RSS 2.0)
  if (reqPath.includes("rss.xml") || reqPath.includes("feed.xml")) {
    const items = ORIGINAL_ARTICLES.map(a => `
    <item>
      <title>${a.title.replace(/&/g, "&amp;")}</title>
      <link>${base}/news/${a.id}</link>
      <guid>${base}/news/${a.id}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <description>${a.description.replace(/&/g, "&amp;")}</description>
      <category>${a.category}</category>
    </item>`).join("");

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=300");
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Live Cricket Zone - Live Scores, News &amp; IPL 2026</title>
    <link>${base}</link>
    <description>Fastest real-time live cricket scores, ball-by-ball commentary, IPL 2026 points table, ICC rankings, and news.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`);
    return true;
  }

  // 5. Robots.txt
  if (reqPath.includes("robots.txt")) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=86400");
    res.status(200).send(
      "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /*?*utm_source=\nDisallow: /*?*sessionid=\nDisallow: /*?*fbclid=\nCrawl-delay: 1\n\n" +
      "Host: https://www.livecricketzone.com\n\n" +
      "Sitemap: https://www.livecricketzone.com/sitemap.xml\n" +
      "Sitemap: https://www.livecricketzone.com/sitemap-news.xml\n" +
      "Sitemap: https://www.livecricketzone.com/sitemap-videos.xml\n" +
      "Sitemap: https://www.livecricketzone.com/rss.xml\n\n" +
      "User-agent: Googlebot\nAllow: /\nCrawl-delay: 0\n\n" +
      "User-agent: Googlebot-News\nAllow: /\n\n" +
      "User-agent: Googlebot-Image\nAllow: /\n\n" +
      "User-agent: Googlebot-Video\nAllow: /\n\n" +
      "User-agent: Mediapartners-Google\nAllow: /\n\n" +
      "User-agent: Bingbot\nAllow: /\nCrawl-delay: 1\n\n" +
      "User-agent: Applebot\nAllow: /\n\n" +
      "User-agent: DuckDuckBot\nAllow: /\nCrawl-delay: 1\n"
    );
    return true;
  }

  // 6. ads.txt & BingSiteAuth
  if (reqPath.includes("ads.txt")) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.status(200).send("google.com, pub-8179151029580359, DIRECT, f08c47fec0942fa0\n");
    return true;
  }
  if (reqPath.includes("BingSiteAuth.xml")) {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.status(200).send('<?xml version="1.0"?><users><user>A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6</user></users>');
    return true;
  }

  return false;
}

// ─── BOT DETECTION ───────────────────────────────────────────────────────────

const BOT_UA = /googlebot|google-inspectiontool|googlebot-news|googlebot-image|googlebot-video|mediapartners-google|adsbot-google|google-adwords|feedfetcher-google|adsense|google-adsense|headlesschrome|chrome-headless|phantomjs|puppeteer|selenium|bingbot|adidxbot|bingpreview|msnbot|yandex|yandexbot|baiduspider|duckduckbot|slurp|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|rogerbot|screaming.frog|sitebulb|lighthouse|chrome-lighthouse|pagespeed|gtmetrix|petalbot|bytespider|gptbot|claudebot|ccbot/i;

function isBot(req) {
  return BOT_UA.test(req.headers["user-agent"] || "");
}

// ─── PAGE META MAP ────────────────────────────────────────────────────────────

const BASE = "https://www.livecricketzone.com";
const SITE = "Live Cricket Zone";

function getPageMeta(pathname) {
  const p = pathname.replace(/\/$/, "") || "/";

  const map = {
    "/": {
      title: `Live Cricket Score Today — IPL 2026, T20, ODI & Test Ball-by-Ball | ${SITE}`,
      desc: "Live Cricket Zone: fastest real-time live cricket scores updated every 15 seconds. IPL 2026 points table, T20 World Cup, ball-by-ball commentary, ICC rankings, and news.",
      kw: "live cricket score, live cricket score today, IPL 2026 live score, IPL points table 2026, ball by ball commentary, live cricket match today, cricket score live",
    },
    "/live": {
      title: `Live Cricket Scores Right Now — All Ongoing Matches | ${SITE}`,
      desc: "All live cricket matches right now. Real-time ball-by-ball scores, full scorecards, toss results, partnerships, and commentary updated every 15 seconds.",
      kw: "live cricket matches, cricket live now, live cricket score now, current cricket match, live ball by ball",
    },
    "/ipl": {
      title: `IPL 2026 Points Table, Live Score & Schedule — Indian Premier League | ${SITE}`,
      desc: "IPL 2026 live points table, team standings, net run rate (NRR), today match live score, full scorecard, and complete 2026 schedule with venues.",
      kw: "IPL 2026 points table, IPL points table 2026, IPL 2026 standings, IPL live score today, IPL 2026 schedule, IPL top 4 2026, IPL scorecard",
    },
    "/t20-world-cup": {
      title: `T20 World Cup 2026 Live Score, Schedule & Points Table | ${SITE}`,
      desc: "ICC Men's T20 World Cup 2026 live scores, ball-by-ball commentary, fixtures, group standings, Super 8 points table, and official match highlights.",
      kw: "T20 World Cup 2026 live score, ICC T20 World Cup live, T20 World Cup schedule 2026, T20 World Cup points table",
    },
    "/champions-trophy": {
      title: `ICC Champions Trophy 2025 Live Score, Fixtures & Results | ${SITE}`,
      desc: "ICC Champions Trophy live score, ball-by-ball commentary, tournament schedule, points table, and match summaries for all international fixtures.",
      kw: "Champions Trophy 2025 live score, ICC Champions Trophy live, Champions Trophy live score today, Champions Trophy schedule",
    },
    "/asia-cup": {
      title: `Asia Cup 2026 Live Score — India vs Pakistan & All Fixtures | ${SITE}`,
      desc: "ACC Asia Cup 2026 live score with ball-by-ball commentary. Follow India vs Pakistan, Sri Lanka, Bangladesh, Afghanistan and Nepal in the Asia Cup.",
      kw: "Asia Cup 2026 live score, Asia Cup live score today, India vs Pakistan Asia Cup live, Asia Cup schedule 2026",
    },
    "/world-cup": {
      title: `Cricket World Cup 2027 Live Score & Schedule — ICC ODI WC | ${SITE}`,
      desc: "ICC Cricket World Cup 2027 live scores, qualifying standings, tournament schedule, points table, and ball-by-ball commentary.",
      kw: "Cricket World Cup 2027 live score, ICC World Cup live, ODI World Cup live score, Cricket World Cup schedule",
    },
    "/womens-cricket": {
      title: `Women's Cricket Live Score 2026 — ICC WT20 & WODI Matches | ${SITE}`,
      desc: "Women's cricket live scores with ball-by-ball commentary. ICC Women's T20 World Cup, WPL, Women's ODI and Test match updates.",
      kw: "women's cricket live score, ICC women's T20 World Cup live, women's cricket today, WPL live score",
    },
    "/county-championship": {
      title: `County Championship 2026 Live Score — English County Cricket | ${SITE}`,
      desc: "County Championship 2026 live scores, Division One and Division Two results, tables, and ball-by-ball coverage for Surrey, Yorkshire, Lancashire, and all 18 counties.",
      kw: "county championship 2026, county championship live score, county cricket live score, division one cricket, surrey cricket",
    },
    "/county-cricket": {
      title: `County Cricket Live Score 2026 — All County Matches | ${SITE}`,
      desc: "County cricket live scores 2026 for all County Championship Division One and Division Two matches with ball-by-ball commentary.",
      kw: "county cricket live score, county cricket 2026, county cricket today, county cricket results",
    },
    "/t20": {
      title: `T20 Cricket Live Score Today — All Domestic & International T20s | ${SITE}`,
      desc: "T20 cricket live score today. IPL 2026, T20 World Cup, PSL, BBL, CPL, BPL, Super Smash, and all international T20 matches with ball-by-ball commentary.",
      kw: "T20 cricket live score, T20 live score today, T20 cricket today, T20 matches today",
    },
    "/odi": {
      title: `ODI Cricket Live Score Today — One Day Internationals | ${SITE}`,
      desc: "ODI cricket live score today. Real-time One Day International match updates with ball-by-ball commentary and full scorecards for all bilateral series.",
      kw: "ODI cricket live score, ODI live score today, One Day International live, ODI cricket today",
    },
    "/test": {
      title: `Test Cricket Live Score Today — WTC & Bilateral Test Matches | ${SITE}`,
      desc: "Test cricket live score today. World Test Championship (WTC) matches, session reports, day-by-day scorecards, and ball-by-ball commentary.",
      kw: "Test cricket live score, Test match live score today, Test cricket today, WTC standings live",
    },
    "/psl": {
      title: `PSL 2026 Live Score — Pakistan Super League Standings & Schedule | ${SITE}`,
      desc: "PSL 2026 live score, ball-by-ball commentary, points table, schedule and results. Lahore Qalandars, Karachi Kings, Islamabad United and all teams.",
      kw: "PSL 2026 live score, Pakistan Super League live score, PSL live today, PSL scorecard, PSL points table",
    },
    "/bbl": {
      title: `BBL 2026 Live Score — Big Bash League Australia | ${SITE}`,
      desc: "BBL 2026 live score, ball-by-ball commentary, schedule, points table and results. Real-time Big Bash League cricket updates.",
      kw: "BBL 2026 live score, Big Bash League live score, BBL live today, BBL scorecard",
    },
    "/cpl": {
      title: `CPL 2026 Live Score — Caribbean Premier League | ${SITE}`,
      desc: "CPL 2026 live score, ball-by-ball commentary, schedule and results. Real-time Caribbean Premier League updates.",
      kw: "CPL 2026 live score, Caribbean Premier League live score, CPL live today",
    },
    "/bpl": {
      title: `BPL 2026 Live Score — Bangladesh Premier League | ${SITE}`,
      desc: "BPL 2026 live score, ball-by-ball commentary, schedule and results. Real-time Bangladesh Premier League updates.",
      kw: "BPL 2026 live score, Bangladesh Premier League live score, BPL live today",
    },
    "/schedule": {
      title: `Cricket Schedule 2026 — Fixtures, Match Timings & Venues | ${SITE}`,
      desc: "Cricket schedule 2026 — complete fixtures, match timings and venues. IPL 2026, T20 World Cup, ODI and Test series timetable.",
      kw: "cricket schedule 2026, cricket fixtures, upcoming cricket matches, cricket match schedule, cricket calendar 2026",
    },
    "/upcoming": {
      title: `Upcoming Cricket Matches 2026 — Match Fixtures & Dates | ${SITE}`,
      desc: "Upcoming cricket matches 2026: IPL, T20 World Cup, ODI and Test fixtures with dates, venues and start times.",
      kw: "upcoming cricket matches, cricket upcoming matches, cricket fixtures 2026, next cricket match",
    },
    "/results": {
      title: `Cricket Results & Recent Match Scorecards | ${SITE}`,
      desc: "Latest cricket match results, full scorecards, player of the match awards, and match outcome summaries for all formats.",
      kw: "cricket results, cricket match results, cricket scores today, cricket scorecard results",
    },
    "/series": {
      title: `Cricket Series 2026 — International Tours & Tournaments | ${SITE}`,
      desc: "All cricket series 2026: international bilateral tours, ICC tournaments, and domestic leagues. Full schedule and standings.",
      kw: "cricket series 2026, cricket series schedule, international cricket series, cricket tour 2026",
    },
    "/players": {
      title: `Cricket Players Directory 2026 — Stats, Career Records & Profiles | ${SITE}`,
      desc: "Cricket player profiles with batting averages, bowling records, career stats, centuries, and ICC rankings for all international and IPL stars.",
      kw: "cricket players, cricket player stats, cricket player records, cricket player profile, IPL players 2026",
    },
    "/teams": {
      title: `Cricket Teams Directory — International & IPL Franchise Profiles | ${SITE}`,
      desc: "All cricket teams: international teams (India, Australia, England, Pakistan) and IPL franchises. Squads, recent form and head-to-head records.",
      kw: "cricket teams, international cricket teams, IPL teams 2026, cricket team profiles, cricket squad",
    },
    "/rankings": {
      title: `ICC Cricket Rankings 2026 — Batsmen, Bowlers, All-Rounders & Teams | ${SITE}`,
      desc: "Latest ICC cricket rankings 2026 for Test, ODI and T20I formats. Official player rankings for batting, bowling, all-rounders, and team ratings.",
      kw: "ICC cricket rankings 2026, cricket rankings, ICC rankings batsmen, ICC rankings bowlers, ICC team rankings 2026",
    },
    "/news": {
      title: `Cricket News Today — Latest Headlines, Previews & Editorial | ${SITE}`,
      desc: "Latest cricket news today: breaking updates, match previews, team selections, IPL 2026 analysis, and T20 World Cup coverage.",
      kw: "cricket news today, latest cricket news, cricket news, IPL news 2026, cricket breaking news",
    },
    "/stats": {
      title: `Cricket Statistics & Records 2026 — Batting & Bowling Career Records | ${SITE}`,
      desc: "Cricket statistics: batting averages, highest individual scores, best bowling figures, most centuries, and career records across Test, ODI, and T20 formats.",
      kw: "cricket statistics, cricket stats, cricket records, batting average cricket, bowling figures cricket",
    },
    "/watch-live": {
      title: `Cricket Highlights & Official Match Recaps | ${SITE}`,
      desc: "Official cricket match highlights, boundary recaps, and video summaries for IPL 2026, T20 World Cup, ODI and Test cricket.",
      kw: "cricket highlights, match highlights, IPL highlights, T20 highlights, cricket video highlights",
    },
    "/videos": {
      title: `Cricket Videos & Highlights 2026 | ${SITE}`,
      desc: "Cricket videos: official match highlights and top moments for IPL 2026, T20 World Cup, ODI and Test matches.",
      kw: "cricket videos, cricket highlights, IPL highlights, T20 World Cup highlights",
    },
    "/football": {
      title: `Football Live Scores Today — Premier League, La Liga & Champions League | ${SITE}`,
      desc: "Live football scores today across the Premier League, La Liga, Serie A, Bundesliga, Ligue 1, UEFA Champions League and MLS in real time.",
      kw: "football live score, premier league live score, la liga live score, champions league live score, football scores today",
    },
    "/basketball": {
      title: `Basketball Live Scores Today — NBA & NCAA Basketball | ${SITE}`,
      desc: "Live basketball scores today for the NBA, NCAA Men's and NCAA Women's basketball, with real-time box scores and standings.",
      kw: "basketball live score, NBA live score, NBA scores today, NCAA basketball live score",
    },
    "/tennis": {
      title: `Tennis Live Scores Today — ATP & WTA Tour Matches | ${SITE}`,
      desc: "Live tennis scores today from the ATP Tour, WTA Tour, and Grand Slams with set-by-set scores and game updates.",
      kw: "tennis live score, ATP live score, WTA live score, tennis scores today, tennis results",
    },
    "/fantasy": {
      title: `Cricket Fantasy Guide 2026 — Team Strategy & Player Picks | ${SITE}`,
      desc: "Cricket fantasy team strategy, pitch reports, player matchup statistics, and captaincy recommendations for IPL 2026 and international matches.",
      kw: "cricket fantasy guide, fantasy cricket tips, IPL fantasy team, captaincy picks cricket",
    },
    "/cricket-website": {
      title: `Best Live Cricket Score Website 2026 — Live Cricket Zone | ${SITE}`,
      desc: "Why Live Cricket Zone is the fastest and most comprehensive live cricket score website. Ball-by-ball updates, scorecards, rankings and news.",
      kw: "best cricket website, live cricket score site, fast cricket score website, cricket score online",
    },
    "/games": {
      title: `Play Free Cricket & Kachuful Games Online — Live Cricket Zone Arcade | ${SITE}`,
      desc: "Play free cricket games online: Cricket Super Striker batting challenge, traditional Kachuful (Judgement) card game, Cricket Trivia quiz, and memory match puzzle for kids.",
      kw: "cricket game online, play kachuful online, kachuful card game, cricket trivia quiz, cricket games for kids, batting game",
    },
    "/about": {
      title: `About Live Cricket Zone — Real-Time Cricket Scores & Analysis | ${SITE}`,
      desc: "About Live Cricket Zone: providing real-time ball-by-ball cricket scores, IPL 2026 coverage, ICC rankings, and cricket editorial news worldwide.",
      kw: "about Live Cricket Zone, cricket live score provider, cricket news editorial",
    },
    "/contact": {
      title: `Contact Us — Live Cricket Zone Editorial & Support | ${SITE}`,
      desc: "Contact Live Cricket Zone editorial desk for feedback, score corrections, partnership inquiries, and support.",
      kw: "contact live cricket zone, cricket editorial contact, score correction",
    },
    "/editorial-policy": {
      title: `Editorial Policy & Fact-Checking Standards — Live Cricket Zone | ${SITE}`,
      desc: "Live Cricket Zone editorial policy, fact-checking methodology, corrections policy, and author qualifications.",
      kw: "editorial policy, fact checking standards, cricket journalism, live cricket zone editorial",
    },
    "/privacy-policy": {
      title: `Privacy Policy | ${SITE}`,
      desc: "Privacy policy for Live Cricket Zone detailing user privacy standards, Google AdSense DoubleClick DART cookie disclosures, and data protection.",
      kw: "privacy policy, Live Cricket Zone privacy, adsense privacy policy",
    },
    "/terms-of-use": {
      title: `Terms of Use | ${SITE}`,
      desc: "Terms of use and conditions for accessing Live Cricket Zone services.",
      kw: "terms of use, Live Cricket Zone terms",
    },
    "/dmca-copyright": {
      title: `DMCA Copyright Policy | ${SITE}`,
      desc: "DMCA copyright notice, content attribution, and copyright compliance information for Live Cricket Zone.",
      kw: "DMCA copyright, copyright policy",
    }
  };

  // Match detail pages: /match/:id
  if (p.startsWith("/match/")) {
    const slug = p.replace("/match/", "").replace(/\/scorecard$|\/live-score$/, "");
    const vsMatch = slug.match(/^(.+?)-vs-(.+?)(?:-\d+)?$/i);
    const subpage = p.endsWith("/scorecard") ? "Scorecard" : p.endsWith("/live-score") ? "Live Score" : "Live Score & Commentary";
    if (vsMatch) {
      const t1 = vsMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const t2 = vsMatch[2].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return {
        title: `${t1} vs ${t2} ${subpage} Today | ${SITE}`,
        desc: `${t1} vs ${t2} live score today with ball-by-ball commentary, full scorecard, match statistics, toss result and highlights on Live Cricket Zone.`,
        kw: `${t1} vs ${t2} live score, ${t1} vs ${t2} scorecard, ${t1} vs ${t2} commentary, cricket live score today, ball by ball`,
        canonical: `${BASE}${p}`,
      };
    }
    return {
      title: `Live Cricket Match ${subpage} Today | ${SITE}`,
      desc: "Live cricket score today, full scorecard and real-time ball-by-ball commentary, plus official post-match highlights when available.",
      kw: "live cricket score, cricket scorecard, ball by ball commentary, cricket highlights",
      canonical: `${BASE}${p}`,
    };
  }

  // News article pages: /news/:id
  if (p.startsWith("/news/")) {
    const articleId = p.replace("/news/", "");
    const foundArticle = ORIGINAL_ARTICLES.find(a => a.id === articleId);
    if (foundArticle) {
      return {
        title: `${foundArticle.title} | ${SITE}`,
        desc: foundArticle.description,
        kw: `${foundArticle.category} news, cricket analysis, ${foundArticle.title}`,
        canonical: `${BASE}${p}`,
        article: foundArticle
      };
    }
    const cleanTitle = articleId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return {
      title: `${cleanTitle} — Cricket News | ${SITE}`,
      desc: `Read the latest cricket news and analysis regarding ${cleanTitle} on Live Cricket Zone.`,
      kw: `cricket news, ${cleanTitle}`,
      canonical: `${BASE}${p}`
    };
  }

  // Series detail pages: /series/:id
  if (p.startsWith("/series/")) {
    const seriesId = p.replace("/series/", "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return {
      title: `${seriesId} 2026 Schedule, Live Scores & Standings | ${SITE}`,
      desc: `Complete schedule, match fixtures, live scorecards and points table for ${seriesId} on Live Cricket Zone.`,
      kw: `${seriesId} schedule, ${seriesId} points table, ${seriesId} live scores`,
      canonical: `${BASE}${p}`
    };
  }

  // Team detail pages: /teams/:id
  if (p.startsWith("/teams/")) {
    const teamId = p.replace("/teams/", "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return {
      title: `${teamId} Cricket Team Squad, Schedule & Live Scores | ${SITE}`,
      desc: `${teamId} cricket team profile: squad roster, upcoming fixtures, recent results, player statistics and match updates.`,
      kw: `${teamId} cricket team, ${teamId} squad, ${teamId} schedule, ${teamId} live score`,
      canonical: `${BASE}${p}`
    };
  }

  // Player detail pages: /players/:id
  if (p.startsWith("/players/")) {
    const playerId = p.replace("/players/", "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return {
      title: `${playerId} Cricket Stats, Career Records & Profile | ${SITE}`,
      desc: `${playerId} cricket statistics: career batting average, bowling figures, centuries, wickets, and ICC rankings across Test, ODI, and T20 formats.`,
      kw: `${playerId} stats, ${playerId} career records, ${playerId} batting average, ${playerId} bowling figures`,
      canonical: `${BASE}${p}`
    };
  }

  const meta = map[p] || map["/"];
  return { ...meta, canonical: `${BASE}${p}` };
}

// ─── DEEP BOT HTML RENDERER ───────────────────────────────────────────────────

function renderBotHtml(pathname, meta, context = {}) {
  const p = pathname.replace(/\/$/, "") || "/";
  const {
    liveMatches = [],
    recentMatches = [],
    upcomingMatches = [],
    iplStandings = [],
    rankings = {},
    news = [],
    matchDetail = null,
    sportMatches = { live: [], upcoming: [], recent: [] },
  } = context;

  // 1. Build JSON-LD Structured Data
  const structuredDataList = [];

  // WebSite Schema
  structuredDataList.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE,
    "alternateName": ["livecricketzone.com", "Cricket Live Zone", "Live Cricket Scores"],
    "url": BASE,
    "description": "Real-time ball-by-ball cricket scores, IPL 2026, T20 World Cup, ICC rankings, and news.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE}/players?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE,
      "url": BASE,
      "logo": { "@type": "ImageObject", "url": `${BASE}/logo192.png` }
    }
  });

  // BreadcrumbList Schema
  const breadcrumbItems = [{ "@type": "ListItem", "position": 1, "name": "Home", "item": BASE }];
  if (p !== "/") {
    const parts = p.replace(/^\/+|\/+$/g, "").split("/");
    if (parts.length === 1) {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": meta.title.split("|")[0].split("—")[0].trim(),
        "item": meta.canonical
      });
    } else {
      const parentName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace(/-/g, " ");
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": parentName,
        "item": `${BASE}/${parts[0]}`
      });
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": meta.title.split("|")[0].split("—")[0].trim(),
        "item": meta.canonical
      });
    }
  }
  structuredDataList.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  });

  // Route-Specific Structured Data
  if (p === "/" || p === "/live") {
    liveMatches.forEach(m => {
      structuredDataList.push({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": m.name || "Live Cricket Match",
        "sport": "Cricket",
        "description": `${m.name} live score. ${m.status || ""}`,
        "url": `${BASE}/match/${m.id}`,
        "eventStatus": "https://schema.org/LiveEventUpdate",
        ...(m.dateTimeGMT && { "startDate": new Date(m.dateTimeGMT).toISOString() }),
        "location": { "@type": "Place", "name": m.venue || "International Stadium" },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock", "url": `${BASE}/match/${m.id}` }
      });
    });
  } else if (p === "/ipl") {
    structuredDataList.push({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "name": "IPL 2026 — Indian Premier League",
      "sport": "Cricket",
      "startDate": "2026-03-28",
      "endDate": "2026-05-31",
      "location": { "@type": "Place", "name": "India" },
      "url": `${BASE}/ipl`,
      "description": "IPL 2026 points table, live scores, ball-by-ball commentary and standings."
    });
    structuredDataList.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "How many teams qualify for IPL 2026 playoffs?", "acceptedAnswer": { "@type": "Answer", "text": "The top 4 teams in the IPL 2026 points table qualify for the playoffs. Teams 1 & 2 contest Qualifier 1, while teams 3 & 4 contest the Eliminator." } },
        { "@type": "Question", "name": "How often is the IPL live points table updated?", "acceptedAnswer": { "@type": "Answer", "text": "Live Cricket Zone updates the IPL 2026 points table immediately following each match with live NRR calculations." } }
      ]
    });
  } else if (p === "/football" || p === "/basketball" || p === "/tennis") {
    const sportLabel = { "/football": "Football", "/basketball": "Basketball", "/tennis": "Tennis" }[p];
    // Emit SportsEvent for each match that is ALSO rendered in the visible body
    // below — structured data must describe content the page actually shows.
    const schemaMatches = [
      ...(sportMatches.live || []),
      ...(sportMatches.upcoming || []).slice(0, 12),
      ...(sportMatches.recent || []).slice(0, 8),
    ];
    schemaMatches.forEach(m => {
      const sides = (m.teams || []).filter(t => t && t.name);
      structuredDataList.push({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": m.name || sides.map(t => t.name).join(" vs ") || `${sportLabel} match`,
        "sport": sportLabel,
        "description": [m.name, m.league, m.status].filter(Boolean).join(" · "),
        "url": `${BASE}${p}`,
        ...(m.isLive && { "eventStatus": "https://schema.org/EventScheduled" }),
        ...(m.date && !isNaN(new Date(m.date)) && { "startDate": new Date(m.date).toISOString() }),
        ...(m.venue && { "location": { "@type": "Place", "name": m.venue } }),
        ...(sides.length && {
          "competitor": sides.map(t => ({
            "@type": p === "/tennis" ? "Person" : "SportsTeam",
            "name": t.name,
          })),
        }),
      });
    });
  } else if (p === "/games") {
    structuredDataList.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Live Cricket Zone Arcade Games",
      "applicationCategory": "GameApplication",
      "operatingSystem": "All",
      "url": `${BASE}/games`,
      "description": "Play free online cricket games and traditional Indian Kachuful card games with friends or vs AI bots."
    });
  } else if (p === "/news" && news.length > 0) {
    structuredDataList.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Latest Cricket News & IPL 2026 Headlines",
      "itemListElement": news.slice(0, 15).map((n, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": n.title,
        "url": n.url?.startsWith("http") ? n.url : `${BASE}/news/${n.id || i}`
      }))
    });
  } else if (p.startsWith("/news/") && meta.article) {
    structuredDataList.push({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": meta.article.title,
      "image": [meta.article.img],
      "datePublished": `${meta.article.date}T09:00:00+05:30`,
      "dateModified": `${meta.article.date}T09:00:00+05:30`,
      "author": [{ "@type": "Organization", "name": "Live Cricket Zone Editorial Team", "url": `${BASE}/about` }],
      "publisher": { "@type": "Organization", "name": SITE, "logo": { "@type": "ImageObject", "url": `${BASE}/logo192.png` } },
      "description": meta.article.description
    });
  } else if (p.startsWith("/match/") && matchDetail) {
    structuredDataList.push({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "name": matchDetail.name || "Live Cricket Match",
      "sport": "Cricket",
      "description": `${matchDetail.name} live score: ${matchDetail.status || ""}`,
      "url": `${BASE}${p}`,
      "eventStatus": matchDetail.matchEnded ? "https://schema.org/EventCompleted" : matchDetail.matchStarted ? "https://schema.org/LiveEventUpdate" : "https://schema.org/EventScheduled",
      "location": { "@type": "Place", "name": matchDetail.venue || "Cricket Stadium" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock", "url": `${BASE}${p}` }
    });
  } else if (p === "/rankings") {
    structuredDataList.push({
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": "ICC Cricket Rankings 2026 — Batsmen, Bowlers & Teams",
      "description": "Official ICC player and team rankings across Test, ODI, and T20 formats.",
      "url": `${BASE}/rankings`
    });
  }

  // 2. Generate Rich Content Sections based on Route (AdSense Compliant & Zero-Thin-Content)
  let dynamicBodyHtml = "";

  if (p === "/") {
    const liveCards = liveMatches.length > 0
      ? liveMatches.map(m => `
        <article itemscope itemtype="https://schema.org/SportsEvent" class="card">
          <span class="live-badge">🔴 LIVE</span>
          <h3 itemprop="name"><a href="${BASE}/match/${m.id}">${m.name}</a></h3>
          <p class="score-summary">${(m.score || []).map(s => `<strong>${s.inning || "Score"}:</strong> ${s.r}/${s.w} (${s.o} ov)`).join(" · ") || "Match in progress"}</p>
          <p class="status" itemprop="description">${m.status || ""}${m.venue ? ` | ${m.venue}` : ""}</p>
        </article>`).join("")
      : "<p>Live match radar active. Tracking all ongoing sessions and scheduled matches globally.</p>";

    const recentCards = recentMatches.slice(0, 6).map(m => `
      <article class="card">
        <h3><a href="${BASE}/match/${m.id}">${m.name}</a></h3>
        <p class="score-summary">${(m.score || []).map(s => `${s.inning || "Score"}: ${s.r}/${s.w} (${s.o} ov)`).join(" · ")}</p>
        <p class="status">${m.status || "Match Concluded"}</p>
      </article>`).join("");

    const originalArticleCards = ORIGINAL_ARTICLES.slice(0, 6).map(a => `
      <article class="card" style="border-left: 3px solid #2563eb">
        <span style="font-size:11px;font-weight:700;color:#2563eb;text-transform:uppercase">${a.category} Analysis</span>
        <h3 style="margin:6px 0 8px"><a href="${BASE}/news/${a.id}">${a.title}</a></h3>
        <p style="font-size:13px;color:#475569;margin-bottom:8px">${a.description}</p>
        <small style="color:#64748b">By <strong>${a.author}</strong> · ${a.readTime} · Published ${a.date}</small>
      </article>`).join("");

    dynamicBodyHtml = `
      <section aria-label="Live Cricket Scores Today">
        <h2>🔴 Live Cricket Action Today</h2>
        <div class="grid">${liveCards}</div>
      </section>

      ${recentCards ? `<section aria-label="Recent Match Results"><h2>✅ Concluded Matches &amp; Final Scores</h2><div class="grid">${recentCards}</div></section>` : ""}

      <section aria-label="Expert Cricket Editorial &amp; Tactical Analysis" style="margin-top:32px">
        <h2>🏏 In-Depth Tactical Analysis &amp; Cricket Journalism</h2>
        <p>Original analytical features, pitch breakdown reports, and tournament tactical previews authored by Live Cricket Zone's senior sports analysts:</p>
        <div class="grid">${originalArticleCards}</div>
        <p><a href="${BASE}/news" style="font-weight:700;color:#2563eb">Explore all in-depth cricket tactical masterclasses &amp; match analyses →</a></p>
      </section>

      <section aria-label="Major Tournament Portals" style="margin-top:32px">
        <h2>🏆 Major Global Cricket Tournaments 2026</h2>
        <div class="grid">
          <div class="card">
            <h3><a href="${BASE}/ipl">IPL 2026 Tournament Hub</a></h3>
            <p>Complete Indian Premier League coverage: 10 franchise rosters, live points table with Net Run Rate calculations, match schedule, and playoff qualification scenarios.</p>
          </div>
          <div class="card">
            <h3><a href="${BASE}/t20-world-cup">ICC Men's T20 World Cup 2026</a></h3>
            <p>16 international nations competing across 45 fixtures. Group standings, Super 8 qualification paths, historical records, and venue guides.</p>
          </div>
          <div class="card">
            <h3><a href="${BASE}/county-championship">English County Championship 2026</a></h3>
            <p>All 18 first-class counties in Division One and Division Two. 4-day session scores, bowling bonus points, and Dukes ball analysis.</p>
          </div>
          <div class="card">
            <h3><a href="${BASE}/bbl">Big Bash League (BBL 2026)</a></h3>
            <p>Australia's marquee T20 competition. 8 franchises, Optus Stadium and MCG drop-in pitch reports, and full tournament schedule.</p>
          </div>
        </div>
      </section>

      <section aria-label="Frequently Asked Questions" style="margin-top:32px">
        <h2>❓ Frequently Asked Questions (FAQ)</h2>
        <div class="faq-card">
          <h3>How frequently are live scores updated on Live Cricket Zone?</h3>
          <p>Live scores on Live Cricket Zone refresh automatically every 15 seconds through our direct real-time data streaming pipeline. For all active IPL, international, and domestic fixtures, our system provides ball-by-ball scorecards, run rates, and instant wicket alerts without requiring manual page reloads.</p>
        </div>
        <div class="faq-card">
          <h3>Does Live Cricket Zone provide full scorecards and ball-by-ball commentary?</h3>
          <p>Yes. Every match features an exhaustive match center including full batting scorecards, dismissal methods, bowling economy figures, partnership runs, fall of wickets, over-by-over progress bars, and authentic ball-by-ball commentary text.</p>
        </div>
        <div class="faq-card">
          <h3>What tournaments and formats are covered?</h3>
          <p>Our platform covers all three primary international formats (Test Matches, One Day Internationals, and T20 Internationals) alongside premier franchise leagues including the IPL, PSL, BBL, CPL, BPL, The Hundred, and historic first-class tournaments like the English County Championship and Ranji Trophy.</p>
        </div>
        <div class="faq-card">
          <h3>How are ICC Player and Team Rankings calculated?</h3>
          <p>Our ICC Rankings section updates in synchronization with the official International Cricket Council ratings algorithm, calculating points across Test, ODI, and T20I formats for batsmen, bowlers, and all-rounders.</p>
        </div>
      </section>`;
  } else if (p === "/live") {
    const liveCards = liveMatches.length > 0
      ? liveMatches.map(m => `
        <article itemscope itemtype="https://schema.org/SportsEvent" class="card">
          <span class="live-badge">🔴 LIVE</span>
          <h3 itemprop="name"><a href="${BASE}/match/${m.id}">${m.name}</a></h3>
          <p class="score-summary">${(m.score || []).map(s => `<strong>${s.inning || "Score"}:</strong> ${s.r}/${s.w} (${s.o} ov)`).join(" · ") || "Match in progress"}</p>
          <p class="status" itemprop="description">${m.status || ""}${m.venue ? ` | ${m.venue}` : ""}</p>
        </article>`).join("")
      : "<p>Live radar connected. All global matches will display here automatically upon session commencement.</p>";

    const recentCards = recentMatches.slice(0, 10).map(m => `
      <article class="card">
        <h3><a href="${BASE}/match/${m.id}">${m.name}</a></h3>
        <p class="score-summary">${(m.score || []).map(s => `${s.inning || "Score"}: ${s.r}/${s.w} (${s.o} ov)`).join(" · ")}</p>
        <p class="status">${m.status || "Match Ended"}</p>
      </article>`).join("");

    dynamicBodyHtml = `
      <section aria-label="Ongoing Live Matches">
        <h2>🔴 Ongoing Live Cricket Matches</h2>
        <div class="grid">${liveCards}</div>
      </section>
      ${recentCards ? `<section aria-label="Recently Concluded Matches" style="margin-top:24px"><h2>✅ Recently Concluded Results</h2><div class="grid">${recentCards}</div></section>` : ""}`;
  } else if (p === "/ipl") {
    const standingsRows = iplStandings.length > 0
      ? iplStandings.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${r.team || r.name}</strong> (${r.short || ""})</td>
          <td>${r.p || r.played || 0}</td>
          <td>${r.w || r.won || 0}</td>
          <td>${r.l || r.lost || 0}</td>
          <td>${r.nrr || "+0.000"}</td>
          <td><strong>${r.pts || r.points || 0}</strong></td>
        </tr>`).join("")
      : `<tr><td colspan="7">IPL 2026 Points Table updates in real time during every match. Top 4 qualify for playoffs.</td></tr>`;

    dynamicBodyHtml = `
      <section aria-label="IPL 2026 Points Table">
        <h2>🏆 IPL 2026 Points Table &amp; Standings</h2>
        <p>Official Indian Premier League 2026 team standings with Net Run Rate (NRR), matches won, lost, and qualification status.</p>
        <table class="data-table">
          <thead>
            <tr><th>Pos</th><th>Team</th><th>P</th><th>W</th><th>L</th><th>NRR</th><th>Pts</th></tr>
          </thead>
          <tbody>${standingsRows}</tbody>
        </table>
      </section>
      <section aria-label="IPL Overview" style="margin-top:24px">
        <h2>About IPL 2026</h2>
        <p>The Indian Premier League (IPL 2026) is the world's premier domestic Twenty20 competition. Featuring 10 elite franchises — Chennai Super Kings, Mumbai Indians, Royal Challengers Bengaluru, Kolkata Knight Riders, Gujarat Titans, Lucknow Super Giants, Rajasthan Royals, Sunrisers Hyderabad, Delhi Capitals, and Punjab Kings — the tournament spans 84 matches across India's top venues including the Wankhede Stadium, Eden Gardens, and Narendra Modi Stadium.</p>
      </section>
      <section aria-label="IPL 2026 FAQs" style="margin-top:24px">
        <h2>❓ Frequently Asked Questions: IPL 2026</h2>
        <div class="faq-card">
          <h3>How many teams qualify for IPL 2026 playoffs?</h3>
          <p>The top 4 teams in the league stage qualify for the playoffs. Teams ranked 1st and 2nd contest Qualifier 1, where the winner advances directly to the Grand Final. Teams ranked 3rd and 4th contest the Eliminator.</p>
        </div>
        <div class="faq-card">
          <h3>How often is the IPL live points table updated?</h3>
          <p>Live Cricket Zone updates the IPL 2026 points table immediately following the conclusion of each match with precision Net Run Rate recalculations.</p>
        </div>
      </section>`;
  } else if (p === "/t20-world-cup") {
    dynamicBodyHtml = `
      <section aria-label="ICC Men's T20 World Cup 2026 Overview">
        <h2>🏆 ICC Men's T20 World Cup 2026 Hub</h2>
        <p>The ICC Men's T20 World Cup 2026 brings together the world's top 16 international cricketing nations across 45 high-octane Twenty20 fixtures co-hosted in the subcontinent. Following India's historic 2024 triumph in Barbados, the global crown is once again up for grabs.</p>
        <p>Tournament format features four initial groups of four teams, with the top two teams from each group progressing to the high-stakes Super 8 round, culminating in the semi-finals and grand final.</p>
      </section>
      <section aria-label="Competing Teams" style="margin-top:24px">
        <h2>🏏 Competing Nations &amp; Favorites</h2>
        <div class="grid">
          <div class="card"><strong>India 🇮🇳</strong><br/><small>Defending Champions (2007, 2024) · Captain: Suryakumar Yadav</small></div>
          <div class="card"><strong>Australia 🇦🇺</strong><br/><small>2021 Champions · Captain: Mitchell Marsh</small></div>
          <div class="card"><strong>England 🏴󠁧󠁢󠁥󠁮󠁧󠁿</strong><br/><small>2-Time Champions (2010, 2022) · Captain: Jos Buttler</small></div>
          <div class="card"><strong>South Africa 🇿🇦</strong><br/><small>2024 Finalists · Captain: Aiden Markram</small></div>
          <div class="card"><strong>West Indies 🌴</strong><br/><small>2-Time Champions (2012, 2016) · Captain: Rovman Powell</small></div>
          <div class="card"><strong>Pakistan 🇵🇰</strong><br/><small>2009 Champions · Pace-heavy attack</small></div>
          <div class="card"><strong>New Zealand 🇳🇿</strong><br/><small>Consistent ICC Knockout Contenders</small></div>
          <div class="card"><strong>Afghanistan 🇦🇫</strong><br/><small>2024 Semi-Finalists · World-Class Spin Trio</small></div>
        </div>
      </section>
      <section aria-label="Historical Tournament Records" style="margin-top:24px">
        <h2>📊 All-Time T20 World Cup Records</h2>
        <table class="data-table">
          <thead><tr><th>Record</th><th>Player / Team</th><th>Statistical Value</th></tr></thead>
          <tbody>
            <tr><td>Most Career Runs</td><td>Virat Kohli (India)</td><td>1,292 Runs</td></tr>
            <tr><td>Highest Individual Score</td><td>Brendon McCullum (New Zealand)</td><td>123 vs Bangladesh (2012)</td></tr>
            <tr><td>Most Career Wickets</td><td>Shakib Al Hasan (Bangladesh)</td><td>50 Wickets</td></tr>
            <tr><td>Best Bowling Figures</td><td>Ajantha Mendis (Sri Lanka)</td><td>6/8 vs Zimbabwe (2012)</td></tr>
            <tr><td>Highest Team Total</td><td>Sri Lanka</td><td>260/6 vs Kenya (2007)</td></tr>
            <tr><td>Most Sixes in T20 WC</td><td>Chris Gayle (West Indies)</td><td>63 Sixes</td></tr>
          </tbody>
        </table>
      </section>`;
  } else if (p === "/county-championship") {
    dynamicBodyHtml = `
      <section aria-label="County Championship 2026 Overview">
        <h2>🏆 English County Championship 2026 Hub</h2>
        <p>The County Championship is England's historic first-class four-day red-ball competition, contested continuously since 1890. 18 first-class counties compete across Division One (10 teams) and Division Two (8 teams), testing tactical endurance, swing-bowling mastery, and batting resilience against the hand-stitched Dukes ball.</p>
        <p>Points are awarded for outright victories, draws, and first-innings batting and bowling bonus points accumulated over the opening 110 overs of each match.</p>
      </section>
      <section aria-label="First-Class Counties" style="margin-top:24px">
        <h2>🏏 The 18 Historic First-Class Counties</h2>
        <div class="grid">
          <div class="card"><strong>Surrey CCC 🦁</strong><br/><small>22 Championship Titles · The Kia Oval</small></div>
          <div class="card"><strong>Essex Eagles 🦅</strong><br/><small>8 Championship Titles · Chelmsford</small></div>
          <div class="card"><strong>Yorkshire CCC 🌹</strong><br/><small>33 Titles (Record Winners) · Headingley</small></div>
          <div class="card"><strong>Lancashire 🌹</strong><br/><small>9 Championship Titles · Emirates Old Trafford</small></div>
          <div class="card"><strong>Warwickshire 🐻</strong><br/><small>8 Championship Titles · Edgbaston</small></div>
          <div class="card"><strong>Somerset 🐉</strong><br/><small>Title Chasers &amp; Spin Masters · Taunton</small></div>
          <div class="card"><strong>Hampshire 👑</strong><br/><small>Division One Regulars · The Ageas Bowl</small></div>
          <div class="card"><strong>Nottinghamshire 🏹</strong><br/><small>6 Championship Titles · Trent Bridge</small></div>
        </div>
      </section>
      <section aria-label="County Records" style="margin-top:24px">
        <h2>📊 County Championship Historic Milestones</h2>
        <table class="data-table">
          <thead><tr><th>Record</th><th>Holder</th><th>Details</th></tr></thead>
          <tbody>
            <tr><td>Highest Individual Score</td><td>Brian Lara (Warwickshire)</td><td>501* vs Durham (1994)</td></tr>
            <tr><td>Most Career First-Class Runs</td><td>Sir Jack Hobbs (Surrey)</td><td>61,760 Runs (197 Centuries)</td></tr>
            <tr><td>Most Career First-Class Wickets</td><td>Wilfred Rhodes (Yorkshire)</td><td>4,204 Wickets</td></tr>
            <tr><td>Most County Championships</td><td>Yorkshire CCC</td><td>33 Outright Titles</td></tr>
          </tbody>
        </table>
      </section>`;
  } else if (p === "/bbl") {
    dynamicBodyHtml = `
      <section aria-label="Big Bash League 2026 Overview">
        <h2>🏆 KFC Big Bash League (BBL 2026) Hub</h2>
        <p>The KFC Big Bash League is Australia's premier Twenty20 franchise tournament, contested every Australian summer across 8 city franchises. Renowned for massive crowds, bouncy drop-in decks, and world-class international talent, the BBL is one of the world's most entertaining franchise spectacles.</p>
      </section>
      <section aria-label="BBL Franchises" style="margin-top:24px">
        <h2>🏏 The 8 Australian City Franchises</h2>
        <div class="grid">
          <div class="card"><strong>Perth Scorchers 🔥</strong><br/><small>5 Titles (Record Champions) · Optus Stadium</small></div>
          <div class="card"><strong>Sydney Sixers 💖</strong><br/><small>3 Titles · Sydney Cricket Ground (SCG)</small></div>
          <div class="card"><strong>Brisbane Heat 🌊</strong><br/><small>2 Titles (2013, 2024) · The Gabba</small></div>
          <div class="card"><strong>Adelaide Strikers ⚡</strong><br/><small>2018 Champions · Adelaide Oval</small></div>
          <div class="card"><strong>Melbourne Stars 💚</strong><br/><small>3-Time Finalists · Melbourne Cricket Ground (MCG)</small></div>
          <div class="card"><strong>Melbourne Renegades 🔴</strong><br/><small>2019 Champions · Marvel Stadium</small></div>
          <div class="card"><strong>Hobart Hurricanes 🌀</strong><br/><small>2-Time Finalists · Blundstone Arena</small></div>
          <div class="card"><strong>Sydney Thunder ⚡</strong><br/><small>2016 Champions · Sydney Showground</small></div>
        </div>
      </section>`;
  } else if (p === "/news") {
    const originalCards = ORIGINAL_ARTICLES.map(a => `
      <article class="card" style="border-left: 3px solid #2563eb">
        <span style="font-size:11px;font-weight:700;color:#2563eb;text-transform:uppercase">${a.category} Analysis</span>
        <h3 style="margin:6px 0"><a href="${BASE}/news/${a.id}">${a.title}</a></h3>
        <p style="font-size:13px;color:#475569;margin-bottom:8px">${a.description}</p>
        <div style="font-size:12px;color:#64748b;margin-bottom:8px"><strong>Key Takeaways:</strong> ${(a.takeaways || []).slice(0, 2).join(" · ")}</div>
        <small style="color:#64748b">By <strong>${a.author}</strong> · ${a.readTime} · Published ${a.date}</small>
      </article>`).join("");

    const newsCards = news.slice(0, 15).map(n => `
      <article class="card">
        <h3><a href="${n.url || '#'}" target="_blank" rel="noopener noreferrer">${n.title}</a></h3>
        <p style="font-size:13px;color:#475569">${n.description || ""}</p>
        <small style="color:#777">Source: ${n.source || "Cricket News Wire"} · ${n.date || "Today"}</small>
      </article>`).join("");

    dynamicBodyHtml = `
      <section aria-label="Original Cricket Editorial &amp; Tactical Analysis">
        <h2>🏏 In-House Cricket Editorial &amp; Tactical Masterclasses</h2>
        <p>Original analytical features and tactical essays produced by Live Cricket Zone's editorial staff:</p>
        <div class="grid">${originalCards}</div>
      </section>

      <section aria-label="Latest Global Cricket News Wire" style="margin-top:32px">
        <h2>📰 Latest Global Cricket News Headlines</h2>
        <div class="grid">${newsCards}</div>
      </section>`;
  } else if (p.startsWith("/news/") && meta.article) {
    const a = meta.article;
    dynamicBodyHtml = `
      <article class="article-content">
        <h2>${a.title}</h2>
        <p class="meta-line">Category: <strong>${a.category}</strong> · Author: <strong>${a.author}</strong> · Source: <strong>${a.source}</strong> · Published: <strong>${a.date}</strong></p>
        <p class="summary-box"><em>${a.description}</em></p>
        ${a.takeaways ? `<div class="takeaways"><h3>Key Takeaways</h3><ul>${a.takeaways.map(t => `<li>${t}</li>`).join("")}</ul></div>` : ""}
        ${(a.content || []).map(c => `<h3>${c.heading}</h3><p style="font-size:15px;line-height:1.8;color:#334155">${c.text}</p>`).join("")}
        <div style="margin-top:32px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
          <h4>About the Author: ${a.author}</h4>
          <p style="font-size:13px;color:#64748b;margin:0">Senior cricket correspondent for Live Cricket Zone specializing in statistical models, biomechanics, and tournament tactical previews. Adheres to Live Cricket Zone's <a href="${BASE}/editorial-policy">Editorial Policy</a>.</p>
        </div>
      </article>`;
  } else if (p === "/privacy-policy") {
    dynamicBodyHtml = `
      <article style="max-width:860px;margin:0 auto">
        <h2>Privacy Policy for Live Cricket Zone</h2>
        <p style="color:#64748b;font-size:13px">Last Updated: September 2026 · Official Contact: <a href="mailto:privacy@livecricketzone.com">privacy@livecricketzone.com</a></p>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:16px 0;font-size:14px">
          This Privacy Policy governs the manner in which <strong>Live Cricket Zone</strong> (https://www.livecricketzone.com) collects, uses, maintains, and discloses information collected from users. We respect your privacy and are committed to protecting personal data in strict compliance with Google AdSense Program Policies, the General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).
        </div>

        <h3>1. Information We Collect</h3>
        <p>When you visit Live Cricket Zone, we may collect non-personally identifiable information automatically:</p>
        <ul>
          <li><strong>Log and Device Data:</strong> Browser user agent, operating system, device model, referring URLs, access timestamps, and anonymized IP addresses.</li>
          <li><strong>Cookies and Web Beacons:</strong> Small data identifiers placed on your device to enhance navigation, remember user preferences, and deliver relevant advertisements.</li>
          <li><strong>User Communications:</strong> If you contact us via email or our contact form, we retain your email address and message history solely to respond to your inquiry.</li>
        </ul>

        <h3>2. Google AdSense and DoubleClick DART Cookies</h3>
        <p>Google is a third-party vendor on our website. Google uses cookies, specifically the <strong>DoubleClick DART cookie</strong>, to serve ads to our site visitors based upon their visit to www.livecricketzone.com and other sites on the Internet:</p>
        <ul>
          <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
          <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
          <li>Users may opt out of personalized advertising by visiting the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
          <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">aboutads.info</a> or <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer">Your Online Choices</a>.</li>
        </ul>

        <h3>3. Third-Party Ad Networks and Analytics</h3>
        <p>Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Live Cricket Zone. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit. Note that Live Cricket Zone has no access to or control over these cookies that are used by third-party advertisers.</p>

        <h3>4. GDPR Data Subject Rights (For European Users)</h3>
        <p>If you reside in the European Economic Area (EEA) or UK, you possess specific data protection rights under the GDPR: the right to access, the right to rectification, the right to erasure, and the right to withdraw cookie consent at any time via your browser settings.</p>

        <h3>5. CCPA Rights (For California Residents)</h3>
        <p>Under the California Consumer Privacy Act (CCPA), California consumers have the right to request disclosure of personal information collected, request deletion of collected information, and request not to sell personal data. <strong>Live Cricket Zone does not sell personal information.</strong></p>

        <h3>6. Children's Privacy (COPPA Compliance)</h3>
        <p>Protecting children's privacy online is paramount. Live Cricket Zone does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe your child provided this information on our website, please contact us immediately and we will promptly remove such information from our records.</p>

        <h3>7. Official Contact Information</h3>
        <p>For any privacy inquiries, data requests, or policy clarifications, please contact our Data Protection Officer at: <a href="mailto:privacy@livecricketzone.com">privacy@livecricketzone.com</a>.</p>
      </article>`;
  } else if (p === "/about") {
    dynamicBodyHtml = `
      <article style="max-width:860px;margin:0 auto">
        <h2>About Live Cricket Zone</h2>
        <p style="font-size:15px;line-height:1.8">Live Cricket Zone is a premier independent cricket media publishing house and real-time live scoring network dedicated to delivering high-speed, delivery-by-delivery cricket intelligence to millions of cricket fans worldwide.</p>

        <h3>Our Editorial Mission</h3>
        <p style="font-size:14px;line-height:1.8">Our mission is to elevate sports journalism by combining instant, real-time ball-by-ball scoring infrastructure with deep, objective tactical commentary. We believe modern cricket coverage should go far beyond bare numbers. Our editorial desk publishes in-depth essays, biomechanical bowling analyses, tournament roadmaps, pitch degradation studies, and player career retrospects.</p>

        <h3>Editorial Leadership &amp; E-E-A-T Analysts</h3>
        <div class="grid">
          <div class="card">
            <h4>Arjun Mehta</h4>
            <p style="font-size:12px;color:#2563eb;font-weight:700">Senior Cricket Analyst &amp; T20 Specialist</p>
            <p style="font-size:13px;color:#475569">Over 12 years covering IPL mega-auctions, subcontinental pitch dynamics, and white-ball death-overs execution. Regular contributor on tactical matchup matrices.</p>
          </div>
          <div class="card">
            <h4>David Richardson</h4>
            <p style="font-size:12px;color:#2563eb;font-weight:700">Chief Test Match &amp; First-Class Correspondent</p>
            <p style="font-size:13px;color:#475569">Veteran first-class cricket writer covering ICC World Test Championship cycles, Ashes series, English County Championship seasons, and the physics of Dukes ball movement.</p>
          </div>
          <div class="card">
            <h4>Priya Sharma</h4>
            <p style="font-size:12px;color:#2563eb;font-weight:700">Women's Cricket Correspondent</p>
            <p style="font-size:13px;color:#475569">Specializes in the tactical evolution of women's franchise cricket, Women's Premier League (WPL) analytics, and international state pathways.</p>
          </div>
          <div class="card">
            <h4>Rohan Sen</h4>
            <p style="font-size:12px;color:#2563eb;font-weight:700">White-Ball Tactical Analyst</p>
            <p style="font-size:13px;color:#475569">Data-driven performance analyst studying middle-overs strike rotation rates, powerplay entry points, and bowler release angle variations.</p>
          </div>
        </div>

        <h3>Editorial Integrity &amp; Transparency</h3>
        <p style="font-size:14px;line-height:1.8">Live Cricket Zone operates with complete editorial independence. We do not accept sponsored placements to inflate player ratings or publish unverified transfer speculation. Learn more in our <a href="${BASE}/editorial-policy">Editorial Policy</a> or contact us directly via our <a href="${BASE}/contact">Contact Page</a>.</p>
      </article>`;
  } else if (p === "/contact") {
    dynamicBodyHtml = `
      <article style="max-width:860px;margin:0 auto">
        <h2>Contact Live Cricket Zone</h2>
        <p style="font-size:14px;line-height:1.8">We welcome inquiries, feedback, score corrections, and editorial submissions. Our dedicated team reviews every inquiry within 24 to 48 hours.</p>

        <div class="grid">
          <div class="card">
            <h4>📧 Editorial Inquiries &amp; Pitches</h4>
            <p style="font-size:13px;color:#475569">For story pitches, match analysis suggestions, and guest editorial requests:</p>
            <p><a href="mailto:editorial@livecricketzone.com" style="color:#2563eb;font-weight:700">editorial@livecricketzone.com</a></p>
          </div>
          <div class="card">
            <h4>🛠️ Technical Support &amp; Score Corrections</h4>
            <p style="font-size:13px;color:#475569">Noticed a score discrepancy, stat error, or website bug?</p>
            <p><a href="mailto:support@livecricketzone.com" style="color:#2563eb;font-weight:700">support@livecricketzone.com</a></p>
          </div>
          <div class="card">
            <h4>💼 Business, Advertising &amp; Partnerships</h4>
            <p style="font-size:13px;color:#475569">For commercial partnerships, advertising requests, and content syndication:</p>
            <p><a href="mailto:contact@livecricketzone.com" style="color:#2563eb;font-weight:700">contact@livecricketzone.com</a></p>
          </div>
          <div class="card">
            <h4>🔒 Privacy &amp; Legal Notices</h4>
            <p style="font-size:13px;color:#475569">For data protection officer contact, GDPR/CCPA requests, and legal notices:</p>
            <p><a href="mailto:privacy@livecricketzone.com" style="color:#2563eb;font-weight:700">privacy@livecricketzone.com</a></p>
          </div>
        </div>
      </article>`;
  } else if (p === "/editorial-policy") {
    dynamicBodyHtml = `
      <article style="max-width:860px;margin:0 auto">
        <h2>Editorial Policy &amp; Fact-Checking Standards</h2>
        <p style="font-size:14px;line-height:1.8">At Live Cricket Zone, we adhere to the highest standards of sports journalism, objective data analysis, and transparent corrections.</p>

        <h3>1. Journalistic Principles</h3>
        <p style="font-size:14px;line-height:1.8">Our editorial desk produces original, fact-based cricket reporting. Every article published under our imprint is written by qualified cricket writers with verifiable expertise. We strictly reject plagiarized content, clickbait headlines, and AI-generated regurgitation.</p>

        <h3>2. Fact-Checking &amp; Verification Methodology</h3>
        <p style="font-size:14px;line-height:1.8">Every match preview, statistical deep dive, and historical report undergoes multi-layered verification:</p>
        <ul>
          <li><strong>Scorecard Cross-Referencing:</strong> Match figures, career statistics, and head-to-head records are verified against official ICC, BCCI, ECB, and Cricket Australia records.</li>
          <li><strong>Direct Source Quotes:</strong> Press conference statements and player interviews are verified from primary audio/video transcripts before publication.</li>
          <li><strong>Mathematical Accuracy:</strong> Complex metrics such as Net Run Rate (NRR), Points Percentage (PCT), and bowler economy trends are calculated using validated mathematical formulas.</li>
        </ul>

        <h3>3. Transparent Corrections Policy</h3>
        <p style="font-size:14px;line-height:1.8">When an error of fact or statistic occurs, we correct it promptly and transparently. A formal correction notice is appended to the bottom of the article indicating what was changed and when.</p>

        <h3>4. Sourcing &amp; Attribution</h3>
        <p style="font-size:14px;line-height:1.8">We credit all primary news sources, official league releases, and statistical record-holders. Official match highlights are embedded strictly via authorized YouTube embed players compliant with third-party developer terms.</p>
      </article>`;
  } else if (p === "/terms-of-use") {
    dynamicBodyHtml = `
      <article style="max-width:860px;margin:0 auto">
        <h2>Terms of Use</h2>
        <p style="color:#64748b;font-size:13px">Last Updated: September 2026 · Official Contact: <a href="mailto:legal@livecricketzone.com">legal@livecricketzone.com</a></p>
        <p>By accessing or using Live Cricket Zone (https://www.livecricketzone.com), you agree to be bound by these Terms of Use. If you do not agree, please do not use this website.</p>
        <h3>1. Description of Service</h3>
        <p>Live Cricket Zone provides live cricket scores, ball-by-ball commentary, match statistics, tournament schedules, ICC rankings, and original sports journalism. All content is provided for informational, non-commercial entertainment purposes free of charge.</p>
        <h3>2. Intellectual Property Rights</h3>
        <p>All original articles, editorial analyses, branding, and design layouts are the exclusive property of Live Cricket Zone. Team names, logos, and competition marks belong to their respective governing boards (BCCI, ICC, ECB, Cricket Australia) and are used strictly under fair-use editorial reporting principles.</p>
        <h3>3. User Conduct</h3>
        <p>Users agree not to scrape, reverse-engineer, or disrupt our real-time streaming servers or bypass security rate-limiting mechanisms.</p>
      </article>`;
  } else if (p === "/dmca-copyright") {
    dynamicBodyHtml = `
      <article style="max-width:860px;margin:0 auto">
        <h2>DMCA Copyright Policy &amp; Notice</h2>
        <p style="color:#64748b;font-size:13px">Last Updated: September 2026 · Designated DMCA Agent: <a href="mailto:dmca@livecricketzone.com">dmca@livecricketzone.com</a></p>
        <p>Live Cricket Zone respects the intellectual property rights of others and expects our users and partners to do the same. In accordance with the Digital Millennium Copyright Act (17 U.S.C. § 512), we respond promptly to notices of alleged infringement.</p>
        <h3>Embedded Official Content</h3>
        <p>Live Cricket Zone does not host or broadcast copyrighted live video feeds. All video highlights appearing on our platform are embedded strictly via authorized YouTube embed players hosted by official broadcasters and verified cricket boards (e.g., BCCI, ICC, England Cricket). If you are a copyright holder wishing to submit a takedown request, please email our designated agent at <a href="mailto:dmca@livecricketzone.com">dmca@livecricketzone.com</a> with complete statutory details.</p>
      </article>`;
  } else if (p.startsWith("/match/") && matchDetail) {
    const m = matchDetail;
    dynamicBodyHtml = `
      <article class="match-detail-box">
        <h2>${m.name} Live Score</h2>
        <p class="match-status">${m.status || ""}</p>
        <p><strong>Venue:</strong> ${m.venue || "International Ground"} | <strong>Format:</strong> ${m.matchType || "Cricket Match"}</p>
        <div class="score-breakdown">
          ${(m.score || []).map(s => `<p style="font-size:16px"><strong>${s.inning || "Innings"}:</strong> ${s.r}/${s.w} in ${s.o} overs</p>`).join("")}
        </div>
      </article>`;
  } else if (p === "/schedule" || p === "/upcoming") {
    const upcomingList = upcomingMatches.slice(0, 15).map(m => `
      <div class="card">
        <strong>${m.date || "Upcoming"}</strong>: <a href="${BASE}/match/${m.id}">${m.name}</a>
        <br/><small style="color:#666">${m.matchType || ""} — ${m.venue || ""}</small>
      </div>`).join("") || "<p>Upcoming fixtures are updated continuously.</p>";

    dynamicBodyHtml = `
      <section aria-label="Upcoming Cricket Matches">
        <h2>📅 Upcoming Cricket Schedule 2026</h2>
        <div>${upcomingList}</div>
      </section>`;
  } else if (p === "/football" || p === "/basketball" || p === "/tennis") {
    const sportName = p.replace("/", "");
    const capName = sportName.charAt(0).toUpperCase() + sportName.slice(1);
    const sideName = (m, i) => (m.teams && m.teams[i] && m.teams[i].name) || "TBD";
    const sideScore = (m, i) => (m.teams && m.teams[i] && m.teams[i].score) || "";

    const fixtureCard = (m, tag) => {
      const a = sideName(m, 0), b = sideName(m, 1);
      const sa = sideScore(m, 0), sb = sideScore(m, 1);
      const score = (sa || sb) ? ` ${sa}–${sb}` : "";
      const when = m.date && !isNaN(new Date(m.date))
        ? new Date(m.date).toUTCString().replace(/:\d\d GMT$/, " GMT")
        : "";
      return `<div class="card">
        <strong>${a} vs ${b}${score}</strong><br/>
        <small>${[m.league, tag, m.status, m.venue, when].filter(Boolean).join(" · ")}</small>
      </div>`;
    };

    const live = (sportMatches.live || []);
    const upcoming = (sportMatches.upcoming || []).slice(0, 12);
    const recent = (sportMatches.recent || []).slice(0, 8);
    const leagues = [...new Set([...live, ...upcoming, ...recent].map(m => m.league).filter(Boolean))];

    dynamicBodyHtml = `
      <section aria-label="${capName} Live Scores">
        <h2>${capName} Live Scores, Fixtures &amp; Results</h2>
        <p>Real-time ${sportName} scores on Live Cricket Zone${leagues.length ? `, covering ${leagues.join(", ")}` : ""}.</p>

        <h3>🔴 Live Now</h3>
        <div class="grid">
          ${live.map(m => fixtureCard(m, "LIVE")).join("") || `<p>No ${sportName} matches are live at this moment. Upcoming fixtures are listed below.</p>`}
        </div>

        <h3>📅 Upcoming ${capName} Fixtures</h3>
        <div class="grid">
          ${upcoming.map(m => fixtureCard(m, "Upcoming")).join("") || `<p>No upcoming ${sportName} fixtures are currently scheduled.</p>`}
        </div>

        <h3>✅ Recent ${capName} Results</h3>
        <div class="grid">
          ${recent.map(m => fixtureCard(m, "Final")).join("") || `<p>No recent ${sportName} results available.</p>`}
        </div>
      </section>`;
  } else {
    dynamicBodyHtml = `
      <section aria-label="Cricket Information">
        <h2>${meta.title.split("|")[0].trim()}</h2>
        <p style="font-size:15px;line-height:1.8">${meta.desc}</p>
        <p>Live Cricket Zone provides 24/7 ball-by-ball live scorecards, tournament standings, player statistics, and match previews across all major international and domestic cricket tournaments. Explore our <a href="${BASE}/live">Live Matches</a> or review our <a href="${BASE}/schedule">2026 Cricket Schedule</a>.</p>
      </section>`;
  }

  const navLinks = [
    ["/", "Home"], ["/live", "Live Scores"], ["/ipl", "IPL 2026"],
    ["/t20-world-cup", "T20 World Cup"], ["/county-championship", "County Championship"],
    ["/schedule", "Schedule"], ["/results", "Results"], ["/news", "News & Editorial"],
    ["/rankings", "Rankings"], ["/stats", "Stats"], ["/about", "About Us"],
    ["/editorial-policy", "Editorial Policy"], ["/contact", "Contact"]
  ];

  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/WebPage">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${meta.title}</title>
  <meta name="description" content="${meta.desc}"/>
  <meta name="keywords" content="${meta.kw || 'live cricket score, IPL 2026, cricket score today, ball by ball commentary'}"/>
  <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"/>
  <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"/>
  <meta name="bingbot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"/>
  <meta name="author" content="Live Cricket Zone"/>
  <meta name="language" content="English"/>
  <meta name="geo.region" content="IN"/>
  <meta name="geo.placename" content="India"/>
  <link rel="canonical" href="${meta.canonical}"/>
  <meta property="og:title" content="${meta.title}"/>
  <meta property="og:description" content="${meta.desc}"/>
  <meta property="og:url" content="${meta.canonical}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:image" content="${BASE}/og-image.png"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:site_name" content="${SITE}"/>
  <meta property="og:locale" content="en_US"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${meta.title}"/>
  <meta name="twitter:description" content="${meta.desc}"/>
  <meta name="twitter:image" content="${BASE}/og-image.png"/>
  <meta name="twitter:site" content="@LiveCricketZone"/>
  ${structuredDataList.map(sd => `<script type="application/ld+json">${JSON.stringify(sd)}</script>`).join("\n  ")}
  <style>
    body{font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:1200px;margin:0 auto;padding:16px;color:#1e293b;background:#fff;line-height:1.6}
    header{border-bottom:2px solid #3B82F6;padding-bottom:12px;margin-bottom:24px}
    h1{color:#1e40af;margin:0 0 10px;font-size:26px}
    h2{color:#0f172a;border-left:4px solid #3B82F6;padding-left:10px;margin:24px 0 12px;font-size:20px}
    h3{color:#1e293b;font-size:16px;margin:8px 0 4px}
    nav a{margin-right:12px;color:#2563eb;text-decoration:none;font-size:13px;font-weight:600}
    nav a:hover{text-decoration:underline}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-bottom:20px}
    .card{border:1px solid #e2e8f0;border-radius:8px;padding:14px;background:#f8fafc}
    .card a{color:#2563eb;text-decoration:none;font-weight:700}
    .card a:hover{text-decoration:underline}
    .live-badge{background:#ef4444;color:#fff;font-size:10px;font-weight:800;padding:2px 8px;border-radius:12px;display:inline-block;margin-bottom:6px}
    .score-summary{color:#0f172a;font-size:14px;margin:4px 0}
    .status{color:#64748b;font-size:12px;margin:0}
    .data-table{width:100%;border-collapse:collapse;margin:12px 0 20px;font-size:14px}
    .data-table th,.data-table td{border:1px solid #cbd5e1;padding:8px 12px;text-align:left}
    .data-table th{background:#f1f5f9;font-weight:700;color:#0f172a}
    .faq-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:10px}
    .summary-box{background:#eff6ff;border-left:3px solid #3b82f6;padding:12px 16px;border-radius:4px}
    .takeaways{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;margin:14px 0}
    footer{margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b}
  </style>
</head>
<body>
  <header>
    <div style="font-size:24px;font-weight:bold"><a href="${BASE}" style="color:#2563eb;text-decoration:none">🏏 Live Cricket Zone</a></div>
    <p style="margin:4px 0 10px;color:#64748b;font-size:13px">Fastest live cricket scores, ball-by-ball commentary, IPL 2026, T20 World Cup &amp; international cricket updates</p>
    <nav aria-label="Main navigation">
      ${navLinks.map(([href, label]) => `<a href="${BASE}${href}">${label}</a>`).join("")}
    </nav>
  </header>

  <main>
    <h1>${meta.title.split("|")[0].trim()}</h1>
    <p style="font-size:15px;color:#475569;margin-bottom:20px">${meta.desc}</p>

    ${dynamicBodyHtml}

    <section aria-label="Tournament and Format Navigation" style="margin-top:36px">
      <h2>🏆 Cricket Tournaments &amp; Formats</h2>
      <div class="grid">
        <div class="card"><a href="${BASE}/ipl">IPL 2026 Points Table &amp; Live Score</a><br/><small>Indian Premier League</small></div>
        <div class="card"><a href="${BASE}/t20-world-cup">T20 World Cup 2026</a><br/><small>ICC Men's T20 World Cup</small></div>
        <div class="card"><a href="${BASE}/champions-trophy">Champions Trophy 2025</a><br/><small>ICC Champions Trophy</small></div>
        <div class="card"><a href="${BASE}/asia-cup">Asia Cup 2026 Live Score</a><br/><small>India vs Pakistan &amp; Asian Teams</small></div>
        <div class="card"><a href="${BASE}/county-championship">County Championship 2026</a><br/><small>English County Cricket</small></div>
        <div class="card"><a href="${BASE}/psl">PSL 2026 Live Score</a><br/><small>Pakistan Super League</small></div>
        <div class="card"><a href="${BASE}/bbl">BBL 2026 Live Score</a><br/><small>Big Bash League</small></div>
        <div class="card"><a href="${BASE}/womens-cricket">Women's Cricket Live Score</a><br/><small>ICC Women's T20 &amp; ODI</small></div>
        <div class="card"><a href="${BASE}/t20">T20 Cricket Live Score</a><br/><small>All Twenty20 Matches</small></div>
        <div class="card"><a href="${BASE}/odi">ODI Cricket Live Score</a><br/><small>One Day Internationals</small></div>
        <div class="card"><a href="${BASE}/test">Test Cricket Live Score</a><br/><small>5-day Test Matches</small></div>
        <div class="card"><a href="${BASE}/rankings">ICC Cricket Rankings 2026</a><br/><small>Men's &amp; Women's Rankings</small></div>
      </div>
    </section>

    <section aria-label="About Live Cricket Zone" style="margin-top:36px">
      <h2>About Live Cricket Zone</h2>
      <p>Live Cricket Zone is the premier online destination for <strong>live cricket scores</strong> with real-time ball-by-ball commentary updated every 15 seconds. We cover all major international tournaments and domestic leagues, including <strong>IPL 2026</strong>, <strong>T20 World Cup 2026</strong>, ICC Champions Trophy, Asia Cup, PSL, BBL, CPL, BPL, and County Championship.</p>
      <p>Our service provides instant ball-by-ball commentary, full scorecards with batting and bowling figures, toss information, player career statistics, ICC rankings, and official match highlights.</p>
    </section>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} Live Cricket Zone — <a href="${BASE}">livecricketzone.com</a> | 
    <a href="${BASE}/about">About</a> | 
    <a href="${BASE}/sitemap.xml">Sitemap</a> | 
    <a href="${BASE}/sitemap-news.xml">News Sitemap</a> | 
    <a href="${BASE}/rss.xml">RSS Feed</a> | 
    <a href="${BASE}/privacy-policy">Privacy Policy</a> | 
    <a href="${BASE}/terms-of-use">Terms of Use</a> | 
    <a href="${BASE}/dmca-copyright">DMCA</a></p>
  </footer>
</body>
</html>`;
}

// ─── MAIN VERCEL HANDLER ─────────────────────────────────────────────────────

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (serveMeta(req.url || "", res, req)) return;

  // ── Bot detection: serve pre-rendered HTML to crawlers ───────────────────
  if (isBot(req)) {
    let pathname = "/";
    try {
      pathname = new URL(req.url, `http://${req.headers.host || "localhost"}`).pathname;
    } catch (_) {
      pathname = (req.url || "/").split("?")[0];
    }

    // Skip API paths — bots shouldn't get HTML for /api/* routes
    if (!pathname.startsWith("/api/")) {
      const meta = getPageMeta(pathname);
      const cleanPath = pathname.replace(/\/$/, "") || "/";
      const context = {};

      try {
        if (cleanPath === "/" || cleanPath === "/live" || cleanPath === "/schedule" || cleanPath === "/upcoming" || cleanPath === "/results" || cleanPath === "/t20" || cleanPath === "/odi" || cleanPath === "/test" || cleanPath.startsWith("/t20-") || cleanPath.startsWith("/asia-") || cleanPath.startsWith("/champions-") || cleanPath.startsWith("/world-") || cleanPath.startsWith("/psl") || cleanPath.startsWith("/bbl") || cleanPath.startsWith("/county-")) {
          const all = await getAllMatches();
          context.liveMatches = all.live || [];
          context.recentMatches = all.recent || [];
          context.upcomingMatches = all.upcoming || [];
        }
        if (cleanPath === "/ipl" || cleanPath === "/") {
          try { context.iplStandings = await scraper.scrapeIPLStandings(); } catch (_) {}
          if (cleanPath === "/ipl" && !context.liveMatches) {
            const all = await getAllMatches();
            context.liveMatches = (all.live || []).filter(m => m.series?.toLowerCase().includes("ipl") || m.name?.toLowerCase().includes("ipl"));
            context.upcomingMatches = (all.upcoming || []).filter(m => m.series?.toLowerCase().includes("ipl") || m.name?.toLowerCase().includes("ipl"));
          }
        }
        if (cleanPath === "/rankings") {
          const [menBatting, menBowling] = await Promise.allSettled([
            scraper.scrapeCricbuzzRankings("men", "batting", "tests"),
            scraper.scrapeCricbuzzRankings("men", "bowling", "tests"),
          ]);
          context.rankings = {
            menBatting: menBatting.status === "fulfilled" ? menBatting.value : [],
            menBowling: menBowling.status === "fulfilled" ? menBowling.value : []
          };
        }
        if (cleanPath === "/news") {
          context.news = await getNews();
        }
        if (cleanPath.startsWith("/match/")) {
          const matchId = cleanPath.replace("/match/", "").split("/")[0].split("-").pop();
          if (matchId) {
            context.matchDetail = await getMatchInfo(matchId);
          }
        }
        if (cleanPath === "/football" || cleanPath === "/basketball" || cleanPath === "/tennis") {
          const sport = cleanPath.replace("/", "");
          context.sportMatches = await multiSport.getSportMatches(sport);
        }
      } catch (err) {
        console.warn("[Bot Context Error]:", err.message);
      }

      const html = renderBotHtml(pathname, meta, context);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
      res.setHeader("Vary", "User-Agent");
      res.setHeader("X-Rendered-For", "bot");
      return res.status(200).send(html);
    }
  }

  // ── Normal users on non-API routes: serve the React app ─────────────────
  let pathname = "/";
  try {
    pathname = new URL(req.url, `http://${req.headers.host || "localhost"}`).pathname;
  } catch (_) {
    pathname = (req.url || "/").split("?")[0];
  }

  if (!pathname.startsWith("/api/") && !pathname.includes(".")) {
    const fs = require("fs");
    const path2 = require("path");
    const indexPath = path2.join(__dirname, "../client/build/index.html");
    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, "utf8");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return res.status(200).send(html);
    }
    // Resilient fallback: If index.html is missing in serverless container, render rich HTML
    const meta = getPageMeta(pathname);
    const html = renderBotHtml(pathname, meta, {});
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).send(html);
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

    // ── Match head-to-head ───────────────────────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "h2h") {
      const data = await scraper.scrapeMatchH2H(parts[1]);
      return res.json({ status: "success", data });
    }

    // ── Match analysis (preview / report) ────────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "analysis") {
      const data = await scraper.scrapeMatchAnalysis(parts[1]);
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

    // ── Career Stats & Records ───────────────────────────────────────────────
    if (parts[0] === "stats") {
      const data = typeof scraper.scrapeCareerRecords === "function"
        ? scraper.scrapeCareerRecords()
        : {};
      return res.json({ status: "success", data });
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
