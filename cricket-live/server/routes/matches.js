const express = require("express");
const router = express.Router();
const { 
  getLiveMatchesWithFallback, 
  getScorecardWithFallback,
  scrapeCricbuzzLiveMatches,
  scrapeEspnLiveMatches,
  scrapeCricbuzzScorecard,
  scrapeEspnScorecard
} = require("../utils/scraper");

// GET /api/matches/live
// Scrapes live matches from Cricbuzz/ESPNcricinfo
router.get("/live", async (req, res) => {
  try {
    const matches = await getLiveMatchesWithFallback();
    res.json({ 
      status: "success", 
      data: matches,
      count: matches.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/upcoming
// Scrapes upcoming matches
router.get("/upcoming", async (req, res) => {
  try {
    // For now, return live matches (can be enhanced to scrape schedule pages)
    const matches = await getLiveMatchesWithFallback();
    res.json({ 
      status: "success", 
      data: matches.filter(m => m.status && !m.status.toLowerCase().includes("live"))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/schedule
// Scrapes match schedule
router.get("/schedule", async (req, res) => {
  try {
    const matches = await getLiveMatchesWithFallback();
    res.json({ 
      status: "success", 
      data: matches
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id
// Scrapes match details
router.get("/:id", async (req, res) => {
  try {
    const source = req.query.source || "cricbuzz";
    const scorecard = await getScorecardWithFallback(req.params.id, source);
    res.json({ 
      status: "success", 
      data: scorecard
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/scorecard
// Scrapes match scorecard
router.get("/:id/scorecard", async (req, res) => {
  try {
    const source = req.query.source || "cricbuzz";
    const scorecard = await getScorecardWithFallback(req.params.id, source);
    res.json({ 
      status: "success", 
      data: scorecard
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/score
// Scrapes live score for a specific match
router.get("/:id/score", async (req, res) => {
  try {
    const source = req.query.source || "cricbuzz";
    const scorecard = await getScorecardWithFallback(req.params.id, source);
    
    // Extract just the score info
    const scoreData = {
      id: req.params.id,
      title: scorecard.title,
      status: scorecard.status,
      innings: scorecard.innings.map(inning => ({
        team: inning.team,
        score: inning.score
      }))
    };
    
    res.json({ 
      status: "success", 
      data: scoreData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DIRECT SOURCE ENDPOINTS ──────────────────────────────────────────────────

// GET /api/matches/cricbuzz/live
// Get live matches directly from Cricbuzz
router.get("/cricbuzz/live", async (req, res) => {
  try {
    const matches = await scrapeCricbuzzLiveMatches();
    res.json({ 
      status: "success", 
      data: matches,
      source: "cricbuzz",
      count: matches.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/cricbuzz/:id/scorecard
// Get scorecard directly from Cricbuzz
router.get("/cricbuzz/:id/scorecard", async (req, res) => {
  try {
    const scorecard = await scrapeCricbuzzScorecard(req.params.id);
    res.json({ 
      status: "success", 
      data: scorecard
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/espn/live
// Get live matches directly from ESPNcricinfo
router.get("/espn/live", async (req, res) => {
  try {
    const matches = await scrapeEspnLiveMatches();
    res.json({ 
      status: "success", 
      data: matches,
      source: "espncricinfo",
      count: matches.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/espn/:id/scorecard
// Get scorecard directly from ESPNcricinfo
router.get("/espn/:id/scorecard", async (req, res) => {
  try {
    const scorecard = await scrapeEspnScorecard(req.params.id);
    res.json({ 
      status: "success", 
      data: scorecard
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
