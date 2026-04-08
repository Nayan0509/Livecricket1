import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function ChampionsTrophy() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const ctMatches = (data?.data || []).filter(m => m.series?.includes("Champions Trophy") || m.name?.includes("Champions Trophy"));
        setMatches(ctMatches);
      } catch (error) {
        console.error("Error loading Champions Trophy matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Champions Trophy 2026 Live Score - ICC Champions Trophy"
        description="Champions Trophy 2026 live score, schedule, standings. Get real-time ICC Champions Trophy cricket updates."
        keywords="Champions Trophy, Champions Trophy 2026, ICC Champions Trophy, Champions Trophy live score"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="hero">
          <h1 className="hero-title">Champions Trophy 2026</h1>
          <p className="hero-subtitle">ICC Champions Trophy - Live Score & Updates</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <Link to="/live" className="btn btn-primary">Live Matches</Link>
            <Link to="/schedule" className="btn btn-secondary">Schedule</Link>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Live Champions Trophy Matches</h2>
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
              No Champions Trophy matches currently available
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-header">
            <h2 className="section-title">About Champions Trophy</h2>
          </div>
          <p style={{ color: "var(--text2)", lineHeight: 1.6 }}>
            The ICC Champions Trophy is a premier ODI cricket tournament featuring the top 8 teams. 
            Get live scores and real-time updates for all Champions Trophy matches.
          </p>
        </div>
      </div>
    </>
  );
}
