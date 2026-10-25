// ESPN cricket - second free live-score source (public, undocumented JSON).
//
// Endpoints (checked 24 Oct 2026):
//   Scores : https://site.web.api.espn.com/apis/site/v2/sports/cricket/scorepanel[?dates=YYYYMMDD]
//            One day per call. Date ranges ("A-B") return HTTP 400.
//   Match  : https://site.web.api.espn.com/apis/site/v2/sports/cricket/{leagueId}/summary?event={eventId}
//            The league segment must be present but is not checked against the event.
//
// Every exported function catches its own errors and returns empty results
// (empty buckets, null summary). Nothing here throws or fills in missing data.

const axios = require("axios");
const NodeCache = require("node-cache");

const espnCache = new NodeCache({ stdTTL: 30 }); // 30s - live data; longer TTLs are passed per key

const ESPN_BASE = "https://site.web.api.espn.com/apis/site/v2/sports/cricket";

const espnHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
};

// Days of scorepanel to read either side of today (one HTTP call per day).
const PAST_DAYS = 2;
const FUTURE_DAYS = 2;

const TTL = {
  list:         30,  // merged list and today's panel
  pastDay:     600,  // yesterday and earlier: results rarely change
  futureDay:   300,  // fixtures
  summaryLive:  30,
  summaryPre:  300,
  summaryPost: 600,
};

// ─── Small helpers ────────────────────────────────────────────────────────────
function decodeEntities(s) {
  if (!s) return "";
  return String(s)
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&dagger;/g, "†") // ESPN marks the wicketkeeper: "c &dagger;Hay b Sheat"
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, "&");
}

