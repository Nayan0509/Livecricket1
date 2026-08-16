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
  const articleDate = newsItem.date || "2026-04-12";
  const articleImg = newsItem.img || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop";
  const authorName = newsItem.author || "Live Cricket Zone Editorial Staff";
  const readTime = newsItem.readTime || "6 min read";

  const relatedArticles = ORIGINAL_ARTICLES.filter(a => a.id !== newsItem.id).slice(0, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": articleTitle,
    "image": [articleImg],
    "datePublished": `${articleDate}T09:00:00+05:30`,
    "dateModified": `${articleDate}T09:00:00+05:30`,
    "author": [{
      "@type": "Person",
      "name": authorName,
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
    <div className="container animate-fade-in" style={{ paddingBottom: 60, maxWidth: 880, margin: "0 auto" }}>
      <SEO
        title={`${articleTitle} — Live Cricket Zone`}
        description={newsItem.description || articleTitle}
        keywords={`${articleCategory} analysis, cricket editorial, ${articleTitle}`}
        url={`/news/${id || "detail"}`}
        structuredData={structuredData}
      />

      <div style={{ marginTop: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => navigate("/news")}
          className="btn btn-ghost"
          style={{ fontSize: 13, padding: "6px 14px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text2)", cursor: "pointer" }}
        >
          ← Back to All Articles
        </button>
        <span style={{ fontSize: 12, color: "var(--text3)" }}>⏱️ {readTime}</span>
      </div>

      <article style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px", overflow: "hidden" }}>
        {/* Category & Date */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#00F0FF", background: "rgba(0,240,255,0.12)", border: "1px solid rgba(0,240,255,0.25)", padding: "3px 10px", borderRadius: 20, textTransform: "uppercase" }}>
            {articleCategory}
          </span>
          <span style={{ fontSize: 13, color: "var(--text3)" }}>
            By <strong style={{ color: "var(--text)" }}>{authorName}</strong> · 📅 {articleDate}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 900, lineHeight: 1.3, color: "var(--text)", marginBottom: 20, letterSpacing: "-0.02em" }}>
          {articleTitle}
        </h1>

        {/* Main Cover Image */}
        <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 24, maxHeight: 420 }}>
          <img src={articleImg} alt={articleTitle} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* Summary / Description */}
        {newsItem.description && (
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text2)", fontWeight: 500, marginBottom: 24, borderLeft: "3px solid #00F0FF", paddingLeft: 16 }}>
            {newsItem.description}
          </p>
        )}

        {/* Key Takeaways Box */}
        {newsItem.takeaways && (
          <div style={{ background: "rgba(0,240,255,0.06)", border: "1px solid rgba(0,240,255,0.2)", borderRadius: 12, padding: "20px", marginBottom: 28 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#00F0FF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              📌 Key Strategic Highlights &amp; Takeaways
            </h3>
            <ul style={{ paddingLeft: 18, margin: 0, color: "var(--text2)", fontSize: 14, lineHeight: 1.75 }}>
              {newsItem.takeaways.map((t, i) => (
                <li key={i} style={{ marginBottom: 6 }}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Full Article Content Blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, color: "var(--text2)", fontSize: 15, lineHeight: 1.85 }}>
          {newsItem.content?.map((sec, i) => (
            <section key={i}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>
                {sec.heading}
              </h2>
              <p style={{ margin: 0 }}>{sec.text}</p>
            </section>
          ))}
        </div>

        {/* Author Bio Box */}
        <div style={{ marginTop: 36, padding: "20px 24px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#00F0FF,#00B8D9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: 18, flexShrink: 0 }}>
            🏏
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 2 }}>{authorName}</div>
            <p style={{ fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.6 }}>
              Published by the Live Cricket Zone Editorial Desk in accordance with our <Link to="/editorial-policy" style={{ color: "#00F0FF" }}>Editorial Standards &amp; Fact-Checking Policy</Link>.
            </p>
          </div>
        </div>
      </article>

      <div style={{ marginTop: 32 }}><AdBanner type="auto" /></div>

      {/* Related Original Articles */}
      {relatedArticles.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>
            🏏 Recommended Cricket Tactical Reads
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {relatedArticles.map(art => (
              <Link
                key={art.id}
                to={`/news/${art.id}`}
                state={{ originalNews: art }}
                style={{
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ height: 130, overflow: "hidden" }}>
                  <img src={art.img} alt={art.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#00F0FF", textTransform: "uppercase" }}>{art.category}</span>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", margin: "4px 0 8px", lineHeight: 1.4 }}>{art.title}</h4>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>⏱️ {art.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
