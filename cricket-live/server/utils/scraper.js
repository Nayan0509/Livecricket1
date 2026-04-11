const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

const scrapeCache = new NodeCache({ stdTTL: 30 });
const staticCache = new NodeCache({ stdTTL: 3600 });

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Connection": "keep-alive",
};

/**
 * ENHANCEMENTS IMPLEMENTED:
 * 
 * 1. VENUE INFORMATION:
 *    - Live matches now include venue details extracted from Cricbuzz
 *    - Match info includes venue and venueCity fields
 *    - Upcoming matches include venue information
 * 
 * 2. TEAM DETAILS:
 *    - Enhanced team info with proper short names (IND, AUS, ENG, etc.)
 *    - Team images/flags URLs included
 *    - Support for international teams and IPL franchises
 * 
 * 3. RECENT NEWS (2-3 DAYS):
 *    - News filtered to show only items from last 2-3 days
 *    - Multi-source aggregation (Google News + Cricbuzz)
 *    - Duplicate removal by title similarity
 *    - Includes metadata: daysAgo, hoursAgo, publishedAt
 *    - Sorted by most recent first
 * 
 * 4. ADDITIONAL IMPROVEMENTS:
 *    - Toss information extraction (winner and choice)
 *    - Better date/time handling with ISO timestamps
 *    - Enhanced error handling and logging
 *    - Backward compatible with existing API structure
 */

/**
 * Get team image URL - uses reliable Cricbuzz CDN or fallback
 */
function getTeamImageUrl(teamName) {
  if (!teamName) return null;
  
  // Map team names to their Cricbuzz team IDs
  const teamIdMap = {
    // International Teams
    "India": "2",
    "Australia": "4",
    "England": "1",
    "Pakistan": "7",
    "South Africa": "3",
    "New Zealand": "5",
    "West Indies": "10",
    "Sri Lanka": "6",
    "Bangladesh": "8",
    "Afghanistan": "96",
    "Zimbabwe": "9",
    "Ireland": "29",
    "Netherlands": "15",
    "Scotland": "30",
    
    // IPL Teams
    "Mumbai Indians": "62",
    "Chennai Super Kings": "59",
    "Royal Challengers Bangalore": "64",
    "Kolkata Knight Riders": "63",
    "Delhi Capitals": "61",
    "Punjab Kings": "65",
    "Rajasthan Royals": "66",
    "Sunrisers Hyderabad": "255",
    "Gujarat Titans": "971",
    "Lucknow Super Giants": "966"
  };
  
  const teamId = teamIdMap[teamName];
  if (teamId) {
    return `https://static.cricbuzz.com/a/img/v1/75x75/i1/c${teamId}/team_flag.jpg`;
  }
  
  // Fallback: return null to let UI handle placeholder
  return null;
}

/**
 * Get team short name with comprehensive mapping
 */
function getTeamShortName(teamName) {
  if (!teamName) return "TBD";
  
  const shortNameMap = {
    // International Teams
    "India": "IND",
    "Australia": "AUS",
    "England": "ENG",
    "Pakistan": "PAK",
    "South Africa": "SA",
    "New Zealand": "NZ",
    "West Indies": "WI",
    "Sri Lanka": "SL",
    "Bangladesh": "BAN",
    "Afghanistan": "AFG",
    "Zimbabwe": "ZIM",
    "Ireland": "IRE",
    "Netherlands": "NED",
    "Scotland": "SCO",
    "Nepal": "NEP",
    "Oman": "OMA",
    "UAE": "UAE",
    "USA": "USA",
    "Canada": "CAN",
    "Namibia": "NAM",
    "Papua New Guinea": "PNG",
    
    // IPL Teams
    "Mumbai Indians": "MI",
    "Chennai Super Kings": "CSK",
    "Royal Challengers Bangalore": "RCB",
    "Kolkata Knight Riders": "KKR",
    "Delhi Capitals": "DC",
    "Punjab Kings": "PBKS",
    "Rajasthan Royals": "RR",
    "Sunrisers Hyderabad": "SRH",
    "Gujarat Titans": "GT",
    "Lucknow Super Giants": "LSG",
    
    // Other Leagues
    "Sydney Sixers": "SIX",
    "Melbourne Stars": "STA",
    "Perth Scorchers": "SCO",
    "Adelaide Strikers": "STR",
    "Brisbane Heat": "HEA",
    "Hobart Hurricanes": "HUR",
    "Melbourne Renegades": "REN",
    "Sydney Thunder": "THU"
  };
  
  return shortNameMap[teamName] || teamName.slice(0, 3).toUpperCase();
}
/**
 * Parse score string from Cricbuzz
 */
