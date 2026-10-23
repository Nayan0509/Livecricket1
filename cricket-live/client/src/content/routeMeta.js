// Per-route <title> and meta description for every static URL on the site.
// Shared by client/src/components/SEO.jsx (browser) and api/render.js (server)
// so the raw HTML a crawler receives and the DOM a visitor sees carry the
// same title and description. Titles deliberately avoid season years and
// "updated every N seconds" claims: a title that says "IPL 2026" is wrong for
// ten months of the year, and a reviewer notices.
//
// Titles here exclude the brand suffix; renderers append " | Live Cricket Zone".

const STATIC_ROUTES = {
  "/": {
    title: "Live Cricket Scores, Scorecards & Guides",
    description:
      "Live cricket scores with full scorecards, fixtures and results, plus football, basketball and tennis scores and a library of plain-English guides to how the games work.",
  },
  "/live": {
    title: "Live Cricket Scores — Matches In Progress Right Now",
    description:
      "Every cricket match currently in progress, with scores, current status and links to the full scorecard. Recent results and upcoming fixtures are listed underneath.",
  },
  "/upcoming": {
    title: "Upcoming Cricket Matches — Fixtures, Dates & Venues",
    description:
      "Upcoming cricket fixtures across international series and domestic leagues, grouped by date with venue and start time.",
  },
  "/results": {
    title: "Recent Cricket Results & Scorecards",
    description:
      "Results of recently completed cricket matches with the final scores, result summary and a link to each full scorecard.",
  },
  "/schedule": {
    title: "Cricket Schedule — Fixtures by Date",
    description:
      "The cricket schedule grouped by day and series: international tours, ICC events and franchise leagues, with venues and start times.",
  },
  "/series": {
    title: "Cricket Series & Tournaments",
    description:
      "Current and upcoming cricket series: international tours, ICC tournaments and domestic leagues, each with its own schedule, results and points table.",
  },
  "/teams": {
    title: "Cricket Teams — International, Franchise & Domestic",
    description:
      "Browse international, franchise, domestic and women's cricket teams and open a team to see its recent matches and players.",
  },
  "/players": {
    title: "Cricket Players — Profiles & Career Records",
    description:
      "Search cricket players and open a profile for career batting and bowling figures across Tests, ODIs and T20s.",
  },
  "/rankings": {
    title: "ICC Cricket Rankings — Batting, Bowling, All-Rounders & Teams",
    description:
      "The latest ICC player and team rankings for men's and women's Test, ODI and T20I cricket, with a guide to how the rating points are calculated.",
  },
  "/stats": {
    title: "Cricket Stats — Player Search & Current Rankings Leaders",
    description:
      "Look up a cricketer's career statistics and see who currently tops the ICC batting and bowling rankings in each format.",
  },
  "/news": {
    title: "Cricket News Headlines",
    description:
      "A curated feed of the latest cricket headlines from established publishers, each linking to the original report, alongside our own explainer guides.",
  },
  "/guides": {
    title: "Cricket & Sports Guides — Rules, Formats and Stats Explained",
    description:
      "Original, plain-English guides to how cricket works: reading a scorecard, DLS, net run rate, DRS, powerplays, dismissals, rankings and more, plus football, tennis and basketball basics.",
  },
  "/videos": {
    title: "Cricket Highlights — Official Match Clips",
    description:
      "Official post-match highlights embedded from rights holders' YouTube channels. Live Cricket Zone does not stream live matches.",
  },
  "/games": {
    title: "Cricket Games — Striker, Trivia, Memory & Kachuful",
    description:
      "Play four free browser games: a timing-based batting challenge, a cricket trivia quiz, a memory puzzle and the Indian card game Kachuful (Judgement) with friends.",
  },
  "/fantasy": {
    title: "Fantasy Cricket Strategy Guide",
    description:
      "How fantasy cricket scoring works and how to think about captaincy, pitch conditions and player roles. No real-money games are offered or promoted on this site.",
  },
  "/about": {
    title: "About Live Cricket Zone",
    description:
      "Who runs Live Cricket Zone, where the scores come from, what we write ourselves and what we deliberately do not do.",
  },
  "/contact": {
    title: "Contact Live Cricket Zone",
    description:
      "How to reach us about a score error, a correction to a guide, a privacy request or a copyright notice.",
  },
  "/editorial-policy": {
    title: "Editorial Policy & Corrections",
    description:
      "How our guides are written, checked and corrected, how live data is sourced and labelled, and how advertising is kept separate from content.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "What data Live Cricket Zone collects, how cookies and Google AdSense are used, and your rights under GDPR and CCPA.",
  },
  "/terms-of-use": {
    title: "Terms of Use",
    description:
      "The terms that apply when you use Live Cricket Zone, including data accuracy disclaimers and intellectual property notices.",
  },
  "/dmca-copyright": {
    title: "DMCA & Copyright Policy",
    description:
      "How to submit a copyright or DMCA notice about content on Live Cricket Zone, and how we handle embedded video and third-party data.",
  },
  "/ipl": {
    title: "IPL Live Scores, Points Table & Schedule — Indian Premier League",
    description:
      "Indian Premier League live scores and fixtures, the points table when the season is on, the ten franchises and their home grounds, and how the playoffs work.",
  },
  "/t20-world-cup": {
    title: "ICC Men's T20 World Cup — Scores, Format & History",
    description:
      "Live scores and fixtures during the ICC Men's T20 World Cup, plus how the tournament format works, past winners and the records that have stood since 2007.",
  },
  "/world-cup": {
    title: "ICC Cricket World Cup — Scores, Format & History",
    description:
      "The 50-over ICC Cricket World Cup: live scores and fixtures during the tournament, how qualification and the knockout stage work, and every past champion.",
  },
  "/champions-trophy": {
    title: "ICC Champions Trophy — Scores, Format & History",
    description:
      "The eight-team ICC Champions Trophy: live scores when it is on, the tournament format, and its history since 1998.",
  },
  "/asia-cup": {
    title: "Asia Cup Cricket — Scores, Format & History",
    description:
      "The ACC Asia Cup: live scores and fixtures during the tournament, how the format alternates between ODI and T20, and past winners.",
  },
  "/psl": {
    title: "PSL Live Scores & Schedule — Pakistan Super League",
    description:
      "Pakistan Super League live scores and fixtures, the six franchises and their home cities, the playoff format and the league's history since 2016.",
  },
  "/bbl": {
    title: "BBL Live Scores & Schedule — Big Bash League",
    description:
      "Big Bash League live scores and fixtures, the eight Australian city franchises and their home grounds, the finals system and the league's distinctive rules.",
  },
  "/cpl": {
    title: "CPL Live Scores & Schedule — Caribbean Premier League",
    description:
      "Caribbean Premier League live scores and fixtures, the franchises and their home islands, and how the tournament is structured.",
  },
  "/bpl": {
    title: "BPL Live Scores & Schedule — Bangladesh Premier League",
    description:
      "Bangladesh Premier League live scores and fixtures, the franchises, the venues in Dhaka, Sylhet and Chattogram, and how the tournament works.",
  },
  "/county-championship": {
    title: "County Championship — Scores, Divisions & History",
    description:
      "England's first-class County Championship: live scores during the season, how the two divisions and bonus points work, the 18 counties and the competition's history since 1890.",
  },
  "/womens-cricket": {
    title: "Women's Cricket — Live Scores, Formats & Competitions",
    description:
      "Live scores and fixtures for women's international and franchise cricket, with an overview of the ICC women's events and the main T20 leagues.",
  },
  "/t20": {
    title: "T20 Cricket — Live Scores & How the Format Works",
    description:
      "Live T20 scores across internationals and franchise leagues, and a guide to the 20-over format: powerplays, bowling limits, Super Overs and strategy.",
  },
  "/odi": {
    title: "ODI Cricket — Live Scores & How the Format Works",
    description:
      "Live One Day International scores, and a guide to the 50-over format: the three powerplay phases, fielding restrictions and how rain-affected games are decided.",
  },
  "/test": {
    title: "Test Cricket — Live Scores & How the Format Works",
    description:
      "Live Test match scores, and a guide to five-day cricket: sessions, the new ball, follow-on, declarations and the World Test Championship.",
  },
  "/icc-cwc-league-2": {
    title: "ICC Cricket World Cup League 2 — Scores & Format",
    description:
      "Live scores and fixtures from ICC Cricket World Cup League 2, the ODI competition through which Associate nations qualify for the World Cup, and how the league works.",
  },
  "/football": {
    title: "Football Live Scores — Premier League, La Liga, Champions League & More",
    description:
      "Live football scores, upcoming fixtures and recent results across Europe's major leagues, the Champions League and international competitions.",
  },
  "/basketball": {
    title: "Basketball Live Scores — NBA, WNBA & College",
    description:
      "Live basketball scores, upcoming games and recent results from the NBA, WNBA and NCAA, with a guide to how the seasons and playoffs work.",
  },
  "/tennis": {
    title: "Tennis Live Scores — ATP & WTA Tours",
    description:
      "Live tennis scores and results from ATP and WTA tournaments, with a guide to how tennis scoring, tiebreaks and the tour calendar work.",
  },
};

function getStaticRouteMeta(pathname) {
  const p = (pathname || "/").replace(/\/+$/, "") || "/";
  return STATIC_ROUTES[p] || null;
}

// Old and alias URLs. api/index.js answers them with a 301 and the SPA router
// with <Navigate replace>, so each topic has exactly one indexable URL.
const ROUTE_REDIRECTS = {
  "/live-cricket-score": "/live",
  "/cricket-score-today": "/live",
  "/cricket-matches-today": "/live",
  "/ball-by-ball": "/live",
  "/watch-live": "/videos",
  "/highlights": "/videos",
  "/watch": "/videos",
  "/live-stream": "/videos",
  "/ipl-live-stream": "/ipl",
  "/ipl-live": "/ipl",
  "/watch-ipl-live": "/ipl",
  "/ipl-stream": "/ipl",
  "/county-cricket": "/county-championship",
  "/namibia-vs-scotland": "/icc-cwc-league-2",
  "/cricket-website": "/about",
  "/betting-guide": "/fantasy",
};

module.exports = { STATIC_ROUTES, ROUTE_REDIRECTS, getStaticRouteMeta };
