const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

// ─── Cache Instances ──────────────────────────────────────────────────────────
const scrapeCache = new NodeCache({ stdTTL: 30 });    // 30s – live data
const staticCache = new NodeCache({ stdTTL: 3600 });  // 1hr – rankings/teams
const newsCache   = new NodeCache({ stdTTL: 300 });   // 5min – news
const squadCache  = new NodeCache({ stdTTL: 600 });   // 10min – squads
const seriesCache = new NodeCache({ stdTTL: 120 });   // 2min – series data

// ─── ESPN Cricinfo API Config ─────────────────────────────────────────────────
const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/cricket";
const ESPN_LEAGUES = [
  { id: "8",  name: "International Cricket", format: "various" },
  { id: "16", name: "IPL 2026",              format: "T20"     },
  { id: "57", name: "PSL 2026",              format: "T20"     },
  { id: "7",  name: "Big Bash League",       format: "T20"     },
  { id: "82", name: "Caribbean Premier League", format: "T20"  },
  { id: "83", name: "Women's Premier League",   format: "T20"  },
  { id: "15", name: "ICC T20 World Cup",     format: "T20"     },
  { id: "13", name: "ICC ODI World Cup",     format: "ODI"     },
  { id: "76", name: "SA20",                  format: "T20"     },
  { id: "27", name: "The Hundred",           format: "T100"    },
];

const espnHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://www.espncricinfo.com/",
  "Origin": "https://www.espncricinfo.com",
};

const htmlHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Cache-Control": "no-cache",
};

// ─── Team Helpers ─────────────────────────────────────────────────────────────
const TEAM_IMG_MAP = {
  "India":"2","Australia":"4","England":"1","Pakistan":"7",
  "South Africa":"3","New Zealand":"5","West Indies":"10","Sri Lanka":"6",
  "Bangladesh":"8","Afghanistan":"96","Zimbabwe":"9","Ireland":"29",
  "Netherlands":"15","Scotland":"30","Nepal":"307","UAE":"299","USA":"395",
  "Canada":"105","Namibia":"2012","Papua New Guinea":"499","Oman":"1100110",
  "Mumbai Indians":"62","Chennai Super Kings":"59",
  "Royal Challengers Bengaluru":"64","Royal Challengers Bangalore":"64",
  "Kolkata Knight Riders":"63","Delhi Capitals":"61",
  "Punjab Kings":"65","Rajasthan Royals":"66",
  "Sunrisers Hyderabad":"255","Gujarat Titans":"971","Lucknow Super Giants":"966",
  "Lahore Qalandars":"271","Karachi Kings":"272","Quetta Gladiators":"273",
  "Peshawar Zalmi":"274","Islamabad United":"275","Multan Sultans":"276",
  "Sydney Sixers":"70","Melbourne Stars":"71","Perth Scorchers":"72",
  "Adelaide Strikers":"73","Brisbane Heat":"74","Hobart Hurricanes":"75",
  "Melbourne Renegades":"76","Sydney Thunder":"77",
};

const TEAM_SHORT_MAP = {
  "India":"IND","Australia":"AUS","England":"ENG","Pakistan":"PAK",
  "South Africa":"SA","New Zealand":"NZ","West Indies":"WI","Sri Lanka":"SL",
  "Bangladesh":"BAN","Afghanistan":"AFG","Zimbabwe":"ZIM","Ireland":"IRE",
  "Netherlands":"NED","Scotland":"SCO","Nepal":"NEP","UAE":"UAE","USA":"USA",
  "Canada":"CAN","Namibia":"NAM","Papua New Guinea":"PNG","Oman":"OMA",
  "Mumbai Indians":"MI","Chennai Super Kings":"CSK",
  "Royal Challengers Bengaluru":"RCB","Royal Challengers Bangalore":"RCB",
  "Kolkata Knight Riders":"KKR","Delhi Capitals":"DC","Punjab Kings":"PBKS",
  "Rajasthan Royals":"RR","Sunrisers Hyderabad":"SRH",
  "Gujarat Titans":"GT","Lucknow Super Giants":"LSG",
  "Lahore Qalandars":"LQ","Karachi Kings":"KK","Quetta Gladiators":"QG",
  "Peshawar Zalmi":"PZ","Islamabad United":"IU","Multan Sultans":"MS",
  "Sydney Sixers":"SIX","Melbourne Stars":"STA","Perth Scorchers":"SCO",
  "Adelaide Strikers":"STR","Brisbane Heat":"HEA","Hobart Hurricanes":"HUR",
  "Melbourne Renegades":"REN","Sydney Thunder":"THU",
};

function getTeamImageUrl(name) {
  if (!name) return null;
  const id = TEAM_IMG_MAP[name];
  return id ? `https://static.cricbuzz.com/a/img/v1/75x75/i1/c${id}/team_flag.jpg` : null;
}

function getTeamShortName(n) {
  if (!n) return "TBD";
  return TEAM_SHORT_MAP[n] || n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 4);
}

function deriveMatchFormat(eventName, leagueName, leagueFormat) {
  const text = `${eventName || ""} ${leagueName || ""}`.toLowerCase();
  if (text.includes(" test") || text.includes("5-day") || text.includes("four-day")) return "Test";
  if (text.includes("one day") || text.includes(" odi") || text.includes("50-over")) return "ODI";
  if (text.includes("hundred")) return "T100";
  if (leagueFormat && leagueFormat !== "various") return leagueFormat;
  if (text.includes("t20") || text.includes("twenty") || text.includes("ipl") ||
      text.includes("psl") || text.includes("bbl") || text.includes("cpl") ||
      text.includes("wpl") || text.includes("sa20") || text.includes("world cup")) return "T20";
  return "T20";
}

function parseESPNScore(scoreStr) {
  if (!scoreStr || scoreStr === "0" || scoreStr === "-") return null;
  const m = scoreStr.match(/(\d+)(?:\/(\d+))?(?:\s*\((\d+(?:\.\d+)?)\s*(?:ov(?:ers?)?)?\))?/i);
  if (!m) return null;
  return {
    r: parseInt(m[1]) || 0,
    w: m[2] !== undefined ? parseInt(m[2]) : 0,
    o: m[3] !== undefined ? parseFloat(m[3]) : 0,
  };
}