function parseScore(scoreStr) {
  if (!scoreStr) return { r: 0, w: 0, o: 0 };
  const rMatch = scoreStr.match(/(\d+)([\-\/](\d+))?/);
  // Match overs in parentheses: (20) or (20.4) or (20 ov)
  const oMatch = scoreStr.match(/\((\d+(\.\d+)?)\s*(ov)?\)/);
  
  return {
    r: rMatch ? parseInt(rMatch[1]) : 0,
    w: rMatch && rMatch[3] ? parseInt(rMatch[3]) : 0,
    o: oMatch ? parseFloat(oMatch[1]) : 0
  };
}

/**
 * Get Match Info (uses live matches data or scrapes)
 * Pure scraping - extract exactly from Cricbuzz HTML structure
 */
async function scrapeMatchInfo(matchId) {
  const cacheKey = `cricbuzz:matchinfo:${matchId}`;
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    // First try full JSON-based all-matches (live + recent + upcoming)
    const allData = await scrapeCricbuzzAllMatches();
    const allMatches = [...(allData.live || []), ...(allData.recent || []), ...(allData.upcoming || [])];
    const foundMatch = allMatches.find(m => m.id === matchId || m.id === String(matchId));

    if (foundMatch) {
      // Enrich teamInfo with images if missing
      if (foundMatch.teamInfo) {
        foundMatch.teamInfo = foundMatch.teamInfo.map(t => ({
          ...t,
          img: t.img || getTeamImageUrl(t.name),
          shortname: t.shortname || getTeamShortName(t.name)
        }));
      }
      scrapeCache.set(cacheKey, foundMatch);
      return foundMatch;
    }

    // If not found in all-matches, scrape the match page directly
    const { data } = await axios.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`, { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    
    // Extract match title from Cricbuzz
    const matchTitle = $(".cb-nav-hdr.cb-font-18").first().text().trim();
    
    // Extract status from Cricbuzz
    const status = $(".cb-text-complete, .cb-text-live, .cb-text-stumps, .cb-text-preview").first().text().trim() || "Scheduled";
    
    // Extract venue from Cricbuzz
    const venueText = $(".cb-nav-subhdr.cb-font-12").text().trim();
    const venueParts = venueText.split(",");
    const venue = venueParts[0]?.replace(/^at\s+/i, '').trim() || "Venue TBA";
    const venueCity = venueParts[1]?.trim() || "";
    
    // Extract teams from Cricbuzz match title
    const teams = [];
    const teamInfo = [];
    const vsMatch = matchTitle.match(/(.+?)\s+vs\s+(.+?)(?:,|$)/i);
    if (vsMatch) {
      const team1Name = vsMatch[1].trim();
      const team2Name = vsMatch[2].trim();
      teams.push(team1Name, team2Name);
      
      teamInfo.push(
        { name: team1Name, shortname: getTeamShortName(team1Name), img: getTeamImageUrl(team1Name) },
        { name: team2Name, shortname: getTeamShortName(team2Name), img: getTeamImageUrl(team2Name) }
      );
    }
    
    // Extract match type from Cricbuzz
    const matchType = matchTitle.split(",")[1]?.trim() || "Match";
    
    // Extract toss from Cricbuzz
    let tossWinner = "";
    let tossChoice = "";
    const tossText = $(".cb-text-preview, .cb-text-complete, .cb-text-live").text();
    const tossMatch = tossText.match(/(.+?)\s+won\s+the\s+toss\s+and\s+(?:chose|elected)\s+to\s+(bat|bowl)/i);
    if (tossMatch) {
      tossWinner = tossMatch[1].trim();
      tossChoice = tossMatch[2].toLowerCase();
    }
    
    // Extract scores from Cricbuzz
    const score = [];
    $(".cb-col.cb-col-100.cb-ltst-wgt-hdr").each((i, el) => {
      const teamName = $(el).find(".cb-col-84").text().trim();
      const scoreText = $(el).find(".cb-col-16").text().trim();
      if (teamName && scoreText) {
        const runsMatch = scoreText.match(/(\d+)\/(\d+)/);
        const oversMatch = scoreText.match(/\((\d+(?:\.\d+)?)\)/);
        if (runsMatch) {
          score.push({
            r: parseInt(runsMatch[1]),
            w: parseInt(runsMatch[2]),
            o: oversMatch ? parseFloat(oversMatch[1]) : 0,
            inning: teamName,
            team: teamName,
            score: scoreText
          });
        }
      }
    });

    const matchInfo = {
      id: matchId,
      name: teams.length >= 2 ? `${teams[0]} vs ${teams[1]}` : matchTitle || "Match",
      matchType,
      status,
      venue,
      venueCity,
      date: new Date().toLocaleDateString(),
      dateTimeGMT: new Date().toISOString(),
      teams,
      teamInfo,
      score,
      matchStarted: status.toLowerCase().includes("live") || status.toLowerCase().includes("innings") || status.toLowerCase().includes("stumps") || status.toLowerCase().includes("need"),
      matchEnded: status.toLowerCase().includes("won") || status.toLowerCase().includes("drawn"),
      tossWinner,
      tossChoice
    };

    scrapeCache.set(cacheKey, matchInfo);
    return matchInfo;
  } catch (err) {
    console.error(`Match info scrape failed for ${matchId}:`, err.message);
    return { 
      id: matchId, 
      name: "Match", 
      teams: [], 
      teamInfo: [], 
      score: [], 
      venue: "Venue TBA",
      matchStarted: false 
    };
  }
}

/**
 * Get ALL matches from Cricbuzz (Live, Recent, Upcoming)
 * Uses URL structure for reliable team extraction
 */
async function scrapeCricbuzzAllMatches() {
  const cacheKey = "cricbuzz:all";
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", { headers, timeout: 10000 });
    
    const result = {
      live: [],
      recent: [],
      upcoming: []
    };

    // Extract next.js state json
    const plainText = data.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    const typeMatchesIndex = plainText.indexOf('"typeMatches":[');
    
    if (typeMatchesIndex > -1) {
      let brackets = 0;
      let startIdx = typeMatchesIndex + 14; 
      let endIdx = -1;
      const chars = plainText.split('');
      
      for (let i = startIdx; i < chars.length; i++) {
         if (chars[i] === '[') brackets++;
         if (chars[i] === ']') {
            brackets--;
            if (brackets === 0) {
                endIdx = i;
                break;
            }
         }
      }
      
      if (endIdx > -1) {
         try {
           const jsonStr = plainText.substring(startIdx, endIdx + 1);
           const typeMatches = JSON.parse(jsonStr);
           
           typeMatches.forEach(typeMatch => {
              // category matching
              // typeMatch.matchType is usually "International", "League", "Domestic", "Women"
              if (typeMatch.seriesMatches) {
                 typeMatch.seriesMatches.forEach(series => {
                    const s = series.seriesAdWrapper || series;
                    if (s.matches) {
                       s.matches.forEach(matchObj => {
                          const info = matchObj.matchInfo;
                          const score = matchObj.matchScore;
                          
                          if (!info) return;

                          let category = "live";
                          const st = (info.state || "").toLowerCase();
                          const fallbackStatus = (info.status || "").toLowerCase();
                          
                          if (st === "preview" || st === "upcoming") {
                              category = "upcoming";
                          } else if (st === "complete" || st === "recent" || fallbackStatus.includes("won") || fallbackStatus.includes("drawn") || fallbackStatus.includes("tied") || fallbackStatus.includes("abandoned") || fallbackStatus.includes("no result")) {
                              category = "recent";
                          } else {
                              // Including 'stumps', 'inprogress', 'tea', 'lunch'
                              category = "live";
                          }

                          // Construct proper scores array
                          const scoreArr = [];
                          if (score) {
                             if (score.team1Score && score.team1Score.inngs1) {
                                scoreArr.push({
                                  r: score.team1Score.inngs1.runs || 0,
                                  w: score.team1Score.inngs1.wickets || 0,
                                  o: score.team1Score.inngs1.overs || 0,
                                  inning: `${info.team1.teamSName} INN 1`
                                });
                             }
                             if (score.team2Score && score.team2Score.inngs1) {
                                scoreArr.push({
                                  r: score.team2Score.inngs1.runs || 0,
                                  w: score.team2Score.inngs1.wickets || 0,
                                  o: score.team2Score.inngs1.overs || 0,
                                  inning: `${info.team2.teamSName} INN 1`
                                });
                             }
                          }

                          let matchDate = new Date();
                          if (info.startDate) {
                             const parseAttempt = new Date(Number(info.startDate));
                             if (!isNaN(parseAttempt.getTime())) {
                                matchDate = parseAttempt;
                             }
                          }

                          const formattedMatch = {
                            id: info.matchId ? info.matchId.toString() : Math.random().toString(),
                            name: info.team1 && info.team2 ? `${info.team1.teamName} vs ${info.team2.teamName}` : "Match",
                            matchType: info.matchFormat || "Match",
                            status: info.status || info.state || "Scheduled",
                            venue: info.venueInfo ? `${info.venueInfo.ground}, ${info.venueInfo.city}` : "",
                            date: matchDate.toLocaleDateString(),
                            dateTimeGMT: matchDate.toISOString(),
                            teams: info.team1 && info.team2 ? [info.team1.teamName, info.team2.teamName] : ["TBA", "TBA"],
                            teamInfo: info.team1 && info.team2 ? [
                              { name: info.team1.teamName, shortname: info.team1.teamSName },
                              { name: info.team2.teamName, shortname: info.team2.teamSName }
                            ] : [],
                            score: scoreArr,
                            matchStarted: category !== "upcoming",
                            matchEnded: category === "recent",
                            source: "cricbuzz",
                            url: info.matchId ? `https://www.cricbuzz.com/live-cricket-scores/${info.matchId}` : ""
                          };
                          
                          result[category].push(formattedMatch);
                       });
                    }
                 });
              }
           });
           
           scrapeCache.set(cacheKey, result);
           return result;
           
         } catch(e) {
           console.error("JSON PARSE ERROR", e.message);
         }
      }
    }
    
    return result;
  } catch (err) { 
    console.error("All matches scrape error:", err.message);
    return { live: [], recent: [], upcoming: [] };
  }
}

