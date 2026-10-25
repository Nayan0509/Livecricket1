#!/usr/bin/env node
// Cricsheet -> livecricketzone.com statistics pipeline.
//
// Downloads Cricsheet's international Test, ODI and T20I ball-by-ball archives (JSON),
// unzips them outside the repo, and writes compact statistics computed from the raw
// deliveries to api/data/cricsheet/*.json (meta, records, h2h, venues).
//
// Usage (from the repo root):
//   node scripts/cricsheet/build.js [--raw DIR] [--out DIR] [--offline] [--pretty]
//     --raw DIR   where zips are downloaded and unzipped. Default: $CRICSHEET_RAW, else
//                 <os tmpdir>/cricsheet-raw. Keep it outside the repo; it is ~1.6 GB unzipped.
//     --out DIR   output folder. Default: api/data/cricsheet in this repo.
//     --offline   skip download and unzip; reuse the folders already in --raw.
//     --pretty    indent the output JSON (larger files).
//
// Needs Node 18+ (global fetch) and a zip extractor (see fetch.js). No npm dependencies.
//
// Data licence: Cricsheet data is made available under the Open Data Commons Attribution
// License (ODC-By 1.0). Every public use must credit Cricsheet; see ATTRIBUTION below.
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { download, extractZip } = require("./fetch");
const venueNames = require("./venues");

const REPO = path.resolve(__dirname, "..", "..");
const BASE_URL = "https://cricsheet.org/downloads/";
const ARCHIVES = [
  { format: "test", file: "tests_json.zip", dir: "tests", matchType: "Test" },
  { format: "odi", file: "odis_json.zip", dir: "odis", matchType: "ODI" },
  { format: "t20i", file: "t20s_json.zip", dir: "t20s", matchType: "T20" },
];
const FORMATS = ["test", "odi", "t20i"];
const GENDERS = ["men", "women"];
const TOP = 25;
const MIN_BAT_INNINGS = 20;
const MIN_BOWL_WICKETS = { test: 50, odi: 50, t20i: 30 };
const LAST_RESULTS = 5;

// Wicket kinds that do not end a batter's innings as a dismissal.
const NOT_OUT_KINDS = new Set(["retired hurt", "retired not out"]);
// Wicket kinds credited to the bowler.
const BOWLER_KINDS = new Set(["bowled", "caught", "caught and bowled", "lbw", "stumped", "hit wicket"]);
// Same national side under an older name.
const TEAM_ALIASES = { Swaziland: "Eswatini" };

const LICENCE = {
  name: "Open Data Commons Attribution License (ODC-By) v1.0",
  url: "https://opendatacommons.org/licenses/by/1-0/",
  cricsheetPage: "https://cricsheet.org/licensing/",
};
const ATTRIBUTION =
  "Contains information from Cricsheet (https://cricsheet.org), which is made available under the " +
  "ODC Attribution License (https://opendatacommons.org/licenses/by/1-0/).";

// ── helpers ──────────────────────────────────────────────────────────────────
const r2 = (x) => Math.round(x * 100) / 100;
const oversText = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;
const team = (t) => TEAM_ALIASES[t] || t;
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
const year = (d) => d.slice(0, 4);

