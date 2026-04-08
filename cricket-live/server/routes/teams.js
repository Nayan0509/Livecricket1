const express = require("express");
const router = express.Router();
const { rapidGet } = require("../controllers/cricapi");

/**
 * GET /api/teams
 * Scale Up: Fetches international teams by scraping Cricbuzz
 */
router.get("/", async (req, res) => {
  try {
    const data = await rapidGet("/cricket-teams");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

