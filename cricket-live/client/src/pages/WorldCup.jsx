import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function WorldCup() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const wcMatches = (data?.data || []).filter(m => m.series?.includes("World Cup") || m.name?.includes("World Cup"));
        setMatches(wcMatches);
      } catch (error) {
        console.error("Error loading World Cup matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Cricket World Cup 2026 Live Score - ODI World Cup Updates"
        description="Cricket World Cup 2026 live score, schedule, standings. Get real-time ODI World Cup cricket updates today."
        keywords="cricket world cup, world cup 2026, ODI world cup, cricket world cup live score, world cup schedule"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="hero">
          <h1 className="hero-title">Cricket World Cup 2026</h1>
          <p className="hero-subtitle">ODI World Cup - Live Score & Updates</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <Link to="/live" className="btn btn-primary">Live Matches</Link>
            <Link to="/schedule" className="btn btn-secondary">Schedule</Link>
            <Link to="/results" className="btn btn-secondary">Results</Link>
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom: 48 }}>
          <div className="stat-card">
            <div className="stat-value">10</div>
            <div className="stat-label">Teams</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">48</div>
            <div className="stat-label">Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">45</div>
            <div className="stat-label">Days</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">300+</div>
            <div className="stat-label">Players</div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Live World Cup Matches</h2>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : matches.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {matches.slice(0, 6).map(match => (
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
              No World Cup matches currently available
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-header">
            <h2 className="section-title">About Cricket World Cup</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, color: "var(--text2)", lineHeight: 1.6 }}>
            <p>
              The ICC Cricket World Cup is the premier ODI cricket tournament featuring the top 10 teams from around the world. 
              Get live scores, ball-by-ball commentary, and real-time updates for all World Cup matches.
            </p>
            <p>
              Follow your favorite teams including India, Pakistan, Australia, England, South Africa, New Zealand, 
              Sri Lanka, Bangladesh, West Indies, and Afghanistan competing for the World Cup trophy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