function parseArgs(argv) {
  const a = { raw: process.env.CRICSHEET_RAW || path.join(os.tmpdir(), "cricsheet-raw"),
    out: path.join(REPO, "api", "data", "cricsheet"), offline: false, pretty: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--raw") a.raw = path.resolve(argv[++i]);
    else if (argv[i] === "--out") a.out = path.resolve(argv[++i]);
    else if (argv[i] === "--offline") a.offline = true;
    else if (argv[i] === "--pretty") a.pretty = true;
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  const rel = path.relative(REPO, a.raw);
  if (!rel.startsWith("..") && !path.isAbsolute(rel)) throw new Error(`--raw must be outside the repo (${a.raw})`);
  return a;
}

function outcomeText(o) {
  const by = o.by || {};
  const winner = o.winner ? team(o.winner) : null;
  const notes = [];
  const methods = { "D/L": "D/L method", VJD: "VJD method", Awarded: "awarded",
    "1st innings score": "decided on first-innings score", "Lost fewer wickets": "decided on fewer wickets lost" };
  if (o.method) notes.push(methods[o.method] || o.method);
  let t;
  if (winner) {
    if (by.innings) t = `${winner} won by an innings` + (by.runs ? ` and ${plural(by.runs, "run")}` : "");
    else if (by.runs != null) t = `${winner} won by ${plural(by.runs, "run")}`;
    else if (by.wickets != null) t = `${winner} won by ${plural(by.wickets, "wicket")}`;
    else t = `${winner} won`;
  } else if (o.result === "tie") {
    t = "Match tied";
    if (o.eliminator) notes.push(`${team(o.eliminator)} won the Super Over`);
    else if (o.bowl_out) notes.push(`${team(o.bowl_out)} won the bowl-out`);
  } else if (o.result === "draw") t = "Match drawn";
  else if (o.result === "no result") t = "No result";
  else t = "Result not recorded";
  return notes.length ? `${t} (${notes.join("; ")})` : t;
}

function resultKind(o) {
  if (o.winner) return "win";
  if (o.result === "tie") return "tie";
  if (o.result === "draw") return "draw";
  if (o.result === "no result") return "nr";
  return "unknown";
}

// ── accumulation state ───────────────────────────────────────────────────────
function newBlock() {
  return { matches: 0, firstDate: null, lastDate: null, byYear: {}, numbers: new Map(), players: new Map(),
    scores: [], bowling: [], totals: [], h2h: new Map() };
}
const blocks = {};
for (const f of FORMATS) { blocks[f] = {}; for (const g of GENDERS) blocks[f][g] = newBlock(); }
const latestName = new Map();        // person id -> { name, date }
const venueVariants = new Map();     // raw venue + city -> { key, venue, city, count, lastDate }
const venueFacts = [];               // one per match, resolved to merged venues at the end
const stats = { files: {}, skipped: {}, unregistered: new Set() };

function player(B, id) {
  let P = B.players.get(id);
  if (!P) {
    P = { id, matches: 0, teams: {}, firstDate: null, lastDate: null,
      bat: { inns: 0, no: 0, runs: 0, balls: 0, fours: 0, sixes: 0, hs: -1, hsNo: false, h100: 0, h50: 0, ducks: 0 },
      bowl: { inns: 0, balls: 0, runs: 0, wkts: 0, bestW: -1, bestR: 0, w4: 0, w5: 0 } };
    B.players.set(id, P);
  }
  return P;
}

function noteName(id, name, date) {
  const cur = latestName.get(id);
  if (!cur || date >= cur.date) latestName.set(id, { name, date });
}

function processMatch(m, arch, matchId) {
  const info = m.info || {};
  if (info.match_type !== arch.matchType || info.team_type !== "international") return "match type";
  const g = info.gender === "male" ? "men" : info.gender === "female" ? "women" : null;
  if (!g) return "gender";
  if (!Array.isArray(info.dates) || !info.dates.length || !Array.isArray(info.teams) || info.teams.length !== 2) return "missing info";

  const fmt = arch.format;
  const B = blocks[fmt][g];
  const date = info.dates[0];
  const teams = info.teams.map(team);
  const reg = (info.registry && info.registry.people) || {};
  const pid = (n) => { if (reg[n]) return reg[n]; stats.unregistered.add(n); return "name:" + n; };

  B.matches++;
  if (!B.firstDate || date < B.firstDate) B.firstDate = date;
  if (!B.lastDate || date > B.lastDate) B.lastDate = date;
  B.byYear[year(date)] = (B.byYear[year(date)] || 0) + 1;
  if (Number.isInteger(info.match_type_number)) B.numbers.set(info.match_type_number, year(date));

  const vKey = `${info.venue || "Unknown venue"}\u0000${info.city || ""}`;
  const vv = venueVariants.get(vKey) || { key: vKey, venue: info.venue || "Unknown venue", city: info.city || "", count: 0, lastDate: "" };
  vv.count++; if (date > vv.lastDate) vv.lastDate = date;
  venueVariants.set(vKey, vv);

  // Appearances: everyone named in info.players played the match.
  const played = new Set();
  const appear = (id, name, t) => {
    noteName(id, name, date);
    if (played.has(id)) return;
    played.add(id);
    const P = player(B, id);
    P.matches++;
    P.teams[t] = (P.teams[t] || 0) + 1;
    if (!P.firstDate || date < P.firstDate) P.firstDate = date;
    if (!P.lastDate || date > P.lastDate) P.lastDate = date;
  };
  for (const [t, list] of Object.entries(info.players || {})) for (const n of list) appear(pid(n), n, team(t));

  const inningsTotals = [];
  const innings = (m.innings || []).filter((inn) => !inn.super_over);
  innings.forEach((inn, idx) => {
    const batTeam = team(inn.team);
    const bowlTeam = teams.find((t) => t !== batTeam) || "";
    const batters = new Map();
    const bowlers = new Map();
    const bt = (name) => {
      const id = pid(name);
      appear(id, name, batTeam);
      if (!batters.has(id)) batters.set(id, { id, name, runs: 0, balls: 0, fours: 0, sixes: 0, out: false });
      return batters.get(id);
    };
    const bw = (name) => {
      const id = pid(name);
      appear(id, name, bowlTeam);
      if (!bowlers.has(id)) bowlers.set(id, { id, name, balls: 0, runs: 0, wkts: 0 });
      return bowlers.get(id);
    };
    let total = ((inn.penalty_runs && inn.penalty_runs.pre) || 0) + ((inn.penalty_runs && inn.penalty_runs.post) || 0);
    let wkts = 0;
    let legal = 0;
    for (const over of inn.overs || []) {
      for (const d of over.deliveries || []) {
        const ex = d.extras || {};
        const wide = (ex.wides || 0) > 0;
        const noball = (ex.noballs || 0) > 0;
        const b = bt(d.batter);
        bt(d.non_striker);
        const bowler = bw(d.bowler);
        const rb = (d.runs && d.runs.batter) || 0;
        total += (d.runs && d.runs.total) || 0;
        b.runs += rb;
        if (!wide) b.balls++;                       // no-balls count as balls faced, wides do not
        if (!d.runs.non_boundary) { if (rb === 4) b.fours++; else if (rb === 6) b.sixes++; }
        if (!wide && !noball) { bowler.balls++; legal++; }
        bowler.runs += rb + (ex.wides || 0) + (ex.noballs || 0); // byes, leg-byes, penalties not charged
        for (const w of d.wickets || []) {
          const out = bt(w.player_out);
          if (!NOT_OUT_KINDS.has(w.kind)) { out.out = true; wkts++; }
          if (BOWLER_KINDS.has(w.kind)) bowler.wkts++;
        }
      }
    }

    for (const x of batters.values()) {
      const S = player(B, x.id).bat;
      S.inns++;
      if (!x.out) S.no++;
      S.runs += x.runs; S.balls += x.balls; S.fours += x.fours; S.sixes += x.sixes;
      if (x.runs > S.hs || (x.runs === S.hs && !x.out)) { S.hs = x.runs; S.hsNo = !x.out; }
      if (x.runs >= 100) S.h100++; else if (x.runs >= 50) S.h50++;
      if (x.runs === 0 && x.out) S.ducks++;
      if (x.runs >= 50) B.scores.push({ id: x.id, team: batTeam, runs: x.runs, notOut: !x.out, balls: x.balls,
        fours: x.fours, sixes: x.sixes, opponent: bowlTeam, vKey, date, matchId });
    }
    for (const x of bowlers.values()) {
      const S = player(B, x.id).bowl;
      S.inns++; S.balls += x.balls; S.runs += x.runs; S.wkts += x.wkts;
      if (x.wkts > S.bestW || (x.wkts === S.bestW && x.runs < S.bestR)) { S.bestW = x.wkts; S.bestR = x.runs; }
      if (x.wkts >= 5) S.w5++; else if (x.wkts === 4) S.w4++;
      if (x.wkts >= 3) B.bowling.push({ id: x.id, team: bowlTeam, wickets: x.wkts, runs: x.runs, balls: x.balls,
        opponent: batTeam, vKey, date, matchId });
    }
    const tot = { team: batTeam, opponent: bowlTeam, runs: total, wickets: wkts, balls: legal,
      declared: !!inn.declared, forfeited: !!inn.forfeited, inningsNo: idx + 1, vKey, date, matchId };
    inningsTotals.push(tot);
    if (!inn.forfeited) B.totals.push(tot);
  });

  const o = info.outcome || {};
  const kind = resultKind(o);
  const winner = o.winner ? team(o.winner) : null;
  const tieBreak = kind === "tie" ? (o.eliminator ? team(o.eliminator) : o.bowl_out ? team(o.bowl_out) : null) : null;
  const pair = [...teams].sort();
  const hk = pair.join("|");
  let H = B.h2h.get(hk);
  if (!H) {
    H = { teams: pair, matches: 0, wins: { [pair[0]]: 0, [pair[1]]: 0 }, ties: 0, draws: 0, noResults: 0,
      tieBreakWins: { [pair[0]]: 0, [pair[1]]: 0 }, firstDate: date, lastDate: date, results: [] };
    B.h2h.set(hk, H);
  }
  H.matches++;
  if (kind === "win" && winner in H.wins) H.wins[winner]++;
  else if (kind === "tie") { H.ties++; if (tieBreak in H.tieBreakWins) H.tieBreakWins[tieBreak]++; }
  else if (kind === "draw") H.draws++;
  else if (kind === "nr") H.noResults++;
  if (date < H.firstDate) H.firstDate = date;
  if (date > H.lastDate) H.lastDate = date;
  H.results.push({ date, num: info.match_type_number || 0, matchId, vKey, winner, result: outcomeText(o) });

  venueFacts.push({ vKey, fmt, g, date, kind, winner, method: o.method || null,
    first: inningsTotals[0] || null, totals: inningsTotals.filter((t) => !t.forfeited) });
  return null;
}

// ── output builders ──────────────────────────────────────────────────────────
function teamLabel(teams) {
  return Object.entries(teams).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map((e) => e[0]).join("/");
}
const nameOf = (id) => (latestName.get(id) || { name: id.replace(/^name:/, "") }).name;
const span = (P) => (year(P.firstDate) === year(P.lastDate) ? year(P.firstDate) : `${year(P.firstDate)}-${year(P.lastDate)}`);
const hsText = (S) => (S.hs < 0 ? null : `${S.hs}${S.hsNo ? "*" : ""}`);
const bestText = (S) => (S.bestW < 0 ? null : `${S.bestW}/${S.bestR}`);
const byName = (a, b) => nameOf(a.id).localeCompare(nameOf(b.id)) || a.id.localeCompare(b.id);

// Estimated share of each year's matches that the data holds, from gaps in the official match
// numbers (info.match_type_number). A gap is a numbered match with no file: not in Cricsheet,
// withheld, or abandoned without a ball (those still get a number, so the share is a lower bound).
// Jumps above MAX_NUMBER_GAP are treated as numbering errors and ignored.
const MAX_NUMBER_GAP = 200;
const SPARSE_SHARE = 0.8;
function coverageByYear(B) {
  const out = {};
  for (const [y, n] of Object.entries(B.byYear).sort()) out[y] = { matches: n, missingNumbers: 0, share: null };
  const nums = [...B.numbers.entries()].sort((a, b) => a[0] - b[0]);
  const present = {};
  let prev = null;
  for (const [n, y] of nums) {
    present[y] = (present[y] || 0) + 1;
    if (prev !== null) { const gap = n - prev - 1; if (gap > 0 && gap <= MAX_NUMBER_GAP) out[y].missingNumbers += gap; }
    prev = n;
  }
  for (const [y, o] of Object.entries(out)) {
    const p = present[y] || 0;
    o.share = p ? r2(p / (p + o.missingNumbers)) : null;
  }
  return out;
}

function buildRecords(fmt, g, venueLabel, coverage) {
  const B = blocks[fmt][g];
  const all = [...B.players.values()];
  const firstYear = B.firstDate ? year(B.firstDate) : null;
  const sparse = (d) => { const y = year(d); return y === firstYear || (coverage[y] && coverage[y].share !== null && coverage[y].share < SPARSE_SHARE); };
  const base = (P) => {
    const e = { id: P.id, name: nameOf(P.id), team: teamLabel(P.teams), span: span(P), matches: P.matches };
    if (sparse(P.firstDate)) e.mayBeIncomplete = true;
    return e;
  };
  const bat = (P) => {
    const S = P.bat; const outs = S.inns - S.no;
    return Object.assign(base(P), { innings: S.inns, notOuts: S.no, runs: S.runs, balls: S.balls,
      highScore: hsText(S), average: outs ? r2(S.runs / outs) : null,
      strikeRate: S.balls ? r2((100 * S.runs) / S.balls) : null, hundreds: S.h100, fifties: S.h50,
      fours: S.fours, sixes: S.sixes, ducks: S.ducks });
  };
  const bowl = (P) => {
    const S = P.bowl;
    return Object.assign(base(P), { innings: S.inns, balls: S.balls, overs: oversText(S.balls), runs: S.runs,
      wickets: S.wkts, best: bestText(S), average: S.wkts ? r2(S.runs / S.wkts) : null,
      economy: S.balls ? r2(S.runs / (S.balls / 6)) : null, strikeRate: S.wkts ? r2(S.balls / S.wkts) : null,
      fourWickets: S.w4, fiveWickets: S.w5 });
  };
  const top = (list, cmp, map) => list.sort(cmp).slice(0, TOP).map(map);
  const minW = MIN_BOWL_WICKETS[fmt];
  const batAvg = (P) => P.bat.runs / (P.bat.inns - P.bat.no);
  const bowlAvg = (P) => P.bowl.runs / P.bowl.wkts;

  return {
    coverage: { matches: B.matches, firstDate: B.firstDate, lastDate: B.lastDate },
    qualification: { battingAverageMinInnings: MIN_BAT_INNINGS, bowlingAverageMinWickets: minW },
    mostRuns: top(all.filter((P) => P.bat.runs > 0),
      (a, b) => b.bat.runs - a.bat.runs || a.bat.inns - b.bat.inns || byName(a, b), bat),
    mostWickets: top(all.filter((P) => P.bowl.wkts > 0),
      (a, b) => b.bowl.wkts - a.bowl.wkts || a.bowl.runs - b.bowl.runs || byName(a, b), bowl),
    highestScores: B.scores
      .sort((a, b) => b.runs - a.runs || (b.notOut - a.notOut) || a.balls - b.balls || a.date.localeCompare(b.date))
      .slice(0, TOP)
      .map((s) => ({ id: s.id, name: nameOf(s.id), team: s.team, runs: s.runs, notOut: s.notOut, score: `${s.runs}${s.notOut ? "*" : ""}`,
        balls: s.balls, fours: s.fours, sixes: s.sixes, opponent: s.opponent, venue: venueLabel(s.vKey), date: s.date, matchId: s.matchId })),
    bestBowling: B.bowling
      .sort((a, b) => b.wickets - a.wickets || a.runs - b.runs || a.balls - b.balls || a.date.localeCompare(b.date))
      .slice(0, TOP)
      .map((s) => ({ id: s.id, name: nameOf(s.id), team: s.team, figures: `${s.wickets}/${s.runs}`, wickets: s.wickets,
        runs: s.runs, overs: oversText(s.balls), opponent: s.opponent, venue: venueLabel(s.vKey), date: s.date, matchId: s.matchId })),
    mostHundreds: top(all.filter((P) => P.bat.h100 > 0),
      (a, b) => b.bat.h100 - a.bat.h100 || a.bat.inns - b.bat.inns || byName(a, b), bat),
    mostFifties: top(all.filter((P) => P.bat.h50 > 0),
      (a, b) => b.bat.h50 - a.bat.h50 || a.bat.inns - b.bat.inns || byName(a, b), bat),
    highestTeamTotals: B.totals
      .sort((a, b) => b.runs - a.runs || a.wickets - b.wickets || a.date.localeCompare(b.date))
      .slice(0, TOP)
      .map((t) => ({ team: t.team, opponent: t.opponent, runs: t.runs, wickets: t.wickets,
        score: `${t.runs}${t.wickets < 10 ? "/" + t.wickets : ""}${t.declared ? "d" : ""}`, overs: oversText(t.balls),
        declared: t.declared, inningsNo: t.inningsNo, venue: venueLabel(t.vKey), date: t.date, matchId: t.matchId })),
    bestBattingAverage: top(all.filter((P) => P.bat.inns >= MIN_BAT_INNINGS && P.bat.inns > P.bat.no),
      (a, b) => batAvg(b) - batAvg(a) || b.bat.runs - a.bat.runs || byName(a, b), bat),
    bestBowlingAverage: top(all.filter((P) => P.bowl.wkts >= minW),
      (a, b) => bowlAvg(a) - bowlAvg(b) || b.bowl.wkts - a.bowl.wkts || byName(a, b), bowl),
  };
}

function buildVenues() {
  const { clusterOf, clusters } = venueNames.clusterVenues([...venueVariants.values()]);
  const out = clusters.map((c) => {
    const leadTexts = {}; const cities = {}; let lastDate = "";
    for (const v of c.variants) {
      const canonical = venueNames.compact(v.leadText) === c.lead;
      const lt = v.leadText;
      leadTexts[lt] = leadTexts[lt] || { n: 0, last: "", canonical };
      leadTexts[lt].n += v.count; if (v.lastDate > leadTexts[lt].last) leadTexts[lt].last = v.lastDate;
      if (v.city) { cities[v.city] = cities[v.city] || { n: 0, last: "" }; cities[v.city].n += v.count; if (v.lastDate > cities[v.city].last) cities[v.city].last = v.lastDate; }
      if (v.lastDate > lastDate) lastDate = v.lastDate;
    }
    // Name: a spelling of the canonical (current) name, most used first. City: most recent.
    const name = Object.entries(leadTexts).sort((a, b) => (b[1].canonical - a[1].canonical) || b[1].n - a[1].n ||
      b[1].last.localeCompare(a[1].last) || a[0].localeCompare(b[0]))[0][0];
    const cityPick = Object.entries(cities).sort((a, b) => b[1].last.localeCompare(a[1].last) || b[1].n - a[1].n || a[0].localeCompare(b[0]))[0];
    const places = new Set(); for (const v of c.variants) for (const p of v.places) places.add(p);
    return { name, city: cityPick ? cityPick[0] : "", lead: c.lead, places: [...places].sort(),
      aliases: [...new Set(c.variants.map((v) => v.venue))].sort(), ambiguous: c.ambiguous, facts: [] };
  });
  for (const f of venueFacts) out[clusterOf.get(f.vKey)].facts.push(f);

  const usedIds = new Set();
  const label = (V) => (V.city && !venueNames.compact(V.name).includes(venueNames.compact(V.city)) ? `${V.name}, ${V.city}` : V.name);
  const venues = out.map((V) => {
    let id = (V.name + " " + V.city).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/&/g, " and ").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (usedIds.has(id)) { let i = 2; while (usedIds.has(`${id}-${i}`)) i++; id = `${id}-${i}`; }
    usedIds.add(id);
    V.id = id; V.label = label(V);
    const formats = {};
    let first = null; let last = null;
    for (const f of V.facts) {
      if (!first || f.date < first) first = f.date;
      if (!last || f.date > last) last = f.date;
      formats[f.fmt] = formats[f.fmt] || {};
      const s = formats[f.fmt][f.g] = formats[f.fmt][f.g] || { matches: 0, fiN: 0, fiRuns: 0, batFirstWins: 0,
        batSecondWins: 0, ties: 0, draws: 0, noResults: 0, awarded: 0, highest: null };
      s.matches++;
      if (f.kind !== "nr" && f.first && f.first.balls > 0) { s.fiN++; s.fiRuns += f.first.runs; }
      if (f.kind === "win" && f.method === "Awarded") s.awarded++;
      else if (f.kind === "win" && f.first) { if (f.winner === f.first.team) s.batFirstWins++; else s.batSecondWins++; }
      else if (f.kind === "tie") s.ties++;
      else if (f.kind === "draw") s.draws++;
      else if (f.kind === "nr") s.noResults++;
      for (const t of f.totals) {
        if (!s.highest || t.runs > s.highest.runs || (t.runs === s.highest.runs && t.date < s.highest.date)) {
          s.highest = { runs: t.runs, wickets: t.wickets, score: `${t.runs}${t.wickets < 10 ? "/" + t.wickets : ""}${t.declared ? "d" : ""}`,
            overs: oversText(t.balls), team: t.team, opponent: t.opponent, date: t.date, matchId: t.matchId };
        }
      }
    }
    for (const fm of Object.values(formats)) for (const [g, s] of Object.entries(fm)) {
      fm[g] = { matches: s.matches, avgFirstInnings: s.fiN ? Math.round(s.fiRuns / s.fiN) : null, firstInningsSample: s.fiN,
        batFirstWins: s.batFirstWins, batSecondWins: s.batSecondWins, ties: s.ties, draws: s.draws, noResults: s.noResults,
        ...(s.awarded ? { awarded: s.awarded } : {}), highestTotal: s.highest };
    }
    const keys = venueNames.lookupKeys(V.lead);
    for (const a of V.aliases) { const k = venueNames.compact(a.split(",")[0]); if (!keys.includes(k)) keys.push(k); }
    return { id, name: V.name, city: V.city, label: label(V), matches: V.facts.length, firstDate: first, lastDate: last,
      keys, places: V.places, aliases: V.aliases, ...(V.ambiguous ? { sharedName: true } : {}), formats };
  }).sort((a, b) => b.matches - a.matches || a.id.localeCompare(b.id));

  const labelOf = new Map();
  for (const [vKey, idx] of clusterOf) labelOf.set(vKey, out[idx].label);
  return { venues, venueLabel: (vKey) => labelOf.get(vKey) || vKey.split("\u0000")[0] };
}

