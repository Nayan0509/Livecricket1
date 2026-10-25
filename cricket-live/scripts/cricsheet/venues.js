// Venue-name normalisation for the Cricsheet pipeline.
//
// Cricsheet spells the same ground several ways ("Eden Gardens", "Eden Gardens, Kolkata",
// "Kensington Oval, Bridgetown, Barbados"), and its venue identifiers (registry.venues) exist
// only in the newest files, so grounds are grouped by name here:
//   1. The leading part of the name (text before the first comma) is reduced to a compact key:
//      lower case, accents and a leading "The" removed, every non-alphanumeric dropped
//      ("M.Chinnaswamy Stadium" and "M Chinnaswamy Stadium" -> "mchinnaswamystadium").
//   2. A short, explicit alias table maps known renames and misspellings to one key.
//   3. Variants with the same key are merged only when their place words (the later comma
//      parts plus info.city) overlap, so "County Ground, Bristol" and "County Ground, Derby"
//      stay apart. A variant with no place at all joins the group only when the group has
//      exactly one place cluster; otherwise it is kept separate.
// Anything not covered by these rules is kept separate.
"use strict";

function compact(s) {
  return String(s || "")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .trim()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]/g, "");
}

// Renames and spelling variants seen in the Cricsheet data (keys are compact()).
// Each entry is the same physical ground; the target is the current name.
const LEAD_ALIASES = {
  beausejourstadium: "darensammynationalcricketstadium",          // St Lucia, renamed 2016
  darrensammynationalcricketstadium: "darensammynationalcricketstadium", // misspelling
  bharatratnashriatalbiharivajpaiekanacricketstadium: "bharatratnashriatalbiharivajpayeeekanacricketstadium",
  ferozshahkotla: "arunjaitleystadium",                            // Delhi, renamed 2019
  sardarpatelstadium: "narendramodistadium",                       // Motera, Ahmedabad
  sardarpatelgujaratstadium: "narendramodistadium",
  jadestadium: "amistadium",                                       // Lancaster Park, Christchurch
  lancasterpark: "amistadium",
  bolandbankpark: "bolandpark",                                    // Paarl
  debeersdiamondoval: "diamondoval",                               // Kimberley
  goodyearpark: "mangaungoval",                                    // Bloemfontein
  chevroletpark: "mangaungoval",
  outsuranceoval: "mangaungoval",
  khettaramastadium: "rpremadasastadium",                          // Colombo
  chittagongdivisionalstadium: "zahurahmedchowdhurystadium",       // Chattogram
  zohurahmedchowdhurystadium: "zahurahmedchowdhurystadium",
  wacaground: "westernaustraliacricketassociationground",          // Perth
  newwanderersstadium: "wanderersstadium",                         // Johannesburg
  cooperassociatescountyground: "countyground",                    // Taunton (city keeps it apart)
  royalandsunalliancecountyground: "countyground",                 // Bristol
  vracricketground: "vraground",                                   // Amstelveen
  westpacstadium: "skystadium",                                    // Wellington Regional Stadium
  punjabcricketassociationstadium: "punjabcricketassociationisbindrastadium", // Mohali
  vidarbhacaground: "vidarbhacricketassociationground",            // old VCA Ground, Nagpur
  sinhalesesportsclub: "sinhalesesportsclubground",
  sheikhzayedstadium: "zayedcricketstadium",                       // Abu Dhabi
  sharjahcricketassociationstadium: "sharjahcricketstadium",
  psaravanamuttustadium: "psaraoval",                              // Colombo
  andhracricketassociationvisakhapatnamdistrictcricketassociationstadium: "drysrajasekharareddyacavdcacricketstadium",
  choicemoosastadium: "moosacricketstadium",                       // Pearland
  simondsstadium: "gmhbastadium",                                  // Kardinia Park, Geelong
  subrataroysaharastadium: "maharashtracricketassociationstadium",
  niranjanshahstadium: "saurashtracricketassociationstadium",      // Rajkot
  oval: "kenningtonoval",                                          // "The Oval", London
  malahide: "village",                                             // "The Village, Malahide"
  gahangainternationalcricketstadiumrwanda: "gahangainternationalcricketstadium",
  sherebanglanationalcricketstadium: "sherebanglanationalstadium", // Mirpur
  tafawabalewasquaretbscricketoval: "tafawabalewasquarecricketoval", // Lagos
};

