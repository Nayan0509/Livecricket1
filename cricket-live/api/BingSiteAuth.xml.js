module.exports = (req, res) => {
  const xml = `<?xml version="1.0"?>
<users>
  <user>0E3A479B49E380E7F0CB91985622FF68</user>
</users>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0");
  res.status(200).send(xml);
};