/**
 * LIVE MATCHES - Cricbuzz Scraper
 * Pure scraping - extract EXACTLY from Cricbuzz HTML as-is
 */
async function scrapeCricbuzzLiveMatches() {
  const cacheKey = "cricbuzz:live";
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const matches = [];

    $("a[href^='/live-cricket-scores/']").each((i, elem) => {
      const $card = $(elem);
      const url = $card.attr("href");
      const id = url ? url.split("/")[2] : `cb-${i}`;
      
      // Get the full text from Cricbuzz - it's in a simple span
      const fullText = $card.find("span").first().text().trim();
      
      // Cricbuzz format: "TEAM1 vs TEAM2 - Status" or "TEAM1 123/4 vs TEAM2 - Status"
      const parts = fullText.split(" - ");
      const matchPart = parts[0] || "";
      const status = parts[1] || "Scheduled";
      
      // Extract teams from "TEAM1 vs TEAM2" format
      const teams = [];
      const teamInfo = [];
      const scoreArr = [];
      
      const vsMatch = matchPart.match(/^([A-Z]{2,5})\s+vs\s+([A-Z]{2,5})/);
      if (vsMatch) {
        const team1Short = vsMatch[1];
        const team2Short = vsMatch[2];
        
        // Map short names to full names
        const shortToFull = {
          "IND": "India", "AUS": "Australia", "ENG": "England", "PAK": "Pakistan",
          "SA": "South Africa", "NZ": "New Zealand", "WI": "West Indies",
          "SL": "Sri Lanka", "BAN": "Bangladesh", "AFG": "Afghanistan",
          "ZIM": "Zimbabwe", "IRE": "Ireland", "NED": "Netherlands",
          "MI": "Mumbai Indians", "CSK": "Chennai Super Kings", "RCB": "Royal Challengers Bangalore",
          "KKR": "Kolkata Knight Riders", "DC": "Delhi Capitals", "PBKS": "Punjab Kings",
          "RR": "Rajasthan Royals", "SRH": "Sunrisers Hyderabad", "GT": "Gujarat Titans",
          "LSG": "Lucknow Super Giants"
        };
        
        const team1Name = shortToFull[team1Short] || team1Short;
        const team2Name = shortToFull[team2Short] || team2Short;
        
        teams.push(team1Name, team2Name);
        teamInfo.push(
          { name: team1Name, shortname: team1Short, img: getTeamImageUrl(team1Name) },
          { name: team2Name, shortname: team2Short, img: getTeamImageUrl(team2Name) }
        );
      }
      
      // Extract scores if present (format: "TEAM1 123/4 (20) vs TEAM2 100/5 (18)")
      const scoreMatches = matchPart.matchAll(/(\d+)\/(\d+)\s*\((\d+(?:\.\d+)?)\)/g);
      let scoreIndex = 0;
      for (const match of scoreMatches) {
        if (teams[scoreIndex]) {
          scoreArr.push({
            r: parseInt(match[1]),
            w: parseInt(match[2]),
            o: parseFloat(match[3]),
            inning: teams[scoreIndex]
          });
          scoreIndex++;
        }
      }
      
      // Get match type and venue from parent or sibling elements
      const matchType = "Match";
      const venue = "";

      if (teams.length >= 2) {
        const statusLower = status.toLowerCase();
        
        matches.push({
          id,
          name: `${teams[0]} vs ${teams[1]}`,
          matchType,
          status,
          venue,
          date: new Date().toLocaleDateString(),
          dateTimeGMT: new Date().toISOString(),
          teams,
          teamInfo,
          score: scoreArr,
          matchStarted: !statusLower.includes("preview"),
          matchEnded: statusLower.includes("won") || statusLower.includes("drawn") || statusLower.includes("tied") || statusLower.includes("abandoned"),
          source: "cricbuzz",
          url: `https://www.cricbuzz.com${url}`
        });
      }
    });

    scrapeCache.set(cacheKey, matches);
    return matches;
  } catch (err) { 
    console.error("Live matches scrape error:", err.message);
    return []; 
  }
}

