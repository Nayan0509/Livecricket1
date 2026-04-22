import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function About() {
  return (
    <div className="container" style={{ paddingBottom: 80, maxWidth: 900 }}>
      <SEO
        title="About Live Cricket Zone - Real-Time Cricket Scores & Live Streaming"
        description="Live Cricket Zone is your trusted source for live cricket scores, ball-by-ball commentary, IPL 2026 live stream, T20 World Cup, ODI and Test match updates. Free, no signup required."
        url="/about"
      />

      {/* Hero */}
      <div style={{ marginBottom: 40, paddingTop: 8 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🏏</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 12 }}>About Live Cricket Zone</h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 700 }}>
          Your trusted, free destination for live cricket scores, ball-by-ball commentary, IPL 2026 live streaming, and comprehensive cricket coverage from around the world.
        </p>
      </div>

      {/* What We Are */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16 }}>What is Live Cricket Zone?</h2>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 14, fontSize: 14 }}>
          Live Cricket Zone is a free cricket scores and live streaming website built for cricket fans worldwide. We provide real-time ball-by-ball updates, live scorecards, match commentary, player statistics, ICC rankings, and free live streaming links for every major cricket match — from IPL 2026 and T20 World Cup to domestic county cricket and international ODI series.
        </p>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 14, fontSize: 14 }}>
          Founded with a simple mission — to make cricket accessible to every fan, everywhere, for free — Live Cricket Zone covers all 10 formats and competitions: Test cricket, One Day Internationals (ODIs), T20 Internationals, the Indian Premier League (IPL), Pakistan Super League (PSL), Big Bash League (BBL), Caribbean Premier League (CPL), Bangladesh Premier League (BPL), County Championship, and Women's cricket.
        </p>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.85, fontSize: 14 }}>
          Our live scores are updated every 15 seconds — faster than most cricket websites. We serve cricket fans in India, Pakistan, England, Australia, South Africa, New Zealand, West Indies, Bangladesh, Sri Lanka, UAE, USA, Canada and every cricket-following nation on earth.
        </p>
      </div>

      {/* Features */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 20 }}>What We Offer</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { icon: "🔴", title: "Live Cricket Scores", desc: "Ball-by-ball live scores updated every 15 seconds for all international and domestic matches. Faster than Cricbuzz and ESPNcricinfo." },
            { icon: "📺", title: "Free Live Streaming", desc: "Watch IPL 2026 live stream free, T20 World Cup, ODI and Test matches. No subscription, no signup, no payment required." },
            { icon: "🏏", title: "IPL 2026 Coverage", desc: "Complete IPL 2026 coverage — live scores, points table, schedule, team squads, player stats and match results for all 84 matches." },
            { icon: "🎙️", title: "Ball-by-Ball Commentary", desc: "Detailed ball-by-ball commentary for every delivery — runs, wickets, extras, milestones and match-turning moments." },
            { icon: "📊", title: "Full Scorecards", desc: "Complete batting and bowling scorecards with strike rates, economy rates, partnerships and fall of wickets." },
            { icon: "🏆", title: "ICC Rankings 2026", desc: "Up-to-date ICC Test, ODI and T20I rankings for batsmen, bowlers and all-rounders across all international teams." },
            { icon: "📅", title: "Match Schedule", desc: "Complete cricket schedule for all upcoming international series, IPL, PSL, BBL, CPL, BPL and domestic tournaments." },
            { icon: "👤", title: "Player Profiles", desc: "Detailed player profiles with career statistics, recent form, batting and bowling averages across all formats." },
            { icon: "📰", title: "Cricket News", desc: "Latest cricket news, match previews, post-match analysis, transfer news and injury updates from around the world." },
          ].map(f => (
            <div key={f.title} style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#fff", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Our Cricket Coverage</h2>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 16, fontSize: 14 }}>
          Live Cricket Zone covers every major cricket competition in the world. Whether you follow the glamour of the IPL, the tradition of Test cricket, the intensity of T20 internationals, or the grassroots of county cricket — we have you covered.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { cat: "T20 Leagues", items: ["IPL 2026 (India)", "PSL (Pakistan)", "BBL (Australia)", "CPL (West Indies)", "BPL (Bangladesh)", "SA20 (South Africa)"] },
            { cat: "International Cricket", items: ["T20 World Cup", "ODI World Cup", "Champions Trophy", "Asia Cup", "Test Series", "Bilateral ODI Series"] },
            { cat: "Domestic Cricket", items: ["County Championship (England)", "Sheffield Shield (Australia)", "Ranji Trophy (India)", "Plunket Shield (NZ)", "CSA 4-Day Series (SA)", "ICC CWC League 2"] },
            { cat: "Women's Cricket", items: ["Women's T20 World Cup", "Women's ODI World Cup", "Women's IPL", "Women's Big Bash", "Women's County Cricket", "ICC Women's Rankings"] },
          ].map(c => (
            <div key={c.cat} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: 12, color: "#a78bfa", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.cat}</div>
              {c.items.map(i => (
                <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#34d399", fontSize: 10 }}>✓</span> {i}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Why Us */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Why Choose Live Cricket Zone?</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { q: "Fastest live scores", a: "Our scores update every 15 seconds — faster than most cricket websites. You'll never miss a wicket or a six." },
            { q: "Completely free", a: "No subscription, no registration, no hidden fees. Live Cricket Zone is 100% free for every cricket fan, everywhere." },
            { q: "Works worldwide", a: "Available in India, Pakistan, UK, Australia, USA, UAE, South Africa, Bangladesh, Sri Lanka, Canada and every country." },
            { q: "Free live streaming", a: "Watch IPL 2026 live stream free, T20 matches, ODIs and Tests — no JioCinema, no Hotstar, no Sky Sports subscription needed." },
            { q: "Mobile friendly", a: "Fully responsive design works perfectly on Android, iPhone, tablet and desktop. Fast loading even on slow connections." },
            { q: "No ads interrupting scores", a: "We keep the live score experience clean and fast. Ads are placed thoughtfully so they never interrupt your match viewing." },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: "#34d399", fontWeight: 900, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 3 }}>{r.q}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{r.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Contact Us</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
          We welcome feedback, suggestions, and partnership enquiries. If you have found an error in our scores or have a technical issue, please reach out.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>📧 General: <a href="mailto:contact@livecricketzone.com" style={{ color: "#a78bfa" }}>contact@livecricketzone.com</a></div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>🔒 Privacy: <a href="mailto:privacy@livecricketzone.com" style={{ color: "#a78bfa" }}>privacy@livecricketzone.com</a></div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>⚖️ Legal / DMCA: <a href="mailto:legal@livecricketzone.com" style={{ color: "#a78bfa" }}>legal@livecricketzone.com</a></div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { to: "/live",           label: "🔴 Live Scores" },
          { to: "/ipl",            label: "🏏 IPL 2026" },
          { to: "/ipl-live-stream",label: "📺 IPL Live Stream" },
          { to: "/schedule",       label: "📅 Schedule" },
          { to: "/rankings",       label: "🏆 Rankings" },
          { to: "/privacy-policy", label: "🔒 Privacy Policy" },
          { to: "/terms-of-use",   label: "⚖️ Terms of Use" },
        ].map(l => (
          <Link key={l.to} to={l.to} style={{
            padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)", textDecoration: "none",
          }}>{l.label}</Link>
        ))}
      </div>
    </div>
  );
}
