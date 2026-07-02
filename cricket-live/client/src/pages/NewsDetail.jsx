import React from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import SEO from "../components/SEO";

// News is aggregated from third-party cricket sources. We show the headline
// and a short snippet, then link out to the original article at its source —
// we do not reproduce or rewrite the full story.
export default function NewsDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const news = state?.originalNews;

  // Direct visits (no navigation state) have nothing to show — send to the list.
  if (!news) return <Navigate to="/news" replace />;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60, maxWidth: 760, margin: "0 auto" }}>
      <SEO
        title={news.title}
        description={news.description || news.title}
        url="/news"
      />

      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost"
        style={{ margin: "8px 0 28px", fontSize: 14, padding: "8px 16px", borderRadius: "100px" }}
      >
        ← Back to News
      </button>

      <article>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {news.source && <span className="news-source-badge">{news.source}</span>}
          <span style={{ fontSize: 13, color: "var(--text3)" }}>
            {news.hoursAgo != null
              ? news.hoursAgo < 24
                ? `${news.hoursAgo}h ago`
                : `${news.daysAgo || Math.round(news.hoursAgo / 24)}d ago`
              : news.date}
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, lineHeight: 1.25,
            marginBottom: 20, letterSpacing: "-0.02em", color: "#fff",
          }}
        >
          {news.title}
        </h1>

        {news.description && (
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--text2)", marginBottom: 28 }}>
            {news.description}
          </p>
        )}

        {news.url && (
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 24px", borderRadius: 10, textDecoration: "none",
              background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
              color: "#3B82F6", fontWeight: 700, fontSize: 14,
            }}
          >
            Read the full story at {news.source || "the source"} ↗
          </a>
        )}

        <p style={{ marginTop: 32, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
          This headline and snippet are aggregated from {news.source || "a third-party cricket news source"}.
          Live Cricket Zone links to the original article; all rights to the full story remain with the
          original publisher.
        </p>
      </article>
    </div>
  );
}
