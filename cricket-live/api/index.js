const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 30 }); // Cache for 30s

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Connection": "keep-alive"
};

/**
 * Robust News Fetcher (Google News RSS)
 * Vercel IPs are often blocked by Cricbuzz news, but Google News is very reliable.
 */
async function getNews() {
  try {
    const rssUrl = "https://news.google.com/rss/search?q=cricket+match+IPL+T20+World+Cup&hl=en-IN&gl=IN&ceid=IN:en";
    const { data } = await axios.get(rssUrl, { timeout: 10000 });
    const $ = cheerio.load(data, { xmlMode: true });
    const news = [];
    $("item").each((i, el) => {
      if (i >= 20) return;
      const title = $(el).find("title").text();
      const link = $(el).find("link").text();
      const pubDate = $(el).find("pubDate").text();
      const source = $(el).find("source").text();
      const description = $(el).find("description").text().replace(/<[^>]*>?/gm, "").split(" - ")[0];
      
      news.push({
        id: link,
        title,
        description: description || title,
        date: new Date(pubDate).toLocaleDateString(),
        source: source || "Google News",
        url: link,
        publishedAt: new Date(pubDate).toISOString()
      });
    });
    console.log(`Fetched ${news.length} news items from Google News`);
    return news;
  } catch (e) {
    console.error("News fetch failed:", e.message);
    return [];
  }
}

/**
 * Helper to clean and parse team/score text
 */
function cleanTeamAndScore(text) {
  if (!text) return { name: "", score: "" };
  const scoreMatch = text.match(/([A-Z]{2,5})(\d.*)$/);
  if (scoreMatch) return { name: text.split(scoreMatch[1])[0].trim() || scoreMatch[1], score: scoreMatch[2], sName: scoreMatch[1] };
  const simpleMatch = text.match(/^(.*?)(\d+[\-\/]\d+.*)$/);
  if (simpleMatch) return { name: simpleMatch[1].trim(), score: simpleMatch[2].trim() };
  return { name: text.trim(), score: "" };
}

function parseScore(scoreStr) {
  if (!scoreStr) return { r: 0, w: 0, o: 0 };
  const rMatch = scoreStr.match(/(\d+)([\-\/](\d+))?/);
  const oMatch = scoreStr.match(/\((\d+(\.\d+)?)\s*(ov)?\)/);
  
  return {
    r: rMatch ? parseInt(rMatch[1]) : 0,
    w: rMatch && rMatch[3] ? parseInt(rMatch[3]) : 0,
    o: oMatch ? parseFloat(oMatch[1]) : 0
  };
}

/**
 * Robust Live Match Scraper (Synchronized with local server)
 */
async function getLiveMatches() {
  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const matches = [];

    // Modern Cricbuzz selectors - synchronized with server/utils/scraper.js
    $("a[href^='/live-cricket-scores/']").each((i, elem) => {
      const $card = $(elem);
      const url = $card.attr("href");
      const id = url ? url.split("/")[2] : `cb-${i}`;
      
      const teams = [];
      const scoreArr = [];
      const teamInfo = [];

      // Extract team names and scores from the card structure
      $card.find("> div:nth-child(2) > div").each((j, row) => {
        const fullText = $(row).text().trim();
        if (fullText) {
          const { name, score, sName } = cleanTeamAndScore(fullText);
          teams.push(name);
          teamInfo.push({ name, shortname: sName || name.slice(0,3).toUpperCase(), img: null });
          if (score) scoreArr.push({ ...parseScore(score), inning: name });
        }
      });

      const status = $card.find("> span:last-of-type").text().trim();

      if (teams.length >= 2) {
        matches.push({
          id,
          name: `${teams[0]} vs ${teams[1]}`,
          matchType: $card.find("div:first-child span").text().split("•")[0]?.trim() || "International",
          status,
          date: new Date().toLocaleDateString(),
          teams,
          teamInfo,
          score: scoreArr,
          matchStarted: true,
          matchEnded: status.toLowerCase().includes("won by") || status.toLowerCase().includes("drawn"),
          source: "cricbuzz",
          url: `https://www.cricbuzz.com${url}`,
          statusDetail: $card.find(".cb-min-bat-lhs, .cb-min-bowl-lhs").map((i, el) => $(el).text().trim()).get().join(" | ")
        });
      }
    });
    
    console.log(`Scraped ${matches.length} live matches from Cricbuzz`);
    return matches;
  } catch (e) {
    console.error("Live matches scrape failed:", e.message);
    return [];
  }
}

