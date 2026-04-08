import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveMatches } from "../api";

export default function Ticker() {
  const { data } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
  });

  const matches = data?.data || [];
  if (!matches.length) return (
    <div className="glass" style={{ background: "rgba(224, 45, 45, 0.1)", color: "var(--primary-light)", fontSize: 11, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
       📡 SCANNING GLOBAL NODES... NO ACTIVE MATCH UPLINKS DISCOVERED
    </div>
  );

  const text = matches.map(m => {
    const scoreText = m.score?.map(s => {
      const runs = s.r + "/" + s.w;
      const overs = s.o > 0 ? " (" + s.o + ")" : "";
      return s.inning + ": " + runs + overs;
    }).join(" | ") || "";
    return m.name + (scoreText ? " — [" + scoreText + "]" : "") + " [" + m.status + "]";
  }).join("   •   ");

  return (
    <div className="glass" style={{
      borderTop: "none", borderLeft: "none", borderRight: "none",
      color: "var(--text)",
      fontSize: 11, fontWeight: 700, overflow: "hidden",
      height: 32, display: "flex", alignItems: "center"
    }}>
      <span style={{ 
        background: "var(--gradient-primary)", color: "white", padding: "0 16px", height: "100%",
        display: "flex", alignItems: "center", flexShrink: 0, fontSize: 10, letterSpacing: 1
      }}>
        LIVE FEED
      </span>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div style={{ 
          whiteSpace: "nowrap", 
          display: "inline-block",
          paddingLeft: "100%",
          animation: "tickerContent 60s linear infinite" 
        }}>
          {text}&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </div>
      </div>
      <style>{`
        @keyframes tickerContent { 
          from { transform: translateX(0); } 
          to { transform: translateX(-100%); } 
        }
      `}</style>
    </div>
  );
}