/**
 * NEWS - Google News RSS (Very Reliable)
 * Enhanced with 2-3 days filter and better metadata
 */
async function getNewsFromGoogle() {
  const cacheKey = "news:google";
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const rssUrl = "https://news.google.com/rss/search?q=cricket+match+IPL+T20+World+Cup&hl=en-IN&gl=IN&ceid=IN:en";
    const { data } = await axios.get(rssUrl, { timeout: 10000 });
    const $ = cheerio.load(data, { xmlMode: true });
    
    const news = [];
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
    
    $("item").each((i, el) => {
      if (i >= 50) return; // Process more items to ensure we get enough recent ones
      
      const title = $(el).find("title").text();
      const link = $(el).find("link").text();
      const pubDate = $(el).find("pubDate").text();
      const source = $(el).find("source").text();
      const description = $(el).find("description").text().replace(/<[^>]*>?/gm, "").split(" - ")[0];
      
      const publishedDate = new Date(pubDate);
      
      // Filter: Only include news from last 2-3 days
      if (publishedDate >= threeDaysAgo) {
        news.push({
          id: link,
          title,
          description: description || title,
          date: publishedDate.toLocaleDateString(),
          source: source || "Google News",
          url: link,
          publishedAt: publishedDate.toISOString(),
          daysAgo: Math.floor((now - publishedDate) / (1000 * 60 * 60 * 24)),
          hoursAgo: Math.floor((now - publishedDate) / (1000 * 60 * 60))
        });
      }
    });
    
    // Sort by most recent first
    news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    scrapeCache.set(cacheKey, news);
    return news;
  } catch (err) {
    console.error("Google News RSS failed:", err.message);
    return [];
  }
}

