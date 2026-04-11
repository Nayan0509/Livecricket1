const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300 }); // 5 min cache

// Scrape YouTube search results to find a video ID (no API key needed)
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  const cacheKey = `yt-${q}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=EgJAAQ%3D%3D`; // filter: live
    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 10000,
    });

    // Extract video IDs from ytInitialData JSON embedded in the page
    const match = data.match(/var ytInitialData = ({.+?});<\/script>/s);
    if (!match) throw new Error("ytInitialData not found");

    const ytData = JSON.parse(match[1]);
    const contents =
      ytData?.contents?.twoColumnSearchResultsRenderer?.primaryContents
        ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

    const videos = [];
    for (const item of contents) {
      const vr = item.videoRenderer;
      if (!vr?.videoId) continue;
      videos.push({
        videoId: vr.videoId,
        title: vr.title?.runs?.[0]?.text || "",
        thumbnail: `https://img.youtube.com/vi/${vr.videoId}/mqdefault.jpg`,
        isLive: !!vr.badges?.some(b => b.metadataBadgeRenderer?.label === "LIVE"),
        channel: vr.ownerText?.runs?.[0]?.text || "",
      });
      if (videos.length >= 5) break;
    }

    const result = { videos };
    cache.set(cacheKey, result);
    res.json(result);
  } catch (e) {
    console.error("[YouTube] search failed:", e.message);
    // Fallback: return empty so client can show a direct YouTube search link
    res.json({ videos: [], error: e.message });
  }
});

module.exports = router;
