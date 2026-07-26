import React from "react";
import { useLocation, useNavigate, useParams, Link, Navigate } from "react-router-dom";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { ORIGINAL_ARTICLES } from "../utils/articlesData";

export default function NewsDetail() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const newsItem = state?.originalNews || ORIGINAL_ARTICLES.find(a => a.id === id);
  if (!newsItem) return <Navigate to="/news" replace />;

  const articleTitle = newsItem.title || "Cricket News & Match Analysis";
  const articleCategory = newsItem.category || "Cricket";
  const articleDate = newsItem.date || "2026";
  const articleImg = newsItem.img || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": articleTitle,
    "image": [articleImg],
    "datePublished": articleDate,
    "dateModified": articleDate,
    "author": [{
      "@type": "Organization",
      "name": "Live Cricket Zone Editorial Team",
      "url": "https://www.livecricketzone.com/about"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Live Cricket Zone",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.livecricketzone.com/logo192.png"
      }
    },
    "description": newsItem.description || articleTitle
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60, maxWidth: 860, margin: "0 auto" }}>
      <SEO
        title={`${articleTitle} — Live Cricket Zone`}
        description={newsItem.description || articleTitle}
        url={`/news/${id || "detail"}`}
        structuredData={structuredData}
      />

      <div style={{ marginTop: 12, marginBottom: 20 }}>
        <button
          onClick={() => navigate("/news")}
          className="btn btn-ghost"
          style={{ fontSize: 13, padding: "6px 14px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text2)", cursor: "pointer" }}
        >
          ← Back to All News
        </button>
      </div>

      <article style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px", overflow: "hidden" }}>
        {/* Category & Date */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#FF1053", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", padding: "3px 10px", borderRadius: 20, textTransform: "uppercase" }}>
            {articleCategory}
          </span>
          <span style={{ fontSize: 13, color: "var(--text3)" }}>
            By <strong style={{ color: "var(--text)" }}>Live Cricket Zone Editorial</strong> · {articleDate}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 900, lineHeight: 1.3, color: "var(--text)", marginBottom: 20, letterSpacing: "-0.02em" }}>
          {articleTitle}
        </h1>

        {/* Main Cover Image */}
        <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 24, maxHeight: 420 }}>
          <img src={articleImg} alt={articleTitle} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* Summary / Description */}
        {newsItem.description && (
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text2)", fontWeight: 500, marginBottom: 24, borderLeft: "3px solid #B026FF", paddingLeft: 16 }}>
            {newsItem.description}
          </p>
        )}

        {/* Key Takeaways Box */}
        {newsItem.takeaways && (
          <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "20px", marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#B026FF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              📌 Key Highlights & Takeaways
            </h3>
            <ul style={{ paddingLeft: 18, margin: 0, color: "var(--text2)", fontSize: 14, lineHeight: 1.7 }}>
              {newsItem.takeaways.map((t, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Full Article Content Blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, color: "var(--text2)", fontSize: 15, lineHeight: 1.85 }}>
          {newsItem.content.map((sec, i) => (
            <section key={i}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>
                {sec.heading}
              </h2>
              <p style={{ margin: 0 }}>{sec.text}</p>
            </section>
          ))}
        </div>

        {/* Original Source Reference */}
        {newsItem.url && (
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              External source attribution: {newsItem.source || "Cricket News Wire"}
            </span>
            <a
              href={newsItem.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, fontWeight: 700, color: "#B026FF", textDecoration: "none" }}
            >
              View original bulletin source ↗
            </a>
          </div>
        )}
      </article>

      <div style={{ marginTop: 32 }}><AdBanner type="auto" /></div>
    </div>
  );
}