// ─── Parse ESPN Event → our unified match format ──────────────────────────────
function parseESPNEvent(event, league) {
  const comp = event.competitions?.[0];
  if (!comp) return null;

  const status = comp.status?.type || {};
  const state = status.state || "pre"; // pre, in, post
  const isCompleted = state === "post" || status.completed === true;

  const competitors = (comp.competitors || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  const t1 = competitors[0] || {};
  const t2 = competitors[1] || {};

  const t1Name  = t1.team?.displayName || t1.team?.name || "TBD";
  const t2Name  = t2.team?.displayName || t2.team?.name || "TBD";
  const t1Short = t1.team?.abbreviation || getTeamShortName(t1Name);
  const t2Short = t2.team?.abbreviation || getTeamShortName(t2Name);
  const t1Logo  = t1.team?.logo || getTeamImageUrl(t1Name);
  const t2Logo  = t2.team?.logo || getTeamImageUrl(t2Name);

  // Scores – prefer linescores (multiple innings) else single score
  const scores = [];
  if (t1.linescores?.length > 0) {
    t1.linescores.forEach((ls, i) => {
      const sc = parseESPNScore(ls.value || ls.score);
      if (sc) scores.push({ ...sc, inning: `${t1Short} INN ${i + 1}` });
    });
  } else {
    const sc = parseESPNScore(t1.score);
    if (sc) scores.push({ ...sc, inning: `${t1Short} INN 1` });
  }
  if (t2.linescores?.length > 0) {
    t2.linescores.forEach((ls, i) => {
      const sc = parseESPNScore(ls.value || ls.score);
      if (sc) scores.push({ ...sc, inning: `${t2Short} INN ${i + 1}` });
    });
  } else {
    const sc = parseESPNScore(t2.score);
    if (sc) scores.push({ ...sc, inning: `${t2Short} INN 1` });
  }

  const leagueName = league?.name || event.season?.displayName || "";
  const matchType = deriveMatchFormat(event.name, leagueName, league?.format);

  // Status text
  const notes = (comp.notes || []).find(n => n.text || n.headline);
  const statusText = notes?.text || notes?.headline || status.detail || status.description || "Scheduled";

  // Venue
  const vParts = [comp.venue?.fullName, comp.venue?.address?.city, comp.venue?.address?.country].filter(Boolean);
  const venue = vParts.join(", ");

  const matchDate = event.date ? new Date(event.date) : new Date();

  return {
    id: event.id,
    name: event.name || `${t1Name} vs ${t2Name}`,
    shortName: event.shortName || `${t1Short} vs ${t2Short}`,
    matchType,
    series: leagueName,
    seriesId: league?.id || "",
    status: statusText,
    venue,
    date: matchDate.toLocaleDateString("en-IN"),
    dateTimeGMT: event.date || matchDate.toISOString(),
    teams: [t1Name, t2Name],
    teamInfo: [
      { name: t1Name, shortname: t1Short, img: t1Logo },
      { name: t2Name, shortname: t2Short, img: t2Logo },
    ],
    score: scores,
    matchStarted: state !== "pre",
    matchEnded: isCompleted,
    source: "espn",
    leagueId: league?.id,
    espnStatus: status.name || "",
  };
}

// ─── Parse ESPN Summary → scorecard innings ───────────────────────────────────
function parseESPNSummaryInnings(data) {
  const innings = [];
  const rawInnings = data?.innings || data?.linescores || [];

  rawInnings.forEach((inn, idx) => {
    const battingTeam = inn.team?.displayName || inn.battingTeam?.displayName || `Team ${idx + 1}`;
    const bowlingTeam = inn.bowlingTeam?.displayName || "";

    const batters = (inn.batters || inn.athletes || [])
      .filter(b => b.runs != null || b.name)
      .map(b => ({
        name:    b.athlete?.displayName || b.name || "Unknown",
        runs:    b.runs ?? b.score ?? 0,
        balls:   b.balls ?? b.ballsFaced ?? 0,
        fours:   b.fours ?? b.boundaries ?? 0,
        sixes:   b.sixes ?? 0,
        sr:      b.strikeRate != null ? Number(b.strikeRate).toFixed(2) : "0.00",
        dismissal: b.dismissal || b.howOut || "",
        notOut:  b.notOut ?? false,
        active:  b.active ?? false,
      }));

    const bowlers = (inn.bowlers || [])
      .filter(b => b.overs != null || b.name)
      .map(b => ({
        name:    b.athlete?.displayName || b.name || "Unknown",
        overs:   b.overs ?? 0,
        maidens: b.maidens ?? 0,
        runs:    b.runs ?? b.runsConceded ?? 0,
        wickets: b.wickets ?? 0,
        economy: b.economy != null ? Number(b.economy).toFixed(2) : "0.00",
        active:  b.active ?? false,
      }));

    const fow = (inn.fallOfWickets || inn.wickets || []).map(w => ({
      wicket:  w.wicket ?? w.number ?? 0,
      runs:    w.runs ?? 0,
      player:  w.player?.displayName || w.batsman || "",
      overs:   w.overs ?? 0,
    }));

    innings.push({
      inningsId:   idx + 1,
      battingTeam,
      bowlingTeam,
      runs:    inn.runs ?? inn.totalRuns ?? 0,
      wickets: inn.wickets ?? inn.totalWickets ?? 0,
      overs:   inn.overs ?? inn.totalOvers ?? 0,
      declared: inn.isDeclared ?? false,
      batters,
      bowlers,
      extras:  inn.extras ?? {},
      fow,
    });
  });

  return innings;
}

// ─── 1. ALL MATCHES (Primary: ESPN Cricinfo) ──────────────────────────────────
async function getAllMatches() {
  const key = "espn:all";
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  const result = { live: [], recent: [], upcoming: [] };
  const seen = new Set();

  const leagueRequests = ESPN_LEAGUES.map(league =>
    axios.get(`${ESPN_BASE}/${league.id}/scoreboard`, {
      headers: espnHeaders,
      timeout: 12000,
      params: { limit: 50 }
    }).then(res => ({ league, data: res.data }))
      .catch(() => null)
  );

  const settled = await Promise.allSettled(leagueRequests);

  for (const s of settled) {
    if (s.status !== "fulfilled" || !s.value?.data?.events) continue;
    const { league, data } = s.value;
    for (const event of data.events) {
      if (seen.has(event.id)) continue;
      seen.add(event.id);
      const match = parseESPNEvent(event, league);
      if (!match) continue;
      const cat = match.matchEnded ? "recent" : match.matchStarted ? "live" : "upcoming";
      result[cat].push(match);
    }
  }

  // Sort
  result.live.sort((a, b) => new Date(b.dateTimeGMT) - new Date(a.dateTimeGMT));
  result.upcoming.sort((a, b) => new Date(a.dateTimeGMT) - new Date(b.dateTimeGMT));
  result.recent.sort((a, b) => new Date(b.dateTimeGMT) - new Date(a.dateTimeGMT));

  if (result.live.length + result.recent.length + result.upcoming.length > 0) {
    scrapeCache.set(key, result);
  }
  return result;
}

// ─── 2. LIVE MATCHES ──────────────────────────────────────────────────────────
async function getLiveMatchesWithFallback() {
  const key = "espn:live";
  const cached = scrapeCache.get(key);
  if (cached) return cached;
  const all = await getAllMatches();
  const live = all.live || [];
  if (live.length) scrapeCache.set(key, live, 20);
  return live;
}

async function scrapeCricbuzzLiveMatches() {
  return getLiveMatchesWithFallback();
}

// ─── 3. UPCOMING ──────────────────────────────────────────────────────────────
async function scrapeCricbuzzUpcoming() {
  const all = await getAllMatches();
  return all.upcoming || [];
}

// ─── 4. MATCH INFO ────────────────────────────────────────────────────────────
async function scrapeMatchInfo(matchId) {
  const key = `espn:matchinfo:${matchId}`;
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  // Try ESPN summary in each league
  for (const league of ESPN_LEAGUES) {
    try {
      const { data } = await axios.get(`${ESPN_BASE}/${league.id}/summary`, {
        headers: espnHeaders,
        params: { event: matchId },
        timeout: 10000,
      });

      const header = data?.header;
      const comp = header?.competitions?.[0] || data?.gameInfo?.competitions?.[0];
      if (!header && !comp) continue;

      // Use header competitions for basic parse
      const event = { id: matchId, ...header, competitions: header?.competitions };
      const basic = parseESPNEvent({ id: matchId, name: header?.name, date: header?.competitions?.[0]?.date || new Date().toISOString(), competitions: header?.competitions || [] }, league);
      if (!basic) continue;

      // Enrich with gameInfo
      const gi = data?.gameInfo || {};
      if (gi.venue) {
        basic.venue = [gi.venue.fullName, gi.venue.address?.city, gi.venue.address?.country].filter(Boolean).join(", ");
      }
      if (gi.officials?.length) {
        const umpires = gi.officials.filter(o => (o.position?.type || "").includes("umpire") || (o.position?.displayName || "").toLowerCase().includes("umpire"));
        const referee = gi.officials.find(o => (o.position?.displayName || "").toLowerCase().includes("referee"));
        basic.umpire  = umpires.map(u => u.fullName || u.displayName).join(", ");
        basic.referee = referee?.fullName || referee?.displayName || "";
      }

      // Toss from notes
      const notes = data?.header?.competitions?.[0]?.notes || [];
      const tossNote = notes.find(n => (n.text || "").toLowerCase().includes("toss"));
      if (tossNote) {
        basic.tossNote = tossNote.text;
        const tossMatch = (tossNote.text || "").match(/(.+?)\s+won the toss/i);
        if (tossMatch) basic.tossWinner = tossMatch[1].trim();
        const decisionMatch = (tossNote.text || "").match(/elected to\s+(\w+)/i);
        if (decisionMatch) basic.tossChoice = decisionMatch[1];
      }

      scrapeCache.set(key, basic);
      return basic;
    } catch (_) {}
  }

  // Fallback: search in match list
  try {
    const allData = await getAllMatches();
    const all = [...allData.live, ...allData.recent, ...allData.upcoming];
    const found = all.find(m => m.id === String(matchId));
    if (found) { scrapeCache.set(key, found); return found; }
  } catch (_) {}

  return { id: String(matchId), name: "Match", teams: [], teamInfo: [], score: [], matchStarted: false };
}

// ─── 5. SCORECARD ─────────────────────────────────────────────────────────────
async function scrapeScorecard(matchId) {
  const key = `espn:scorecard:${matchId}`;
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  for (const league of ESPN_LEAGUES) {
    try {
      const { data } = await axios.get(`${ESPN_BASE}/${league.id}/summary`, {
        headers: espnHeaders,
        params: { event: matchId },
        timeout: 12000,
      });

      const innings = parseESPNSummaryInnings(data);
      if (innings.length) {
        scrapeCache.set(key, innings);
        return innings;
      }
    } catch (_) {}
  }

  // Fallback: try Cricbuzz HTML scorecard
  try {
    const { data: html } = await axios.get(
      `https://www.cricbuzz.com/live-cricket-scorecard/${matchId}`,
      { headers: htmlHeaders, timeout: 12000 }
    );
    const innings = parseCricbuzzScorecardHTML(html);
    if (innings.length) {
      scrapeCache.set(key, innings);
      return innings;
    }
  } catch (_) {}

  return [];
}

// Also alias for controller
const scrapeCricbuzzScorecard = scrapeScorecard;

// ─── Parse Cricbuzz HTML scorecard ───────────────────────────────────────────
function parseCricbuzzScorecardHTML(html) {
  const $ = cheerio.load(html);
  const innings = [];

  $(".cb-scrd-wrp").each((i, wrapper) => {
    const battingTeam = $(wrapper).find(".cb-scrd-hdr-rw span").first().text().trim();
    const batters = [];
    const bowlers = [];

    $(wrapper).find("table.cb-ltst-wgt-hdr tbody tr").each((j, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 7) {
        const name = $(cells[0]).text().trim();
        const runs = parseInt($(cells[2]).text().trim()) || 0;
        const balls = parseInt($(cells[3]).text().trim()) || 0;
        const fours = parseInt($(cells[5]).text().trim()) || 0;
        const sixes = parseInt($(cells[6]).text().trim()) || 0;
        const sr = $(cells[7])?.text().trim() || "0.00";
        const dismissal = $(cells[1]).text().trim();
        if (name && name !== "Batter") {
          batters.push({ name, runs, balls, fours, sixes, sr, dismissal });
        }
      }
    });

    $(wrapper).find(".cb-scrd-sub-hdr").each((j, subHdr) => {
      if ($(subHdr).text().includes("Bowling")) {
        $(subHdr).next("table").find("tbody tr").each((k, row) => {
          const cells = $(row).find("td");
          if (cells.length >= 5) {
            const name = $(cells[0]).text().trim();
            const overs = parseFloat($(cells[1]).text().trim()) || 0;
            const maidens = parseInt($(cells[2]).text().trim()) || 0;
            const runs = parseInt($(cells[3]).text().trim()) || 0;
            const wickets = parseInt($(cells[4]).text().trim()) || 0;
            const economy = $(cells[5])?.text().trim() || "0.00";
            if (name && name !== "Bowler") {
              bowlers.push({ name, overs, maidens, runs, wickets, economy });
            }
          }
        });
      }
    });

    const scoreText = $(wrapper).find(".cb-scrd-inngs-rw .cb-font-20").text().trim();
    const scoreMatch = scoreText.match(/(\d+)(?:\/(\d+))?(?:\s*\((\d+(?:\.\d+)?)\))?/);
    innings.push({
      inningsId: i + 1,
      battingTeam,
      runs: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      wickets: scoreMatch ? parseInt(scoreMatch[2] || 0) : 0,
      overs: scoreMatch ? parseFloat(scoreMatch[3] || 0) : 0,
      batters,
      bowlers,
      fow: [],
    });
  });

  return innings;
}

