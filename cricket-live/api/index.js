const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

const scrapeCache = new NodeCache({ stdTTL: 30 });

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
};

// Scrape live matches from ESPNcricinfo
async function scrapeEspnLiveMatches() {
  const cacheKey = "espn:live";
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get("https://www.espncricinfo.com/live-cricket-score", {
      headers,
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const matches = [];

    $("div[class*='ds-px-4 ds-py-3']").each((i, elem) => {
      const $match = $(elem);
      const matchLink = $match.find("a").first().attr("href");
      const matchId = matchLink ? matchLink.split("/").pop() : `espn-${i}`;
      
      const teams = [];
      const scores = [];
      
      $match.find("p[class*='ds-text-tight']").each((j, textElem) => {
        const text = $(textElem).text().trim();
        if (text && text.length > 2 && !text.includes("•") && !text.includes("Match")) {
          if (j % 2 === 0) {
            teams.push(text);
          } else {
            scores.push(text);
          }
        }
      });

      const status = $match.find("span[class*='ds-text-tight']").first().text().trim();

      if (teams.length >= 2) {
        matches.push({
          id: matchId,
          name: `${teams[0]} vs ${teams[1]}`,
          teams: teams.slice(0, 2),
          matchType: "T20",
          status,
          matchStarted: status.toLowerCase().includes("live"),
          matchEnded: status.toLowerCase().includes("result"),
          score: scores.length >= 2 ? [
            { inning: teams[0], r: scores[0].split("/")[0] || "0", w: scores[0].split("/")[1] || "0", o: "20" },
            { inning: teams[1], r: scores[1].split("/")[0] || "0", w: scores[1].split("/")[1] || "0", o: "20" }
          ] : [],
          teamInfo: teams.slice(0, 2).map(t => ({ shortname: t, img: null }))
        });
      }
    });

    scrapeCache.set(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error("ESPNcricinfo scraping error:", error.message);
    return [];
  }
}

// Scrape news from Cricbuzz
async function scrapeCricbuzzNews() {
  const cacheKey = "cricbuzz:news";
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-news/latest-news", {
      headers,
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const news = [];

    $("div[class*='cb-nws-lst-rt']").each((i, elem) => {
      const $news = $(elem);
      const link = $news.find("a").attr("href");
      const title = $news.find("div[class*='cb-nws-hdln']").text().trim();
      const description = $news.find("div[class*='cb-nws-intr']").text().trim();

      if (title && link) {
        news.push({
          id: link,
          title,
          description,
          date: new Date().toLocaleDateString(),
          source: "Cricbuzz",
          url: `https://www.cricbuzz.com${link}`
        });
      }
    });

    scrapeCache.set(cacheKey, news);
    return news;
  } catch (error) {
    console.error("Cricbuzz news scraping error:", error.message);
    return [];
  }
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
      return res.json({ status: "ok", scraping: true });
    }

    if (urlPath === "matches/live") {
      const matches = await scrapeEspnLiveMatches();
      return res.json({ status: "success", data: matches });
    }
    
    if (urlPath === "matches/upcoming") {
      const matches = await scrapeEspnLiveMatches();
      const upcoming = matches.filter(m => !m.matchStarted);
      return res.json({ status: "success", data: upcoming });
    }
    
    if (urlPath === "matches/schedule") {
      const matches = await scrapeEspnLiveMatches();
      return res.json({ status: "success", data: matches });
    }
    
    if (parts[0] === "matches" && parts[1] && parts[2] === "scorecard") {
      return res.json({ status: "success", data: { matchId: parts[1], message: "Scorecard scraping in progress" } });
    }
    
    if (parts[0] === "matches" && parts[1] && parts[2] === "score") {
      return res.json({ status: "success", data: { matchId: parts[1], message: "Score scraping in progress" } });
    }
    
    if (parts[0] === "matches" && parts[1]) {
      return res.json({ status: "success", data: { matchId: parts[1], message: "Match info scraping in progress" } });
    }

    if (urlPath === "series") {
      return res.json({ status: "success", data: [] });
    }
    
    if (parts[0] === "series" && parts[1]) {
      return res.json({ status: "success", data: { id: parts[1] } });
    }

    if (urlPath === "players") {
      return res.json({ status: "success", data: [] });
    }
    
    if (parts[0] === "players" && parts[1]) {
      return res.json({ status: "success", data: { id: parts[1] } });
    }

    if (urlPath === "news") {
      const news = await scrapeCricbuzzNews();
      return res.json({ status: "success", data: news });
    }

    if (urlPath === "teams" || urlPath === "rankings") {
      return res.json({ status: "success", data: [] });
    }

    res.status(404).json({ error: `Unknown route: ${urlPath}` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
