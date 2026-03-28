const { cricGet, liveCache, cors } = require("../_lib/cricket");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { id, action } = req.query;

  try {
    if (action === "scorecard") {
      const data = await cricGet("match_scorecard", { id }, liveCache);
      return res.json(data);
    }
    if (action === "score") {
      const data = await cricGet("cricScore", { id }, liveCache);
      return res.json(data);
    }
    // default: match info
    const data = await cricGet("match_info", { id });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