/**
 * Get Match Info
 */
async function getMatchInfo(matchId) {
  const cacheKey = `match-info-${matchId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`, { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    
    const teams = [];
    const teamInfo = [];
    const scoreArr = [];
    
    // Extract team names and scores
    $(".cb-col.cb-col-100.cb-ltst-wgt-hdr").each((i, el) => {
      const team = $(el).find(".cb-col-84").text().trim();
      const score = $(el).find(".cb-col-16").text().trim();
      if (team) {
        teams.push(team);
        teamInfo.push({ 
          name: team, 
          shortname: team.slice(0, 3).toUpperCase(), 
          img: null 
        });
        if (score) {
          scoreArr.push({ ...parseScore(score), inning: team, team, score });
        }
      }
    });

    const status = $(".cb-text-complete, .cb-text-live, .cb-text-stumps").first().text().trim() || "In Progress";
    const venue = $(".cb-nav-subhdr.cb-font-12").text().trim();
    const matchType = $(".cb-nav-hdr.cb-font-18").text().split(",")[0]?.trim() || "International";
    
    // Extract toss info
    let tossWinner = "";
    let tossChoice = "";
    $(".cb-col.cb-col-100.cb-mtch-info-itm").each((i, el) => {
      const text = $(el).text();
      if (text.includes("Toss")) {
        const tossText = text.replace("Toss", "").trim();
        const match = tossText.match(/(.+?)\s+opt to\s+(\w+)/i);
        if (match) {
          tossWinner = match[1].trim();
          tossChoice = match[2].trim();
        }
      }
    });

    const matchInfo = {
      id: matchId,
      name: teams.length >= 2 ? `${teams[0]} vs ${teams[1]}` : teams[0] || "Match",
      matchType,
      status,
      venue,
      date: new Date().toLocaleDateString(),
      teams,
      teamInfo,
      score: scoreArr,
      matchStarted: true,
      matchEnded: status.toLowerCase().includes("won") || status.toLowerCase().includes("drawn"),
      tossWinner,
      tossChoice
    };

    cache.set(cacheKey, matchInfo);
    return matchInfo;
  } catch (e) {
    console.error(`Match info scrape failed for ${matchId}:`, e.message);
    return { id: matchId, name: "Match", teams: [], teamInfo: [], score: [], matchStarted: false };
  }
}

/**
 * Get Match Scorecard
 */