/**
 * NEWS - Cricbuzz Latest News Scraper (Backup/Additional Source)
 * Scrapes latest cricket news directly from Cricbuzz
 */
async function scrapeCricbuzzNews() {
  const cacheKey = "news:cricbuzz";
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-news/latest-news", { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const news = [];
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

    $(".cb-nws-lst-rt").each((i, el) => {
      if (i >= 30) return;
      
      const $item = $(el);
      const title = $item.find(".cb-nws-hdln a").text().trim();
      const url = $item.find(".cb-nws-hdln a").attr("href");
      const description = $item.find(".cb-nws-intr").text().trim();
      const timeText = $item.find(".cb-nws-time").text().trim();
      
      if (title && url) {
        // Parse relative time (e.g., "2 hours ago", "1 day ago")
        let publishedDate = now;
        const hoursMatch = timeText.match(/(\d+)\s*hour/i);
        const daysMatch = timeText.match(/(\d+)\s*day/i);
        
        if (hoursMatch) {
          publishedDate = new Date(now.getTime() - (parseInt(hoursMatch[1]) * 60 * 60 * 1000));
        } else if (daysMatch) {
          publishedDate = new Date(now.getTime() - (parseInt(daysMatch[1]) * 24 * 60 * 60 * 1000));
        }
        
        // Filter: Only include news from last 2-3 days
        if (publishedDate >= threeDaysAgo) {
          news.push({
            id: `https://www.cricbuzz.com${url}`,
            title,
            description: description || title,
            date: publishedDate.toLocaleDateString(),
            source: "Cricbuzz",
            url: `https://www.cricbuzz.com${url}`,
            publishedAt: publishedDate.toISOString(),
            daysAgo: Math.floor((now - publishedDate) / (1000 * 60 * 60 * 24)),
            hoursAgo: Math.floor((now - publishedDate) / (1000 * 60 * 60)),
            timeText
          });
        }
      }
    });

    scrapeCache.set(cacheKey, news);
    return news;
  } catch (err) {
    console.error("Cricbuzz news scrape failed:", err.message);
    return [];
  }
}

/**
 * Combined News Fetcher with Fallback
 * Merges Google News and Cricbuzz news, removes duplicates, filters by date
 */
