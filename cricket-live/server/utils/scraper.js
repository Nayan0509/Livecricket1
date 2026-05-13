const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");

const scrapeCache = new NodeCache({ stdTTL: 30 });   // 30s for live data
const staticCache = new NodeCache({ stdTTL: 3600 }); // 1h for static data
const newsCache  = new NodeCache({ stdTTL: 300 });   // 5min for news

// ─── Headers ─────────────────────────────────────────────────────────────────
// These must look like a modern browser — Cricbuzz rejects stale UAs
const htmlHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Referer": "https://www.cricbuzz.com/",
};

// JSON API headers — Cricbuzz's internal REST API
const apiHeaders = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Referer": "https://www.cricbuzz.com/",
  "x-cricbuzz-client": "ui",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTeamImageUrl(teamName) {
  if (!teamName) return null;
  const map = {
    "India": "2", "Australia": "4", "England": "1", "Pakistan": "7",
    "South Africa": "3", "New Zealand": "5", "West Indies": "10",
    "Sri Lanka": "6", "Bangladesh": "8", "Afghanistan": "96",
    "Zimbabwe": "9", "Ireland": "29", "Netherlands": "15", "Scotland": "30",
    "Nepal": "307", "Oman": "1100110", "UAE": "299", "USA": "395",
    "Mumbai Indians": "62", "Chennai Super Kings": "59",
    "Royal Challengers Bengaluru": "64", "Royal Challengers Bangalore": "64",
    "Kolkata Knight Riders": "63", "Delhi Capitals": "61",
    "Punjab Kings": "65", "Rajasthan Royals": "66",
    "Sunrisers Hyderabad": "255", "Gujarat Titans": "971",
    "Lucknow Super Giants": "966",
  };
  const id = map[teamName];
  return id ? `https://static.cricbuzz.com/a/img/v1/75x75/i1/c${id}/team_flag.jpg` : null;
}

function getTeamShortName(n) {
  if (!n) return "TBD";
  const m = {
    "India":"IND","Australia":"AUS","England":"ENG","Pakistan":"PAK",
    "South Africa":"SA","New Zealand":"NZ","West Indies":"WI","Sri Lanka":"SL",
    "Bangladesh":"BAN","Afghanistan":"AFG","Zimbabwe":"ZIM","Ireland":"IRE",
    "Netherlands":"NED","Scotland":"SCO","Nepal":"NEP","Oman":"OMA","UAE":"UAE",
    "USA":"USA","Canada":"CAN","Namibia":"NAM","Papua New Guinea":"PNG",
    "Mumbai Indians":"MI","Chennai Super Kings":"CSK",
    "Royal Challengers Bengaluru":"RCB","Royal Challengers Bangalore":"RCB",
    "Kolkata Knight Riders":"KKR","Delhi Capitals":"DC","Punjab Kings":"PBKS",
    "Rajasthan Royals":"RR","Sunrisers Hyderabad":"SRH",
    "Gujarat Titans":"GT","Lucknow Super Giants":"LSG",
    "Sydney Sixers":"SIX","Melbourne Stars":"STA","Perth Scorchers":"SCO",
    "Adelaide Strikers":"STR","Brisbane Heat":"HEA","Hobart Hurricanes":"HUR",
    "Melbourne Renegades":"REN","Sydney Thunder":"THU",
  };
  return m[n] || n.slice(0, 3).toUpperCase();
}

function parseScore(s) {
  if (!s) return { r: 0, w: 0, o: 0 };
  const r = s.match(/(\d+)[\/\-](\d+)/);
  const o = s.match(/\((\d+(?:\.\d+)?)\s*(?:ov)?\)/);
  return {
    r: r ? parseInt(r[1]) : 0,
    w: r ? parseInt(r[2]) : 0,
    o: o ? parseFloat(o[1]) : 0,
  };
}

/**
 * Convert Cricbuzz typeMatches JSON into { live, recent, upcoming } arrays.
 * Used by both the JSON API path and the HTML fallback path.
 */
function parseTypeMatches(typeMatches) {
  const result = { live: [], recent: [], upcoming: [] };
  if (!Array.isArray(typeMatches)) return result;

  typeMatches.forEach(tm => {
    if (!tm.seriesMatches) return;
    tm.seriesMatches.forEach(sm => {
      const wrapper = sm.seriesAdWrapper || sm;
      const seriesId = wrapper.seriesId;
      const seriesName = wrapper.seriesName || "";
      if (!wrapper.matches) return;

      wrapper.matches.forEach(matchObj => {
        const info = matchObj.matchInfo;
        const scoreData = matchObj.matchScore;
        if (!info) return;

        // Categorise
        const state = (info.state || "").toLowerCase();
        const statusText = (info.status || "").toLowerCase();
        let category = "live";
        if (state === "preview" || state === "upcoming") {
          category = "upcoming";
        } else if (
          state === "complete" || state === "recent" ||
          statusText.includes("won") || statusText.includes("drawn") ||
          statusText.includes("tied") || statusText.includes("abandoned") ||
          statusText.includes("no result")
        ) {
          category = "recent";
        }

        // Build score array
        const scoreArr = [];
        if (scoreData) {
          const addInn = (teamScore, label) => {
            if (!teamScore) return;
            ["inngs1", "inngs2"].forEach((k, i) => {
              if (teamScore[k] && teamScore[k].runs !== undefined) {
                scoreArr.push({
                  r: teamScore[k].runs || 0,
                  w: teamScore[k].wickets || 0,
                  o: teamScore[k].overs || 0,
                  inning: `${label} INN ${i + 1}`,
                });
              }
            });
          };
          addInn(scoreData.team1Score, info.team1?.teamSName || "T1");
          addInn(scoreData.team2Score, info.team2?.teamSName || "T2");
        }

        // Parse date
        let matchDate = new Date();
        if (info.startDate) {
          const d = new Date(Number(info.startDate));
          if (!isNaN(d.getTime())) matchDate = d;
        }

        const t1 = info.team1 || {};
        const t2 = info.team2 || {};
        const t1Name = t1.teamName || "TBA";
        const t2Name = t2.teamName || "TBA";

        result[category].push({
          id: String(info.matchId || Math.random()),
          name: `${t1Name} vs ${t2Name}`,
          matchType: info.matchFormat || "Match",
          series: seriesName,
          seriesId,
          status: info.status || info.state || "Scheduled",
          venue: info.venueInfo
            ? `${info.venueInfo.ground || ""}, ${info.venueInfo.city || ""}`.trim().replace(/^,|,$/g, "").trim()
            : "",
          date: matchDate.toLocaleDateString(),
          dateTimeGMT: matchDate.toISOString(),
          teams: [t1Name, t2Name],
          teamInfo: [
            { name: t1Name, shortname: t1.teamSName || getTeamShortName(t1Name), img: getTeamImageUrl(t1Name) },
            { name: t2Name, shortname: t2.teamSName || getTeamShortName(t2Name), img: getTeamImageUrl(t2Name) },
          ],
          score: scoreArr,
          matchStarted: category !== "upcoming",
          matchEnded: category === "recent",
          source: "cricbuzz",
        });
      });
    });
  });

  return result;
}

