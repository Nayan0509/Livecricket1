import React, { useState, useEffect, useRef } from "react";
import { fetchYouTubeSearch } from "../api";
import { trackWatchClick, trackVideoPlay, trackVideoSearch } from "../utils/analytics";

// Official broadcaster channels per region — improves search relevance
const OFFICIAL_CHANNELS = {
  india:        ["Star Sports", "JioCinema", "Sony LIV"],
  pakistan:     ["PTV Sports", "A Sports", "Geo Super"],
  england:      ["Sky Sports Cricket", "BBC Sport"],
  australia:    ["Fox Cricket", "Channel 7 Cricket"],
  westindies:   ["Flow Sports", "ESPN Caribbean"],
  default:      ["Sky Sports Cricket", "Willow TV", "Star Sports"],
};

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

// Build multiple search queries — try live first, fall back to highlights
function buildQueries(match) {
  const t1 = match?.teamInfo?.[0]?.name || match?.teams?.[0] || match?.teamInfo?.[0]?.shortname || "";
  const t2 = match?.teamInfo?.[1]?.name || match?.teams?.[1] || match?.teamInfo?.[1]?.shortname || "";
  const isLive = match?.matchStarted && !match?.matchEnded;
  const isIntl = isInternationalMatch(match);
  const matchType = match?.matchType || "";

  if (isLive && isIntl) {
    return [
      `${t1} vs ${t2} live cricket stream`,
      `${t1} vs ${t2} live ${matchType}`,
      `${t1} vs ${t2} live today`,
    ];
  }
  if (isLive) {
    return [
      `${t1} vs ${t2} live`,
      `${t1} vs ${t2} live cricket`,
      `${t1} vs ${t2} ${matchType} live`,
    ];
  }
  return [
    `${t1} vs ${t2} highlights`,
    `${t1} vs ${t2} cricket highlights`,
    `${t1} vs ${t2} full match`,
  ];
}

function buildQuery(match) {
  return buildQueries(match)[0];
}

