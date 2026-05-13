import React from "react";
import { useNavigate } from "react-router-dom";
import { trackWatchClick, trackMatchCardClick } from "../utils/analytics";

export default function MatchCard({ match }) {
  const navigate = useNavigate();
  const isLive      = match.matchStarted && !match.matchEnded;
  const isCompleted = match.matchEnded;

  const handleWatch = (e) => {
    e.stopPropagation();
    trackWatchClick(match.id, match.name);
    navigate(`/match/${match.id}?watch=1`);
  };

  return (
    <>
    <div
      onClick={() => { trackMatchCardClick(match.id, match.name, isLive); navigate(`/match/${match.id}`); }}
      style={{
        background: isLive ? "rgba(242, 139, 130, 0.05)" : "var(--card)",
        border: `1px solid ${isLive ? "rgba(242, 139, 130, 0.25)" : "var(--border)"}`,
        borderRadius: 24, padding: "20px",
        transition: "all 0.3s cubic-bezier(0.2,0,0,1)",
        position: "relative", overflow: "hidden", cursor: "pointer",
        display: "flex", flexDirection: "column"
      }}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && navigate(`/match/${match.id}`)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.background = isLive ? "rgba(242, 139, 130, 0.1)" : "var(--card-hover)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = isLive ? "rgba(242, 139, 130, 0.05)" : "var(--card)";
      }}
    >
      {/* Subtle top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: isLive ? "var(--live)" : isCompleted ? "var(--green)" : "var(--primary)",
      }} />

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "Roboto, 'Google Sans', sans-serif" }}>
          {match.matchType}
        </span>
        {isLive && (
          <span style={{ fontSize: 10, color: "var(--live)", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, background: "rgba(242,139,130,0.15)", padding: "4px 10px", borderRadius: 100 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--live)", display: "inline-block", animation: "livePulse 1.8s infinite" }} />
            LIVE
          </span>
        )}
        {isCompleted && !isLive && (
          <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, background: "rgba(129,201,149,0.15)", padding: "4px 10px", borderRadius: 100 }}>✓ FINAL</span>
        )}
        {!isLive && !isCompleted && (
           <span style={{ fontSize: 10, color: "var(--primary)", fontWeight: 700, background: "rgba(138,180,248,0.15)", padding: "4px 10px", borderRadius: 100 }}>UPCOMING</span>
        )}
      </div>

      {/* Teams */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        {match.teamInfo?.slice(0, 2).map((t, i) => (
          <React.Fragment key={i}>
            {i === 1 && (
              <span style={{
                fontSize: 12, fontWeight: 900, color: "var(--text3)",
                padding: "4px 8px", borderRadius: 8,
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                flexShrink: 0,
              }}>VS</span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, flexDirection: i === 1 ? "row-reverse" : "row", textAlign: i === 1 ? "right" : "left" }}>
              {t.img ? (
                <img
                  src={t.img} alt={t.name}
                  style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)", flexShrink: 0 }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              ) : (
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: "var(--bg3)",
                  border: "2px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 900,
                  color: "var(--text2)",
                }}>
                  {t.shortname?.slice(0, 2)}
                </div>
              )}
              <span style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.shortname}
              </span>
            </div>
          </React.Fragment>
        ))}
        {!match.teamInfo?.length && (
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{match.name}</span>
        )}
      </div>

      {/* Scores */}
      {match.score?.length > 0 && (
        <div style={{
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: 16, padding: "12px 16px", marginBottom: 16,
        }}>
          {match.score.map((s, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "6px 0",
              borderBottom: i < match.score.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ color: "var(--text3)", fontWeight: 600, fontSize: 13 }}>
                {s.inning?.replace(" Inning", "").replace(" INN 1", "").replace(" INN 2", "")}
              </span>
              <span style={{ fontWeight: 900, fontSize: 16, color: isLive ? "var(--primary)" : "var(--text)", fontFamily: "Roboto, sans-serif" }}>
                {s.r}/{s.w}
                {s.o > 0 && <span style={{ color: "var(--text3)", fontSize: 12, fontWeight: 500, marginLeft: 6 }}>({s.o})</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Status */}
      <div style={{
        fontSize: 13, fontWeight: 600, lineHeight: 1.5,
        color: isLive ? "var(--live)" : isCompleted ? "var(--green)" : "var(--text3)",
        padding: "10px 12px", borderRadius: 12,
        background: isLive ? "rgba(242,139,130,0.1)" : "var(--bg3)",
        border: `1px solid ${isLive ? "rgba(242,139,130,0.2)" : "transparent"}`,
        marginBottom: 16,
        overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
      }}>
        {match.status}
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500 }}>{match.date}</span>
        </div>
        <button
          onClick={handleWatch}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: isLive ? "var(--primary)" : "var(--bg3)",
            border: "none",
            color: isLive ? "#161619" : "var(--text2)",
            borderRadius: 100, padding: "8px 16px",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.2,0,0,1)", flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = isLive ? "var(--primary-light)" : "var(--card)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = isLive ? "var(--primary)" : "var(--bg3)"; }}
        >
          ▶ Watch
        </button>
      </div>
    </div>
    </>
  );
}