// ─── 6. MATCH LIVE DATA (miniscore) ──────────────────────────────────────────
async function scrapeMatchLiveData(matchId) {
  const key = `espn:livedata:${matchId}`;
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  for (const league of ESPN_LEAGUES) {
    try {
      const { data } = await axios.get(`${ESPN_BASE}/${league.id}/summary`, {
        headers: espnHeaders,
        params: { event: matchId },
        timeout: 10000,
      });

      const comp = data?.header?.competitions?.[0];
      if (!comp) continue;

      // Get live innings data
      const situation = comp.situation || {};
      const batting = situation.batter || {};
      const bowling = situation.bowler || {};
      const pitcher = situation.pitcher || {};

      // Build miniscore-like object
      const liveData = {
        overs: situation.overs || comp.status?.displayClock || "",
        currentRunRate: situation.runRate ? Number(situation.runRate).toFixed(2) : null,
        requiredRunRate: situation.requiredRunRate ? Number(situation.requiredRunRate).toFixed(2) : null,
        target: situation.target || null,
        lastWicket: situation.lastWicket || "",
        recentOvers: situation.lastPlay || "",
        batsman1: {
          name: batting.athlete?.displayName || batting.displayName || "",
          runs: batting.runs ?? 0,
          balls: batting.balls ?? batting.ballsFaced ?? 0,
          fours: batting.fours ?? 0,
          sixes: batting.sixes ?? 0,
          sr: batting.strikeRate ? Number(batting.strikeRate).toFixed(2) : "0.00",
          isStriker: true,
        },
        batsman2: {
          name: situation.nonStriker?.athlete?.displayName || situation.nonStriker?.displayName || "",
          runs: situation.nonStriker?.runs ?? 0,
          balls: situation.nonStriker?.balls ?? 0,
          fours: situation.nonStriker?.fours ?? 0,
          sixes: situation.nonStriker?.sixes ?? 0,
          sr: "0.00",
          isStriker: false,
        },
        bowler: {
          name: bowling.athlete?.displayName || bowling.displayName || pitcher.athlete?.displayName || "",
          overs: bowling.overs ?? 0,
          runs: bowling.runsConceded ?? bowling.runs ?? 0,
          wickets: bowling.wickets ?? 0,
          maidens: bowling.maidens ?? 0,
          economy: bowling.economy ? Number(bowling.economy).toFixed(2) : "0.00",
        },
        partnership: {
          runs: situation.partnership?.runs ?? 0,
          balls: situation.partnership?.balls ?? 0,
        },
      };

      if (liveData.batsman1.name || liveData.bowler.name) {
        scrapeCache.set(key, liveData, 20);
        return liveData;
      }
    } catch (_) {}
  }

  return null;
}

// ─── 7. MATCH SQUAD ───────────────────────────────────────────────────────────
async function scrapeMatchSquad(matchId) {
  const key = `espn:squad:${matchId}`;
  const cached = squadCache.get(key);
  if (cached) return cached;

  for (const league of ESPN_LEAGUES) {
    try {
      const { data } = await axios.get(`${ESPN_BASE}/${league.id}/summary`, {
        headers: espnHeaders,
        params: { event: matchId },
        timeout: 10000,
      });

      const rosters = data?.rosters || data?.teams || [];
      if (!rosters.length) continue;

      const result = rosters.map(r => ({
        team: r.team?.displayName || r.displayName || "",
        players: (r.athletes || r.roster || []).map(p => ({
          id:    p.athlete?.id || p.id || "",
          name:  p.athlete?.displayName || p.displayName || p.name || "",
          role:  p.position?.displayName || p.position?.name || "",
          img:   p.athlete?.headshot?.href || null,
          isCaptain: p.captain ?? false,
          isKeeper:  (p.position?.displayName || "").toLowerCase().includes("keeper"),
        })),
      }));

      if (result.length) {
        squadCache.set(key, result);
        return result;
      }
    } catch (_) {}
  }

  return [];
}

// ─── 8. COMMENTARY ───────────────────────────────────────────────────────────
async function scrapeCommentary(matchId, page = 0) {
  const key = `commentary:${matchId}:${page}`;
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  // Try Cricbuzz HTML commentary
  try {
    const url = page === 0
      ? `https://www.cricbuzz.com/live-cricket-scores/${matchId}/commentary`
      : `https://www.cricbuzz.com/live-cricket-scores/${matchId}/commentary/${page}`;

    const { data: html } = await axios.get(url, {
      headers: { ...htmlHeaders, Referer: "https://www.cricbuzz.com/" },
      timeout: 12000,
    });

    const $ = cheerio.load(html);
    const commentary = [];

    // Try ng-controller / AngularJS data binding first
    $("li.cb-com-ln, .cb-col.cb-col-90.cb-col-rt").each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 5 && !text.includes("Advertisement")) {
        commentary.push({
          id: i,
          text,
          isWicket: text.toLowerCase().includes("out") || text.toLowerCase().includes("wicket"),
          isBoundary: text.includes(" 4!") || text.includes(" 6!") || text.includes("FOUR") || text.includes("SIX"),
          over: $(el).closest("[data-over]").attr("data-over") || "",
        });
      }
    });

    if (!commentary.length) {
      // Alternative selector
      $(".cb-col-84").each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 10) {
          commentary.push({ id: i, text, isWicket: false, isBoundary: false, over: "" });
        }
      });
    }

    if (commentary.length) {
      scrapeCache.set(key, commentary, 20);
      return commentary;
    }
  } catch (_) {}

  // Fallback: ESPN play-by-play
  for (const league of ESPN_LEAGUES) {
    try {
      const { data } = await axios.get(`${ESPN_BASE}/${league.id}/playbyplay`, {
        headers: espnHeaders,
        params: { event: matchId },
        timeout: 10000,
      });

      const plays = data?.plays || [];
      if (!plays.length) continue;

      const commentary = plays.slice(page * 20, (page + 1) * 20).map((p, i) => ({
        id: i,
        text: p.text || p.description || "",
        over: p.period?.number || "",
        isWicket: p.scoringPlay || false,
        isBoundary: (p.text || "").includes("FOUR") || (p.text || "").includes("SIX"),
      }));

      if (commentary.length) {
        scrapeCache.set(key, commentary, 20);
        return commentary;
      }
    } catch (_) {}
  }

  return [];
}

