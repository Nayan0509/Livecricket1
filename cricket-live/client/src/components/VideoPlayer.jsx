import React, { useState } from "react";

// Embeds a YouTube video by search query or videoId
// Uses YouTube IFrame API (free, no key needed for embeds)
export default function VideoPlayer({ videoId, title, thumbnail }) {
  const [playing, setPlaying] = useState(false);

  if (!videoId) return null;

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", position: "relative", background: "#000" }}>
      {!playing ? (
        <div onClick={() => setPlaying(true)} style={{ cursor: "pointer", position: "relative" }}>
          <img
            src={thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.4)"
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "rgba(0,200,83,0.9)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, transition: "transform 0.2s"
            }}>▶</div>
          </div>
          {title && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
              padding: "20px 12px 10px", fontSize: 13, fontWeight: 600
            }}>{title}</div>
          )}
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", aspectRatio: "16/9", border: "none" }}
        />
      )}
    </div>
  );
}
