module.exports = (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.status(200).send("google.com, pub-8179151029580359, DIRECT, f08c47fec0942fa0");
};
