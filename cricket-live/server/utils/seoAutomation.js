/**
 * SEO Automation Utilities
 * Automates sitemap generation, IndexNow submissions, and meta tag generation
 */

const fs = require('fs').promises;
const path = require('path');

// Generate dynamic sitemap with all matches, players, teams
async function generateDynamicSitemap(matches, players, teams, series) {
  const baseUrl = 'https://www.livecricketzone.com';
  const now = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
    <lastmod>${now}</lastmod>
  </url>

  <!-- High Priority Pages -->
  <url>
    <loc>${baseUrl}/live</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
    <lastmod>${now}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/live-cricket-score</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
    <lastmod>${now}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/cricket-score-today</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
    <lastmod>${now}</lastmod>
  </url>

  <url>
    <loc>${baseUrl}/ball-by-ball</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
    <lastmod>${now}</lastmod>
  </url>
`;

  // Add match pages
  if (matches && matches.length > 0) {
    matches.forEach(match => {
      const matchUrl = generateMatchUrl(match);
      const priority = match.status === 'live' ? '1.0' : '0.9';
      const changefreq = match.status === 'live' ? 'always' : 'hourly';
      
      sitemap += `
  <url>
    <loc>${baseUrl}${matchUrl}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${now}</lastmod>
  </url>`;
    });
  }

  // Add player pages
  if (players && players.length > 0) {
    players.forEach(player => {
      const playerSlug = slugify(player.name);
      sitemap += `
  <url>
    <loc>${baseUrl}/player/${playerSlug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${now}</lastmod>
  </url>`;
    });
  }

  // Add team pages
  if (teams && teams.length > 0) {
    teams.forEach(team => {
      const teamSlug = slugify(team.name);
      sitemap += `
  <url>
    <loc>${baseUrl}/team/${teamSlug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${now}</lastmod>
  </url>`;
    });
  }

  // Add series pages
  if (series && series.length > 0) {
    series.forEach(s => {
      const seriesSlug = slugify(s.name);
      sitemap += `
  <url>
    <loc>${baseUrl}/series/${seriesSlug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${now}</lastmod>
  </url>`;
    });
  }

  sitemap += '\n</urlset>';
  
  return sitemap;
}

// Generate SEO-friendly match URL
function generateMatchUrl(match) {
  const team1 = slugify(match.team1 || match.teams?.[0] || 'team1');
  const team2 = slugify(match.team2 || match.teams?.[1] || 'team2');
  const tournament = slugify(match.tournament || match.series || 'cricket');
  const matchId = match.id || match.matchId;
  
  return `/match/${tournament}-${team1}-vs-${team2}-${matchId}`;
}

// Generate meta tags for match pages
function generateMatchMetaTags(match) {
  const team1 = match.team1 || match.teams?.[0] || 'Team 1';
  const team2 = match.team2 || match.teams?.[1] || 'Team 2';
  const tournament = match.tournament || match.series || 'Cricket Match';
  const status = match.status || 'upcoming';
  
  let title, description;
  
  if (status === 'live') {
    title = `${team1} vs ${team2} Live Score - ${tournament} Live Cricket Score Today`;
    description = `Watch ${team1} vs ${team2} live cricket score today. Get ball-by-ball commentary, live scorecard, match updates for ${tournament}. Real-time cricket score updated every 15 seconds.`;
  } else if (status === 'completed') {
    title = `${team1} vs ${team2} Scorecard - ${tournament} Match Result`;
    description = `${team1} vs ${team2} full scorecard and match result. View complete ${tournament} match summary, player stats, and highlights.`;
  } else {
    title = `${team1} vs ${team2} - ${tournament} Match Schedule & Preview`;
    description = `${team1} vs ${team2} ${tournament} match schedule, preview, team news, and predictions. Get match timings, venue details, and live score updates.`;
  }
  
  const keywords = `${team1} vs ${team2}, ${tournament} live score, ${team1} ${team2} live, cricket live score, ${tournament} 2026, live cricket score today, ball by ball commentary, cricket scorecard`;
  
  return { title, description, keywords };
}

// Generate meta tags for player pages
function generatePlayerMetaTags(player) {
  const name = player.name || 'Cricket Player';
  const team = player.team || 'International Cricket';
  const role = player.role || 'Player';
  
  const title = `${name} Stats, Records & Profile - ${team} ${role}`;
  const description = `${name} complete cricket statistics, career records, batting and bowling averages, recent form, and profile. View ${name}'s performance in IPL 2026, T20 World Cup, ODI and Test cricket.`;
  const keywords = `${name}, ${name} stats, ${name} records, ${name} cricket, ${team}, cricket player stats, ${name} batting average, ${name} bowling average, ${name} IPL 2026`;
  
  return { title, description, keywords };
}

// Generate structured data for match
function generateMatchStructuredData(match) {
  const team1 = match.team1 || match.teams?.[0] || 'Team 1';
  const team2 = match.team2 || match.teams?.[1] || 'Team 2';
  const tournament = match.tournament || match.series || 'Cricket Match';
  const venue = match.venue || 'Cricket Stadium';
  const date = match.date || new Date().toISOString();
  
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${team1} vs ${team2}`,
    "description": `${tournament} - ${team1} vs ${team2} live cricket match`,
    "startDate": date,
    "location": {
      "@type": "Place",
      "name": venue
    },
    "competitor": [
      {
        "@type": "SportsTeam",
        "name": team1
      },
      {
        "@type": "SportsTeam",
        "name": team2
      }
    ],
    "sport": "Cricket",
    "organizer": {
      "@type": "SportsOrganization",
      "name": tournament
    }
  };
}

// Slugify function
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Auto-submit to IndexNow when content updates
async function autoSubmitToIndexNow(urls) {
  const { submitToIndexNow } = require('./indexnow');
  
  try {
    await submitToIndexNow(urls);
    console.log(`✅ Auto-submitted ${urls.length} URLs to IndexNow`);
  } catch (error) {
    console.error('❌ IndexNow auto-submit failed:', error.message);
  }
}

// Generate long-tail keyword pages
function generateLongTailPages() {
  const templates = [
    // Today pages
    { url: '/cricket-matches-today', title: 'Cricket Matches Today - Live Cricket Schedule & Timings', priority: 1.0 },
    { url: '/cricket-score-today', title: 'Cricket Score Today - Live Cricket Scores & Updates', priority: 1.0 },
    { url: '/ipl-match-today', title: 'IPL Match Today - IPL 2026 Live Score & Schedule', priority: 0.95 },
    { url: '/cricket-news-today', title: 'Cricket News Today - Latest Cricket Updates & Headlines', priority: 0.9 },
    
    // Comparison pages
    { url: '/cricbuzz-vs-espncricinfo-alternative', title: 'Best Alternative to Cricbuzz & ESPNcricinfo - Faster Cricket Scores', priority: 0.85 },
    { url: '/fastest-cricket-score-website', title: 'Fastest Cricket Score Website - Real-Time Updates Every 15 Seconds', priority: 0.85 },
    { url: '/best-cricket-website-2026', title: 'Best Cricket Website 2026 - Live Scores, News & Stats', priority: 0.85 },
    
    // Format-specific
    { url: '/t20-cricket-live-score-today', title: 'T20 Cricket Live Score Today - T20 Match Updates', priority: 0.9 },
    { url: '/odi-cricket-live-score-today', title: 'ODI Cricket Live Score Today - One Day Match Updates', priority: 0.9 },
    { url: '/test-cricket-live-score-today', title: 'Test Cricket Live Score Today - Test Match Updates', priority: 0.85 },
    
    // Tournament-specific
    { url: '/ipl-2026-live-score-ball-by-ball', title: 'IPL 2026 Live Score Ball by Ball - Real-Time Commentary', priority: 0.95 },
    { url: '/t20-world-cup-2026-live-score', title: 'T20 World Cup 2026 Live Score - Latest Match Updates', priority: 0.95 },
    { url: '/ipl-2026-points-table-live', title: 'IPL 2026 Points Table Live - Team Standings & Rankings', priority: 0.9 },
    { url: '/ipl-2026-schedule-all-matches', title: 'IPL 2026 Schedule All Matches - Complete Fixtures & Timings', priority: 0.9 },
    
    // Player-specific
    { url: '/virat-kohli-stats-2026', title: 'Virat Kohli Stats 2026 - Career Records & Performance', priority: 0.85 },
    { url: '/rohit-sharma-ipl-2026', title: 'Rohit Sharma IPL 2026 - Stats, Scores & Performance', priority: 0.85 },
    
    // Feature-specific
    { url: '/cricket-ball-by-ball-commentary-live', title: 'Cricket Ball by Ball Commentary Live - Real-Time Updates', priority: 0.9 },
    { url: '/cricket-scorecard-live', title: 'Cricket Scorecard Live - Detailed Match Scorecards', priority: 0.9 },
    { url: '/cricket-live-streaming-free', title: 'Cricket Live Streaming Free - Watch Matches Online', priority: 0.85 },
  ];
  
  return templates;
}

// Save sitemap to file
async function saveSitemap(sitemap) {
  const sitemapPath = path.join(__dirname, '../../client/public/sitemap.xml');
  await fs.writeFile(sitemapPath, sitemap, 'utf8');
  console.log('✅ Sitemap generated and saved');
}

module.exports = {
  generateDynamicSitemap,
  generateMatchUrl,
  generateMatchMetaTags,
  generatePlayerMetaTags,
  generateMatchStructuredData,
  slugify,
  autoSubmitToIndexNow,
  generateLongTailPages,
  saveSitemap
};
