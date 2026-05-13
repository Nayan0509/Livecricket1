import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchNews } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";

export default function News() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({ queryKey: ["news"], queryFn: fetchNews });
  const items = data?.data || [];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Cricket News Today — Latest Headlines, IPL & Match Previews"
        description="Latest cricket news today: IPL 2026 updates, match previews, player news and T20 World Cup headlines. AI-powered analysis updated live."
        keywords="cricket news today, IPL 2026 news, cricket latest news, match preview, player updates, T20 World Cup news, cricket headlines, cricket analysis"
        url="/news"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 28px",
        padding: "32px 28px",
        borderRadius: 20,
        background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(9,9,11,0.98) 60%, rgba(245,158,11,0.06) 100%)",
        border: "1px solid rgba(16,185,129,0.15)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "repeating-linear-gradient(90deg, #10B981 0 1px, transparent 1px 60px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
              Cricket <span style={{ background: "linear-gradient(135deg,#10B981,#34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>News</span>
            </h1>
            <p style={{ fontSize: 13, color: "var(--text3)", margin: 0, lineHeight: 1.6 }}>
              AI-generated cricket news · IPL 2026 · Live match previews · Powered by Gemini
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", padding: "8px 14px", borderRadius: 100 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "livePulse 1.8s infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981" }}>{items.length} Stories</span>
          </div>
        </div>
      </div>

      {/* Ad top */}
      <AdBanner type="leaderboard" />

      {isLoading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div className="spinner" style={{ margin: "0 auto" }} />
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 12 }}>Loading news…</p>
        </div>
      )}

      {error && (
        <div style={{ padding: "40px 24px", textAlign: "center", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 14 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📡</div>
          <h3 style={{ color: "#F87171", marginBottom: 8, fontSize: 16 }}>News unavailable</h3>
          <p style={{ color: "var(--text3)", fontSize: 13 }}>{error.message}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {items.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px dashed rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ color: "var(--text3)", fontSize: 14 }}>No news stories right now. Check back soon.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {items.map((n, i) => (
                <NewsCard key={n.id || i} item={n} idx={i} navigate={navigate} />
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: 32 }}><AdBanner type="auto" /></div>
    </div>
  );
}

function NewsCard({ item: n, idx, navigate }) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16, overflow: "hidden",
        transition: "all 0.25s",
        animationDelay: `${idx * 0.04}s`,
      }}
      className="animate-fade-in"
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(16,185,129,0.08)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top accent */}
      <div style={{ height: 3, background: idx % 3 === 0 ? "linear-gradient(90deg,#10B981,#059669)" : idx % 3 === 1 ? "linear-gradient(90deg,#F59E0B,#D97706)" : "linear-gradient(90deg,#38BDF8,#10B981)" }} />

      <div style={{ padding: "20px 20px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Meta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span className="news-source-badge">{n.source}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
            {n.hoursAgo !== undefined
              ? (n.hoursAgo < 24 ? `${n.hoursAgo}h ago` : `${n.daysAgo || Math.round(n.hoursAgo / 24)}d ago`)
              : n.date}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", lineHeight: 1.5, marginBottom: 10, flex: 1 }}>
          {n.title}
        </h3>

        {/* Description */}
        {n.description && (
          <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {n.description}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={() => navigate("/news/article", { state: { originalNews: n } })}
          style={{
            width: "100%", padding: "11px 16px", borderRadius: 10,
            background: "rgba(16,185,129,0.09)",
            border: "1px solid rgba(16,185,129,0.2)",
            color: "#10B981", fontWeight: 700, fontSize: 13,
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(16,185,129,0.18)"; e.currentTarget.style.color = "#34D399"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(16,185,129,0.09)"; e.currentTarget.style.color = "#10B981"; }}
        >
          Read AI Editorial →
        </button>
      </div>
    </div>
  );
}