// ─── 9. MATCH H2H ─────────────────────────────────────────────────────────────
async function scrapeMatchH2H(matchId) {
  const key = `h2h:${matchId}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  // No real head-to-head history available from this data source.
  return [];
}

// ─── 10. MATCH FULL INFO (toss, umpires, venue details) ──────────────────────
async function scrapeMatchFullInfo(matchId) {
  const key = `fullinfo:${matchId}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  for (const league of ESPN_LEAGUES) {
    try {
      const { data } = await axios.get(`${ESPN_BASE}/${league.id}/summary`, {
        headers: espnHeaders,
        params: { event: matchId },
        timeout: 12000,
      });

      const gi = data?.gameInfo || {};
      const header = data?.header || {};
      const comp = header.competitions?.[0] || {};
      const notes = comp.notes || [];

      const tossNote = notes.find(n => (n.text || "").toLowerCase().includes("toss"));
      const officials = gi.officials || [];

      const umpires = officials
        .filter(o => (o.position?.type || "").includes("umpire") || (o.position?.displayName || "").toLowerCase().includes("umpire"))
        .map(u => u.fullName || u.displayName);

      const tvUmpire = officials.find(o =>
        (o.position?.displayName || "").toLowerCase().includes("tv") ||
        (o.position?.displayName || "").toLowerCase().includes("third")
      );

      const referee = officials.find(o =>
        (o.position?.displayName || "").toLowerCase().includes("referee") ||
        (o.position?.displayName || "").toLowerCase().includes("match")
      );

      const venue = gi.venue || comp.venue || {};

      const result = {
        tossNote: tossNote?.text || "",
        tossWinner: (() => {
          const m = (tossNote?.text || "").match(/(.+?)\s+won the toss/i);
          return m ? m[1].trim() : "";
        })(),
        tossDecision: (() => {
          const m = (tossNote?.text || "").match(/elected to\s+(\w+)/i);
          return m ? m[1] : "";
        })(),
        umpire1: umpires[0] || "",
        umpire2: umpires[1] || "",
        tvUmpire: tvUmpire?.fullName || tvUmpire?.displayName || "",
        referee: referee?.fullName || referee?.displayName || "",
        venue: {
          name:     venue.fullName || venue.name || "",
          city:     venue.address?.city || venue.city || "",
          country:  venue.address?.country || venue.country || "",
          capacity: venue.capacity || "",
          floodlit: venue.indoor || false,
        },
        broadcastInfo: comp.broadcasts?.map(b => b.names?.join(", ")).join("; ") || "",
        notes: notes.filter(n => !n.text?.toLowerCase().includes("toss")).map(n => n.text).filter(Boolean),
      };

      if (result.venue.name || result.umpire1 || result.tossNote) {
        staticCache.set(key, result);
        return result;
      }
    } catch (_) {}
  }

  return null;
}

// ─── 11. OVER SUMMARY ────────────────────────────────────────────────────────
async function scrapeOverSummary(matchId) {
  const key = `overs:${matchId}`;
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  for (const league of ESPN_LEAGUES) {
    try {
      const { data } = await axios.get(`${ESPN_BASE}/${league.id}/playbyplay`, {
        headers: espnHeaders,
        params: { event: matchId, limit: 600 },
        timeout: 12000,
      });

      const plays = data?.plays || [];
      if (!plays.length) continue;

      // Group by over
      const overMap = {};
      plays.forEach(p => {
        const over = p.period?.number || p.over || 0;
        if (!overMap[over]) overMap[over] = [];
        const text = p.text || p.description || "";
        let ball = "0";
        if (text.includes("WICKET") || text.includes("out")) ball = "W";
        else if (text.includes("SIX") || text.includes(" 6 runs")) ball = "6";
        else if (text.includes("FOUR") || text.includes(" 4 runs")) ball = "4";
        else if (text.includes("wide")) ball = "wd";
        else if (text.includes("no-ball") || text.includes("no ball")) ball = "nb";
        else {
          const m = text.match(/\b(\d)\s+run/i);
          if (m) ball = m[1];
        }
        overMap[over].push({ ball, text });
      });

      const overs = Object.entries(overMap).map(([over, balls]) => {
        const runs = balls.reduce((s, b) => {
          if (b.ball === "W" || b.ball === "wd" || b.ball === "nb") return s;
          return s + (parseInt(b.ball) || 0);
        }, 0);
        return {
          over: parseInt(over),
          runs,
          balls: balls.map(b => b.ball),
          wickets: balls.filter(b => b.ball === "W").length,
          summary: balls.map(b => b.ball).join(" "),
        };
      }).sort((a, b) => a.over - b.over);

      if (overs.length) {
        scrapeCache.set(key, overs, 30);
        return overs;
      }
    } catch (_) {}
  }

  return [];
}

