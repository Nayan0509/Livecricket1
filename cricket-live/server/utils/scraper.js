const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

// Cache scraped data for 30 seconds (live) and 5 minutes (static)
const scrapeCache = new NodeCache({ stdTTL: 30 });

// User agent to avoid blocking
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1"
};

/**
 * Scrape live matches from Cricbuzz
 */
async function scrapeCricbuzzLiveMatches() {
  const cacheKey = "cricbuzz:live";
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", {
      headers,
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const matches = [];

    // Try different selectors for Cricbuzz
    $("div[class*='cb-col-100 cb-col cb-mtch-lst']").each((i, elem) => {
      const $match = $(elem);
      const matchLink = $match.find("a").first().attr("href");
      const matchId = matchLink ? matchLink.split("/")[2] : null;
      
      const seriesName = $match.find("div[class*='cb-mtch-crd-state']").text().trim();
      const matchType = $match.find("div[class*='text-gray']").first().text().trim();
      
      const teams = [];
      const scores = [];
      
      $match.find("div[class*='cb-hmscg-tm-nm']").each((j, teamElem) => {
        teams.push($(teamElem).text().trim());
      });
      
      $match.find("div[class*='cb-hmscg-bat-txt']").each((j, scoreElem) => {
        scores.push($(scoreElem).text().trim());
      });
      
      const status = $match.find("div[class*='cb-text-']").text().trim();

      if (teams.length >= 2) {
        matches.push({
          id: matchId || `cricbuzz-${i}`,
          name: `${teams[0]} vs ${teams[1]}`,
          series: seriesName,
          matchType,
          teams,
          score: {
            [teams[0]]: scores[0] || "",
            [teams[1]]: scores[1] || ""
          },
          status,
          source: "cricbuzz",
          url: matchLink ? `https://www.cricbuzz.com${matchLink}` : null
        });
      }
    });

    scrapeCache.set(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error("Cricbuzz scraping error:", error.message);
    throw new Error("Failed to scrape Cricbuzz");
  }
}

/**
 * Scrape match scorecard from Cricbuzz
 */
async function scrapeCricbuzzScorecard(matchId) {
  const cacheKey = `cricbuzz:scorecard:${matchId}`;
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`, {
      headers,
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const scorecard = {
      matchId,
      title: $(".cb-nav-main .cb-col-100").first().text().trim(),
      status: $(".cb-text-complete, .cb-text-live").text().trim(),
      innings: [],
      source: "cricbuzz"
    };

    // Extract innings data
    $(".cb-col.cb-col-100.cb-ltst-wgt-hdr").each((i, elem) => {
      const $inning = $(elem);
      const teamName = $inning.find(".cb-col-84").text().trim();
      const score = $inning.find(".cb-col-16").text().trim();
      
      const batsmen = [];
      $inning.next(".cb-col.cb-col-100.cb-scrd-itms").find(".cb-col.cb-col-100.cb-scrd-itms").each((j, row) => {
        const $row = $(row);
        const name = $row.find(".cb-col-27").text().trim();
        const runs = $row.find(".cb-col-8").eq(0).text().trim();
        const balls = $row.find(".cb-col-8").eq(1).text().trim();
        
        if (name && runs) {
          batsmen.push({ name, runs, balls });
        }
      });

      if (teamName) {
        scorecard.innings.push({
          team: teamName,
          score,
          batsmen: batsmen.slice(0, 11) // Limit to 11 players
        });
      }
    });

    scrapeCache.set(cacheKey, scorecard);
    return scorecard;
  } catch (error) {
    console.error("Cricbuzz scorecard scraping error:", error.message);
    throw new Error("Failed to scrape scorecard");
  }
}

/**
 * Scrape live matches from ESPNcricinfo
 */
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

    // Find all match containers
    $("div[class*='ds-px-4 ds-py-3']").each((i, elem) => {
      const $match = $(elem);
      const matchLink = $match.find("a").first().attr("href");
      const matchId = matchLink ? matchLink.split("/").pop() : `espn-${i}`;
      
      const teams = [];
      const scores = [];
      
      // Extract team names and scores
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
      const matchInfo = $match.find("span[class*='ds-text-tight-xs']").text().trim();

      if (teams.length >= 2) {
        matches.push({
          id: matchId,
          name: `${teams[0]} vs ${teams[1]}`,
          teams: teams.slice(0, 2),
          score: {
            [teams[0]]: scores[0] || "",
            [teams[1]]: scores[1] || ""
          },
          status,
          matchInfo,
          source: "espncricinfo",
          url: matchLink ? (matchLink.startsWith("http") ? matchLink : `https://www.espncricinfo.com${matchLink}`) : null
        });
      }
    });

    scrapeCache.set(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error("ESPNcricinfo scraping error:", error.message);
    throw new Error("Failed to scrape ESPNcricinfo");
  }
}

/**
 * Scrape match scorecard from ESPNcricinfo
 */
