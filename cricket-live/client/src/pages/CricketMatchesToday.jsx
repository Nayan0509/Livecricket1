import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchAllMatches } from "../api";

const TODAY_SD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Cricket Matches Today",
  "description": "All cricket matches scheduled for today with live scores and timings",
  "url": "https://www.livecricketzone.com/cricket-matches-today"
};

export default function CricketMatchesToday() {
  const [data, setData] = useState({ live: [], upcoming: [], recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMatches()
      .then(r => setData(r?.data || { live: [], upcoming: [], recent: [] }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60 }}>
      <SEO
        title="Cricket Matches Today - Live Cricket Schedule & Timings"
        description={`Cricket matches today ${today}. Get live cricket score, match timings, schedule and ball-by-ball commentary for all cricket matches today. IPL, T20, ODI, Test matches.`}
        keywords="cricket matches today, cricket today, today cricket match, cricket match today live, cricket schedule today, live cricket today, today cricket live score, cricket today match time"
        url="/cricket-matches-today"
        structuredData={TODAY_SD}
      />

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", marginBottom: 6 }}>Cricket Matches Today</h1>
        <p style={{ fontSize: 14, color: "var(--text3)" }}>{today} — Live scores, timings and ball-by-ball commentary</p>
      </div>

      {loading ? (
        <div className="spinner" style={{ margin: "60px auto" }} />
      ) : (
        <>
          {/* Live Now */}
          {data.live.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#ef4444", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "livePulse 2s infinite" }} />
                Live Now ({data.live.length})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.live.map(m => (
                  <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(244,63,94,0.05)", border: "1px solid rgba(244,63,94,0.2)", transition: "transform 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text3)" }}>{m.matchType} {m.venue ? `• ${m.venue}` : ""}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, color: "#fb7185", fontWeight: 700 }}>{m.status}</div>
                          <div style={{ fontSize: 11, color: "#38bdf8", marginTop: 4 }}>Live Score →</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Today */}
          {data.upcoming.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#38bdf8", marginBottom: 14 }}>📅 Upcoming Today ({data.upcoming.length})</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.upcoming.map(m => (
                  <div key={m.id} style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text3)" }}>{m.matchType} {m.venue ? `• ${m.venue}` : ""}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text2)", fontWeight: 600 }}>{m.date || m.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Results */}
          {data.recent.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4ade80", marginBottom: 14 }}>✅ Recent Results</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.recent.slice(0, 8).map(m => (
                  <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ padding: "14px 20px", borderRadius: 12, background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)", transition: "transform 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
                    >
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 4 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: "#4ade80" }}>{m.status}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {data.live.length === 0 && data.upcoming.length === 0 && data.recent.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏏</div>
              <p style={{ color: "var(--text3)" }}>No matches found for today. Check the <Link to="/schedule" style={{ color: "#38bdf8" }}>full schedule</Link>.</p>
            </div>
          )}
        </>
      )}

      {/* SEO content */}
      <section style={{ padding: "24px 28px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginTop: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>Cricket Matches Today — Live Score & Schedule</h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.8 }}>
          Get all <strong style={{ color: "var(--text2)" }}>cricket matches today</strong> with live scores, match timings and ball-by-ball commentary. Live Cricket Zone covers all formats — IPL, T20, ODI, Test cricket — with real-time updates every 15 seconds. Never miss a ball with our <strong style={{ color: "var(--text2)" }}>today cricket live score</strong> coverage.
        </p>
      </section>
    </div>
  );
}
