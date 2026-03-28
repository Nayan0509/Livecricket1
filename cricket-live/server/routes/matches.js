const express = require("express");
const router = express.Router();
const { cricGet, rapidGet, liveCache } = require("../controllers/cricapi");

// GET /api/matches/live
// Uses CricketData.org currentMatches (tested ✓)
// Response: { data: [ {id, name, matchType, status, venue, date, teams, score, matchStarted, matchEnded} ] }
router.get("/live", async (req, res) => {
  try {
    const data = await cricGet("currentMatches", { offset: 0 }, liveCache);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/upcoming
// Uses CricketData.org matches (tested ✓)
router.get("/upcoming", async (req, res) => {
  try {
    const data = await cricGet("matches", { offset: 0 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/schedule
// Uses RapidAPI /cricket-schedule (tested ✓)
// Response: { status, response: { schedules: [ {scheduleAdWrapper: {date, matchScheduleList: [{seriesName, matchInfo:[...]}]}} ] } }
router.get("/schedule", async (req, res) => {
  try {
    const data = await rapidGet("/cricket-schedule");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id
// Uses CricketData.org match_info (tested ✓)
// Response: { data: {id, name, matchType, status, venue, date, teams, teamInfo, score, tossWinner, tossChoice} }
router.get("/:id", async (req, res) => {
  try {
    const data = await cricGet("match_info", { id: req.params.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/scorecard
router.get("/:id/scorecard", async (req, res) => {
  try {
    const data = await cricGet("match_scorecard", { id: req.params.id }, liveCache);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/score
// Uses CricketData.org cricScore (tested ✓)
// Response: { data: [ {id, t1, t2, t1s, t2s, status, ms, matchType, series} ] }
router.get("/:id/score", async (req, res) => {
  try {
    const data = await cricGet("cricScore", { id: req.params.id }, liveCache);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
