// Single serverless function handling ALL cricket API routes
// Routes handled:
//   /api/cricket?route=matches/live
//   /api/cricket?route=matches/upcoming
//   /api/cricket?route=matches/schedule
//   /api/cricket?route=matches/:id
//   /api/cricket?route=matches/:id&action=score
//   /api/cricket?route=matches/:id&action=scorecard
//   /api/cricket?route=series
//   /api/cricket?route=series/:id
//   /api/cricket?route=players&search=virat
//   /api/cricket?route=players/:id
//   /api/cricket?route=news
//   /api/cricket?route=teams
//   /api/cricket?route=rankings
//   /api/cricket?route=health

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

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Parse route from URL path: /api/matches/live → route = "matches/live"
  // Strip leading /api/ prefix
  const urlPath = req.url.split("?")[0].replace(/^\/api\//, "");
  const parts = urlPath.split("/").filter(Boolean);
  const { action, search } = req.query;

  try {
    // health
    if (urlPath === "health") {
      return res.json({ status: "ok", cricapi: !!process.env.CRICAPI_KEY, rapidapi: !!process.env.RAPIDAPI_KEY });
    }

    // matches/live
    if (urlPath === "matches/live") {
      return res.json(await cricGet("currentMatches", { offset: 0 }, liveCache));
    }

    // matches/upcoming
    if (urlPath === "matches/upcoming") {
      return res.json(await cricGet("matches", { offset: 0 }));
    }

    // matches/schedule
    if (urlPath === "matches/schedule") {
      return res.json(await rapidGet("/cricket-schedule"));
    }

    // matches/:id/scorecard or matches/:id/score or matches/:id
    if (parts[0] === "matches" && parts[1] && parts[1] !== "live" && parts[1] !== "upcoming" && parts[1] !== "schedule") {
      const id = parts[1];
      const sub = parts[2] || action;
      if (sub === "scorecard") return res.json(await cricGet("match_scorecard", { id }, liveCache));
      if (sub === "score")     return res.json(await cricGet("cricScore", { id }, liveCache));
      return res.json(await cricGet("match_info", { id }));
    }

    // series
    if (urlPath === "series") {
      return res.json(await cricGet("series", { offset: 0 }));
    }

    // series/:id
    if (parts[0] === "series" && parts[1]) {
      return res.json(await cricGet("series_info", { id: parts[1] }));
    }

    // players
    if (urlPath === "players") {
      return res.json(await cricGet("players", { search: search || "india", offset: 0 }));
    }

    // players/:id
    if (parts[0] === "players" && parts[1]) {
      return res.json(await cricGet("players_info", { id: parts[1] }));
    }

    // news
    if (urlPath === "news") {
      const data = await cricGet("matches", { offset: 0 });
      const items = (data.data || []).map(m => ({
        id: m.id, title: m.name, description: m.status,
        date: m.date, venue: m.venue, matchType: m.matchType,
        teams: m.teams, teamInfo: m.teamInfo,
      }));
      return res.json({ status: "success", data: items });
    }

    // teams + rankings
    if (urlPath === "teams" || urlPath === "rankings") {
      return res.json(await rapidGet("/cricket-teams"));
    }

    res.status(404).json({ error: `Route not found: ${urlPath}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
