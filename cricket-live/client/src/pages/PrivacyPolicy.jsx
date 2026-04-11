import React from "react";
import SEO from "../components/SEO";

const SITE = "Live Cricket Zone";
const SITE_URL = "https://www.livecricketzone.com";
const CONTACT = "privacy@livecricketzone.com";
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

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ maxWidth: 860, paddingBottom: 80 }}>
      <SEO
        title="Privacy Policy - Live Cricket Zone"
        description="Privacy Policy for Live Cricket Zone. Learn how we collect, use and protect your data. GDPR compliant. Last updated April 2026."
        url="/privacy-policy"
        noindex={false}
      />

      <div style={{ marginBottom: 36, paddingTop: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Last updated: {UPDATED} · <a href={`mailto:${CONTACT}`} style={{ color: "#f87171", textDecoration: "none" }}>{CONTACT}</a>
        </p>
      </div>

      <div style={{
        background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 12, padding: "14px 18px", marginBottom: 32, fontSize: 13,
        color: "rgba(255,255,255,0.6)", lineHeight: 1.7,
      }}>
        This Privacy Policy applies to <strong style={{ color: "#fff" }}>{SITE_URL}</strong> and all its pages. By using this website you agree to the practices described below. This policy is compliant with the UK GDPR, EU GDPR, and applicable data protection laws.
      </div>

      <Section title="1. Who We Are">
        <p>Live Cricket Zone ("<strong style={{ color: "#fff" }}>we</strong>", "<strong style={{ color: "#fff" }}>us</strong>", "<strong style={{ color: "#fff" }}>our</strong>") operates the website at <a href={SITE_URL} style={{ color: "#f87171" }}>{SITE_URL}</a>. We provide live cricket scores, match commentary, news, and video content aggregation. We are the data controller for personal data collected through this website.</p>
      </Section>

      <Section title="2. What Data We Collect">
        <p style={{ marginBottom: 10 }}>We collect minimal data. Specifically:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Usage data</strong> — pages visited, time on site, browser type, device type, IP address (anonymised). Collected automatically via Google Analytics.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Cookies</strong> — small files stored on your device for analytics and advertising purposes (see Section 5).</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Search queries</strong> — if you use the player search feature, your search term is processed to return results. We do not store search history linked to individuals.</li>
        </ul>
        <p>We do <strong style={{ color: "#fff" }}>not</strong> collect names, email addresses, passwords, or payment information. We do not require account registration.</p>
      </Section>

      <Section title="3. How We Use Your Data">
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}>To provide and improve the website and its features</li>
          <li style={{ marginBottom: 6 }}>To analyse traffic and usage patterns (Google Analytics)</li>
          <li style={{ marginBottom: 6 }}>To serve relevant advertisements (Google AdSense)</li>
          <li style={{ marginBottom: 6 }}>To ensure website security and prevent abuse</li>
        </ul>
        <p style={{ marginTop: 10 }}>Our legal basis for processing under UK/EU GDPR is <strong style={{ color: "#fff" }}>legitimate interests</strong> (analytics, security) and <strong style={{ color: "#fff" }}>consent</strong> (advertising cookies).</p>
      </Section>

      <Section title="4. Third-Party Services">
        <p style={{ marginBottom: 10 }}>We use the following third-party services that may process your data:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { name: "Google Analytics", purpose: "Website traffic analysis", policy: "https://policies.google.com/privacy" },
            { name: "Google AdSense", purpose: "Advertising", policy: "https://policies.google.com/privacy" },
            { name: "YouTube (Google)", purpose: "Video embedding via YouTube IFrame API", policy: "https://policies.google.com/privacy" },
            { name: "Cricbuzz", purpose: "Cricket data sourced from publicly available pages", policy: "https://www.cricbuzz.com/privacy-policy" },
          ].map(s => (
            <div key={s.name} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 2 }}>{s.name}</div>
              <div style={{ fontSize: 13 }}>{s.purpose} · <a href={s.policy} target="_blank" rel="noopener noreferrer" style={{ color: "#f87171" }}>Privacy Policy ↗</a></div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 12 }}>These services have their own privacy policies. We encourage you to review them.</p>
      </Section>

      <Section title="5. Cookies">
        <p style={{ marginBottom: 10 }}>We use the following types of cookies:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Essential cookies</strong> — required for the website to function. Cannot be disabled.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Analytics cookies</strong> — Google Analytics (_ga, _gid) to understand how visitors use the site.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Advertising cookies</strong> — Google AdSense to serve personalised ads based on your interests.</li>
        </ul>
        <p style={{ marginTop: 10 }}>You can control cookies through your browser settings or opt out of Google advertising cookies at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171" }}>adssettings.google.com</a>.</p>
      </Section>

      <Section title="6. YouTube Embedded Videos">
        <p>This website embeds videos from YouTube using the official YouTube IFrame API. When you watch an embedded video, YouTube (Google) may set cookies and collect data about your viewing. This is governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171" }}>Google's Privacy Policy</a>. We use <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 4 }}>youtube-nocookie.com</code> embeds to minimise cookie usage until you interact with the player.</p>
      </Section>

      <Section title="7. Your Rights (UK/EU GDPR)">
        <p style={{ marginBottom: 10 }}>Under UK GDPR and EU GDPR you have the right to:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}>Access the personal data we hold about you</li>
          <li style={{ marginBottom: 6 }}>Request correction of inaccurate data</li>
          <li style={{ marginBottom: 6 }}>Request deletion of your data ("right to be forgotten")</li>
          <li style={{ marginBottom: 6 }}>Object to processing of your data</li>
          <li style={{ marginBottom: 6 }}>Withdraw consent at any time</li>
          <li style={{ marginBottom: 6 }}>Lodge a complaint with the ICO (UK) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171" }}>ico.org.uk</a></li>
        </ul>
        <p style={{ marginTop: 10 }}>To exercise any of these rights, contact us at <a href={`mailto:${CONTACT}`} style={{ color: "#f87171" }}>{CONTACT}</a>.</p>
      </Section>

      <Section title="8. Data Retention">
        <p>Analytics data is retained for 26 months as per Google Analytics default settings. We do not retain any other personal data beyond your active session.</p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>This website is not directed at children under 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, contact us immediately at <a href={`mailto:${CONTACT}`} style={{ color: "#f87171" }}>{CONTACT}</a>.</p>
      </Section>

      <Section title="10. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the website after changes constitutes acceptance of the updated policy.</p>
      </Section>

      <Section title="11. Contact">
        <p>For any privacy-related questions or requests: <a href={`mailto:${CONTACT}`} style={{ color: "#f87171" }}>{CONTACT}</a></p>
        <p style={{ marginTop: 6 }}>Website: <a href={SITE_URL} style={{ color: "#f87171" }}>{SITE_URL}</a></p>
      </Section>
    </div>
  );
}
