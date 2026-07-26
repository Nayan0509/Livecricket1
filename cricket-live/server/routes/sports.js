const express = require("express");
const router = express.Router();
const { getSportMatches, getSportNews, SPORT_LEAGUES } = require("../../api/multiSportScraper");

function assertSport(req, res, next) {
  if (!SPORT_LEAGUES[req.params.sport]) {
    return res.status(404).json({ status: "error", message: `Unsupported sport: ${req.params.sport}` });
  }
  next();
}

router.get("/:sport/matches", assertSport, async (req, res, next) => {
  try {
    const data = await getSportMatches(req.params.sport);
    res.json({ status: "success", data });
  } catch (e) { next(e); }
});

router.get("/:sport/news", assertSport, async (req, res, next) => {
  try {
    const data = await getSportNews(req.params.sport);
    res.json({ status: "success", data });
  } catch (e) { next(e); }
});

module.exports = router;
