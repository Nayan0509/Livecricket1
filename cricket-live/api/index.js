const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

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

          innings.push({
            team: inn.batTeamDetails.batTeamName || "Team",
            score: `${inn.scoreDetails?.runs || 0}/${inn.scoreDetails?.wickets || 0}`,
            batsmen, bowlers,
            extras: String(inn.extrasData?.total || 0),
            fow: [],
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
      "https://news.google.com/rss/search?q=cricket+match+IPL+T20&hl=en-IN&gl=IN&ceid=IN:en",
      { timeout: 10000 }
    );
    const $ = cheerio.load(data, { xmlMode: true });
    const news = [];
    const now = new Date();
    const cutoff = new Date(now - 3 * 24 * 60 * 60 * 1000);
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

// ─── STATIC META ─────────────────────────────────────────────────────────────

function serveMeta(url, res) {
  if (url.includes("sitemap.xml")) {
    const now = new Date().toISOString().split("T")[0];
    const base = "https://www.livecricketzone.com";
    const pages = [
      { loc: "/",                        pri: "1.0", freq: "always"  },
      { loc: "/live",                    pri: "1.0", freq: "always"  },
      { loc: "/live-cricket-score",      pri: "1.0", freq: "always"  },
      { loc: "/cricket-score-today",     pri: "1.0", freq: "always"  },
      { loc: "/cricket-matches-today",   pri: "1.0", freq: "always"  },
      { loc: "/ball-by-ball",            pri: "1.0", freq: "always"  },
      { loc: "/ipl",                     pri: "0.95", freq: "hourly" },
      { loc: "/t20-world-cup",           pri: "0.95", freq: "hourly" },
      { loc: "/world-cup",               pri: "0.95", freq: "hourly" },
      { loc: "/asia-cup",                pri: "0.95", freq: "hourly" },
      { loc: "/champions-trophy",        pri: "0.95", freq: "hourly" },
      { loc: "/womens-cricket",          pri: "0.9",  freq: "hourly" },
      { loc: "/t20",                     pri: "0.9",  freq: "hourly" },
      { loc: "/odi",                     pri: "0.9",  freq: "hourly" },
      { loc: "/test",                    pri: "0.9",  freq: "hourly" },
      { loc: "/psl",                     pri: "0.9",  freq: "hourly" },
      { loc: "/bbl",                     pri: "0.85", freq: "hourly" },
      { loc: "/cpl",                     pri: "0.85", freq: "hourly" },
      { loc: "/bpl",                     pri: "0.85", freq: "hourly" },
      { loc: "/schedule",                pri: "0.9",  freq: "hourly" },
      { loc: "/upcoming",                pri: "0.9",  freq: "hourly" },
      { loc: "/results",                 pri: "0.85", freq: "hourly" },
      { loc: "/series",                  pri: "0.8",  freq: "daily"  },
      { loc: "/players",                 pri: "0.8",  freq: "daily"  },
      { loc: "/teams",                   pri: "0.75", freq: "weekly" },
      { loc: "/rankings",                pri: "0.8",  freq: "weekly" },
      { loc: "/news",                    pri: "0.85", freq: "hourly" },
      { loc: "/stats",                   pri: "0.75", freq: "daily"  },
      { loc: "/videos",                  pri: "0.65", freq: "daily"  },
      { loc: "/about",                   pri: "0.5",  freq: "monthly"},
      { loc: "/best-cricket-website",    pri: "0.85", freq: "daily"  },
    ];

    // Try to add live match URLs dynamically
    let matchUrls = "";
    // (async match injection happens in the main handler for /sitemap.xml)

    const urlEntries = pages.map(p =>
      `  <url><loc>${base}${p.loc}</loc><changefreq>${p.freq}</changefreq><priority>${p.pri}</priority><lastmod>${now}</lastmod></url>`
    ).join("\n");

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=300");
    res.status(200).send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`
    );
    return true;
  }
  if (url.includes("robots.txt")) {
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(
      "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /*.json$\nCrawl-delay: 1\n\n" +
      "User-agent: Googlebot\nAllow: /\nCrawl-delay: 0\n\n" +
      "Sitemap: https://www.livecricketzone.com/sitemap.xml"
    );
    return true;
  }
  if (url.includes("ads.txt")) {
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send("google.com, pub-8179151029580359, DIRECT, f08c47fec0942fa0");
    return true;
  }
  return false;
}

// ─── MAIN VERCEL HANDLER ─────────────────────────────────────────────────────

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (serveMeta(req.url || "", res)) return;

  // Parse path safely
  let path = "";
  try {
    const u = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    path = u.pathname.replace(/^\/api\//, "").replace(/^\/+|\/+$/g, "");
  } catch (_) {
    path = (req.url || "").split("?")[0].replace(/^\/api\//, "").replace(/^\/+|\/+$/g, "");
  }

  const parts = path.split("/").filter(Boolean);
  console.log(`[API] ${req.method} /${path}`);

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

    // ── All matches ─────────────────────────────────────────────────────────
    if (path === "matches/all") {
      const data = await getAllMatches();
      return res.json({ status: "success", data });
    }

    // ── Live matches ────────────────────────────────────────────────────────
    if (path === "matches/live" || path === "matches/current") {
      const all = await getAllMatches();
      return res.json({ status: "success", data: all.live });
    }

    // ── Upcoming matches ────────────────────────────────────────────────────
    if (path === "matches/upcoming" || path === "matches/schedule" || path === "schedule") {
      const all = await getAllMatches();
      return res.json({ status: "success", data: all.upcoming });
    }

    // ── Match commentary ─────────────────────────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "commentary") {
      const data = await getMatchCommentary(parts[1]);
      return res.json({ status: "success", data });
    }

    // ── Match scorecard ──────────────────────────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "scorecard") {
      const data = await getMatchScorecard(parts[1]);
      return res.json({ status: "success", data });
    }

    // ── Match score (live minimal) ───────────────────────────────────────────
    if (parts[0] === "matches" && parts[2] === "score") {
      const info = await getMatchInfo(parts[1]);
      return res.json({ status: "success", data: info.score || [] });
    }

    // ── Match info ───────────────────────────────────────────────────────────
    if (parts[0] === "matches" && parts[1] && !parts[2]) {
      const data = await getMatchInfo(parts[1]);
      return res.json({ status: "success", data });
    }

    // ── Rankings / Teams / Series / Players — stubs ─────────────────────────
    if (["rankings", "teams", "series", "players"].includes(parts[0])) {
      return res.json({ status: "success", data: [] });
    }

    // ── IndexNow submit-all ──────────────────────────────────────────────────
    if (path === "indexnow/submit-all") {
      const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";
      const base = "https://www.livecricketzone.com";
      const urls = [
        `${base}/`, `${base}/live`, `${base}/live-cricket-score`,
        `${base}/cricket-score-today`, `${base}/cricket-matches-today`,
        `${base}/ball-by-ball`, `${base}/ipl`, `${base}/t20-world-cup`,
        `${base}/world-cup`, `${base}/asia-cup`, `${base}/champions-trophy`,
        `${base}/psl`, `${base}/bbl`, `${base}/cpl`, `${base}/bpl`,
        `${base}/schedule`, `${base}/news`, `${base}/rankings`,
      ];
      try {
        const r = await fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({ host: "www.livecricketzone.com", key: INDEXNOW_KEY, keyLocation: `${base}/${INDEXNOW_KEY}.txt`, urlList: urls }),
        });
        return res.json({ status: "success", indexnow: r.status, count: urls.length });
      } catch (e) {
        return res.json({ status: "error", message: e.message });
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
