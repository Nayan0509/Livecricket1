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
        description={`Cricket matches today ${today}. Live scores, timings and ball-by-ball commentary for IPL, T20, ODI and Test matches.`}
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
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#60A5FA", marginBottom: 14 }}>✅ Recent Results</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.recent.slice(0, 8).map(m => (
                  <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ padding: "14px 20px", borderRadius: 12, background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.12)", transition: "transform 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
                    >
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 4 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: "#60A5FA" }}>{m.status}</div>
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

      {/* Rich SEO content */}
      <section style={{ padding: "24px 28px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(59,130,246,0.07)", marginTop: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#3B82F6,#2563EB)", display: "inline-block" }} />
          Cricket Matches Today — Live Scores, Timings & Commentary
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Find every <strong style={{ color: "var(--text2)" }}>cricket match today</strong> on Live Cricket Zone — all live matches, upcoming fixtures scheduled for today, and recently completed results. Coverage spans every format and competition: IPL 2026, T20 internationals, bilateral ODI series, Test matches, County Championship, PSL, BBL, CPL and all ICC associate cricket.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          The <strong style={{ color: "var(--text2)" }}>Live Now</strong> section above shows all matches currently in progress with real-time scores updated every 15 seconds. <strong style={{ color: "var(--text2)" }}>Upcoming Today</strong> shows fixtures that haven't started yet — complete with the scheduled start time and venue. <strong style={{ color: "var(--text2)" }}>Recent Results</strong> shows matches that finished today with final scorecards and match summaries.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Click any match card to open the live match centre with ball-by-ball commentary, full batting and bowling scorecards, toss information, current over summary and official post-match highlights. Today's cricket coverage is updated automatically — the page refreshes match data in the background so you always see the latest scores without needing to manually reload.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          The number of cricket matches today varies by season — during the IPL 2026 season there are typically 1–2 evening matches each day. International series weeks can bring 1–2 Tests and up to 3 T20I or ODI matches across different time zones. The cricket calendar rarely has a completely quiet day, with domestic competitions from England, South Africa, New Zealand, India and the Caribbean filling gaps between major international events. All free, no account required.
        </p>
      </section>
    </div>
  );
}
