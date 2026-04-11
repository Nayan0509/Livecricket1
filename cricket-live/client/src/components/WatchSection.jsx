import React, { useState, useEffect, useRef } from "react";
import { fetchYouTubeSearch } from "../api";

// International teams that broadcast live on YouTube officially
const INTL_TEAMS = [
  "india","australia","england","pakistan","south africa","new zealand",
  "west indies","sri lanka","bangladesh","afghanistan","zimbabwe","ireland",
  "netherlands","scotland","nepal","usa","canada","kenya","oman","uae",
  "namibia","papua new guinea","hong kong","singapore",
];

function isInternationalMatch(match) {
  const t1 = (match?.teamInfo?.[0]?.name || match?.teams?.[0] || "").toLowerCase();
  const t2 = (match?.teamInfo?.[1]?.name || match?.teams?.[1] || "").toLowerCase();
  return INTL_TEAMS.some(t => t1.includes(t)) && INTL_TEAMS.some(t => t2.includes(t));
}

function buildQuery(match) {
  const t1 = match?.teamInfo?.[0]?.name || match?.teams?.[0] || match?.teamInfo?.[0]?.shortname || "";
  const t2 = match?.teamInfo?.[1]?.name || match?.teams?.[1] || match?.teamInfo?.[1]?.shortname || "";
  const isLive = match?.matchStarted && !match?.matchEnded;
  const isIntl = isInternationalMatch(match);

  if (isLive && isIntl) {
    // Official country boards stream live — search for live stream
    return `${t1} vs ${t2} live cricket stream`;
  }
  if (isLive) {
    // Domestic leagues (IPL, PSL, BBL etc.) — search live
    return `${t1} vs ${t2} live`;
  }
  // Completed match
  return `${t1} vs ${t2} cricket highlights`;
}

export default function WatchSection({ match, autoOpen }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [opened, setOpened] = useState(true); // always open by default
  const fetchedRef = useRef(false);
  const sectionRef = useRef(null);

  // Fire fetch as soon as match data is available
  useEffect(() => {
    if (!match?.id || fetchedRef.current) return;
    fetchedRef.current = true;
    const q = buildQuery(match);
    setLoading(true);
    fetchYouTubeSearch(q)
      .then((res) => {
        const vids = res?.videos || [];
        setVideos(vids);
        if (vids.length > 0) setActiveId(vids[0].videoId);
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [match?.id]);

  // Scroll into view once videos are loaded
  useEffect(() => {
    if (activeId && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [activeId]);

  const handleToggle = () => setOpened(o => !o);

  const isLive = match?.matchStarted && !match?.matchEnded;
  const query = buildQuery(match);

  return (
    <div ref={sectionRef} style={{ marginBottom: 28 }}>
      {/* Toggle bar */}
      <button
        onClick={handleToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: opened
            ? (isLive ? "rgba(239,68,68,0.12)" : "rgba(99,102,241,0.1)")
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${opened ? (isLive ? "rgba(239,68,68,0.35)" : "rgba(99,102,241,0.35)") : "rgba(255,255,255,0.1)"}`,
          borderRadius: opened ? "14px 14px 0 0" : 14,
          padding: "14px 20px", cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>📺</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>
            Watch {isLive ? "Live" : "Highlights"} on YouTube
          </span>
          {isLive && (
            <span style={{
              fontSize: 10, fontWeight: 900, background: "#ef4444",
              color: "#fff", padding: "2px 8px", borderRadius: 20,
              textTransform: "uppercase", letterSpacing: 0.5,
            }}>● LIVE</span>
          )}
        </div>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, transition: "transform 0.2s", transform: opened ? "rotate(180deg)" : "none" }}>
          ▾
        </span>
      </button>

      {/* Expanded content */}
      {opened && (
        <div style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "none",
          borderRadius: "0 0 14px 14px",
          padding: "20px",
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 36, height: 36, border: "3px solid rgba(255,255,255,0.08)",
                borderTopColor: "#ef4444", borderRadius: "50%",
                animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
              }} />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Searching YouTube for "{query}"...</p>
            </div>
          ) : videos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📺</div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 16 }}>
                No videos found. Try searching directly on YouTube.
              </p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-block", background: "#ef4444",
                  color: "#fff", padding: "9px 22px", borderRadius: 10,
                  fontWeight: 700, fontSize: 13, textDecoration: "none",
                }}
              >
                Search on YouTube ↗
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {/* Main player */}
              <div style={{ flex: "1 1 500px", minWidth: 0 }}>
                {activeId && (
                  <div style={{ borderRadius: 12, overflow: "hidden", background: "#000", aspectRatio: "16/9" }}>
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
                {/* YouTube credit + legal */}
                <div style={{
                  marginTop: 8, padding: "8px 12px",
                  background: "rgba(255,0,0,0.06)", borderRadius: 8,
                  border: "1px solid rgba(255,0,0,0.12)",
                  display: "flex", alignItems: "flex-start", gap: 8,
                }}>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <rect width="16" height="12" rx="3" fill="#FF0000"/>
                    <polygon points="6.5,3 6.5,9 11,6" fill="white"/>
                  </svg>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                    Videos are sourced from <strong style={{ color: "rgba(255,255,255,0.6)" }}>YouTube</strong> and are the property of their respective owners and channels. All rights belong to the original content creators. We do not host, upload or own any video content. Embedded via YouTube's official embed API in compliance with{" "}
                    <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171", textDecoration: "none" }}>YouTube Terms of Service</a>.
                  </div>
                </div>
                <div style={{ marginTop: 6, textAlign: "right" }}>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
                  >
                    More on YouTube ↗
                  </a>
                </div>
              </div>

              {/* Video list sidebar */}
              {videos.length > 1 && (
                <div style={{ flex: "0 0 220px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                    Related Videos
                  </div>
                  {videos.map((v) => (
                    <div
                      key={v.videoId}
                      onClick={() => setActiveId(v.videoId)}
                      style={{
                        display: "flex", gap: 10, alignItems: "flex-start",
                        padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                        background: activeId === v.videoId ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${activeId === v.videoId ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img
                          src={v.thumbnail} alt={v.title}
                          style={{ width: 72, height: 40, objectFit: "cover", borderRadius: 6 }}
                        />
                        {v.isLive && (
                          <span style={{
                            position: "absolute", top: 2, left: 2,
                            background: "#ef4444", color: "#fff",
                            fontSize: 8, fontWeight: 900, padding: "1px 4px",
                            borderRadius: 3, textTransform: "uppercase",
                          }}>LIVE</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 11, fontWeight: 600, color: activeId === v.videoId ? "#fff" : "rgba(255,255,255,0.75)",
                          overflow: "hidden", textOverflow: "ellipsis",
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                          lineHeight: 1.4,
                        }}>{v.title}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.title)}`}
                            target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
                          >
                            📺 {v.channel || "YouTube"}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
