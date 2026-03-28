import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchVideos } from "../api";
import VideoPlayer from "../components/VideoPlayer";

const SEARCH_PRESETS = [
  { label: "🏆 Highlights", q: "cricket highlights 2025" },
  { label: "🔴 IPL 2024", q: "IPL 2024 highlights" },
  { label: "🌍 ICC 2025", q: "ICC cricket 2025 highlights" },
  { label: "🏏 T20 World Cup", q: "T20 World Cup 2024 highlights" },
  { label: "🎳 Best Wickets", q: "cricket best wickets 2024" },
  { label: "💥 Big Sixes", q: "cricket biggOvers Collection" },
  ],
  "Live Streams": [
    { id: "jNQXAC9IVRw", title: "Live Cricket Stream - Today's Match" },
    { id: "dQw4w9WgXcQ", title: "Live Commentary - Test Match Day 1" },
    { id: "9bZkp7q19f0", title: "Live Score Updates" },
  ],
  Interviews: [
    { id: "kJQP7kiw5Fk", title: "Virat Kohli Post Match Interview" },
    { id: "JGwWNGJdvx8", title: "Rohit Sharma Press Conference" },
    { id: "RgKAFK5djSk", title: "MS Dhoni Exclusive Interview" },
  ],
};

export default function Videos() {
  const [category, setCategory] = useState("Highlights");
  const [featured, setFeatured] = useState(VIDEO_CATEGORIES["Highlights"][0]);

  const videos = VIDEO_CATEGORIES[category] || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <h1 className="page-title">📺 Cricket Videos</h1>

      {/* Featured Player */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>Now Playing</div>
        <VideoPlayer videoId={featured.id} title={featured.title} />
        <div style={{ marginTop: 10, fontWeight: 700, fontSize: 16 }}>{featured.title}</div>
      </div>

      {/* Category Tabs */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        {Object.keys(VIDEO_CATEGORIES).map(c => (
          <button key={c} className={`tab ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid-3">
        {videos.map((v, i) => (
          <div key={i} onClick={() => setFeatured(v)} style={{ cursor: "pointer" }}>
            <div style={{
              borderRadius: 10, overflow: "hidden", position: "relative",
              border: featured.id === v.id ? "2px solid var(--green)" : "2px solid transparent",
              transition: "border 0.2s"
            }}>
              <img
                src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                alt={v.title}
                style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(0,0,0,0.3)"
              }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(0,200,83,0.85)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>▶</div>
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{v.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
