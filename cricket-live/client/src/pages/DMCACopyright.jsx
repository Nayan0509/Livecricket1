import React from "react";
import SEO from "../components/SEO";

const SITE_URL = "https://www.livecricketzone.com";
const DMCA_EMAIL = "dmca@livecricketzone.com";
const UPDATED = "11 April 2026";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {title}
      </h2>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}

export default function DMCACopyright() {
  return (
    <div className="container" style={{ maxWidth: 860, paddingBottom: 80 }}>
      <SEO
        title="DMCA & Copyright Policy - Live Cricket Zone"
        description="DMCA and Copyright Policy for Live Cricket Zone. How to submit a copyright takedown notice. We respect intellectual property rights and respond promptly to valid DMCA claims."
        url="/dmca-copyright"
        noindex={false}
      />

      <div style={{ marginBottom: 36, paddingTop: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 8 }}>DMCA & Copyright Policy</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Last updated: {UPDATED} · <a href={`mailto:${DMCA_EMAIL}`} style={{ color: "#f87171", textDecoration: "none" }}>{DMCA_EMAIL}</a>
        </p>
      </div>

      {/* Key statement */}
      <div style={{
        background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: 12, padding: "16px 20px", marginBottom: 32,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>✅</span>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
          Live Cricket Zone respects intellectual property rights. We do not host, upload, or store any video content. All videos are embedded from YouTube using the official YouTube IFrame API. We respond promptly to valid copyright notices.
        </div>
      </div>

      <Section title="1. Our Content Policy">
        <p style={{ marginBottom: 10 }}>Live Cricket Zone operates as an aggregation and embedding platform. Specifically:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Cricket scores & data</strong> — Factual match data (scores, wickets, overs) is not subject to copyright under UK and international law. We source this from publicly available information.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>News</strong> — Headlines and brief excerpts sourced from public RSS feeds with attribution and links to original sources.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Videos</strong> — Embedded from YouTube via the official IFrame API. We do not host, download, re-upload, or modify any video content. All videos remain on YouTube's servers.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Images</strong> — Team flags sourced from Cricbuzz's public CDN. Player images are not used.</li>
        </ul>
      </Section>

      <Section title="2. YouTube Video Embeds — Important Notice">
        <div style={{
          background: "rgba(255,0,0,0.06)", border: "1px solid rgba(255,0,0,0.15)",
          borderRadius: 10, padding: "14px 16px", marginBottom: 12,
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <rect width="16" height="12" rx="3" fill="#FF0000"/>
            <polygon points="6.5,3 6.5,9 11,6" fill="white"/>
          </svg>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
            All videos displayed on this website are owned by their respective YouTube channels and content creators. Live Cricket Zone is not the uploader or owner of any video content.
          </div>
        </div>
        <p style={{ marginBottom: 10 }}>If your video is embedded on our site and you wish to have it removed, you have two options:</p>
        <ol style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}>
            <strong style={{ color: "#fff" }}>Preferred: Contact YouTube directly</strong> — Since the video is hosted on YouTube, the fastest resolution is to submit a copyright claim directly to YouTube via their <a href="https://support.google.com/youtube/answer/2807622" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171" }}>Copyright Complaint process ↗</a>. Once the video is removed from YouTube, it will automatically stop appearing on our site.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong style={{ color: "#fff" }}>Contact us directly</strong> — Email <a href={`mailto:${DMCA_EMAIL}`} style={{ color: "#f87171" }}>{DMCA_EMAIL}</a> with the details below and we will remove the embed within <strong style={{ color: "#fff" }}>48 hours</strong>.
          </li>
        </ol>
      </Section>

      <Section title="3. How to Submit a DMCA Takedown Notice">
        <p style={{ marginBottom: 12 }}>To submit a valid DMCA takedown notice, email <a href={`mailto:${DMCA_EMAIL}`} style={{ color: "#f87171" }}>{DMCA_EMAIL}</a> with the following information:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { n: "1", label: "Your full legal name and contact information (email, address, phone)" },
            { n: "2", label: "Identification of the copyrighted work you claim has been infringed" },
            { n: "3", label: "The specific URL on our website where the allegedly infringing content appears" },
            { n: "4", label: "The YouTube video URL of the embedded content" },
            { n: "5", label: "A statement that you have a good faith belief that the use is not authorised by the copyright owner, its agent, or the law" },
            { n: "6", label: "A statement that the information in your notice is accurate and, under penalty of perjury, that you are the copyright owner or authorised to act on their behalf" },
            { n: "7", label: "Your electronic or physical signature" },
          ].map(item => (
            <div key={item.n} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#f87171", flexShrink: 0 }}>{item.n}</span>
              <span style={{ fontSize: 13 }}>{item.label}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 14 }}>We will acknowledge receipt within <strong style={{ color: "#fff" }}>24 hours</strong> and take action within <strong style={{ color: "#fff" }}>48 hours</strong> of receiving a valid notice.</p>
      </Section>

      <Section title="4. Counter-Notice">
        <p>If you believe content was removed in error, you may submit a counter-notice to <a href={`mailto:${DMCA_EMAIL}`} style={{ color: "#f87171" }}>{DMCA_EMAIL}</a> including: your contact information, identification of the removed content, a statement under penalty of perjury that you have a good faith belief the content was removed by mistake, and your consent to jurisdiction of the courts of England and Wales.</p>
      </Section>

      <Section title="5. Repeat Infringers">
        <p>Live Cricket Zone has a policy of terminating, in appropriate circumstances, users or automated processes that are repeat infringers of intellectual property rights.</p>
      </Section>

      <Section title="6. Cricket Data & Scores">
        <p>Factual sports data — including match scores, player statistics, and match results — is not protected by copyright under UK law (<em>Football Dataco Ltd v Yahoo! UK Ltd</em> [2012]) and EU law. We aggregate this factual data from publicly available sources. If you believe we are using your proprietary database in a way that infringes your database rights, please contact us at <a href={`mailto:${DMCA_EMAIL}`} style={{ color: "#f87171" }}>{DMCA_EMAIL}</a>.</p>
      </Section>

      <Section title="7. Contact">
        <p>DMCA Agent / Copyright Enquiries:</p>
        <div style={{ marginTop: 10, padding: "14px 18px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>Live Cricket Zone</div>
          <div>Email: <a href={`mailto:${DMCA_EMAIL}`} style={{ color: "#f87171" }}>{DMCA_EMAIL}</a></div>
          <div style={{ marginTop: 4 }}>Website: <a href={SITE_URL} style={{ color: "#f87171" }}>{SITE_URL}</a></div>
        </div>
      </Section>
    </div>
  );
}
