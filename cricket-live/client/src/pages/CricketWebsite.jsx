import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const S = {
  card: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 32px", marginBottom: 24 },
  h2:   { fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16 },
  p:    { color: "rgba(255,255,255,0.65)", lineHeight: 1.85, fontSize: 14, marginBottom: 14 },
};

export default function CricketWebsite() {
  return (
    <div className="container" style={{ paddingBottom: 80, maxWidth: 900 }}>
      <SEO
        title="Best Cricket Website 2026 - Free Live Scores & IPL Streaming"
        description="Live Cricket Zone is the best free cricket website for live scores, ball-by-ball commentary, IPL 2026 live stream, T20 World Cup, ODI and Test match updates. No signup required."
        keywords="best cricket website, cricket website, cricket score website, live cricket website, free cricket website, best cricket site 2026, cricket website live score, cricket website free, top cricket website, cricket live score website, best site for cricket live score, cricket streaming website"
        url="/cricket-website"
      />

      {/* Hero */}
      <div style={{ marginBottom: 32, paddingTop: 8 }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginBottom: 10 }}>
          Best Cricket Website 2026 — Free Live Scores & Streaming
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 20 }}>
          Live Cricket Zone is the fastest, most comprehensive free cricket website. Live scores updated every 15 seconds, free IPL live streaming, ball-by-ball commentary — no signup, no subscription.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/live" style={{ padding: "10px 22px", borderRadius: 10, background: "#ef4444", color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>🔴 Live Scores</Link>
          <Link to="/ipl-live-stream" style={{ padding: "10px 22px", borderRadius: 10, background: "rgba(245,158,11,0.9)", color: "#000", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>📺 IPL Live Stream</Link>
          <Link to="/schedule" style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>📅 Schedule</Link>
        </div>
      </div>

      {/* Why best */}
      <div style={S.card}>
        <h2 style={S.h2}>Why Live Cricket Zone is the Best Cricket Website</h2>
        <p style={S.p}>
          With hundreds of cricket websites available, Live Cricket Zone stands out for one simple reason — we put the fan first. No paywalls, no mandatory registration, no slow-loading pages. Just fast, accurate, free cricket scores and live streaming for every match, every format, every tournament.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "⚡", title: "Fastest Live Scores — Updated Every 15 Seconds", desc: "Our live scores refresh every 15 seconds — faster than Cricbuzz, ESPNcricinfo and most other cricket websites. You'll never miss a wicket, a six, or a match-turning moment." },
            { icon: "📺", title: "Free IPL 2026 Live Stream — No Subscription Needed", desc: "Watch IPL 2026 live stream free on Live Cricket Zone. No JioCinema subscription, no Hotstar, no Sky Sports needed. Stream every IPL match free — MI, CSK, RCB, KKR, GT, LSG, DC, PBKS, RR, SRH." },
            { icon: "🌍", title: "Works Worldwide — India, UK, Pakistan, Australia, USA", desc: "Available in every country. Whether you're in India, Pakistan, England, Australia, South Africa, UAE, USA or Canada — Live Cricket Zone works everywhere, free." },
            { icon: "📱", title: "Mobile Optimised — Works on Android & iPhone", desc: "Fully responsive design loads fast on mobile data. Works perfectly on Android, iPhone, tablet and desktop. No app download needed." },
            { icon: "🆓", title: "100% Free — No Signup, No Hidden Fees", desc: "Live Cricket Zone is completely free. No account creation, no subscription, no credit card. Just open the website and start watching." },
            { icon: "🏏", title: "Complete Coverage — All Formats, All Tournaments", desc: "IPL, T20 World Cup, ODI World Cup, Test cricket, PSL, BBL, CPL, BPL, County Championship, Women's cricket — we cover everything." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 12, padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#fff", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All tournaments */}
      <div style={S.card}>
        <h2 style={S.h2}>Complete Cricket Coverage — All Tournaments & Leagues</h2>
        <p style={S.p}>Live Cricket Zone covers every major cricket competition in the world. Here's a complete list of what we cover:</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {[
            { to: "/ipl",               label: "IPL 2026 Live Score" },
            { to: "/t20-world-cup",     label: "T20 World Cup Live" },
            { to: "/world-cup",         label: "ODI World Cup Live" },
            { to: "/champions-trophy",  label: "Champions Trophy" },
            { to: "/asia-cup",          label: "Asia Cup Live Score" },
            { to: "/psl",               label: "PSL Live Score" },
            { to: "/bbl",               label: "BBL Live Score" },
            { to: "/cpl",               label: "CPL Live Score" },
            { to: "/bpl",               label: "BPL Live Score" },
            { to: "/womens-cricket",    label: "Women's Cricket" },
            { to: "/county-championship", label: "County Championship" },
            { to: "/t20",               label: "T20 Cricket Live" },
            { to: "/odi",               label: "ODI Cricket Live" },
            { to: "/test",              label: "Test Cricket Live" },
            { to: "/ipl-live-stream",   label: "IPL Live Stream Free" },
            { to: "/watch-live",        label: "Watch Cricket Free" },
          ].map(l => (
            <Link key={l.to} to={l.to} style={{
              display: "block", padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              color: "#a78bfa", textDecoration: "none", transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
            >
              → {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div style={S.card}>
        <h2 style={S.h2}>Live Cricket Zone vs Other Cricket Websites</h2>
        <p style={S.p}>How does Live Cricket Zone compare to other popular cricket websites?</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                {["Feature", "Live Cricket Zone", "Cricbuzz", "ESPNcricinfo"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 800, color: h === "Live Cricket Zone" ? "#34d399" : "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Live Scores Speed",       "Every 15 seconds ✓",  "~30 seconds",     "~30 seconds"],
                ["Free to Use",             "100% Free ✓",         "Free (with ads)", "Free (with ads)"],
                ["IPL Live Stream Free",    "Yes ✓",               "No",              "No"],
                ["No Signup Required",      "Yes ✓",               "Yes",             "Yes"],
                ["Ball-by-Ball Commentary", "Yes ✓",               "Yes",             "Yes"],
                ["Works Worldwide",         "Yes ✓",               "Yes",             "Yes"],
                ["Mobile Optimised",        "Yes ✓",               "Yes",             "Yes"],
                ["Free Live Streaming",     "Yes ✓",               "No",              "No"],
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      padding: "10px 14px",
                      color: j === 1 ? "#34d399" : j === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)",
                      fontWeight: j === 1 ? 700 : 400,
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div style={S.card}>
        <h2 style={S.h2}>Frequently Asked Questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { q: "Is Live Cricket Zone free?",                    a: "Yes — completely free. No subscription, no account, no payment. Just open the website and start watching live cricket scores." },
            { q: "Which is the best cricket website for live scores?", a: "Live Cricket Zone is one of the best free cricket websites for live scores, updated every 15 seconds with ball-by-ball commentary for all matches." },
            { q: "Can I watch IPL live stream free on this website?", a: "Yes. Live Cricket Zone provides free IPL 2026 live streaming. Visit /ipl-live-stream and click any live match to watch free — no JioCinema or Hotstar needed." },
            { q: "Does this cricket website work in India?",      a: "Yes. Live Cricket Zone works in India, Pakistan, UK, Australia, USA, UAE and every country worldwide." },
            { q: "Is there a cricket website app?",               a: "Live Cricket Zone works directly in your mobile browser — no app download needed. Open livecricketzone.com in Chrome on your phone for the best experience." },
          ].map((f, i, arr) => (
            <div key={i} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 4 }}>Q: {f.q}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>A: {f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
