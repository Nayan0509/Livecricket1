import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function BallByBall() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        setMatches(data?.data || []);
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Ball by Ball Cricket Commentary Live - Real-Time Updates Every Ball"
        description="Ball by ball cricket commentary live for all matches. Real-time ball-by-ball updates, live cricket score, detailed commentary for IPL 2026, T20 World Cup, ODI and Test matches. Updated every 15 seconds."
        keywords="ball by ball cricket, ball by ball commentary, cricket ball by ball, live ball by ball, ball by ball cricket score, cricket commentary live, live cricket commentary, ball by ball updates, IPL ball by ball, T20 ball by ball commentary"
        url="/ball-by-ball"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Ball by Ball Cricket Commentary Live",
          "description": "Real-time ball-by-ball cricket commentary for all live matches",
          "url": "https://www.livecricketzone.com/ball-by-ball",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.livecricketzone.com" },
              { "@type": "ListItem", "position": 2, "name": "Ball by Ball Commentary", "item": "https://www.livecricketzone.com/ball-by-ball" }
            ]
          }
        }}
      />
      
      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="hero">
          <h1 className="hero-title">Ball by Ball Cricket Commentary</h1>
          <p className="hero-subtitle">Live Ball-by-Ball Updates • Real-Time Commentary</p>
          <div style={{ 
            background: "rgba(255, 255, 255, 0.1)", 
            padding: "16px", 
            borderRadius: "var(--radius)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            position: "relative",
            zIndex: 1
          }}>
            <div style={{ fontSize: 14 }}>🎯 Every ball • Every run • Every wicket • Real-time updates</div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Live Ball-by-Ball Commentary</h2>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : matches.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {matches.map(match => (
                <Link key={match.id} to={`/match/${match.id}/live-score`} style={{ textDecoration: "none" }}>
                  <div className="match-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>{match.name}</div>
                        <div style={{ fontSize: 13, color: "var(--text2)" }}>📍 {match.venue}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ 
                          background: "rgba(16, 185, 129, 0.15)", 
                          color: "var(--accent-green)", 
                          padding: "6px 12px", 
                          borderRadius: "6px", 
                          fontSize: 13, 
                          fontWeight: 700,
                          border: "1px solid rgba(16, 185, 129, 0.3)"
                        }}>
                          Ball-by-Ball →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 40 }}>
              <div style={{ color: "var(--text2)", marginBottom: 16 }}>No live matches at the moment</div>
              <Link to="/upcoming" className="link-primary">View upcoming matches →</Link>
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Ball-by-Ball Features</h2>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <li style={{ display: "flex", alignItems: "start", gap: 12 }}>
              <span style={{ color: "var(--accent-green)", fontSize: 20, flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: "var(--text)" }}>Every Ball Covered:</strong>
                <span style={{ color: "var(--text2)" }}> Complete ball-by-ball commentary for every delivery</span>
              </div>
            </li>
            <li style={{ display: "flex", alignItems: "start", gap: 12 }}>
              <span style={{ color: "var(--accent-green)", fontSize: 20, flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: "var(--text)" }}>Real-Time Updates:</strong>
                <span style={{ color: "var(--text2)" }}> Live updates within seconds of each ball</span>
              </div>
            </li>
            <li style={{ display: "flex", alignItems: "start", gap: 12 }}>
              <span style={{ color: "var(--accent-green)", fontSize: 20, flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: "var(--text)" }}>Expert Commentary:</strong>
                <span style={{ color: "var(--text2)" }}> Detailed analysis and insights for each delivery</span>
              </div>
            </li>
            <li style={{ display: "flex", alignItems: "start", gap: 12 }}>
              <span style={{ color: "var(--accent-green)", fontSize: 20, flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: "var(--text)" }}>All Formats:</strong>
                <span style={{ color: "var(--text2)" }}> IPL, T20, ODI, Test cricket ball-by-ball coverage</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
