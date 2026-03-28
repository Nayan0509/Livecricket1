import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveMatches } from "../api";

export default function Ticker() {
  const { data } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
  });

  // CricketData.org: { data: [{name, status, score}] }
  const matches = data?.data || [];
  if (!matches.length) return null;

  const text = matches.map(m => {
    const score = m.score?.map(s => `${s.inning?.split(" ")[0]}: ${s.r}/${s.w}(${s.o})`).join(" | ") || "";
    return `${m.name} ${score ? "— " + score : ""} | ${m.status}`;
  }).join("   •   ");

  return (
    <div style={{
      background: "var(--green-dark)", color: "#000",
      fontSize: 12, fontWeight: 600, overflow: "hidden",
      height: 28, display: "flex", alignItems: "center"
    }}>
      <span style={{ background: "var(--green)", padding: "0 12px", height: "100%",
        display: "flex", alignItems: "center", flexShrink: 0, fontSize: 11 }}>
        🔴 LIVE
      </span>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div style={{ whiteSpace: "nowrap", animation: "ticker 50s linear infinite" }}>
          {text}&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </div>
      </div>
      <style>{`@keyframes ticker { from{transform:translateX(100%)} to{transform:translateX(-100%)} }`}</style>
    </div>
  );
}