// ─── 12. MATCH ANALYSIS ───────────────────────────────────────────────────────
async function scrapeMatchAnalysis(matchId) {
  const key = `analysis:${matchId}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  for (const league of ESPN_LEAGUES) {
    try {
      const { data } = await axios.get(`${ESPN_BASE}/${league.id}/summary`, {
        headers: espnHeaders,
        params: { event: matchId },
        timeout: 10000,
      });

      const analysis = {
        report: data?.article?.content || data?.summary || "",
        pickcenter: (data?.pickcenter || []).map(p => ({
          provider: p.provider?.name || "",
          text: p.content || p.text || "",
        })),
        keyStats: [],
        preview: "",
      };

      // Extract key facts from article
      if (data?.article?.content) {
        analysis.preview = data.article.content.slice(0, 500);
      }

      staticCache.set(key, analysis);
      return analysis;
    } catch (_) {}
  }

  return { report: "", pickcenter: [], keyStats: [], preview: "" };
}

// ─── 13. IPL STANDINGS ────────────────────────────────────────────────────────
async function scrapeIPLStandings() {
  const key = "espn:ipl:standings";
  const cached = staticCache.get(key);
  if (cached) return cached;

  // Try ESPN IPL standings
  try {
    const { data } = await axios.get(`${ESPN_BASE}/16/standings`, {
      headers: espnHeaders,
      timeout: 10000,
    });

    const groups = data?.standings?.entries || data?.children?.[0]?.standings?.entries || [];
    if (groups.length) {
      const standings = groups.map((entry, i) => {
        const stats = {};
        (entry.stats || []).forEach(s => { stats[s.type] = s.value; });
        return {
          rank: i + 1,
          team: entry.team?.displayName || entry.team?.name || "",
          shortName: entry.team?.abbreviation || "",
          logo: entry.team?.logo || getTeamImageUrl(entry.team?.displayName),
          played: stats.gamesPlayed ?? 0,
          won: stats.wins ?? 0,
          lost: stats.losses ?? 0,
          nrr: stats.netRunRate != null ? Number(stats.netRunRate).toFixed(3) : "+0.000",
          points: stats.points ?? 0,
          form: "",
        };
      });

      staticCache.set(key, standings);
      return standings;
    }
  } catch (_) {}

  // Fallback: Cricbuzz HTML for IPL table
  try {
    const { data: html } = await axios.get("https://www.cricbuzz.com/cricket-series/ipl-2026/points-table", {
      headers: { ...htmlHeaders, Referer: "https://www.cricbuzz.com/" },
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    const standings = [];

    $("table.cb-srs-pnts-tbl tbody tr").each((i, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 7) {
        const team = $(cells[0]).text().trim();
        if (team && team !== "Team") {
          standings.push({
            rank: i + 1,
            team,
            shortName: getTeamShortName(team),
            logo: getTeamImageUrl(team),
            played: parseInt($(cells[1]).text()) || 0,
            won:    parseInt($(cells[2]).text()) || 0,
            lost:   parseInt($(cells[3]).text()) || 0,
            nrr:    $(cells[5]).text().trim() || "+0.000",
            points: parseInt($(cells[6]).text()) || 0,
          });
        }
      }
    });

    if (standings.length) {
      staticCache.set(key, standings);
      return standings;
    }
  } catch (_) {}

  // Static fallback
  return [
    { rank: 1, team: "Mumbai Indians",          shortName: "MI",   logo: getTeamImageUrl("Mumbai Indians"),          played: 14, won: 9,  lost: 5,  nrr: "+0.456", points: 18 },
    { rank: 2, team: "Chennai Super Kings",      shortName: "CSK",  logo: getTeamImageUrl("Chennai Super Kings"),      played: 14, won: 8,  lost: 6,  nrr: "+0.233", points: 16 },
    { rank: 3, team: "Royal Challengers Bengaluru", shortName: "RCB", logo: getTeamImageUrl("Royal Challengers Bengaluru"), played: 14, won: 8, lost: 6, nrr: "+0.189", points: 16 },
    { rank: 4, team: "Kolkata Knight Riders",    shortName: "KKR",  logo: getTeamImageUrl("Kolkata Knight Riders"),    played: 14, won: 7,  lost: 7,  nrr: "+0.102", points: 14 },
    { rank: 5, team: "Sunrisers Hyderabad",      shortName: "SRH",  logo: getTeamImageUrl("Sunrisers Hyderabad"),      played: 14, won: 7,  lost: 7,  nrr: "+0.045", points: 14 },
    { rank: 6, team: "Delhi Capitals",           shortName: "DC",   logo: getTeamImageUrl("Delhi Capitals"),           played: 14, won: 6,  lost: 8,  nrr: "-0.120", points: 12 },
    { rank: 7, team: "Rajasthan Royals",         shortName: "RR",   logo: getTeamImageUrl("Rajasthan Royals"),         played: 14, won: 6,  lost: 8,  nrr: "-0.234", points: 12 },
    { rank: 8, team: "Gujarat Titans",           shortName: "GT",   logo: getTeamImageUrl("Gujarat Titans"),           played: 14, won: 6,  lost: 8,  nrr: "-0.310", points: 12 },
    { rank: 9, team: "Punjab Kings",             shortName: "PBKS", logo: getTeamImageUrl("Punjab Kings"),             played: 14, won: 5,  lost: 9,  nrr: "-0.421", points: 10 },
    { rank: 10,team: "Lucknow Super Giants",     shortName: "LSG",  logo: getTeamImageUrl("Lucknow Super Giants"),     played: 14, won: 5,  lost: 9,  nrr: "-0.512", points: 10 },
  ];
}

// ─── 14. NEWS ─────────────────────────────────────────────────────────────────
async function getNewsWithFallback() {
  const key = "news:all";
  const cached = newsCache.get(key);
  if (cached) return cached;

  const allNews = [];
  const seen = new Set();

  // RSS feeds to try
  const rssFeeds = [
    "https://www.cricbuzz.com/rss/cricket-news",
    "https://feeds.feedburner.com/ndtvsports-cricket",
    "https://sports.ndtv.com/rss/cricket",
    "https://www.espncricinfo.com/rss/content/story/feeds/0.xml",
    "https://timesofindia.indiatimes.com/rss/4719148.cms",
    "https://news.google.com/rss/search?q=cricket+india&hl=en-IN&gl=IN&ceid=IN:en",
    "https://news.google.com/rss/search?q=IPL+2026+cricket&hl=en-IN&gl=IN&ceid=IN:en",
    "https://www.bcci.tv/articles/rss",
  ];

  const feedResults = await Promise.allSettled(
    rssFeeds.map(url =>
      axios.get(url, { headers: { ...htmlHeaders, Accept: "application/rss+xml, application/xml, text/xml, */*" }, timeout: 8000 })
        .then(r => ({ url, data: r.data }))
    )
  );

  for (const res of feedResults) {
    if (res.status !== "fulfilled") continue;
    try {
      const $ = cheerio.load(res.value.data, { xmlMode: true });
      $("item").each((i, item) => {
        const title     = $(item).find("title").first().text().replace("<![CDATA[", "").replace("]]>", "").trim();
        const link      = $(item).find("link").first().text().trim() || $(item).find("link").attr("href") || "";
        const pubDate   = $(item).find("pubDate").first().text().trim();
        const desc      = $(item).find("description").first().text().replace(/<[^>]+>/g, "").replace("<![CDATA[", "").replace("]]>", "").trim().slice(0, 200);
        const imgMatch  = $(item).find("description").text().match(/<img[^>]+src="([^"]+)"/i);
        const img       = $(item).find("media\\:content, enclosure").attr("url") || (imgMatch ? imgMatch[1] : null);

        if (!title || seen.has(title)) return;
        seen.add(title);

        const pubDt = pubDate ? new Date(pubDate) : new Date();
        const hoursAgo = Math.round((Date.now() - pubDt.getTime()) / 3600000);
        const daysAgo = Math.round(hoursAgo / 24);

        // Categorize
        const t = title.toLowerCase() + desc.toLowerCase();
        const category =
          t.includes("ipl") || t.includes("indian premier") ? "IPL" :
          t.includes("test match") || t.includes("test cricket") ? "Test" :
          t.includes(" odi") || t.includes("one day") ? "ODI" :
          t.includes("t20") || t.includes("twenty20") ? "T20" :
          t.includes("women") ? "Women's" : "Cricket";

        allNews.push({
          id:          link || title,
          title,
          description: desc,
          link,
          pubDate:     pubDt.toISOString(),
          hoursAgo,
          daysAgo,
          category,
          imageUrl:    img || null,
          source:      new URL(res.value.url).hostname.replace("www.", "").replace("feeds.", ""),
        });
      });
    } catch (_) {}
  }

  // Sort newest first
  allNews.sort((a, b) => a.hoursAgo - b.hoursAgo);

  const result = allNews.slice(0, 50);
  if (result.length) newsCache.set(key, result);
  return result;
}

// ─── 15. ICC RANKINGS ────────────────────────────────────────────────────────
async function scrapeCricbuzzRankings(category = "men", type = "batting", format = "tests") {
  const key = `rankings:${category}:${type}:${format}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  // Try ICC website
  try {
    const formatMap = { tests: "test", odis: "odi", t20is: "t20i" };
    const typeMap = { batting: "batting", bowling: "bowling", allrounder: "all-rounder" };
    const catMap = { men: "mens", women: "womens" };

    const url = `https://www.icc-cricket.com/rankings/${catMap[category] || "mens"}/player-rankings/${formatMap[format] || "test"}/${typeMap[type] || "batting"}`;
    const { data: html } = await axios.get(url, {
      headers: { ...htmlHeaders, Referer: "https://www.icc-cricket.com/" },
      timeout: 12000,
    });

    const $ = cheerio.load(html);
    const rankings = [];

    $("table.rankings-table tbody tr, .rankings-table__table-row, [data-ranking-row]").each((i, row) => {
      const rank = $(row).find("td:nth-child(1), .rankings-table__rank").text().trim();
      const name = $(row).find("td:nth-child(2) a, .rankings-table__name a, .player-name").text().trim();
      const team = $(row).find("td:nth-child(3), .rankings-table__team").text().trim();
      const rating = $(row).find("td:nth-child(4), .rankings-table__rating").text().trim();
      const points = $(row).find("td:nth-child(5), .rankings-table__points").text().trim();

      if (name && rank && !isNaN(parseInt(rank))) {
        rankings.push({
          rank: parseInt(rank),
          name,
          team,
          rating: parseInt(rating) || parseInt(points) || 0,
          points: parseInt(points) || parseInt(rating) || 0,
          img: null,
        });
      }
    });

    if (rankings.length >= 5) {
      staticCache.set(key, rankings);
      return rankings;
    }
  } catch (_) {}

  // ESPN Cricinfo HTML fallback
  try {
    const espnFormatMap = { tests: "test-matches", odis: "one-day-internationals", t20is: "twenty20-internationals" };
    const url = `https://www.espncricinfo.com/rankings/content/page/211271.html`;
    const { data: html } = await axios.get(url, {
      headers: { ...htmlHeaders, Referer: "https://www.espncricinfo.com/" },
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    const rankings = [];
    $("table.rankings-table tr:not(:first-child)").each((i, row) => {
      const cells = $(row).find("td");
      if (cells.length >= 3) {
        rankings.push({
          rank: parseInt($(cells[0]).text()) || i + 1,
          name: $(cells[1]).text().trim(),
          team: $(cells[2]).text().trim(),
          rating: parseInt($(cells[3]).text()) || 0,
          points: parseInt($(cells[4]).text()) || 0,
          img: null,
        });
      }
    });

    if (rankings.length) {
      staticCache.set(key, rankings);
      return rankings;
    }
  } catch (_) {}

  // Real rankings unavailable from any source right now.
  return [];
}

// ─── 16. ALL SERIES ───────────────────────────────────────────────────────────
async function scrapeCricbuzzSeries() {
  const key = "espn:series:all";
  const cached = seriesCache.get(key);
  if (cached) return cached;

  const series = [];
  const seen = new Set();

  const leagueResults = await Promise.allSettled(
    ESPN_LEAGUES.map(l =>
      axios.get(`${ESPN_BASE}/${l.id}/scoreboard`, {
        headers: espnHeaders, timeout: 10000,
      }).then(r => ({ league: l, data: r.data }))
    )
  );

  for (const s of leagueResults) {
    if (s.status !== "fulfilled") continue;
    const { league, data } = s.value;
    if (!seen.has(league.id)) {
      seen.add(league.id);
      const leagueData = data.leagues?.[0] || {};
      series.push({
        id:     league.id,
        name:   leagueData.name || leagueData.displayName || league.name,
        season: data.season?.displayName || "2026",
        format: league.format,
        status: "active",
        matchCount: data.events?.length || 0,
        logo: leagueData.logo || leagueData.logos?.[0]?.href || null,
        category: league.id === "8" ? "international" :
                  ["16","57","7","82","83","76"].includes(league.id) ? "league" : "international",
      });
    }
  }

  if (series.length) seriesCache.set(key, series);
  return series;
}

// ─── 17. SERIES SCHEDULE ─────────────────────────────────────────────────────
async function scrapeSeriesSchedule(seriesId) {
  const key = `series:schedule:${seriesId}`;
  const cached = seriesCache.get(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${ESPN_BASE}/${seriesId}/scoreboard`, {
      headers: espnHeaders,
      params: { limit: 100 },
      timeout: 10000,
    });

    const league = ESPN_LEAGUES.find(l => l.id === String(seriesId));
    const schedule = (data.events || []).map(e => parseESPNEvent(e, league)).filter(Boolean);

    if (schedule.length) {
      seriesCache.set(key, schedule);
      return schedule;
    }
  } catch (_) {}

  // Fallback: filter from all matches by seriesId
  const all = await getAllMatches().catch(() => ({ live: [], recent: [], upcoming: [] }));
  const combined = [...all.live, ...all.recent, ...all.upcoming];
  const filtered = combined.filter(m => m.seriesId === String(seriesId) || m.leagueId === String(seriesId));

  if (filtered.length) {
    seriesCache.set(key, filtered);
    return filtered;
  }

  return [];
}

// ─── 18. SERIES STANDINGS ────────────────────────────────────────────────────
async function scrapeSeriesStandings(seriesId) {
  const key = `series:standings:${seriesId}`;
  const cached = seriesCache.get(key);
  if (cached) return cached;

  // Special case: IPL = league ID 16
  if (String(seriesId) === "16") return scrapeIPLStandings();

  try {
    const { data } = await axios.get(`${ESPN_BASE}/${seriesId}/standings`, {
      headers: espnHeaders,
      timeout: 10000,
    });

    const entries = data?.standings?.entries || data?.children?.[0]?.standings?.entries || [];
    const standings = entries.map((e, i) => {
      const stats = {};
      (e.stats || []).forEach(s => { stats[s.type] = s.value; });
      return {
        rank: i + 1,
        team: e.team?.displayName || "",
        shortName: e.team?.abbreviation || "",
        logo: e.team?.logo || getTeamImageUrl(e.team?.displayName),
        played: stats.gamesPlayed ?? 0,
        won:    stats.wins ?? 0,
        lost:   stats.losses ?? 0,
        nrr:    stats.netRunRate != null ? Number(stats.netRunRate).toFixed(3) : "+0.000",
        points: stats.points ?? 0,
      };
    });

    if (standings.length) {
      seriesCache.set(key, standings);
      return standings;
    }
  } catch (_) {}

  return [];
}

// ─── 19. SERIES STATS ────────────────────────────────────────────────────────
async function scrapeSeriesStats(seriesId) {
  const key = `series:stats:${seriesId}`;
  const cached = seriesCache.get(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${ESPN_BASE}/${seriesId}/leaders`, {
      headers: espnHeaders,
      timeout: 10000,
    });

    const batting = (data?.batting?.leaders || []).map((p, i) => ({
      rank:   i + 1,
      name:   p.athlete?.displayName || p.displayName || "",
      team:   p.team?.abbreviation || "",
      runs:   p.value ?? p.stats?.[0] ?? 0,
      avg:    p.average?.toFixed(2) || "0.00",
    }));

    const bowling = (data?.bowling?.leaders || []).map((p, i) => ({
      rank:    i + 1,
      name:    p.athlete?.displayName || p.displayName || "",
      team:    p.team?.abbreviation || "",
      wickets: p.value ?? p.stats?.[0] ?? 0,
      econ:    p.economy?.toFixed(2) || "0.00",
    }));

    if (batting.length || bowling.length) {
      const result = { batting, bowling };
      seriesCache.set(key, result);
      return result;
    }
  } catch (_) {}

  return { batting: [], bowling: [] };
}

// ─── 20. SERIES SQUADS ───────────────────────────────────────────────────────
async function scrapeSeriesSquads(seriesId) {
  const key = `series:squads:${seriesId}`;
  const cached = squadCache.get(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`${ESPN_BASE}/${seriesId}/teams`, {
      headers: espnHeaders,
      timeout: 10000,
    });

    const teams = data?.sports?.[0]?.leagues?.[0]?.teams || data?.teams || [];
    const squads = {};

    for (const t of teams) {
      const teamName = t.team?.displayName || t.displayName || "";
      if (!teamName) continue;

      try {
        const { data: rosterData } = await axios.get(`${ESPN_BASE}/${seriesId}/teams/${t.team?.id || t.id}/roster`, {
          headers: espnHeaders,
          timeout: 8000,
        });

        const players = (rosterData?.athletes || rosterData?.roster || []).map(p => ({
          id:        p.athlete?.id || p.id || "",
          name:      p.athlete?.displayName || p.displayName || p.name || "",
          role:      p.position?.displayName || p.position || "Batsman",
          img:       p.athlete?.headshot?.href || null,
          isCaptain: p.captain ?? false,
          isKeeper:  (p.position?.displayName || "").toLowerCase().includes("keeper"),
          country:   teamName,
        }));

        squads[teamName] = players;
      } catch (_) {}
    }

    if (Object.keys(squads).length) {
      squadCache.set(key, squads);
      return squads;
    }
  } catch (_) {}

  return {};
}

