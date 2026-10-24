// Crawler parity test for api/index.js. Needs a client build (client/build).
// Every page URL is requested as Googlebot, as the AdSense crawler and as a
// browser; the three responses must be byte-identical (no cloaking), and each
// must carry the expected status, robots directive and text.
// Run: node scratch/test_crawler.js
const handler = require('../api/index.js');

const UAS = {
  googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  adsense: 'Mediapartners-Google',
  browser: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
};

const pages = [
  { url: '/', status: 200, expect: ['Live Cricket Scores, Scorecards &amp; Guides', 'Frequently asked questions'] },
  { url: '/about', status: 200, expect: ['What this site is', 'What we deliberately do not do'], reject: ['Arjun Mehta', 'David Richardson'] },
  { url: '/editorial-policy', status: 200, expect: ['Corrections', 'Content attributed to people who did not write it.'] },
  { url: '/guides', status: 200, expect: ['How to Read a Cricket Scorecard', 'How the IPL Works'] },
  { url: '/guides/dls-method-explained', status: 200, expect: ['Last reviewed', '<article>'] },
  { url: '/guides/icc-rankings-explained', status: 200, expect: ['<article>'] },
  { url: '/ipl', status: 200, expect: ['Indian Premier League', 'Chennai Super Kings'] },
  { url: '/psl', status: 200, expect: ['Pakistan Super League'], reject: ['Multan Sultans vs Karachi Kings'] },
  { url: '/rankings', status: 200, expect: ['ICC Cricket Rankings', 'Rating points are not averages'] },
  { url: '/live', status: 200, expect: ['Live Cricket Scores'] },
  { url: '/football', status: 200, noindex: true, expect: ['Football'] },
  { url: '/news', status: 200, noindex: true, expect: ['Cricket News Headlines'] },
  { url: '/videos', status: 200, noindex: true, expect: ['Cricket Highlights'] },
  { url: '/tools', status: 200, expect: ['Net Run Rate Calculator', 'Required Run Rate Calculator'] },
  { url: '/tools/net-run-rate-calculator', status: 200, expect: ['bowled out', 'one run fewer than the revised target'] },
  { url: '/tools/no-such-tool', status: 404, noindex: true, expect: [] },
  { url: '/privacy-policy', status: 200, expect: ['Game rooms', 'consent mode', 'Cookie settings'] },
  { url: '/terms-of-use', status: 200, expect: ['Accuracy of live data'] },
  { url: '/dmca-copyright', status: 200, expect: ['Counter-notice'] },
  { url: '/contact', status: 200, expect: ['contact@livecricketzone.com', 'Score correction'], reject: ['Message Received', '<form'] },
  { url: '/match/12345', status: 200, noindex: true, expect: [] },
  { url: '/no-such-page', status: 404, noindex: true, expect: [] },
];

const redirects = [
  ['/news/drs-ball-tracking-technology-in-cricket', '/guides/drs-explained'],
  ['/news/some-unknown-article', '/guides'],
  ['/watch-live', '/videos'],
  ['/cricket-website', '/about'],
  ['/county-cricket', '/county-championship'],
];

function call(url, ua) {
  return new Promise(resolve => {
    const out = { status: 0, headers: {}, body: '' };
    const res = {
      setHeader(k, v) { out.headers[k.toLowerCase()] = v; },
      status(c) { out.status = c; return this; },
      send(b) { out.body = b; resolve(out); return this; },
      end(b) { if (b) out.body = b; resolve(out); return this; },
      json(j) { out.body = JSON.stringify(j); resolve(out); return this; },
    };
    handler({ method: 'GET', url, headers: { 'user-agent': ua, host: 'www.livecricketzone.com' } }, res);
  });
}

const words = html => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .split(/\s+/).filter(Boolean).length;

async function run() {
  let failures = 0;
  const fail = msg => { failures++; console.error('FAIL ' + msg); };

  for (const p of pages) {
    const [bot, ads, human] = await Promise.all(Object.values(UAS).map(ua => call(p.url, ua)));
    if (bot.body !== human.body || ads.body !== human.body) fail(`${p.url}: response differs by user agent`);
    if (human.status !== p.status) fail(`${p.url}: status ${human.status}, expected ${p.status}`);
    const robots = (human.body.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || '';
    if (Boolean(p.noindex) !== robots.startsWith('noindex')) fail(`${p.url}: robots "${robots}"`);
    for (const e of p.expect) if (!human.body.includes(e)) fail(`${p.url}: missing "${e}"`);
    for (const r of p.reject || []) if (human.body.includes(r)) fail(`${p.url}: still contains "${r}"`);
    console.log(`${p.url.padEnd(34)} ${human.status}  ${robots.split(',')[0].padEnd(8)} ${String(words(human.body)).padStart(5)} words  identical=${bot.body === human.body && ads.body === human.body}`);
  }

  for (const [from, to] of redirects) {
    const r = await call(from, UAS.browser);
    if (r.status !== 301 || r.headers.location !== to) fail(`${from}: ${r.status} -> ${r.headers.location}, expected 301 -> ${to}`);
    else console.log(`${from.padEnd(34)} 301 -> ${to}`);
  }

  const sm = await call('/sitemap.xml', UAS.googlebot);
  const locs = sm.body.match(/<loc>[^<]+<\/loc>/g) || [];
  for (const bad of ['/football', '/basketball', '/tennis', '/news', '/videos', '/watch-live']) {
    if (locs.some(l => l.includes(bad))) fail(`sitemap still lists ${bad}`);
  }
  if (!locs.some(l => l.includes('/guides/how-the-ipl-works'))) fail('sitemap is missing guides');
  if (!locs.some(l => l.includes('/tools/net-run-rate-calculator'))) fail('sitemap is missing tools');

  // Only one contact address anywhere in the rendered pages.
  for (const p of pages) {
    const r = await call(p.url, UAS.browser);
    const addrs = [...new Set((r.body.match(/[a-z0-9._-]+@livecricketzone\.com/g) || []))];
    if (addrs.some(a => a !== 'contact@livecricketzone.com')) fail(`${p.url}: other addresses ${addrs}`);
  }
  const dupes = locs.filter((l, i) => locs.indexOf(l) !== i);
  if (dupes.length) fail(`sitemap has duplicates: ${dupes.join(', ')}`);
  console.log(`sitemap.xml: ${locs.length} URLs`);

  const robots = await call('/robots.txt', UAS.googlebot);
  if (!robots.body.includes('Sitemap: https://www.livecricketzone.com/sitemap.xml')) fail('robots.txt');

  const ads = await call('/ads.txt', UAS.browser);
  if (!ads.body.includes('pub-8179151029580359')) fail('ads.txt');

  console.log(failures ? `${failures} FAILURE(S)` : 'ALL PASSED');
  process.exit(failures ? 1 : 0);
}

run();