// ─── 1. ALL MATCHES (Live + Recent + Upcoming) ────────────────────────────────
async function scrapeCricbuzzAllMatches() {
  const key = "cricbuzz:all";
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  // Try Cricbuzz JSON API first (fastest, most reliable)
  try {
    const [liveRes, recentRes, upcomingRes] = await Promise.all([
      axios.get("https://www.cricbuzz.com/api/cricket-match/live",     { headers: apiHeaders, timeout: 10000 }),
      axios.get("https://www.cricbuzz.com/api/cricket-match/recent",   { headers: apiHeaders, timeout: 10000 }),
      axios.get("https://www.cricbuzz.com/api/cricket-match/upcoming", { headers: apiHeaders, timeout: 10000 }),
    ]);

    const live     = parseTypeMatches(liveRes.data?.typeMatches).live;
    const recent   = parseTypeMatches(recentRes.data?.typeMatches).recent;
    const upcoming = parseTypeMatches(upcomingRes.data?.typeMatches).upcoming;

    // If API returned nothing, recent/upcoming from live endpoint might actually have them
    // Cricbuzz sometimes puts all in /live — so also parse those buckets
    const liveParsed = parseTypeMatches(liveRes.data?.typeMatches);

    const result = {
      live:     live.length     ? live     : liveParsed.live,
      recent:   recent.length   ? recent   : liveParsed.recent,
      upcoming: upcoming.length ? upcoming : liveParsed.upcoming,
    };

    if (result.live.length || result.recent.length || result.upcoming.length) {
      scrapeCache.set(key, result);
      return result;
    }
  } catch (e) {
    console.log("Cricbuzz JSON API failed, falling back to HTML:", e.message);
  }

  // HTML fallback — extract __NEXT_DATA__ JSON from page
  try {
    const { data: html } = await axios.get(
      "https://www.cricbuzz.com/cricket-match/live-scores",
      { headers: htmlHeaders, timeout: 12000 }
    );
    const $ = cheerio.load(html);

    // Try __NEXT_DATA__ script tag first (most reliable)
    let typeMatches = null;
    const nextDataScript = $("script#__NEXT_DATA__").html();
    if (nextDataScript) {
      try {
        const nextData = JSON.parse(nextDataScript);
        typeMatches = nextData?.props?.pageProps?.appData?.typeMatches
          || nextData?.props?.pageProps?.typeMatches
          || nextData?.props?.appData?.typeMatches;
      } catch (_) {}
    }

    // Try embedded scripts (Next.js hydration)
    if (!typeMatches) {
      $("script").each((_, el) => {
        if (typeMatches) return false;
        const src = $(el).html() || "";
        if (!src.includes("typeMatches")) return;
        // Try plain JSON parse of entire script
        try {
          const parsed = JSON.parse(src);
          typeMatches = parsed?.typeMatches || parsed?.props?.pageProps?.typeMatches;
          return false;
        } catch (_) {}

        // Try regex extraction
        const idx = src.indexOf('"typeMatches":[');
        if (idx === -1) return;
        const unescaped = src.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
        const start = unescaped.indexOf('"typeMatches":[');
        if (start === -1) return;
        const arrStart = start + '"typeMatches":'.length;
        let brackets = 0, end = -1;
        for (let i = arrStart; i < unescaped.length; i++) {
          if (unescaped[i] === "[") brackets++;
          else if (unescaped[i] === "]") { brackets--; if (!brackets) { end = i + 1; break; } }
        }
        if (end === -1) return;
        try {
          typeMatches = JSON.parse(unescaped.slice(arrStart, end));
        } catch (_) {}
      });
    }

    if (typeMatches) {
      const result = parseTypeMatches(typeMatches);
      // Mix all categories from a single typeMatches (live page shows all)
      const allFromPage = parseTypeMatches(typeMatches);
      const merged = {
        live:     allFromPage.live,
        recent:   allFromPage.recent,
        upcoming: allFromPage.upcoming,
      };
      scrapeCache.set(key, merged);
      return merged;
    }
  } catch (e) {
    console.log("HTML fallback also failed:", e.message);
  }

  return { live: [], recent: [], upcoming: [] };
}

// ─── 2. LIVE MATCHES ONLY ─────────────────────────────────────────────────────
async function scrapeCricbuzzLiveMatches() {
  const key = "cricbuzz:live";
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  try {
    const { data } = await axios.get(
      "https://www.cricbuzz.com/api/cricket-match/live",
      { headers: apiHeaders, timeout: 10000 }
    );
    const parsed = parseTypeMatches(data?.typeMatches);
    // Live endpoint may include all; filter to just live
    const live = [...parsed.live];
    if (live.length) {
      scrapeCache.set(key, live);
      return live;
    }
  } catch (e) {
    console.log("Live API failed:", e.message);
  }

  // Fall back to allMatches
  const all = await scrapeCricbuzzAllMatches();
  return all.live || [];
}

