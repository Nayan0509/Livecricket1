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
 * Clean and parse team/score merging
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
 */
async function scrapeMatchInfo(matchId) {
  const cacheKey = `cricbuzz:matchinfo:${matchId}`;
  const cached = scrapeCache.get(cacheKey);
  if (cached) return cached;

  try {
    // First try to get from live matches
    const liveMatches = await scrapeCricbuzzLiveMatches();
    const liveMatch = liveMatches.find(m => m.id === matchId);
    
    if (liveMatch) {
      scrapeCache.set(cacheKey, liveMatch);
      return liveMatch;
    }

    // If not in live matches, scrape the match page
    const { data } = await axios.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`, { headers, timeout: 10000 });
    const $ = cheerio.load(data);
    
    // Try to extract basic info
    const matchTitle = $(".cb-nav-hdr.cb-font-18").first().text().trim();
    const status = $(".cb-text-complete, .cb-text-live, .cb-text-stumps, .cb-text-preview").first().text().trim() || "Scheduled";
    const venue = $(".cb-nav-subhdr.cb-font-12").text().trim();
    
    // Extract teams from title (e.g., "India vs Australia, 1st Test")
    const teams = [];
    const teamInfo = [];
    const vsMatch = matchTitle.match(/(.+?)\s+vs\s+(.+?),/i);
    if (vsMatch) {
      teams.push(vsMatch[1].trim(), vsMatch[2].trim());
      teamInfo.push(
        { name: vsMatch[1].trim(), shortname: vsMatch[1].trim().slice(0, 3).toUpperCase(), img: null },
        { name: vsMatch[2].trim(), shortname: vsMatch[2].trim().slice(0, 3).toUpperCase(), img: null }
      );
    }

    const matchInfo = {
      id: matchId,
      name: teams.length >= 2 ? `${teams[0]} vs ${teams[1]}` : matchTitle || "Match",
      matchType: matchTitle.split(",")[1]?.trim() || "International",
      status,
      venue,
      date: new Date().toLocaleDateString(),
      teams,
      teamInfo,
      score: [],
      matchStarted: status.toLowerCase().includes("live") || status.toLowerCase().includes("innings"),
      matchEnded: status.toLowerCase().includes("won") || status.toLowerCase().includes("drawn"),
      tossWinner: "",
      tossChoice: ""
    };

    scrapeCache.set(cacheKey, matchInfo);
    return matchInfo;
  } catch (err) {
    console.error(`Match info scrape failed for ${matchId}:`, err.message);
    return { id: matchId, name: "Match", teams: [], teamInfo: [], score: [], matchStarted: false };
  }
}

/**
 * LIVE MATCHES - Cricbuzz Scraper
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
      
      const teams = [];
      const scoreArr = [];
      const teamInfo = [];

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

    scrapeCache.set(cacheKey, matches);
    return matches;
  } catch (err) { return []; }
}

/**
 * NEWS - Google News RSS (Very Reliable)
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

    scrapeCache.set(cacheKey, news);
    return news;
  } catch (err) {
    console.error("Google News RSS failed:", err.message);
    return [];
  }
}

/**
 * UPCOMING MATCHES - Cricbuzz
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
      const name = $(el).find(".cb-lv-scdl-info a").text().trim();
      const date = $(el).find(".cb-lv-scdl-date").text().trim();
      if (name) items.push({ id: `up-${i}`, name, date, status: "Scheduled", matchStarted: false, matchEnded: false });
    });
    scrapeCache.set(cacheKey, items);
    return items;
  } catch (err) { return []; }
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

module.exports = {
  getLiveMatchesWithFallback: scrapeCricbuzzLiveMatches,
  getNewsWithFallback: getNewsFromGoogle,
  scrapeCricbuzzUpcoming: scrapeUpcomingMatches,
  scrapeCricbuzzSeries: async () => (await getScaledData("series")).data,
  scrapeCricbuzzRankings: scrapeRankings,
  scrapeCricbuzzTeams,
  scrapeCricbuzzScorecard: async (id) => (await getScaledData("scorecard", {id})).data,
  scrapeMatchInfo,
  getScaledData
};