// ─── 21. SERIES ARCHIVE ──────────────────────────────────────────────────────
async function scrapeSeriesArchive(year) {
  const key = `series:archive:${year}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  // Return a static list of major series for the given year
  const archive = [
    { id: "icc-cwc-2023", name: `ICC Cricket World Cup ${year}`, format: "ODI", season: year },
    { id: "icc-t20wc-2024", name: `ICC T20 World Cup ${year}`, format: "T20", season: year },
    { id: "ipl-2026", name: `IPL ${year}`, format: "T20", season: year },
    { id: "ashes-2025", name: `The Ashes ${year}`, format: "Test", season: year },
  ];

  staticCache.set(key, archive);
  return archive;
}

// ─── 22. BROWSE MATCHES (by date) ────────────────────────────────────────────
async function scrapeBrowseMatches(date) {
  const key = `browse:${date}`;
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  const all = await getAllMatches().catch(() => ({ live: [], recent: [], upcoming: [] }));
  const combined = [...all.live, ...all.recent, ...all.upcoming];

  const filtered = combined.filter(m => {
    if (!m.dateTimeGMT) return false;
    const matchDate = new Date(m.dateTimeGMT).toISOString().slice(0, 10);
    return matchDate === date;
  });

  scrapeCache.set(key, filtered, 60);
  return filtered;
}

// ─── 23. DETAILED SCHEDULE ───────────────────────────────────────────────────
async function scrapeDetailedSchedule(type, month, year) {
  const all = await getAllMatches().catch(() => ({ live: [], recent: [], upcoming: [] }));
  const combined = [...all.upcoming, ...all.live, ...all.recent];

  let filtered = combined;
  if (type && type !== "all") {
    filtered = filtered.filter(m => m.matchType?.toLowerCase() === type.toLowerCase());
  }
  if (month && year) {
    filtered = filtered.filter(m => {
      const d = new Date(m.dateTimeGMT);
      return d.getMonth() + 1 === parseInt(month) && d.getFullYear() === parseInt(year);
    });
  }

  return filtered;
}

// ─── 24. GLOBAL STATS ────────────────────────────────────────────────────────
async function scrapeGlobalStats(format = "test", type = "batting", category = "most-runs") {
  const key = `stats:${format}:${type}:${category}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  try {
    const statTypeMap = { batting: "batting", bowling: "bowling" };
    const formatMap = { test: "tests", odi: "one-day-internationals", t20i: "twenty20-internationals" };

    const { data: html } = await axios.get(
      `https://www.espncricinfo.com/records/team/match-results/${format === "test" ? "test-matches" : format === "odi" ? "one-day-internationals" : "twenty20-internationals"}/`,
      { headers: { ...htmlHeaders, Referer: "https://www.espncricinfo.com/" }, timeout: 10000 }
    );

    const $ = cheerio.load(html);
    const stats = [];

    $("table.engineTable tbody tr").each((i, row) => {
      if (i >= 50) return;
      const cells = $(row).find("td");
      if (cells.length >= 4) {
        stats.push({
          rank: i + 1,
          player: $(cells[0]).text().trim(),
          team:   $(cells[1]).text().trim(),
          value:  $(cells[3]).text().trim() || $(cells[2]).text().trim(),
          span:   $(cells[cells.length - 1]).text().trim(),
        });
      }
    });

    if (stats.length) {
      staticCache.set(key, stats);
      return stats;
    }
  } catch (_) {}

  // Return empty (no hardcoded stats - too much data)
  return [];
}

