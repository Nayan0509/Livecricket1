const express = require("express");
const router = express.Router();
const { rapidGet } = require("../controllers/cricapi");

// GET /api/rankings
// RapidAPI /cricket-teams (tested ✓) — returns teams with Cricbuzz IDs
// Rankings endpoint not available on free tier, so we return teams list
router.get("/", async (req, res) => {
  try {
    const data = await rapidGet("/cricket-teams");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
