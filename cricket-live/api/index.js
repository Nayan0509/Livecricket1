const axios = require("axios");
const NodeCache = require("node-cache");

const liveCache = new NodeCache({ stdTTL: 30 });
const dataCache = new NodeCache({ stdTTL: 300 });

const CRIC_BASE = "https://api.cricapi.com/v1";
const RAPID_BASE = "https://free-cricbuzz-cricket-api.p.rapidapi.com";

async function cricGet(endpoint, params = {}, cache = dataCache) {
  const key = `cric:${endpoint}:${JSON.stringify(params)}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const { data } = await axios.get(`${CRIC_BASE}/${endpoint}`, {
    params: { apikey: process.env.CRICAPI_KEY, ...params },
    timeout: 12000,
  });
  if (data.status === "failure") throw new Error(data.reason || "CricAPI error");
  cache.set(key, data);
  return data;
}

async function rapidGet(path, params = {}, cache = dataCache) {
  const key = `rapid:${path}:${JSON.stringify(params)}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const { data } = await axios.get(`${RAPID_BASE}${path}`, {
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "free-cricbuzz-cricket-api.p.rapidapi.com",
    },
    params,
    timeout: 12000,
  });
  cache.set(key, data);
  return data;
}

// ── Static file responses ────────────────────────────────────────────────────
function serveStatic(req, res) {
  const p = req.url.split("?")[0];

  if (p.endsWith("/sitemap.xml")) {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.livecricketzone.com/</loc><changefreq>always</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.livecricketzone.com/live</loc><changefreq>always</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.livecricketzone.com/schedule</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.livecricketzone.com/upcoming</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.livecricketzone.com/results</loc><changefreq>hourly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.livecricketzone.com/series</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.livecricketzone.com/teams</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.livecricketzone.com/players</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.livecricketzone.com/rankings</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.livecricketzone.com/news</loc><changefreq>hourly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.livecricketzone.com/stats</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.livecricketzone.com/about</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>
</urlset>`);
  }

  if (p.endsWith("/robots.txt")) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send(
      "User-agent: *\nAllow: /\nDisallow: /watch-live\nDisallow: /api/\n\nSitemap: https://www.livecricketzone.com/sitemap.xml"
    );
  }

  if (p.endsWith("/ads.txt")) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send("google.com, pub-8179151029580359, DIRECT, f08c47fec0942fa0");
  }

  if (p.endsWith("/BingSiteAuth.xml")) {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0");
    return res.status(200).send(
      `<?xml version="1.0"?>\n<users>\n  <user>0E3A479B49E380E7F0CB91985622FF68</user>\n</users>`
    );
  }

  return null; // not a static file
}

// ── Main handler ─────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Try static files first
  if (serveStatic(req, res)) return;

  // Parse route: strip /api/ prefix
  const urlPath = req.url.split("?")[0].replace(/^\/api\//, "").replace(/^\//, "");
  const parts = urlPath.split("/").filter(Boolean);
  const { search } = req.query;

  try {
    if (urlPath === "health") {
      return res.json({ status: "ok", cricapi: !!process.env.CRICAPI_KEY, rapidapi: !!process.env.RAPIDAPI_KEY });
    }

    if (urlPath === "matches/live") {
      return res.json(await cricGet("currentMatches", { offset: 0 }, liveCache));
    }
    if (urlPath === "matches/upcoming") {
      return res.json(await cricGet("matches", { offset: 0 }));
    }
    if (urlPath === "matches/schedule") {
      return res.json(await rapidGet("/cricket-schedule"));
    }
    if (parts[0] === "matches" && parts[1] && parts[2] === "scorecard") {
      return res.json(await cricGet("match_scorecard", { id: parts[1] }, liveCache));
    }
    if (parts[0] === "matches" && parts[1] && parts[2] === "score") {
      return res.json(await cricGet("cricScore", { id: parts[1] }, liveCache));
    }
    if (parts[0] === "matches" && parts[1]) {
      return res.json(await cricGet("match_info", { id: parts[1] }));
    }

    if (urlPath === "series") {
      return res.json(await cricGet("series", { offset: 0 }));
    }
    if (parts[0] === "series" && parts[1]) {
      return res.json(await cricGet("series_info", { id: parts[1] }));
    }

    if (urlPath === "players") {
      return res.json(await cricGet("players", { search: search || "india", offset: 0 }));
    }
    if (parts[0] === "players" && parts[1]) {
      return res.json(await cricGet("players_info", { id: parts[1] }));
    }

    if (urlPath === "news") {
      const data = await cricGet("matches", { offset: 0 });
      const items = (data.data || []).map(m => ({
        id: m.id, title: m.name, description: m.status,
        date: m.date, venue: m.venue, matchType: m.matchType,
        teams: m.teams, teamInfo: m.teamInfo,
      }));
      return res.json({ status: "success", data: items });
    }

    if (urlPath === "teams" || urlPath === "rankings") {
      return res.json(await rapidGet("/cricket-teams"));
    }

    res.status(404).json({ error: `Unknown route: ${urlPath}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