// ─── 3. MATCH INFO ────────────────────────────────────────────────────────────
async function scrapeMatchInfo(matchId) {
  const key = `cricbuzz:matchinfo:${matchId}`;
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  // Try JSON API first
  try {
    const { data } = await axios.get(
      `https://www.cricbuzz.com/api/cricket-match/${matchId}/match-info`,
      { headers: apiHeaders, timeout: 10000 }
    );

    const h = data?.matchHeader || data;
    if (h && h.matchId) {
      const t1 = h.team1 || {};
      const t2 = h.team2 || {};
      const venue = h.venueInfo || {};
      const t1Name = t1.name || t1.teamName || "Team 1";
      const t2Name = t2.name || t2.teamName || "Team 2";

      const info = {
        id: String(matchId),
        name: `${t1Name} vs ${t2Name}`,
        matchType: h.matchFormat || h.matchType || "Match",
        series: h.seriesName || "",
        seriesId: h.seriesId,
        status: h.status || h.state || "Scheduled",
        venue: venue.ground ? `${venue.ground}, ${venue.city || ""}`.replace(/,\s*$/, "") : "TBA",
        date: h.matchStartTimestamp ? new Date(Number(h.matchStartTimestamp)).toLocaleDateString() : "",
        dateTimeGMT: h.matchStartTimestamp ? new Date(Number(h.matchStartTimestamp)).toISOString() : new Date().toISOString(),
        teams: [t1Name, t2Name],
        teamInfo: [
          { name: t1Name, shortname: t1.shortName || getTeamShortName(t1Name), img: t1.imageId ? `https://static.cricbuzz.com/a/img/v1/75x75/i1/c${t1.imageId}/team_flag.jpg` : getTeamImageUrl(t1Name) },
          { name: t2Name, shortname: t2.shortName || getTeamShortName(t2Name), img: t2.imageId ? `https://static.cricbuzz.com/a/img/v1/75x75/i1/c${t2.imageId}/team_flag.jpg` : getTeamImageUrl(t2Name) },
        ],
        score: [],
        matchStarted: !["preview", "upcoming", "scheduled"].includes((h.state || "").toLowerCase()),
        matchEnded: (h.state || "").toLowerCase() === "complete",
        tossWinner: h.tossResults?.tossWinnerName || "",
        tossChoice: h.tossResults?.decision || "",
      };

      // Try to also get current score from live-score endpoint
      try {
        const { data: scoreData } = await axios.get(
          `https://www.cricbuzz.com/api/cricket-match/${matchId}/live-score`,
          { headers: apiHeaders, timeout: 6000 }
        );
        const ls = scoreData?.matchScore || scoreData;
        if (ls) {
          const addInn = (teamScore, label) => {
            if (!teamScore) return;
            ["inngs1", "inngs2"].forEach((k, i) => {
              if (teamScore[k]?.runs !== undefined) {
                info.score.push({
                  r: teamScore[k].runs || 0,
                  w: teamScore[k].wickets || 0,
                  o: teamScore[k].overs || 0,
                  inning: `${label} INN ${i + 1}`,
                });
              }
            });
          };
          addInn(ls.team1Score, info.teamInfo[0]?.shortname);
          addInn(ls.team2Score, info.teamInfo[1]?.shortname);
          if (scoreData?.matchHeader?.status) info.status = scoreData.matchHeader.status;
        }
      } catch (_) {}

      scrapeCache.set(key, info);
      return info;
    }
  } catch (e) {
    console.log(`Match info JSON API failed for ${matchId}:`, e.message);
  }

  // Fall back to allMatches cache
  try {
    const allData = await scrapeCricbuzzAllMatches();
    const all = [...(allData.live || []), ...(allData.recent || []), ...(allData.upcoming || [])];
    const found = all.find(m => m.id === String(matchId));
    if (found) {
      scrapeCache.set(key, found);
      return found;
    }
  } catch (_) {}

  // Last resort: scrape match page HTML
  try {
    const { data: html } = await axios.get(
      `https://www.cricbuzz.com/live-cricket-scores/${matchId}`,
      { headers: htmlHeaders, timeout: 10000 }
    );
    const $ = cheerio.load(html);
    const title = $(".cb-nav-hdr.cb-font-18").first().text().trim();
    const status = $(".cb-text-complete, .cb-text-live, .cb-text-stumps, .cb-text-preview").first().text().trim() || "Scheduled";
    const venueRaw = $(".cb-nav-subhdr.cb-font-12").text().trim();
    const teams = [];
    const teamInfo = [];
    const vs = title.match(/(.+?)\s+vs\s+(.+?)(?:,|$)/i);
    if (vs) {
      [vs[1].trim(), vs[2].trim()].forEach(name => {
        teams.push(name);
        teamInfo.push({ name, shortname: getTeamShortName(name), img: getTeamImageUrl(name) });
      });
    }
    const result = { id: String(matchId), name: title || "Match", matchType: "Match", status, venue: venueRaw, teams, teamInfo, score: [], matchStarted: status.toLowerCase().includes("live") || status.toLowerCase().includes("innings"), matchEnded: status.toLowerCase().includes("won") };
    scrapeCache.set(key, result);
    return result;
  } catch (_) {}

  return { id: String(matchId), name: "Match", teams: [], teamInfo: [], score: [], matchStarted: false };
}

