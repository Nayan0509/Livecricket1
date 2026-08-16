import React, { useState } from "react";
import SEO from "../components/SEO";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  const contactSD = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Live Cricket Zone Editorial & Support Team",
    "description": "Get in touch with the Live Cricket Zone editorial team for inquiries, score corrections, feedback, and advertising opportunities.",
    "url": "https://www.livecricketzone.com/contact"
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Contact Us — Live Cricket Zone Editorial & Support"
        description="Contact the Live Cricket Zone team for editorial inquiries, match score corrections, technical support, and advertising partnerships."
        keywords="contact live cricket zone, cricket editorial contact, score correction, advertise with us"
        url="/contact"
        structuredData={contactSD}
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "32px 28px", borderRadius: 20,
        background: "linear-gradient(135deg, rgba(0,240,255,0.1) 0%, rgba(13,20,38,0.98) 100%)",
        border: "1px solid rgba(0,240,255,0.2)",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,240,255,0.15)", border: "1px solid rgba(0,240,255,0.3)", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: "#00F0FF", marginBottom: 12 }}>
          <span>📫</span> GET IN TOUCH
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
          Contact <span style={{ color: "#00F0FF" }}>Live Cricket Zone</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, maxWidth: 650, lineHeight: 1.7 }}>
          We welcome feedback, editorial inquiries, score corrections, and advertising requests. Our dedicated team reviews every submission within 24–48 hours.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>
        {/* Contact Info Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📧</div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Editorial Inquiries</h3>
            <p style={{ fontSize: 12, color: "var(--text3)", margin: "0 0 10px" }}>For articles, match reports, and analysis suggestions:</p>
            <a href="mailto:editorial@livecricketzone.com" style={{ color: "#00F0FF", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              editorial@livecricketzone.com
            </a>
          </div>

          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🛠️</div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Technical Support &amp; Corrections</h3>
            <p style={{ fontSize: 12, color: "var(--text3)", margin: "0 0 10px" }}>Found a scoring discrepancy or website bug?</p>
            <a href="mailto:support@livecricketzone.com" style={{ color: "#00F0FF", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              support@livecricketzone.com
            </a>
          </div>

          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>💼</div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>Business &amp; Advertising</h3>
            <p style={{ fontSize: 12, color: "var(--text3)", margin: "0 0 10px" }}>Partnerships, advertising, and syndication:</p>
            <a href="mailto:contact@livecricketzone.com" style={{ color: "#00F0FF", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              contact@livecricketzone.com
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", margin: "0 0 16px" }}>Send Us a Message</h3>

          {submitted ? (
            <div style={{ padding: "28px 20px", textAlign: "center", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
              <h4 style={{ color: "#22c55e", fontWeight: 800, margin: "0 0 6px" }}>Message Received!</h4>
              <p style={{ color: "var(--text2)", fontSize: 13, margin: 0 }}>Thank you for reaching out. Our team will review your message and respond shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 6 }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 6 }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 6 }}>Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(20,20,30,0.95)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none" }}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Score Correction">Score / Data Correction</option>
                  <option value="Editorial Feedback">Editorial Feedback &amp; Suggestions</option>
                  <option value="Advertising">Advertising &amp; Partnerships</option>
                  <option value="Technical Issue">Technical Support</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 6 }}>Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..."
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none", resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "12px 20px", borderRadius: 10, background: "linear-gradient(135deg, #00F0FF, #00B8D9)",
                  color: "#000", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", marginTop: 6,
                  boxShadow: "0 0 16px rgba(0,240,255,0.35)"
                }}
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Editorial Standards Notice */}
      <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px" }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", margin: "0 0 8px" }}>⚖️ Editorial Standards &amp; Correction Policy</h4>
        <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.8, margin: 0 }}>
          Live Cricket Zone is committed to accuracy and transparency. When factual errors or statistical inaccuracies occur, we issue immediate corrections and update affected scorecards and articles. If you identify an inaccuracy in our live score feeds, player career numbers, or editorial analysis, please notify our editorial desk at <a href="mailto:editorial@livecricketzone.com" style={{ color: "#00F0FF" }}>editorial@livecricketzone.com</a> with the match ID or article title.
        </p>
      </div>
    </div>
  );
}
