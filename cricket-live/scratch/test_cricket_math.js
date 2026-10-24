// Checks client/src/utils/cricketMath.js against hand-worked cricket examples,
// including the worked example in the net run rate guide.
// Run: node scratch/test_cricket_math.js
const assert = require("assert");
const m = require("../client/src/utils/cricketMath");

const close = (a, b, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);
let n = 0;
const check = (name, fn) => { fn(); n++; console.log("ok  " + name); };

check("overs notation", () => {
  assert.strictEqual(m.oversToBalls("19.4"), 118);
  assert.strictEqual(m.oversToBalls("20"), 120);
  assert.strictEqual(m.oversToBalls(47.3), 285);
  assert.strictEqual(m.oversToBalls("0.0"), 0);
  assert.strictEqual(m.oversToBalls("19.6"), null);
  assert.strictEqual(m.oversToBalls("-1"), null);
  assert.strictEqual(m.oversToBalls("abc"), null);
  assert.strictEqual(m.oversToBalls(""), null);
  assert.strictEqual(m.ballsToOvers(118), "19.4");
  assert.strictEqual(m.ballsToOvers(0), "0.0");
});

check("run rate: 47.3 overs is 47.5 decimal overs", () => {
  close(m.runRate(285, m.oversToBalls("47.3")), 285 / 47.5);
  assert.strictEqual(m.runRate(10, 0), null);
});

check("NRR guide worked example gives +0.015", () => {
  const q = 300; // 50 overs
  const r = m.netRunRate([
    { runsFor: 280, ballsFaced: 300, allOutBatting: false, runsAgainst: 245, ballsBowled: 300, allOutBowling: false, quotaBalls: q },
    { runsFor: 180, ballsFaced: m.oversToBalls("41.3"), allOutBatting: true, runsAgainst: 184, ballsBowled: m.oversToBalls("38.2"), allOutBowling: false, quotaBalls: q },
    { runsFor: 223, ballsFaced: m.oversToBalls("44.4"), allOutBatting: false, runsAgainst: 222, ballsBowled: 300, allOutBowling: false, quotaBalls: q },
  ]);
  assert.strictEqual(r.runsFor, 683);
  assert.strictEqual(r.ballsFor, 300 + 300 + 268);
  close(r.forRate, 4.721);
  assert.strictEqual(r.runsAgainst, 651);
  close(r.againstRate, 4.706);
  assert.strictEqual(m.fmt(r.nrr, 3, true), "+0.015");
});

check("NRR: bowling a side out counts their full quota", () => {
  const r = m.netRunRate([
    { runsFor: 150, ballsFaced: 120, allOutBatting: false, runsAgainst: 100, ballsBowled: 90, allOutBowling: true, quotaBalls: 120 },
  ]);
  close(r.againstRate, 100 / 20);
  close(r.nrr, 150 / 20 - 100 / 20);
});

check("chase", () => {
  const c = m.chase({ target: 181, score: 120, ballsBowled: m.oversToBalls("15.0"), totalBalls: 120 });
  assert.strictEqual(c.runsNeeded, 61);
  assert.strictEqual(c.ballsLeft, 30);
  close(c.requiredRate, 61 / 5);
  close(c.currentRate, 8);
  assert.strictEqual(c.won, false);
  const done = m.chase({ target: 181, score: 185, ballsBowled: 110, totalBalls: 120 });
  assert.strictEqual(done.won, true);
  assert.strictEqual(done.requiredRate, 0);
  const lost = m.chase({ target: 181, score: 170, ballsBowled: 120, totalBalls: 120 });
  assert.strictEqual(lost.impossible, true);
});

check("batting and bowling figures", () => {
  const b = m.battingFigures({ runs: 450, dismissals: 10, balls: 600 });
  close(b.average, 45); close(b.strikeRate, 75);
  assert.strictEqual(m.battingFigures({ runs: 50, dismissals: 0, balls: 40 }).average, null);
  const w = m.bowlingFigures({ runsConceded: 300, wickets: 12, balls: 360 });
  close(w.average, 25); close(w.economy, 5); close(w.strikeRate, 30);
  assert.strictEqual(m.bowlingFigures({ runsConceded: 30, wickets: 0, balls: 24 }).average, null);
});

console.log(`${n} checks passed`);