async function scrapeEspnScorecard(matchId) {
  const cacheKey = `espn:scorecard:${matchId}`;
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`https://www.espncricinfo.com/series/_/_/${matchId}/full-scorecard`, {
      headers,
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const scorecard = {
      matchId,
      title: $("h1").first().text().trim(),
      status: $(".ds-text-tight-m").first().text().trim(),
      innings: [],
      source: "espncricinfo"
    };

    // Extract innings data
    $(".ds-rounded-lg").each((i, elem) => {
      const $inning = $(elem);
      const teamName = $inning.find("h5").text().trim();
      const score = $inning.find(".ds-text-compact-m").first().text().trim();
      
      const batsmen = [];
      $inning.find("tbody tr").each((j, row) => {
        const $row = $(row);
        const name = $row.find("td").eq(0).text().trim();
        const runs = $row.find("td").eq(2).text().trim();
        const balls = $row.find("td").eq(3).text().trim();
        
        if (name && runs && !name.includes("Extras") && !name.includes("Total")) {
          batsmen.push({ name, runs, balls });
        }
      });

      if (teamName && batsmen.length > 0) {
        scorecard.innings.push({
          team: teamName,
          score,
          batsmen
        });
      }
    });

    scrapeCache.set(cacheKey, scorecard);
    return scorecard;
  } catch (error) {
    console.error("ESPNcricinfo scorecard scraping error:", error.message);
    throw new Error("Failed to scrape scorecard");
  }
}

/**
 * Get live matches with fallback strategy
 * 1. Try Cricbuzz
 * 2. Try ESPNcricinfo
 * 3. Return empty array
 */
async function getLiveMatchesWithFallback() {
  try {
    return await scrapeCricbuzzLiveMatches();
  } catch (error) {
    console.log("Cricbuzz failed, trying ESPNcricinfo...");
    try {
      return await scrapeEspnLiveMatches();
    } catch (error2) {
      console.error("All scraping sources failed");
      return [];
    }
  }
}

/**
 * Get scorecard with fallback strategy
 */
async function getScorecardWithFallback(matchId, source = "cricbuzz") {
  try {
    if (source === "espncricinfo") {
      return await scrapeEspnScorecard(matchId);
    }
    return await scrapeCricbuzzScorecard(matchId);
  } catch (error) {
    console.log(`${source} failed, trying alternative...`);
    try {
      if (source === "cricbuzz") {
        return await scrapeEspnScorecard(matchId);
      }
      return await scrapeCricbuzzScorecard(matchId);
    } catch (error2) {
      throw new Error("Failed to fetch scorecard from all sources");
    }
  }
}

/**
 * Scrape cricket news from Cricbuzz
 */
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

    $(".cb-nws-lst-rt").each((i, elem) => {
      const $news = $(elem);
      const link = $news.find("a").attr("href");
      const title = $news.find(".cb-nws-hdln").text().trim();
      const description = $news.find(".cb-nws-intr").text().trim();
      const time = $news.find(".cb-nws-time").text().trim();
      const image = $news.find("img").attr("src");

      if (title && link) {
        news.push({
          id: link,
          title,
          description,
          date: time,
          source: "Cricbuzz",
          url: `https://www.cricbuzz.com${link}`,
          image: image ? `https://www.cricbuzz.com${image}` : null,
          publishedAt: new Date().toISOString()
        });
      }
    });

    scrapeCache.set(cacheKey, news);
    return news;
  } catch (error) {
    console.error("Cricbuzz news scraping error:", error.message);
    throw new Error("Failed to scrape Cricbuzz news");
  }
}

/**
 * Scrape cricket news from ESPNcricinfo
 */
async function scrapeEspnNews() {
  const cacheKey = "espn:news";
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get("https://www.espncricinfo.com/cricket-news", {
      headers,
      timeout: 10000
    });

    const $ = cheerio.load(data);
    const news = [];

    $("article").each((i, elem) => {
      const $article = $(elem);
      const link = $article.find("a").attr("href");
      const title = $article.find("h2, h3").text().trim();
      const description = $article.find("p").first().text().trim();
      const image = $article.find("img").attr("src");

      if (title && link) {
        news.push({
          id: link,
          title,
          description,
          date: new Date().toLocaleDateString(),
          source: "ESPNcricinfo",
          url: link.startsWith("http") ? link : `https://www.espncricinfo.com${link}`,
          image,
          publishedAt: new Date().toISOString()
        });
      }
    });

    scrapeCache.set(cacheKey, news);
    return news;
  } catch (error) {
    console.error("ESPNcricinfo news scraping error:", error.message);
    throw new Error("Failed to scrape ESPNcricinfo news");
  }
}

/**
 * Get news with fallback strategy
 */
async function getNewsWithFallback() {
  const allNews = [];

  // Try Cricbuzz
  try {
    const cricbuzzNews = await scrapeCricbuzzNews();
    allNews.push(...cricbuzzNews);
  } catch (error) {
    console.log("Cricbuzz news failed:", error.message);
  }

  // Try ESPNcricinfo
  try {
    const espnNews = await scrapeEspnNews();
    allNews.push(...espnNews);
  } catch (error) {
    console.log("ESPNcricinfo news failed:", error.message);
  }

  return allNews;
}

module.exports = {
  scrapeCricbuzzLiveMatches,
  scrapeCricbuzzScorecard,
  scrapeEspnLiveMatches,
  scrapeEspnScorecard,
  getLiveMatchesWithFallback,
  getScorecardWithFallback,
  scrapeCricbuzzNews,
  scrapeEspnNews,
  getNewsWithFallback
};
