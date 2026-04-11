import React from "react";
import { useNavigate } from "react-router-dom";

export default function MatchCard({ match }) {
  const navigate = useNavigate();
  const isLive      = match.matchStarted && !match.matchEnded;
  const isCompleted = match.matchEnded;

  return (
    <div
      onClick={() => navigate(`/match/${match.id}`)}
      className={`match-card ${isLive ? "match-card-live" : ""}`}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && navigate(`/match/${match.id}`)}
    >
      {/* Subtle top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
        background: isLive
          ? "linear-gradient(90deg, #f43f5e, #fb7185)"
          : isCompleted
          ? "linear-gradient(90deg, #10b981, #2dd4bf)"
          : "linear-gradient(90deg, #6366f1, #818cf8)",
        opacity: 0.8,
      }} />

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
          {match.matchType}
        </span>
        {isLive && (
          <span className="badge badge-live">
            <span className="pulse" />
            LIVE
          </span>
        )}
        {isCompleted && !isLive && (
          <span className="badge badge-completed">✓ Final</span>
        )}
        {!isLive && !isCompleted && (
          <span className="badge badge-upcoming">⏱ Upcoming</span>
        )}
      </div>

      {/* Teams */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        {match.teamInfo?.slice(0, 2).map((t, i) => (
          <React.Fragment key={i}>
            {i === 1 && (
              <span style={{
                fontSize: 10, fontWeight: 900, color: "var(--text-muted)",
                padding: "3px 8px", borderRadius: 6,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                flexShrink: 0,
              }}>VS</span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
              {t.img ? (
                <img
                  src={t.img} alt={t.name}
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.1)", flexShrink: 0 }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              ) : (
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: i === 0 ? "rgba(244,63,94,0.15)" : "rgba(99,102,241,0.15)",
                  border: `1.5px solid ${i === 0 ? "rgba(244,63,94,0.3)" : "rgba(99,102,241,0.3)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 900,
                  color: i === 0 ? "var(--primary-light)" : "var(--secondary-light)",
                }}>
                  {t.shortname?.slice(0, 2)}
                </div>
              )}
              <span style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.shortname}
              </span>
            </div>
          </React.Fragment>
        ))}
        {!match.teamInfo?.length && (
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{match.name}</span>
        )}
      </div>

      {/* Scores */}
      {match.score?.length > 0 && (
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          borderRadius: 10, padding: "10px 14px", marginBottom: 12,
        }}>
          {match.score.map((s, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "4px 0",
              borderBottom: i < match.score.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <span style={{ color: "var(--text3)", fontWeight: 600, fontSize: 12 }}>
                {s.inning?.replace(" Inning", "").replace(" INN 1", "").replace(" INN 2", "")}
              </span>
              <span style={{ fontWeight: 900, fontSize: 15, color: isLive ? "var(--primary-light)" : "var(--text)", fontFamily: "'Poppins', sans-serif" }}>
                {s.r}/{s.w}
                {s.o > 0 && <span style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 500, marginLeft: 5 }}>({s.o})</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Status */}
      <div style={{
        fontSize: 12, fontWeight: 600, lineHeight: 1.4,
        color: isLive ? "var(--primary-light)" : isCompleted ? "var(--accent-emerald)" : "var(--text3)",
        padding: "7px 10px", borderRadius: 8,
        background: isLive ? "rgba(244,63,94,0.07)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${isLive ? "rgba(244,63,94,0.2)" : "var(--border)"}`,
        marginBottom: 10,
        overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
      }}>
        {match.status}
      </div>

      {/* Meta */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>📅 {match.date}</span>
        {match.venue && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>📍 {match.venue.split(",")[0]}</span>}
      </div>
    </div>
  );
}
