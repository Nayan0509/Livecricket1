import React from "react";
import SEO from "../components/SEO";

const SITE_URL = "https://www.livecricketzone.com";
const CONTACT = "legal@livecricketzone.com";
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

export default function TermsOfUse() {
  return (
    <div className="container" style={{ maxWidth: 860, paddingBottom: 80 }}>
      <SEO
        title="Terms of Use - Live Cricket Zone"
        description="Terms of Use for Live Cricket Zone. Read our terms and conditions for using our live cricket scores, streaming, and content services."
        url="/terms-of-use"
        noindex={false}
      />

      <div style={{ marginBottom: 36, paddingTop: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Terms of Use</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Last updated: {UPDATED} · <a href={`mailto:${CONTACT}`} style={{ color: "#f87171", textDecoration: "none" }}>{CONTACT}</a>
        </p>
      </div>

      <div style={{
        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 12, padding: "14px 18px", marginBottom: 32, fontSize: 13,
        color: "rgba(255,255,255,0.6)", lineHeight: 1.7,
      }}>
        By accessing or using <strong style={{ color: "#fff" }}>{SITE_URL}</strong> you agree to be bound by these Terms of Use. If you do not agree, please do not use this website.
      </div>

      <Section title="1. Acceptance of Terms">
        <p>These Terms of Use ("Terms") govern your access to and use of Live Cricket Zone ("the Website", "we", "us"). By using the Website you confirm you are at least 13 years old and agree to these Terms in full.</p>
      </Section>

      <Section title="2. Description of Service">
        <p>Live Cricket Zone provides:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li style={{ marginBottom: 6 }}>Live cricket scores and ball-by-ball commentary aggregated from publicly available sources</li>
          <li style={{ marginBottom: 6 }}>Embedded YouTube videos for cricket match streams and highlights</li>
          <li style={{ marginBottom: 6 }}>Cricket news aggregated from public RSS feeds</li>
          <li style={{ marginBottom: 6 }}>Player statistics, ICC rankings, and match schedules</li>
        </ul>
        <p style={{ marginTop: 10 }}>The service is provided free of charge. We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice.</p>
      </Section>

      <Section title="3. Intellectual Property">
        <p style={{ marginBottom: 10 }}><strong style={{ color: "#fff" }}>Our content:</strong> The design, layout, code, and original written content of this Website are owned by Live Cricket Zone and protected by copyright law. You may not reproduce, distribute, or create derivative works without our written permission.</p>
        <p style={{ marginBottom: 10 }}><strong style={{ color: "#fff" }}>Third-party content:</strong> Cricket scores, statistics, and match data are factual information not subject to copyright. News articles are sourced from third-party RSS feeds and remain the property of their respective publishers. YouTube videos are owned by their respective channels and creators.</p>
        <p><strong style={{ color: "#fff" }}>Trademarks:</strong> Team names, tournament names, logos, and cricket board trademarks belong to their respective owners (ICC, BCCI, ECB, PCB, Cricket Australia, etc.). Live Cricket Zone is not affiliated with or endorsed by any cricket board or official body.</p>
      </Section>

      <Section title="4. YouTube Video Content">
        <p>Videos displayed on this Website are embedded from YouTube using the official YouTube IFrame API. All video content is owned by the respective YouTube channels and content creators. Live Cricket Zone:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li style={{ marginBottom: 6 }}>Does not host, upload, store, or claim ownership of any video content</li>
          <li style={{ marginBottom: 6 }}>Does not modify or alter video content in any way</li>
          <li style={{ marginBottom: 6 }}>Embeds videos in compliance with YouTube's Terms of Service</li>
          <li style={{ marginBottom: 6 }}>Provides direct links to original YouTube videos</li>
        </ul>
        <p style={{ marginTop: 10 }}>If you are a content owner and have concerns about embedded content, please refer to our <a href="/dmca-copyright" style={{ color: "#f87171" }}>DMCA / Copyright page</a> or contact YouTube directly via their <a href="https://support.google.com/youtube/answer/2807622" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171" }}>copyright complaint process ↗</a>.</p>
      </Section>

      <Section title="5. Acceptable Use">
        <p style={{ marginBottom: 10 }}>You agree not to:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}>Scrape, crawl, or systematically extract data from the Website without permission</li>
          <li style={{ marginBottom: 6 }}>Use the Website for any unlawful purpose</li>
          <li style={{ marginBottom: 6 }}>Attempt to gain unauthorised access to any part of the Website</li>
          <li style={{ marginBottom: 6 }}>Transmit any malicious code, viruses, or harmful content</li>
          <li style={{ marginBottom: 6 }}>Reproduce or republish our content without attribution and permission</li>
        </ul>
      </Section>

      <Section title="6. Advertising">
        <p>This Website displays advertisements served by Google AdSense. Advertisements are clearly distinguishable from editorial content. We are not responsible for the content of third-party advertisements. Ad targeting is based on your browsing behaviour as described in our <a href="/privacy-policy" style={{ color: "#f87171" }}>Privacy Policy</a>.</p>
      </Section>

      <Section title="7. Disclaimer of Warranties">
        <p>The Website is provided on an "<strong style={{ color: "#fff" }}>as is</strong>" and "<strong style={{ color: "#fff" }}>as available</strong>" basis without warranties of any kind, express or implied. We do not warrant that:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li style={{ marginBottom: 6 }}>Live scores and data are 100% accurate or up to date at all times</li>
          <li style={{ marginBottom: 6 }}>The Website will be uninterrupted, error-free, or free of viruses</li>
          <li style={{ marginBottom: 6 }}>Any particular video stream will be available at any given time</li>
        </ul>
        <p style={{ marginTop: 10 }}>Cricket data is sourced from publicly available information and may occasionally contain errors or delays.</p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>To the fullest extent permitted by law, Live Cricket Zone shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Website, including but not limited to loss of data, loss of profits, or any reliance on information provided on the Website.</p>
      </Section>

      <Section title="9. External Links">
        <p>The Website may contain links to third-party websites. These links are provided for convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.</p>
      </Section>

      <Section title="10. Governing Law">
        <p>These Terms are governed by and construed in accordance with the laws of <strong style={{ color: "#fff" }}>England and Wales</strong>. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
      </Section>

      <Section title="11. Changes to Terms">
        <p>We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the Website after changes constitutes acceptance of the revised Terms.</p>
      </Section>

      <Section title="12. Contact">
        <p>For any questions regarding these Terms: <a href={`mailto:${CONTACT}`} style={{ color: "#f87171" }}>{CONTACT}</a></p>
      </Section>
    </div>
  );
}
