// Non-cricket sport hub configuration, shared by SportPage.jsx and api/render.js.

const SPORTS = {
  football: {
    sport: "football",
    slug: "football",
    name: "Football",
    icon: "⚽",
    accentColor: "#15803d",
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
        text: "Domestic leagues award three points for a win and one for a draw. When sides finish level, many leagues, including the Premier League and the Bundesliga, use goal difference and then goals scored as tie-breakers, while La Liga and Serie A look at head-to-head results first, and Serie A settles a tie for the title or the last safe place with a play-off. League position, along with the domestic cups, decides qualification for the UEFA Champions League, Europa League and Conference League. The number of places depends on how a country's clubs have performed in Europe over the previous five seasons, and since 2024-25 the two countries whose clubs did best in the previous season have each earned an extra Champions League place.",
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
    accentColor: "#c2410c",
    leagues: ["NBA", "WNBA", "NCAA Men's Basketball", "NCAA Women's Basketball"],
    intro:
      "Live basketball scores, tip-off times and recent results from the NBA, the WNBA and NCAA college basketball. Scores refresh automatically during games.",
    sections: [
      { type: "h2", text: "How the NBA season works" },
      {
        type: "p",
        text: "Thirty teams play an 82-game regular season from October to April, split into Eastern and Western Conferences. In each conference the top six teams qualify for the playoffs directly, and the teams finishing seventh to tenth enter the **play-in tournament** for the last two places. The playoffs are four rounds of best-of-seven series, ending in the NBA Finals in June. The mid-season **NBA Cup**, introduced in 2023, runs inside the regular season: its group games and knockout rounds count towards the 82-game schedule, and only the championship game does not.",
      },
      { type: "h2", text: "WNBA and college basketball" },
      {
        type: "p",
        text: "The WNBA season runs through the northern summer, from May to October, with a shorter regular season and a playoff bracket. NCAA Division I men's and women's seasons run from November to April and culminate in single-elimination national tournaments, each known as March Madness; both fields grow from 68 to 76 teams from the 2027 tournaments.",
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
    accentColor: "#b45309",
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

// When the facts above were last checked against sources; move it after each review.
const FACTS_CHECKED = "24 October 2026";
const FACTS_NOTE = `Facts on this page were last checked on ${FACTS_CHECKED}. If something is out of date, [tell us](/contact).`;

module.exports = { SPORTS, SPORT_SLUGS: Object.keys(SPORTS), FACTS_CHECKED, FACTS_NOTE };
