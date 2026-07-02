const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const router = express.Router();
const cache = new NodeCache({ stdTTL: 600 }); // 10 min cache

// Verified official cricket channels whose highlights we surface.
// Matching is case-insensitive and substring based against the video's channel name.
const OFFICIAL_CHANNELS = [
  "ipl",                    // IPL — official
  "bcci",
  "icc",                    // ICC
  "star sports",
  "sony sports", "sony liv", "sony ten",
  "jiocinema", "jiohotstar",
  "sky sports cricket",
  "cricket australia",
  "ecb", "england cricket",
  "pcb", "pakistan cricket",
  "cricket west indies",
  "sri lanka cricket",
  "bangladesh cricket",
  "willow", "willow tv",
  "espncricinfo", "espn cricinfo",
];

function isOfficialChannel(channel = "") {
  const c = channel.toLowerCase();
  return OFFICIAL_CHANNELS.some((name) => c.includes(name));
}

// Scrape YouTube search results (no API key needed).
// Only official-channel HIGHLIGHTS are returned — never live rebroadcasts.
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  const cacheKey = `yt-${q}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    // Plain search (no live filter). We drop live results below.
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
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

      // Never surface live streams — we only embed official highlights.
      const isLive = !!vr.badges?.some(
        (b) => b.metadataBadgeRenderer?.label === "LIVE"
      );
      if (isLive) continue;

      // Only surface highlights from verified official channels.
      const channel = vr.ownerText?.runs?.[0]?.text || "";
      if (!isOfficialChannel(channel)) continue;

      videos.push({
        videoId: vr.videoId,
        title: vr.title?.runs?.[0]?.text || "",
        thumbnail: `https://img.youtube.com/vi/${vr.videoId}/mqdefault.jpg`,
        isLive: false,
        channel,
      });
      if (videos.length >= 6) break;
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