export default function WatchSection({ match }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [opened, setOpened] = useState(true);
  const [queryIdx, setQueryIdx] = useState(0);
  const fetchedRef = useRef(false);
  const sectionRef = useRef(null);

  const isLive = match?.matchStarted && !match?.matchEnded;
  const queries = match ? buildQueries(match) : [];
  const query = queries[queryIdx] || buildQuery(match);

  // Fetch on match load — try next query if no results
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
          // Try next query
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

  // Scroll into view once first video is ready
  useEffect(() => {
    if (activeId && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  }, [activeId]);

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

  const shareUrl = `https://www.livecricketzone.com/match/${match?.id}`;

  return (
    <div ref={sectionRef} style={{ marginBottom: 28 }}>

      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px",
        background: isLive
          ? "linear-gradient(90deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.06) 100%)"
          : "linear-gradient(90deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.04) 100%)",
        border: `1px solid ${isLive ? "rgba(239,68,68,0.35)" : "rgba(99,102,241,0.3)"}`,
        borderRadius: opened ? "14px 14px 0 0" : 14,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
        onClick={() => setOpened(o => !o)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* YouTube logo */}
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
            <rect width="28" height="20" rx="4" fill="#FF0000"/>
            <polygon points="11,5.5 11,14.5 19,10" fill="white"/>
          </svg>
          <div>
            <div style={{ fontWeight: 900, fontSize: 14, color: "#fff", lineHeight: 1.2 }}>
              {isLive ? "🔴 Watch Live on YouTube" : "▶ Watch Highlights on YouTube"}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>
              {loading ? "Searching..." : videos.length > 0 ? `${videos.length} video${videos.length > 1 ? "s" : ""} found` : "Free · No signup required"}
            </div>
          </div>
          {isLive && (
            <span style={{
              fontSize: 9, fontWeight: 900, background: "#ef4444",
              color: "#fff", padding: "2px 7px", borderRadius: 20,
              textTransform: "uppercase", letterSpacing: 0.8,
              animation: "livePulse 2s infinite",
            }}>● LIVE</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Share button */}
          {match?.id && (
            <button
              onClick={e => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({ title: match.name, url: shareUrl });
                } else {
                  navigator.clipboard?.writeText(shareUrl);
                }
              }}
              style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.6)", borderRadius: 7, padding: "4px 10px",
                fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
              title="Share this match"
            >
              🔗 Share
            </button>
          )}
          <span style={{
            color: "rgba(255,255,255,0.4)", fontSize: 16,
            transform: opened ? "rotate(180deg)" : "none",
            transition: "transform 0.2s", display: "inline-block",
          }}>▾</span>
        </div>
      </div>

      {/* Body */}
      {opened && (
        <div style={{
          background: "rgba(5,8,20,0.95)",
          border: `1px solid ${isLive ? "rgba(239,68,68,0.2)" : "rgba(99,102,241,0.2)"}`,
          borderTop: "none", borderRadius: "0 0 14px 14px",
          overflow: "hidden",
        }}>

          {loading ? (
            <div style={{ padding: "48px 20px", textAlign: "center" }}>
              <div style={{
                width: 40, height: 40, border: "3px solid rgba(255,255,255,0.06)",
                borderTopColor: "#FF0000", borderRadius: "50%",
                animation: "spin 0.7s linear infinite", margin: "0 auto 14px",
              }} />
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                Searching YouTube for <em style={{ color: "rgba(255,255,255,0.7)" }}>"{query}"</em>
              </div>
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 6 }}>
                Checking official broadcaster channels...
              </div>
            </div>

          ) : videos.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>📺</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 6 }}>
                No stream found for this match yet.
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginBottom: 20 }}>
                Try searching directly — official channels may be streaming live.
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
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><rect width="14" height="10" rx="2" fill="white" fillOpacity="0.3"/><polygon points="5.5,2.5 5.5,7.5 9.5,5" fill="white"/></svg>
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

              {/* Main player — full width */}
              <div style={{ position: "relative", background: "#000", aspectRatio: "16/9" }}>
                <iframe
                  key={activeId}
                  src={`https://www.youtube-nocookie.com/embed/${activeId}?autoplay=1&mute=1&rel=0&modestbranding=1&iv_load_policy=3`}
                  title={activeVideo?.title || "Cricket Match Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                />
              </div>

              {/* Now playing bar */}
              {activeVideo && (
                <div style={{
                  padding: "10px 16px",
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: "#fff",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{activeVideo.title}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                      📺 {activeVideo.channel || "YouTube"}
                      {activeVideo.isLive && (
                        <span style={{ marginLeft: 8, color: "#ef4444", fontWeight: 800 }}>● LIVE</span>
                      )}
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

              {/* Video list — horizontal scroll on mobile, vertical on desktop */}
              {videos.length > 1 && (
                <div style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                    More Videos
                  </div>
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "thin" }}>
                    {videos.map((v) => (
                      <div
                        key={v.videoId}
                        onClick={() => selectVideo(v)}
                        style={{
                          flexShrink: 0, width: 160, cursor: "pointer",
                          borderRadius: 8, overflow: "hidden",
                          border: `2px solid ${activeId === v.videoId ? "#ef4444" : "rgba(255,255,255,0.06)"}`,
                          transition: "border-color 0.15s",
                          background: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          <img
                            src={v.thumbnail} alt={v.title}
                            style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }}
                          />
                          {v.isLive && (
                            <span style={{
                              position: "absolute", top: 4, left: 4,
                              background: "#ef4444", color: "#fff",
                              fontSize: 8, fontWeight: 900, padding: "2px 5px",
                              borderRadius: 3, textTransform: "uppercase",
                            }}>● LIVE</span>
                          )}
                          {activeId === v.videoId && (
                            <div style={{
                              position: "absolute", inset: 0,
                              background: "rgba(239,68,68,0.25)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: "#ef4444", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontSize: 10,
                              }}>▶</div>
                            </div>
                          )}
                        </div>
                        <div style={{ padding: "6px 8px" }}>
                          <div style={{
                            fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.8)",
                            overflow: "hidden", textOverflow: "ellipsis",
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                          }}>{v.title}</div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{v.channel}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* YouTube legal credit */}
              <div style={{
                padding: "10px 16px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex", alignItems: "flex-start", gap: 8,
                background: "rgba(255,0,0,0.04)",
              }}>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                  <rect width="14" height="10" rx="2" fill="#FF0000"/>
                  <polygon points="5.5,2.5 5.5,7.5 9.5,5" fill="white"/>
                </svg>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                  Videos are owned by their respective YouTube channels and content creators. Live Cricket Zone does not host or own any video content. Embedded via{" "}
                  <a href="https://developers.google.com/youtube/iframe_api_reference" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,100,100,0.7)", textDecoration: "none" }}>YouTube IFrame API</a>
                  {" "}per{" "}
                  <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,100,100,0.7)", textDecoration: "none" }}>YouTube ToS</a>.
                  {" "}
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,100,100,0.7)", textDecoration: "none" }}>
                    More videos on YouTube ↗
                  </a>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