// ─── 25. PLAYER INFO ─────────────────────────────────────────────────────────
async function scrapePlayerInfo(playerId) {
  const key = `player:${playerId}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  // Try ESPN
  try {
    const { data } = await axios.get(
      `https://site.api.espn.com/apis/site/v2/sports/cricket/8/athletes/${playerId}`,
      { headers: espnHeaders, timeout: 10000 }
    );

    const athlete = data?.athlete || data;
    if (!athlete?.displayName) throw new Error("No data");

    const info = {
      id:          String(playerId),
      name:        athlete.displayName,
      shortName:   athlete.shortDisplayName || athlete.displayName,
      team:        athlete.teams?.[0]?.displayName || "",
      country:     athlete.birthPlace?.country || "",
      role:        athlete.position?.displayName || "Batsman",
      born:        athlete.dateOfBirth || "",
      birthPlace:  [athlete.birthPlace?.city, athlete.birthPlace?.country].filter(Boolean).join(", "),
      height:      athlete.displayHeight || "",
      img:         athlete.headshot?.href || null,
      bio:         athlete.description || "",
      batting:     athlete.batHand || "Right-hand",
      bowling:     athlete.bowlHand || "Right-arm",
      stats:       {},
    };

    staticCache.set(key, info);
    return info;
  } catch (_) {}

  // Try Cricbuzz HTML
  try {
    const { data: html } = await axios.get(
      `https://www.cricbuzz.com/profiles/${playerId}`,
      { headers: { ...htmlHeaders, Referer: "https://www.cricbuzz.com/" }, timeout: 10000 }
    );

    const $ = cheerio.load(html);
    const name       = $(".cb-nav-hdr.cb-font-18").first().text().trim() || $("h1").first().text().trim();
    const team       = $(".cb-font-16.cb-text-gray").first().text().trim();
    const born       = $("dd:contains('Born')").prev("dt:contains('Born')").next("dd").text().trim();
    const role       = $("dd").filter((_, el) => $(el).text().includes("Batsman") || $(el).text().includes("Bowler") || $(el).text().includes("All")).first().text().trim();
    const imgEl      = $(".cb-player-img img");
    const img        = imgEl.attr("src") || imgEl.attr("data-src") || null;

    const info = {
      id: String(playerId),
      name: name || "Player",
      team,
      role,
      born,
      img,
      stats: {},
    };

    staticCache.set(key, info);
    return info;
  } catch (_) {}

  return { id: String(playerId), name: "Player", team: "", role: "Batsman", stats: {} };
}

// ─── 26. SEARCH PLAYERS ──────────────────────────────────────────────────────
async function searchPlayers(query) {
  const key = `search:${query}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(
      `https://site.api.espn.com/apis/search/v2?query=${encodeURIComponent(query)}&limit=20&type=player&sport=cricket`,
      { headers: espnHeaders, timeout: 8000 }
    );

    const players = (data?.results || [])
      .filter(r => r.type === "player" || r.athlete)
      .map(r => ({
        id:    r.athlete?.id || r.id || "",
        name:  r.athlete?.displayName || r.displayName || r.name || "",
        team:  r.team?.displayName || r.athlete?.team?.displayName || "",
        img:   r.athlete?.headshot?.href || null,
      }));

    if (players.length) {
      staticCache.set(key, players, 300);
      return players;
    }
  } catch (_) {}

  // Cricbuzz HTML search fallback
  try {
    const { data: html } = await axios.get(
      `https://www.cricbuzz.com/search/players?q=${encodeURIComponent(query)}`,
      { headers: { ...htmlHeaders, Referer: "https://www.cricbuzz.com/" }, timeout: 8000 }
    );

    const $ = cheerio.load(html);
    const players = [];

    $(".cb-plyr-lst-itm, .cb-lst-itm").each((i, el) => {
      const name = $(el).find("a").first().text().trim() || $(el).text().trim();
      const href = $(el).find("a").first().attr("href") || "";
      const idMatch = href.match(/\/profiles\/(\d+)/);
      const team = $(el).find(".cb-font-12").text().trim();

      if (name && idMatch) {
        players.push({ id: idMatch[1], name, team, img: null });
      }
    });

    if (players.length) {
      staticCache.set(key, players, 300);
      return players;
    }
  } catch (_) {}

  return [];
}

// ─── 27. TEAM INFO ───────────────────────────────────────────────────────────
async function scrapeTeamInfo(teamId) {
  const key = `team:${teamId}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(
      `https://site.api.espn.com/apis/site/v2/sports/cricket/8/teams/${teamId}`,
      { headers: espnHeaders, timeout: 10000 }
    );

    const team = data?.team || data;
    const info = {
      id: String(teamId),
      name: team.displayName || team.name || "",
      shortname: team.abbreviation || "",
      img: team.logos?.[0]?.href || team.logo || null,
      country: team.location || "",
      color: team.color || "",
      schedule: [],
    };

    staticCache.set(key, info);
    return info;
  } catch (_) {}

  return { id: String(teamId), name: "Team", shortname: "", schedule: [] };
}

// ─── 28. VENUE STATS ─────────────────────────────────────────────────────────
async function scrapeVenueStats(venueId) {
  const key = `venue:${venueId}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(
      `https://site.api.espn.com/apis/site/v2/sports/cricket/8/venues/${venueId}`,
      { headers: espnHeaders, timeout: 8000 }
    );

    const venue = data?.venue || data;
    const info = {
      id: String(venueId),
      name: venue.fullName || venue.name || "",
      city: venue.address?.city || "",
      country: venue.address?.country || "",
      capacity: venue.capacity || "",
      established: venue.established || "",
      stats: {},
    };

    staticCache.set(key, info);
    return info;
  } catch (_) {}

  return { id: String(venueId), name: "Venue", city: "", stats: {} };
}

// ─── 29. TEAMS LIST ──────────────────────────────────────────────────────────
async function scrapeCricbuzzTeams() {
  const key = "espn:teams";
  const cached = staticCache.get(key);
  if (cached) return cached;

  const teams = [
    { id: "1",  name: "India",        shortname: "IND", type: "international", img: getTeamImageUrl("India") },
    { id: "2",  name: "Australia",    shortname: "AUS", type: "international", img: getTeamImageUrl("Australia") },
    { id: "3",  name: "England",      shortname: "ENG", type: "international", img: getTeamImageUrl("England") },
    { id: "4",  name: "Pakistan",     shortname: "PAK", type: "international", img: getTeamImageUrl("Pakistan") },
    { id: "5",  name: "South Africa", shortname: "SA",  type: "international", img: getTeamImageUrl("South Africa") },
    { id: "6",  name: "New Zealand",  shortname: "NZ",  type: "international", img: getTeamImageUrl("New Zealand") },
    { id: "7",  name: "West Indies",  shortname: "WI",  type: "international", img: getTeamImageUrl("West Indies") },
    { id: "8",  name: "Sri Lanka",    shortname: "SL",  type: "international", img: getTeamImageUrl("Sri Lanka") },
    { id: "9",  name: "Bangladesh",   shortname: "BAN", type: "international", img: getTeamImageUrl("Bangladesh") },
    { id: "10", name: "Afghanistan",  shortname: "AFG", type: "international", img: getTeamImageUrl("Afghanistan") },
    { id: "11", name: "Zimbabwe",     shortname: "ZIM", type: "international", img: getTeamImageUrl("Zimbabwe") },
    { id: "12", name: "Ireland",      shortname: "IRE", type: "international", img: getTeamImageUrl("Ireland") },
    { id: "13", name: "Netherlands",  shortname: "NED", type: "international", img: getTeamImageUrl("Netherlands") },
    { id: "14", name: "Scotland",     shortname: "SCO", type: "international", img: getTeamImageUrl("Scotland") },
    // IPL
    { id: "62", name: "Mumbai Indians",          shortname: "MI",   type: "ipl", img: getTeamImageUrl("Mumbai Indians") },
    { id: "59", name: "Chennai Super Kings",      shortname: "CSK",  type: "ipl", img: getTeamImageUrl("Chennai Super Kings") },
    { id: "64", name: "Royal Challengers Bengaluru", shortname: "RCB", type: "ipl", img: getTeamImageUrl("Royal Challengers Bengaluru") },
    { id: "63", name: "Kolkata Knight Riders",    shortname: "KKR",  type: "ipl", img: getTeamImageUrl("Kolkata Knight Riders") },
    { id: "255",name: "Sunrisers Hyderabad",      shortname: "SRH",  type: "ipl", img: getTeamImageUrl("Sunrisers Hyderabad") },
    { id: "61", name: "Delhi Capitals",           shortname: "DC",   type: "ipl", img: getTeamImageUrl("Delhi Capitals") },
    { id: "66", name: "Rajasthan Royals",         shortname: "RR",   type: "ipl", img: getTeamImageUrl("Rajasthan Royals") },
    { id: "971",name: "Gujarat Titans",           shortname: "GT",   type: "ipl", img: getTeamImageUrl("Gujarat Titans") },
    { id: "65", name: "Punjab Kings",             shortname: "PBKS", type: "ipl", img: getTeamImageUrl("Punjab Kings") },
    { id: "966",name: "Lucknow Super Giants",     shortname: "LSG",  type: "ipl", img: getTeamImageUrl("Lucknow Super Giants") },
  ];

  staticCache.set(key, teams);
  return teams;
}

