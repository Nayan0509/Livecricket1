import React from "react";
import { Link } from "react-router-dom";

// CricketData.org match fields:
// id, name, matchType, status, venue, date, teams:[], teamInfo:[{name,shortname,img}]
// score:[{r,w,o,inning}], matchStarted, matchEnded
export default function MatchCard({ match }) {
  const isLive = match.matchStarted && !match.matchEnded;
  const isCompleted = match.matchEnded;

  return (
    <Link to={`/match/${match.id}`} style={{ textDecoration: "none" }}>
      <div className="card" style={{ cursor: "pointer" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600, textTransform: "uppercase" }}>
            {match.matchType}
          </span>
          {isLive      && <span className="badge badge-live"><span className="pulse">●</span> LIVE</span>}
          {isCompleted && <span className="badge badge-completed">Completed</span>}
          {!isLive && !isCompleted && <span className="badge badge-upcoming">Upcoming</span>}
        </div>

        {/* Team logos + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          {match.teamInfo?.slice(0, 2).map((t, i) => (
            <React.Fragment key={i}>
              {i === 1 && <span style={{ color: "var(--text3)", fontSize: 12, fontWeight: 700 }}>vs</span>}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {t.img && <img src={t.img} alt={t.shortname} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />}
                <span style={{ fontWeight: 700, fontSize: 14 }}>{t.shortname}</span>
              </div>
            </React.Fragment>
          ))}
          {!match.teamInfo?.length && (
            <span style={{ fontWeight: 700, fontSize: 14 }}>{match.name}</span>
          )}
        </div>

        {/* Scores */}
        {match.score?.map((s, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between",
            padding: "4px 0", borderBottom: "1px solid var(--border)", fontSize: 13
          }}>
            <span style={{ color: "var(--text2)" }}>{s.inning?.replace(" Inning", "")}</span>
            <span style={{ fontWeight: 700, color: "var(--green)" }}>{s.r}/{s.w} <span style={{ color: "var(--text3)", fontSize: 11 }}>({s.o} ov)</span></span>
          </div>
        ))}

        {/* Status */}
        <div style={{ fontSize: 12, color: isLive ? "var(--red)" : "var(--text2)", fontWeight: 500, marginTop: 8 }}>
          {match.status}
        </div>

        {/* Date + Venue */}
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>
          📅 {match.date} {match.venue ? `• 📍 ${match.venue}` : ""}
        </div>
      </div>
    </Link>
  );
}
