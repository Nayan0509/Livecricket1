import React from "react";
import SEO from "../components/SEO";
import { Inline } from "../components/ContentBlocks";
import { CONTACT } from "../content/pages";

export default function Contact() {
  const contactSD = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Live Cricket Zone",
    "url": "https://www.livecricketzone.com/contact"
  };

  return (
    <div className="container" style={{ paddingBottom: 60, maxWidth: 860 }}>
      <SEO url="/contact" structuredData={contactSD} />

      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", margin: "12px 0 10px" }}>{CONTACT.h1}</h1>
      <p style={{ color: "var(--text)", lineHeight: 1.85, fontSize: 16, margin: "0 0 14px" }}><Inline text={CONTACT.lede} /></p>
      <p style={{ fontSize: 18, fontWeight: 800, margin: "0 0 24px" }}>
        <a href={`mailto:${CONTACT.email}`} style={{ color: "var(--secondary)" }}>{CONTACT.email}</a>
      </p>

      {CONTACT.reasons.map(r => (
        <section key={r.title} style={{ padding: "16px 20px", borderRadius: 12, marginBottom: 12, background: "var(--card)", border: "1px solid rgba(15,23,42,0.07)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: "0 0 6px" }}>{r.title}</h2>
          <p style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 14, margin: "0 0 8px" }}><Inline text={r.body} /></p>
          <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(r.subject)}`} style={{ color: "var(--secondary)", fontSize: 13, fontWeight: 700 }}>
            Email us with the subject "{r.subject}"
          </a>
        </section>
      ))}

      <p style={{ color: "var(--text3)", lineHeight: 1.8, fontSize: 14, marginTop: 20 }}><Inline text={CONTACT.note} /></p>
    </div>
  );
}
