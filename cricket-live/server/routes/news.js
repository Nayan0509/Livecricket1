const express = require("express");
const router = express.Router();
const { cricGet } = require("../controllers/cricapi");

// GET /api/news
// No free news API available — we surface upcoming matches as news cards
// Uses CricketData.org matches (tested ✓)
router.get("/", async (req, res) => {
  try {
    const data = await cricGet("matches", { offset: 0 });
    // Shape matches into news-style items
    const items = (data.data || []).map(m => ({
      id: m.id,
      title: m.name,
      description: m.status,
      date: m.date,
      venue: m.venue,
      matchType: m.matchType,
      teams: m.teams,
      teamInfo: m.teamInfo,
    }));
    res.json({ status: "success", data: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
