import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { fetchLiveMatches } from "../api";

const SD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is ball by ball cricket commentary?", "acceptedAnswer": { "@type": "Answer", "text": "Ball by ball cricket commentary is a real-time, delivery-by-delivery account of a cricket match — covering runs scored, wickets taken, extras, and expert analysis for each ball bowled. Live Cricket Zone updates every 15 seconds." } },
    { "@type": "Question", "name": "How to follow ball by ball cricket live?", "acceptedAnswer": { "@type": "Answer", "text": "Click any live match on Live Cricket Zone, then open the Commentary tab to see real-time ball-by-ball updates with over summaries, batsman and bowler stats, and current run rate." } },
    { "@type": "Question", "name": "Which matches have ball by ball commentary on Live Cricket Zone?", "acceptedAnswer": { "@type": "Answer", "text": "Live Cricket Zone provides ball-by-ball commentary for all live cricket matches including IPL 2026, T20 World Cup, ODI internationals, Test matches, PSL, BBL, CPL and domestic tournaments." } },
  ]
};

export default function BallByBall() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
  });
  const matches = data?.data || [];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Ball by Ball Cricket Commentary Live — IPL 2026, T20, ODI, Test"
        description="Ball by ball cricket commentary live for all matches. Every delivery covered — IPL 2026, T20 World Cup, ODI and Test matches. Updated every 15 seconds, free."
        keywords="ball by ball cricket, ball by ball commentary, cricket ball by ball, live ball by ball, ball by ball cricket score, cricket commentary live, live cricket commentary, IPL ball by ball, T20 ball by ball commentary, ball by ball score"
        url="/ball-by-ball"
        structuredData={SD}
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "32px 28px", borderRadius: 20,
        background: "linear-gradient(135deg, rgba(34,197,94,0.09) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(34,197,94,0.15)",
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
          Ball by Ball <span style={{ color: "#22C55E" }}>Commentary</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0, lineHeight: 1.6 }}>
          Real-time delivery-by-delivery updates · IPL 2026 · T20 World Cup · ODI · Test
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          {["Every Ball", "Every Run", "Every Wicket", "15s Updates"].map(t => (
            <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)", color: "#22C55E" }}>{t}</span>
          ))}
        </div>
      </div>

      <AdBanner type="leaderboard" />

      {/* Live matches */}
      <section style={{ marginTop: 24, marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", animation: "livePulse 1.8s infinite" }} />
          Live Ball-by-Ball Now
        </h2>
        {isLoading
          ? <div style={{ padding: "40px 0", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>
          : matches.length > 0
            ? <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {matches.map(m => (
                  <div
                    key={m.id}
                    onClick={() => navigate(`/match/${m.id}`)}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "16px 20px", borderRadius: 12, cursor: "pointer",
                      background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.2)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.08)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,197,94,0.04)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.2)"; }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: "#4ADE80", fontWeight: 600 }}>{m.status}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", padding: "6px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>
                      Ball-by-Ball →
                    </span>
                  </div>
                ))}
              </div>
            : <div style={{ padding: "32px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🏏</div>
                <p style={{ color: "var(--text3)", fontSize: 14, marginBottom: 12 }}>No live matches right now — commentary starts when next match begins.</p>
                <Link to="/upcoming" style={{ fontSize: 13, color: "#22C55E", fontWeight: 700 }}>View Upcoming Matches →</Link>
              </div>
        }
      </section>

      {/* What is B2B */}
      <section style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 24px", marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#22C55E,#16A34A)", display: "inline-block" }} />
          What is Ball by Ball Commentary?
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Ball by ball cricket commentary is the most granular form of live cricket coverage — every single delivery bowled in a match is described in detail, including the shot played, the line and length of the delivery, the number of runs scored, and any batting or fielding highlights. For wickets, extras (wides, no-balls), boundaries (fours and sixes), and dot balls, each event is documented in real time as it happens on the field.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          On Live Cricket Zone, our ball by ball commentary feed is sourced directly from live match data and refreshed every 15 seconds — making it one of the fastest ball-by-ball cricket score services available online, completely free with no subscription or account required.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          Each commentary entry shows the over and ball number, the batsman on strike, the bowler, runs scored off the delivery, and a text description of the ball. Milestone deliveries — sixes (shown in gold), fours (shown in green), and wickets (shown in red) — are visually highlighted so you can quickly scan through key moments in the innings.
        </p>
      </section>

      <AdBanner type="auto" />

      {/* Features grid */}
      <section style={{ marginTop: 20, marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#F59E0B,#D97706)", display: "inline-block" }} />
          Ball by Ball Features on Live Cricket Zone
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { icon: "⚡", title: "15-Second Refresh", desc: "Commentary updated every 15 seconds during live play" },
            { icon: "🎯", title: "Every Delivery", desc: "Every ball of every over — dot balls, boundaries, wickets, extras" },
            { icon: "📊", title: "Running Totals", desc: "Current score, run rate, required rate and over-by-over summary" },
            { icon: "🏏", title: "All Formats", desc: "IPL 2026, T20 World Cup, ODI, Test and domestic cricket" },
            { icon: "📺", title: "Watch + Follow", desc: "Live stream links alongside ball-by-ball text commentary" },
            { icon: "🆓", title: "Completely Free", desc: "No sign-up, no subscription — ball-by-ball commentary for everyone" },
          ].map(f => (
            <div key={f.title} style={{ padding: "16px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>FAQ — Ball by Ball Cricket</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SD.mainEntity.map((q, i) => (
            <details key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 18px" }}>
              <summary style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", cursor: "pointer", listStyle: "none" }}>{q.name}</summary>
              <p style={{ marginTop: 10, fontSize: 13, color: "var(--text3)", lineHeight: 1.7 }}>{q.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
