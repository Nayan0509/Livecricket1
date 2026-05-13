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
    <div className="container animate-fade-in" style={{ paddingBottom: 60 }}>
      <SEO
        title="Cricket News Today - Latest Updates & Headlines"
        description="Latest cricket news today. Breaking news, match previews, player updates, IPL 2026 news and T20 World Cup headlines."
        url="/news"
      />
      
      <div className="hero" style={{ padding: "60px 40px", borderRadius: "var(--radius-xl)", marginBottom: 40, background: "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.1) 100%)", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-50%", right: "-20%", width: "60%", height: "200%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 60%)", filter: "blur(40px)", pointerEvents: "none" }} />
        <h1 className="page-title" style={{ marginBottom: 16, fontSize: "42px", display: "inline-block" }}>
          📰 Premium News Desk
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 18, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          Get the latest AI-generated insights and deep-dive analysis into the world of cricket, powered by Google Gemini.
        </p>
      </div>

      {isLoading && <div className="spinner" />}
      {error && <div className="card glass" style={{ borderColor: "var(--error)", padding: 40, textAlign: "center" }}>
          <h2 style={{ color: "var(--error)" }}>News Hub Unavailable</h2>
          <p style={{ color: "var(--text3)", marginTop: 12 }}>Unable to fetch global news streams. {error.message}</p>
        </div>}

      {!isLoading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 32 }}>
          {items.map((n, i) => (
            <div key={i} className="card animate-fade-in" style={{ 
              animationDelay: `${i * 0.05}s`,
              display: "flex", flexDirection: "column", height: "100%", 
              background: "rgba(14, 24, 40, 0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(124, 58, 237, 0.15)";
              e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                 <span style={{ 
                   background: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(124,58,237,0.05) 100%)", 
                   color: "#c4b5fd", 
                   padding: "6px 14px", 
                   borderRadius: "20px", 
                   fontSize: "12px", 
                   fontWeight: 700,
                   letterSpacing: "0.5px",
                   border: "1px solid rgba(124,58,237,0.3)"
                 }}>
                   {n.source}
                 </span>
                 <span style={{ fontSize: 13, color: "var(--text3)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                   <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary-light)" }} />
                   {n.hoursAgo !== undefined ? (
                     n.hoursAgo < 24 ? `${n.hoursAgo}h ago` : `${n.daysAgo}d ago`
                   ) : n.date}
                 </span>
              </div>
              
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, lineHeight: 1.4, color: "#fff", letterSpacing: "-0.01em" }}>
                {n.title}
              </h3>
              
              <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, flex: 1, marginBottom: 28, opacity: 0.9 }}>
                {n.description.length > 120 ? n.description.substring(0, 120) + "..." : n.description}
              </p>
              
              <button 
                onClick={() => navigate("/news/article", { state: { originalNews: n } })}
                className="btn" 
                style={{ 
                  background: "var(--text)", 
                  color: "var(--bg)", 
                  width: "100%", 
                  padding: "14px", 
                  borderRadius: "14px",
                  fontSize: "15px",
                  fontWeight: 700,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--primary-light)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--text)";
                  e.currentTarget.style.color = "var(--bg)";
                }}
              >
                Read AI Editorial Insight →
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 80, background: "rgba(255,255,255,0.02)", borderRadius: 24, border: "1px dashed rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <h3 style={{ fontSize: 20, color: "var(--text)", marginBottom: 8 }}>No active news streams discovered.</h3>
              <p style={{ color: "var(--text3)" }}>Our AI journalists are waiting for new stories to break.</p>
            </div>
          )}
        </div>
      )}

      <AdBanner type="responsive" slot="12345678" style={{ marginTop: 40 }} />
    </div>
  );
}
