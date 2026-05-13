const express = require("express");
const router = express.Router();
const scraper = require("../utils/scraper");

// GET /api/series — all series (international / domestic / league / women)
router.get("/", async (req, res) => {
  try {
    const data = await scraper.scrapeCricbuzzSeries();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/series/:id/schedule — all matches in a series
router.get("/:id/schedule", async (req, res) => {
  try {
    const data = await scraper.scrapeSeriesSchedule(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
});

// GET /api/series/:id/standings — points table for a series
router.get("/:id/standings", async (req, res) => {
  try {
    const data = await scraper.scrapeSeriesStandings(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
});

// GET /api/series/:id/stats — top batsmen & bowlers
router.get("/:id/stats", async (req, res) => {
  try {
    const data = await scraper.scrapeSeriesStats(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message, data: { batting: [], bowling: [] } });
  }
});

// GET /api/series/:id — series info (schedule + standings + stats combined)
router.get("/:id", async (req, res) => {
  try {
    const [schedule, standings, stats] = await Promise.allSettled([
      scraper.scrapeSeriesSchedule(req.params.id),
      scraper.scrapeSeriesStandings(req.params.id),
      scraper.scrapeSeriesStats(req.params.id),
    ]);
    res.json({
      status: "success",
      data: {
        schedule:  schedule.status  === "fulfilled" ? schedule.value  : [],
        standings: standings.status === "fulfilled" ? standings.value : [],
        stats:     stats.status     === "fulfilled" ? stats.value     : { batting: [], bowling: [] },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
