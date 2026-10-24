// Guides library. Each guide has the shape:
//   { slug, title, category, description, related: [slug], blocks: [block] }
// Blocks use the schema documented at the top of ../pages.js.
// Shared by the React guide pages and api/render.js.

const { LAST_REVIEWED } = require("../pages");

const GUIDES = [
  ...require("./cricketBasics"),
  ...require("./cricketRules"),
  ...require("./cricketCompetitions"),
  ...require("./cricketLaws"),
].map(g => ({ reviewed: LAST_REVIEWED, ...g }));

const GUIDE_CATEGORIES = [...new Set(GUIDES.map(g => g.category))];

function getGuide(slug) {
  return GUIDES.find(g => g.slug === slug) || null;
}

module.exports = { GUIDES, GUIDE_CATEGORIES, getGuide };
