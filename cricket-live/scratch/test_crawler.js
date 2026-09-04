const handler = require('../api/index.js');

const pagesToTest = [
  { url: '/', expect: ['Live Cricket Action Today', 'In-Depth Tactical Analysis', 'Frequently Asked Questions (FAQ)'] },
  { url: '/privacy-policy', expect: ['Google AdSense and DoubleClick DART Cookies', 'California Consumer Privacy Act (CCPA)', 'General Data Protection Regulation (GDPR)'] },
  { url: '/about', expect: ['Editorial Leadership', 'Arjun Mehta', 'Our Editorial Mission'] },
  { url: '/contact', expect: ['editorial@livecricketzone.com', 'privacy@livecricketzone.com', 'Editorial Inquiries'] },
  { url: '/editorial-policy', expect: ['Fact-Checking', 'Transparent Corrections Policy', 'Journalistic Principles'] },
  { url: '/terms-of-use', expect: ['Terms of Use', 'Intellectual Property Rights', 'legal@livecricketzone.com'] },
  { url: '/dmca-copyright', expect: ['DMCA Copyright Policy', 'Digital Millennium Copyright Act', 'dmca@livecricketzone.com'] },
  { url: '/ipl', expect: ['Indian Premier League', 'IPL 2026'] },
  { url: '/t20-world-cup', expect: ['T20 World Cup 2026', 'Competing Nations', 'All-Time T20 World Cup Records'] },
  { url: '/county-championship', expect: ['County Championship 2026', 'First-Class Counties', 'County Championship Historic Milestones'] },
  { url: '/bbl', expect: ['Big Bash League', 'BBL'] },
  { url: '/news', expect: ['In-House Cricket Editorial', 'Tactical Masterclasses'] },
  { url: '/ads.txt', expect: ['google.com, pub-8179151029580359, DIRECT, f08c47fec0942fa0'] }
];

async function runTests() {
  console.log('--- STARTING GOOGLEBOT CRAWLER SIMULATION TEST ---');
  let allPassed = true;

  for (const item of pagesToTest) {
    let statusCode = 0;
    let headers = {};
    let responseBody = '';

    const req = {
      method: 'GET',
      url: item.url,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'host': 'www.livecricketzone.com'
      }
    };

    const res = {
      setHeader(k, v) { headers[k.toLowerCase()] = v; },
      status(c) { statusCode = c; return this; },
      send(b) { responseBody = b; return this; },
      end(b) { if (b) responseBody = b; return this; },
      json(j) { responseBody = JSON.stringify(j); return this; }
    };

    try {
      await handler(req, res);
      const wordCount = responseBody.split(/\s+/).filter(Boolean).length;
      const charCount = responseBody.length;

      const missingExpectations = item.expect.filter(e => !responseBody.includes(e));

      if (statusCode === 200 && missingExpectations.length === 0) {
        console.log(`✅ [${item.url}] Status: 200 | Words: ${wordCount} | Chars: ${charCount} | All expectations met`);
      } else {
        allPassed = false;
        console.error(`❌ [${item.url}] Failed! Status: ${statusCode}, Missing: ${missingExpectations.join(', ')}`);
        console.error(`   Sample of body (first 300 chars): ${responseBody.slice(0, 300)}`);
      }
    } catch (err) {
      allPassed = false;
      console.error(`💥 [${item.url}] Error:`, err.message);
    }
  }

  console.log('--- TEST FINISHED. ALL PASSED:', allPassed, '---');
  process.exit(allPassed ? 0 : 1);
}

runTests();