// ─── 4. COMMENTARY ───────────────────────────────────────────────────────────
async function scrapeCommentary(matchId) {
  const key = `cricbuzz:commentary:${matchId}`;
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  const normaliseEvent = (c) => {
    if (c.event) {
      const ev = String(c.event).toUpperCase();
      if (ev === "SIX" || ev === "SIXER") return "SIX";
      if (ev === "FOUR" || ev === "BOUNDARY") return "FOUR";
      if (ev === "WICKET" || ev === "OUT") return "WICKET";
      if (ev === "WIDE") return "WIDE";
      if (ev === "NO_BALL" || ev === "NOBALL") return "NO_BALL";
      return ev;
    }
    if (c.runs === 6) return "SIX";
    if (c.runs === 4) return "FOUR";
    return "default";
  };

  // ── Try JSON API commentary endpoint
  try {
    const { data } = await axios.get(
      `https://www.cricbuzz.com/api/cricket-match/${matchId}/commentary/0`,
      { headers: apiHeaders, timeout: 10000 }
    );
    const list = data?.commentaryList;
    if (Array.isArray(list) && list.length) {
      const commentary = list
        .filter(c => c.commText)
        .map(c => ({
          over:           c.overNumber !== undefined ? c.overNumber : "",
          ball:           c.ballNbr !== undefined ? c.ballNbr : "",
          event:          normaliseEvent(c),
          text:           c.commText || "",
          batsmanStriker: c.batsmanStriker?.batName || c.batName || "",
          bowlerStriker:  c.bowlerStriker?.bowlName || c.bowlName || "",
          runs:           c.runs !== undefined ? c.runs : 0,
        }));
      if (commentary.length) {
        scrapeCache.set(key, commentary);
        return commentary;
      }
    }
  } catch (e) {
    console.log(`Commentary JSON API failed for ${matchId}:`, e.message);
  }

  // ── Fallback: scrape scorecard page for embedded commentaryList JSON
  const commentary = [];
  try {
    const { data: html } = await axios.get(
      `https://www.cricbuzz.com/live-cricket-scorecard/${matchId}`,
      { headers: htmlHeaders, timeout: 12000 }
    );
    const $ = cheerio.load(html);

    // Try __NEXT_DATA__ first
    const nextDataScript = $("script#__NEXT_DATA__").html();
    if (nextDataScript) {
      try {
        const nd = JSON.parse(nextDataScript);
        const list = nd?.props?.pageProps?.commentaryList
          || nd?.props?.pageProps?.appData?.commentaryList;
        if (Array.isArray(list)) {
          list.filter(c => c.commText).forEach(c => {
            commentary.push({
              over: c.overNumber ?? "", ball: c.ballNbr ?? "",
              event: normaliseEvent(c), text: c.commText,
              batsmanStriker: c.batsmanStriker?.batName || "",
              bowlerStriker:  c.bowlerStriker?.bowlName || "",
              runs: c.runs ?? 0,
            });
          });
        }
      } catch (_) {}
    }

    // Try inline scripts
    if (!commentary.length) {
      $("script").each((_, el) => {
        if (commentary.length) return false;
        const src = $(el).html() || "";
        if (!src.includes("commentaryList")) return;
        // Find array
        const idx = src.indexOf('"commentaryList":[');
        if (idx === -1) return;
        const unescaped = src.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
        const start = unescaped.indexOf('"commentaryList":[');
        if (start === -1) return;
        const arrStart = start + '"commentaryList":'.length;
        let brackets = 0, end = -1;
        for (let i = arrStart; i < unescaped.length; i++) {
          if (unescaped[i] === "[") brackets++;
          else if (unescaped[i] === "]") { brackets--; if (!brackets) { end = i + 1; break; } }
        }
        if (end === -1) return;
        try {
          const list = JSON.parse(unescaped.slice(arrStart, end));
          list.filter(c => c.commText).forEach(c => {
            commentary.push({
              over: c.overNumber ?? "", ball: c.ballNbr ?? "",
              event: normaliseEvent(c), text: c.commText,
              batsmanStriker: c.batsmanStriker?.batName || "",
              bowlerStriker:  c.bowlerStriker?.bowlName || "",
              runs: c.runs ?? 0,
            });
          });
        } catch (_) {}
      });
    }

    // Last resort: HTML divs
    if (!commentary.length) {
      $(".cb-col.cb-col-100.cb-ltst-wgt-hdr").each((_, el) => {
        const over = $(el).find(".cb-col-8").text().trim();
        const text = $(el).find(".cb-col-84").text().trim();
        if (text) commentary.push({ over, ball: "", event: "default", text, runs: 0, batsmanStriker: "", bowlerStriker: "" });
      });
    }
  } catch (e) {
    console.log("Commentary HTML fallback failed:", e.message);
  }

  if (commentary.length) scrapeCache.set(key, commentary);
  return commentary;
}

