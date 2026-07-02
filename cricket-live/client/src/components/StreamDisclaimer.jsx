import React from "react";

// Honest content disclaimer. Live Cricket Zone does not host or rebroadcast
// live matches — we show live scores plus official highlights embedded from
// YouTube. This block sets expectations and credits rights holders.
export default function StreamDisclaimer() {
  return (
    <div
      style={{
        borderRadius: 14, marginBottom: 24, padding: "16px 18px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 15 }}>ℹ️</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>
          About the video content on this page
        </span>
      </div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>
        Live Cricket Zone provides live scores, statistics and match information. We do{" "}
        <strong style={{ color: "rgba(255,255,255,0.75)" }}>not</strong> host, stream or
        rebroadcast live matches. Any video shown here is an official post-match{" "}
        <strong style={{ color: "rgba(255,255,255,0.75)" }}>highlights clip</strong> embedded
        directly from the rights holder's own YouTube channel, in line with YouTube's Terms of
        Service. All video content remains the property of its respective owners. To watch matches
        live, please use your official licensed broadcaster.
      </p>
    </div>
  );
}