async function getNewsWithFallback() {
  try {
    const [googleNews, cricbuzzNews] = await Promise.all([
      getNewsFromGoogle(),
      scrapeCricbuzzNews()
    ]);
    
    // Merge and deduplicate by title similarity
    const allNews = [...googleNews, ...cricbuzzNews];
    const uniqueNews = [];
    const seenTitles = new Set();
    
    for (const item of allNews) {
      const normalizedTitle = item.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueNews.push(item);
      }
    }
    
    // Sort by most recent
    uniqueNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    
    return uniqueNews;
  } catch (err) {
    console.error("News fetch error:", err.message);
    return [];
  }
}

/**
 * UPCOMING MATCHES - Cricbuzz
 * Enhanced with venue information
 */
async function scrapeUpcomingMatches() {
  const cacheKey = "cricbuzz:upcoming";
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-schedule/upcoming-series/international", { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const items = [];
    
    $(".cb-lv-scdl-itm").each((i, el) => {
      const $item = $(el);
      const name = $item.find(".cb-lv-scdl-info a").text().trim();
      const date = $item.find(".cb-lv-scdl-date").text().trim();
      const venue = $item.find(".cb-lv-scdl-venue").text().trim() || "Venue TBA";
      const matchType = $item.find(".cb-lv-scdl-type").text().trim() || "International";
      
      if (name) {
        // Extract teams from match name
        const teams = [];
        const teamInfo = [];
        const vsMatch = name.match(/(.+?)\s+vs\s+(.+?)(?:,|$)/i);
        
        if (vsMatch) {
          const team1 = vsMatch[1].trim();
          const team2 = vsMatch[2].trim();
          teams.push(team1, team2);
          
          teamInfo.push(
            { name: team1, shortname: getTeamShortName(team1), img: getTeamImageUrl(team1) },
            { name: team2, shortname: getTeamShortName(team2), img: getTeamImageUrl(team2) }
          );
        }
        
        items.push({ 
          id: `up-${i}`, 
          name, 
          date, 
          venue,
          matchType,
          teams,
          teamInfo,
          status: "Scheduled", 
          matchStarted: false, 
          matchEnded: false 
        });
      }
    });
    
    scrapeCache.set(cacheKey, items);
    return items;
  } catch (err) { 
    console.error("Upcoming matches scrape error:", err.message);
    return []; 
  }
}

/**
 * RANKINGS - Cricbuzz
 * category: "men" | "women"
 * type: "batting" | "bowling" | "all-rounders" | "teams"
 */
async function scrapeRankings(category = "men", type = "batting", format = "tests") {
  const cacheKey = `cricbuzz:rankings:${category}:${type}:${format}`;
  const cached = staticCache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://www.cricbuzz.com/cricket-stats/icc-rankings/${category}/${type}`;
    const { data } = await axios.get(url, { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    const ranks = [];
    
    $(".cb-col-100.cb-padding-left0").each((i, el) => {
      const heading = $(el).find("h3").text().toLowerCase();
      if (heading.includes(format.toLowerCase().replace("t20s", "t20"))) {
        $(el).find(".cb-col-100.cb-font-14").each((j, row) => {
          const $row = $(row);
          if (type === "teams") {
            const name = $row.find(".cb-col-67").text().trim();
            if (name) {
              ranks.push({
                rank: $row.find(".cb-col-16").first().text().trim(),
                name,
                rating: $row.find(".cb-col-17").first().text().trim(),
                points: $row.find(".cb-history-intro").text().trim()
              });
            }
          } else {
            const name = $row.find(".cb-col-67 a").first().text().trim();
            if (name) {
              ranks.push({
                rank: $row.find(".cb-col-16").first().text().trim(),
                name,
                country: $row.find(".cb-col-67 .cb-font-12").first().text().trim() || "INTL",
                rating: $row.find(".cb-col-17").first().text().trim()
              });
            }
          }
        });
      }
    });
    staticCache.set(cacheKey, ranks);
    return ranks;
  } catch (err) { return []; }
}

/**
 * TEAMS - Cricbuzz
 */
async function scrapeCricbuzzTeams() {
  const cacheKey = "cricbuzz:teams";
  const cached = staticCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get("https://www.cricbuzz.com/cricket-team", { headers });
    const $ = cheerio.load(data);
    const teams = {
      international: [],
      domestic: [],
      league: [],
      women: []
    };

    const sections = $(".cb-col-100.cb-col.cb-padding-left0");
    sections.each((i, section) => {
      const headerText = $(section).find("h1, h2, .cb-font-18").text().toLowerCase().trim();
      let cat = null;
      if (headerText.includes("test teams") || headerText.includes("international")) cat = "international";
      else if (headerText.includes("domestic")) cat = "domestic";
      else if (headerText.includes("league")) cat = "league";
      else if (headerText.includes("women")) cat = "women";

      if (cat) {
        $(section).find("a[href^='/cricket-team/']").each((j, el) => {
          const name = $(el).text().trim();
          const url = $(el).attr("href");
          if (name) {
            const id = url.split("/").filter(Boolean).pop();
            teams[cat].push({
              id,
              name,
              url: `https://www.cricbuzz.com${url}`,
              img: `https://static.cricbuzz.com/a/img/v1/72x72/i1/c${id}/team-flag.jpg`
            });
          }
        });
      }
    });

    staticCache.set(cacheKey, teams);
    return teams;
  } catch (err) { return { international: [], domestic: [], league: [], women: [] }; }
}


