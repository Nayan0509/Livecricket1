const express = require("express");
const router = express.Router();
const scraper = require("../utils/scraper");

/**
 * GET /api/news
 * Scale Up (Dependency Free): Uses scraper to fetch cricket-specific news from multiple sources
 */
router.get("/", async (req, res) => {
  try {
    const newsItems = await scraper.getNewsWithFallback();

    // Remove duplicates by URL/ID
    const uniqueNews = Array.from(
      new Map(newsItems.map(item => [item.id, item])).values()
    );

    res.json({ 
      status: "success", 
      data: uniqueNews.slice(0, 25),
      mode: "Scale Up (Scraped)",
      count: uniqueNews.length
    });
  } catch (err) {
    console.error("News Scraper error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

