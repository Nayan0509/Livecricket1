const express = require("express");
const router = express.Router();
const { cricGet, rapidGet, liveCache } = require("../controllers/cricapi");
const scraper = require("../utils/scraper");

// GET /api/matches/all
// Returns all matches categorized: live, recent, upcoming
router.get("/all", async (req, res) => {
  try {
    const data = await scraper.getAllMatches();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/live
router.get("/live", async (req, res) => {
  try {
    const data = await scraper.getLiveMatchesWithFallback();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/upcoming
router.get("/upcoming", async (req, res) => {
  try {
    const data = await scraper.scrapeCricbuzzUpcoming();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/schedule
router.get("/schedule", async (req, res) => {
  try {
    const data = await rapidGet("/cricket-schedule");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/scorecard
// Cricbuzz full scorecard scraper
router.get("/:id/scorecard", async (req, res) => {
  try {
    const data = await scraper.scrapeCricbuzzScorecard(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/score
// Live score scraper
router.get("/:id/score", async (req, res) => {
  try {
    const result = await scraper.getScaledData("cricScore", { id: req.params.id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/commentary
// Live commentary from Cricbuzz
router.get("/:id/commentary", async (req, res) => {
  try {
    const result = await scraper.scrapeCommentary(req.params.id);
    res.json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
});

// GET /api/matches/:id
// Cricbuzz match info scraper
router.get("/:id", async (req, res) => {
  try {
    const data = await scraper.scrapeMatchInfo(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
