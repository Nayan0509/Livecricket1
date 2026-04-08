import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container" style={{ paddingBottom: 60, maxWidth: 900 }}>
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
