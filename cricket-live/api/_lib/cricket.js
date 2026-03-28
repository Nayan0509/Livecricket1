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

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
}

module.exports = { cricGet, rapidGet, liveCache, dataCache, cors };
