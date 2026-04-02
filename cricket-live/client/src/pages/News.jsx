import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchNews } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";

export default function News() {
  const { data, isLoading, error } = useQuery({ queryKey: ["news"], queryFn: fetchNews });

  const items = data?.data || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <SEO
        title="Cricket News Today — Latest Match Updates, IPL 2026 News & Results"
        description="Latest cricket news today with match previews, results and live updates. Get IPL 2026 news, T20 World Cup updates, ODI and Test match news from around the world with team and player updates."
        keywords="cricket news today, cricket news, IPL 2026 news, T20 World Cup news, cricket match updates, cricket results today, cricket headlines, cricket breaking news"
        url="/news"
      />
      <h1 className="page-title">📰 Cricket News</h1>
      <p style={{ color: "var(--text2)", marginBottom: 24, fontSize: 14 }}>
        Latest cricket news, match updates and headlines
      </p>

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load: {error.message}</div>}

      {!isLoading && <AdBanner type="responsive" slot="1234567899" style={{ marginBottom: 24 }} />}

      {!isLoading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 20 }}>
          {items.map((n, i) => {
            // Check if it's a real news article or match update
            const isNewsArticle = n.url && n.url.startsWith("http");
            
            return isNewsArticle ? (
              // Real news article
              <a key={n.id || i} href={n.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  {n.image && (
                    <img src={n.image} alt={n.title} 
                      style={{ 
                        width: "100%", 
                        height: 180, 
                        objectFit: "cover", 
                        borderRadius: "8px 8px 0 0",
                        marginBottom: 12 
                      }} 
                      onError={(e) => e.target.style.display = "none"}
                    />
                  )}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.4 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12, lineHeight: 1.5, flex: 1 }}>
                      {n.description}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: "auto" }}>
                      <span className="badge badge-upcoming" style={{ fontSize: 10 }}>
                        {n.source}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text3)" }}>📅 {n.date}</span>
                      {n.author && (
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>✍️ {n.author}</span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ) : (
              // Match update fallback
              <Link key={n.id || i} to={`/match/${n.id}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ height: "100%" }}>
                  {n.teamInfo?.length > 0 && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                      {n.teamInfo.slice(0,2).map((t, ti) => (
                        <React.Fragment key={ti}>
                          {ti === 1 && <span style={{ color: "var(--text3)", fontSize: 12 }}>vs</span>}
                          {t.img && <img src={t.img} alt={t.shortname}
                            style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.4 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>{n.description}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {n.matchType && <span className="badge badge-upcoming">{n.matchType.toUpperCase()}</span>}
                    <span style={{ fontSize: 11, color: "var(--text3)" }}>📅 {n.date}</span>
                  </div>
                  {n.venue && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>📍 {n.venue}</div>}
                </div>
              </Link>
            );
          })}
          {items.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", color:"var(--text2)", padding:40 }}>
              No news available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
