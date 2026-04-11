/**
 * SEO Routes — Dynamic sitemap, meta tags, structured data
 */

const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const scraper = require('../utils/scraper');
const {
  generateDynamicSitemap,
  generateMatchMetaTags,
  generatePlayerMetaTags,
  generateMatchStructuredData,
  saveSitemap
} = require('../utils/seoAutomation');
const { submitToIndexNow } = require('../utils/indexnow');

const seoCache = new NodeCache({ stdTTL: 300 }); // 5-min cache

// ─── Dynamic Sitemap ──────────────────────────────────────────────────────────
// Served at /api/seo/sitemap.xml — proxy this from your CDN/Vercel to /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const cached = seoCache.get('sitemap');
    if (cached) {
      res.header('Content-Type', 'application/xml');
      res.header('Cache-Control', 'public, max-age=300');
      return res.send(cached);
    }

    // Pull live data from scraper
    let matches = [], series = [];
    try {
      const allData = await scraper.getAllMatches();
      matches = [
        ...(allData.live || []),
        ...(allData.recent || []),
        ...(allData.upcoming || []),
      ];
    } catch (_) {}

    const sitemap = await generateDynamicSitemap(matches, [], [], series);
    seoCache.set('sitemap', sitemap);

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=300');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// ─── Match Meta Tags ──────────────────────────────────────────────────────────
router.get('/meta/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const cacheKey = `meta_match_${matchId}`;
    const cached = seoCache.get(cacheKey);
    if (cached) return res.json(cached);

    let match = {};
    try { match = await scraper.scrapeMatchInfo(matchId); } catch (_) {}

    const metaTags = generateMatchMetaTags(match);
    const structuredData = generateMatchStructuredData(match);
    const result = { success: true, metaTags, structuredData };

    seoCache.set(cacheKey, result, 60);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Player Meta Tags ─────────────────────────────────────────────────────────
router.get('/meta/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    const player = { name: playerId.replace(/-/g, ' '), team: 'International Cricket' };
    const metaTags = generatePlayerMetaTags(player);
    res.json({ success: true, metaTags });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Regenerate & Save Sitemap + Submit to IndexNow ──────────────────────────
router.post('/regenerate-sitemap', async (req, res) => {
  try {
    let matches = [], series = [];
    try {
      const allData = await scraper.getAllMatches();
      matches = [
        ...(allData.live || []),
        ...(allData.recent || []),
        ...(allData.upcoming || []),
      ];
    } catch (_) {}

    const sitemap = await generateDynamicSitemap(matches, [], [], series);
    await saveSitemap(sitemap);
    seoCache.del('sitemap');

    // Auto-submit new match URLs to IndexNow
    const newMatchUrls = matches.slice(0, 20).map(m => {
      const t1 = (m.teams?.[0] || 'team1').toLowerCase().replace(/\s+/g, '-');
      const t2 = (m.teams?.[1] || 'team2').toLowerCase().replace(/\s+/g, '-');
      return `https://www.livecricketzone.com/match/${t1}-vs-${t2}-${m.id}`;
    });
    if (newMatchUrls.length) {
      submitToIndexNow(newMatchUrls).catch(() => {});
    }

    res.json({ success: true, message: `Sitemap regenerated with ${matches.length} matches`, matchCount: matches.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
