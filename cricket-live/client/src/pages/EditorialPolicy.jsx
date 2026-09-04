import React from "react";
import SEO from "../components/SEO";

export default function EditorialPolicy() {
  const editorialSD = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Live Cricket Zone Editorial Policy & Fact-Checking Standards",
    "description": "Editorial standards, fact-checking methodology, and journalistic guidelines for Live Cricket Zone cricket coverage.",
    "url": "https://www.livecricketzone.com/editorial-policy"
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Editorial Policy & Fact-Checking Standards — Live Cricket Zone"
        description="Learn about Live Cricket Zone's editorial standards, fact-checking methodology, corrections policy, and author qualifications."
        keywords="editorial policy, fact checking standards, cricket journalism, live cricket zone editorial guidelines"
        url="/editorial-policy"
        structuredData={editorialSD}
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "32px 28px", borderRadius: 20,
        background: "linear-gradient(135deg, rgba(176,38,255,0.1) 0%, rgba(13,20,38,0.98) 100%)",
        border: "1px solid rgba(176,38,255,0.2)",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(176,38,255,0.15)", border: "1px solid rgba(176,38,255,0.3)", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: "#D896FF", marginBottom: 12 }}>
          <span>📜</span> JOURNALISTIC INTEGRITY
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
          Editorial Policy &amp; <span style={{ color: "#D896FF" }}>Standards</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, maxWidth: 650, lineHeight: 1.7 }}>
          At Live Cricket Zone, we uphold rigorous standards of sports journalism, objective statistical analysis, and transparent corrections.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Section 1: Mission */}
        <section style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 12px" }}>1. Our Editorial Mission</h2>
          <p style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.85, margin: 0 }}>
            Live Cricket Zone was founded to provide cricket enthusiasts around the globe with accessible, accurate, and insightful cricket coverage. Beyond real-time scoring data, our editorial staff publishes original tactical deep dives, tournament guides, historical retrospectives, and match analyses authored by seasoned cricket journalists and statistical analysts.
          </p>
        </section>

        {/* Section 2: Fact Checking */}
        <section style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 12px" }}>2. Fact-Checking &amp; Verification Methodology</h2>
          <p style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
            Every article, match preview, and statistical summary undergoes multi-layered verification:
          </p>
          <ul style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.85, margin: 0, paddingLeft: 20 }}>
            <li><strong>Official Scorecard Cross-Referencing:</strong> Match figures, career statistics, and head-to-head records are verified against official ICC, BCCI, ECB, and Cricket Australia records.</li>
            <li><strong>Quotes and Statements:</strong> Post-match press conference statements and official quotes are verified from primary audio/video transcripts before inclusion.</li>
            <li><strong>Statistical Models:</strong> Advanced metrics such as Net Run Rate (NRR), Points Percentage (PCT), and bowler economy trends are calculated using validated mathematical formulas.</li>
          </ul>
        </section>

        {/* Section 3: Independence */}
        <section style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 12px" }}>3. Editorial Independence &amp; Ethics</h2>
          <p style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.85, margin: 0 }}>
            Live Cricket Zone operates with complete editorial independence. We do not accept sponsored match predictions, biased editorial coverage, or unverified rumors. Commercial partnerships and advertising placements are clearly demarcated and never influence our match ratings, tournament previews, or player critiques.
          </p>
        </section>

        {/* Section 4: Corrections */}
        <section style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 12px" }}>4. Corrections Policy</h2>
          <p style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.85, margin: 0 }}>
            When an error of fact or calculation occurs, we correct the article promptly and transparently. A correction note is appended explaining what was revised. Readers who detect potential errors can contact our editorial desk at <a href="mailto:editorial@livecricketzone.com" style={{ color: "#00F0FF" }}>editorial@livecricketzone.com</a>.
          </p>
        </section>

        {/* Section 5: Editorial Team */}
        <section style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "0 0 16px" }}>5. Key Editorial Staff</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Arjun Mehta</div>
              <div style={{ fontSize: 11, color: "#00F0FF", fontWeight: 700, marginBottom: 6 }}>Senior Cricket Analyst &amp; T20 Specialist</div>
              <p style={{ fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.6 }}>12+ years analyzing Indian domestic cricket, IPL auction dynamics, and modern white-ball batting mechanics.</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>David Richardson</div>
              <div style={{ fontSize: 11, color: "#D896FF", fontWeight: 700, marginBottom: 6 }}>Chief Test Match Correspondent</div>
              <p style={{ fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.6 }}>Former first-class cricket writer covering ICC World Test Championship series, Ashes encounters, and County cricket.</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Priya Sharma</div>
              <div style={{ fontSize: 11, color: "#FF2E9A", fontWeight: 700, marginBottom: 6 }}>Women's Cricket Correspondent</div>
              <p style={{ fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.6 }}>Specialist in women's cricket analytics, WPL strategy, and international talent pipeline development.</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Rohan Sen</div>
              <div style={{ fontSize: 11, color: "#39FF14", fontWeight: 700, marginBottom: 6 }}>White-Ball Tactical Analyst</div>
              <p style={{ fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.6 }}>White-ball data modeler tracking strike-rotation efficiency, field-restriction manipulation, and death-overs physics.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
