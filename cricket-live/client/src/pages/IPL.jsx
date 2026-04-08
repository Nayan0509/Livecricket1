import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches, fetchUpcomingMatches } from "../api";

export default function IPL() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [liveRes, upcomingRes] = await Promise.all([
          fetchLiveMatches(),
          fetchUpcomingMatches()
        ]);
        
        const filterIPL = (m) => m.series?.toLowerCase().includes("ipl") || m.name?.toLowerCase().includes("ipl") || m.name?.toLowerCase().includes("indian premier league");
        
        setLiveMatches((liveRes?.data || []).filter(filterIPL));
        setUpcomingMatches((upcomingRes?.data || []).filter(filterIPL));
      } catch (error) {
        console.error("Error loading IPL data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60 }}>
      <SEO 
        title="IPL 2026 Center - Live Scores, Schedule & Standings"
        description="Comprehensive coverage of Indian Premier League 2026."
        url="/ipl"
      />
      
      {/* Hero */}
      <div className="glass" style={{ padding: "60px 40px", borderRadius: "var(--radius-xl)", marginBottom: 40, textAlign: "center", background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), transparent)" }}>
        <h1 className="hero-title" style={{ fontSize: 64 }}>IPL 2026 CENTER</h1>
        <p className="hero-subtitle">The Pinnacle of T20 Cricket Dynamics</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button className="btn btn-primary" style={{ background: "var(--accent-orange)" }}>LIVE UPDATES</button>
          <button className="btn btn-outline">POINTS TABLE</button>
        </div>
      </div>

      {loading && <div className="spinner" />}

      {!loading && (
        <>
          {/* Live Section */}
          <div className="section-header">
             <h2 className="section-title">Active Transmissions (IPL)</h2>
          </div>
          {liveMatches.length > 0 ? (
            <div className="grid-2" style={{ marginBottom: 40 }}>
              {liveMatches.map(m => (
                <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                  <div className="card glass match-card-live" style={{ borderColor: "var(--accent-orange)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                       <span className="badge" style={{ background: "rgba(245, 158, 11, 0.2)", color: "var(--accent-orange)", border: "1px solid var(--accent-orange)" }}>LIVE NOW</span>
                       <span style={{ fontSize: 11, color: "var(--text3)" }}>{m.matchType}</span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{m.name}</div>
                    <div style={{ color: "var(--accent-orange)", fontWeight: 700 }}>{m.status}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass" style={{ padding: 40, textAlign: "center", marginBottom: 40, borderRadius: "var(--radius)" }}>
               <p style={{ color: "var(--text3)" }}>No IPL engagements currently in progress.</p>
            </div>
          )}

          {/* Upcoming Section */}
          <div className="section-header">
             <h2 className="section-title">Upcoming Pipeline</h2>
          </div>
          <div className="grid-3" style={{ marginBottom: 40 }}>
            {upcomingMatches.length > 0 ? upcomingMatches.map(m => (
              <div key={m.id} className="card glass" style={{ opacity: 0.8 }}>
                 <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8, fontWeight: 700 }}>{m.date}</div>
                 <div style={{ fontWeight: 800, marginBottom: 12 }}>{m.name}</div>
                 <div style={{ fontSize: 12, color: "var(--text2)" }}>{m.status}</div>
              </div>
            )) : (
               <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 20, color: "var(--text3)" }}>No future IPL schedules discovered in primary link.</div>
            )}
          </div>
        </>
      )}

      {/* Teams Grid */}
       <div className="section-header">
          <h2 className="section-title">Franchise Directory</h2>
       </div>
       <div className="grid-4">
         {["Mumbai Indians", "CSK", "RCB", "KKR", "Gujarat Titans", "Lucknow SG", "Delhi Capitals", "PBKS", "Rajasthan Royals", "SRH"].map(t => (
           <div key={t} className="card glass" style={{ textAlign: "center", cursor: "pointer", transition: "0.3s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div className="glass" style={{ width: 50, height: 50, borderRadius: "50%", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, background: "var(--gradient-primary)", border: "none" }}>{t[0]}</div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{t}</div>
           </div>
         ))}
       </div>
    </div>
  );
}
