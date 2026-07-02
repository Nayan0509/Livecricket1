const express = require("express");
const router = express.Router();
const scraper = require("../utils/scraper");

/**
 * GET /api/news
 * Scale Up (Dependency Free): Uses scraper to fetch cricket-specific news from multiple sources
 * Enhanced: Filters news from last 2-3 days, merges multiple sources
 */
router.get("/", async (req, res) => {
  try {
    const newsItems = await scraper.getNewsWithFallback();

    // Remove duplicates by URL/ID
    const uniqueNews = Array.from(
      new Map(newsItems.map(item => [item.id, item])).values()
    );

    // Optional: Filter by days if query param provided
    const daysFilter = parseInt(req.query.days) || 3;
    const filteredNews = uniqueNews.filter(item => item.daysAgo <= daysFilter);

    res.json({ 
      status: "success", 
      data: filteredNews.slice(0, 30),
      mode: "Scale Up (Multi-Source Scraped)",
      count: filteredNews.length,
      daysFilter,
      sources: ["Google News", "Cricbuzz"]
    });
  } catch (err) {
    console.error("News Scraper error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/news/recent
 * Get only very recent news (last 24 hours)
 */
router.get("/recent", async (req, res) => {
  try {
    const newsItems = await scraper.getNewsWithFallback();
    const recentNews = newsItems.filter(item => item.hoursAgo <= 24);

    res.json({ 
      status: "success", 
      data: recentNews.slice(0, 20),
      mode: "Last 24 Hours",
      count: recentNews.length
    });
  } catch (err) {
    console.error("Recent news error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