// Names other sites use for grounds that Cricsheet names differently. Used only for lookup.
const LOOKUP_ALIASES = {
  gabba: "brisbanecricketground",
  optusstadium: "perthstadium",
  kiaoval: "kenningtonoval",
  ageasbowl: "rosebowl",
  utilitabowl: "rosebowl",
  marvelstadium: "docklandsstadium",
  etihadstadium: "docklandsstadium",
  emiratesriverside: "riversideground",
  seatuniqueriverside: "riversideground",
  swalecstadium: "sophiagardens",
  emiratesoldtrafford: "oldtrafford",
  lordscricketground: "lords",
};

// Renamed or variant city spellings (keys are compact()).
const PLACE_ALIASES = {
  chittagong: "chattogram",
  bangalore: "bengaluru",
  portelizabeth: "gqeberha",
  poona: "pune",
  dharmasala: "dharamsala",
  pallekele: "kandy",
  bombay: "mumbai",
  madras: "chennai",
  calcutta: "kolkata",
};

// A later comma part that names a separate ground ("..., Academy Ground") is not a place.
const SUB_GROUND = /\b(ground|oval|field|academy|turf|no\s*\d+)\b/i;

function splitVenue(venue, city) {
  const raw = String(venue || "").trim();
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  let leadText = parts[0] || raw;
  let rest = parts.slice(1);
  if (rest.some((p) => SUB_GROUND.test(p))) { leadText = raw; rest = []; }
  let lead = compact(leadText);
  lead = LEAD_ALIASES[lead] || lead;
  const places = new Set();
  for (const p of rest.concat(city ? [city] : [])) {
    const k = compact(p);
    if (k) places.add(PLACE_ALIASES[k] || k);
  }
  return { lead, leadText, places };
}

// variants: array of { key, venue, city, count, lastDate }.
// Returns { clusterOf: Map(variantKey -> clusterIndex), clusters: [{ lead, variants: [...] }] }.
function clusterVenues(variants) {
  const byLead = new Map();
  for (const v of variants) {
    const s = splitVenue(v.venue, v.city);
    Object.assign(v, s);
    if (!byLead.has(s.lead)) byLead.set(s.lead, []);
    byLead.get(s.lead).push(v);
  }

  const clusters = [];
  const clusterOf = new Map();
  for (const [lead, list] of byLead) {
    const withPlace = list.filter((v) => v.places.size > 0);
    const noPlace = list.filter((v) => v.places.size === 0);
    // Union-find over variants that share any place word.
    const parent = withPlace.map((_, i) => i);
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    for (let i = 0; i < withPlace.length; i++) {
      for (let j = i + 1; j < withPlace.length; j++) {
        for (const p of withPlace[i].places) {
          if (withPlace[j].places.has(p)) { parent[find(j)] = find(i); break; }
        }
      }
    }
    const groups = new Map();
    withPlace.forEach((v, i) => {
      const r = find(i);
      if (!groups.has(r)) groups.set(r, []);
      groups.get(r).push(v);
    });
    const leadClusters = [...groups.values()];
    if (noPlace.length) {
      if (leadClusters.length === 1) leadClusters[0].push(...noPlace);
      else leadClusters.push(noPlace); // none, or ambiguous: keep the place-less names apart
    }
    for (const vs of leadClusters) {
      const idx = clusters.length;
      clusters.push({ lead, variants: vs, ambiguous: leadClusters.length > 1 });
      for (const v of vs) clusterOf.set(v.key, idx);
    }
  }
  return { clusterOf, clusters };
}

function lookupKeys(lead) {
  const keys = new Set([lead]);
  for (const [from, to] of Object.entries(LEAD_ALIASES)) if (to === lead) keys.add(from);
  for (const [from, to] of Object.entries(LOOKUP_ALIASES)) if (to === lead) keys.add(from);
  return [...keys];
}

module.exports = { compact, splitVenue, clusterVenues, lookupKeys, LEAD_ALIASES, LOOKUP_ALIASES, PLACE_ALIASES };
