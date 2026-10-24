// Cricket arithmetic used by the calculator pages (src/pages/ToolDetail.jsx).
// CommonJS so the same functions can be checked from Node
// (scratch/test_cricket_math.js) as well as bundled by webpack.
//
// Overs are written in cricket notation: "19.4" means 19 overs and 4 balls
// (118 balls), not 19.4 decimal overs. Every function works in balls
// internally and converts at the edges.

const BALLS_PER_OVER = 6;

/**
 * Parse cricket overs notation into balls. Accepts "19.4", "19", 19.4 or 20.
 * Returns null for anything that is not valid notation (e.g. "19.6", "-1").
 */
function oversToBalls(overs) {
  const s = String(overs == null ? "" : overs).trim();
  const m = s.match(/^(\d+)(?:\.(\d))?$/);
  if (!m) return null;
  const whole = Number(m[1]);
  const balls = m[2] === undefined ? 0 : Number(m[2]);
  if (balls >= BALLS_PER_OVER) return null;
  return whole * BALLS_PER_OVER + balls;
}

/** 118 → "19.4" */
function ballsToOvers(balls) {
  if (!Number.isFinite(balls) || balls < 0) return null;
  return `${Math.floor(balls / BALLS_PER_OVER)}.${balls % BALLS_PER_OVER}`;
}

/** Runs per over. null when no balls have been bowled. */
function runRate(runs, balls) {
  if (!(balls > 0)) return null;
  return runs / (balls / BALLS_PER_OVER);
}

/**
 * State of a chase.
 * target: runs needed to win (first-innings total + 1, or a revised target)
 * score: runs the chasing side has now
 * ballsBowled / totalBalls: balls used so far and balls available in the innings
 */
function chase({ target, score, ballsBowled, totalBalls }) {
  const runsNeeded = Math.max(0, target - score);
  const ballsLeft = Math.max(0, totalBalls - ballsBowled);
  return {
    runsNeeded,
    ballsLeft,
    currentRate: runRate(score, ballsBowled),
    requiredRate: runsNeeded === 0 ? 0 : runRate(runsNeeded, ballsLeft),
    won: runsNeeded === 0,
    impossible: runsNeeded > 0 && ballsLeft === 0,
  };
}

/**
 * Net run rate across a set of matches.
 * Each match: { runsFor, ballsFaced, allOutBatting, runsAgainst, ballsBowled,
 *               allOutBowling, quotaBalls }
 * A side that is bowled out is treated as having used its full quota of
 * overs (quotaBalls), for both its own innings and the opposition's.
 */
function netRunRate(matches) {
  let runsFor = 0, ballsFor = 0, runsAgainst = 0, ballsAgainst = 0;
  for (const m of matches) {
    runsFor += m.runsFor;
    ballsFor += m.allOutBatting ? m.quotaBalls : m.ballsFaced;
    runsAgainst += m.runsAgainst;
    ballsAgainst += m.allOutBowling ? m.quotaBalls : m.ballsBowled;
  }
  const forRate = runRate(runsFor, ballsFor);
  const againstRate = runRate(runsAgainst, ballsAgainst);
  if (forRate === null || againstRate === null) return null;
  return { runsFor, ballsFor, forRate, runsAgainst, ballsAgainst, againstRate, nrr: forRate - againstRate };
}

/** Batting: average needs at least one dismissal; strike rate needs balls faced. */
function battingFigures({ runs, dismissals, balls }) {
  return {
    average: dismissals > 0 ? runs / dismissals : null,
    strikeRate: balls > 0 ? (runs * 100) / balls : null,
  };
}

/** Bowling: average and strike rate need wickets; economy needs balls bowled. */
function bowlingFigures({ runsConceded, wickets, balls }) {
  return {
    average: wickets > 0 ? runsConceded / wickets : null,
    economy: runRate(runsConceded, balls),
    strikeRate: wickets > 0 && balls > 0 ? balls / wickets : null,
  };
}

/** Format a number to fixed places, or a dash when it is undefined. */
function fmt(n, places = 2, signed = false) {
  if (n === null || n === undefined || !Number.isFinite(n)) return "–";
  const s = n.toFixed(places);
  return signed && n > 0 ? `+${s}` : s;
}

module.exports = {
  BALLS_PER_OVER,
  oversToBalls,
  ballsToOvers,
  runRate,
  chase,
  netRunRate,
  battingFigures,
  bowlingFigures,
  fmt,
};
