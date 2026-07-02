import React, { useState, useEffect, useRef } from "react";
import { fetchYouTubeSearch } from "../api";
import { trackVideoPlay, trackVideoSearch } from "../utils/analytics";

// Build highlight search queries for a match. We only ever look for
// post-match HIGHLIGHTS from official channels — never live streams.
function buildQueries(match) {
  const t1 =
    match?.teamInfo?.[0]?.name ||
    match?.teams?.[0] ||
    match?.teamInfo?.[0]?.shortname ||
    "";
  const t2 =
    match?.teamInfo?.[1]?.name ||
    match?.teams?.[1] ||
    match?.teamInfo?.[1]?.shortname ||
    "";
  return [
    `${t1} vs ${t2} highlights`,
    `${t1} vs ${t2} cricket highlights`,
    `${t1} vs ${t2} match highlights`,
  ];
}

// Official match highlights embedded from YouTube. No live streams are shown.
export default function WatchSection({ match, autoOpen = true }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [opened, setOpened] = useState(autoOpen);
  const [queryIdx, setQueryIdx] = useState(0);
  const fetchedRef = useRef(false);
  const sectionRef = useRef(null);

  const queries = match ? buildQueries(match) : [];
  const query = queries[queryIdx] || queries[0] || "";

  useEffect(() => {
    if (!match?.id || fetchedRef.current) return;
    fetchedRef.current = true;
    doSearch(queries[0], 0);
  }, [match?.id]);

  const doSearch = (q, idx) => {
    if (!q) return;
    setLoading(true);
    fetchYouTubeSearch(q)
      .then((res) => {
        const vids = res?.videos || [];
        trackVideoSearch(q, vids.length);
        if (vids.length === 0 && idx < queries.length - 1) {
          setQueryIdx(idx + 1);
          doSearch(queries[idx + 1], idx + 1);
          return;
        }
        setVideos(vids);
        if (vids.length > 0) {
          setActiveId(vids[0].videoId);
          setActiveVideo(vids[0]);
          trackVideoPlay(vids[0].videoId, vids[0].title, match?.name);
        }
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  };

  const selectVideo = (v) => {
    setActiveId(v.videoId);
    setActiveVideo(v);
    trackVideoPlay(v.videoId, v.title, match?.name);
  };

  const handleRetry = () => {
    fetchedRef.current = false;
    setVideos([]);
    setActiveId(null);
    setActiveVideo(null);
    setQueryIdx(0);
    if (match?.id) {
      fetchedRef.current = true;
      doSearch(queries[0], 0);
    }
  };

  return (
    <div ref={sectionRef} style={{ marginBottom: 28 }}>
      {/* Header bar */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 18px",
          background: "linear-gradient(90deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.04) 100%)",
          border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: opened ? "14px 14px 0 0" : 14,
          cursor: "pointer", transition: "all 0.2s",
        }}
        onClick={() => setOpened((o) => !o)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
            <rect width="28" height="20" rx="4" fill="#FF0000" />
            <polygon points="11,5.5 11,14.5 19,10" fill="white" />
          </svg>
          <div>
            <div style={{ fontWeight: 900, fontSize: 14, color: "#fff", lineHeight: 1.2 }}>
              ▶ Match Highlights
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>
              {loading
                ? "Finding official highlights..."
                : videos.length > 0
                ? `${videos.length} official highlight${videos.length > 1 ? "s" : ""}`
                : "From official YouTube channels"}
            </div>
          </div>
        </div>
        <span
          style={{
            color: "rgba(255,255,255,0.4)", fontSize: 16,
            transform: opened ? "rotate(180deg)" : "none",
            transition: "transform 0.2s", display: "inline-block",
          }}
        >
          ▾
        </span>
      </div>

      {/* Body */}
      {opened && (
        <div
          style={{
            background: "rgba(5,8,20,0.95)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderTop: "none", borderRadius: "0 0 14px 14px", overflow: "hidden",
          }}
        >
          {loading ? (
            <div style={{ padding: "48px 20px", textAlign: "center" }}>
              <div
                style={{
                  width: 40, height: 40, border: "3px solid rgba(255,255,255,0.06)",
                  borderTopColor: "#FF0000", borderRadius: "50%",
                  animation: "spin 0.7s linear infinite", margin: "0 auto 14px",
                }}
              />
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                Searching official channels for highlights…
              </div>
            </div>
          ) : videos.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>📺</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 6 }}>
                No official highlights published for this match yet.
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginBottom: 20 }}>
                Official channels usually upload highlights a few hours after play ends.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "#FF0000", color: "#fff", padding: "9px 20px",
                    borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none",
                  }}
                >
                  Search on YouTube
                </a>
                <button
                  onClick={handleRetry}
                  style={{
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.7)", padding: "9px 20px",
                    borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer",
                  }}
                >
                  🔄 Retry
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Main player */}
              <div style={{ position: "relative", background: "#000", aspectRatio: "16/9" }}>
                <iframe
                  key={activeId}
                  src={`https://www.youtube-nocookie.com/embed/${activeId}?rel=0&modestbranding=1&iv_load_policy=3`}
                  title={activeVideo?.title || "Cricket Match Highlights"}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                />
              </div>

              {/* Now playing bar */}
              {activeVideo && (
                <div
                  style={{
                    padding: "10px 16px", background: "rgba(255,255,255,0.03)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12, fontWeight: 700, color: "#fff",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}
                    >
                      {activeVideo.title}
                    </div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                      📺 {activeVideo.channel || "YouTube"}
                    </div>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeId}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      flexShrink: 0, fontSize: 11, color: "rgba(255,255,255,0.4)",
                      textDecoration: "none", whiteSpace: "nowrap",
                    }}
                  >
                    Open on YouTube ↗
                  </a>
                </div>
              )}

              {/* More highlights */}
              {videos.length > 1 && (
                <div style={{ padding: "12px 16px" }}>
                  <div
                    style={{
                      fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
                    }}
                  >
                    More Highlights
                  </div>
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "thin" }}>
                    {videos.map((v) => (
                      <div
                        key={v.videoId}
                        onClick={() => selectVideo(v)}
                        style={{
                          flexShrink: 0, width: 160, cursor: "pointer",
                          borderRadius: 8, overflow: "hidden",
                          border: `2px solid ${activeId === v.videoId ? "#3B82F6" : "rgba(255,255,255,0.06)"}`,
                          transition: "border-color 0.15s", background: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <img
                          src={v.thumbnail} alt={v.title}
                          style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }}
                        />
                        <div style={{ padding: "6px 8px" }}>
                          <div
                            style={{
                              fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.8)",
                              overflow: "hidden", textOverflow: "ellipsis",
                              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                              lineHeight: 1.4,
                            }}
                          >
                            {v.title}
                          </div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{v.channel}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attribution / legal credit */}
              <div
                style={{
                  padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(255,0,0,0.04)",
                }}
              >
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <rect width="14" height="10" rx="2" fill="#FF0000" />
                  <polygon points="5.5,2.5 5.5,7.5 9.5,5" fill="white" />
                </svg>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                  Highlights are owned by their respective official channels and rights holders.
                  Live Cricket Zone does not host or own any video content. Clips are embedded via the{" "}
                  <a href="https://developers.google.com/youtube/iframe_api_reference" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,100,100,0.7)", textDecoration: "none" }}>
                    YouTube IFrame API
                  </a>{" "}
                  in line with{" "}
                  <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,100,100,0.7)", textDecoration: "none" }}>
                    YouTube's Terms of Service
                  </a>.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
