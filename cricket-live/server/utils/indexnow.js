const axios = require('axios');

// IndexNow API endpoint
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// Generate a simple API key (you can use any string, but keep it consistent)
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

/**
 * Submit URLs to IndexNow for instant indexing by Bing, Yandex, etc.
 * @param {string|string[]} urls - Single URL or array of URLs to submit
 * @param {string} host - Your domain (e.g., 'livecricketzone.com')
 */
async function submitToIndexNow(urls, host = 'livecricketzone.com') {
  try {
    const urlList = Array.isArray(urls) ? urls : [urls];
    
    const payload = {
      host: host,
      key: INDEXNOW_KEY,
      keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
      urlList: urlList
    };

    const response = await axios.post(INDEXNOW_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

    console.log(`✅ IndexNow submitted ${urlList.length} URLs:`, response.status);
    return { success: true, status: response.status };
  } catch (error) {
    console.error('❌ IndexNow submission failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Submit all important URLs at once (use on deployment)
 */
async function submitAllUrls() {
  const baseUrl = 'https://livecricketzone.com';
  
  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/live`,
    `${baseUrl}/live-cricket-score`,
    `${baseUrl}/cricket-score-today`,
    `${baseUrl}/ball-by-ball`,
    `${baseUrl}/ipl`,
    `${baseUrl}/t20-world-cup`,
    `${baseUrl}/world-cup`,
    `${baseUrl}/asia-cup`,
    `${baseUrl}/champions-trophy`,
    `${baseUrl}/womens-cricket`,
    `${baseUrl}/t20`,
    `${baseUrl}/odi`,
    `${baseUrl}/test`,
    `${baseUrl}/psl`,
    `${baseUrl}/bbl`,
    `${baseUrl}/cpl`,
    `${baseUrl}/bpl`,
    `${baseUrl}/schedule`,
    `${baseUrl}/upcoming`,
    `${baseUrl}/results`,
    `${baseUrl}/series`,
    `${baseUrl}/teams`,
    `${baseUrl}/players`,
    `${baseUrl}/rankings`,
    `${baseUrl}/news`,
    `${baseUrl}/stats`,
    `${baseUrl}/best-cricket-website`
  ];

  return await submitToIndexNow(urls);
}

module.exports = {
  submitToIndexNow,
  submitAllUrls,
  INDEXNOW_KEY
};
