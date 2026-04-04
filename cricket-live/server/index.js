require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use("/api/matches",  require("./routes/matches"));
app.use("/api/series",   require("./routes/series"));
app.use("/api/players",  require("./routes/players"));
app.use("/api/news",     require("./routes/news"));
app.use("/api/rankings", require("./routes/rankings"));
app.use("/api/teams",    require("./routes/teams"));
app.use("/api/indexnow", require("./routes/indexnow"));

app.get("/api/health", (req, res) => res.json({
  status: "ok",
  cricapi: !!process.env.CRICAPI_KEY,
  rapidapi: !!process.env.RAPIDAPI_KEY,
}));

app.listen(PORT, () => {
  console.log(`\n🏏 Cricket server on port ${PORT}`);
  console.log(`   CricketData.org : ${process.env.CRICAPI_KEY ? "✓" : "✗ MISSING"}`);
  console.log(`   RapidAPI        : ${process.env.RAPIDAPI_KEY ? "✓" : "✗ MISSING"}\n`);
});
