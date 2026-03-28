const express = require("express");
const router = express.Router();
const { cricGet } = require("../controllers/cricapi");

// GET /api/series
// CricketData.org series (tested ✓)
// Response: { data: [ {id, name, startDate, endDate, odi, t20, test, matches} ] }
router.get("/", async (req, res) => {
  try {
    const data = await cricGet("series", { offset: 0 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/series/:id
// CricketData.org series_info (tested ✓)
// Response: { data: { info: {...}, matchList: [...] } }
router.get("/:id", async (req, res) => {
  try {
    const data = await cricGet("series_info", { id: req.params.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
