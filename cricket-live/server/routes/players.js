const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const cheerio = require("cheerio");
const scraper = require("../utils/scraper");

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

// Scrape Cricbuzz player search
async function searchPlayers(query) {
  const key = `players:search:${query}`;
  const hit = cache.get(key);
  if (hit) return hit;

  try {
    const url = `https://www.cricbuzz.com/api/cricket-search/v2?action=cricketers&q=${encodeURIComponent(query)}&callback=`;
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 8000 });

    // Cricbuzz search returns JSONP; strip callback wrapper
    const json = data.replace(/^[^(]+\(/, "").replace(/\);?\s*$/, "");
    const parsed = JSON.parse(json);
    const results = (parsed?.player || []).map(p => ({
      id: p.id,
      name: p.name,
      country: p.teamName || "",
      role: p.role || "",
    }));

    cache.set(key, results);
    return results;
  } catch {
    // Real search failed — return empty rather than substituting a fixed
    // fake result set.
    return [];
  }
}

// Scrape Cricbuzz player profile
async function getPlayerInfo(id) {
  const key = `players:info:${id}`;
  const hit = cache.get(key);
  if (hit) return hit;

  try {
    const url = `https://www.cricbuzz.com/profiles/${id}`;
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 10000 });
    const $ = cheerio.load(data);

    const name = $("h1.cb-font-40").first().text().trim() ||
      $(".cb-player-name").first().text().trim() || "Player";

    const country = $(".cb-text-gray").first().text().trim() || "";
    const role = $(".cb-player-bio-type-val").first().text().trim() ||
      $(".cb-player-role").first().text().trim() || "";

    const stats = [];
    $(".cb-plyr-tbl").each((_, tbl) => {
      const format = $(tbl).prev("h3").text().trim();
      $(tbl).find("tr").each((i, tr) => {
        if (i === 0) return;
        const cells = $(tr).find("td");
        if (cells.length >= 2) {
          stats.push({ type: format, stat: $(cells[0]).text().trim(), value: $(cells[1]).text().trim() });
        }
      });
    });

    const info = { id, name, country, role, stats };
    cache.set(key, info);
    return info;
  } catch (err) {
    return { id, name: "Player", country: "", role: "", stats: [], error: err.message };
  }
}

// GET /api/players?search=virat
router.get("/", async (req, res) => {
  try {
    const query = req.query.search || "india";
    const data = await searchPlayers(query);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
});

// GET /api/players/:id
router.get("/:id", async (req, res) => {
  try {
    const data = await scraper.scrapePlayerDetails(req.params.id);
    if (!data) return res.status(404).json({ error: "Player not found" });
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
