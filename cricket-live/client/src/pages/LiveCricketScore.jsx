import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function LiveCricketScore() {
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
    const interval = setInterval(loadMatches, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SEO 
        title="Live Cricket Score Today - Fastest Real-Time Cricket Updates 2026"
        description="Get the fastest live cricket score today with real-time ball-by-ball updates. Faster than Cricbuzz and ESPNcricinfo. Live cricket scores for IPL, T20 World Cup, ODI, Test matches updated every 15 seconds."
        keywords="live cricket score, live cricket score today, cricket live score, cricket score live, live score cricket, cricket live, live cricket, cricket score today, live cricket match, cricket match live score, ball by ball cricket score, fastest cricket score, real time cricket score, instant cricket score, cricket score faster than cricbuzz, better than espncricinfo"
      />
      
      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="hero">
          <h1 className="hero-title">Live Cricket Score Today</h1>
          <p className="hero-subtitle">Fastest Real-Time Cricket Updates • Updated Every 15 Seconds</p>
          <div style={{ 
            background: "rgba(255, 255, 255, 0.1)", 
            padding: "16px", 
            borderRadius: "var(--radius)", 
            marginBottom: "16px",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <div style={{ fontSize: 14, marginBottom: 4 }}>⚡ Auto-refreshing every 15 seconds</div>
            <div style={{ fontSize: 14 }}>🔴 Live ball-by-ball commentary</div>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: 48 }}>
          <div className="stat-card">
            <div className="stat-value">15s</div>
            <div className="stat-label">Update Speed</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Faster than competitors</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">100%</div>
            <div className="stat-label">Free Forever</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>No subscription needed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Live Coverage</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>All formats & leagues</div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">🔴 Live Cricket Matches Now</h2>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : matches.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {matches.map(match => (
                <Link key={match.id} to={`/match/${match.id}/live-score`} style={{ textDecoration: "none" }}>
                  <div className="match-card match-card-live">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span className="badge badge-live">● LIVE</span>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4, fontFamily: "'Poppins', sans-serif" }}>{match.name}</div>
                        <div style={{ fontSize: 13, color: "var(--text2)" }}>📍 {match.venue}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--primary-light)", fontWeight: 700, fontSize: 13 }}>{match.status}</div>
                      </div>
                    </div>
                    <div style={{ borderTop: "1px solid var(--divider)", paddingTop: 12 }}>
                      <div style={{ fontSize: 13, color: "var(--text2)" }}>Click for ball-by-ball commentary →</div>
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

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Why Choose Live Cricket Zone?</h2>
          </div>
          <div className="grid-2">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>Fastest Updates</h3>
              <p style={{ color: "var(--text2)", lineHeight: 1.6 }}>Get live cricket scores updated every 15 seconds - faster than Cricbuzz and ESPNcricinfo. Real-time ball-by-ball commentary for all matches.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🆓</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>100% Free</h3>
              <p style={{ color: "var(--text2)", lineHeight: 1.6 }}>No subscription, no registration, no hidden fees. Access all live cricket scores, stats, and commentary completely free forever.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏏</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>All Formats</h3>
              <p style={{ color: "var(--text2)", lineHeight: 1.6 }}>Coverage for IPL, T20 World Cup, ODI World Cup, Test cricket, PSL, BBL, CPL, BPL, Asia Cup, Champions Trophy, and all international matches.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, fontFamily: "'Poppins', sans-serif" }}>Mobile Friendly</h3>
              <p style={{ color: "var(--text2)", lineHeight: 1.6 }}>Optimized for mobile devices. Get live cricket scores on the go with our fast-loading, responsive design.</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Live Cricket Score Features</h2>
          </div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <li style={{ display: "flex", alignItems: "start", gap: 12 }}>
              <span style={{ color: "var(--accent-green)", fontSize: 20, flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: "var(--text)" }}>Ball-by-Ball Commentary:</strong>
                <span style={{ color: "var(--text2)" }}> Get detailed ball-by-ball updates for every delivery with expert commentary</span>
              </div>
            </li>
            <li style={{ display: "flex", alignItems: "start", gap: 12 }}>
              <span style={{ color: "var(--accent-green)", fontSize: 20, flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: "var(--text)" }}>Live Scorecard:</strong>
                <span style={{ color: "var(--text2)" }}> Complete scorecard with batting, bowling, and partnership details updated in real-time</span>
              </div>
            </li>
            <li style={{ display: "flex", alignItems: "start", gap: 12 }}>
              <span style={{ color: "var(--accent-green)", fontSize: 20, flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: "var(--text)" }}>Match Statistics:</strong>
                <span style={{ color: "var(--text2)" }}> Comprehensive stats including run rate, required run rate, partnerships, and player performance</span>
              </div>
            </li>
            <li style={{ display: "flex", alignItems: "start", gap: 12 }}>
              <span style={{ color: "var(--accent-green)", fontSize: 20, flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: "var(--text)" }}>Auto-Refresh:</strong>
                <span style={{ color: "var(--text2)" }}> Scores automatically refresh every 15 seconds so you never miss a moment</span>
              </div>
            </li>
            <li style={{ display: "flex", alignItems: "start", gap: 12 }}>
              <span style={{ color: "var(--accent-green)", fontSize: 20, flexShrink: 0 }}>✓</span>
              <div>
                <strong style={{ color: "var(--text)" }}>All Leagues:</strong>
                <span style={{ color: "var(--text2)" }}> IPL, T20 World Cup, ODI World Cup, Test cricket, PSL, BBL, CPL, BPL, Asia Cup, Champions Trophy</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Popular Cricket Searches</h2>
          </div>
          <div className="grid-4">
            <Link to="/ipl" className="link-primary">IPL Live Score</Link>
            <Link to="/t20-world-cup" className="link-primary">T20 World Cup Live</Link>
            <Link to="/world-cup" className="link-primary">ODI World Cup Live</Link>
            <Link to="/asia-cup" className="link-primary">Asia Cup Live</Link>
            <Link to="/psl" className="link-primary">PSL Live Score</Link>
            <Link to="/bbl" className="link-primary">BBL Live Score</Link>
            <Link to="/test" className="link-primary">Test Cricket Live</Link>
            <Link to="/womens-cricket" className="link-primary">Women's Cricket Live</Link>
          </div>
        </div>
      </div>
    </>
  );
}
