import React, { useEffect, useRef } from "react";

// ─── Replace these slot IDs with real ones from your AdSense console ───
// Go to: Google AdSense → Ads → By ad unit → Create ad unit
// Then paste the data-ad-slot value below for each ad size.
const PUB = "ca-pub-8179151029580359";

const AD_SLOTS = {
  // "Leaderboard" — 728×90 — place at top/bottom of page
  leaderboard: { slot: "REPLACE_LEADERBOARD_SLOT", format: "auto", fullWidth: true },
  // "Rectangle" — 300×250 — place in sidebar
  rectangle:   { slot: "REPLACE_RECTANGLE_SLOT",   format: "rectangle", fullWidth: false },
  // "In-feed" — responsive — place between content blocks
  infeed:      { slot: "REPLACE_INFEED_SLOT",       format: "fluid",     fullWidth: true },
  // "Auto" responsive — works with Auto Ads (no specific slot needed)
  auto:        { slot: "auto",                       format: "auto",      fullWidth: true },
};

export default function AdBanner({
  type = "auto",
  label = true,
  style: extraStyle = {},
  className = "",
}) {
  const adRef   = useRef(null);
  const pushed  = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    // Small delay so the DOM is fully ready
    const t = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (_) {}
    }, 150);
    return () => clearTimeout(t);
  }, []);

  const cfg = AD_SLOTS[type] || AD_SLOTS.auto;

  const wrapStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    ...extraStyle,
  };

  const slotStyle = {
    display: "block",
    width: "100%",
    minHeight: type === "rectangle" ? 250 : type === "leaderboard" ? 90 : 60,
    background: "rgba(255,255,255,0.015)",
    borderRadius: 8,
    overflow: "hidden",
  };

  return (
    <div style={wrapStyle} className={`ad-container ${className}`}>
      {label && (
        <span className="ad-label">Advertisement</span>
      )}
      <div className="ad-slot" style={slotStyle}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minHeight: slotStyle.minHeight }}
          data-ad-client={PUB}
          data-ad-slot={cfg.slot}
          data-ad-format={cfg.format}
          data-full-width-responsive={cfg.fullWidth ? "true" : undefined}
        />
      </div>
    </div>
  );
}
