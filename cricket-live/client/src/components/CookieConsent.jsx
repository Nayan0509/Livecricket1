import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Tells Google's tags (Analytics and AdSense) what the visitor chose. The
// defaults, and a choice saved on an earlier visit, are applied in
// public/index.html before those tags load.
function applyConsent(granted) {
  const v = granted ? "granted" : "denied";
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
  }
  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.requestNonPersonalizedAds = granted ? 0 : 1;
}

// Footer "Cookie settings" link dispatches this to reopen the notice.
export const OPEN_COOKIE_SETTINGS = "lcz:cookie-settings";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let consent = null;
    try { consent = localStorage.getItem("lcz_cookie_consent"); } catch (_) {}
    const open = () => setShow(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS, open);
    let timer;
    if (!consent) timer = setTimeout(open, 1200);
    return () => { clearTimeout(timer); window.removeEventListener(OPEN_COOKIE_SETTINGS, open); };
  }, []);

  const choose = (granted) => {
    try { localStorage.setItem("lcz_cookie_consent", granted ? "accepted" : "essential_only"); } catch (_) {}
    applyConsent(granted);
    setShow(false);
  };
  const handleAccept = () => choose(true);
  const handleDecline = () => choose(false);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      left: 20,
      right: 20,
      maxWidth: 720,
      margin: "0 auto",
      background: "rgba(255,255,255,0.96)",
      border: "1px solid rgba(11,99,196,0.25)",
      borderRadius: 16,
      padding: "18px 24px",
      boxShadow: "0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(11,99,196,0.15)",
      backdropFilter: "blur(12px)",
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}></span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>
            Cookie &amp; Privacy Choices
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
            We would like to use cookies from Google AdSense (advertising) and Google Analytics (visitor statistics). The site works the same either way, and you can change your choice later from the Cookie settings link at the bottom of every page. Details are in our{" "}
            <Link to="/privacy-policy" style={{ color: "#0b63c4", textDecoration: "underline" }}>
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
            background: "rgba(15,23,42,0.06)",
            border: "1px solid rgba(15,23,42,0.15)",
            color: "var(--text2)",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            background: "linear-gradient(135deg, #0b63c4, #0a58ad)",
            border: "none",
            color: "#fff",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "none",
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