// ─── 5. SCORECARD ────────────────────────────────────────────────────────────
async function scrapeScorecard(matchId) {
  const key = `cricbuzz:scorecard:${matchId}`;
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  // ── Try JSON API
  try {
    const { data } = await axios.get(
      `https://www.cricbuzz.com/api/cricket-match/${matchId}/scorecard`,
      { headers: apiHeaders, timeout: 10000 }
    );
    const scoreCard = data?.scoreCard;
    if (Array.isArray(scoreCard) && scoreCard.length) {
      const innings = scoreCard.map(inn => {
        const batsmen = Object.values(inn.batTeamDetails?.batsmenData || {})
          .filter(b => b.batName)
          .map(b => ({
            name: b.batName,
            dismissal: b.outDesc || "not out",
            r: String(b.runs ?? 0),
            b: String(b.balls ?? 0),
            fours: String(b.fours ?? 0),
            sixes: String(b.sixes ?? 0),
            sr: b.strikeRate != null ? String(Number(b.strikeRate).toFixed(2)) : "0.00",
          }));

        const bowlers = Object.values(inn.bowlTeamDetails?.bowlersData || {})
          .filter(b => b.bowlName)
          .map(b => ({
            name: b.bowlName,
            o: String(b.overs ?? 0),
            m: String(b.maidens ?? 0),
            r: String(b.runs ?? 0),
            w: String(b.wickets ?? 0),
            eco: b.economy != null ? String(Number(b.economy).toFixed(2)) : "0.00",
          }));

        const sd = inn.scoreDetails || {};
        return {
          team: inn.batTeamDetails?.batTeamName || "Team",
          score: `${sd.runs ?? 0}/${sd.wickets ?? 0}`,
          overs: String(sd.overs ?? 0),
          extras: String(inn.extrasData?.total ?? 0),
          batsmen,
          bowlers,
          fow: Object.values(inn.wicketsData || {}).map(w =>
            `${w.batName} ${w.wktRuns}(${w.wktOvr})`
          ),
        };
      });

      const result = { innings };
      scrapeCache.set(key, result);
      return result;
    }
  } catch (e) {
    console.log(`Scorecard JSON API failed for ${matchId}:`, e.message);
  }

  // ── HTML fallback
  try {
    const { data: html } = await axios.get(
      `https://www.cricbuzz.com/live-cricket-scorecard/${matchId}`,
      { headers: htmlHeaders, timeout: 12000 }
    );
    const $ = cheerio.load(html);
    const innings = [];

    // Try __NEXT_DATA__
    const nd = $("script#__NEXT_DATA__").html();
    if (nd) {
      try {
        const parsed = JSON.parse(nd);
        const sc = parsed?.props?.pageProps?.appData?.scoreCard
          || parsed?.props?.pageProps?.scoreCard;
        if (Array.isArray(sc) && sc.length) {
          sc.forEach(inn => {
            if (!inn.batTeamDetails?.batsmenData) return;
            const batsmen = Object.values(inn.batTeamDetails.batsmenData)
              .filter(b => b.batName)
              .map(b => ({
                name: b.batName, dismissal: b.outDesc || "not out",
                r: String(b.runs ?? 0), b: String(b.balls ?? 0),
                fours: String(b.fours ?? 0), sixes: String(b.sixes ?? 0),
                sr: b.strikeRate != null ? String(Number(b.strikeRate).toFixed(2)) : "0.00",
              }));
            const bowlers = Object.values(inn.bowlTeamDetails?.bowlersData || {})
              .filter(b => b.bowlName)
              .map(b => ({
                name: b.bowlName, o: String(b.overs ?? 0), m: String(b.maidens ?? 0),
                r: String(b.runs ?? 0), w: String(b.wickets ?? 0),
                eco: b.economy != null ? String(Number(b.economy).toFixed(2)) : "0.00",
              }));
            const sd = inn.scoreDetails || {};
            innings.push({
              team: inn.batTeamDetails.batTeamName || "Team",
              score: `${sd.runs ?? 0}/${sd.wickets ?? 0}`,
              overs: String(sd.overs ?? 0),
              extras: String(inn.extrasData?.total ?? 0),
              batsmen, bowlers, fow: [],
            });
          });
        }
      } catch (_) {}
    }

    // Pure HTML fallback
    if (!innings.length) {
      ["1", "2", "3", "4"].forEach(num => {
        const div = $(`#innings_${num}`);
        if (!div.length) return;
        const teamName = div.find(".cb-scrd-hdr").text().split("Innings")[0].trim();
        const score = div.find(".cb-scrd-hdr .text-bold").text().trim();
        const batsmen = [];
        div.find(".cb-scrd-itms").each((_, el) => {
          const name = $(el).find("a.text-cbTextLink").text().trim();
          if (!name) return;
          const cols = $(el).find(".cb-col-8");
          batsmen.push({
            name, dismissal: $(el).find(".cb-font-12.text-gray").text().trim(),
            r: $(cols[0]).text().trim(), b: $(cols[1]).text().trim(),
            fours: $(cols[2]).text().trim(), sixes: $(cols[3]).text().trim(),
            sr: $(cols[4]).text().trim(),
          });
        });
        const bowlers = [];
        div.find(".cb-ltst-wgt-hdr:contains('Bowling')").nextAll(".cb-scrd-itms").each((_, el) => {
          const name = $(el).find("a.text-cbTextLink").text().trim();
          if (!name) return;
          const cols = $(el).find(".cb-col-8, .cb-col-10");
          bowlers.push({
            name, o: $(cols[0]).text().trim(), m: $(cols[1]).text().trim(),
            r: $(cols[2]).text().trim(), w: $(cols[3]).text().trim(), eco: $(cols[4]).text().trim(),
          });
        });
        if (teamName) innings.push({ team: teamName, score, overs: "", extras: "0", batsmen, bowlers, fow: [] });
      });
    }

    const result = { innings };
    scrapeCache.set(key, result);
    return result;
  } catch (e) {
    console.log(`Scorecard HTML fallback failed for ${matchId}:`, e.message);
  }

  return { innings: [] };
}

// ─── 6. UPCOMING MATCHES ─────────────────────────────────────────────────────
async function scrapeUpcomingMatches() {
  const key = "cricbuzz:upcoming";
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  // Try JSON API
  try {
    const { data } = await axios.get(
      "https://www.cricbuzz.com/api/cricket-match/upcoming",
      { headers: apiHeaders, timeout: 10000 }
    );
    const parsed = parseTypeMatches(data?.typeMatches);
    const upcoming = parsed.upcoming;
    if (upcoming.length) {
      scrapeCache.set(key, upcoming);
      return upcoming;
    }
  } catch (e) {
    console.log("Upcoming JSON API failed:", e.message);
  }

  // Fall back to HTML schedule scrape
  try {
    const { data: html } = await axios.get(
      "https://www.cricbuzz.com/cricket-schedule/upcoming-series/international",
      { headers: htmlHeaders, timeout: 10000 }
    );
    const $ = cheerio.load(html);
    const items = [];
    $(".cb-lv-scdl-itm").each((i, el) => {
      const name  = $(el).find(".cb-lv-scdl-info a").text().trim();
      const date  = $(el).find(".cb-lv-scdl-date").text().trim();
      const venue = $(el).find(".cb-lv-scdl-venue").text().trim() || "Venue TBA";
      const type  = $(el).find(".cb-lv-scdl-type").text().trim() || "International";
      if (!name) return;
      const teams = [], teamInfo = [];
      const vs = name.match(/(.+?)\s+vs\s+(.+?)(?:,|$)/i);
      if (vs) {
        [vs[1].trim(), vs[2].trim()].forEach(t => {
          teams.push(t);
          teamInfo.push({ name: t, shortname: getTeamShortName(t), img: getTeamImageUrl(t) });
        });
      }
      items.push({ id: `up-${i}`, name, date, venue, matchType: type, teams, teamInfo, status: "Scheduled", matchStarted: false, matchEnded: false });
    });
    scrapeCache.set(key, items);
    return items;
  } catch (e) {
    return [];
  }
}

