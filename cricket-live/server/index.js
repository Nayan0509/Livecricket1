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
app.use("/api/seo",      require("./routes/seo"));

app.get("/api/health", (req, res) => res.json({
  status: "ok",
  mode: "Scale Up (Scraper Enabled)",
  dependencyFree: true
}));

app.listen(PORT, () => {
  console.log(`\n🏏 Cricket server on port ${PORT}`);
  console.log(`   Mode            : SCALE UP (Independent Scraper)`);
  console.log(`   Dependencies    : All API dependencies removed ✓\n`);
});

