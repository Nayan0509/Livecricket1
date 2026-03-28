import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NewsDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const article = state?.article;

  if (!article) {
    return (
      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="error-box">Article not found. <button className="btn btn-outline" onClick={() => navigate("/news")} style={{ marginTop: 12 }}>Back to News</button></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: 40, maxWidth: 800 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: 20, fontSize: 13 }}>
        ← Back
      </button>

      {article.imageUrl && (
        <img src={article.imageUrl} alt={article.title}
          style={{ width: "100%", borderRadius: 12, marginBottom: 24, aspectRatio: "16/9", objectFit: "cover" }} />
      )}

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>{article.title}</h1>
      <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 20 }}>{article.pubDate || article.date}</div>

      <div style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.8 }}>
        {article.intro || article.description || article.content || "Full article content not available."}
      </div>
    </div>
  );
}
