import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function CricketScoreToday() {
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

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <SEO 
        title="Cricket Score Today - Live Match Scores 2026"
        description="Cricket score today for all live matches. Ball-by-ball commentary for IPL, T20, ODI and Test matches. Updated every 15 seconds."
        keywords="cricket score today, today cricket score, cricket match today, cricket today, today cricket match, cricket live today, cricket score live today, today match score, cricket match score today, live cricket today, today cricket live score"
      />
      
      <div className="container" style={{ paddingBottom: 40 }}>
        <div className="hero">
          <h1 className="hero-title">Cricket Score Today</h1>
          <p className="hero-subtitle">{today}</p>
          <p style={{ fontSize: 18, position: "relative", zIndex: 1 }}>All Live Cricket Matches • Real-Time Updates</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div className="section-header">
            <h2 className="section-title">Today's Cricket Matches</h2>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : matches.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {matches.map(match => (
                <Link key={match.id} to={`/match/${match.id}`} style={{ textDecoration: "none" }}>
                  <div className="match-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>{match.name}</div>
                        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>📍 {match.venue}</div>
                        <div style={{ fontSize: 12, color: "var(--text3)" }}>📅 {match.date}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "var(--primary-light)", fontWeight: 700, marginBottom: 8 }}>{match.status}</div>
                        <Link to={`/match/${match.id}/live-score`} className="link-primary" style={{ fontSize: 13 }}>
                          Live Score →
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 40 }}>
              <div style={{ color: "var(--text2)", marginBottom: 16 }}>No matches scheduled for today</div>
              <Link to="/upcoming" className="link-primary">View upcoming matches →</Link>
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Today's Cricket Coverage</h2>
          </div>
          <p style={{ color: "var(--text2)", marginBottom: 24, lineHeight: 1.6 }}>
            Get complete cricket score today for all live matches including IPL 2026, T20 World Cup, ODI World Cup, 
            Test cricket, PSL, BBL, CPL, BPL, Asia Cup, and Champions Trophy. Real-time ball-by-ball updates, 
            live scorecard, match statistics, and expert commentary.
          </p>
          <div className="grid-4">
            <Link to="/live" className="link-primary">Live Matches</Link>
            <Link to="/upcoming" className="link-primary">Upcoming Today</Link>
            <Link to="/schedule" className="link-primary">Full Schedule</Link>
            <Link to="/results" className="link-primary">Recent Results</Link>
          </div>
        </div>
      </div>
    </>
  );
}
