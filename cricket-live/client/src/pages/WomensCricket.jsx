import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function WomensCricket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const womensMatches = (data?.data || []).filter(m => m.name?.includes("Women") || m.series?.includes("Women"));
        setMatches(womensMatches);
      } catch (error) {
        console.error("Error loading Women's matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Women's Cricket Live Score - Women's Cricket Today"
        description="Women's cricket live score today. Get real-time updates for women's cricket matches, T20 World Cup, ODI, and Test matches."
        keywords="women's cricket, women's cricket live score, women's T20 world cup, women's cricket today, women's IPL"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="hero">
          <h1 className="hero-title">Women's Cricket Live Score</h1>
          <p className="hero-subtitle">Real-time Updates for Women's Cricket Worldwide</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <Link to="/live" className="btn btn-primary">Live Now</Link>
            <Link to="/schedule" className="btn btn-secondary">Schedule</Link>
            <Link to="/rankings" className="btn btn-secondary">Rankings</Link>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Major Women's Tournaments</h2>
          </div>
          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>Women's T20 WC</h3>
              <div style={{ color: "var(--text2)" }}>T20 World Cup</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>16 Teams</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏏</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>Women's ODI WC</h3>
              <div style={{ color: "var(--text2)" }}>ODI World Cup</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>10 Teams</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>Women's IPL</h3>
              <div style={{ color: "var(--text2)" }}>Indian Premier League</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>5 Teams</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Live Women's Cricket Matches</h2>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : matches.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {matches.slice(0, 8).map(match => (
                <Link key={match.id} to={`/match/${match.id}`} style={{ textDecoration: "none" }}>
                  <div className="match-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Poppins', sans-serif" }}>{match.name}</div>
                        <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>📅 {match.date}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--primary-light)", fontWeight: 700 }}>{match.status}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text2)" }}>
              No women's cricket matches currently available
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Women's Cricket</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, color: "var(--text2)", lineHeight: 1.6 }}>
            <p>
              Follow live scores for women's cricket including T20 World Cup, ODI World Cup, Women's IPL, 
              and international bilateral series. Get real-time ball-by-ball commentary and match updates.
            </p>
            <p>
              Stay updated with women's cricket rankings, player statistics, and breaking news from tournaments worldwide.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
