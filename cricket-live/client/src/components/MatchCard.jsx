import React from "react";
import { useNavigate } from "react-router-dom";

// CricketData.org match fields:
// id, name, matchType, status, venue, date, teams:[], teamInfo:[{name,shortname,img}]
// score:[{r,w,o,inning}], matchStarted, matchEnded
export default function MatchCard({ match }) {
  const navigate = useNavigate();
  const isLive = match.matchStarted && !match.matchEnded;
  const isCompleted = match.matchEnded;

  return (
    <div onClick={() => navigate(`/match/${match.id}`)} style={{ textDecoration: "none", cursor: "pointer" }}>
      <div className={`match-card ${isLive ? 'match-card-live' : ''}`} style={{ transition: "0.3s" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ 
            fontSize: 11, 
            color: "var(--text3)", 
            fontWeight: 700, 
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            {match.matchType}
          </span>
          {isLive      && <span className="badge badge-live"><span className="pulse">●</span> LIVE</span>}
          {isCompleted && <span className="badge badge-completed">✓ Completed</span>}
          {!isLive && !isCompleted && <span className="badge badge-upcoming">⏱ Upcoming</span>}
        </div>

        {/* Team logos + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          {match.teamInfo?.slice(0, 2).map((t, i) => (
            <React.Fragment key={i}>
              {i === 1 && <span style={{ color: "var(--text3)", fontSize: 14, fontWeight: 800 }}>VS</span>}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                {t.img && (
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid var(--border)",
                    boxShadow: "var(--shadow-sm)"
                  }}>
                    <img src={t.img} alt={t.shortname} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <span style={{ 
                  fontWeight: 800, 
                  fontSize: 16,
                  color: "var(--text)",
                  fontFamily: "'Poppins', sans-serif"
                }}>{t.shortname}</span>
              </div>
            </React.Fragment>
          ))}
          {!match.teamInfo?.length && (
            <span style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>{match.name}</span>
          )}
        </div>

        {/* Scores */}
        {match.score?.length > 0 && (
          <div style={{
            background: "var(--bg3)",
            borderRadius: "var(--radius)",
            padding: "12px",
            marginBottom: "12px"
          }}>
            {match.score.map((s, i) => (
              <div key={i} style={{
                display: "flex", 
                justifyContent: "space-between",
                padding: "6px 0", 
                borderBottom: i < match.score.length - 1 ? "1px solid var(--divider)" : "none",
                fontSize: 14
              }}>
                <span style={{ color: "var(--text2)", fontWeight: 600 }}>
                  {s.inning?.replace(" Inning", "")}
                </span>
                <span style={{ 
                  fontWeight: 800, 
                  color: "var(--primary-light)",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 16
                }}>
                  {s.r}/{s.w} 
                  {s.o > 0 && (
                    <span style={{ color: "var(--text3)", fontSize: 12, fontWeight: 500, marginLeft: 6 }}>
                      ({s.o} ov)
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Status */}
        <div style={{ 
          fontSize: 13, 
          color: isLive ? "var(--primary-light)" : "var(--text2)", 
          fontWeight: 600, 
          marginBottom: 8,
          padding: "8px 12px",
          background: isLive ? "rgba(224, 45, 45, 0.1)" : "var(--bg3)",
          borderRadius: "var(--radius-sm)",
          border: isLive ? "1px solid rgba(224, 45, 45, 0.3)" : "1px solid var(--border)"
        }}>
          {match.status}
        </div>

        {match.statusDetail && (
           <div style={{ fontSize: 11, color: "var(--accent-teal)", fontWeight: 700, marginTop: 8, padding: "4px 8px", background: "rgba(20, 184, 166, 0.05)", borderRadius: 4 }}>
              🏏 {match.statusDetail}
           </div>
        )}

        {/* Date + Venue */}
        <div style={{ 
          fontSize: 12, 
          color: "var(--text3)", 
          display: "flex",
          gap: "12px",
          flexWrap: "wrap"
        }}>
          <span>📅 {match.date}</span>
          {match.venue && <span>📍 {match.venue}</span>}
        </div>
      </div>
    </div>
  );
}