function buildH2H(venueLabel) {
  const out = {};
  for (const f of FORMATS) {
    out[f] = {};
    for (const g of GENDERS) {
      const res = {};
      const keys = [...blocks[f][g].h2h.keys()].sort();
      for (const k of keys) {
        const H = blocks[f][g].h2h.get(k);
        const last = H.results
          .sort((a, b) => b.date.localeCompare(a.date) || b.num - a.num || b.matchId.localeCompare(a.matchId))
          .slice(0, LAST_RESULTS)
          .map((r) => ({ date: r.date, venue: venueLabel(r.vKey), winner: r.winner, result: r.result, matchId: r.matchId }));
        const e = { teams: H.teams, matches: H.matches, wins: H.wins, ties: H.ties, draws: H.draws, noResults: H.noResults,
          firstDate: H.firstDate, lastDate: H.lastDate, last5: last };
        if (H.tieBreakWins[H.teams[0]] || H.tieBreakWins[H.teams[1]]) e.tieBreakWins = H.tieBreakWins;
        res[k] = e;
      }
      out[f][g] = res;
    }
  }
  return out;
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const t0 = Date.now();
  fs.mkdirSync(args.raw, { recursive: true });
  console.log(`raw folder: ${args.raw}\noutput folder: ${args.out}`);

  const downloads = [];
  for (const a of ARCHIVES) {
    const zip = path.join(args.raw, a.file);
    const dir = path.join(args.raw, a.dir);
    if (!args.offline) {
      downloads.push(await download(BASE_URL + a.file, zip));
      const x = extractZip(zip, dir);
      console.log(`  unzipped ${a.file} with ${x.tool}: ${x.jsonFiles} JSON files`);
    } else {
      if (!fs.existsSync(dir)) throw new Error(`--offline: ${dir} does not exist`);
      const st = fs.existsSync(zip) ? fs.statSync(zip) : null;
      downloads.push({ url: BASE_URL + a.file, bytes: st ? st.size : null, lastModified: null, reused: true });
    }
  }

  for (const a of ARCHIVES) {
    const dir = path.join(args.raw, a.dir);
    const files = fs.readdirSync(dir).filter((f) => /^\d+\.json$/.test(f))
      .sort((x, y) => parseInt(x, 10) - parseInt(y, 10));
    stats.files[a.format] = files.length;
    for (const f of files) {
      let m;
      try { m = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); }
      catch (e) { stats.skipped[`${a.format}: unreadable`] = (stats.skipped[`${a.format}: unreadable`] || 0) + 1; continue; }
      const why = processMatch(m, a, f.replace(/\.json$/, ""));
      if (why) stats.skipped[`${a.format}: ${why}`] = (stats.skipped[`${a.format}: ${why}`] || 0) + 1;
    }
    console.log(`  parsed ${files.length} ${a.format} files`);
  }

  const builtAt = new Date().toISOString();
  const about = { source: "Cricsheet", url: "https://cricsheet.org", licence: LICENCE.name, licenceUrl: LICENCE.url,
    attribution: ATTRIBUTION, builtAt,
    note: "Computed by livecricketzone.com from Cricsheet ball-by-ball data. Only matches present in Cricsheet are counted; see meta.json for coverage." };

  const { venues, venueLabel } = buildVenues();

  const perFormat = {};
  const byYear = {};
  const records = { _about: about };
  for (const f of FORMATS) {
    perFormat[f] = {}; byYear[f] = {}; records[f] = {};
    for (const g of GENDERS) {
      const B = blocks[f][g];
      perFormat[f][g] = { matches: B.matches, firstDate: B.firstDate, lastDate: B.lastDate };
      byYear[f][g] = coverageByYear(B);
      records[f][g] = buildRecords(f, g, venueLabel, byYear[f][g]);
    }
  }

  const meta = {
    source: "Cricsheet",
    url: "https://cricsheet.org",
    licence: LICENCE.name,
    licenceUrl: LICENCE.url,
    licencePage: LICENCE.cricsheetPage,
    attribution: ATTRIBUTION,
    builtAt,
    downloads,
    perFormat,
    byYear,
    coverageNotes: [
      "Cricsheet does not hold every international match. The data starts on " +
        FORMATS.flatMap((f) => GENDERS.map((g) => `${perFormat[f][g].firstDate} (${f} ${g})`)).join(", ") +
        ". Careers before those dates are incomplete, and early years are sparse (see byYear.share).",
      "Since 14 November 2024 Cricsheet withholds all matches involving the Afghanistan men's team (https://cricsheet.org/withheld-matches). They are not counted here, including for their opponents.",
      "Matches abandoned without a ball bowled are not in Cricsheet, so head-to-head no-result counts can be lower than official records.",
    ],
    countingRules: [
      "Players are aggregated by Cricsheet person identifier, not by name; the name shown is the one used in the player's latest match in the data.",
      "A player's matches are the matches where Cricsheet lists them in info.players for that format and gender.",
      "Batting: an innings is counted for anyone who faced a ball, stood as non-striker or was dismissed. Not out means batted and not dismissed; 'retired hurt' and 'retired not out' are not dismissals. Balls faced exclude wides and include no-balls. Fours and sixes exclude runs flagged non_boundary.",
      "Bowling: runs conceded are batter runs plus wides and no-balls (not byes, leg-byes or penalty runs). Wickets credited to the bowler: bowled, caught, caught and bowled, lbw, stumped, hit wicket. Balls exclude wides and no-balls.",
      "Team totals include penalty runs; wickets exclude retired-hurt and retired-not-out. Super overs are excluded from all player and team figures.",
      "Head-to-head: a tie decided by a Super Over or bowl-out counts as a tie; the tie-break winner is listed in tieBreakWins and in the result text.",
      "Venues: Cricsheet spellings of the same ground are merged by name rules plus a short alias list (scripts/cricsheet/venues.js). Average first-innings totals exclude no-result matches; they include rain-reduced matches.",
      "byYear: matches = matches in the data that year; missingNumbers = official match numbers (info.match_type_number) between consecutive matches in the data that have no file (not in Cricsheet, withheld, or abandoned without a ball, which still receive a number); share = matches with a number / (those + missingNumbers), an estimate and a lower bound of how much of that year the data holds.",
      `mayBeIncomplete marks players whose first match in the data is in the first year of that format's data or in a year with share below ${SPARSE_SHARE}, so some of their matches are probably missing. Players without the flag can still miss withheld matches.`,
    ],
    inputs: { files: stats.files, skipped: stats.skipped, unregisteredNames: stats.unregistered.size },
  };

  const h2h = Object.assign({ _about: about }, buildH2H(venueLabel));
  const venuesOut = { _about: about, placeAliases: venueNames.PLACE_ALIASES, venues };

  fs.mkdirSync(args.out, { recursive: true });
  const write = (name, obj, pretty) => {
    const file = path.join(args.out, name);
    fs.writeFileSync(file, JSON.stringify(obj, null, pretty ? 2 : 0) + "\n");
    const kb = fs.statSync(file).size / 1024;
    console.log(`  wrote ${path.relative(REPO, file)} (${kb.toFixed(1)} KB)`);
    return kb;
  };
  let kb = 0;
  kb += write("meta.json", meta, true);
  kb += write("records.json", records, args.pretty);
  kb += write("h2h.json", h2h, args.pretty);
  kb += write("venues.json", venuesOut, args.pretty);
  console.log(`total ${(kb / 1024).toFixed(2)} MB; skipped ${JSON.stringify(stats.skipped)}; ` +
    `unregistered names ${stats.unregistered.size}; ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

if (require.main === module) {
  main().catch((e) => { console.error(e.stack || e.message); process.exit(1); });
}

module.exports = { outcomeText, ATTRIBUTION, LICENCE };