async function getMatchScorecard(matchId) {
  const cacheKey = `scorecard-${matchId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data: html } = await axios.get(`https://www.cricbuzz.com/live-cricket-scorecard/${matchId}`, { headers, timeout: 10000 });
    const $ = cheerio.load(html);
    const innings = [];

    // Try JSON extraction from script tags first (Cricbuzz uses Next.js with embedded JSON)
    let jsonExtracted = false;
    $("script").each((i, el) => {
      const scriptContent = $(el).html();
      if (scriptContent && scriptContent.includes('scoreCard')) {
        try {
          // The scoreCard data is embedded in the script as escaped JSON
          // Find the start of the scoreCard array (it's escaped as \\"scoreCard\\":)
          const startIdx = scriptContent.indexOf('\\"scoreCard\\":[');
          
          if (startIdx !== -1) {
            // Find the end of the scoreCard array by counting brackets
            let bracketCount = 0;
            let inArray = false;
            let endIdx = startIdx + '\\"scoreCard\\":'.length;
            
            for (let j = endIdx; j < scriptContent.length; j++) {
              const char = scriptContent[j];
              if (char === '[') {
                bracketCount++;
                inArray = true;
              } else if (char === ']') {
                bracketCount--;
                if (inArray && bracketCount === 0) {
                  endIdx = j + 1;
                  break;
                }
              }
            }
            
            // Extract the JSON string (it's escaped, so we need to unescape it)
            let jsonStr = scriptContent.substring(startIdx + '\\"scoreCard\\":'.length, endIdx);
            // Unescape the JSON string
            jsonStr = jsonStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            const scorecardData = JSON.parse(jsonStr);
            
            // Process each innings from JSON
            scorecardData.forEach(inn => {
              if (inn.batTeamDetails && inn.batTeamDetails.batsmenData) {
                const batsmen = [];
                const batsmenData = inn.batTeamDetails.batsmenData;
                
                // Extract batsmen
                Object.keys(batsmenData).forEach(key => {
                  const bat = batsmenData[key];
                  if (bat.batName) {
                    batsmen.push({
                      name: bat.batName,
                      dismissal: bat.outDesc || "not out",
                      r: String(bat.runs || 0),
                      b: String(bat.balls || 0),
                      fours: String(bat.fours || 0),
                      sixes: String(bat.sixes || 0),
                      sr: bat.strikeRate ? String(bat.strikeRate.toFixed(2)) : "0.00"
                    });
                  }
                });

                const bowlers = [];
                if (inn.bowlTeamDetails && inn.bowlTeamDetails.bowlersData) {
                  const bowlersData = inn.bowlTeamDetails.bowlersData;
                  Object.keys(bowlersData).forEach(key => {
                    const bowl = bowlersData[key];
                    if (bowl.bowlName) {
                      bowlers.push({
                        name: bowl.bowlName,
                        o: String(bowl.overs || 0),
                        m: String(bowl.maidens || 0),
                        r: String(bowl.runs || 0),
                        w: String(bowl.wickets || 0),
                        eco: bowl.economy ? String(bowl.economy.toFixed(2)) : "0.00"
                      });
                    }
                  });
                }

                const teamName = inn.batTeamDetails.batTeamName || "Team";
                const score = `${inn.scoreDetails?.runs || 0}/${inn.scoreDetails?.wickets || 0}`;
                const extras = String(inn.extrasData?.total || 0);

                innings.push({ 
                  team: teamName, 
                  score, 
                  batsmen, 
                  bowlers, 
                  extras, 
                  fow: [] 
                });
              }
            });
            
            jsonExtracted = true;
            return false; // Break the each loop
          }
        } catch (jsonErr) {
          console.log("JSON extraction attempt failed, falling back to HTML:", jsonErr.message);
        }
      }
    });

    // Fallback to HTML scraping if JSON extraction failed
    if (!jsonExtracted) {
      ["1", "2", "3", "4"].forEach(num => {
        const innDiv = $(`#innings_${num}`);
        if (innDiv.length) {
          const teamName = innDiv.find(".cb-scrd-hdr-rw .cb-col-84").first().text().split("Innings")[0].trim();
          const score = innDiv.find(".cb-scrd-hdr-rw .cb-col-16").first().text().trim();
          
          const batsmen = [];
          innDiv.find(".cb-scrd-itms").each((i, el) => {
            const row = $(el);
            const name = row.find("a.cb-text-link").first().text().trim();
            const dismissal = row.find(".text-gray").first().text().trim();
            
            if (name && !name.includes("Extras") && !name.includes("Total")) {
              const cols = row.find(".cb-col-8");
              batsmen.push({
                name,
                dismissal: dismissal || "not out",
                r: $(cols[0]).text().trim() || "0",
                b: $(cols[1]).text().trim() || "0",
                fours: $(cols[2]).text().trim() || "0",
                sixes: $(cols[3]).text().trim() || "0",
                sr: $(cols[4]).text().trim() || "0.00"
              });
            }
          });

          const bowlers = [];
          innDiv.find(".cb-ltst-wgt-hdr:contains('Bowling')").parent().find(".cb-scrd-itms").each((i, el) => {
            const row = $(el);
            const name = row.find("a.cb-text-link").first().text().trim();
            if (name) {
              const cols = row.find(".cb-col-8");
              bowlers.push({
                name,
                o: $(cols[0]).text().trim() || "0",
                m: $(cols[1]).text().trim() || "0",
                r: $(cols[2]).text().trim() || "0",
                w: $(cols[3]).text().trim() || "0",
                eco: $(cols[4]).text().trim() || "0.00"
              });
            }
          });

          let extras = "0";
          innDiv.find(".cb-scrd-itms").each((i, el) => {
            const row = $(el);
            const label = row.find(".cb-col-32").text().trim();
            if (label.includes("Extras")) {
              extras = row.find(".cb-col-8").first().text().trim() || "0";
            }
          });

          const fow = [];
          innDiv.find(".cb-col-100:contains('Fall of wickets')").each((i, el) => {
            const fowText = $(el).text().replace("Fall of wickets:", "").trim();
            if (fowText) fow.push(fowText);
          });

          if (batsmen.length > 0) {
            innings.push({ 
              team: teamName, 
              score, 
              batsmen, 
              bowlers, 
              extras, 
              fow 
            });
          }
        }
      });
    }

    const scorecard = { innings };
    cache.set(cacheKey, scorecard);
    console.log(`Scraped scorecard for ${matchId}: ${innings.length} innings (JSON: ${jsonExtracted})`);
    return scorecard;
  } catch (e) {
    console.error(`Scorecard scrape failed for ${matchId}:`, e.message);
    return { innings: [] };
  }
}

