// Single function serving all static/verification files
module.exports = (req, res) => {
  const path = req.url.split("?")[0];

  if (path === "/sitemap.xml" || path === "/api/sitemap.xml") {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.livecricketzone.com/</loc><changefreq>always</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.livecricketzone.com/live</loc><changefreq>always</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.livecricketzone.com/schedule</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.livecricketzone.com/upcoming</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.livecricketzone.com/results</loc><changefreq>hourly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.livecricketzone.com/series</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.livecricketzone.com/teams</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.livecricketzone.com/players</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.livecricketzone.com/rankings</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.livecricketzone.com/news</loc><changefreq>hourly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.livecricketzone.com/stats</loc><changefreq>daily</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.livecricketzone.com/about</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>
</urlset>`;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(xml);
  }

  if (path === "/robots.txt" || path === "/api/robots.txt") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send(
      `User-agent: *\nAllow: /\nDisallow: /watch-live\nDisallow: /api/\n\nSitemap: https://www.livecricketzone.com/sitemap.xml`
    );
  }

  if (path === "/ads.txt" || path === "/api/ads.txt") {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send("google.com, pub-8179151029580359, DIRECT, f08c47fec0942fa0");
  }

  if (path === "/BingSiteAuth.xml" || path === "/api/BingSiteAuth.xml") {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0");
    return res.status(200).send(`<?xml version="1.0"?>\n<users>\n  <user>0E3A479B49E380E7F0CB91985622FF68</user>\n</users>`);
  }

  res.status(404).json({ error: "Not found" });
};
