import React, { useEffect, useRef } from "react";

// ─── Replace these slot IDs with real ones from your AdSense console ───
// Go to: Google AdSense → Ads → By ad unit → Create ad unit
// Then paste the numeric data-ad-slot value below for each ad size.
// Until a slot has a real ID, that banner renders nothing; Auto Ads (enabled
// by the adsbygoogle script in public/index.html) places ads on its own.
const PUB = "ca-pub-8179151029580359";

const AD_SLOTS = {
  // "Leaderboard" — 728×90 — place at top/bottom of page
  leaderboard: { slot: "REPLACE_LEADERBOARD_SLOT", format: "auto", fullWidth: true },
  // "Rectangle" — 300×250 — place in sidebar
  rectangle:   { slot: "REPLACE_RECTANGLE_SLOT",   format: "rectangle", fullWidth: false },
  // "In-feed" — responsive — place between content blocks
  infeed:      { slot: "REPLACE_INFEED_SLOT",       format: "fluid",     fullWidth: true },
  // "Auto" — a responsive display unit
  auto:        { slot: "REPLACE_AUTO_SLOT",         format: "auto",      fullWidth: true },
};

const hasRealSlot = cfg => /^\d+$/.test(cfg.slot);

export default function AdBanner({
  type = "auto",
  label = true,
  style: extraStyle = {},
  className = "",
}) {
  const cfg = AD_SLOTS[type] || AD_SLOTS.auto;
  const enabled = hasRealSlot(cfg);
  const pushed = useRef(false);

  // One push per rendered <ins>, and only when one was rendered: pushing
  // without a matching empty <ins> makes adsbygoogle throw a TagError.
  useEffect(() => {
    if (!enabled || pushed.current) return undefined;
    const t = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (_) {}
    }, 150);
    return () => clearTimeout(t);
  }, [enabled]);

  if (!enabled) return null;

  const minHeight = type === "rectangle" ? 250 : type === "leaderboard" ? 90 : 60;

  return (
    <div
      style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden", ...extraStyle }}
      className={`ad-container ${className}`}
    >
      {label && <span className="ad-label">Advertisement</span>}
      <div className="ad-slot" style={{ display: "block", width: "100%", minHeight, background: "transparent", borderRadius: 8, overflow: "hidden" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", minHeight }}
          data-ad-client={PUB}
          data-ad-slot={cfg.slot}
          data-ad-format={cfg.format}
          data-full-width-responsive={cfg.fullWidth ? "true" : undefined}
        />
      </div>
    </div>
  );
}
