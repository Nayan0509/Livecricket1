import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { fetchLiveMatches } from "../api";

export default function CricketScoreToday() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLiveMatches();
        setMatches(Array.isArray(data?.data) ? data.data : []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Cricket Score Today — Live Match Scores & Updates 2026"
        description="Cricket score today for all live matches — IPL 2026, T20 World Cup, ODI and Test cricket. Real-time ball-by-ball updates every 15 seconds. Free, no sign-up."
        keywords="cricket score today, today cricket score, cricket match today, cricket today, today cricket match, cricket live today, cricket score live today, today match score, cricket match score today, live cricket today, today cricket live score, IPL score today, T20 score today, ODI score today, Test score today"
        url="/cricket-score-today"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(59,130,246,0.09) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.15)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          Cricket Score <span style={{ color: "#3B82F6" }}>Today</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: "0 0 12px" }}>{today}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Live Updates", "Every 15 Seconds", "Ball by Ball", "Free"].map(t => (
            <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 20, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)", color: "#3B82F6" }}>{t}</span>
          ))}
        </div>
      </div>

      <AdBanner type="leaderboard" />

      {/* Live matches */}
      <section style={{ marginTop: 20, marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B82F6", animation: "livePulse 1.8s infinite" }} />
          Today's Live Cricket Scores
        </h2>
        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>
        ) : matches.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {matches.map(m => (
              <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "16px 20px", borderRadius: 12,
                  background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.2)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.08)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.04)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: "#60A5FA", fontWeight: 600 }}>{m.status}</div>
                      {m.venue && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>📍 {m.venue}</div>}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", padding: "5px 13px", borderRadius: 20, whiteSpace: "nowrap" }}>
                      Live Score →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ padding: "32px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🏏</div>
            <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 12 }}>No matches live right now.</p>
            <Link to="/upcoming" style={{ fontSize: 13, color: "#3B82F6", fontWeight: 700 }}>View Upcoming Matches →</Link>
          </div>
        )}
      </section>

      {/* Quick links */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            ["📅 Today's Schedule", "/cricket-matches-today"],
            ["✅ Recent Results", "/results"],
            ["📊 Upcoming Fixtures", "/upcoming"],
            ["🏏 IPL 2026 Score", "/ipl"],
            ["🌍 T20 World Cup", "/t20-world-cup"],
            ["📋 Full Schedule", "/schedule"],
          ].map(([label, to]) => (
            <Link key={to} to={to} style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--text3)", textDecoration: "none", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.08)"; e.currentTarget.style.color = "#3B82F6"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <AdBanner type="auto" />

      {/* Rich SEO content */}
      <section style={{ marginTop: 24, padding: "24px 24px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(59,130,246,0.07)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#3B82F6,#2563EB)", display: "inline-block" }} />
          Cricket Score Today — All Live Matches
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Live Cricket Zone delivers the fastest <strong style={{ color: "var(--text2)" }}>cricket score today</strong> for all live international and domestic cricket matches. Every delivery is tracked with ball-by-ball commentary updated every 15 seconds — faster than any other cricket score service. Whether it's an IPL evening game, a morning Test session in England, or a T20 international in the UAE, today's cricket score is right here, completely free.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Today's cricket coverage includes: <strong style={{ color: "var(--text2)" }}>IPL 2026 live score</strong> with wicket-by-wicket updates and batting partnerships, T20 internationals from every ICC member nation, bilateral ODI series between the world's top 10 nations, and ongoing Test matches with session-by-session scorecard updates. The live matches section above refreshes automatically every 30 seconds to show the latest live games as they start.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Each match card links to a dedicated match page where you can find the complete ball-by-ball commentary feed, full batting scorecard with runs, balls faced, boundaries and strike rate, bowling figures with overs, maidens, runs and wickets, and the current run rate and required run rate. Once a match ends, official post-match highlights are embedded on the match page so you can relive the key moments.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          Bookmark this page for the fastest cricket score today — no ads on the score page, no popup streams, no account required. Just the score, ball by ball, as fast as it happens.
        </p>
      </section>
    </div>
  );
}
