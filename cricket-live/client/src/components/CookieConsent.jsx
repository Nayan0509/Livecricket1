import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("lcz_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("lcz_cookie_consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("lcz_cookie_consent", "essential_only");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      left: 20,
      right: 20,
      maxWidth: 720,
      margin: "0 auto",
      background: "rgba(13, 20, 38, 0.96)",
      border: "1px solid rgba(0, 240, 255, 0.25)",
      borderRadius: 16,
      padding: "18px 24px",
      boxShadow: "0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 240, 255, 0.15)",
      backdropFilter: "blur(12px)",
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>🍪</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 4 }}>
            Cookie &amp; Privacy Choices
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
            Live Cricket Zone uses cookies and similar technologies (including Google AdSense and analytics) to personalize content, analyze site traffic, and deliver relevant advertisements. You can review your rights in our{" "}
            <Link to="/privacy-policy" style={{ color: "#00F0FF", textDecoration: "underline" }}>
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={handleDecline}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "var(--text2)",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Essential Only
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            background: "linear-gradient(135deg, #00F0FF, #00B8D9)",
            border: "none",
            color: "#000",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 0 12px rgba(0, 240, 255, 0.35)",
          }}
        >
          Accept All Cookies
        </button>
      </div>
    </div>
  );
}
