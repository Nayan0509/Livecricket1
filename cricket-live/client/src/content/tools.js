// Calculator pages at /tools/<slug>. The interactive part is React-only
// (src/pages/ToolDetail.jsx); everything here is the written explanation,
// rendered by both the React page and api/render.js.
// Block schema: see the top of ./pages.js.

const TOOLS = [
  {
    slug: "net-run-rate-calculator",
    title: "Net Run Rate Calculator",
    description:
      "Work out a team's net run rate from its match results, with the bowled-out rule and cricket overs notation handled for you.",
    intro:
      "Enter each match a team has played in the competition: runs scored and overs faced, runs conceded and overs bowled, and whether either side was bowled out. The calculator applies the same rules tournament organisers use and shows each step, so you can check a points table yourself.",
    blocks: [
      { type: "h2", text: "How the calculation works" },
      {
        type: "p",
        text: "Net run rate is the team's scoring rate across all its matches minus the rate it conceded: **total runs scored ÷ total overs faced − total runs conceded ÷ total overs bowled**. Totals are added up across every match first and divided once at the end. It is not an average of each match's net run rate, which gives a different answer.",
      },
      {
        type: "p",
        text: "Two rules are applied automatically. If a side is **bowled out**, it is treated as having faced its full quota of overs, so tick the box for that innings and the calculator uses 20 or 50 overs instead of the overs actually faced. And **overs are counted in balls**: 41.3 means 41 overs and 3 balls, which is 41.5 overs in the division, not 41.3.",
      },
      { type: "h2", text: "What the calculator does not do" },
      {
        type: "ul",
        items: [
          "Rain-affected matches decided by DLS are credited differently. The side batting first is treated as having scored one run fewer than the revised target, from the revised number of overs the chasing side was set (or the DLS par score if play was abandoned), while the chasing side keeps the runs and overs it actually made. Enter those adjusted figures by hand if you want to include such a match. The [DLS guide](/guides/dls-method-explained) explains revised targets.",
          "No-result matches are left out of net run rate entirely, so do not enter them.",
          "Some competitions publish their own variations (for example how forfeits are treated). The competition's playing conditions always take precedence.",
        ],
      },
      {
        type: "p",
        text: "For the background and a worked example with three matches, read [net run rate explained](/guides/net-run-rate-explained).",
      },
    ],
  },
  {
    slug: "required-run-rate-calculator",
    title: "Required Run Rate Calculator",
    description:
      "Enter the target, the chasing side's score and the overs bowled to see runs needed, balls left, the current run rate and the required run rate.",
    intro:
      "Use this during a chase. Enter the target (the first-innings total plus one, or a revised DLS target), the chasing side's current score, the overs bowled so far and the overs available, and the calculator shows what is needed from the balls that remain.",
    blocks: [
      { type: "h2", text: "Reading the result" },
      {
        type: "p",
        text: "**Runs needed** is the target minus the current score. **Balls left** is the innings length minus the balls already bowled, counting 15.4 overs as 15 overs and 4 balls. The **required run rate** is runs needed divided by the overs left, and the **current run rate** is the score divided by the overs bowled. When the required rate is well above the current rate, the chasing side has to accelerate; when it is below, the side can afford to protect wickets.",
      },
      {
        type: "p",
        text: "Run rates hide how many wickets are left, which matters as much as the rate itself. Needing 10 an over with eight wickets in hand is a very different chase from needing 10 an over with two. Our guide to [run rate and required run rate](/guides/run-rate-and-required-run-rate-explained) goes through how to read a chase.",
      },
      { type: "h2", text: "Targets in shortened matches" },
      {
        type: "p",
        text: "If rain has reduced the overs, use the revised target and the revised number of overs that the umpires announce. Those come from the DLS method, which this calculator does not compute; the [DLS guide](/guides/dls-method-explained) explains how they are set.",
      },
    ],
  },
  {
    slug: "batting-and-bowling-average-calculator",
    title: "Batting and Bowling Average Calculator",
    description:
      "Calculate batting average and strike rate, and bowling average, economy rate and strike rate, from a player's raw figures.",
    intro:
      "Enter a player's runs, dismissals and balls faced to get a batting average and strike rate, or runs conceded, wickets and balls bowled to get a bowling average, economy rate and bowling strike rate. Overs can be entered in cricket notation, for example 9.3.",
    blocks: [
      { type: "h2", text: "The formulas" },
      {
        type: "ul",
        items: [
          "**Batting average** = runs ÷ times dismissed. Not-out innings add runs but no dismissal, which is why a batter with no dismissals has no average yet.",
          "**Batting strike rate** = runs × 100 ÷ balls faced: the runs scored per 100 balls.",
          "**Bowling average** = runs conceded ÷ wickets: the runs each wicket cost.",
          "**Economy rate** = runs conceded ÷ overs bowled: the runs conceded per over.",
          "**Bowling strike rate** = balls bowled ÷ wickets: how many balls each wicket took.",
        ],
      },
      { type: "h2", text: "Using the numbers sensibly" },
      {
        type: "p",
        text: "Each figure answers a different question, and what counts as good depends on the format. A Test bowler is judged mainly on average and strike rate, a T20 bowler as much on economy. Small samples mislead: an average from five innings says little. Our guide to [batting average, strike rate and economy](/guides/batting-average-strike-rate-economy-explained) explains what each number does and does not tell you.",
      },
    ],
  },
];

function getTool(slug) {
  return TOOLS.find(t => t.slug === slug) || null;
}

module.exports = { TOOLS, getTool };
