import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function About() {
  const aboutSD = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Live Cricket Zone — Editorial Mission & Cricket Analytics",
    "description": "Learn about Live Cricket Zone, our team of cricket analysts, real-time ball-by-ball score engine, editorial standards, and commitment to global cricket journalism.",
    "url": "https://www.livecricketzone.com/about"
  };

  return (
    <div className="container" style={{ paddingBottom: 80, maxWidth: 920 }}>
      <SEO
        title="About Live Cricket Zone — Real-Time Cricket Scores & Editorial"
        description="Live Cricket Zone is a global cricket publishing platform providing real-time ball-by-ball scores, tactical analysis, ICC rankings, and in-depth tournament coverage."
        keywords="about live cricket zone, cricket editorial team, cricket analysis, live score engine, cricket journalism"
        url="/about"
        structuredData={aboutSD}
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 28px", padding: "32px 28px", borderRadius: 20,
        background: "linear-gradient(135deg, rgba(0,240,255,0.1) 0%, rgba(13,20,38,0.98) 100%)",
        border: "1px solid rgba(0,240,255,0.2)",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,240,255,0.15)", border: "1px solid rgba(0,240,255,0.3)", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: "#00F0FF", marginBottom: 12 }}>
          <span>🏏</span> ABOUT OUR PLATFORM
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
          About <span style={{ color: "#00F0FF" }}>Live Cricket Zone</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--text2)", margin: 0, maxWidth: 700, lineHeight: 1.75 }}>
          Your independent destination for real-time live cricket scores, in-depth tactical analysis, ICC rankings, player career statistics, and comprehensive global tournament coverage.
        </p>
      </div>

      {/* Mission & Background */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Our Mission</h2>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 14, fontSize: 14 }}>
          Live Cricket Zone was built with a single objective: to deliver fast, reliable, and deeply informative cricket coverage to fans worldwide. Whether you are following an intense India vs. Australia Border-Gavaskar Test match, tracking the high-octane IPL points table, or following the growth of associate cricket in the ICC CWC League 2, our platform provides instant ball-by-ball updates paired with expert editorial context.
        </p>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.85, margin: 0, fontSize: 14 }}>
          We believe cricket journalism should go beyond raw numbers. That is why our editorial desk produces original essays, data-driven tournament previews, pitch analysis reports, and tactical masterclasses explaining the nuances of swing bowling, mystery spin, and powerplay strategies.
        </p>
      </div>

      {/* Editorial Team & E-E-A-T */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Editorial Leadership &amp; Analysts</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#00F0FF,#00B8D9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: 16 }}>
                AM
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>Arjun Mehta</div>
                <div style={{ fontSize: 12, color: "#00F0FF", fontWeight: 700 }}>Senior Cricket Analyst &amp; T20 Specialist</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
              Over 12 years covering Indian Premier League auctions, subcontinental pitch dynamics, and biomechanical batting mechanics. Regular contributor on white-ball death-overs bowling strategies.
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#D896FF,#B026FF)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 16 }}>
                DR
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>David Richardson</div>
                <div style={{ fontSize: 12, color: "#D896FF", fontWeight: 700 }}>Chief Test Match &amp; First-Class Correspondent</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
              Veteran first-class cricket writer covering ICC World Test Championship cycles, Ashes encounters, County Championship seasons, and the physics of Dukes ball movement.
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#FF2E9A,#FF1053)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 16 }}>
                PS
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>Priya Sharma</div>
                <div style={{ fontSize: 12, color: "#FF2E9A", fontWeight: 700 }}>Women's Cricket Correspondent</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
              Specializes in the tactical evolution of women's franchise cricket, Women's Premier League (WPL) analytics, athletic performance benchmarks, and international state pathways.
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#39FF14,#00B8D9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#000", fontSize: 16 }}>
                RS
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>Rohan Sen</div>
                <div style={{ fontSize: 12, color: "#39FF14", fontWeight: 700 }}>White-Ball Tactical Analyst</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
              Data-driven performance analyst studying middle-overs strike rotation rates, powerplay entry points, boundary percentage suppression, and bowler release angles.
            </p>
          </div>
        </div>
      </div>

      {/* Transparency & Ethics */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Transparency &amp; Trust Guidelines</h2>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 12, fontSize: 14 }}>
          Live Cricket Zone adheres to strict editorial independence. We do not accept paid promotions to inflate player ratings, manipulate statistical rankings, or publish unverified transfer speculation.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 16 }}>
          <Link to="/editorial-policy" style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(0,240,255,0.12)", border: "1px solid rgba(0,240,255,0.25)", color: "#00F0FF", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Editorial Policy &amp; Standards →
          </Link>
          <Link to="/contact" style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Contact Editorial Team →
          </Link>
          <Link to="/privacy-policy" style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
