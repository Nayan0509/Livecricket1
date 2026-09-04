const express = require("express");
const router = express.Router();
const scraper = require("../utils/scraper");

// GET /api/stats?format=test&type=batting&category=most-runs
router.get("/", async (req, res) => {
  try {
    const { format = "test", type = "batting", category = "most-runs" } = req.query;
    const data = await scraper.scrapeGlobalStats(format, type, category);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
});

// GET /api/stats/records
router.get("/records", async (req, res) => {
  try {
    const data = typeof scraper.scrapeCareerRecords === "function"
      ? await scraper.scrapeCareerRecords()
      : {};
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message, data: {} });
  }
});

module.exports = router;
