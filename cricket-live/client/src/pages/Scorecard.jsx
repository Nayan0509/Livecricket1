import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEO from "../components/SEO";
import { fetchMatchScorecard, fetchMatchInfo } from "../api";

function BattingTable({ team, score, batsmen }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span style={{ width: 3, height: 18, borderRadius: 2, background: "linear-gradient(180deg,#22C55E,#16A34A)", display: "inline-block" }} />
        <div>
          <span style={{ fontSize: 15, fontWeight: 900, color: "var(--text)" }}>{team}</span>
          {score && <span style={{ marginLeft: 12, fontSize: 14, fontWeight: 700, color: "#22C55E" }}>{score}</span>}
        </div>
      </div>
      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["Batsman", "Status", "R", "B", "4s", "6s", "SR"].map(h => (
                <th key={h} style={{
                  padding: "12px 16px",
                  textAlign: h === "Batsman" || h === "Status" ? "left" : "right",
                  color: "var(--text3)", fontSize: 10, fontWeight: 900,
                  textTransform: "uppercase", letterSpacing: 0.8,
                  whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {batsmen.map((b, i) => (
              <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 13, color: "var(--text)", whiteSpace: "nowrap" }}>{b.name}</td>
                <td style={{ padding: "12px 16px", color: "var(--text3)", fontSize: 11, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.dismissal || "not out"}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 900, fontSize: 15, color: "var(--text)" }}>{b.r}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--text3)" }}>{b.b}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--text3)" }}>{b.fours}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--text3)" }}>{b.sixes}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, fontSize: 12, color: "#38bdf8" }}>{b.sr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BowlingTable({ bowlers }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
        Bowling Analysis
      </div>
      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["Bowler", "O", "M", "R", "W", "Econ"].map(h => (
                <th key={h} style={{
                  padding: "12px 16px",
                  textAlign: h === "Bowler" ? "left" : "right",
                  color: "var(--text3)", fontSize: 10, fontWeight: 900,
                  textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bowlers.map((b, i) => (
              <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 13, color: "var(--text)", whiteSpace: "nowrap" }}>{b.name}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{b.o}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{b.m}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{b.r}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 900, fontSize: 15, color: "#22C55E" }}>{b.w}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, fontSize: 12, color: "var(--text2)" }}>{b.eco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Scorecard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [innIdx, setInnIdx] = useState(0);

  const { data: scData, isLoading, error } = useQuery({
    queryKey: ["scorecard", id],
    queryFn: () => fetchMatchScorecard(id),
    refetchInterval: 30000,
  });

  const { data: infoData } = useQuery({
    queryKey: ["matchInfo", id],
    queryFn: () => fetchMatchInfo(id),
    refetchInterval: 60000,
  });

  const innings = scData?.data?.innings || [];
  const match = infoData?.data;
  const isLive = match?.matchStarted && !match?.matchEnded;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 80px" }}>
      <SEO
        title={match ? `${match.name} Scorecard — Full Innings Stats` : "Cricket Scorecard — Full Batting & Bowling Stats"}
        description={match ? `Full scorecard for ${match.name}. ${match.status}. Batting and bowling figures with ball-by-ball analysis on Live Cricket Zone.` : "Full cricket scorecard with complete batting innings, bowling figures, dismissals and fall of wickets. Live Cricket Zone."}
        url={`/match/${id}/scorecard`}
      />

      {/* Back */}
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

      {/* Match header */}
      <div style={{
        padding: "22px 24px", borderRadius: 14, marginBottom: 20,
        background: "linear-gradient(135deg, rgba(34,197,94,0.07) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(34,197,94,0.12)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>
              📊 Match Scorecard
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", margin: "0 0 4px", lineHeight: 1.3 }}>
              {match?.name || "Loading scorecard…"}
            </h1>
            {match?.status && (
              <div style={{ fontSize: 12, color: isLive ? "#fb7185" : "#4ade80", fontWeight: 700 }}>
                {isLive && "● "}{match.status}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Link to={`/match/${id}`} style={{
              padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text3)", textDecoration: "none",
            }}>
              Details
            </Link>
            {isLive && (
              <Link to={`/match/${id}/live-score`} style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#fb7185", textDecoration: "none",
              }}>
                ● Live
              </Link>
            )}
          </div>
        </div>
      </div>

      {isLoading && !innings.length && (
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto" }} />
          <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 16 }}>Loading scorecard…</p>
        </div>
      )}

      {error && (
        <div style={{ padding: "40px 24px", textAlign: "center", background: "rgba(248,113,113,0.06)", borderRadius: 12, border: "1px solid rgba(248,113,113,0.15)" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
          <h2 style={{ color: "#f87171", fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Scorecard Unavailable</h2>
          <p style={{ color: "var(--text3)", fontSize: 13 }}>Scorecard data for match {id} could not be loaded. Try again shortly.</p>
        </div>
      )}

      {!isLoading && !error && innings.length > 0 && (
        <>
          {/* Innings selector */}
          <div style={{ display: "inline-flex", padding: 4, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 24, gap: 4, flexWrap: "wrap" }}>
            {innings.map((inn, i) => (
              <button
                key={i}
                onClick={() => setInnIdx(i)}
                style={{
                  padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                  background: innIdx === i ? "rgba(34,197,94,0.15)" : "transparent",
                  color: innIdx === i ? "#22C55E" : "var(--text3)",
                  border: innIdx === i ? "1px solid rgba(34,197,94,0.3)" : "1px solid transparent",
                  cursor: "pointer", transition: "all 0.15s", fontFamily: "'Inter',sans-serif",
                }}
              >
                {inn.team} {inn.score && <span style={{ fontWeight: 900 }}>{inn.score}</span>}
              </button>
            ))}
          </div>

          {/* Scorecard content */}
          <div key={innIdx}>
            <BattingTable
              team={innings[innIdx].team}
              score={innings[innIdx].score}
              batsmen={innings[innIdx].batsmen || []}
            />
            {innings[innIdx].bowlers?.length > 0 && (
              <BowlingTable bowlers={innings[innIdx].bowlers} />
            )}
            {innings[innIdx].fow?.length > 0 && (
              <div style={{ padding: "16px 20px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  Fall of Wickets
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {innings[innIdx].fow.map((w, i) => (
                    <span key={i} style={{ background: "rgba(255,255,255,0.04)", padding: "3px 10px", borderRadius: 6 }}>{w}</span>
                  ))}
                </div>
              </div>
            )}
            {innings[innIdx].extras !== undefined && (
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 24 }}>
                Extras: <strong style={{ color: "var(--text2)" }}>{innings[innIdx].extras}</strong>
              </div>
            )}
          </div>
        </>
      )}

      {!isLoading && !error && innings.length === 0 && (
        <div style={{ padding: "60px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🕐</div>
          <h2 style={{ color: "var(--text)", fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Scorecard Not Yet Available</h2>
          <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 16 }}>
            {isLive ? "The match is live — scorecard data is initialising." : "Scorecard will be available once the match begins."}
          </p>
          <Link to={`/match/${id}`} style={{ fontSize: 13, color: "#22C55E", fontWeight: 700, textDecoration: "none" }}>
            View Match Details →
          </Link>
        </div>
      )}
    </div>
  );
}
