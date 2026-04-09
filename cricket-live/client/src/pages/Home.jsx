import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { fetchLiveMatches, fetchUpcomingMatches, fetchSchedule, fetchNews } from "../api";
import MatchCard from "../components/MatchCard";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

const SITE_SD = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Live Cricket Zone - Enterprise Edition",
  "sport": "Cricket",
  "url": "https://www.livecricketzone.com"
};

export default function Home() {
  const navigate = useNavigate();

  const { data: liveData, isLoading: liveLoading, error: liveError } = useQuery({
    queryKey: ["liveMatches"], queryFn: fetchLiveMatches, refetchInterval: 30000,
  });
  const { data: upcomingData } = useQuery({
    queryKey: ["upcoming"], queryFn: fetchUpcomingMatches,
  });
  const { data: scheduleData } = useQuery({
    queryKey: ["schedule"], queryFn: fetchSchedule,
  });
  const { data: newsData } = useQuery({
    queryKey: ["news"], queryFn: fetchNews,
  });

  const liveMatches = Array.isArray(liveData?.data) ? liveData.data.slice(0, 4) : [];
  const upcoming = Array.isArray(upcomingData?.data) ? upcomingData.data.filter(m => !m.matchEnded).slice(0, 4) : [];
  const newsItems = Array.isArray(newsData?.data) ? newsData.data.slice(0, 6) : [];

  const scheduleRows = Array.isArray(scheduleData?.data) ? scheduleData.data : [];
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Live data:', liveData);
    console.log('Live matches:', liveMatches);
    console.log('Live error:', liveError);
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: 20, paddingBottom: 60 }}>
      <SEO
        title="Live Cricket Score Today - Ball by Ball Commentary, IPL 2026 & Live Match Updates"
        description="Fastest live cricket score today, ball by ball commentary, IPL 2026 live updates, T20 World Cup, ODI & Test match scorecards. Real-time cricket dashboard with expert insights."
        url="/"
        keywords="live cricket score, cricket score today, IPL 2026 live score, live match today, ball by ball commentary, cricket live streaming, T20 World Cup 2026, fastest cricket score, cricket news today, ICC rankings"
        structuredData={SITE_SD}
      />

      {/* Enterprise Hero */}
      <div className="glass" style={{
        borderRadius: "var(--radius-xl)",
        padding: "80px 40px",
        marginBottom: 40,
        backgroundImage: `linear-gradient(rgba(10, 14, 39, 0.75), rgba(10, 14, 39, 0.75)), url('/brain/740eef1d-bd94-4e68-9350-ff5f1a04f4fd/enterprise_cricket_banner_1775679421949.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: "1px solid var(--glass-border)",
        textAlign: "center"
      }}>
        <h1 className="premium-gradient-text" style={{ fontSize: 52, fontWeight: 900, marginBottom: 16 }}>
          Live Cricket Score Today - Real-Time Dashboard
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 19, maxWidth: 900, margin: "0 auto 40px", fontWeight: 500, lineHeight: 1.6 }}>
          Get the fastest ball-by-ball live cricket scores, in-depth match analysis, and global news coverage for IPL 2026, ICC World Cup, and international fixtures.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/live" className="btn btn-primary">🔴 Enter Live Center</Link>
          <Link to="/schedule" className="btn btn-outline" style={{ border: "1px solid var(--glass-border)" }}>📅 Schedule</Link>
        </div>

      </div>

      <div className="dashboard-grid">
        {/* Left Sidebar: Navigation & Rankings */}
        <aside className="dashboard-sidebar">
          <div className="glass" style={{ borderRadius: "var(--radius-lg)", padding: 24, position: "sticky", top: 100 }}>
            <h3 className="section-title" style={{ fontSize: 18, marginBottom: 24, paddingBottom: 0, border: "none" }}>
              🏆 Major Series
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "IPL 2026", path: "/ipl", color: "#4F46E5" },
                { name: "T20 World Cup", path: "/t20-world-cup", color: "#EC4899" },
                { name: "Big Bash League", path: "/bbl", color: "#F59E0B" },
                { name: "Champions Trophy", path: "/champions-trophy", color: "#14B8A6" },
                { name: "Women's Cricket", path: "/womens-cricket", color: "#D946EF" },
                { name: "PSL 2026", path: "/psl", color: "#10B981" }
              ].map(league => (
                <Link key={league.name} to={league.path} className="card" style={{ 
                  padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)",
                  display: "flex", alignItems: "center", gap: 12, borderRadius: "var(--radius)"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                >
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: league.color, boxShadow: `0 0 10px ${league.color}` }} />
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{league.name}</span>
                </Link>
              ))}
            </div>

            <div className="card" style={{ marginTop: 32, backgroundImage: "linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)", padding: 20 }}>
               <h4 style={{ fontSize: 14, marginBottom: 12, color: "var(--primary-light)" }}>📊 ICC Rankings</h4>
               <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>Stay updated with player & team rankings.</p>
               <Link to="/rankings" className="btn btn-outline" style={{ padding: "10px", width: "100%", fontSize: 12 }}>View Global Table</Link>
            </div>
          </div>
        </aside>

        {/* Center: Live Center & News */}
        <main style={{ minWidth: 0 }}>
          {/* Live Matches */}
          <section className="animate-fade-in delay-1" style={{ marginBottom: 48 }}>
            <div className="section-header">
              <h2 className="section-title">Live Analytics</h2>
              <Link to="/live" className="link-primary">See All Feed</Link>
            </div>
            {liveLoading ? <div className="spinner" /> : liveError ? (
              <div className="glass" style={{ padding: 40, textAlign: "center", gridColumn: "span 2", borderRadius: "var(--radius-lg)", border: "1px solid #ef4444" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                <h3 style={{ marginBottom: 12, color: "#ef4444" }}>Error Loading Matches</h3>
                <p style={{ color: "var(--text3)", fontSize: 14 }}>{liveError?.message || "Failed to fetch live matches"}</p>
              </div>
            ) : (
              <div className="grid-2">
                {liveMatches.length ? liveMatches.map(m => <MatchCard key={m.id} match={m} />) : (
                  <div className="glass" style={{ padding: 60, textAlign: "center", gridColumn: "span 2", borderRadius: "var(--radius-lg)" }}>
                    <div style={{ fontSize: 60, marginBottom: 20 }}>🏏</div>
                    <h3 style={{ marginBottom: 12 }}>No Live Coverage</h3>
                    <p style={{ color: "var(--text3)" }}>There are no matches currently being monitored live. Check the schedule for upcoming events.</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Ad Split */}
          <AdBanner type="responsive" slot="12345" style={{ marginBottom: 48 }} />

          {/* Market News */}
          <section className="animate-fade-in delay-2" style={{ marginBottom: 48 }}>
            <div className="section-header">
              <h2 className="section-title">Market News Feed</h2>
              <Link to="/news" className="link-primary">Open Newsroom</Link>
            </div>
            <div style={{ display: "grid", gap: 20 }}>
              {newsItems.length > 0 ? newsItems.map(item => (
                <div key={item.id} className="card glass animate-fade-in" style={{ 
                  display: "flex", gap: 24, padding: 24, border: "1px solid var(--glass-border)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                       <span style={{ fontSize: 11, color: "var(--primary-light)", fontWeight: 800, textTransform: "uppercase" }}>{item.source}</span>
                       <span style={{ fontSize: 11, color: "var(--text3)" }}>{item.date}</span>
                    </div>
                    <h3 style={{ fontSize: 20, marginBottom: 12, lineHeight: 1.4 }}>{item.title}</h3>
                    <p style={{ fontSize: 15, color: "var(--text2)", marginBottom: 16, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.description}
                    </p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: "8px 20px", fontSize: 12 }}>
                      Read Expert Analysis
                    </a>
                  </div>
                </div>
              )) : (
                <div className="card glass" style={{ padding: 40, textAlign: "center" }}>
                   <p style={{ color: "var(--text3)" }}>Polling Google News for latest analytics...</p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Right Sidebar: Schedule & CTA */}
        <aside className="dashboard-aside">
          <div className="glass" style={{ borderRadius: "var(--radius-lg)", padding: 24, position: "sticky", top: 100 }}>
             <h3 className="section-title" style={{ fontSize: 18, marginBottom: 24, paddingBottom: 0, border: "none" }}>
               🗓️ Global Schedule
             </h3>
             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {scheduleRows.slice(0, 5).map((m, i) => (
                   <div key={i} className="animate-fade-in" style={{ 
                     borderBottom: "1px solid var(--divider)", 
                     paddingBottom: 16,
                     animationDelay: `${i * 0.1}s` 
                   }}>
                      <div style={{ fontSize: 13, fontWeight: 800, marginTop: 6 }}>
                         {m.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--accent-green)", marginTop: 4, fontWeight: 600 }}>{m.date}</div>
                   </div>
                ))}
                {scheduleRows.length === 0 && (
                   <div style={{ color: "var(--text3)", fontSize: 13, textAlign: "center", padding: 20 }}>
                      No upcoming matches scheduled.
                   </div>
                )}
             </div>

             <div className="card" style={{ marginTop: 32, background: "var(--gradient-primary)", border: "none", padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>💎</div>
                <h4 style={{ color: "#fff", marginBottom: 12, fontSize: 18 }}>Enterprise Pro</h4>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", marginBottom: 20, lineHeight: 1.5 }}>
                  Access deep-data heatmaps, player trajectory, and predictive ML models for every match.
                </p>
                <button className="btn" style={{ background: "#fff", color: "var(--primary)", padding: "12px 24px", width: "100%", fontWeight: 800 }}>
                  Start Free Trial
                </button>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
