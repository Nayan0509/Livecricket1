// Checks the Cricsheet statistics (api/cricsheet.js + api/data/cricsheet/*.json) against facts
// confirmed independently on the web, and prints coverage, file sizes, samples and lookups.
//
// Run:  node scratch/test_cricsheet.js [rawDir]
//   rawDir (optional, or $CRICSHEET_RAW): the unzipped Cricsheet folders used by
//   scripts/cricsheet/build.js. Needed only for the series recount check; skipped without it.
"use strict";

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const cs = require("../api/cricsheet");

let passed = 0;
let skipped = 0;
const check = (name, source, fn) => {
  const r = fn();
  if (r === "skip") { skipped++; console.log(`skip ${name}`); return; }
  passed++;
  console.log(`ok   ${name}\n       source: ${source}`);
};
const find = (list, name) => list.find((p) => p.name === name);
const short = (o) => JSON.stringify(o).slice(0, 600);

// ── coverage, sizes, samples ─────────────────────────────────────────────────
const meta = cs.getMeta();
assert.ok(meta, "meta.json not found; run node scripts/cricsheet/build.js first");
console.log(`Built ${meta.builtAt} from ${meta.source} (${meta.licence})`);
console.log("Coverage per format:");
for (const f of ["test", "odi", "t20i"]) {
  for (const g of ["men", "women"]) {
    const c = meta.perFormat[f][g];
    console.log(`  ${f.padEnd(4)} ${g.padEnd(5)} ${String(c.matches).padStart(5)} matches  ${c.firstDate} to ${c.lastDate}`);
  }
}
const dataDir = path.join(__dirname, "..", "api", "data", "cricsheet");
let total = 0;
console.log("Output files:");
for (const f of ["meta.json", "records.json", "h2h.json", "venues.json"]) {
  const kb = fs.statSync(path.join(dataDir, f)).size / 1024;
  total += kb;
  console.log(`  ${f.padEnd(13)} ${kb.toFixed(1).padStart(8)} KB`);
}
console.log(`  total         ${(total / 1024).toFixed(2).padStart(8)} MB`);
assert.ok(total < 6 * 1024, "output over 6 MB");

const testMen = cs.getRecords("test", "men");
console.log("\nSample records.json (test, men):");
console.log("  mostRuns[0]       " + short(testMen.mostRuns[0]));
console.log("  mostWickets[0]    " + short(testMen.mostWickets[0]));
console.log("  highestScores[0]  " + short(testMen.highestScores[0]));
console.log("  bestBowling[0]    " + short(testMen.bestBowling[0]));
console.log("  highestTeamTotals[0] " + short(testMen.highestTeamTotals[0]));
console.log("  bestBattingAverage[0] " + short(testMen.bestBattingAverage[0]));
console.log("  bestBowlingAverage[0] " + short(testMen.bestBowlingAverage[0]));
const eden = cs.getVenue("Eden Gardens, Kolkata");
console.log("\nSample venues.json (getVenue('Eden Gardens, Kolkata')):\n  " + short(eden));
console.log("\nATTRIBUTION: " + cs.ATTRIBUTION);

// ── head-to-head lookups requested by the brief ──────────────────────────────
console.log("\nHead-to-head lookups:");
const indAus = cs.getHeadToHead("India", "Australia", "test");
console.log("  India v Australia (test): " + short(indAus));
const namIre = cs.getHeadToHead("Namibia", "Ireland", "odi");
console.log("  Namibia v Ireland (odi): " + short(namIre));
console.log("  Namibia v Ireland (all formats): " + short(cs.getHeadToHead("Namibia", "Ireland")));
const nzwIndw = cs.getHeadToHead("New Zealand Women", "India Women", "t20i");
console.log("  New Zealand Women v India Women (t20i): " + short(nzwIndw));

// ── checks against independently confirmed facts ─────────────────────────────
console.log("\nChecks:");

check("Alastair Cook Test career (all inside coverage, 2006-2018): 161 M, 291 I, 16 NO, 12472 runs, HS 294, avg 45.35, 33x100, 57x50",
  "Reuters factbox https://www.iol.co.za/sport/factbox-england-batsman-alastair-cook-16981426 ; https://www.skysports.com/cricket/news/12123/12983851",
  () => {
    const p = find(testMen.mostRuns, "AN Cook");
    assert.ok(p, "Cook not in most runs");
    assert.deepStrictEqual([p.matches, p.innings, p.notOuts, p.runs, p.highScore, p.average, p.hundreds, p.fifties],
      [161, 291, 16, 12472, "294", 45.35, 33, 57]);
  });