/**
 * Universal Scale Up Fetcher
 */
async function getScaledData(type, params = {}) {
  switch (type) {
    case "liveMatches":
      return { status: "success", data: await scrapeCricbuzzLiveMatches() };
    case "upcomingMatches":
    case "matches":
      const matches = await scrapeUpcomingMatches();
      return { status: "success", data: matches };
    case "news":
      const news = await getNewsFromGoogle();
      return { status: "success", data: news };
    case "rankings":
      const ranks = await scrapeRankings(params.type, params.format);
      return { status: "success", data: ranks };
    case "series":
      try {
        const { data } = await axios.get("https://www.cricbuzz.com/cricket-series", { headers });
        const $ = cheerio.load(data);
        const res = {
          international: [],
          domestic: [],
          league: [],
          women: []
        };
        
        let currentCat = "international";
        $(".cb-col-100.cb-col").each((i, el) => {
          const header = $(el).find(".cb-font-18").text().trim().toLowerCase();
          if (header.includes("international")) currentCat = "international";
          else if (header.includes("domestic")) currentCat = "domestic";
          else if (header.includes("league")) currentCat = "league";
          else if (header.includes("women")) currentCat = "women";

          $(el).find(".cb-sch-lst-itm").each((j, item) => {
            const name = $(item).find("a").text().trim();
            const date = $(item).find(".text-gray").text().trim();
            const url = $(item).find("a").attr("href");
            if (name) {
              res[currentCat].push({
                id: url ? url.split("/")[2] : `s-${i}-${j}`,
                name,
                date,
                url: url ? `https://www.cricbuzz.com${url}` : null
              });
            }
          });
        });
        return { status: "success", data: res };
      } catch(e) { return { status: "success", data: { international: [], domestic: [], league: [], women: [] } }; }
    case "teams":
      return { status: "success", data: await scrapeCricbuzzTeams() };

    case "scorecard": {
        try {
          const { data: html } = await axios.get(`https://www.cricbuzz.com/live-cricket-scorecard/${params.id}`, { headers, timeout: 10000 });
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
                const teamName = innDiv.find(".cb-scrd-hdr").text().split("Innings")[0].trim();
                const score = innDiv.find(".cb-scrd-hdr .text-bold").text().trim();
                
                const batsmen = [];
                innDiv.find(".cb-scrd-itms").each((i, el) => {
                  const row = $(el);
                  const name = row.find("a.text-cbTextLink").text().trim();
                  if (name && !row.find(".cb-col-10").text().includes("Extras")) {
                    const rowData = row.find(".cb-col-8");
                    batsmen.push({
                      name,
                      dismissal: row.find(".cb-font-12.text-gray").text().trim(),
                      r: $(rowData[0]).text().trim(),
                      b: $(rowData[1]).text().trim(),
                      fours: $(rowData[2]).text().trim(),
                      sixes: $(rowData[3]).text().trim(),
                      sr: $(rowData[4]).text().trim()
                    });
                  }
                });

                const bowlers = [];
                innDiv.find(".cb-ltst-wgt-hdr:contains('Bowling')").nextAll(".cb-scrd-itms").each((i, el) => {
                   const row = $(el);
                   const name = row.find("a.text-cbTextLink").text().trim();
                   if (name) {
                     const rowData = row.find(".cb-col-8, .cb-col-10");
                     bowlers.push({
                       name,
                       o: $(rowData[0]).text().trim(),
                       m: $(rowData[1]).text().trim(),
                       r: $(rowData[2]).text().trim(),
                       w: $(rowData[3]).text().trim(),
                       eco: $(rowData[4]).text().trim()
                     });
                   }
                });

                const fow = [];
                let extras = "0";
                innDiv.find(".cb-scrd-itms").each((i, el) => {
                   const row = $(el);
                   const label = row.find(".cb-col-8").first().text().trim();
                   if (label.includes("Extras")) {
                      extras = row.find(".cb-col-10.cb-font-12.text-bold").text().trim();
                   } else if (label.includes("Fall of Wickets")) {
                      fow.push(row.find(".cb-col-92").text().trim());
                   }
                });

                if (teamName) {
                  innings.push({ team: teamName, score, batsmen, bowlers, fow, extras });
                }
              }
            });
          }

          console.log(`Scorecard for ${params.id}: ${innings.length} innings (JSON: ${jsonExtracted})`);
          return { status: "success", data: { innings } };
      } catch (e) {
        console.error("Scorecard scrape error:", e.message);
        return { status: "error", message: "Scorecard failed", data: { innings: [] } };
      }
    }
    case "match_scorecard":
    case "cricScore":
      try {
        const { data: d } = await axios.get(`https://www.cricbuzz.com/live-cricket-scores/${params.id}`, { headers });
        const $$ = cheerio.load(d);
        const innings = [];
        $$(".cb-col.cb-col-100.cb-ltst-wgt-hdr").each((i, el) => {
          const team = $$(el).find(".cb-col-84").text().trim();
          const score = $$(el).find(".cb-col-16").text().trim();
          if (team) innings.push({ ...parseScore(score), inning: team, team, score });
        });
        const scorecard = { id: params.id, status: $$(".cb-text-complete, .cb-text-live").text().trim(), score: innings, matchStarted: true };
        return { status: "success", data: type === "cricScore" ? [scorecard] : scorecard };
      } catch (e) { return { status: "error", message: "Scorecard failed" }; }
    default:
      return { status: "error", message: "Unknown" };
  }
}

