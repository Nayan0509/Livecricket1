const handler = require('../api/index.js');

const urls = ['/', '/privacy-policy', '/about', '/contact', '/editorial-policy', '/terms-of-use', '/dmca-copyright', '/ipl', '/news'];

async function testHumanUserAgent() {
  console.log('--- TESTING HUMAN BROWSER USER-AGENT ---');
  for (const url of urls) {
    let statusCode = 0;
    let headers = {};
    let body = '';

    const req = {
      method: 'GET',
      url,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'host': 'www.livecricketzone.com'
      }
    };

    const res = {
      setHeader(k, v) { headers[k.toLowerCase()] = v; },
      status(c) { statusCode = c; return this; },
      send(b) { body = b; return this; },
      end(b) { if (b) body = b; return this; },
      json(j) { body = JSON.stringify(j); return this; }
    };

    await handler(req, res);
    console.log(`[${url}] Status: ${statusCode} | Content-Type: ${headers['content-type']} | Length: ${body.length}`);
    if (headers['content-type'] && headers['content-type'].includes('json')) {
      console.log(`⚠️ RETURNED JSON FOR HUMAN BROWSER:`, body);
    } else {
      console.log(`   HTML Title snippet:`, body.slice(0, 300).replace(/\s+/g, ' '));
    }
  }
}

testHumanUserAgent();
