// Site-wide constants shared by the React app and the Vercel renderer
// (api/render.js). CommonJS on purpose: webpack (CRA) and Node both load it,
// so there is exactly one source of truth for names, URLs and contact details.

const SITE_NAME = "Live Cricket Zone";
const SITE_URL = "https://www.livecricketzone.com";
const CONTACT_EMAIL = "contact@livecricketzone.com";
const TWITTER = "@LiveCricketZone";

// One honest sentence about what the site is. Reused in meta descriptions,
// the About page and the Organization schema so the story is consistent.
const SITE_TAGLINE =
  "Live scores, scorecards and plain-English guides to cricket, football, basketball and tennis.";

// Primary navigation, shared by the SPA header and the server-rendered header
// so a crawler and a visitor see the same links.
const NAV_PRIMARY = [
  { to: "/live", label: "Live" },
  { to: "/guides", label: "Guides" },
  { to: "/schedule", label: "Schedule" },
  { to: "/results", label: "Results" },
  { to: "/news", label: "News" },
  { to: "/rankings", label: "Rankings" },
  { to: "/series", label: "Series" },
  { to: "/games", label: "Games" },
];

const NAV_CRICKET = [
  { to: "/ipl", label: "IPL" },
  { to: "/t20-world-cup", label: "T20 World Cup" },
  { to: "/world-cup", label: "ODI World Cup" },
  { to: "/champions-trophy", label: "Champions Trophy" },
  { to: "/asia-cup", label: "Asia Cup" },
  { to: "/psl", label: "PSL" },
  { to: "/bbl", label: "BBL" },
  { to: "/cpl", label: "CPL" },
  { to: "/bpl", label: "BPL" },
  { to: "/county-championship", label: "County Championship" },
  { to: "/womens-cricket", label: "Women's Cricket" },
  { to: "/test", label: "Test Cricket" },
  { to: "/odi", label: "ODI Cricket" },
  { to: "/t20", label: "T20 Cricket" },
];

const NAV_SPORTS = [
  { to: "/football", label: "Football" },
  { to: "/basketball", label: "Basketball" },
  { to: "/tennis", label: "Tennis" },
];

const NAV_MORE = [
  { to: "/upcoming", label: "Upcoming" },
  { to: "/teams", label: "Teams" },
  { to: "/players", label: "Players" },
  { to: "/stats", label: "Stats" },
  { to: "/videos", label: "Highlights" },
  { to: "/fantasy", label: "Fantasy" },
];

const NAV_LEGAL = [
  { to: "/about", label: "About" },
  { to: "/editorial-policy", label: "Editorial Policy" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-of-use", label: "Terms of Use" },
  { to: "/dmca-copyright", label: "DMCA / Copyright" },
];

module.exports = {
  SITE_NAME,
  SITE_URL,
  CONTACT_EMAIL,
  TWITTER,
  SITE_TAGLINE,
  NAV_PRIMARY,
  NAV_CRICKET,
  NAV_SPORTS,
  NAV_MORE,
  NAV_LEGAL,
};
