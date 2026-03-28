const { rapidGet, cors } = require("../_lib/cricket");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    const data = await rapidGet("/cricket-schedule");
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
