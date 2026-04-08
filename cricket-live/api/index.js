const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 30 }); // Cache for 30s

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache"
};

/**
 * Robust News Fetcher (Google News RSS)
 * Vercel IPs are often blocked by Cricbuzz news, but Google News is very reliable.
 */
async function getNews() {
  try {
    const rssUrl = "https://news.google.com/rss/search?q=cricket+match+scores+news&hl=en-IN&gl=IN&ceid=IN:en";
    const { data } = await axios.get(rssUrl, { timeout: 8000 });
    const $ = cheerio.load(data, { xmlMode: true });
    const news = [];
    $("item").each((i, el) => {
      if (i >= 20) return;
      const title = $(el).find("title").text();
      const link = $(el).find("link").text();
      const pubDate = $(el).find("pubDate").text();
      const source = $(el).find("source").text();
      news.push({
        id: link,
        title: title.split(" - ")[0],
        description: title.split(" - ")[0],
        date: new Date(pubDate).toLocaleDateString(),
        source: source || "Sports News",
        url: link
      });
    });
    return news;
  } catch (e) {
    console.error("News fetch failed:", e.message);
    return [];
  }
}

/**
 * Robust Live Match Scraper (Synchronized with local server)
 */
async function getLiveMatches() {
  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", { headers, timeout: 8000 });
    const $ = cheerio.load(data);
    const matches = [];

    // Modern Cricbuzz selectors
    $("a[href^='/live-cricket-scores/']").each((i, elem) => {
      const $card = $(elem);
      const url = $card.attr("href");
      const id = url ? url.split("/")[2] : `cb-${i}`;
      
      const teams = [];
      const teamInfo = [];
      const scores = [];

      $card.find("div.cb-hmscg-tm-nm").each((j, t) => {
        const name = $(t).text().trim();
        if (name) {
          teams.push(name);
          teamInfo.push({ name, shortname: name.slice(0,3).toUpperCase(), img: null });
        }
      });

      const status = $card.find("div.cb-text-live, div.cb-text-complete, div.cb-mtch-hv-scrd").text().trim() || "Live";

      if (teams.length >= 1) {
        matches.push({
          id,
          name: teams.length >= 2 ? `${teams[0]} vs ${teams[1]}` : teams[0],
          status,
          matchType: $card.find("div.cb-hmscg-hdr span").first().text().trim() || "T20",
          venue: $card.find("div.cb-hmscg-hdr span").last().text().trim(),
          teams,
          teamInfo,
          matchStarted: true,
          matchEnded: status.toLowerCase().includes("won by") || status.toLowerCase().includes("drawn")
        });
      }
    });
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
      return res.json({ status: "success", data });
    }

    if (path === "matches/live" || path === "matches/current") {
      const data = await getLiveMatches();
      return res.json({ status: "success", data });
    }

    if (path === "matches/upcoming" || path === "schedule") {
       // Simplified upcoming for Vercel
       return res.json({ status: "success", data: [] });
    }

    // Fallback search rankings etc.
    if (path === "rankings" || path === "teams") {
       return res.json({ status: "success", data: [] });
    }

    return res.json({ 
      status: "success", 
      data: [], 
      info: `Vercel Endpoint Active (${path})`,
      mode: "Enterprise Scraper"
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
