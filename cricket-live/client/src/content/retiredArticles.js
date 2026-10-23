// Short "news" articles that used to live at /news/:id. They were retired
// because they were thin (70-200 words), carried bylines for analysts who do
// not exist, and showed dates that moved forward on every build. Each old URL
// now points at the guide or hub page that covers the same subject properly.
// Used by api/index.js (301 redirect) and pages/NewsDetail.jsx (SPA redirect).

const RETIRED_ARTICLES = {
  "ipl-2026-auction-tactical-breakdown": "/guides/how-the-ipl-works",
  "world-test-championship-2026-standings": "/guides/world-test-championship-points-system",
  "t20-world-cup-powerplay-batting-trends": "/guides/powerplay-and-fielding-restrictions-explained",
  "the-art-of-reverse-swing-physics-and-tactics": "/guides/bowling-types-swing-seam-spin-explained",
  "drs-ball-tracking-technology-in-cricket": "/guides/drs-explained",
  "death-overs-bowling-masterclass-yorker-vs-wide-line": "/guides/bowling-types-swing-seam-spin-explained",
  "the-evolution-of-womens-cricket-wpl-and-beyond": "/womens-cricket",
  "pitch-conditions-and-soil-types-subcontinent-vs-overseas": "/guides/pitch-and-conditions-explained",
  "champions-trophy-2025-tournament-preview-and-tactics": "/champions-trophy",
  "cricket-captaincy-field-placements-and-bowling-rotations": "/guides/cricket-fielding-positions-explained",
  "babar-azam-vs-virat-kohli-statistical-and-technical-comparison": "/guides/batting-average-strike-rate-economy-explained",
  "ipl-impact-player-rule-tactical-revolution": "/guides/how-the-ipl-works",
  "spin-bowling-variations-mystery-spin-decoded": "/guides/bowling-types-swing-seam-spin-explained",
  "county-cricket-development-pipeline-for-england-test-side": "/county-championship",
  "cricket-fantasy-strategy-mathematical-model-and-player-selection": "/fantasy",
  "odi-middle-overs-tactical-revolution": "/guides/cricket-formats-explained-test-odi-t20",
  "bbl-franchise-t20-leagues-pitch-evolution": "/bbl",
  "womens-cricket-renaissance-wpl-and-icc-growth": "/womens-cricket",
};

function retiredArticleTarget(id) {
  return RETIRED_ARTICLES[id] || "/guides";
}

module.exports = { RETIRED_ARTICLES, retiredArticleTarget };