check("Virat Kohli Test career (2011-2025): 123 M, 210 I, 13 NO, 9230 runs, HS 254*, avg 46.85, 30x100, 31x50",
  "https://propakistani.pk/2025/05/10/virat-kohli-decides-to-retire-from-test-cricket/amp/ ; https://www.theleader.com.au/story/8964893/india-great-kohli-follows-rohit-into-test-retirement",
  () => {
    const p = find(testMen.mostRuns, "V Kohli");
    assert.ok(p, "Kohli not in most runs");
    assert.deepStrictEqual([p.matches, p.innings, p.notOuts, p.runs, p.highScore, p.average, p.hundreds, p.fifties],
      [123, 210, 13, 9230, "254*", 46.85, 30, 31]);
  });

check("Brian Lara 400* (582 balls, 43x4, 4x6) v England, Antigua Recreation Ground, Test starting 10 April 2004, is the top Test score",
  "https://www.tbsnews.net/sports/day-prince-climbed-highest-mountain-68155 ; https://www.cricket.com.au/news/3264623",
  () => {
    const s = testMen.highestScores[0];
    assert.deepStrictEqual([s.name, s.runs, s.notOut, s.balls, s.fours, s.sixes, s.opponent, s.date],
      ["BC Lara", 400, true, 582, 43, 4, "England", "2004-04-10"]);
    assert.ok(/Antigua Recreation Ground/.test(s.venue), s.venue);
  });

const odiMen = cs.getRecords("odi", "men");
check("Rohit Sharma 264 (173 balls, 33x4, 9x6) v Sri Lanka, Eden Gardens, 13 Nov 2014, is the top men's ODI score",
  "https://www.guinnessworldrecords.com/world-records/64447-most-runs-scored-by-a-player-in-a-one-day-international-male ; https://scroll.in/field/978437/watch-rohit-sharmas-264-against-sri-lanka-in-2014-odi-crickets-highest-individual-score",
  () => {
    const s = odiMen.highestScores[0];
    assert.deepStrictEqual([s.name, s.runs, s.notOut, s.balls, s.fours, s.sixes, s.opponent, s.date],
      ["RG Sharma", 264, false, 173, 33, 9, "Sri Lanka", "2014-11-13"]);
    assert.ok(/^Eden Gardens/.test(s.venue), s.venue);
  });

check("Martin Guptill 237* (163 balls, 24x4, 11x6) v West Indies, Wellington, 21 Mar 2015, is the second men's ODI score",
  "https://www.aljazeera.com/sports/2015/3/21/new-zealand-in-world-cup-semis-after-guptills-237",
  () => {
    const s = odiMen.highestScores[1];
    assert.deepStrictEqual([s.name, s.runs, s.notOut, s.balls, s.fours, s.sixes, s.opponent, s.date],
      ["MJ Guptill", 237, true, 163, 24, 11, "West Indies", "2015-03-21"]);
    assert.ok(/Wellington/.test(s.venue), s.venue);
  });

check("Eden Gardens ODI highest total is India 404/5 v Sri Lanka on 13 Nov 2014 (the Rohit 264 match)",
  "https://www.guinnessworldrecords.com/world-records/64447-most-runs-scored-by-a-player-in-a-one-day-international-male (India 404-5)",
  () => {
    const h = eden.formats.odi.men.highestTotal;
    assert.deepStrictEqual([h.team, h.score, h.opponent, h.date], ["India", "404/5", "Sri Lanka", "2014-11-13"]);
  });

const t20Men = cs.getRecords("t20i", "men");
check("Aaron Finch 172 (76 balls, 16x4, 10x6) v Zimbabwe, Harare, 3 Jul 2018, is the top men's T20I score",
  "https://www.guinnessworldrecords.com/world-records/most-runs-scored-by-a-player-in-a-twenty20-international-male",
  () => {
    const s = t20Men.highestScores[0];
    assert.deepStrictEqual([s.name, s.runs, s.notOut, s.balls, s.fours, s.sixes, s.opponent, s.date],
      ["AJ Finch", 172, false, 76, 16, 10, "Zimbabwe", "2018-07-03"]);
    assert.ok(/Harare/.test(s.venue), s.venue);
  });

