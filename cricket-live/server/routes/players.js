const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");
const cheerio = require("cheerio");

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
    // Fallback: well-known players list
    return KNOWN_PLAYERS.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.country.toLowerCase().includes(query.toLowerCase())
    );
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

// Curated fallback list for offline/rate-limit scenarios
const KNOWN_PLAYERS = [
  { id: "338", name: "Virat Kohli", country: "India", role: "Batsman" },
  { id: "107", name: "Rohit Sharma", country: "India", role: "Batsman" },
  { id: "277", name: "MS Dhoni", country: "India", role: "Wicket-keeper" },
  { id: "445", name: "Jasprit Bumrah", country: "India", role: "Bowler" },
  { id: "371", name: "Ravindra Jadeja", country: "India", role: "All-rounder" },
  { id: "8733", name: "Shubman Gill", country: "India", role: "Batsman" },
  { id: "7527", name: "Yashasvi Jaiswal", country: "India", role: "Batsman" },
  { id: "6538", name: "Rishabh Pant", country: "India", role: "Wicket-keeper" },
  { id: "185", name: "Steve Smith", country: "Australia", role: "Batsman" },
  { id: "170", name: "David Warner", country: "Australia", role: "Batsman" },
  { id: "5765", name: "Pat Cummins", country: "Australia", role: "Bowler" },
  { id: "8917", name: "Travis Head", country: "Australia", role: "Batsman" },
  { id: "7179", name: "Jos Buttler", country: "England", role: "Wicket-keeper" },
  { id: "8917", name: "Ben Stokes", country: "England", role: "All-rounder" },
  { id: "9", name: "Joe Root", country: "England", role: "Batsman" },
  { id: "308", name: "Babar Azam", country: "Pakistan", role: "Batsman" },
  { id: "7476", name: "Shaheen Afridi", country: "Pakistan", role: "Bowler" },
  { id: "10430", name: "Mohammad Rizwan", country: "Pakistan", role: "Wicket-keeper" },
  { id: "7693", name: "Kagiso Rabada", country: "South Africa", role: "Bowler" },
  { id: "8672", name: "Sunil Narine", country: "West Indies", role: "All-rounder" },
  { id: "102", name: "Andre Russell", country: "West Indies", role: "All-rounder" },
];

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
    const data = await getPlayerInfo(req.params.id);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
