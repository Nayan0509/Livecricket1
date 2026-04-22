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
  return (
    <div className="container" style={{ paddingBottom: 60, maxWidth: 900 }}>
      <SEO 
        title="About Live Cricket Zone - Real-Time Cricket Scores"
        description="Learn about Live Cricket Zone, the next-generation sports analytics platform providing high-speed cricket data, live scores, and expert match analysis."
        url="/about"
      />
      <div className="hero" style={{ marginBottom: 40, textAlign: "left" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏏</div>
        <h1 className="hero-title" style={{ textAlign: "left" }}>About Live Cricket Zone</h1>
        <p className="hero-subtitle" style={{ textAlign: "left" }}>Your trusted source for live cricket scores, news, and comprehensive coverage</p>
      </div>

      <div className="card feature-card" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: "var(--text)" }}>Independent Cricket Intelligence</h2>
        <p style={{ color: "var(--text2)", lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>
          Live Cricket Zone is a next-generation sports analytics platform designed for the modern cricket enthusiast. 
          By combining high-speed data processing with an intuitive glassmorphic interface, we provide a premium 
          dashboard for tracking live matches, player trajectories, and world rankings.
        </p>
        <p style={{ color: "var(--text2)", lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>
          Our mission is to democratize high-end cricket analytics. From the intense strategy of Test cricket to the 
          explosive dynamics of T20 leagues like IPL, PSL, and BBL, we offer deep-dive coverage that was previously 
          reserved for enterprise-level sports journalists.
        </p>
        <p style={{ color: "var(--text2)", lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>
          What defines Live Cricket Zone is our <strong>proprietary Independent Scraper Engine</strong>. Unlike traditional 
          platforms that relay third-party APIs with high latency, our system directly processes real-time match data, 
          ensuring ball-by-ball updates are delivered with industry-leading precision.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <div className="section-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
          <h3 className="section-title">The Enterprise Advantage</h3>
        </div>
        <div className="grid-2" style={{ gap: 20 }}>
          <div className="feature-card" style={{ padding: 24 }}>
            <div className="feature-icon">🚀</div>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18, color: "var(--text)" }}>High-Frequency Polling</div>
            <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, lineHeight: 1.7 }}>
              Our backend employs high-frequency scraping logic that monitors multiple global nodes to bring you 
              scores within seconds of on-field action.
            </p>
          </div>
          <div className="feature-card" style={{ padding: 24 }}>
            <div className="feature-icon">🛡️</div>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18, color: "var(--text)" }}>Dependency-Free</div>
            <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, lineHeight: 1.7 }}>
              By operating our own data extraction pipelines, we ensure 99.9% uptime, free from the constraints 
              and rate limits of traditional sports data providers.
            </p>
          </div>
          <div className="feature-card" style={{ padding: 24 }}>
            <div className="feature-icon">💎</div>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18, color: "var(--text)" }}>Premium UI/UX</div>
            <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, lineHeight: 1.7 }}>
              Experience the data through a state-of-the-art glassmorphic interface designed for both desktop 
              immersion and mobile efficiency.
            </p>
          </div>
          <div className="feature-card" style={{ padding: 24 }}>
            <div className="feature-icon">📈</div>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18, color: "var(--text)" }}>Advanced Metrics</div>
            <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, lineHeight: 1.7 }}>
              Beyond scores, we provide strike rates, economy analysis, and partnership breakdowns to give you 
              the full tactical picture of the match.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Core Infrastructure</h3>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ padding: 12, borderLeft: "3px solid var(--primary)", background: "var(--bg3)" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>🔴 Real-Time Live Analytics</div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              Our live center processes raw match data to provide ball-by-ball commentary and dynamic scorecards 
              across all international and domestic formats.
            </p>
          </div>
          <div style={{ padding: 12, borderLeft: "3px solid var(--primary)", background: "var(--bg3)" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>📅 Global Pipeline Monitoring</div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              We track the global cricket schedule to ensure upcoming series are identified and indexed well 
              before the first ball is bowled.
            </p>
          </div>
          <div style={{ padding: 12, borderLeft: "3px solid var(--primary)", background: "var(--bg3)" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>📊 Global Table Rankings</div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              Integration with real-time world standings allows us to present the latest rankings for players 
              and teams across Tests, ODIs, and T20Is.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Commitment to Integrity</h3>
        <p style={{ color: "var(--text2)", marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}>
          Live Cricket Zone is dedicated to providing high-quality cricket data for informational purposes. 
          We believe in the integrity of the sport and focus strictly on match data, schedules, and analytics 
          to enhance the fan experience globally.
        </p>
        <div style={{ padding: 16, background: "var(--bg3)", borderRadius: 8, marginTop: 16 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Contact</h4>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
            Our engineering team is constantly refining our scraper algorithms. If you have feedback or 
            technical suggestions, feel free to explore our <Link to="/" style={{ color: "var(--primary-light)" }}>Homepage</Link> for 
            the latest feature rollouts.
          </p>
        </div>
      </div>

    </div>
  );
}
