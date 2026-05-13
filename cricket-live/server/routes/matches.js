const express = require("express");
const router = express.Router();
const scraper = require("../utils/scraper");

// GET /api/matches/standings  — IPL 2026 points table
router.get("/standings", async (req, res) => {
  try {
    const data = await scraper.scrapeIPLStandings();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
});

// GET /api/matches/all
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

// GET /api/matches/:id/scorecard
router.get("/:id/scorecard", async (req, res) => {
  try {
    const data = await scraper.scrapeScorecard(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/score  — quick live score
router.get("/:id/score", async (req, res) => {
  try {
    const result = await scraper.getScaledData("cricScore", { id: req.params.id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/live-data  — rich miniscore: batsmen, bowler, partnership, RRR
router.get("/:id/live-data", async (req, res) => {
  try {
    const data = await scraper.scrapeMatchLiveData(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/squad  — playing XI
router.get("/:id/squad", async (req, res) => {
  try {
    const data = await scraper.scrapeMatchSquad(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/commentary?page=0
router.get("/:id/commentary", async (req, res) => {
  try {
    const page   = parseInt(req.query.page) || 0;
    const result = await scraper.scrapeCommentary(req.params.id, page);
    res.json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
});

// GET /api/matches/:id  — match info
router.get("/:id", async (req, res) => {
  try {
    const data = await scraper.scrapeMatchInfo(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
