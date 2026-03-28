module.exports = (req, res) => {
  const txt = `User-agent: *
Allow: /
Allow: /live
Allow: /schedule
Allow: /upcoming
Allow: /results
Allow: /series
Allow: /players
Allow: /rankings
Allow: /news
Allow: /stats
Allow: /teams
Disallow: /watch-live
Disallow: /api/

Sitemap: https://www.livecricketzone.com/sitemap.xml`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.status(200).send(txt);
};
