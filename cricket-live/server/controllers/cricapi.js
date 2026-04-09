const NodeCache = require("node-cache");
const scraper = require("../utils/scraper");

const liveCache = new NodeCache({ stdTTL: 30 });   // 30s for live data
const dataCache = new NodeCache({ stdTTL: 300 });  // 5min for static data

/**
 * Scale Up Replacement for cricGet
 */
async function cricGet(endpoint, params = {}, cache = dataCache) {
  const key = `scaleup:cric:${endpoint}:${JSON.stringify(params)}`;
  const hit = cache.get(key);
  if (hit) return hit;

  let result;
  try {
    if (endpoint === "currentMatches") {
      const data = await scraper.getLiveMatchesWithFallback();
      result = { status: "success", data };
    } else if (endpoint === "matches") {
      const data = await scraper.scrapeCricbuzzUpcoming();
      result = { status: "success", data };
    } else if (endpoint === "match_info") {
      const data = await scraper.scrapeMatchInfo(params.id);
      result = { status: "success", data };
    } else if (endpoint === "match_scorecard") {
      const data = await scraper.scrapeCricbuzzScorecard(params.id);
      result = { status: "success", data };
    } else if (endpoint === "cricScore") {
      const data = await scraper.scrapeCricbuzzScorecard(params.id);
      result = { status: "success", data: [data] };
    } else if (endpoint === "series") {
      const data = await scraper.scrapeCricbuzzSeries();
      result = { status: "success", data };
    } else {
      result = { status: "success", data: [] };
    }

    cache.set(key, result);
    return result;
  } catch (err) {
    return { status: "failure", reason: err.message };
  }
}

/**
 * Scale Up Replacement for rapidGet
 */
async function rapidGet(path, params = {}, cache = dataCache) {
  const key = `scaleup:rapid:${path}:${JSON.stringify(params)}`;
  const hit = cache.get(key);
  if (hit) return hit;

  let result;
  try {
    if (path === "/cricket-livescores") {
      const resp = await scraper.getLiveMatchesWithFallback();
      result = { status: true, response: resp };
    } else if (path === "/cricket-schedule") {
      const resp = await scraper.scrapeCricbuzzUpcoming();
      result = { status: true, response: { schedules: [{ scheduleAdWrapper: { date: "Upcoming", matchScheduleList: [{ seriesName: "Upcoming matches", matchInfo: resp }] } }] } };
    } else if (path === "/cricket-series") {
      const resp = await scraper.scrapeCricbuzzSeries();
      result = { status: true, response: resp };
    } else if (path.includes("/rankings/")) {
      const type = path.split("/")[2] || "batting";
      const format = params.format || "tests";
      const category = params.category || "men";
      const resp = await scraper.scrapeCricbuzzRankings(category, type, format);
      result = { status: true, response: resp };
    } else if (path === "/cricket-teams") {
      const resp = await scraper.scrapeCricbuzzTeams();
      result = { status: true, response: resp };
    } else {
      result = { status: true, response: [] };
    }


    cache.set(key, result);
    return result;
  } catch (err) {
    return { status: false, error: err.message };
  }
}

module.exports = { cricGet, rapidGet, liveCache, dataCache };