// ─── 7. NEWS ─────────────────────────────────────────────────────────────────
async function getNewsFromGoogle() {
  const key = "news:google";
  const cached = newsCache.get(key);
  if (cached) return cached;

  try {
    const rssUrl = "https://news.google.com/rss/search?q=cricket+IPL+T20+World+Cup+2026&hl=en-IN&gl=IN&ceid=IN:en";
    const { data } = await axios.get(rssUrl, { headers: htmlHeaders, timeout: 10000 });
    const $ = cheerio.load(data, { xmlMode: true });
    const now = new Date();
    const cutoff = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const news = [];

    $("item").each((i, el) => {
      if (i >= 50) return;
      const title = $(el).find("title").text();
      const link = $(el).find("link").text();
      const pubDate = $(el).find("pubDate").text();
      const source = $(el).find("source").text();
      const description = $(el).find("description").text().replace(/<[^>]*>/gm, "").split(" - ")[0];
      const publishedDate = new Date(pubDate);
      if (publishedDate >= cutoff) {
        news.push({
          id: link, title, description: description || title,
          date: publishedDate.toLocaleDateString(),
          source: source || "Google News", url: link,
          publishedAt: publishedDate.toISOString(),
          daysAgo: Math.floor((now - publishedDate) / 86400000),
          hoursAgo: Math.floor((now - publishedDate) / 3600000),
        });
      }
    });

    news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    newsCache.set(key, news);
    return news;
  } catch (e) {
    return [];
  }
}

async function scrapeCricbuzzNews() {
  const key = "news:cricbuzz";
  const cached = newsCache.get(key);
  if (cached) return cached;

  try {
    const { data: html } = await axios.get(
      "https://www.cricbuzz.com/cricket-news/latest-news",
      { headers: htmlHeaders, timeout: 10000 }
    );
    const $ = cheerio.load(html);
    const now = new Date();
    const cutoff = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const news = [];

    $(".cb-nws-lst-rt").each((i, el) => {
      if (i >= 30) return;
      const title = $(el).find(".cb-nws-hdln a").text().trim();
      const url   = $(el).find(".cb-nws-hdln a").attr("href");
      const desc  = $(el).find(".cb-nws-intr").text().trim();
      const time  = $(el).find(".cb-nws-time").text().trim();
      if (!title || !url) return;

      let publishedDate = now;
      const hm = time.match(/(\d+)\s*hour/i);
      const dm = time.match(/(\d+)\s*day/i);
      if (hm) publishedDate = new Date(now.getTime() - parseInt(hm[1]) * 3600000);
      else if (dm) publishedDate = new Date(now.getTime() - parseInt(dm[1]) * 86400000);

      if (publishedDate >= cutoff) {
        news.push({
          id: `https://www.cricbuzz.com${url}`, title, description: desc || title,
          date: publishedDate.toLocaleDateString(), source: "Cricbuzz",
          url: `https://www.cricbuzz.com${url}`,
          publishedAt: publishedDate.toISOString(),
          daysAgo: Math.floor((now - publishedDate) / 86400000),
          hoursAgo: Math.floor((now - publishedDate) / 3600000),
        });
      }
    });

    newsCache.set(key, news);
    return news;
  } catch (e) {
    return [];
  }
}

