const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

const liveCache = new NodeCache({ stdTTL: 30 });
const dataCache = new NodeCache({ stdTTL: 300 });

// User agent to avoid blocking
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Connection": "keep-alive",
};

// ── Scraper Core (Scale Up) ───────────────────────────────────────────────────

async function scrapeCricbuzzLive() {
  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const matches = [];
    $("div[class*='cb-col-100 cb-col cb-mtch-lst']").each((i, elem) => {
      const $match = $(elem);
      const matchLink = $match.find("a").first().attr("href");
      const teams = [];
      $match.find("div[class*='cb-hmscg-tm-nm']").each((j, t) => teams.push($(t).text().trim()));
      if (teams.length >= 2) {
        matches.push({
          id: matchLink ? matchLink.split("/")[2] : `live-${i}`,
          name: `${teams[0]} vs ${teams[1]}`,
          status: $match.find("div[class*='cb-text-']").text().trim(),
          teams
        });
      }
    });
    return matches;
  } catch (e) { return []; }
}

async function scrapeCricbuzzUpcoming() {
  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-schedule/upcoming-series/international", { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const schedule = [];
    $(".cb-lv-scdl-itm").each((i, item) => {
      const name = $(item).find(".cb-lv-scdl-info a").text().trim();
      if (name) schedule.push({ name, date: $(item).find(".cb-lv-scdl-date").text().trim() });
    });
    return schedule;
  } catch (e) { return []; }
}

async function scrapeScorecard(matchId) {
  try {
    const { data } = await axios.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`, { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const innings = [];
    $(".cb-col.cb-col-100.cb-ltst-wgt-hdr").each((i, elem) => {
      innings.push({ team: $(elem).find(".cb-col-84").text().trim(), score: $(elem).find(".cb-col-16").text().trim() });
    });
    return { matchId, title: $("h1").first().text().trim() || "Match Detail", status: $(".cb-text-complete, .cb-text-live").text().trim(), innings };
  } catch (e) { return { error: "Scorecard unavailable" }; }
}

async function scrapeNews() {
  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-news/latest-news", { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const news = [];
    $(".cb-nws-lst-rt").each((i, elem) => {
      news.push({ title: $(elem).find(".cb-nws-hdln").text().trim(), description: $(elem).find(".cb-nws-intr").text().trim(), id: i });
    });
    return news;
  } catch (e) { return []; }
}

// ── Static file responses ────────────────────────────────────────────────────
function serveStatic(req, res) {
  const p = req.url.split("?")[0];
  if (p.endsWith("/sitemap.xml")) {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.livecricketzone.com/</loc></url></urlset>`);
  }
  if (p.endsWith("/robots.txt")) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send("User-agent: *\nAllow: /");
  }
  return null;
}

// ── Main handler ─────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (serveStatic(req, res)) return;

  const urlPath = req.url.split("?")[0].replace(/^\/api\//, "").replace(/^\//, "");
  const parts = urlPath.split("/").filter(Boolean);

  try {
    if (urlPath === "health") {
      return res.json({ status: "ok", mode: "Scale Up (Standalone Scraper)", dependencyFree: true });
    }

    if (urlPath === "matches/live") {
      const data = await scrapeCricbuzzLive();
      return res.json({ status: "success", data });
    }
    if (urlPath === "matches/upcoming" || urlPath === "matches/schedule") {
      const data = await scrapeCricbuzzUpcoming();
      return res.json({ status: "success", data });
    }
    if (parts[0] === "matches" && parts[1] && (parts[2] === "scorecard" || parts[2] === "score")) {
      const data = await scrapeScorecard(parts[1]);
      return res.json({ status: "success", data });
    }
    if (parts[0] === "matches" && parts[1]) {
      const data = await scrapeScorecard(parts[1]);
      return res.json({ status: "success", data });
    }

    if (urlPath === "news") {
      const data = await scrapeNews();
      return res.json({ status: "success", data });
    }

    // Default response for other routes
    return res.json({ status: "success", data: [], info: "Endpoint scaled up with scraper" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

