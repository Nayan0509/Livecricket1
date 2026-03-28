const { cors } = require("./_lib/cricket");

module.exports = (req, res) => {
  cors(res);
  res.json({
    status: "ok",
    cricapi: !!process.env.CRICAPI_KEY,
    rapidapi: !!process.env.RAPIDAPI_KEY,
  });
};
