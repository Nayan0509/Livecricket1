// Guides library. Each guide has the shape:
//   { slug, title, category, description, related: [slug], blocks: [block] }
// Blocks use the schema documented at the top of ../pages.js.
// Shared by the React guide pages and api/render.js.

const { LAST_REVIEWED } = require("../pages");
const { CORRECTIONS } = require("./corrections");

const time = d => new Date(`${d} UTC`).getTime();

// Each guide gets its dated correction notes, and its "Last reviewed" date
// moves to the latest correction, as the editorial policy promises.
const GUIDES = [
  ...require("./cricketBasics"),
  ...require("./cricketRules"),
  ...require("./cricketCompetitions"),
  ...require("./cricketLaws"),
].map(g => {
  const corrections = CORRECTIONS[g.slug] || [];
  const dates = [g.reviewed || LAST_REVIEWED, ...corrections.map(c => c.date)];
  const reviewed = dates.reduce((a, b) => (time(b) > time(a) ? b : a));
  return { ...g, reviewed, corrections };
});

const GUIDE_CATEGORIES = [...new Set(GUIDES.map(g => g.category))];

function getGuide(slug) {
  return GUIDES.find(g => g.slug === slug) || null;
}

module.exports = { GUIDES, GUIDE_CATEGORIES, getGuide };
