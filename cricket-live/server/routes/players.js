const express = require("express");
const router = express.Router();
const { cricGet } = require("../controllers/cricapi");

// GET /api/players?search=virat
// CricketData.org players (tested ✓)
// Response: { data: [ {id, name, country} ] }
router.get("/", async (req, res) => {
  try {
    const data = await cricGet("players", { search: req.query.search || "india", offset: 0 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/players/:id
// CricketData.org players_info (tested ✓)
// Response: { data: {id, name, dateOfBirth, role, battingStyle, bowlingStyle, country, playerImg, stats:[{fn,matchtype,stat,value}]} }
router.get("/:id", async (req, res) => {
  try {
    const data = await cricGet("players_info", { id: req.params.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