/**
 * COMMENTARY - Cricbuzz Live Commentary Scraper
 * Scrapes ball-by-ball commentary from Cricbuzz
 */
async function scrapeCommentary(matchId) {
  const cacheKey = `cricbuzz:commentary:${matchId}`;
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(
      `https://www.cricbuzz.com/live-cricket-scorecard/${matchId}`,
      { headers, timeout: 12000 }
    );
    const $ = cheerio.load(data);
    const commentary = [];

    // Try extracting from embedded JSON (same as scorecard approach)
    $("script").each((i, el) => {
      const scriptContent = $(el).html();
      if (scriptContent && scriptContent.includes('"commentaryList"')) {
        try {
          const startIdx = scriptContent.indexOf('\\"commentaryList\\":[');
          if (startIdx !== -1) {
            let brackets = 0;
            let inArray = false;
            let endIdx = startIdx + '\\"commentaryList\\":'.length;
            for (let j = endIdx; j < scriptContent.length; j++) {
              const char = scriptContent[j];
              if (char === '[') { brackets++; inArray = true; }
              else if (char === ']') {
                brackets--;
                if (inArray && brackets === 0) { endIdx = j + 1; break; }
              }
            }
            let jsonStr = scriptContent.substring(startIdx + '\\"commentaryList\\":'.length, endIdx);
            jsonStr = jsonStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            const list = JSON.parse(jsonStr);
            list.forEach(c => {
              if (c.ballNbr !== undefined || c.commText) {
                commentary.push({
                  over: c.overNumber || c.overNum || "",
                  ball: c.ballNbr || "",
                  event: c.event || "default",
                  text: c.commText || "",
                  batsmanStriker: c.batsmanStriker?.batName || "",
                  bowlerStriker: c.bowlerStriker?.bowlName || "",
                  runs: c.runs || 0,
                });
              }
            });
            return false; // break
          }
        } catch (e) { /* ignore */ }
      }
    });

    // HTML fallback
    if (!commentary.length) {
      $(".cb-col.cb-col-100.cb-ltst-wgt-hdr").each((i, el) => {
        const over = $(el).find(".cb-col-8").text().trim();
        const text = $(el).find(".cb-col-84").text().trim();
        if (text) {
          commentary.push({ over, ball: "", event: "default", text, runs: 0 });
        }
      });
    }

    scrapeCache.set(cacheKey, commentary);
    return commentary;
  } catch (err) {
    console.error("Commentary scrape error:", err.message);
    return [];
  }
}

module.exports = {
  getLiveMatchesWithFallback: scrapeCricbuzzLiveMatches,
  getAllMatches: scrapeCricbuzzAllMatches,
  getNewsWithFallback,
  scrapeCricbuzzUpcoming: scrapeUpcomingMatches,
  scrapeCricbuzzSeries: async () => (await getScaledData("series")).data,
  scrapeCricbuzzRankings: scrapeRankings,
  scrapeCricbuzzTeams,
  scrapeCricbuzzScorecard: async (id) => (await getScaledData("scorecard", {id})).data,
  scrapeCricbuzzNews,
  scrapeMatchInfo,
  scrapeCommentary,
  getScaledData
};

