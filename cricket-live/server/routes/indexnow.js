const express = require("express");
const router = express.Router();
const { submitToIndexNow, submitAllUrls } = require("../utils/indexnow");

// Submit a single URL or array of URLs
router.post("/submit", async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!urls) {
      return res.status(400).json({ error: "URLs required" });
    }

    const result = await submitToIndexNow(urls);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit all important URLs
router.post("/submit-all", async (req, res) => {
  try {
    const result = await submitAllUrls();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
