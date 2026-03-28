const { cricGet, cors } = require("./_lib/cricket");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    const data = await cricGet("matches", { offset: 0 });
    const items = (data.data || []).map(m => ({
      id: m.id, title: m.name, description: m.status,
      date: m.date, venue: m.venue, matchType: m.matchType,
      teams: m.teams, teamInfo: m.teamInfo,
    }));
    res.json({ status: "success", data: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