function stripTags(s) {
  return decodeEntities(String(s || "").replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

function num(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function ymdUTC(d) {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

function mmddyyyyUTC(d) {
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}/${d.getUTCFullYear()}`;
}

function isTrue(v) {
  return v === true || v === "true" || v === 1 || v === "1";
}

// ESPN serves 500px PNGs (up to ~200 KB). The combiner returns an 80px copy
// (~6 KB) and still answers 404 when ESPN has no logo for the team.
function logoUrl(team) {
  const raw = team?.logo || team?.logos?.[0]?.href || "";
  const m = raw.match(/^https?:\/\/a\.espncdn\.com(\/i\/teamlogos\/[^?#]+\.png)$/i);
  if (m) return `https://a.espncdn.com/combiner/i?img=${m[1]}&w=80&h=80`;
  return raw || null;
}

function shortName(team) {
  if (team?.abbreviation) return team.abbreviation;
  if (team?.shortDisplayName) return team.shortDisplayName;
  const n = team?.displayName || team?.name || "";
  return n ? n.split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 4) : "";
}

// Home side first, matching the order in ESPN's event name ("Tasmania v Victoria").
function orderCompetitors(list) {
  const arr = Array.isArray(list) ? list.slice() : [];
  const rank = c => (c.homeAway === "home" ? 0 : c.homeAway === "away" ? 1 : 2);
  return arr.sort((a, b) => rank(a) - rank(b) || (Number(a.order) || 0) - (Number(b.order) || 0));
}

// ─── Score strings ────────────────────────────────────────────────────────────
// Formats seen in scorepanel responses:
//   "304/7 (50 ov)"  "137 (25.2/35 ov, target 276)"  "371/8"  "113"
//   "440/6d & 262/5d"  "99 & 295 (107.1 ov) (f/o)"  "339 & 244/9 (111 ov, target 364)"
// A total with no "/wickets" is all out. Overs appear only on the latest innings;
// o is null when the string has none (callers may fill it from linescores).
function parseEspnScoreString(str) {
  if (!str || typeof str !== "string") return [];
  const out = [];
  for (const part of str.split("&")) {
    const m = part.match(/^\s*(\d+)(?:\s*\/\s*(\d+))?\s*(dec|d)?/i);
    if (!m) continue;
    const declared = !!m[3];
    const allOut = m[2] === undefined && !declared;
    const ov = part.match(/\(\s*(\d+(?:\.\d+)?)(?:\s*\/\s*\d+(?:\.\d+)?)?\s*ov/i);
    out.push({
      r: Number(m[1]),
      w: m[2] !== undefined ? Number(m[2]) : (allOut ? 10 : 0),
      o: ov ? Number(ov[1]) : null,
      allOut,
      declared,
    });
  }
  return out;
}

// ─── Match type ───────────────────────────────────────────────────────────────
function mapMatchType(cls, leagueName) {
  const fromValue = v => {
    const s = String(v || "").toLowerCase();
    if (!s) return "";
    if (/\btest\b|first-class/.test(s)) return "TEST";
    if (/\bodi\b|list a|one-day|one day/.test(s)) return "ODI";
    if (/t20|twenty20/.test(s)) return "T20";
    return "";
  };
  // Domestic matches (internationalClassId "0") get their real class rather than
  // ESPN's eventType, which calls a List A game "ODI" and first-class "Test".
  if (cls && String(cls.internationalClassId) === "0") {
    const card = String(cls.generalClassCard || "");
    if (/first-class/i.test(card)) return "First-class";
    if (/list a/i.test(card)) return "List A";
    if (/twenty20|t20/i.test(card)) return "T20";
    if (/\bod\b|one-day/i.test(card)) return "One-day";
  }
  return fromValue(cls?.eventType) ||
    fromValue(cls?.generalClassCard) ||
    fromValue(cls?.name) ||
    inferTypeFromLeague(leagueName);
}

function inferTypeFromLeague(name) {
  const s = String(name || "").toLowerCase();
  if (/t20|twenty20|pro20/.test(s)) return "T20";
  if (/\bodi\b|one-day|one day|pro50|50-over|list a/.test(s)) return "ODI";
  if (/\btest\b|first-class|sheffield shield|ranji trophy/.test(s)) return "TEST";
  return "";
}

// ─── Status line ──────────────────────────────────────────────────────────────
// For matches ESPN marks "in" but does not cover ball by ball, summary still
// reads "Starts at 09:45 local time"; show the state description instead.
function statusLine(status) {
  const type = status?.type || {};
  const desc = decodeEntities(type.description || "").trim();
  const summary = decodeEntities(status?.summary || "").trim();
  if (type.state === "pre" || type.state === "post") return summary || desc;
  const useful = summary && !/^starts at/i.test(summary) ? summary : "";
  if (desc && !/^live$/i.test(desc)) return useful ? `${desc} - ${useful}` : desc;
  return useful || desc;
}

function venueText(venue) {
  if (!venue) return "";
  const full = (venue.fullName || venue.shortName || "").trim();
  const city = (venue.address?.city || "").trim();
  if (full && city && !full.toLowerCase().includes(city.toLowerCase())) return `${full}, ${city}`;
  return full || city;
}

// ─── Scorepanel event -> site match shape ─────────────────────────────────────
function normaliseEspnEvent(event, league) {
  try {
    const comp = event?.competitions?.[0];
    if (!comp) return null;
    const state = comp.status?.type?.state || event.status?.type?.state;
    if (state !== "pre" && state !== "in" && state !== "post") return null;

    const competitors = orderCompetitors(comp.competitors);
    if (competitors.length !== 2) return null;
    const names = competitors.map(c => c.team?.displayName || c.team?.name || "");
    if (names.some(n => !n)) return null;
    if (names.every(n => /^(tbc|tba|tbd)$/i.test(n.trim()))) return null; // placeholder fixtures

    const start = new Date(event.date || comp.date || comp.startDate);
    if (isNaN(start.getTime())) return null;

    // Score: parse each side's string, fill missing overs (and all-out wickets)
    // from that side's batting linescores, then order innings by match period.
    const entries = [];
    competitors.forEach(c => {
      const sn = shortName(c.team);
      const batting = (c.linescores || [])
        .filter(l => isTrue(l.isBatting))
        .sort((a, b) => (Number(a.period) || 0) - (Number(b.period) || 0));
      parseEspnScoreString(c.score).forEach((inn, i) => {
        let { r, w, o } = inn;
        const ls = batting[i];
        if (ls && num(ls.runs) === r) {
          if (o === null && num(ls.overs) !== null) o = num(ls.overs);
          if (inn.allOut && num(ls.wickets) !== null) w = num(ls.wickets);
        }
        // o stays 0 only when neither the string nor a linescore gives overs (Cricbuzz parser uses the same default).
        entries.push({ r, w, o: o === null ? 0 : o, inning: `${sn} INN ${i + 1}`, _p: ls ? num(ls.period) : null });
      });
    });
    if (entries.every(e => e._p !== null)) entries.sort((a, b) => a._p - b._p);
    const score = entries.map(({ r, w, o, inning }) => ({ r, w, o, inning }));

    const leagueName = league?.name || league?.abbreviation || "";
    return {
      // League id travels in the id: the summary endpoint needs it (league 0 → 502)
      id:          `espn-${event.leagueId || league?.id || 0}-${event.id}`,
      name:        `${names[0]} vs ${names[1]}`,
      matchType:   mapMatchType(comp.class, leagueName),
      series:      leagueName,
      seriesId:    null,
      status:      statusLine(comp.status || event.status),
      venue:       venueText(comp.venue),
      date:        mmddyyyyUTC(start),
      dateTimeGMT: start.toISOString(),
      teams:       names,
      teamInfo:    competitors.map((c, i) => ({ name: names[i], shortname: shortName(c.team), img: logoUrl(c.team) })),
      score,
      matchStarted: state !== "pre",
      matchEnded:   state === "post",
      source:      "espn",
      espn:        { leagueId: String(event.leagueId || league?.id || ""), eventId: String(event.id) },
    };
  } catch (e) {
    console.log("ESPN event normalise failed:", e.message);
    return null;
  }
}

// ─── Scorepanel fetch (one day) ───────────────────────────────────────────────
// Returns [{ event, league }] or null on failure (failures are not cached).
async function fetchScorepanel(day, ttl) {
  const key = `espn:panel:${day || "today"}`;
  const cached = espnCache.get(key);
  if (cached) return cached;
  try {
    const { data } = await axios.get(`${ESPN_BASE}/scorepanel`, {
      headers: espnHeaders,
      timeout: 8000,
      params: day ? { dates: day } : undefined,
    });
    if (!data || !Array.isArray(data.scores)) return null;
    const rows = [];
    data.scores.forEach(group => {
      const league = (group.leagues || [])[0] || null;
      (group.events || []).forEach(event => rows.push({ event, league }));
    });
    espnCache.set(key, rows, ttl);
    return rows;
  } catch (e) {
    console.log(`ESPN scorepanel ${day || "today"} failed:`, e.message);
    return null;
  }
}

// ─── 1. Match lists ───────────────────────────────────────────────────────────
async function getEspnMatches() {
  const key = "espn:matches";
  const cached = espnCache.get(key);
  if (cached) return cached;

  const empty = { live: [], recent: [], upcoming: [] };
  try {
    const now = new Date();
    const dayAt = offset => ymdUTC(new Date(now.getTime() + offset * 86400000));
    // Today's panel first: an event listed on several days keeps its freshest copy.
    const plan = [{ day: null, ttl: TTL.list }];
    for (let i = 1; i <= Math.max(PAST_DAYS, FUTURE_DAYS); i++) {
      if (i <= PAST_DAYS) plan.push({ day: dayAt(-i), ttl: TTL.pastDay });
      if (i <= FUTURE_DAYS) plan.push({ day: dayAt(i), ttl: TTL.futureDay });
    }
    const panels = await Promise.all(plan.map(p => fetchScorepanel(p.day, p.ttl)));
    if (panels.every(p => p === null)) return empty;

    const seen = new Set();
    const result = { live: [], recent: [], upcoming: [] };
    panels.forEach(rows => {
      (rows || []).forEach(({ event, league }) => {
        if (!event?.id || seen.has(String(event.id))) return;
        seen.add(String(event.id));
        const m = normaliseEspnEvent(event, league);
        if (!m) return;
        const bucket = m.matchEnded ? "recent" : m.matchStarted ? "live" : "upcoming";
        result[bucket].push(m);
      });
    });
    const t = m => Date.parse(m.dateTimeGMT) || 0;
    result.recent.sort((a, b) => t(b) - t(a));
    result.upcoming.sort((a, b) => t(a) - t(b));

    espnCache.set(key, result, TTL.list);
    return result;
  } catch (e) {
    console.log("ESPN matches failed:", e.message);
    return empty;
  }
}

// ─── 2. Match summary ─────────────────────────────────────────────────────────
function statMap(statistics) {
  const out = {};
  (statistics?.categories || []).forEach(cat =>
    (cat.stats || []).forEach(s => { out[s.name] = s.value; }));
  return out;
}

function putNum(obj, key, value) {
  const n = num(value);
  if (n !== null) obj[key] = n;
}

function normaliseSummary(data, leagueId, eventId) {
  const header = data?.header;
  const comp = header?.competitions?.[0];
  if (!comp) return null;

  const competitors = orderCompetitors(comp.competitors);
  const teamById = {};
  const teams = competitors.map(c => {
    const t = {
      id: String(c.team?.id || c.id || ""),
      name: c.team?.displayName || c.team?.name || "",
      shortname: shortName(c.team),
      img: logoUrl(c.team),
      homeAway: c.homeAway || "",
      winner: isTrue(c.winner),
    };
    teamById[t.id] = t;
    return t;
  });

  const state = comp.status?.type?.state || "";
  const start = new Date(comp.date || header.date || "");
  const leagueName = header.league?.name || "";

  const out = {
    source: "espn",
    id: `espn-${leagueId}-${eventId}`,
    espn: { leagueId: String(leagueId), eventId: String(eventId) },
    name: teams.length === 2 ? `${teams[0].name} vs ${teams[1].name}` : decodeEntities(header.name || ""),
    series: leagueName,
    description: decodeEntities(header.description || ""),
    matchType: mapMatchType(comp.class, leagueName),
    state,
    status: statusLine(comp.status),
    venue: venueText(data.gameInfo?.venue),
    dateTimeGMT: isNaN(start.getTime()) ? "" : start.toISOString(),
    teams,
  };
  if (comp.status?.session) out.session = comp.status.session;

  const toss = (data.notes || []).find(n => n.type === "toss");
  if (toss?.text) out.toss = decodeEntities(toss.text).replace(/\s+,/g, ",").trim();

  const potm = (comp.status?.featuredAthletes || []).find(a => a.name === "playerOfTheMatch");
  if (potm?.athlete?.displayName) {
    out.playerOfMatch = { name: potm.athlete.displayName, team: teamById[String(potm.team?.id)]?.name || potm.team?.name || "" };
  }

  // Rosters: per player, per match innings (period), batting or bowling figures.
  const rosterByTeam = {};
  (data.rosters || []).forEach(r => { rosterByTeam[String(r.team?.id)] = r.roster || []; });
  const hasRosters = Object.values(rosterByTeam).some(r => r.length);

  const playerRows = (teamId, period) => {
    const rows = [];
    (rosterByTeam[teamId] || []).forEach(p => {
      (p.linescores || []).forEach(per => {
        if (num(per.period) !== period) return;
        (per.linescores || []).forEach(l => rows.push({ p, l, s: statMap(l.statistics) }));
      });
    });
    return rows;
  };

  const innings = [];
  competitors.forEach(c => {
    const teamId = String(c.team?.id || c.id || "");
    const opp = competitors.find(o => o !== c);
    const oppId = opp ? String(opp.team?.id || opp.id || "") : "";
    (c.linescores || []).filter(l => isTrue(l.isBatting)).forEach(ls => {
      const period = num(ls.period);
      const st = statMap(ls.statistics);
      const inn = {
        number: period,
        team: teamById[teamId]?.name || "",
        teamShort: teamById[teamId]?.shortname || "",
        runs: num(ls.runs),
        wickets: num(ls.wickets),
        overs: num(ls.overs),
      };
      if (ls.score) inn.score = ls.score;
      if (ls.description) inn.description = ls.description;
      if (num(ls.target) > 0) inn.target = num(ls.target);
      if (num(ls.followOn) > 0) inn.followOn = true;
      inn.isCurrent = isTrue(ls.isCurrent);
      putNum(inn, "extras", st.extras);
      putNum(inn, "byes", st.byes);
      putNum(inn, "legbyes", st.legbyes);
      putNum(inn, "wides", st.wides);
      putNum(inn, "noballs", st.noballs);
      putNum(inn, "runRate", st.runRate);

      if (hasRosters) {
        const batting = playerRows(teamId, period)
          .filter(x => num(x.s.batted) === 1)
          .map(({ p, l, s }) => {
            const row = {
              id: String(p.athlete?.id || ""),
              name: p.athlete?.displayName || "",
              dismissal: decodeEntities(l.statistics?.batting?.outDetails?.shortText || "").replace(/\s+/g, " ").trim(),
              runs: num(s.runs) ?? 0,
              balls: num(s.ballsFaced) ?? 0,
              fours: num(s.fours) ?? 0,
              sixes: num(s.sixes) ?? 0,
              strikeRate: num(s.strikeRate) ?? 0,
            };
            if (p.captain) row.captain = true;
            if (p.position?.abbreviation === "WK") row.keeper = true;
            if (inn.isCurrent && p.active) row.active = true;
            row._order = num(s.battingPosition) ?? num(l.order) ?? 99;
            return row;
          })
          .sort((a, b) => a._order - b._order)
          .map(({ _order, ...row }) => row);

        const bowling = playerRows(oppId, period)
          .filter(x => (num(x.s.balls) || 0) > 0 || (num(x.s.overs) || 0) > 0)
          .map(({ p, l, s }) => {
            const row = {
              id: String(p.athlete?.id || ""),
              name: p.athlete?.displayName || "",
              overs: num(s.overs) ?? 0,
              maidens: num(s.maidens) ?? 0,
              runs: num(s.conceded) ?? 0,
              wickets: num(s.wickets) ?? 0,
              economy: num(s.economyRate) ?? 0,
            };
            putNum(row, "wides", s.wides);
            putNum(row, "noballs", s.noballs);
            putNum(row, "dots", s.dots);
            if (inn.isCurrent && p.active) row.active = true;
            row._order = num(s.bowlingPosition) ?? num(l.order) ?? 99;
            return row;
          })
          .sort((a, b) => a._order - b._order)
          .map(({ _order, ...row }) => row);

        if (batting.length) inn.batting = batting;
        if (bowling.length) inn.bowling = bowling;
      }

      if (Array.isArray(ls.fow) && ls.fow.length) {
        inn.fallOfWickets = ls.fow.map(f => ({
          wicket: num(f.wicketNumber),
          runs: num(f.runs),
          overs: num(f.wicketOver),
          player: f.athlete?.displayName || "",
        }));
      }
      innings.push(inn);
    });
  });
  innings.sort((a, b) => (a.number || 0) - (b.number || 0));
  out.innings = innings;

  // Recent deliveries (ESPN returns the latest 18 or so), newest first.
  const balls = Object.values(comp.commentaries || {})
    .filter(c => c && typeof c === "object")
    .sort((a, b) => (Number(b.sequence) || 0) - (Number(a.sequence) || 0));
  if (balls.length) {
    out.commentary = balls.map(c => {
      const row = {
        over: num(c.over?.overs),
        runs: num(c.scoreValue) ?? 0,
        text: decodeEntities(c.shortText || ""),
        isWicket: !!c.dismissal?.dismissal,
        isBoundary: !!c.boundary,
        batsman: c.batsman?.athlete?.displayName || "",
        bowler: c.bowler?.athlete?.displayName || "",
        team: c.team?.abbreviation || "",
      };
      const detail = stripTags(c.text);
      if (detail) row.detail = detail;
      // homeScore/awayScore follow competitor "order", not homeAway; the
      // delivery's own innings figures are unambiguous.
      if (num(c.innings?.runs) !== null && num(c.innings?.wickets) !== null) row.score = `${num(c.innings.runs)}/${num(c.innings.wickets)}`;
      if (row.isWicket && c.dismissal?.text) row.dismissal = stripTags(c.dismissal.text);
      return row;
    });
  }
  return out;
}

async function getEspnMatchSummary(leagueId, eventId) {
  try {
    // Accepts ("24830", "1539433"), ("24830", "espn-1539433") or (null, "espn-24830-1539433")
    const full = String(eventId ?? "").match(/^espn-(\d+)-(\d+)$/);
    const ev = full ? full[2] : String(eventId ?? "").replace(/^espn-/, "").trim();
    const lg = full && !leagueId ? full[1] : String(leagueId ?? "").trim();
    if (!/^\d+$/.test(ev) || !/^\d+$/.test(lg)) return null;

    const key = `espn:summary:${ev}`;
    const cached = espnCache.get(key);
    if (cached) return cached;

    const { data } = await axios.get(`${ESPN_BASE}/${lg}/summary`, {
      headers: espnHeaders,
      timeout: 10000,
      params: { event: ev },
    });
    const out = normaliseSummary(data, lg, ev);
    if (!out) return null;
    const ttl = out.state === "post" ? TTL.summaryPost : out.state === "pre" ? TTL.summaryPre : TTL.summaryLive;
    espnCache.set(key, out, ttl);
    return out;
  } catch (e) {
    console.log("ESPN summary failed:", e.message);
    return null;
  }
}

// ─── 3. Merge Cricbuzz (primary) with ESPN (secondary) ────────────────────────
// Matching rule. Two matches are the same when:
//   (a) both team names match as an unordered pair, after normalising each name:
//       lower case, accents/punctuation/"(...)" removed, "&" -> "and";
//       "Women"/"Women's"/"W" -> women marker; "A" (not first word) -> A-team marker;
//       "Under-19s"/"U19" -> u19 marker; abbreviations such as NZ, Ind, SA, WI -> full
//       country name; trailing plural "s" dropped ("Easterns" = "Eastern").
//       Markers must be equal, so "India A" never matches "India" and "India Women"
//       never matches "India". The base names must be equal, or one must be a
//       word-prefix of the other ("Mpumalanga" = "Mpumalanga Rhinos") unless the
//       extra words name a different side (XI, Emerging, Legends, Academy, ...).
//   (b) their start times are at most 24 hours apart.
// Pairing is one-to-one and nearest start time first, so a same-day double header
// is not collapsed into one game. Primary entries are checked across all buckets
// (Cricbuzz may still call a match "upcoming" that ESPN already calls "live").
// The primary entry is always kept; unmatched secondary entries are appended.
const TEAM_ALIASES = {
  "nz": "new zealand", "ind": "india", "aus": "australia", "eng": "england",
  "sa": "south africa", "rsa": "south africa", "pak": "pakistan", "sl": "sri lanka",
  "ban": "bangladesh", "bdesh": "bangladesh", "wi": "west indies", "afg": "afghanistan",
  "zim": "zimbabwe", "ire": "ireland", "ned": "netherlands", "holland": "netherlands",
  "sco": "scotland", "nep": "nepal", "uae": "united arab emirates", "usa": "united states of america",
  "united states": "united states of america", "png": "papua new guinea", "nam": "namibia",
  "oma": "oman", "can": "canada", "hk": "hong kong",
};
const PREFIX_BLOCKERS = new Set(["xi", "emerging", "legend", "champion", "master", "academy", "development", "select", "president", "invitation"]);

function normaliseTeamName(name) {
  let s = String(name || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/&/g, " and ")
    .replace(/\bunder[\s-]*(\d{2})s?\b/g, " u$1 ")
    .replace(/\bu[\s-]*(\d{2})s?\b/g, " u$1 ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const quals = [];
  const base = [];
  s.split(" ").filter(Boolean).forEach((tok, i) => {
    if (tok === "women" || tok === "womens" || (tok === "w" && i > 0)) quals.push("w");
    else if (tok === "a" && i > 0) quals.push("a");
    else if (/^u\d{2}$/.test(tok)) quals.push(tok);
    else if (tok === "men" || tok === "mens") return;
    else base.push(tok);
  });
  let joined = base.join(" ");
  if (TEAM_ALIASES[joined]) joined = TEAM_ALIASES[joined];
  const tokens = joined.split(" ").filter(Boolean)
    .map(t => (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t));
  return { tokens, base: tokens.join(" "), quals: [...new Set(quals)].sort().join(",") };
}

function isWordPrefix(shorter, longer) {
  if (!shorter.length || shorter.length >= longer.length) return false;
  for (let i = 0; i < shorter.length; i++) if (shorter[i] !== longer[i]) return false;
  return !longer.slice(shorter.length).some(t => PREFIX_BLOCKERS.has(t));
}

function sameTeam(a, b) {
  if (!a.base || !b.base || a.quals !== b.quals) return false;
  return a.base === b.base || isWordPrefix(a.tokens, b.tokens) || isWordPrefix(b.tokens, a.tokens);
}

function teamKeys(m) {
  let names = Array.isArray(m?.teams) && m.teams.length === 2 ? m.teams : null;
  if (!names && Array.isArray(m?.teamInfo) && m.teamInfo.length === 2) names = m.teamInfo.map(t => t?.name);
  if (!names && typeof m?.name === "string") {
    const parts = m.name.split(/\s+(?:vs?\.?)\s+/i);
    if (parts.length === 2) names = parts;
  }
  if (!names || names.some(n => !n)) return null;
  return names.map(normaliseTeamName);
}

function samePair(ka, kb) {
  return (sameTeam(ka[0], kb[0]) && sameTeam(ka[1], kb[1])) ||
         (sameTeam(ka[0], kb[1]) && sameTeam(ka[1], kb[0]));
}

function mergeMatchLists(primary, secondary) {
  const buckets = ["live", "recent", "upcoming"];
  const list = (obj, b) => (obj && Array.isArray(obj[b]) ? obj[b] : []);
  try {
    const result = {};
    buckets.forEach(b => { result[b] = list(primary, b).slice(); });

    const prim = [];
    buckets.forEach(b => list(primary, b).forEach(m => {
      prim.push({ keys: teamKeys(m), t: Date.parse(m?.dateTimeGMT) });
    }));
    const sec = [];
    buckets.forEach(b => list(secondary, b).forEach(m => {
      sec.push({ m, b, keys: teamKeys(m), t: Date.parse(m?.dateTimeGMT) });
    }));

    const pairs = [];
    sec.forEach((s, si) => {
      if (!s.keys || isNaN(s.t)) return;
      prim.forEach((p, pi) => {
        if (!p.keys || isNaN(p.t)) return;
        const diff = Math.abs(s.t - p.t);
        if (diff <= 86400000 && samePair(s.keys, p.keys)) pairs.push({ si, pi, diff });
      });
    });
    pairs.sort((a, b) => a.diff - b.diff);
    const usedS = new Set(), usedP = new Set();
    pairs.forEach(({ si, pi }) => {
      if (usedS.has(si) || usedP.has(pi)) return;
      usedS.add(si); usedP.add(pi);
    });

    sec.forEach((s, si) => { if (!usedS.has(si)) result[s.b].push(s.m); });
    return result;
  } catch (e) {
    console.log("mergeMatchLists failed:", e.message);
    const fallback = {};
    buckets.forEach(b => { fallback[b] = list(primary, b).slice(); });
    return fallback;
  }
}

// ─── Mappers: ESPN summary → the shapes the site's match pages read ─────────
// (same fields as the Cricbuzz-based routes in api/index.js and api/scraper.js)

const n2 = v => (Number.isFinite(Number(v)) ? Number(v).toFixed(2) : "");

// "India, elected to field first" / "India won the toss and elected to bat"
function parseToss(text) {
  const m = String(text || "").match(/^(.+?),?\s+(?:won the toss and\s+)?(?:elected|chose|opted)\s+to\s+(bat|bowl|field)/i);
  if (!m) return null;
  const choice = m[2].toLowerCase() === "field" ? "bowl" : m[2].toLowerCase();
  return { winner: m[1].trim(), choice, text: `${m[1].trim()} won the toss and chose to ${choice}` };
}

function summaryToMatchInfo(sm) {
  const toss = parseToss(sm.toss);
  return {
    id: sm.id,
    name: sm.name,
    matchType: sm.matchType || "",
    series: sm.series || "",
    status: sm.status || "",
    venue: sm.venue || "",
    date: sm.dateTimeGMT ? new Date(sm.dateTimeGMT).toLocaleDateString("en-US") : "",
    dateTimeGMT: sm.dateTimeGMT || "",
    teams: (sm.teams || []).map(t => t.name),
    teamInfo: (sm.teams || []).map(t => ({ name: t.name, shortname: t.shortname, img: t.img })),
    score: (sm.innings || []).map(i => ({ r: i.runs, w: i.wickets, o: i.overs, inning: `${i.teamShort || i.team} INN ${i.number || 1}` })),
    matchStarted: sm.state !== "pre",
    matchEnded: sm.state === "post",
    tossWinner: toss ? toss.winner : "",
    tossChoice: toss ? toss.choice : "",
    source: "espn",
  };
}

function summaryToScorecard(sm) {
  return {
    innings: (sm.innings || []).map(i => ({
      team: i.team,
      score: `${i.runs}/${i.wickets}${i.overs != null ? ` (${i.overs} Ov)` : ""}`,
      overs: i.overs != null ? String(i.overs) : "",
      runRate: i.runRate != null ? n2(i.runRate) : "",
      batsmen: (i.batting || []).map(b => ({
        name: b.name, dismissal: b.dismissal || "", r: String(b.runs ?? ""), b: String(b.balls ?? ""),
        fours: String(b.fours ?? ""), sixes: String(b.sixes ?? ""), sr: n2(b.strikeRate),
      })),
      bowlers: (i.bowling || []).map(b => ({
        name: b.name, o: String(b.overs ?? ""), m: String(b.maidens ?? ""), r: String(b.runs ?? ""),
        w: String(b.wickets ?? ""), eco: n2(b.economy),
      })),
      extras: i.extras != null ? `${i.extras} (b ${i.byes || 0}, lb ${i.legbyes || 0}, w ${i.wides || 0}, nb ${i.noballs || 0})` : undefined,
      partnerships: [],
      fow: (i.fallOfWickets || []).map(f => `${f.runs}-${f.wicket} (${f.player}, ${f.overs} ov)`),
    })),
  };
}

// Ball-by-ball facts only. ESPN's descriptive commentary prose (`detail`) is
// ESPNcricinfo's own writing and is deliberately not republished.
function summaryToCommentary(sm) {
  return (sm.commentary || []).map(c => ({
    over: c.over != null ? String(c.over) : "",
    ball: "",
    event: c.isWicket ? "WICKET" : c.isBoundary && c.runs === 6 ? "SIX" : c.isBoundary && c.runs === 4 ? "FOUR" : "default",
    text: c.score ? `${c.text} (${c.team ? c.team + " " : ""}${c.score})` : c.text,
    batsmanStriker: c.batsman || "",
    bowlerStriker: c.bowler || "",
    runs: c.runs || 0,
  }));
}

function summaryToInfoTab(sm) {
  return {
    series: sm.series || "",
    matchType: sm.matchType || "",
    matchNumber: sm.description || "",
    venue: { fullName: sm.venue || "" },
    date: sm.dateTimeGMT || null,
    toss: parseToss(sm.toss) || (sm.toss ? { text: sm.toss } : null),
    umpires: [],
    playersOfTheMatch: sm.playerOfMatch ? [].concat(sm.playerOfMatch).map(p => (typeof p === "string" ? p : p.name)).filter(Boolean) : [],
    status: sm.status || "",
  };
}

module.exports = {
  getEspnMatches,
  getEspnMatchSummary,
  mergeMatchLists,
  summaryToMatchInfo,
  summaryToScorecard,
  summaryToCommentary,
  summaryToInfoTab,
  // helpers, exported for tests and route code
  parseEspnScoreString,
  normaliseEspnEvent,
  normaliseTeamName,
};
