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
      { loc: "/watch-live",              pri: "0.95", freq: "always" },
      { loc: "/watch",                   pri: "0.9",  freq: "always" },
      { loc: "/live-stream",             pri: "0.9",  freq: "always" },
      { loc: "/county-championship",     pri: "0.95", freq: "hourly" },
      { loc: "/county-cricket",          pri: "0.92", freq: "hourly" },
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
    res.setHeader("X-Robots-Tag", "noindex");
    res.status(200).send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`
    );
    return true;
  }
  if (url.includes("robots.txt")) {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "s-maxage=86400");
    res.status(200).send(
      "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /*.json$\nCrawl-delay: 1\n\n" +
      "User-agent: Googlebot\nAllow: /\nCrawl-delay: 0\n\n" +
      "User-agent: Bingbot\nAllow: /\nCrawl-delay: 1\n\n" +
      "User-agent: adidxbot\nAllow: /\nCrawl-delay: 1\n\n" +
      "User-agent: msnbot\nAllow: /\nCrawl-delay: 1\n\n" +
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

// ─── BOT DETECTION ───────────────────────────────────────────────────────────

const BOT_UA = /googlebot|bingbot|adidxbot|bingpreview|msnbot|yandex|yandexbot|baiduspider|duckduckbot|slurp|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|rogerbot|screaming.frog|sitebulb|lighthouse|chrome-lighthouse|pagespeed|gtmetrix|petalbot|bytespider|gptbot|claudebot|ccbot/i;

function isBot(req) {
  return BOT_UA.test(req.headers["user-agent"] || "");
}

// ─── PAGE META MAP ────────────────────────────────────────────────────────────
// For each route, define what bots should see in <head>

const BASE = "https://www.livecricketzone.com";
const SITE = "Live Cricket Zone";

function getPageMeta(pathname) {
  const p = pathname.replace(/\/$/, "") || "/";

  const map = {
    "/": {
      title: `Live Cricket Score Today - IPL 2026 & T20 Live | ${SITE}`,
      desc: "Fastest live cricket score today. Ball-by-ball commentary, IPL 2026 live score, T20 World Cup, ODI & Test match scorecards updated every 15 seconds.",
      kw: "live cricket score, cricket score today, IPL 2026 live score, live match today, ball by ball commentary, cricket live score today",
    },
    "/live": {
      title: `Live Cricket Score Now - All Matches Live | ${SITE}`,
      desc: "All live cricket matches right now. Real-time scores, ball-by-ball commentary for every live match. IPL, T20, ODI, Test cricket live.",
      kw: "live cricket matches, cricket live now, live match today, cricket score live, live cricket score now",
    },
    "/live-cricket-score": {
      title: `Live Cricket Score - Real-Time Scores Today | ${SITE}`,
      desc: "Live cricket score today with real-time updates. Get live cricket scores for IPL 2026, T20 World Cup, ODI, Test matches. Ball-by-ball commentary updated every 15 seconds.",
      kw: "live cricket score, cricket live score today, live cricket score today, cricket score live, live score cricket",
    },
    "/cricket-score-today": {
      title: `Cricket Score Today - Live Match Updates | ${SITE}`,
      desc: "Cricket score today with live updates. Get today's cricket match scores, ball-by-ball commentary and live scorecard for all matches.",
      kw: "cricket score today, cricket today score, today cricket score, live cricket score today, cricket match score today",
    },
    "/cricket-matches-today": {
      title: `Cricket Matches Today - Live Schedule & Timings | ${SITE}`,
      desc: "All cricket matches today with live scores, match timings and ball-by-ball commentary. IPL, T20, ODI, Test cricket matches today.",
      kw: "cricket matches today, cricket today, today cricket match, cricket match today live, cricket schedule today",
    },
    "/ball-by-ball": {
      title: `Ball by Ball Cricket Commentary Live | ${SITE}`,
      desc: "Ball by ball cricket commentary live for all matches. Real-time ball-by-ball updates for IPL 2026, T20 World Cup, ODI and Test matches.",
      kw: "ball by ball cricket, ball by ball commentary, cricket ball by ball, live ball by ball, cricket commentary live",
    },
    "/ipl": {
      title: `IPL 2026 Live Score - Indian Premier League | ${SITE}`,
      desc: "IPL 2026 live score, ball-by-ball commentary, points table, schedule and match results. Real-time Indian Premier League 2026 updates.",
      kw: "IPL 2026 live score, IPL live score today, Indian Premier League 2026, IPL ball by ball, IPL scorecard, IPL points table 2026",
    },
    "/t20-world-cup": {
      title: `T20 World Cup 2026 Live Score - ICC T20 WC | ${SITE}`,
      desc: "T20 World Cup 2026 live score, ball-by-ball commentary, schedule and standings. Real-time ICC T20 World Cup 2026 updates.",
      kw: "T20 World Cup 2026 live score, ICC T20 World Cup live, T20 World Cup schedule 2026, T20 World Cup ball by ball",
    },
    "/world-cup": {
      title: `Cricket World Cup 2027 Live Score - ODI WC | ${SITE}`,
      desc: "ICC Cricket World Cup 2027 live score, ball-by-ball commentary, schedule and standings. Real-time ODI World Cup updates.",
      kw: "Cricket World Cup 2027 live score, ICC World Cup live, ODI World Cup live score, Cricket World Cup schedule 2027",
    },
    "/asia-cup": {
      title: `Asia Cup 2026 Live Score - India vs Pakistan | ${SITE}`,
      desc: "Asia Cup 2026 live score, ball-by-ball commentary and match results. India vs Pakistan live score and all Asia Cup 2026 matches.",
      kw: "Asia Cup 2026 live score, Asia Cup live score today, India vs Pakistan Asia Cup live, Asia Cup ball by ball",
    },
    "/champions-trophy": {
      title: `Champions Trophy 2025 Live Score - ICC CT | ${SITE}`,
      desc: "ICC Champions Trophy 2025 live score, ball-by-ball commentary, schedule and match results. Real-time Champions Trophy updates.",
      kw: "Champions Trophy 2025 live score, ICC Champions Trophy live, Champions Trophy live score today, Champions Trophy ball by ball",
    },
    "/womens-cricket": {
      title: `Women's Cricket Live Score 2026 - ICC WT20 | ${SITE}`,
      desc: "Women's cricket live score 2026 with ball-by-ball commentary. ICC Women's T20 World Cup, Women's ODI and Women's Test match updates.",
      kw: "women's cricket live score, ICC women's T20 World Cup live, women's cricket today, women's ODI live score",
    },
    "/t20": {
      title: `T20 Cricket Live Score Today - All T20 Matches | ${SITE}`,
      desc: "T20 cricket live score today. Real-time updates for all T20 matches — IPL 2026, T20 World Cup, PSL, BBL, CPL, BPL — with ball-by-ball commentary.",
      kw: "T20 cricket live score, T20 live score today, T20 cricket today, T20 matches today, T20 ball by ball",
    },
    "/odi": {
      title: `ODI Cricket Live Score Today - One Day Intl | ${SITE}`,
      desc: "ODI cricket live score today. Real-time One Day International match updates with ball-by-ball commentary. All ODI series covered.",
      kw: "ODI cricket live score, ODI live score today, One Day International live, ODI cricket today, ODI ball by ball",
    },
    "/test": {
      title: `Test Cricket Live Score Today - Test Matches | ${SITE}`,
      desc: "Test cricket live score today. Real-time Test match updates with ball-by-ball commentary, day-by-day scorecard and session reports.",
      kw: "Test cricket live score, Test match live score today, Test cricket today, Test match today, Test cricket ball by ball",
    },
    "/psl": {
      title: `PSL 2026 Live Score - Pakistan Super League | ${SITE}`,
      desc: "PSL 2026 live score, ball-by-ball commentary, points table, schedule and match results. Real-time Pakistan Super League 2026 updates.",
      kw: "PSL 2026 live score, Pakistan Super League live score, PSL live today, PSL ball by ball, PSL scorecard",
    },
    "/bbl": {
      title: `BBL 2026 Live Score - Big Bash League | ${SITE}`,
      desc: "BBL 2026 live score, ball-by-ball commentary, schedule and match results. Real-time Big Bash League 2026 updates.",
      kw: "BBL 2026 live score, Big Bash League live score, BBL live today, BBL ball by ball, BBL scorecard",
    },
    "/cpl": {
      title: `CPL 2026 Live Score - Caribbean Premier League | ${SITE}`,
      desc: "CPL 2026 live score, ball-by-ball commentary, schedule and match results. Real-time Caribbean Premier League 2026 updates.",
      kw: "CPL 2026 live score, Caribbean Premier League live score, CPL live today, CPL ball by ball",
    },
    "/bpl": {
      title: `BPL 2026 Live Score - Bangladesh Premier League | ${SITE}`,
      desc: "BPL 2026 live score, ball-by-ball commentary, schedule and match results. Real-time Bangladesh Premier League 2026 updates.",
      kw: "BPL 2026 live score, Bangladesh Premier League live score, BPL live today, BPL ball by ball",
    },
    "/schedule": {
      title: `Cricket Schedule 2026 - Fixtures & Timings | ${SITE}`,
      desc: "Complete cricket schedule 2026 with all upcoming match fixtures, timings and venues. IPL, T20 World Cup, ODI, Test match schedule.",
      kw: "cricket schedule 2026, cricket fixtures, upcoming cricket matches, cricket match schedule, cricket calendar 2026",
    },
    "/upcoming": {
      title: `Upcoming Cricket Matches 2026 - Schedule | ${SITE}`,
      desc: "All upcoming cricket matches with schedule, fixtures and timings. IPL 2026, T20 World Cup, ODI, Test matches upcoming schedule.",
      kw: "upcoming cricket matches, cricket upcoming matches, cricket fixtures 2026, next cricket match, cricket schedule upcoming",
    },
    "/results": {
      title: `Cricket Results - Latest Scores & Scorecards | ${SITE}`,
      desc: "Latest cricket match results, scores and full scorecards. IPL 2026, T20 World Cup, ODI, Test match results and highlights.",
      kw: "cricket results, cricket match results, cricket scores today, cricket scorecard results, latest cricket results",
    },
    "/series": {
      title: `Cricket Series 2026 - All Series & Tours | ${SITE}`,
      desc: "All cricket series 2026 — international tours, bilateral series, ICC tournaments. Live scores, schedules and results for every series.",
      kw: "cricket series 2026, cricket series schedule, international cricket series, cricket tour 2026",
    },
    "/players": {
      title: `Cricket Players - Stats & Profiles 2026 | ${SITE}`,
      desc: "Cricket player profiles, career statistics, batting and bowling averages, recent form. Search all international and IPL cricket players.",
      kw: "cricket players, cricket player stats, cricket player records, cricket player profile, IPL players 2026",
    },
    "/teams": {
      title: `Cricket Teams - International & IPL Profiles | ${SITE}`,
      desc: "All cricket teams — international and IPL. Team profiles, squad, recent form, head-to-head records and match history.",
      kw: "cricket teams, international cricket teams, IPL teams 2026, cricket team profiles, cricket squad",
    },
    "/rankings": {
      title: `ICC Cricket Rankings 2026 - Batsmen & Bowlers | ${SITE}`,
      desc: "Latest ICC cricket rankings 2026 for batsmen, bowlers, all-rounders and teams in Test, ODI and T20 formats.",
      kw: "ICC cricket rankings 2026, cricket rankings, ICC rankings batsmen, ICC rankings bowlers, ICC team rankings 2026",
    },
    "/news": {
      title: `Cricket News Today - Latest Updates | ${SITE}`,
      desc: "Latest cricket news today. Breaking cricket news, match previews, player updates, IPL 2026 news, T20 World Cup news and more.",
      kw: "cricket news today, latest cricket news, cricket news, IPL news 2026, cricket breaking news, cricket updates today",
    },
    "/stats": {
      title: `Cricket Statistics - Records & Career Stats | ${SITE}`,
      desc: "Comprehensive cricket statistics — batting averages, bowling figures, career records, highest scores, best bowling figures for all formats.",
      kw: "cricket statistics, cricket stats, cricket records, batting average cricket, bowling figures cricket, cricket career stats",
    },
    "/county-championship": {
      title: `County Championship 2026 Live Score - English County Cricket | ${SITE}`,
      desc: "County Championship 2026 live scores, ball-by-ball commentary, Division One and Division Two results. All 18 English counties covered — Surrey, Yorkshire, Lancashire, Hampshire, Kent and more. Live score updates every 15 seconds.",
      kw: "county championship 2026, county championship live score, county cricket live score, county championship today, county cricket today, division one cricket, division two cricket, english county cricket, surrey cricket, yorkshire cricket, lancashire cricket, hampshire cricket, kent cricket, essex cricket, county championship results, county championship table 2026",
    },
    "/county-cricket": {
      title: `County Cricket Live Score 2026 - All County Matches | ${SITE}`,
      desc: "County cricket live scores 2026 for all County Championship Division One and Division Two matches. Real-time ball-by-ball commentary for every English county cricket match.",
      kw: "county cricket live score, county cricket 2026, county cricket today, county cricket results, county cricket schedule, english county cricket live, county championship live",
    },
    "/watch-live": {
      title: `Watch Live Cricket Online Free - Live Stream 2026 | ${SITE}`,
      desc: "Watch live cricket match online free. Stream IPL 2026, T20 World Cup, ODI, Test matches live on YouTube. Free cricket live streaming — no signup required. Watch cricket live stream today.",
      kw: "watch live cricket, watch cricket live, live cricket streaming, watch live match, cricket live stream free, watch cricket online, live cricket match today, stream cricket live, watch ipl live, watch t20 world cup live, free cricket streaming, cricket live tv, watch cricket match online, live cricket video, cricket streaming sites, watch cricket live free online, cricket live stream today",
    },
    "/watch": {
      title: `Watch Live Cricket Stream Free - All Matches | ${SITE}`,
      desc: "Watch live cricket stream free online. All live cricket matches available to stream via YouTube. IPL 2026, T20 World Cup, ODI, Test cricket — watch free, no signup.",
      kw: "watch cricket live, watch live cricket, cricket live stream, watch cricket online free, cricket streaming free, live cricket watch, cricket live match watch, watch cricket match live",
    },
    "/live-stream": {
      title: `Live Cricket Stream - Watch Cricket Online Free | ${SITE}`,
      desc: "Live cricket stream for all matches. Watch cricket online free — IPL 2026, T20 World Cup, PSL, BBL, ODI, Test matches. Free live cricket streaming via YouTube.",
      kw: "live cricket stream, cricket live stream, cricket streaming, watch cricket live stream, live cricket streaming free, cricket online stream, cricket stream today",
    },
    "/videos": {
      title: `Cricket Videos - Highlights & Live Streams | ${SITE}`,
      desc: "Cricket videos — match highlights, live streams, best moments. Watch IPL 2026 highlights, T20 World Cup videos, ODI and Test match highlights free.",
      kw: "cricket videos, cricket highlights, cricket live stream video, IPL highlights, T20 World Cup highlights, cricket match video, cricket video online",
    },
  };

  // Match detail pages: /match/:id
  if (p.startsWith("/match/")) {
    const slug = p.replace("/match/", "");
    const vsMatch = slug.match(/^(.+?)-vs-(.+?)(?:-\d+)?$/i);
    if (vsMatch) {
      const t1 = vsMatch[1].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const t2 = vsMatch[2].replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      return {
        title: `Watch ${t1} vs ${t2} Live Stream Free - Live Cricket Score | ${SITE}`,
        desc: `Watch ${t1} vs ${t2} live stream free online. Live cricket score, ball-by-ball commentary, live scorecard and real-time match updates. Stream cricket live — no signup required.`,
        kw: `${t1} vs ${t2} live stream, watch ${t1} vs ${t2} live, ${t1} vs ${t2} live score, ${t1} ${t2} live cricket, watch cricket live free, live cricket stream free, ${t1} vs ${t2} scorecard, live cricket score today, ball by ball commentary`,
        canonical: `${BASE}${p}`,
      };
    }
    return {
      title: `Watch Live Cricket Stream Free - Live Score & Commentary | ${SITE}`,
      desc: "Watch live cricket stream free online. Live cricket score, full scorecard and ball-by-ball commentary. Stream cricket live — no signup required.",
      kw: "watch live cricket, live cricket stream free, live cricket score, cricket scorecard, ball by ball commentary, cricket match live, watch cricket online free",
      canonical: `${BASE}${p}`,
    };
  }

  const meta = map[p] || map["/"];
  return { ...meta, canonical: `${BASE}${p}` };
}

