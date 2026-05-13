import React, { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchLiveMatches } from "../api";

function MatchChip({ match, onClick }) {
  const t1  = match.teamInfo?.[0];
  const t2  = match.teamInfo?.[1];
  const s1  = match.score?.[0];
  const s2  = match.score?.[1];

  const teamLabel = (team, score, align) => (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: align === "right" ? "flex-end" : "flex-start",
    }}>
      <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 0.4 }}>
        {team?.shortname || "TBD"}
      </span>
      {score
        ? <span style={{ fontSize: 13, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", color: "#fff", lineHeight: 1 }}>
            {score.r}/{score.w}
            <span style={{ fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.45)", marginLeft: 3 }}>
              ({score.o})
            </span>
          </span>
        : <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>—</span>
      }
    </div>
  );

  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 14px",
        borderRadius: 100,
        background: "rgba(16,185,129,0.12)",
        border: "1px solid rgba(16,185,129,0.28)",
        cursor: "pointer",
        transition: "all 0.2s",
        outline: "none",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(16,185,129,0.22)";
        e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(16,185,129,0.12)";
        e.currentTarget.style.borderColor = "rgba(16,185,129,0.28)";
      }}
    >
      {/* Live pulse dot */}
      <span style={{
        width: 5, height: 5, borderRadius: "50%",
        background: "#10B981",
        animation: "livePulse 1.8s ease-in-out infinite",
        flexShrink: 0,
      }} />

      {/* Team 1 */}
      {teamLabel(t1, s1, "left")}

      {/* VS */}
      <span style={{ fontSize: 9, fontWeight: 900, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>vs</span>

      {/* Team 2 */}
      {teamLabel(t2, s2, "right")}

      {/* Status text */}
      {match.status && (
        <span style={{
          fontSize: 9, fontWeight: 700, color: "rgba(16,185,129,0.8)",
          maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          borderLeft: "1px solid rgba(16,185,129,0.2)", paddingLeft: 8,
        }}>
          {match.status}
        </span>
      )}
    </button>
  );
}

export default function Ticker() {
  const navigate   = useNavigate();
  const scrollRef  = useRef(null);

  const { data } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
  });

  const matches = data?.data || [];

  // Auto-scroll the ticker horizontally
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || matches.length === 0) return;
    let frame;
    let pos = 0;
    const speed = 0.5;
    const tick = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    el.addEventListener("mouseenter", () => cancelAnimationFrame(frame));
    el.addEventListener("mouseleave", () => { frame = requestAnimationFrame(tick); });

    return () => cancelAnimationFrame(frame);
  }, [matches.length]);

  if (!matches.length) {
    return (
      <div style={{
        background: "rgba(16,185,129,0.05)",
        borderBottom: "1px solid rgba(16,185,129,0.1)",
        height: 36, display: "flex", alignItems: "center",
        padding: "0 16px", gap: 12,
      }}>
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#10B981", background: "rgba(16,185,129,0.12)", padding: "3px 10px", borderRadius: 100, flexShrink: 0 }}>
          LIVE FEED
        </span>
        <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>
          No live matches right now — check back soon
        </span>
      </div>
    );
  }

  // Duplicate for seamless loop
  const doubled = [...matches, ...matches];

  return (
    <div style={{
      background: "rgba(9,9,11,0.98)",
      borderBottom: "1px solid rgba(16,185,129,0.12)",
      height: 44,
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",
      zIndex: 50,
    }}>
      {/* Label */}
      <div style={{
        flexShrink: 0,
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        background: "linear-gradient(135deg,#059669,#10B981)",
        gap: 6,
        borderRight: "1px solid rgba(16,185,129,0.2)",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "livePulse 1.8s infinite" }} />
        <span style={{ fontSize: 10, fontWeight: 900, color: "#fff", letterSpacing: "1.2px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Live
        </span>
      </div>

      {/* Scrolling chips */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
          padding: "0 12px",
        }}
      >
        {doubled.map((m, i) => (
          <MatchChip
            key={`${m.id}-${i}`}
            match={m}
            onClick={() => navigate(`/match/${m.id}`)}
          />
        ))}
      </div>

      {/* Fade edges */}
      <div style={{
        position: "absolute", left: 84, top: 0, bottom: 0, width: 32,
        background: "linear-gradient(to right, rgba(9,9,11,0.9), transparent)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 40,
        background: "linear-gradient(to left, rgba(9,9,11,0.9), transparent)",
        pointerEvents: "none",
      }} />

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