/**
 * Serve Static Metadata
 */
function serveMeta(url, res) {
  if (url.includes("sitemap.xml")) {
    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.livecricketzone.com/</loc></url></urlset>`);
  }
  if (url.includes("robots.txt")) {
    res.setHeader("Content-Type", "text/plain");
    return res.status(200).send("User-agent: *\nAllow: /");
  }
  return false;
}

/**
 * Main Vercel Entry Point
 */
module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (serveMeta(req.url, res)) return;

  // Extraction of path even if Vercel rewrites it to /api/index
  const fullUrl = req.url || "";
  const queryPath = req.query && req.query.path;
  const path = queryPath || fullUrl.split("?")[0].replace("/api/", "").replace("/", "").replace("index.js", "").replace(/^\/+|\/+$/g, "");
  const parts = path.split("/").filter(Boolean);

  try {
    if (path === "health") {
      return res.json({ status: "ok", mode: "Scale Up Enterprise", dependencyFree: true });
    }

    if (path === "news") {
      const data = await getNews();
      console.log(`[API] News endpoint: ${data.length} items`);
      return res.json({ status: "success", data });
    }

    if (path === "matches/live" || path === "matches/current") {
      const data = await getLiveMatches();
      console.log(`[API] Live matches endpoint: ${data.length} matches`);
      return res.json({ status: "success", data });
    }

    if (path === "matches/upcoming" || path === "schedule") {
       // Simplified upcoming for Vercel
       console.log(`[API] Schedule endpoint called`);
       return res.json({ status: "success", data: [] });
    }

    // Match scorecard endpoint
    if (parts[0] === "matches" && parts[2] === "scorecard") {
      const matchId = parts[1];
      const data = await getMatchScorecard(matchId);
      console.log(`[API] Scorecard for match ${matchId}: ${data.innings?.length || 0} innings`);
      return res.json({ status: "success", data });
    }

    // Match info endpoint
    if (parts[0] === "matches" && parts[1] && !parts[2]) {
      const matchId = parts[1];
      const data = await getMatchInfo(matchId);
      console.log(`[API] Match info for ${matchId}`);
      return res.json({ status: "success", data });
    }

    // Fallback search rankings etc.
    if (path === "rankings" || path === "teams") {
       console.log(`[API] ${path} endpoint called`);
       return res.json({ status: "success", data: [] });
    }

    console.log(`[API] Unknown endpoint: ${path}`);
    return res.json({ 
      status: "success", 
      data: [], 
      info: `Vercel Endpoint Active (${path})`,
      mode: "Enterprise Scraper"
    });

  } catch (error) {
    console.error(`[API Error] ${error.message}`, error.stack);
    res.status(500).json({ status: "error", message: error.message });
  }
};