// ─── BOT HTML RENDERER ────────────────────────────────────────────────────────
// Serves a fully-formed HTML page to crawlers with all meta tags + visible content

function renderBotHtml(pathname, meta, liveMatches = [], recentMatches = []) {
  const liveHtml = liveMatches.length > 0
    ? liveMatches.slice(0, 10).map(m => `
      <article itemscope itemtype="https://schema.org/SportsEvent">
        <h3 itemprop="name"><a href="${BASE}/match/${m.id}">${m.name}</a></h3>
        <p itemprop="description">${m.status}${m.venue ? ` — ${m.venue}` : ""}</p>
        <meta itemprop="sport" content="Cricket"/>
      </article>`).join("")
    : "";

  const recentHtml = recentMatches.length > 0
    ? recentMatches.slice(0, 5).map(m => `
      <article>
        <h3><a href="${BASE}/match/${m.id}">${m.name}</a></h3>
        <p>${m.status}</p>
      </article>`).join("")
    : "";

  const sd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": meta.title,
    "description": meta.desc,
    "url": meta.canonical,
    "inLanguage": "en-US",
    "isPartOf": { "@type": "WebSite", "name": "Live Cricket Zone", "url": BASE },
    "publisher": {
      "@type": "Organization",
      "name": "Live Cricket Zone",
      "url": BASE,
      "logo": { "@type": "ImageObject", "url": `${BASE}/logo192.png` }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE },
        ...(pathname !== "/" ? [{ "@type": "ListItem", "position": 2, "name": meta.title.split("|")[0].trim(), "item": meta.canonical }] : [])
      ]
    }
  });

  const navLinks = [
    ["/", "Home"], ["/live", "Live Scores"], ["/watch-live", "Watch Live"],
    ["/ipl", "IPL 2026"], ["/t20-world-cup", "T20 World Cup"],
    ["/cricket-matches-today", "Today's Matches"],
    ["/schedule", "Schedule"], ["/results", "Results"], ["/news", "News"],
    ["/rankings", "ICC Rankings"], ["/players", "Players"], ["/teams", "Teams"],
    ["/ball-by-ball", "Ball by Ball"], ["/t20", "T20 Cricket"],
    ["/odi", "ODI Cricket"], ["/test", "Test Cricket"],
  ];

  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/WebPage">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${meta.title}</title>
  <meta name="description" content="${meta.desc}"/>
  <meta name="keywords" content="${meta.kw}"/>
  <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"/>
  <meta name="googlebot" content="index,follow"/>
  <meta name="bingbot" content="index,follow"/>
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
  <meta property="og:site_name" content="Live Cricket Zone"/>
  <meta property="og:locale" content="en_US"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${meta.title}"/>
  <meta name="twitter:description" content="${meta.desc}"/>
  <meta name="twitter:image" content="${BASE}/og-image.png"/>
  <meta name="twitter:site" content="@LiveCricketZone"/>
  <script type="application/ld+json">${sd}</script>
  <style>
    body{font-family:Arial,sans-serif;max-width:1200px;margin:0 auto;padding:16px;color:#1a1a1a;line-height:1.6}
    header{border-bottom:2px solid #00c853;padding-bottom:12px;margin-bottom:20px}
    h1{color:#00c853;margin:0 0 8px}
    nav a{margin-right:12px;color:#1565c0;text-decoration:none;font-size:14px}
    nav a:hover{text-decoration:underline}
    h2{color:#1a1a1a;border-left:4px solid #00c853;padding-left:10px}
    article{border:1px solid #e0e0e0;border-radius:6px;padding:12px;margin-bottom:10px}
    article h3{margin:0 0 4px;font-size:15px}
    article h3 a{color:#1565c0;text-decoration:none}
    article p{margin:0;color:#555;font-size:13px}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
    .link-card{border:1px solid #e0e0e0;border-radius:6px;padding:12px;text-align:center}
    .link-card a{color:#1565c0;text-decoration:none;font-weight:bold}
    footer{margin-top:40px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:12px;color:#777}
  </style>
</head>
<body>
  <header>
    <div style="font-size:22px;font-weight:bold"><a href="${BASE}" style="color:#00c853;text-decoration:none">🏏 Live Cricket Zone</a></div>
    <p itemprop="description" style="margin:4px 0 10px;color:#555;font-size:14px">Fastest live cricket scores, ball-by-ball commentary, IPL 2026, T20 World Cup &amp; all cricket updates</p>
    <nav aria-label="Main navigation">
      ${navLinks.map(([href, label]) => `<a href="${BASE}${href}">${label}</a>`).join("")}
    </nav>
  </header>

  <main>
    <h1>${meta.title.split("|")[0].trim()}</h1>
    <p style="font-size:15px;color:#333;margin-bottom:20px">${meta.desc}</p>

    ${liveMatches.length > 0 ? `
    <section aria-label="Live cricket matches">
      <h2>🔴 Live Cricket Matches Right Now</h2>
      ${liveHtml}
    </section>` : ""}

    ${recentMatches.length > 0 ? `
    <section aria-label="Recent cricket results">
      <h2>✅ Recent Match Results</h2>
      ${recentHtml}
    </section>` : ""}

    <section aria-label="Cricket tournaments">
      <h2>🏆 Cricket Tournaments &amp; Leagues</h2>
      <div class="grid">
        <div class="link-card"><a href="${BASE}/ipl">IPL 2026 Live Score</a><br/><small>Indian Premier League</small></div>
        <div class="link-card"><a href="${BASE}/t20-world-cup">T20 World Cup 2026</a><br/><small>ICC T20 World Cup</small></div>
        <div class="link-card"><a href="${BASE}/world-cup">Cricket World Cup 2027</a><br/><small>ICC ODI World Cup</small></div>
        <div class="link-card"><a href="${BASE}/asia-cup">Asia Cup 2026</a><br/><small>India vs Pakistan</small></div>
        <div class="link-card"><a href="${BASE}/champions-trophy">Champions Trophy 2025</a><br/><small>ICC Champions Trophy</small></div>
        <div class="link-card"><a href="${BASE}/psl">PSL 2026 Live Score</a><br/><small>Pakistan Super League</small></div>
        <div class="link-card"><a href="${BASE}/bbl">BBL 2026 Live Score</a><br/><small>Big Bash League</small></div>
        <div class="link-card"><a href="${BASE}/cpl">CPL 2026 Live Score</a><br/><small>Caribbean Premier League</small></div>
        <div class="link-card"><a href="${BASE}/bpl">BPL 2026 Live Score</a><br/><small>Bangladesh Premier League</small></div>
        <div class="link-card"><a href="${BASE}/womens-cricket">Women's Cricket</a><br/><small>ICC Women's T20 &amp; ODI</small></div>
        <div class="link-card"><a href="${BASE}/county-championship">County Championship 2026</a><br/><small>English County Cricket</small></div>
      </div>
    </section>

    <section aria-label="Cricket formats">
      <h2>🏏 Cricket Formats</h2>
      <div class="grid">
        <div class="link-card"><a href="${BASE}/t20">T20 Cricket Live Score</a><br/><small>Twenty20 matches</small></div>
        <div class="link-card"><a href="${BASE}/odi">ODI Cricket Live Score</a><br/><small>One Day International</small></div>
        <div class="link-card"><a href="${BASE}/test">Test Cricket Live Score</a><br/><small>5-day Test matches</small></div>
        <div class="link-card"><a href="${BASE}/ball-by-ball">Ball by Ball Commentary</a><br/><small>Real-time commentary</small></div>
      </div>
    </section>

    <section aria-label="About Live Cricket Zone">
      <h2>About Live Cricket Zone</h2>
      <p>Live Cricket Zone is your ultimate destination for <strong>live cricket scores</strong> with real-time ball-by-ball commentary updated every 15 seconds. We cover all major cricket tournaments including <strong>IPL 2026 live score</strong>, <strong>T20 World Cup 2026</strong>, ODI World Cup, Asia Cup, Champions Trophy, PSL, BBL, CPL, BPL and all international cricket.</p>
      <p>Our <strong>cricket score today</strong> service is faster than Cricbuzz and ESPNcricinfo. Get <strong>live cricket match</strong> updates, full scorecards, toss results, player statistics, ICC rankings 2026, cricket news and match schedules — all in one place.</p>
      <h3>Why Choose Live Cricket Zone?</h3>
      <ul>
        <li>Fastest live cricket score — updated every 15 seconds</li>
        <li>Ball-by-ball commentary for every match</li>
        <li>Complete scorecards with batting and bowling figures</li>
        <li>IPL 2026 live score, points table and schedule</li>
        <li>T20 World Cup 2026 live updates</li>
        <li>ICC rankings 2026 for batsmen, bowlers and teams</li>
        <li>Cricket news today from all major sources</li>
        <li>Player profiles and career statistics</li>
        <li>Free — no subscription required</li>
      </ul>
    </section>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} Live Cricket Zone — <a href="${BASE}">livecricketzone.com</a> | 
    <a href="${BASE}/about">About</a> | 
    <a href="${BASE}/sitemap.xml">Sitemap</a> | 
    <a href="${BASE}/news">Cricket News</a></p>
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
  if (serveMeta(req.url || "", res)) return;

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
      let liveMatches = [], recentMatches = [];
      // For homepage, live page and today page — inject actual match data
      if (pathname === "/" || pathname === "/live" || pathname === "/cricket-matches-today" || pathname === "/cricket-score-today") {
        try {
          const all = await getAllMatches();
          liveMatches = all.live || [];
          recentMatches = all.recent || [];
        } catch (_) {}
      }
      const html = renderBotHtml(pathname, meta, liveMatches, recentMatches);
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

    // ── YouTube search ───────────────────────────────────────────────────────
    if (path === "youtube/search") {
      const q = new URL(req.url, `http://${req.headers.host || "localhost"}`).searchParams.get("q");
      if (!q) return res.status(400).json({ error: "Missing query" });
      const cacheKey = `yt-${q}`;
      const ytCached = cache.get(cacheKey);
      if (ytCached) return res.json(ytCached);
      try {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=EgJAAQ%3D%3D`;
        const { data: ytHtml } = await axios.get(searchUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", "Accept-Language": "en-US,en;q=0.9" },
          timeout: 10000,
        });
        const ytMatch = ytHtml.match(/var ytInitialData = ({.+?});<\/script>/s);
        if (!ytMatch) throw new Error("ytInitialData not found");
        const ytData = JSON.parse(ytMatch[1]);
        const contents = ytData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
        const videos = [];
        for (const item of contents) {
          const vr = item.videoRenderer;
          if (!vr?.videoId) continue;
          videos.push({
            videoId: vr.videoId,
            title: vr.title?.runs?.[0]?.text || "",
            thumbnail: `https://img.youtube.com/vi/${vr.videoId}/mqdefault.jpg`,
            isLive: !!vr.badges?.some(b => b.metadataBadgeRenderer?.label === "LIVE"),
            channel: vr.ownerText?.runs?.[0]?.text || "",
          });
          if (videos.length >= 5) break;
        }
        const ytResult = { videos };
        cache.set(cacheKey, ytResult, 300);
        return res.json(ytResult);
      } catch (e) {
        return res.json({ videos: [], error: e.message });
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