check("Border-Gavaskar Trophy 2024-25 (22 Nov 2024 - 7 Jan 2025): 5 Tests, Australia 3, India 1, 1 draw, with the published margins",
  "https://www.wisden.com/series/australia-vs-india-m-202425",
  () => {
    const inWindow = indAus.last5.filter((r) => r.date >= "2024-11-22" && r.date <= "2025-01-07");
    if (inWindow.length < 5 && indAus.lastDate > "2025-01-07") return "skip"; // newer Tests pushed them out of last5
    assert.deepStrictEqual(inWindow.map((r) => r.result).reverse(), [
      "India won by 295 runs", "Australia won by 10 wickets", "Match drawn",
      "Australia won by 184 runs", "Australia won by 6 wickets"]);
  });

const engInd = cs.getHeadToHead("England", "India", "test");
check("England v India 2025 (20 Jun - 4 Aug): 2-2 with 1 draw; Headingley ENG 5 wkts, Edgbaston IND 336 runs, Lord's ENG 22 runs, Old Trafford drawn, Oval IND 6 runs",
  "https://www.aljazeera.com/sports/2025/7/14/england-beat-jadeja-india-in-third-test-at-lords-to-take-2-1-series-lead ; https://crickettimes.com/2025/07/england-vs-india-2025-test-stats-and-records-at-lords-london/ ; Sky Sports 2025 review",
  () => {
    const inWindow = engInd.last5.filter((r) => r.date >= "2025-06-20" && r.date <= "2025-08-04");
    if (inWindow.length < 5 && engInd.lastDate > "2025-08-04") return "skip";
    assert.deepStrictEqual(inWindow.map((r) => `${r.venue.split(",")[0]}: ${r.result}`).reverse(), [
      "Headingley: England won by 5 wickets", "Edgbaston: India won by 336 runs", "Lord's: England won by 22 runs",
      "Old Trafford: Match drawn", "Kennington Oval: India won by 6 runs"]);
  });

// Independent recount from the raw files (does not use the pipeline code).
const rawDir = process.argv[2] || process.env.CRICSHEET_RAW || path.join(os.tmpdir(), "cricsheet-raw");
check("Shubman Gill 754 runs in 10 innings in England v India 2025, recounted directly from the raw Cricsheet files",
  "https://en.prothomalo.com/sports/cricket/h5nzva9kyc ; https://www.cricket.com/news/india-vs-england-test-series-learning-experience-as-captain-shubman-gill-8122025-1755005321547",
  () => {
    const dir = path.join(rawDir, "tests");
    if (!fs.existsSync(dir)) { console.log(`       (raw data not found at ${dir})`); return "skip"; }
    let runs = 0; let innings = 0; let matches = 0;
    for (const f of fs.readdirSync(dir).filter((x) => /^\d+\.json$/.test(x))) {
      const text = fs.readFileSync(path.join(dir, f), "utf8");
      if (!text.includes("Shubman Gill")) continue;
      const m = JSON.parse(text);
      const d = m.info.dates[0];
      if (d < "2025-06-20" || d > "2025-08-04" || !m.info.teams.includes("England")) continue;
      matches++;
      const id = m.info.registry.people["Shubman Gill"];
      for (const inn of m.innings) {
        let batted = false;
        for (const o of inn.overs || []) for (const del of o.deliveries) {
          const isGill = (n) => m.info.registry.people[n] === id;
          if (isGill(del.batter)) { runs += del.runs.batter; batted = true; }
          if (isGill(del.non_striker)) batted = true;
        }
        if (batted) innings++;
      }
    }
    assert.deepStrictEqual([matches, innings, runs], [5, 10, 754]);
  });

check("Gender split matches Cricsheet's per-gender archives listed on https://cricsheet.org/downloads/ on 24 Oct 2026 (Tests 896/24, ODIs 2596/617, T20Is 3627/2183)",
  "https://cricsheet.org/downloads/ (changes whenever Cricsheet adds matches; skipped for other builds)",
  () => {
    const p = meta.perFormat;
    if (p.test.men.lastDate !== "2026-10-09" || p.odi.women.lastDate !== "2026-10-14") return "skip";
    assert.deepStrictEqual([p.test.men.matches, p.test.women.matches, p.odi.men.matches, p.odi.women.matches,
      p.t20i.men.matches, p.t20i.women.matches], [896, 24, 2596, 617, 3627, 2183]);
  });

