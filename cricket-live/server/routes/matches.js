const express = require("express");
const router = express.Router();
const scraper = require("../utils/scraper");

// GET /api/matches/standings  — IPL 2026 points table
router.get("/standings", async (req, res) => {
  try {
    const data = await scraper.scrapeIPLStandings();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
});

// GET /api/matches/all
router.get("/all", async (req, res) => {
  try {
    const data = await scraper.getAllMatches();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/live
router.get("/live", async (req, res) => {
  try {
    const data = await scraper.getLiveMatchesWithFallback();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/live-stream  — Server-Sent Events (SSE) real-time streaming feed
router.get("/live-stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders?.();

  const sendUpdate = async () => {
    try {
      const data = await scraper.getAllMatches();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
    }
  };

  await sendUpdate();
  const intervalId = setInterval(sendUpdate, 8000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

// GET /api/matches/upcoming
router.get("/upcoming", async (req, res) => {
  try {
    const data = await scraper.scrapeCricbuzzUpcoming();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Group flat upcoming matches into the date → series → matches wrapper
// shape the Schedule page renders (mirrors Cricbuzz's scheduleAdWrapper).
function buildScheduleWrappers(upcoming) {
  const byDate = new Map();
  (upcoming || []).forEach(m => {
    const d = m.dateTimeGMT ? new Date(m.dateTimeGMT) : null;
    const dateKey = d && !isNaN(d) ? d.toDateString() : (m.date || "Upcoming");
    if (!byDate.has(dateKey)) byDate.set(dateKey, new Map());
    const bySeries = byDate.get(dateKey);
    const sName = m.series || m.matchType || "Cricket";
    if (!bySeries.has(sName)) bySeries.set(sName, []);
    const [ground, city] = (m.venue || "").split(",").map(x => x.trim());
    bySeries.get(sName).push({
      matchId: m.id,
      team1: { teamName: m.teams?.[0] || m.teamInfo?.[0]?.name || "TBA" },
      team2: { teamName: m.teams?.[1] || m.teamInfo?.[1]?.name || "TBA" },
      matchDesc: m.status || m.matchType || "",
      matchFormat: m.matchType || "",
      startDate: d && !isNaN(d) ? String(d.getTime()) : "",
      venueInfo: { ground: ground || "", city: city || "" },
    });
  });
  const out = [];
  byDate.forEach((bySeries, dateKey) => {
    out.push({
      scheduleAdWrapper: {
        date: dateKey,
        matchScheduleList: [...bySeries.entries()].map(([seriesName, matchInfo]) => ({ seriesName, matchInfo })),
      },
    });
  });
  return out;
}

// GET /api/matches/schedule — upcoming matches grouped by date + series
// (client reads response.schedules)
router.get("/schedule", async (req, res) => {
  try {
    const upcoming = await scraper.scrapeCricbuzzUpcoming();
    res.json({ status: "success", response: { schedules: buildScheduleWrappers(upcoming) } });
  } catch (err) {
    res.status(500).json({ error: err.message, response: { schedules: [] } });
  }
});

// GET /api/matches/:id/scorecard
router.get("/:id/scorecard", async (req, res) => {
  try {
    const data = await scraper.scrapeScorecard(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/score  — quick live score
router.get("/:id/score", async (req, res) => {
  try {
    const result = await scraper.getScaledData("cricScore", { id: req.params.id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/live-data  — rich miniscore: batsmen, bowler, partnership, RRR
router.get("/:id/live-data", async (req, res) => {
  try {
    const data = await scraper.scrapeMatchLiveData(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/squad  — playing XI
router.get("/:id/squad", async (req, res) => {
  try {
    const data = await scraper.scrapeMatchSquad(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/commentary?page=0
router.get("/:id/commentary", async (req, res) => {
  try {
    const page   = parseInt(req.query.page) || 0;
    const result = await scraper.scrapeCommentary(req.params.id, page);
    res.json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
});

// GET /api/matches/:id/h2h — Head to Head history
router.get("/:id/h2h", async (req, res) => {
  try {
    const data = await scraper.scrapeMatchH2H(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/info — full match info: toss, umpires, venue, broadcast
router.get("/:id/info", async (req, res) => {
  try {
    const data = await scraper.scrapeMatchFullInfo(req.params.id);
    if (!data) return res.status(404).json({ error: "Match info not found" });
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/overs — over-by-over summary
router.get("/:id/overs", async (req, res) => {
  try {
    const data = await scraper.scrapeOverSummary(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
});

// GET /api/matches/:id/analysis — Preview/Report
router.get("/:id/analysis", async (req, res) => {
  try {
    const data = await scraper.scrapeMatchAnalysis(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id  — match info
router.get("/:id", async (req, res) => {
  try {
    const data = await scraper.scrapeMatchInfo(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
