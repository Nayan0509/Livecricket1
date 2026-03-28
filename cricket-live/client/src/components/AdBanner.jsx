import React, { useEffect, useRef } from "react";

// AdSense publisher ID
const PUB = "ca-pub-8179151029580359";

// Ad slot sizes:
//  "leaderboard"  → 728×90  (top/bottom of page)
//  "rectangle"    → 300×250 (sidebar / in-content)
//  "banner"       → 320×50  (mobile banner)
//  "responsive"   → auto (fills container width)

const SLOT_MAP = {
  leaderboard: { width: "100%", minHeight: 90, style: "display:inline-block;width:728px;height:90px" },
  rectangle:   { width: 300,   minHeight: 250, style: "display:inline-block;width:300px;height:250px" },
  banner:      { width: "100%", minHeight: 50, style: "display:inline-block;width:320px;height:50px" },
  responsive:  { width: "100%", minHeight: 90, style: "display:block" },
};

export default function AdBanner({ type = "responsive", slot = "auto", style: extraStyle = {} }) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      }
    } catch (e) {
      // adsbygoogle not loaded yet — fine
    }
  }, []);

  const cfg = SLOT_MAP[type] || SLOT_MAP.responsive;

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      width: "100%", overflow: "hidden",
      minHeight: cfg.minHeight,
      background: "rgba(255,255,255,0.02)",
      borderRadius: 8,
      ...extraStyle
    }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: type === "responsive" ? "block" : "inline-block", width: cfg.width, minHeight: cfg.minHeight }}
        data-ad-client={PUB}
        data-ad-slot={slot}
        data-ad-format={type === "responsive" ? "auto" : undefined}
        data-full-width-responsive={type === "responsive" ? "true" : undefined}
      />
    </div>
  );
}
