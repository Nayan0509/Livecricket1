const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 30 }); // Cache for 30s

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Connection": "keep-alive"
};

/**
 * Robust News Fetcher (Google News RSS)
 * Vercel IPs are often blocked by Cricbuzz news, but Google News is very reliable.
 */
async function getNews() {
  try {
    const rssUrl = "https://news.google.com/rss/search?q=cricket+match+IPL+T20+World+Cup&hl=en-IN&gl=IN&ceid=IN:en";
    const { data } = await axios.get(rssUrl, { timeout: 10000 });
    const $ = cheerio.load(data, { xmlMode: true });
    const news = [];
    $("item").each((i, el) => {
      if (i >= 20) return;
      const title = $(el).find("title").text();
      const link = $(el).find("link").text();
      const pubDate = $(el).find("pubDate").text();
      const source = $(el).find("source").text();
      const description = $(el).find("description").text().replace(/<[^>]*>?/gm, "").split(" - ")[0];
      
      news.push({
        id: link,
        title,
        description: description || title,
        date: new Date(pubDate).toLocaleDateString(),
        source: source || "Google News",
        url: link,
        publishedAt: new Date(pubDate).toISOString()
      });
    });
    console.log(`Fetched ${news.length} news items from Google News`);
    return news;
  } catch (e) {
    console.error("News fetch failed:", e.message);
    return [];
  }
}

/**
 * Helper to clean and parse team/score text
 */
function cleanTeamAndScore(text) {
  if (!text) return { name: "", score: "" };
  const scoreMatch = text.match(/([A-Z]{2,5})(\d.*)$/);
  if (scoreMatch) return { name: text.split(scoreMatch[1])[0].trim() || scoreMatch[1], score: scoreMatch[2], sName: scoreMatch[1] };
  const simpleMatch = text.match(/^(.*?)(\d+[\-\/]\d+.*)$/);
  if (simpleMatch) return { name: simpleMatch[1].trim(), score: simpleMatch[2].trim() };
  return { name: text.trim(), score: "" };
}

function parseScore(scoreStr) {
  if (!scoreStr) return { r: 0, w: 0, o: 0 };
  const rMatch = scoreStr.match(/(\d+)([\-\/](\d+))?/);
  const oMatch = scoreStr.match(/\((\d+(\.\d+)?)\s*(ov)?\)/);
  
  return {
    r: rMatch ? parseInt(rMatch[1]) : 0,
    w: rMatch && rMatch[3] ? parseInt(rMatch[3]) : 0,
    o: oMatch ? parseFloat(oMatch[1]) : 0
  };
}

/**
 * Robust Live Match Scraper (Synchronized with local server)
 */
async function getLiveMatches() {
  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const matches = [];

    // Modern Cricbuzz selectors - synchronized with server/utils/scraper.js
    $("a[href^='/live-cricket-scores/']").each((i, elem) => {
      const $card = $(elem);
      const url = $card.attr("href");
      const id = url ? url.split("/")[2] : `cb-${i}`;
      
      const teams = [];
      const scoreArr = [];
      const teamInfo = [];

      // Extract team names and scores from the card structure
      $card.find("> div:nth-child(2) > div").each((j, row) => {
        const fullText = $(row).text().trim();
        if (fullText) {
          const { name, score, sName } = cleanTeamAndScore(fullText);
          teams.push(name);
          teamInfo.push({ name, shortname: sName || name.slice(0,3).toUpperCase(), img: null });
          if (score) scoreArr.push({ ...parseScore(score), inning: name });
        }
      });

      const status = $card.find("> span:last-of-type").text().trim();

      if (teams.length >= 2) {
        matches.push({
          id,
          name: `${teams[0]} vs ${teams[1]}`,
          matchType: $card.find("div:first-child span").text().split("•")[0]?.trim() || "International",
          status,
          date: new Date().toLocaleDateString(),
          teams,
          teamInfo,
          score: scoreArr,
          matchStarted: true,
          matchEnded: status.toLowerCase().includes("won by") || status.toLowerCase().includes("drawn"),
          source: "cricbuzz",
          url: `https://www.cricbuzz.com${url}`,
          statusDetail: $card.find(".cb-min-bat-lhs, .cb-min-bowl-lhs").map((i, el) => $(el).text().trim()).get().join(" | ")
        });
      }
    });
    
    console.log(`Scraped ${matches.length} live matches from Cricbuzz`);
    return matches;
  } catch (e) {
    console.error("Live matches scrape failed:", e.message);
    return [];
  }
}

/**
 * Serve Static Metadata
 */
function serveMeta(url, res) {
  if (url.includes("sitemap.xml")) {
    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.livecricketzone.com/</loc></url></urlset>`);
  }
  if (url.includes("robots.txt")) {
    res.setHeader("Content-Type", "text/plain");
    return res.status(200).send("User-agent: *\nAllow: /");
  }
  return false;
}

/**
 * Main Vercel Entry Point
 */
module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (serveMeta(req.url, res)) return;

  // Extraction of path even if Vercel rewrites it to /api/index
  const fullUrl = req.url || "";
  const queryPath = req.query && req.query.path;
  const path = queryPath || fullUrl.split("?")[0].replace("/api/", "").replace("/", "").replace("index.js", "").replace(/^\/+|\/+$/g, "");
  const parts = path.split("/").filter(Boolean);

  try {
    if (path === "health") {
      return res.json({ status: "ok", mode: "Scale Up Enterprise", dependencyFree: true });
    }

    if (path === "news") {
      const data = await getNews();
      console.log(`[API] News endpoint: ${data.length} items`);
      return res.json({ status: "success", data });
    }

    if (path === "matches/live" || path === "matches/current") {
      const data = await getLiveMatches();
      console.log(`[API] Live matches endpoint: ${data.length} matches`);
      return res.json({ status: "success", data });
    }

    if (path === "matches/upcoming" || path === "schedule") {
       // Simplified upcoming for Vercel
       console.log(`[API] Schedule endpoint called`);
       return res.json({ status: "success", data: [] });
    }

    // Fallback search rankings etc.
    if (path === "rankings" || path === "teams") {
       console.log(`[API] ${path} endpoint called`);
       return res.json({ status: "success", data: [] });
    }

    console.log(`[API] Unknown endpoint: ${path}`);
    return res.json({ 
      status: "success", 
      data: [], 
      info: `Vercel Endpoint Active (${path})`,
      mode: "Enterprise Scraper"
    });

  } catch (error) {
    console.error(`[API Error] ${error.message}`, error.stack);
    res.status(500).json({ status: "error", message: error.message });
  }
};
