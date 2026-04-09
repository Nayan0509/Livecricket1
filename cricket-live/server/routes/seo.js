/**
 * SEO Routes
 * Dynamic sitemap generation and SEO utilities
 */

const express = require('express');
const router = express.Router();
const {
  generateDynamicSitemap,
  generateMatchMetaTags,
  generatePlayerMetaTags,
  generateMatchStructuredData,
  saveSitemap
} = require('../utils/seoAutomation');

// Dynamic sitemap endpoint
router.get('/sitemap.xml', async (req, res) => {
  try {
    // Fetch current data (replace with your actual data fetching)
    const matches = []; // Fetch from your API
    const players = []; // Fetch from your API
    const teams = []; // Fetch from your API
    const series = []; // Fetch from your API
    
    const sitemap = await generateDynamicSitemap(matches, players, teams, series);
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Get meta tags for match
router.get('/meta/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    
    // Fetch match data (replace with your actual data fetching)
    const match = {}; // Fetch from your API
    
    const metaTags = generateMatchMetaTags(match);
    const structuredData = generateMatchStructuredData(match);
    
    res.json({
      success: true,
      metaTags,
      structuredData
    });
  } catch (error) {
    console.error('Meta tags generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get meta tags for player
router.get('/meta/player/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    
    // Fetch player data (replace with your actual data fetching)
    const player = {}; // Fetch from your API
    
    const metaTags = generatePlayerMetaTags(player);
    
    res.json({
      success: true,
      metaTags
    });
  } catch (error) {
    console.error('Meta tags generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Trigger sitemap regeneration
router.post('/regenerate-sitemap', async (req, res) => {
  try {
    const matches = []; // Fetch from your API
    const players = []; // Fetch from your API
    const teams = []; // Fetch from your API
    const series = []; // Fetch from your API
    
    const sitemap = await generateDynamicSitemap(matches, players, teams, series);
    await saveSitemap(sitemap);
    
    res.json({
      success: true,
      message: 'Sitemap regenerated successfully'
    });
  } catch (error) {
    console.error('Sitemap regeneration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
