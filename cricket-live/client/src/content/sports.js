// Non-cricket sport hub configuration, shared by SportPage.jsx and api/render.js.

const SPORTS = {
  football: {
    sport: "football",
    slug: "football",
    name: "Football",
    icon: "⚽",
    accentColor: "#39FF14",
    leagues: [
      "Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1",
      "UEFA Champions League", "UEFA Europa League", "MLS", "Eredivisie",
      "Primeira Liga", "Brasileirão", "Liga MX", "EFL Championship",
      "Scottish Premiership", "Süper Lig", "Argentine Primera División",
      "Copa Libertadores", "FIFA World Cup",
    ],
    intro:
      "Live football scores, kick-off times and recent results from the major European leagues, the continental cups and a selection of leagues from the Americas. Scores refresh automatically while matches are in play.",
    sections: [
      { type: "h2", text: "Reading a football score on this page" },
      {
        type: "p",
        text: "Each card shows the competition, the two sides, the current score and the match state: not started, the minute of play, half-time, full-time or extra time and penalties in knockout ties. A result shown as 2-2 after extra time with a penalty shoot-out noted means the tie was level and decided from the spot; the shoot-out score does not count as goals scored.",
      },
      { type: "h2", text: "How league tables and European qualification work" },
      {
        type: "p",
        text: "Domestic leagues award three points for a win and one for a draw. When sides finish level, most leagues use goal difference and then goals scored as tie-breakers, though La Liga and Serie A use head-to-head records first. League position decides qualification for the UEFA Champions League, Europa League and Conference League, with the number of places depending on how a country's clubs have performed in Europe over the previous five seasons.",
      },
    ],
    faq: [
      {
        q: "Which football competitions are covered?",
        a: "The Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga, the EFL Championship, the Scottish Premiership and the Turkish Süper Lig; the UEFA Champions League and Europa League; MLS, Liga MX, the Brasileirão, Argentina's Primera División and the Copa Libertadores; and the FIFA World Cup when it is on.",
      },
      {
        q: "How often do football scores update?",
        a: "Automatically about every 30 seconds while matches are in play. Scores come from a public sports data feed and may lag the broadcast by a few seconds.",
      },
    ],
  },
  basketball: {
    sport: "basketball",
    slug: "basketball",
    name: "Basketball",
    icon: "🏀",
    accentColor: "#FF6B00",
    leagues: ["NBA", "WNBA", "NCAA Men's Basketball", "NCAA Women's Basketball"],
    intro:
      "Live basketball scores, tip-off times and recent results from the NBA, the WNBA and NCAA college basketball. Scores refresh automatically during games.",
    sections: [
      { type: "h2", text: "How the NBA season works" },
      {
        type: "p",
        text: "Thirty teams play an 82-game regular season from October to April, split into Eastern and Western Conferences. In each conference the top six teams qualify for the playoffs directly, and the teams finishing seventh to tenth enter the **play-in tournament** for the last two places. The playoffs are four rounds of best-of-seven series, ending in the NBA Finals in June. A mid-season **NBA Cup** knockout tournament, introduced in 2023, is played within the regular-season schedule.",
      },
      { type: "h2", text: "WNBA and college basketball" },
      {
        type: "p",
        text: "The WNBA season runs through the northern summer, from May to October, with a shorter regular season and a playoff bracket. NCAA Division I men's and women's seasons run from November to April and culminate in single-elimination national tournaments, each known as March Madness, in which 68 teams compete.",
      },
    ],
    faq: [
      {
        q: "How many teams make the NBA playoffs?",
        a: "Sixteen: the top six in each conference qualify directly, and two more per conference come through the play-in tournament between the seventh- to tenth-placed teams.",
      },
    ],
  },
  tennis: {
    sport: "tennis",
    slug: "tennis",
    name: "Tennis",
    icon: "🎾",
    accentColor: "#FFEA00",
    leagues: ["ATP Tour", "WTA Tour", "Grand Slams"],
    intro:
      "Live tennis scores and results from ATP and WTA tournaments, including the four Grand Slams. Set-by-set scores refresh automatically while matches are in play.",
    sections: [
      { type: "h2", text: "How tennis scoring works" },
      {
        type: "p",
        text: "Points run 15, 30, 40 and game; at 40-40 (deuce) a player needs two consecutive points to win the game. The first to six games with a two-game margin wins the set, and at 6-6 a tiebreak is played, first to seven points by two. Men's Grand Slam matches are best of five sets and almost all other matches are best of three. Since 2022 every Grand Slam has used a ten-point tiebreak at 6-6 in the final set.",
      },
      { type: "h2", text: "The tour calendar" },
      {
        type: "p",
        text: "The ATP (men's) and WTA (women's) tours run from January to November. The four Grand Slams, the Australian Open, Roland-Garros, Wimbledon and the US Open, carry the most ranking points, followed by the ATP Masters 1000 and WTA 1000 events. Ranking points earned over a rolling 52-week window decide seedings and entry, and the season ends with the ATP Finals and WTA Finals for the top eight players.",
      },
    ],
    faq: [
      {
        q: "Why do some tennis scores show 7-6 (7-4)?",
        a: "The set went to a tiebreak at 6-6. The 7-6 is the games score and the bracket shows the tiebreak points, so 7-6 (7-4) means the tiebreak was won seven points to four.",
      },
    ],
  },
};

module.exports = { SPORTS, SPORT_SLUGS: Object.keys(SPORTS) };
