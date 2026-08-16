import React from "react";
import SEO from "../components/SEO";

const SITE = "Live Cricket Zone";
const SITE_URL = "https://www.livecricketzone.com";
const CONTACT = "privacy@livecricketzone.com";
const UPDATED = "16 August 2026";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {title}
      </h2>
      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.85 }}>
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ maxWidth: 880, paddingBottom: 80 }}>
      <SEO
        title="Privacy Policy — Live Cricket Zone & Google AdSense Disclosures"
        description="Privacy Policy for Live Cricket Zone. Detailed disclosures on Google AdSense, DoubleClick DART cookies, third-party advertising, GDPR and CCPA user rights."
        keywords="privacy policy, live cricket zone privacy, adsense privacy policy, doubleclick dart cookie, GDPR privacy"
        url="/privacy-policy"
      />

      <div style={{ marginBottom: 36, paddingTop: 8 }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Last updated: {UPDATED} · Contact: <a href={`mailto:${CONTACT}`} style={{ color: "#00F0FF", textDecoration: "none" }}>{CONTACT}</a>
        </p>
      </div>

      <div style={{
        background: "rgba(0,240,255,0.08)", border: "1px solid rgba(0,240,255,0.2)",
        borderRadius: 12, padding: "16px 20px", marginBottom: 32, fontSize: 13,
        color: "rgba(255,255,255,0.7)", lineHeight: 1.7,
      }}>
        This Privacy Policy governs the manner in which <strong style={{ color: "#fff" }}>{SITE}</strong> ({SITE_URL}) collects, uses, maintains, and discloses information collected from users. We respect your privacy and are committed to protecting personal data in full compliance with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and Google AdSense Program Policies.
      </div>

      <Section title="1. Information We Collect">
        <p style={{ marginBottom: 10 }}>When you visit Live Cricket Zone, we may collect non-personally identifiable information automatically:</p>
        <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Log and Device Data:</strong> Browser type, operating system, device model, referring URLs, timestamps, and anonymized IP addresses.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Cookies and Web Beacons:</strong> Identifiers placed on your device to enhance navigation, analyze trends, and deliver relevant advertisements.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>User Communications:</strong> If you contact us via email or our contact form, we retain your email address and message history solely to respond to your inquiry.</li>
        </ul>
      </Section>

      <Section title="2. Google AdSense and DoubleClick DART Cookies">
        <p style={{ marginBottom: 12 }}>
          Google is a third-party vendor on our website. Google uses cookies, specifically the <strong style={{ color: "#fff" }}>DoubleClick DART cookie</strong>, to serve ads to our site visitors based upon their visit to {SITE_URL} and other sites on the Internet:
        </p>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={{ marginBottom: 6 }}>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
          <li style={{ marginBottom: 6 }}>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
          <li style={{ marginBottom: 6 }}>Users may opt out of personalized advertising by visiting <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: "#00F0FF" }}>Google Ads Settings</a>.</li>
          <li style={{ marginBottom: 6 }}>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: "#00F0FF" }}>aboutads.info</a> or <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" style={{ color: "#00F0FF" }}>Your Online Choices</a>.</li>
        </ul>
      </Section>

      <Section title="3. Third-Party Ad Networks and Analytics">
        <p style={{ marginBottom: 10 }}>
          Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Live Cricket Zone. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
        </p>
        <p>
          Note that Live Cricket Zone has no access to or control over these cookies that are used by third-party advertisers.
        </p>
      </Section>

      <Section title="4. GDPR Data Subject Rights (For European Users)">
        <p style={{ marginBottom: 10 }}>If you reside in the European Economic Area (EEA) or UK, you possess specific data protection rights under the GDPR:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>The right to access:</strong> You have the right to request copies of your personal data.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>The right to rectification:</strong> You can request corrections to inaccurate information.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>The right to erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
          <li style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>The right to withdraw consent:</strong> You may withdraw your consent for non-essential cookies at any time via your browser settings.</li>
        </ul>
      </Section>

      <Section title="5. CCPA Rights (For California Residents)">
        <p style={{ marginBottom: 10 }}>
          Under the California Consumer Privacy Act (CCPA), California consumers have the right to request disclosure of categories of personal information collected, request deletion of collected information, and request not to sell the consumer's personal data. <strong style={{ color: "#fff" }}>We do not sell personal information.</strong>
        </p>
      </Section>

      <Section title="6. Children's Information (COPPA)">
        <p>
          Protecting children's privacy online is paramount. Live Cricket Zone does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe your child provided this information on our website, please contact us immediately and we will promptly remove such information from our records.
        </p>
      </Section>

      <Section title="7. Contact Information">
        <p>
          If you have any questions or suggestions about our Privacy Policy or data practices, please contact our Data Protection Officer at <a href={`mailto:${CONTACT}`} style={{ color: "#00F0FF" }}>{CONTACT}</a> or via our <a href="/contact" style={{ color: "#00F0FF" }}>Contact Us</a> page.
        </p>
      </Section>
    </div>
  );
}
