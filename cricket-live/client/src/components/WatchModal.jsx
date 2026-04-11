import React, { useState, useEffect } from "react";
import { fetchYouTubeSearch } from "../api";

export default function WatchModal({ match, onClose }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  // Build a smart search query from match data
  const buildQuery = (m) => {
    const t1 = m?.teamInfo?.[0]?.shortname || m?.teams?.[0] || "";
    const t2 = m?.teamInfo?.[1]?.shortname || m?.teams?.[1] || "";
    const isLive = m?.matchStarted && !m?.matchEnded;
    const suffix = isLive ? "live cricket" : "cricket highlights";
    return `${t1} vs ${t2} ${suffix}`.trim();
  };

  useEffect(() => {
    if (!match) return;
    setLoading(true);
    setVideos([]);
    setActiveId(null);
    const q = buildQuery(match);
    fetchYouTubeSearch(q)
      .then((res) => {
        const vids = res?.videos || [];
        setVideos(vids);
        if (vids.length > 0) setActiveId(vids[0].videoId);
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [match?.id]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isLive = match?.matchStarted && !match?.matchEnded;
  const query = buildQuery(match);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <div style={{
        background: "var(--bg2, #1a1f35)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, width: "100%", maxWidth: 860,
        maxHeight: "90vh", overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>▶️</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>
                {match?.name || "Watch Match"}
              </span>
              {isLive && (
                <span style={{
                  fontSize: 10, fontWeight: 900, background: "#ef4444",
                  color: "#fff", padding: "2px 8px", borderRadius: 20,
                  textTransform: "uppercase", letterSpacing: 0.5,
                }}>● LIVE</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
              YouTube search: "{query}"
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)", border: "none",
              color: "#fff", width: 36, height: 36, borderRadius: "50%",
              cursor: "pointer", fontSize: 18, display: "flex",
              alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{
                width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)",
                borderTopColor: "#ef4444", borderRadius: "50%",
                animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
              }} />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Searching YouTube...</p>
            </div>
          ) : videos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📺</div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 20 }}>
                No videos found automatically.
              </p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block", background: "#ef4444",
                  color: "#fff", padding: "10px 24px", borderRadius: 10,
                  fontWeight: 700, fontSize: 14, textDecoration: "none",
                }}
              >
                Search on YouTube ↗
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Active player */}
              {activeId && (
                <div style={{ borderRadius: 14, overflow: "hidden", background: "#000", aspectRatio: "16/9" }}>
                  <iframe
                    key={activeId}
                    src={`https://www.youtube-nocookie.com/embed/${activeId}?autoplay=1&rel=0`}
                    title="Cricket Match Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              )}

              {/* Video list */}
              {videos.length > 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                    More Videos
                  </div>
                  {videos.map((v) => (
                    <div
                      key={v.videoId}
                      onClick={() => setActiveId(v.videoId)}
                      style={{
                        display: "flex", gap: 12, alignItems: "center",
                        padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                        background: activeId === v.videoId ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${activeId === v.videoId ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { if (activeId !== v.videoId) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                      onMouseLeave={e => { if (activeId !== v.videoId) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    >
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          style={{ width: 100, height: 56, objectFit: "cover", borderRadius: 8 }}
                        />
                        {v.isLive && (
                          <span style={{
                            position: "absolute", top: 4, left: 4,
                            background: "#ef4444", color: "#fff",
                            fontSize: 9, fontWeight: 900, padding: "1px 5px",
                            borderRadius: 4, textTransform: "uppercase",
                          }}>LIVE</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 13, fontWeight: 600, color: "#fff",
                          overflow: "hidden", textOverflow: "ellipsis",
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                          lineHeight: 1.4,
                        }}>{v.title}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{v.channel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Open on YouTube fallback */}
              <div style={{ textAlign: "center", paddingTop: 4 }}>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
                >
                  Open YouTube search ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
