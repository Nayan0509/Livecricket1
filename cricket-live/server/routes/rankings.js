const express = require("express");
const router = express.Router();
const { rapidGet } = require("../controllers/cricapi");

/**
 * GET /api/rankings
 * Scale Up: Fetches real ICC rankings by scraping Cricbuzz
 */
router.get("/", async (req, res) => {
  try {
    const type = req.query.type || "batting";
    const format = req.query.format || "tests";
    const category = req.query.category || "men";
    
    const data = await rapidGet(`/rankings/${type}`, { format, category });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

