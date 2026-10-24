// Dated correction notes, shown at the foot of each guide (see the
// corrections section of the editorial policy in ../pages.js). Keyed by
// guide slug, oldest first. guides/index.js moves a guide's "Last reviewed"
// date to its latest correction automatically.
//
// Add a note whenever a published guide's facts change. Wording or layout
// edits that change no fact do not need one.

const CORRECTIONS = {
  "how-to-read-a-cricket-scorecard": [
    { date: "24 October 2026", text: "A side that chooses to field is usually recorded as having \"elected to field\", not \"elected to bowl\". The example fall-of-wickets line is now labelled as invented." },
  ],
  "cricket-formats-explained-test-odi-t20": [
    { date: "24 October 2026", text: "Updated the ODI ball rule: since July 2025 two new balls are used until the end of the 34th over, after which the fielding side keeps one. Corrected the start of T20 internationals (women in 2004, men in 2005), that Tests can be scheduled for four days, that The Hundred counts in T20 records, and that List A matches are at least 40 overs a side." },
  ],
  "ways-of-getting-out-in-cricket": [
    { date: "24 October 2026", text: "Corrected four rules: a catch that lodges in a fielder's helmet or clothing can be fair; since 2022 the new batter goes to the striker's end after a catch; the timed-out limit is two minutes in Tests and ODIs and 90 seconds in T20Is; and a batter who retires can resume only with the opposing captain's consent under the Laws, and not at all under ICC playing conditions. Removed an unsupported statement about bails." },
  ],
  "cricket-fielding-positions-explained": [
    { date: "24 October 2026", text: "The example Test field listed ten fielders and now lists nine. Corrected the T20 fielding-circle rule (at most five fielders outside the circle after the powerplay) and the origin of the leg-side fielder limit, which dates from around 1960, not the 1930s." },
  ],
  "bowling-types-swing-seam-spin-explained": [
    { date: "24 October 2026", text: "Corrected the bouncer limits: two per over in Tests and ODIs and one in T20Is, with some leagues, including the IPL since 2024, allowing two." },
  ],
  "cricket-glossary": [
    { date: "24 October 2026", text: "Added hit wicket to the free-hit entry, corrected the sightscreen entry (white for a red ball, black for a white ball), defined the death overs by format and added the day-night order of tea and dinner." },
  ],
  "dls-method-explained": [
    { date: "24 October 2026", text: "The net run rate note had the sides reversed: in a DLS-affected match it is the side batting first that is credited with one run fewer than the revised target. Corrected when a tie goes to a Super Over." },
  ],
  "net-run-rate-explained": [
    { date: "24 October 2026", text: "The DLS rule had the sides reversed: it is the side batting first that is credited with one run fewer than the revised target, from the overs the chasing side was set, or with the par score if play was abandoned. Added that most competitions rank teams level on points by wins before net run rate." },
  ],
  "drs-explained": [
    { date: "24 October 2026", text: "Corrected the history of review allowances, that umpire's call applies to impact and to hitting the wicket but not to where the ball pitched, and that a review can end in a different mode of dismissal. Hot Spot is now described as optional, and DRS as used in much of international cricket rather than almost all." },
  ],
  "powerplay-and-fielding-restrictions-explained": [
    { date: "24 October 2026", text: "Corrected who calls a fielding-restriction no-ball (the square-leg umpire), the penalty for unfair fielder movement (five runs), the shortened-match powerplay lengths (counted to the nearest ball since 2025) and the dates of the in-match over-rate penalty (T20Is from 2022, ODIs from 2023)." },
  ],
  "super-over-and-tie-breakers-explained": [
    { date: "24 October 2026", text: "Corrected the first double Super Over in a men's T20I (India v Afghanistan, January 2024), when the boundary-count rule was dropped (October 2019), the Super Over batting rules, and the order of points-table tie-breakers, which varies by competition." },
  ],
  "follow-on-and-declarations-explained": [
    { date: "24 October 2026", text: "Added that under the 2026 Laws a side cannot declare or forfeit the final innings of a match, and corrected the wording for one-day matches, which are not first-class." },
  ],
  "pitch-and-conditions-explained": [
    { date: "24 October 2026", text: "Corrected the ICC pitch-rating system: unsatisfactory and unfit ratings earn demerit points that stay active for five years, and six points bring a 12-month suspension." },
  ],
  "icc-rankings-explained": [
    { date: "24 October 2026", text: "Reworded three points to match the ICC's own description: batters are rated against the opposition's bowling attack as a whole, not-out innings earn a bonus, and bowlers earn some credit for workload." },
  ],
  "world-test-championship-points-system": [
    { date: "24 October 2026", text: "Corrected when percentage ranking began (partway through the first cycle) and gave the full tie-breaker order: series won, then points percentage in away matches, then the ICC Test ranking." },
  ],
  "how-the-ipl-works": [
    { date: "24 October 2026", text: "Teams level on points are separated first by the number of wins and only then by net run rate. The Impact Player rule allows five named substitutes, brought on before an innings, at the end of an over or when a wicket falls, not at any point." },
  ],
};

module.exports = { CORRECTIONS };
