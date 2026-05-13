const express = require("express");
const router = express.Router();
const scraper = require("../utils/scraper");

// GET /api/venues/:id — venue details
router.get("/:id", async (req, res) => {
  try {
    const data = await scraper.scrapeVenueInfo(req.params.id);
    if (!data) return res.status(404).json({ error: "Venue not found" });
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
