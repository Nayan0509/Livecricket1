const handler = require('../api/index.js');

async function testNews() {
  const req = {
    method: 'GET',
    url: '/news',
    headers: { 'user-agent': 'googlebot', host: 'localhost' }
  };
  const res = {
    setHeader() {},
    status(c) { return this; },
    send(body) {
      console.log('Includes Editorial Masterclass?', body.includes('Editorial Masterclass'));
      const h2Matches = body.match(/<h2[^>]*>.*?<\/h2>/gi) || [];
      console.log('H2 elements:', h2Matches);
      console.log('Total length:', body.length);
      console.log('Body snippet (1000 to 2000 chars):');
      console.log(body.slice(1000, 2000));
    }
  };
  await handler(req, res);
}

testNews();
