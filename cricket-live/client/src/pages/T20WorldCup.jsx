import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function T20WorldCup() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        // Filter for T20 World Cup matches
        const wcMatches = (data?.data || []).filter(m => m.series?.includes("T20 World Cup") || m.name?.includes("T20 World Cup"));
        setMatches(wcMatches);
      } catch (error) {
        console.error("Error loading T20 World Cup matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="T20 World Cup 2026 Live Score - Schedule & Standings"
        description="T20 World Cup 2026 live score, schedule, standings, and news. Get real-time updates for all T20 World Cup matches."
        keywords="T20 World Cup 2026, T20 World Cup live score, T20 World Cup schedule, T20 World Cup standings"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="hero">
          <h1 className="hero-title">T20 World Cup 2026</h1>
          <p className="hero-subtitle">Live Score, Schedule & Coverage</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <Link to="/live" className="btn btn-primary">Live Matches</Link>
            <Link to="/schedule" className="btn btn-secondary">Schedule</Link>
            <Link to="/results" className="btn btn-secondary">Results</Link>
          </div>
        </div>

        <div className="grid-4" style={{ marginBottom: 48 }}>
          <div className="stat-card">
            <div className="stat-value">16</div>
            <div className="stat-label">Teams</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">45</div>
            <div className="stat-label">Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">30</div>
            <div className="stat-label">Days</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">400+</div>
            <div className="stat-label">Players</div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Live T20 World Cup Matches</h2>
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
              No T20 World Cup matches currently available
            </div>
          )}
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Participating Teams</h2>
          </div>
          <div className="grid-4">
            {["India", "Pakistan", "Australia", "England", "South Africa", "West Indies", "New Zealand", "Sri Lanka", 
              "Bangladesh", "Afghanistan", "Ireland", "Netherlands", "Namibia", "Oman", "UAE", "Zimbabwe"].map(team => (
              <div key={team} className="card" style={{ textAlign: "center", padding: "20px 16px" }}>
                <div style={{ fontWeight: 700 }}>{team}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">About T20 World Cup 2026</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, color: "var(--text2)", lineHeight: 1.6 }}>
            <p>
              The ICC T20 World Cup 2026 is the premier international T20 cricket tournament featuring 16 teams from around the world. 
              Get live scores, ball-by-ball commentary, and real-time updates for all matches.
            </p>
            <p>
              Follow your favorite teams including India, Pakistan, Australia, England, South Africa, West Indies, New Zealand, 
              Sri Lanka, Bangladesh, Afghanistan, and more as they compete for the T20 World Cup trophy.
            </p>
            <p>
              Stay updated with T20 World Cup schedule, standings, player statistics, and breaking news from the tournament.
            </p>
          </div>
        </div>

        <div className="grid-3">
          <Link to="/live" className="btn btn-primary" style={{ padding: "16px", justifyContent: "center" }}>Live Matches</Link>
          <Link to="/schedule" className="btn btn-secondary" style={{ padding: "16px", justifyContent: "center" }}>Schedule</Link>
          <Link to="/results" className="btn btn-secondary" style={{ padding: "16px", justifyContent: "center" }}>Results</Link>
          <Link to="/rankings" className="btn btn-secondary" style={{ padding: "16px", justifyContent: "center" }}>Rankings</Link>
          <Link to="/teams" className="btn btn-secondary" style={{ padding: "16px", justifyContent: "center" }}>Teams</Link>
          <Link to="/players" className="btn btn-secondary" style={{ padding: "16px", justifyContent: "center" }}>Players</Link>
        </div>
      </div>
    </>
  );
}