// ── API behaviour ────────────────────────────────────────────────────────────
check("Team-name tolerance: 'NZ'/'IND', 'INDW'/'NZW', 'India W'/'New Zealand Women' resolve like full names", "api/cricsheet.js",
  () => {
    assert.strictEqual(cs.getHeadToHead("NZ", "IND", "test").matches, cs.getHeadToHead("New Zealand", "India", "test").matches);
    assert.deepStrictEqual(cs.getHeadToHead("INDW", "NZW", "t20i").teamB, nzwIndw.teamA);
    assert.strictEqual(cs.getHeadToHead("India W", "New Zealand Women", "T20I").gender, "women");
    assert.strictEqual(nzwIndw.gender, "women");
    const all = cs.getHeadToHead("India", "Australia");
    assert.deepStrictEqual(all.map((r) => r.format), ["test", "odi", "t20i"]);
  });

check("Unknown input returns null or [] without throwing", "api/cricsheet.js",
  () => {
    assert.strictEqual(cs.getRecords("xyz", "men"), null);
    assert.strictEqual(cs.getRecords("test", "mixed"), null);
    assert.strictEqual(cs.getHeadToHead("India", "India", "test"), null);
    assert.strictEqual(cs.getHeadToHead("Atlantis", "India", "odi"), null);
    assert.deepStrictEqual(cs.getHeadToHead(), []);
    assert.strictEqual(cs.getHeadToHead(null, undefined, "odi"), null);
    assert.strictEqual(cs.getHeadToHead("Afghanistan", "India", "t20i"), null); // withheld by Cricsheet
    assert.strictEqual(cs.getVenue(""), null);
    assert.strictEqual(cs.getVenue({}), null);
    assert.strictEqual(cs.getVenue("Nowhere Park"), null);
  });

check("Venue tolerance: spellings, renames and shared names resolve to one ground", "scripts/cricsheet/venues.js alias table",
  () => {
    const id = (q) => (cs.getVenue(q) || {}).id;
    assert.strictEqual(id("Eden Gardens"), eden.id);
    assert.strictEqual(id("M.Chinnaswamy Stadium, Bengaluru"), id("M Chinnaswamy Stadium, Bangalore"));
    assert.strictEqual(id("Feroz Shah Kotla"), id("Arun Jaitley Stadium, Delhi"));
    assert.strictEqual(id("The Gabba, Brisbane"), id("Brisbane Cricket Ground, Woolloongabba"));
    assert.strictEqual(cs.getVenue("County Ground, Taunton").city, "Taunton");
    assert.strictEqual(cs.getVenue("County Ground, Bristol").city, "Bristol");
  });

// ── known gaps (printed, not asserted) ───────────────────────────────────────
console.log("\nKnown gaps (official figure vs Cricsheet-based figure):");
const anderson = find(testMen.mostWickets, "JM Anderson");
console.log(`  James Anderson Tests: official 704 wkts in 188 Tests (Guinness: https://www.guinnessworldrecords.com/world-records/540374-most-test-wickets-taken-by-a-fast-bowler); data ${anderson.wickets} in ${anderson.matches} (2003-2005 Tests are sparse; mayBeIncomplete=${!!anderson.mayBeIncomplete})`);
const kohliT20 = find(t20Men.mostRuns, "V Kohli");
console.log(`  Virat Kohli T20Is: official 4188 runs in 125, HS 122* (https://gulfnews.com/photos/sports-photos/a-look-at-indias-star-batter-virat-kohlis-astonishing-t20-statistics-1.1705058604752); data ${kohliT20.runs} in ${kohliT20.matches}, HS ${kohliT20.highScore} (matches v Afghanistan are withheld)`);
const kerr = cs.getRecords("odi", "women").highestScores.find((s) => s.name === "AC Kerr" && s.runs === 232);
console.log(`  Amelia Kerr 232* v Ireland, 13 Jun 2018 (https://www.guinnessworldrecords.com/world-records/529786-most-runs-scored-by-a-player-in-a-one-day-international-female): ${kerr ? "present" : "not in Cricsheet, so missing from women's ODI highest scores"}`);

console.log(`\n${passed} checks passed, ${skipped} skipped`);
