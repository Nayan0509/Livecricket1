import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEO from "../components/SEO";
import { fetchMatchInfo, fetchMatchScorecard } from "../api";

export default function LiveScore() {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const isLive = match?.matchStarted && !match?.matchEnded;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title={match ? `${match.name} Live Score — Ball by Ball Updates` : "Live Cricket Score — Ball by Ball Updates"}
        description={match ? `Live score for ${match.name}. ${match.status}. Real-time ball-by-ball updates every 15 seconds on Live Cricket Zone.` : "Live cricket score with real-time ball-by-ball updates every 15 seconds. Free, no sign-up required."}
        url={`/match/${id}/live-score`}
      />

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: 16, marginBottom: 16, padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
          color: "var(--text3)", cursor: "pointer", fontFamily: "'Inter',sans-serif",
        }}
      >
        ← Back
      </button>

      {isLoading && !match && (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto" }} />
          <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 16 }}>Loading live score…</p>
        </div>
      )}

      {match && (
        <>
          {/* Match header card */}
          <div style={{
            padding: "24px", borderRadius: 14, marginBottom: 16,
            background: isLive
              ? "linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(9,9,11,0.98) 100%)"
              : "linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(9,9,11,0.98) 100%)",
            border: isLive ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(59,130,246,0.12)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                  {match.matchType} · {match.series}
                </div>
                <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>{match.name}</h1>
              </div>
              {isLive && (
                <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 900, background: "#EF4444", color: "#fff", padding: "4px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "livePulse 1.5s infinite", display: "inline-block" }} />
                  LIVE
                </span>
              )}
            </div>

            {/* Team flags */}
            {match.teamInfo?.length > 0 && (
              <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
                {match.teamInfo.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {t.img && (
                      <img src={t.img} alt={t.shortname} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)" }} />
                    )}
                    <span style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>{t.shortname}</span>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>{t.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Scores */}
            {match.score?.length > 0 && (
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
                {match.score.map((s, i) => (
                  <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>{s.inning}</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "#3B82F6", lineHeight: 1 }}>
                      {s.r}/{s.w}
                      <span style={{ fontSize: 14, color: "var(--text3)", marginLeft: 8 }}>({s.o} ov)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status */}
            <div style={{ padding: "10px 14px", borderRadius: 8, background: isLive ? "rgba(239,68,68,0.08)" : "rgba(59,130,246,0.06)", border: isLive ? "1px solid rgba(239,68,68,0.15)" : "1px solid rgba(59,130,246,0.12)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: isLive ? "#fb7185" : "#60A5FA" }}>
                {match.status}
              </div>
            </div>
          </div>

          {/* Match info */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            {match.venue && (
              <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 12, color: "var(--text3)" }}>
                📍 {match.venue}
              </div>
            )}
            {match.date && (
              <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 12, color: "var(--text3)" }}>
                📅 {match.date}
              </div>
            )}
            {match.tossWinner && (
              <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 12, color: "var(--text3)" }}>
                🪙 {match.tossWinner} won toss, chose to {match.tossChoice}
              </div>
            )}
            {isLive && (
              <div style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)", fontSize: 11, color: "#60A5FA" }}>
                🔄 Auto-refreshes every 15s
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <Link to={`/match/${id}`} style={{
              flex: 1, minWidth: 140, textAlign: "center", padding: "11px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text2)", textDecoration: "none",
            }}>
              📊 Match Details
            </Link>
            <Link to={`/match/${id}/scorecard`} style={{
              flex: 1, minWidth: 140, textAlign: "center", padding: "11px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
              color: "#3B82F6", textDecoration: "none",
            }}>
              📋 Full Scorecard
            </Link>
          </div>

          {/* Quick Scorecard Preview */}
          {innings.length > 0 && (
            <div style={{ padding: "20px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 14 }}>Latest Batting</h3>
              {innings.slice(-1).map((inn, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: 13, color: "#3B82F6", fontWeight: 700, marginBottom: 12 }}>
                    {inn.team} — {inn.score}
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
                      <thead>
                        <tr>
                          <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: "var(--text3)", fontWeight: 800, textTransform: "uppercase" }}>Batsman</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 10, color: "var(--text3)", fontWeight: 800, textTransform: "uppercase" }}>R</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 10, color: "var(--text3)", fontWeight: 800, textTransform: "uppercase" }}>B</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 10, color: "var(--text3)", fontWeight: 800, textTransform: "uppercase" }}>SR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inn.batsmen?.slice(0, 6).map((b, i) => (
                          <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <td style={{ padding: "9px 12px", fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{b.name}</td>
                            <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 900, fontSize: 14, color: "var(--text)" }}>{b.r}</td>
                            <td style={{ padding: "9px 12px", textAlign: "right", fontSize: 12, color: "var(--text3)" }}>{b.b}</td>
                            <td style={{ padding: "9px 12px", textAlign: "right", fontSize: 12, color: "#38bdf8" }}>{b.sr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Link to={`/match/${id}/scorecard`} style={{ display: "block", marginTop: 14, fontSize: 12, color: "#3B82F6", fontWeight: 700, textDecoration: "none" }}>
                    View Full Scorecard →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
