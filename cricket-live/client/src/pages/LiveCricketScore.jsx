import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { fetchAllMatches } from "../api";

export default function LiveCricketScore() {
  const [matchesMap, setMatchesMap] = useState({ live: [], recent: [], upcoming: [] });
  const [activeTab, setActiveTab] = useState("live");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchAllMatches();
        if (result?.data) setMatchesMap(result.data);
        else if (result) setMatchesMap(result);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const currentTabMatches = Array.isArray(matchesMap[activeTab]) ? matchesMap[activeTab] : [];

  const TAB_CONFIG = [
    { key: "live",     label: "Live",     color: "#EF4444" },
    { key: "recent",   label: "Recent",   color: "#3B82F6" },
    { key: "upcoming", label: "Upcoming", color: "#38BDF8" },
  ];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Live Cricket Score — Real-Time Ball by Ball Updates 2026"
        description="Live cricket score with real-time ball-by-ball updates every 15 seconds. IPL 2026, T20 World Cup, ODI and Test matches. Full scorecards and official match highlights — no sign-up required."
        keywords="live cricket score, cricket live score today, live cricket score today, cricket score live, live score cricket, cricket live score, real time cricket score, live cricket scores today, IPL live score, T20 live score, ODI live score, Test live score, live cricket ball by ball"
        url="/live-cricket-score"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Live Cricket Score Today",
          "description": "Real-time live cricket scores with ball-by-ball commentary for all matches",
          "url": "https://www.livecricketzone.com/live-cricket-score"
        }}
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(59,130,246,0.09) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.15)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          Live Cricket <span style={{ color: "#3B82F6" }}>Score</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: "0 0 12px" }}>
          Real-time ball-by-ball updates — IPL 2026 · T20 World Cup · ODI · Test
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["15s Refresh", "Ball by Ball", "All Formats", "Highlights"].map(t => (
            <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 20, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)", color: "#3B82F6" }}>{t}</span>
          ))}
        </div>
      </div>

      <AdBanner type="leaderboard" />

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 20 }}>
        {TAB_CONFIG.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            padding: "11px 6px", fontSize: 13, fontWeight: 700,
            color: activeTab === t.key ? t.color : "var(--text3)",
            borderBottom: activeTab === t.key ? `2px solid ${t.color}` : "2px solid transparent",
            marginBottom: -1, transition: "color 0.2s", fontFamily: "'Inter',sans-serif",
          }}>
            {t.label}
            <span style={{ marginLeft: 6, fontSize: 10, background: activeTab === t.key ? `${t.color}18` : "rgba(255,255,255,0.04)", color: activeTab === t.key ? t.color : "var(--text-muted)", padding: "1px 6px", borderRadius: 8, fontWeight: 800 }}>
              {(Array.isArray(matchesMap[t.key]) ? matchesMap[t.key] : []).length}
            </span>
          </button>
        ))}
      </div>

      {/* Match list */}
      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>
      ) : currentTabMatches.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {currentTabMatches.map(m => {
            const isLive = activeTab === "live";
            const color = isLive ? "#EF4444" : activeTab === "recent" ? "#3B82F6" : "#38BDF8";
            return (
              <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "16px 20px", borderRadius: 12,
                  background: `${color}05`, border: `1px solid ${color}20`,
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}0a`; e.currentTarget.style.borderColor = `${color}40`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${color}05`; e.currentTarget.style.borderColor = `${color}20`; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        {isLive && <span style={{ fontSize: 9, fontWeight: 900, background: "#EF4444", color: "#fff", padding: "2px 7px", borderRadius: 20 }}>● LIVE</span>}
                        <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{m.matchType}</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: color, fontWeight: 600, marginTop: 2 }}>{m.status}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: color, background: `${color}10`, border: `1px solid ${color}25`, padding: "5px 12px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {isLive ? "Live Score →" : activeTab === "recent" ? "Scorecard →" : "Preview →"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "40px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🦗</div>
          <p style={{ color: "var(--text3)", fontSize: 14 }}>No {activeTab} matches right now — check back shortly.</p>
        </div>
      )}

      <div style={{ marginTop: 24 }}><AdBanner type="auto" /></div>

      {/* Rich SEO content */}
      <section style={{ marginTop: 24, padding: "24px 24px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(59,130,246,0.07)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#3B82F6,#2563EB)", display: "inline-block" }} />
          Live Cricket Score — How It Works
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Live Cricket Zone's live cricket score page is the fastest way to follow any cricket match in real time. Scores are sourced directly from live match data and refreshed automatically every 15 seconds — no manual page refresh needed. Whether you're following an IPL evening match from your phone or a Test session from your desktop, the live cricket score updates continuously as each ball is bowled.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Use the <strong style={{ color: "var(--text2)" }}>Live tab</strong> to see all matches currently in progress across every format and competition worldwide. The <strong style={{ color: "var(--text2)" }}>Recent tab</strong> shows matches that have finished within the last 24 hours with final scorecards. The <strong style={{ color: "var(--text2)" }}>Upcoming tab</strong> shows fixtures that haven't yet started, with scheduled start times.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Click any match to open the full match centre — ball-by-ball commentary with every delivery described, batting scorecard with runs, balls, fours, sixes and strike rate, bowling figures with overs, maidens, runs conceded, wickets and economy rate, plus the current run rate and required run rate for the chasing team. Official post-match highlights are embedded on each match page so you can relive the key moments once play ends.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          Coverage spans every cricket-playing nation — IPL 2026, T20 internationals, ODI bilateral series, Test matches, County Championship, PSL, BBL, CPL, BPL, Ranji Trophy and all ICC associate nation cricket. All completely free with no registration, no subscription and no paywalls.
        </p>
      </section>
    </div>
  );
}