async function getNewsWithFallback() {
  try {
    const [google, cricbuzz] = await Promise.all([getNewsFromGoogle(), scrapeCricbuzzNews()]);
    const all = [...google, ...cricbuzz];
    const seen = new Set();
    const unique = all.filter(item => {
      const k = item.title.toLowerCase().replace(/[^\w]/g, "").slice(0, 60);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return unique;
  } catch (e) {
    return [];
  }
}

// ─── 8. RANKINGS ─────────────────────────────────────────────────────────────
async function scrapeRankings(category = "men", type = "batting", format = "tests") {
  const key = `cricbuzz:rankings:${category}:${type}:${format}`;
  const cached = staticCache.get(key);
  if (cached) return cached;

  // Try JSON API
  try {
    const formatMap = { tests: "TEST", odis: "ODI", t20s: "T20" };
    const typeMap   = { batting: "batsmen", bowling: "bowlers", "all-rounders": "allrounders", teams: "teams" };
    const url = `https://www.cricbuzz.com/api/cricket-stats/icc-rankings/team?formatType=${formatMap[format] || "TEST"}&gender=${category === "women" ? "W" : "M"}`;
    // This endpoint might not exist in this exact form — fall through to HTML
    throw new Error("use HTML");
  } catch (_) {}

  // HTML scrape rankings
  try {
    const { data: html } = await axios.get(
      `https://www.cricbuzz.com/cricket-stats/icc-rankings/${category}/${type}`,
      { headers: htmlHeaders, timeout: 10000 }
    );
    const $ = cheerio.load(html);
    const ranks = [];
    $(".cb-col-100.cb-padding-left0").each((_, section) => {
      const heading = $(section).find("h3").text().toLowerCase();
      if (!heading.includes(format.toLowerCase().replace("t20s", "t20"))) return;
      $(section).find(".cb-col-100.cb-font-14").each((_, row) => {
        const name = type === "teams"
          ? $(row).find(".cb-col-67").text().trim()
          : $(row).find(".cb-col-67 a").first().text().trim();
        if (!name) return;
        ranks.push({
          rank:    $(row).find(".cb-col-16").first().text().trim(),
          name,
          country: $(row).find(".cb-col-67 .cb-font-12").first().text().trim() || "",
          rating:  $(row).find(".cb-col-17").first().text().trim(),
        });
      });
    });
    staticCache.set(key, ranks);
    return ranks;
  } catch (e) {
    return [];
  }
}

// ─── 9. TEAMS ────────────────────────────────────────────────────────────────
async function scrapeCricbuzzTeams() {
  const key = "cricbuzz:teams";
  const cached = staticCache.get(key);
  if (cached) return cached;

  try {
    const { data: html } = await axios.get("https://www.cricbuzz.com/cricket-team", { headers: htmlHeaders });
    const $ = cheerio.load(html);
    const teams = { international: [], domestic: [], league: [], women: [] };
    $(".cb-col-100.cb-col").each((_, section) => {
      const header = $(section).find("h1, h2, .cb-font-18").text().toLowerCase().trim();
      let cat = null;
      if (header.includes("test teams") || header.includes("international")) cat = "international";
      else if (header.includes("domestic")) cat = "domestic";
      else if (header.includes("league")) cat = "league";
      else if (header.includes("women")) cat = "women";
      if (!cat) return;
      $(section).find("a[href^='/cricket-team/']").each((_, el) => {
        const name = $(el).text().trim();
        const url  = $(el).attr("href");
        if (!name) return;
        const id = url.split("/").filter(Boolean).pop();
        teams[cat].push({ id, name, url: `https://www.cricbuzz.com${url}`, img: `https://static.cricbuzz.com/a/img/v1/72x72/i1/c${id}/team-flag.jpg` });
      });
    });
    staticCache.set(key, teams);
    return teams;
  } catch (e) {
    return { international: [], domestic: [], league: [], women: [] };
  }
}

// ─── 10. SERIES ──────────────────────────────────────────────────────────────
async function scrapeCricbuzzSeries() {
  const key = "cricbuzz:series";
  const cached = staticCache.get(key);
  if (cached) return cached;

  try {
    const { data: html } = await axios.get("https://www.cricbuzz.com/cricket-series", { headers: htmlHeaders });
    const $ = cheerio.load(html);
    const res = { international: [], domestic: [], league: [], women: [] };
    let currentCat = "international";
    $(".cb-col-100.cb-col").each((_, el) => {
      const header = $(el).find(".cb-font-18").text().trim().toLowerCase();
      if (header.includes("international")) currentCat = "international";
      else if (header.includes("domestic")) currentCat = "domestic";
      else if (header.includes("league")) currentCat = "league";
      else if (header.includes("women")) currentCat = "women";
      $(el).find(".cb-sch-lst-itm").each((j, item) => {
        const name = $(item).find("a").text().trim();
        const date = $(item).find(".text-gray").text().trim();
        const url  = $(item).find("a").attr("href");
        if (name) res[currentCat].push({ id: url ? url.split("/")[2] : `s-${j}`, name, date, url: url ? `https://www.cricbuzz.com${url}` : null });
      });
    });
    staticCache.set(key, res);
    return res;
  } catch (e) {
    return { international: [], domestic: [], league: [], women: [] };
  }
}

// ─── 11. IPL STANDINGS ───────────────────────────────────────────────────────
const IPL_FALLBACK_TABLE = [
  { team: "Royal Challengers Bengaluru", short: "RCB",  p:0, w:0, l:0, nr:0, nrr:"+0.000", pts:0, color:"#EC1C24" },
  { team: "Mumbai Indians",              short: "MI",   p:0, w:0, l:0, nr:0, nrr:"+0.000", pts:0, color:"#004BA0" },
  { team: "Kolkata Knight Riders",       short: "KKR",  p:0, w:0, l:0, nr:0, nrr:"+0.000", pts:0, color:"#3A225D" },
  { team: "Sunrisers Hyderabad",         short: "SRH",  p:0, w:0, l:0, nr:0, nrr:"+0.000", pts:0, color:"#F7A721" },
  { team: "Gujarat Titans",              short: "GT",   p:0, w:0, l:0, nr:0, nrr:"+0.000", pts:0, color:"#1B8B4B" },
  { team: "Rajasthan Royals",            short: "RR",   p:0, w:0, l:0, nr:0, nrr:"+0.000", pts:0, color:"#254AA5" },
  { team: "Lucknow Super Giants",        short: "LSG",  p:0, w:0, l:0, nr:0, nrr:"+0.000", pts:0, color:"#A72056" },
  { team: "Chennai Super Kings",         short: "CSK",  p:0, w:0, l:0, nr:0, nrr:"+0.000", pts:0, color:"#F9CD05" },
  { team: "Delhi Capitals",              short: "DC",   p:0, w:0, l:0, nr:0, nrr:"+0.000", pts:0, color:"#0078BC" },
  { team: "Punjab Kings",               short: "PBKS", p:0, w:0, l:0, nr:0, nrr:"+0.000", pts:0, color:"#ED1B24" },
];

async function scrapeIPLStandings() {
  const key = "ipl:standings:2026";
  const cached = scrapeCache.get(key);
  if (cached) return cached;

  // Get IPL series ID from live matches
  let seriesId = null;
  try {
    const allData = await scrapeCricbuzzAllMatches();
    const allMatches = [...(allData.live || []), ...(allData.recent || []), ...(allData.upcoming || [])];
    const iplMatch = allMatches.find(m =>
      m.series?.toLowerCase().includes("indian premier league") ||
      m.name?.toLowerCase().includes("ipl") ||
      m.series?.toLowerCase().includes("ipl")
    );
    seriesId = iplMatch?.seriesId;
  } catch (_) {}

  // Try JSON API for series standings
  if (seriesId) {
    try {
      const { data } = await axios.get(
        `https://www.cricbuzz.com/api/series/${seriesId}/points-table`,
        { headers: apiHeaders, timeout: 10000 }
      );
      const groups = data?.pointsTable;
      if (Array.isArray(groups) && groups.length) {
        const rows = [];
        groups.forEach(group => {
          (group.pointsTableInfo || []).forEach(row => {
            const fallback = IPL_FALLBACK_TABLE.find(t =>
              row.teamName?.toLowerCase().includes(t.short.toLowerCase()) ||
              t.team.toLowerCase().includes((row.teamName || "").toLowerCase().slice(0, 8))
            );
            rows.push({
              team:  row.teamName || fallback?.team || "Team",
              short: row.teamSName || fallback?.short || (row.teamName || "T").slice(0, 3).toUpperCase(),
              p:     row.matchesPlayed || 0,
              w:     row.matchesWon || 0,
              l:     row.matchesLost || 0,
              nr:    row.matchesNoResult || 0,
              nrr:   row.nrr != null ? (row.nrr >= 0 ? `+${Number(row.nrr).toFixed(3)}` : Number(row.nrr).toFixed(3)) : "+0.000",
              pts:   row.points || 0,
              color: fallback?.color || "#22C55E",
            });
          });
        });
        if (rows.length >= 4) {
          scrapeCache.set(key, rows, 300);
          return rows;
        }
      }
    } catch (e) {
      console.log("IPL standings JSON API failed:", e.message);
    }

    // Try HTML scrape of Cricbuzz points table page
    try {
      const { data: html } = await axios.get(
        `https://www.cricbuzz.com/cricket-series/${seriesId}/points-table`,
        { headers: htmlHeaders, timeout: 12000 }
      );
      const $ = cheerio.load(html);
      const rows = [];
      $("table.cb-srs-pnts tr, .cb-srs-pntslst tr").each((i, row) => {
        if (i === 0) return;
        const cells = $(row).find("td");
        if (cells.length < 6) return;
        const teamName = $(cells[0]).text().replace(/\s+/g, " ").trim();
        if (!teamName || teamName.length < 2) return;
        const fallback = IPL_FALLBACK_TABLE.find(t =>
          teamName.toLowerCase().includes(t.short.toLowerCase()) ||
          t.team.toLowerCase().includes(teamName.toLowerCase().slice(0, 6))
        );
        rows.push({
          team:  teamName,
          short: fallback?.short || teamName.slice(0, 3).toUpperCase(),
          p:     parseInt($(cells[1]).text()) || 0,
          w:     parseInt($(cells[2]).text()) || 0,
          l:     parseInt($(cells[3]).text()) || 0,
          nr:    parseInt($(cells[4]).text()) || 0,
          nrr:   $(cells[5]).text().trim() || "+0.000",
          pts:   parseInt($(cells[6])?.text()) || 0,
          color: fallback?.color || "#22C55E",
        });
      });
      if (rows.length >= 4) {
        scrapeCache.set(key, rows, 300);
        return rows;
      }
    } catch (e) {
      console.log("IPL standings HTML failed:", e.message);
    }
  }

  // Return fallback table
  scrapeCache.set(key, IPL_FALLBACK_TABLE, 120);
  return IPL_FALLBACK_TABLE;
}

// ─── 12. getScaledData (legacy compat) ───────────────────────────────────────
async function getScaledData(type, params = {}) {
  switch (type) {
    case "liveMatches":
      return { status: "success", data: await scrapeCricbuzzLiveMatches() };
    case "upcomingMatches":
    case "matches":
      return { status: "success", data: await scrapeUpcomingMatches() };
    case "news":
      return { status: "success", data: await getNewsFromGoogle() };
    case "rankings":
      return { status: "success", data: await scrapeRankings(params.category, params.type, params.format) };
    case "series":
      return { status: "success", data: await scrapeCricbuzzSeries() };
    case "teams":
      return { status: "success", data: await scrapeCricbuzzTeams() };
    case "scorecard":
    case "match_scorecard": {
      const sc = await scrapeScorecard(params.id);
      return { status: "success", data: sc };
    }
    case "cricScore": {
      // Live score quick-fetch
      try {
        const { data } = await axios.get(
          `https://www.cricbuzz.com/api/cricket-match/${params.id}/live-score`,
          { headers: apiHeaders, timeout: 8000 }
        );
        const ms = data?.matchScore;
        const scoreArr = [];
        if (ms) {
          const addInn = (ts, label) => {
            if (!ts) return;
            ["inngs1","inngs2"].forEach((k, i) => {
              if (ts[k]?.runs !== undefined) scoreArr.push({ r: ts[k].runs||0, w: ts[k].wickets||0, o: ts[k].overs||0, inning: `${label} INN ${i+1}` });
            });
          };
          addInn(ms.team1Score, "T1");
          addInn(ms.team2Score, "T2");
        }
        const status = data?.matchHeader?.status || "";
        return { status: "success", data: [{ id: params.id, status, score: scoreArr, matchStarted: true }] };
      } catch (_) {}
      // HTML fallback
      try {
        const { data: html } = await axios.get(`https://www.cricbuzz.com/live-cricket-scores/${params.id}`, { headers: htmlHeaders });
        const $ = cheerio.load(html);
        const innings = [];
        $(".cb-col.cb-col-100.cb-ltst-wgt-hdr").each((_, el) => {
          const team = $(el).find(".cb-col-84").text().trim();
          const score = $(el).find(".cb-col-16").text().trim();
          if (team) innings.push({ ...parseScore(score), inning: team, team, score });
        });
        return { status: "success", data: [{ id: params.id, status: $(".cb-text-complete, .cb-text-live").text().trim(), score: innings, matchStarted: true }] };
      } catch (_) {}
      return { status: "error", message: "Score unavailable" };
    }
    default:
      return { status: "error", message: `Unknown type: ${type}` };
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = {
  getLiveMatchesWithFallback:  scrapeCricbuzzLiveMatches,
  getAllMatches:                scrapeCricbuzzAllMatches,
  getNewsWithFallback,
  scrapeCricbuzzUpcoming:      scrapeUpcomingMatches,
  scrapeCricbuzzSeries:        async () => (await getScaledData("series")).data,
  scrapeCricbuzzRankings:      scrapeRankings,
  scrapeCricbuzzTeams,
  scrapeCricbuzzScorecard:     async (id) => (await scrapeScorecard(id)),
  scrapeMatchInfo,
  scrapeCommentary,
  getScaledData,
  scrapeIPLStandings,
};
