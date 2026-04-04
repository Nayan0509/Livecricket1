const express = require("express");
const router = express.Router();
const axios = require("axios");
const { cricGet } = require("../controllers/cricapi");

// GET /api/news
// Fetches cricket news from multiple free sources
router.get("/", async (req, res) => {
  try {
    const newsItems = [];

    // Option 1: Try free NewsAPI proxy (no API key needed)
    try {
      const proxyResponse = await axios.get("https://saurav.tech/NewsAPI/top-headlines/category/sports/in.json", {
        timeout: 5000
      });
      
      if (proxyResponse.data && proxyResponse.data.articles) {
        const cricketNews = proxyResponse.data.articles
          .filter(article => {
            const text = `${article.title} ${article.description || ""}`.toLowerCase();
            return text.includes("cricket") || text.includes("ipl") || 
                   text.includes("t20") || text.includes("odi") || 
                   text.includes("test match") || text.includes("bcci");
          })
          .slice(0, 10)
          .map(article => ({
            id: article.url,
            title: article.title,
            description: article.description || "",
            date: new Date(article.publishedAt).toLocaleDateString(),
            source: article.source?.name || "News",
            url: article.url,
            image: article.urlToImage,
            author: article.author,
            publishedAt: article.publishedAt,
          }));
        newsItems.push(...cricketNews);
        console.log(`✓ Fetched ${cricketNews.length} cricket news from proxy`);
      }
    } catch (proxyErr) {
      console.log("NewsAPI proxy failed:", proxyErr.message);
    }

    // Option 2: If NewsAPI.org key is available (100 requests/day free)
    if (process.env.NEWSAPI_KEY && newsItems.length < 5) {
      try {
        const newsApiResponse = await axios.get(
          `https://newsapi.org/v2/everything?q=cricket OR IPL OR "T20 World Cup"&language=en&sortBy=publishedAt&pageSize=15&apiKey=${process.env.NEWSAPI_KEY}`,
          { timeout: 5000 }
        );
        
        if (newsApiResponse.data && newsApiResponse.data.articles) {
          const articles = newsApiResponse.data.articles
            .slice(0, 15)
            .map(article => ({
              id: article.url,
              title: article.title,
              description: article.description || "",
              date: new Date(article.publishedAt).toLocaleDateString(),
              source: article.source?.name || "News",
              url: article.url,
              image: article.urlToImage,
              author: article.author,
              publishedAt: article.publishedAt,
            }));
          newsItems.push(...articles);
          console.log(`✓ Fetched ${articles.length} cricket news from NewsAPI.org`);
        }
      } catch (newsApiErr) {
        console.log("NewsAPI.org failed:", newsApiErr.message);
      }
    }

    // Option 3: Fallback to upcoming matches as news
    if (newsItems.length === 0) {
      console.log("Using match updates as fallback news");
      const data = await cricGet("matches", { offset: 0 });
      const matchNews = (data.data || []).slice(0, 12).map(m => ({
        id: m.id,
        title: m.name,
        description: m.status,
        date: m.date,
        venue: m.venue,
        matchType: m.matchType,
        teams: m.teams,
        teamInfo: m.teamInfo,
        source: "Match Updates",
      }));
      newsItems.push(...matchNews);
    }

    // Remove duplicates by URL/ID
    const uniqueNews = Array.from(
      new Map(newsItems.map(item => [item.id, item])).values()
    );

    res.json({ 
      status: "success", 
      data: uniqueNews.slice(0, 20),
      sources: newsItems.length > 0 ? "live" : "fallback",
      count: uniqueNews.length
    });
  } catch (err) {
    console.error("News API error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
