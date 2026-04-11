import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";

export default function News() {
  const { data, isLoading, error } = useQuery({ queryKey: ["news"], queryFn: fetchNews });
  const items = data?.data || [];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60 }}>
      <SEO
        title="Global Cricket Newsroom - Enterprise News Feed"
        description="Premium news coverage from global sources."
        url="/news"
      />
      
      <div className="glass" style={{ padding: "40px", borderRadius: "var(--radius-xl)", marginBottom: 40 }}>
        <h1 className="page-title" style={{ marginBottom: 12 }}>📰 Global Newsroom</h1>
        <p style={{ color: "var(--text2)", fontSize: 16 }}>Latest cricket news from the past 2-3 days. Curated from Google News and Cricbuzz.</p>
      </div>

      {isLoading && <div className="spinner" />}
      {error && <div className="card glass" style={{ borderColor: "var(--error)", padding: 40, textAlign: "center" }}>
          <h2 style={{ color: "var(--error)" }}>News Hub Unavailable</h2>
          <p style={{ color: "var(--text3)", marginTop: 12 }}>Unable to fetch global news streams. {error.message}</p>
        </div>}

      {!isLoading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 24 }}>
          {items.map((n, i) => (
            <div key={i} className="card glass animate-fade-in" style={{ 
              animationDelay: `${i * 0.05}s`,
              display: "flex", flexDirection: "column", height: "100%", border: "1px solid var(--glass-border)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                 <span className="badge badge-upcoming" style={{ background: "rgba(224, 45, 45, 0.1)", color: "var(--primary-light)" }}>{n.source}</span>
                 <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700 }}>
                   {n.hoursAgo !== undefined ? (
                     n.hoursAgo < 24 ? `${n.hoursAgo}h ago` : `${n.daysAgo}d ago`
                   ) : n.date}
                 </span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 12, lineHeight: 1.4 }}>{n.title}</h3>
              <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, flex: 1, marginBottom: 20 }}>
                {n.description}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <a href={n.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 12, padding: "8px 16px" }}>
                   Read Extended Analysis
                 </a>
                 <div style={{ fontSize: 10, color: "var(--text3)" }}>{new Date().toLocaleDateString() === n.date ? "LIVE UPDATED" : "ARCHIVED"}</div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--text3)" }}>
              No active news streams discovered.
            </div>
          )}
        </div>
      )}

      <AdBanner type="responsive" slot="12345678" style={{ marginTop: 40 }} />
    </div>
  );
}
