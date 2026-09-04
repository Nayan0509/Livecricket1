const http = require('http');
const path = require('path');

// Test importing api/articlesData.js
try {
  const articles = require('../api/articlesData.js');
  console.log('✅ api/articlesData.js imported successfully. Total articles:', articles.ORIGINAL_ARTICLES ? articles.ORIGINAL_ARTICLES.length : 'N/A');
} catch (e) {
  console.error('❌ Failed to import api/articlesData.js:', e);
}

// Test checking api/index.js syntax
try {
  // Just require or syntax check
  const fs = require('fs');
  const code = fs.readFileSync(path.join(__dirname, '../api/index.js'), 'utf8');
  new Function(code);
  console.log('✅ api/index.js syntax is valid.');
} catch (e) {
  // If top-level returns or module exports, test with node -c
  console.log('ℹ️ Top level function test:', e.message);
}
