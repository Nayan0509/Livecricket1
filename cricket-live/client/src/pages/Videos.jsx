import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";
import AdBanner from "../components/AdBanner";
import { fetchYouTubeSearch } from "../api";

const SEARCH_QUERIES = [
  { label: "IPL 2026 Highlights", q: "IPL 2026 match highlights" },
  { label: "T20 World Cup", q: "T20 World Cup 2026 cricket highlights" },
  { label: "Test Cricket", q: "Test cricket 2026 highlights" },
  { label: "ODI Cricket", q: "ODI cricket 2026 best moments" },
  { label: "Best Catches", q: "cricket best catches 2025 2026" },
  { label: "Top Sixes", q: "cricket biggest sixes 2026 IPL T20" },
];

function VideoCard({ video, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderRadius: 10,
        overflow: "hidden",
        border: isActive ? "2px solid #B026FF" : "2px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
        transition: "all 0.2s",
      }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; e.currentTarget.style.background = "rgba(59,130,246,0.04)"; }}}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}}
    >
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#111" }}>
        <img
          src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
          alt={video.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.25)",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: isActive ? "rgba(59,130,246,0.9)" : "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "#fff", transition: "background 0.2s",
          }}>▶</div>
        </div>
        {video.isLive && (
          <div style={{ position: "absolute", top: 8, left: 8, background: "#FF1053", color: "#fff", fontSize: 10, fontWeight: 900, padding: "2px 7px", borderRadius: 4 }}>
            ● LIVE
          </div>
        )}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text)", lineHeight: 1.35, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {video.title}
        </div>
        {video.channel && (
          <div style={{ fontSize: 11, color: "var(--text3)" }}>{video.channel}</div>
        )}
      </div>
    </div>
  );
}

export default function Videos() {
  const [activeTab, setActiveTab] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const { q } = SEARCH_QUERIES[activeTab];
    setLoading(true);
    setVideos([]);
    setFeatured(null);
    fetchYouTubeSearch(q)
      .then(data => {
        const list = data?.videos || [];
        setVideos(list);
        if (list.length) setFeatured(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Cricket Videos — IPL 2026 Highlights, T20 World Cup & Replays"
        description="Watch cricket videos — IPL 2026 official match highlights, T20 World Cup 2026, best catches, biggest sixes and match replays. Updated daily with the latest cricket clips."
        keywords="cricket videos, IPL 2026 highlights, cricket highlights today, T20 World Cup video, cricket match highlights, IPL highlights video, cricket best catches, cricket sixes, cricket match video 2026, cricket replays"
        url="/videos"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(59,130,246,0.09) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.15)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          📺 Cricket <span style={{ color: "#B026FF" }}>Videos</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: "0 0 12px" }}>
          IPL 2026 highlights · T20 World Cup · Best catches · Replays
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["IPL Highlights", "T20 WC", "Replays", "Free"].map(t => (
            <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 20, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)", color: "#B026FF" }}>{t}</span>
          ))}
        </div>
      </div>

      <AdBanner type="leaderboard" />

      <PageIntro intro={PAGE_INTROS["/videos"]} />

      {/* Category tabs */}
      <div style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" }}>
        {SEARCH_QUERIES.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            flexShrink: 0, padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: activeTab === i ? "#B026FF" : "rgba(255,255,255,0.04)",
            color: activeTab === i ? "#000" : "var(--text3)",
            border: activeTab === i ? "none" : "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer", transition: "all 0.2s", fontFamily: "'Inter',sans-serif",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto" }} />
          <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 16 }}>Loading videos…</p>
        </div>
      ) : videos.length > 0 ? (
        <>
          {/* Featured player */}
          {featured && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>▶ Now Playing</div>
              <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(59,130,246,0.2)" }}>
                <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
                  <iframe
                    key={featured.videoId}
                    src={`https://www.youtube.com/embed/${featured.videoId}?autoplay=0&rel=0`}
                    title={featured.title}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              </div>
              <div style={{ marginTop: 10, fontWeight: 800, fontSize: 15, color: "var(--text)", lineHeight: 1.4 }}>{featured.title}</div>
              {featured.channel && <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>{featured.channel}</div>}
            </div>
          )}

          {/* Video grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {videos.map((v, i) => (
              <VideoCard
                key={v.videoId || i}
                video={v}
                isActive={featured?.videoId === v.videoId}
                onClick={() => setFeatured(v)}
              />
            ))}
          </div>

          {/* Direct YouTube link */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(SEARCH_QUERIES[activeTab].q)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px",
                borderRadius: 20, fontSize: 13, fontWeight: 700, color: "#B026FF",
                background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
                textDecoration: "none", transition: "all 0.15s",
              }}
            >
              ▶ View More on YouTube →
            </a>
          </div>
        </>
      ) : (
        <div style={{ padding: "40px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📺</div>
          <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 16 }}>Videos could not be loaded right now.</p>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(SEARCH_QUERIES[activeTab].q)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 13, color: "#B026FF", fontWeight: 700, textDecoration: "none" }}
          >
            Search on YouTube →
          </a>
        </div>
      )}

      <div style={{ marginTop: 24 }}><AdBanner type="auto" /></div>

    </div>
  );
}
