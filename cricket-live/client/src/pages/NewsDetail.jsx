import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

export default function NewsDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const originalNews = state?.originalNews;
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!originalNews) {
      navigate("/news");
      return;
    }

    const generateArticle = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/news/article", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: originalNews.title,
            description: originalNews.description,
            source: originalNews.source
          })
        });
        
        const data = await res.json();
        if (data.status === "success") {
          setArticle(data.data);
        } else {
          setError(data.error || "Failed to generate article");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    generateArticle();
  }, [originalNews, navigate]);

  if (!originalNews) return null;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60, maxWidth: 840, margin: "0 auto" }}>
      <SEO 
        title={article ? article.title : originalNews.title} 
        description={originalNews.description} 
        url={`/news/${originalNews.id}`} 
      />
      
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-ghost" 
        style={{ marginBottom: 32, fontSize: 14, padding: "8px 16px", borderRadius: "100px" }}
      >
        ← Back to News
      </button>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div className="spinner" style={{ marginBottom: 24, width: 50, height: 50, borderWidth: 4 }}></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, background: "var(--gradient-primary)", WebkitBackgroundClip: "text", color: "transparent" }}>
            AI Editorial Desk is Writing...
          </h2>
          <p style={{ color: "var(--text3)", fontSize: 16 }}>
            Our Google Gemini AI is analyzing the facts and writing a comprehensive original article for you.
          </p>
        </div>
      ) : error ? (
        <div className="card" style={{ borderColor: "var(--error)", padding: 40, textAlign: "center" }}>
          <h2 style={{ color: "var(--error)", marginBottom: 12 }}>Editorial Generation Failed</h2>
          <p style={{ color: "var(--text3)" }}>{error}</p>
        </div>
      ) : (
        <article className="animate-fade-in">
          {/* Article Header */}
          <header style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: 20, flexWrap: "wrap" }}>
              {article?.tags?.map((tag, i) => (
                <span key={i} style={{ 
                  background: "rgba(6, 182, 212, 0.1)", 
                  color: "var(--cyan-light)", 
                  padding: "6px 14px", 
                  borderRadius: "100px", 
                  fontSize: 12, 
                  fontWeight: 700,
                  letterSpacing: "0.5px"
                }}>
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 style={{ 
              fontSize: "clamp(32px, 5vw, 48px)", 
              fontWeight: 900, 
              lineHeight: 1.2, 
              marginBottom: 24,
              letterSpacing: "-0.02em",
              color: "#fff"
            }}>
              {article?.title}
            </h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "16px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#fff" }}>
                  AI
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text)" }}>Gemini Editorial Team</div>
                  <div style={{ fontSize: 13, color: "var(--text3)" }}>
                    Published on {new Date(article?.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                {article?.isGenerated && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-light)", background: "rgba(124,58,237,0.1)", padding: "4px 12px", borderRadius: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--primary-light)" }} />
                    100% Unique Content
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="article-content"
            style={{ 
              fontSize: 18, 
              lineHeight: 1.8, 
              color: "var(--text2)",
            }}
            dangerouslySetInnerHTML={{ __html: article?.content }}
          />

          {/* Author Bio Box */}
          <div style={{ 
            marginTop: 60, 
            padding: 32, 
            background: "var(--glass)", 
            borderRadius: "var(--radius-xl)", 
            border: "1px solid var(--glass-border)",
            display: "flex",
            gap: 24,
            alignItems: "center"
          }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--gradient-cool)", flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>About Our AI Desk</h3>
              <p style={{ color: "var(--text3)", fontSize: 15, lineHeight: 1.6 }}>
                This article was exclusively written by our advanced Google Gemini AI model based on breaking news from {originalNews.source}. It is designed to provide you with unique, high-quality, and SEO-optimized cricket insights.
              </p>
            </div>
          </div>
        </article>
      )}
      
      <style>{`
        .article-content p {
          margin-bottom: 24px;
        }
        .article-content p:first-of-type {
          font-size: 22px;
          lineHeight: 1.6;
          color: var(--text);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
