import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMatchScore, fetchMatchInfo, fetchMatchScorecard } from "../api";

export default function LiveScore() {
  const { id } = useParams();
  const navigate = useNavigate();

  // cricScore returns list of all current scores; match_info gives full detail
  const { data: infoData, isLoading } = useQuery({
    queryKey: ["matchInfo", id],
    queryFn: () => fetchMatchInfo(id),
    refetchInterval: 15000,
  });

  const { data: scorecardData } = useQuery({
    queryKey: ["scorecard", id],
    queryFn: () => fetchMatchScorecard(id),
    refetchInterval: 30000,
  });

  const match = infoData?.data;
  const innings = scorecardData?.data?.innings || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: 16, fontSize: 13 }}>← Back</button>
      <h1 className="page-title">🔴 Live Score</h1>

      {isLoading && <div className="spinner" />}

      {match && (
        <>
          <div className="card" style={{ marginBottom: 20, background: "linear-gradient(135deg, var(--bg3), var(--card))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, flex: 1 }}>{match.name}</h2>
              {match.matchStarted && !match.matchEnded && (
                <span className="badge badge-live"><span className="pulse">●</span> LIVE</span>
              )}
            </div>

            {/* Team flags */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              {match.teamInfo?.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {t.img && <img src={t.img} alt={t.shortname} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />}
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{t.shortname}</span>
                </div>
              ))}
            </div>

            {/* Scores */}
            {match.score?.map((s, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>{s.inning}</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: "var(--green)", lineHeight: 1 }}>
                  {s.r}/{s.w}
                  <span style={{ fontSize: 16, color: "var(--text2)", marginLeft: 10 }}>({s.o} ov)</span>
                </div>
              </div>
            ))}

            <div style={{ padding: "12px 16px", background: "rgba(0,200,83,0.08)", borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: match.matchStarted && !match.matchEnded ? "var(--red)" : "var(--text2)" }}>
                {match.status}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to={`/match/${id}`} className="btn btn-outline" style={{ flex: 1, minWidth: 140 }}>
                📊 Match Details
              </Link>
              <Link to={`/match/${id}/scorecard`} className="btn btn-primary" style={{ flex: 1, minWidth: 140 }}>
                📋 Full Scorecard
              </Link>
            </div>
          </div>

          {/* Quick Scorecard Preview */}
          {innings.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Latest Batting</h3>
              {innings.slice(-1).map((inn, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: 14, color: "var(--primary-light)", fontWeight: 700, marginBottom: 12 }}>
                    {inn.team} - {inn.score}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                          <th style={{ padding: 10, textAlign: "left", fontSize: 11, color: "var(--text3)" }}>BATSMAN</th>
                          <th style={{ padding: 10, textAlign: "right", fontSize: 11, color: "var(--text3)" }}>R</th>
                          <th style={{ padding: 10, textAlign: "right", fontSize: 11, color: "var(--text3)" }}>B</th>
                          <th style={{ padding: 10, textAlign: "right", fontSize: 11, color: "var(--text3)" }}>SR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inn.batsmen.slice(0, 5).map((b, i) => (
                          <tr key={i} style={{ borderTop: "1px solid var(--divider)" }}>
                            <td style={{ padding: 10, fontWeight: 600 }}>{b.name}</td>
                            <td style={{ padding: 10, textAlign: "right", fontWeight: 800 }}>{b.r}</td>
                            <td style={{ padding: 10, textAlign: "right" }}>{b.b}</td>
                            <td style={{ padding: 10, textAlign: "right", color: "var(--accent-teal)" }}>{b.sr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Link to={`/match/${id}/scorecard`} className="link-primary" style={{ display: "block", marginTop: 12, fontSize: 13 }}>
                    View Full Scorecard →
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Match Info</h3>
            <div style={{ fontSize: 13, color: "var(--text2)", display: "flex", flexDirection: "column", gap: 8 }}>
              {match.tossWinner && <div>🪙 Toss: {match.tossWinner} won, chose to {match.tossChoice}</div>}
              <div>📍 {match.venue}</div>
              <div>📅 {match.date}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>Auto-refreshes every 15s</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
