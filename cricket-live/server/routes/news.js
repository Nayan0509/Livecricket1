const express = require("express");
const router = express.Router();
const { getNewsWithFallback } = require("../utils/scraper");

// GET /api/news
// Scrapes cricket news from Cricbuzz and ESPNcricinfo
router.get("/", async (req, res) => {
  try {
    const newsItems = await getNewsWithFallback();

    // Remove duplicates by URL/ID
    const uniqueNews = Array.from(
      new Map(newsItems.map(item => [item.id, item])).values()
    );

    res.json({ 
      status: "success", 
      data: uniqueNews.slice(0, 20),
      count: uniqueNews.length
    });
  } catch (err) {
    console.error("News scraping error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