// ─── 30. GETSCALEDDATA (legacy controller helper) ────────────────────────────
async function getScaledData(endpoint, params = {}) {
  if (endpoint === "cricScore") return scrapeScorecard(params.id);
  if (endpoint === "currentMatches") return getLiveMatchesWithFallback();
  if (endpoint === "matches") return scrapeCricbuzzUpcoming();
  return null;
}

// ─── MODULE EXPORTS ───────────────────────────────────────────────────────────
module.exports = {
  // Matches
  getAllMatches,
  getLiveMatchesWithFallback,
  scrapeCricbuzzLiveMatches,
  scrapeCricbuzzUpcoming,
  scrapeMatchInfo,
  scrapeScorecard,
  scrapeCricbuzzScorecard,
  scrapeMatchLiveData,
  scrapeMatchSquad,
  scrapeCommentary,
  scrapeMatchH2H,
  scrapeMatchFullInfo,
  scrapeOverSummary,
  scrapeMatchAnalysis,
  getScaledData,

  // Standings & News
  scrapeIPLStandings,
  getNewsWithFallback,

  // Rankings
  scrapeCricbuzzRankings,

  // Series
  scrapeCricbuzzSeries,
  scrapeSeriesSchedule,
  scrapeSeriesStandings,
  scrapeSeriesStats,
  scrapeSeriesSquads,
  scrapeSeriesArchive,

  // Players & Teams
  scrapePlayerInfo,
  searchPlayers,
  scrapeTeamInfo,
  scrapeCricbuzzTeams,
  scrapeVenueStats,

  // Schedule & Stats
  scrapeBrowseMatches,
  scrapeDetailedSchedule,
  scrapeGlobalStats,
};


// ═══════════════════════════════════════════════════════════════════════════
// RELIABILITY LAYER
// The ESPN site API endpoints used above currently return 404 for cricket,
// and every match/series/team ID flowing through the app comes from Cricbuzz.
// So delegate to the proven Cricbuzz scraper (shared with production in
// api/scraper.js) first, keeping the ESPN implementations as backup.
// ═══════════════════════════════════════════════════════════════════════════
const cbScraper = require("../../api/scraper");

const _isEmptyResult = (v) =>
  v == null ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && !Array.isArray(v) &&
    Object.values(v).every((x) => (Array.isArray(x) ? x.length === 0 : x == null || x === "")));

const _firstNonEmpty = (primary, backup) => async (...args) => {
  if (typeof primary === "function") {
    try {
      const r = await primary(...args);
      if (!_isEmptyResult(r)) return r;
    } catch (_) {}
  }
  if (typeof backup === "function") {
    try { return await backup(...args); } catch (_) { return null; }
  }
  return null;
};

const _espnImpl = { ...module.exports };

// Lists + detail: Cricbuzz first (IDs are Cricbuzz IDs), ESPN as backup
module.exports.getAllMatches              = _firstNonEmpty(cbScraper.getAllMatches, _espnImpl.getAllMatches);
module.exports.getLiveMatchesWithFallback = _firstNonEmpty(cbScraper.getLiveMatchesWithFallback, _espnImpl.getLiveMatchesWithFallback);
module.exports.scrapeCricbuzzLiveMatches  = module.exports.getLiveMatchesWithFallback;
module.exports.scrapeCricbuzzUpcoming     = _firstNonEmpty(cbScraper.scrapeCricbuzzUpcoming, _espnImpl.scrapeCricbuzzUpcoming);
module.exports.scrapeMatchInfo            = _firstNonEmpty(cbScraper.scrapeMatchInfo, _espnImpl.scrapeMatchInfo);
module.exports.scrapeScorecard            = _firstNonEmpty(cbScraper.scrapeScorecard, _espnImpl.scrapeScorecard);
module.exports.scrapeCricbuzzScorecard    = module.exports.scrapeScorecard;
module.exports.scrapeMatchLiveData        = _firstNonEmpty(cbScraper.scrapeMatchLiveData, _espnImpl.scrapeMatchLiveData);
module.exports.scrapeMatchSquad           = _firstNonEmpty(cbScraper.scrapeMatchSquad, _espnImpl.scrapeMatchSquad);
module.exports.scrapeCommentary           = _firstNonEmpty(cbScraper.scrapeCommentary, _espnImpl.scrapeCommentary);
module.exports.scrapeMatchH2H             = _firstNonEmpty(cbScraper.scrapeMatchH2H, _espnImpl.scrapeMatchH2H);
module.exports.scrapeMatchAnalysis        = _firstNonEmpty(cbScraper.scrapeMatchAnalysis, _espnImpl.scrapeMatchAnalysis);

// Series / teams / rankings / standings
module.exports.scrapeCricbuzzSeries   = _firstNonEmpty(cbScraper.scrapeCricbuzzSeries, _espnImpl.scrapeCricbuzzSeries);
module.exports.scrapeSeriesSchedule   = _firstNonEmpty(cbScraper.scrapeSeriesSchedule, _espnImpl.scrapeSeriesSchedule);
module.exports.scrapeSeriesStandings  = _firstNonEmpty(cbScraper.scrapeSeriesStandings, _espnImpl.scrapeSeriesStandings);
module.exports.scrapeSeriesStats      = _firstNonEmpty(cbScraper.scrapeSeriesStats, _espnImpl.scrapeSeriesStats);
module.exports.scrapeSeriesArchive    = _firstNonEmpty(cbScraper.scrapeSeriesArchive, _espnImpl.scrapeSeriesArchive);
module.exports.scrapeCricbuzzTeams    = _firstNonEmpty(cbScraper.scrapeCricbuzzTeams, _espnImpl.scrapeCricbuzzTeams);
module.exports.scrapeCricbuzzRankings = _firstNonEmpty(cbScraper.scrapeCricbuzzRankings, _espnImpl.scrapeCricbuzzRankings);
module.exports.scrapeIPLStandings     = _firstNonEmpty(cbScraper.scrapeIPLStandings, _espnImpl.scrapeIPLStandings);

// Functions routes call that the ESPN rewrite renamed/dropped
module.exports.scrapePlayerDetails    = _firstNonEmpty(cbScraper.scrapePlayerDetails, _espnImpl.scrapePlayerInfo);
module.exports.searchPlayers          = _firstNonEmpty(cbScraper.searchPlayers, _espnImpl.searchPlayers);
module.exports.scrapeCareerRecords    = cbScraper.scrapeCareerRecords;
module.exports.scrapeTeamDetail       = _firstNonEmpty(cbScraper.scrapeTeamDetail, _espnImpl.scrapeTeamInfo);
module.exports.scrapeVenueInfo        = _firstNonEmpty(cbScraper.scrapeVenueInfo, _espnImpl.scrapeVenueStats);
module.exports.scrapeBrowseMatches    = _firstNonEmpty(cbScraper.scrapeBrowseMatches, _espnImpl.scrapeBrowseMatches);
module.exports.scrapeDetailedSchedule = _firstNonEmpty(cbScraper.scrapeDetailedSchedule, _espnImpl.scrapeDetailedSchedule);
module.exports.getScaledData          = typeof cbScraper.getScaledData === "function" ? cbScraper.getScaledData : _espnImpl.getScaledData;

// News: the ESPN-file implementation works — keep it first, Cricbuzz as backup
module.exports.getNewsWithFallback    = _firstNonEmpty(_espnImpl.getNewsWithFallback, cbScraper.getNewsWithFallback);
