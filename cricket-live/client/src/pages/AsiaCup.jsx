import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function AsiaCup() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const asiaMatches = (data?.data || []).filter(m => m.series?.includes("Asia Cup") || m.name?.includes("Asia Cup"));
        setMatches(asiaMatches);
      } catch (error) {
        console.error("Error loading Asia Cup matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Asia Cup 2026 Live Score - Asia Cup Cricket Updates"
        description="Asia Cup 2026 live score, schedule, standings. Get real-time Asia Cup cricket updates for India, Pakistan, Sri Lanka, Bangladesh."
        keywords="Asia Cup, Asia Cup 2026, Asia Cup live score, Asia Cup today, India vs Pakistan"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="hero">
          <h1 className="hero-title">Asia Cup 2026 Live Score</h1>
          <p className="hero-subtitle">Asia's Premier Cricket Tournament</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <Link to="/live" className="btn btn-primary">Live Matches</Link>
            <Link to="/schedule" className="btn btn-secondary">Schedule</Link>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Participating Teams</h2>
          </div>
          <div className="grid-3">
            {["India", "Pakistan", "Sri Lanka", "Bangladesh", "Afghanistan", "Nepal"].map(team => (
              <div key={team} className="card" style={{ textAlign: "center", padding: "20px 16px" }}>
                <div style={{ fontWeight: 700 }}>{team}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Live Asia Cup Matches</h2>
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
              No Asia Cup matches currently available
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-header">
            <h2 className="section-title">About Asia Cup</h2>
          </div>
          <p style={{ color: "var(--text2)", lineHeight: 1.6 }}>
            The Asia Cup is a premier cricket tournament featuring teams from Asia including India, Pakistan, Sri Lanka, 
            Bangladesh, Afghanistan, and Nepal. Get live scores and real-time updates for all Asia Cup matches.
          </p>
        </div>
      </div>
    </>
  );
}
