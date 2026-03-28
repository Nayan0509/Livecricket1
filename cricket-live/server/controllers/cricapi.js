const axios = require("axios");
const NodeCache = require("node-cache");

const liveCache = new NodeCache({ stdTTL: 30 });   // 30s for live data
const dataCache = new NodeCache({ stdTTL: 300 });  // 5min for static data

// ── CricketData.org ──────────────────────────────────────────────────────────
// Tested working endpoints:
//   currentMatches, matches, series, series_info, players, players_info,
//   match_info, cricScore
const CRIC_BASE = "https://api.cricapi.com/v1";

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

// ── RapidAPI Free Cricbuzz ───────────────────────────────────────────────────
// Tested working endpoints:
//   GET /cricket-livescores  → { status, response: [] | [...matches] }
//   GET /cricket-schedule    → { status, response: { schedules: [...] } }
//   GET /cricket-teams       → { status, response: [ {id, title, image} ] }
//   GET /cricket-series      → { status, response: [ {month, series, dates, url, title} ] }
//   GET /cricket-match-info?matchid=  → { status, response: { matchInfo: {} } }
// NOT available on free tier: /cricket-news, /cricket-players, /rankings/*
const RAPID_BASE = "https://free-cricbuzz-cricket-api.p.rapidapi.com";
const rapidHeaders = () => ({
  "x-rapidapi-key": process.env.RAPIDAPI_KEY,
  "x-rapidapi-host": "free-cricbuzz-cricket-api.p.rapidapi.com",
});

async function rapidGet(path, params = {}, cache = dataCache) {
  const key = `rapid:${path}:${JSON.stringify(params)}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const { data } = await axios.get(`${RAPID_BASE}${path}`, {
    headers: rapidHeaders(),
    params,
    timeout: 12000,
  });
  cache.set(key, data);
  return data;
}

module.exports = { cricGet, rapidGet, liveCache, dataCache };
