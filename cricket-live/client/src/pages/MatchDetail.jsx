import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMatchInfo, fetchMatchScorecard, fetchMatchCommentary } from "../api";
import SEO from "../components/SEO";

/* ─────────────────────────────────────────────
   UTILITY: Event badge color for commentary
───────────────────────────────────────────── */
function eventColor(event) {
  if (!event) return "var(--text3)";
  if (event === "SIX") return "#f59e0b";
  if (event === "FOUR") return "#10b981";
  if (event === "WICKET") return "#ef4444";
  if (event === "WIDE" || event === "NO_BALL") return "#8b5cf6";
  return "var(--text3)";
}
function eventBg(event) {
  if (event === "SIX") return "rgba(245,158,11,0.12)";
  if (event === "FOUR") return "rgba(16,185,129,0.12)";
  if (event === "WICKET") return "rgba(239,68,68,0.15)";
  return "transparent";
}

/* ─────────────────────────────────────────────
   SCORECARD TAB
───────────────────────────────────────────── */
function ScorecardTab({ matchId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["scorecard", matchId],
    queryFn: () => fetchMatchScorecard(matchId),
    refetchInterval: 30000,
  });

  const [innIdx, setInnIdx] = useState(0);
  const innings = data?.data?.innings || [];

  if (isLoading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
      <div className="spinner" style={{ margin: 0 }} />
    </div>
  );

  if (!innings.length) return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
      <p style={{ color: "var(--text3)", fontSize: 15 }}>Scorecard data is pending — match may not have started yet.</p>
    </div>
  );

  const inn = innings[innIdx];

  return (
    <div className="animate-fade-in">
      {/* Innings selector */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 24,
        background: "rgba(255,255,255,0.03)", borderRadius: 12,
        padding: 6, width: "fit-content"
      }}>
        {innings.map((i, idx) => (
          <button
            key={idx}
            onClick={() => setInnIdx(idx)}
            style={{
              background: innIdx === idx ? "var(--gradient-primary)" : "transparent",
              color: innIdx === idx ? "#fff" : "var(--text3)",
              border: "none", borderRadius: 8,
              padding: "8px 20px", fontWeight: 700, fontSize: 13,
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: innIdx === idx ? "0 4px 12px rgba(224,45,45,0.3)" : "none"
            }}
          >
            {i.team} — {i.score}
          </button>
        ))}
      </div>

      {/* Score Summary */}
      <div style={{
        background: "linear-gradient(135deg, rgba(224,45,45,0.08), rgba(0,0,0,0))",
        border: "1px solid rgba(224,45,45,0.2)",
        borderRadius: 16, padding: "20px 24px", marginBottom: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>
            {inn.team} — Innings {innIdx + 1}
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "var(--primary-light)" }}>{inn.score}</div>
        </div>
        <div style={{ textAlign: "right", fontSize: 13, color: "var(--text2)" }}>
          <div>Extras: <strong>{inn.extras}</strong></div>
        </div>
      </div>

      {/* Batting Table */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, paddingLeft: 4 }}>
          🏏 Batting
        </div>
        <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--glass-border)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["Batsman", "Status", "R", "B", "4s", "6s", "SR"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px",
                    textAlign: h === "Batsman" || h === "Status" ? "left" : "right",
                    fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 800
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inn.batsmen?.map((b, i) => (
                <tr key={i}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)", transition: "0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 14 }}>
                    {b.name}
                    {b.dismissal === "not out" && (
                      <span style={{ marginLeft: 8, fontSize: 10, color: "var(--accent-green)", background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 10, fontWeight: 800 }}>
                        NOT OUT
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: "var(--text3)", maxWidth: 200 }}>{b.dismissal}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 900, fontSize: 16 }}>{b.r}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--text2)" }}>{b.b}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--accent-green)" }}>{b.fours}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "#f59e0b" }}>{b.sixes}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--accent-teal)", fontWeight: 600 }}>{b.sr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fall of Wickets */}
      {inn.fow && inn.fow.length > 0 && (
        <div style={{ marginBottom: 28, padding: "14px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, fontSize: 12 }}>
          <span style={{ fontWeight: 800, color: "var(--text2)", marginRight: 12, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Fall of Wickets:</span>
          <span style={{ color: "var(--text3)", lineHeight: 1.8 }}>{inn.fow.join("  •  ")}</span>
        </div>
      )}

      {/* Bowling Table */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 900, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, paddingLeft: 4 }}>
          🎯 Bowling
        </div>
        <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--glass-border)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["Bowler", "O", "M", "R", "W", "Econ"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px",
                    textAlign: h === "Bowler" ? "left" : "right",
                    fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 800
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inn.bowlers?.map((bw, i) => (
                <tr key={i}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)", transition: "0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 14 }}>{bw.name}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--text2)" }}>{bw.o}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--text2)" }}>{bw.m}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>{bw.r}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 900, fontSize: 16, color: "var(--primary-light)" }}>{bw.w}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "var(--accent-teal)" }}>{bw.eco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMMENTARY TAB
───────────────────────────────────────────── */
function CommentaryTab({ matchId }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["commentary", matchId],
    queryFn: () => fetchMatchCommentary(matchId),
    refetchInterval: 15000,
    retry: 2,
  });

  // API returns { status: "success", data: [...] }
  const commentary = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
      <div className="spinner" style={{ margin: 0 }} />
    </div>
  );

  if (error) return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <p style={{ color: "var(--text3)", fontSize: 15, marginBottom: 20 }}>Failed to load commentary.</p>
      <button onClick={() => refetch()} className="btn btn-outline" style={{ padding: "10px 24px" }}>Retry</button>
    </div>
  );

  if (!commentary.length) return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎙️</div>
      <p style={{ color: "var(--text3)", fontSize: 15 }}>Live commentary will appear here once the match begins.</p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {commentary.slice(0, 80).map((c, i) => (
        <div
          key={i}
          style={{
            display: "flex", gap: 16, padding: "14px 16px",
            background: i === 0 ? eventBg(c.event) : "transparent",
            borderRadius: 10,
            borderLeft: c.event === "WICKET"
              ? "3px solid var(--primary-light)"
              : c.event === "SIX"
              ? "3px solid #f59e0b"
              : c.event === "FOUR"
              ? "3px solid var(--accent-green)"
              : "3px solid transparent",
            transition: "0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
          onMouseLeave={e => e.currentTarget.style.background = i === 0 ? eventBg(c.event) : "transparent"}
        >
          {/* Over label */}
          <div style={{
            minWidth: 56, fontWeight: 900, fontSize: 13,
            color: eventColor(c.event),
            textAlign: "center", paddingTop: 2
          }}>
            {c.over !== "" ? `${c.over}.${c.ball}` : "—"}
            {c.event && c.event !== "default" && (
              <div style={{
                fontSize: 9, fontWeight: 900, letterSpacing: 0.5,
                textTransform: "uppercase", color: eventColor(c.event),
                marginTop: 2
              }}>{c.event}</div>
            )}
          </div>
          {/* Text */}
          <div style={{ flex: 1, fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>
            {c.batsmanStriker && (
              <span style={{ fontWeight: 700, color: "var(--text)", marginRight: 6 }}>{c.batsmanStriker}</span>
            )}
            {c.text || <span style={{ color: "var(--text3)", fontStyle: "italic" }}>—</span>}
          </div>
          {/* Runs chip — show for all deliveries including dot balls */}
          {c.runs !== undefined && (
            <div style={{
              minWidth: 28, height: 28, borderRadius: "50%", display: "flex",
              alignItems: "center", justifyContent: "center",
              background: c.event === "SIX" ? "#f59e0b"
                : c.event === "FOUR" ? "var(--accent-green)"
                : c.event === "WICKET" ? "var(--primary-light)"
                : c.runs > 0 ? "var(--bg4)"
                : "rgba(255,255,255,0.06)",
              color: "#fff", fontSize: 13, fontWeight: 900, flexShrink: 0
            }}>
              {c.runs}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MATCH INFO TAB
───────────────────────────────────────────── */
function MatchInfoTab({ match }) {
  const infoRows = [
    { label: "Match", value: match.name },
    { label: "Series / Tournament", value: match.series || match.matchType },
    { label: "Match Type", value: match.matchType },
    { label: "Venue", value: match.venue || "TBA" },
    { label: "Date", value: match.date || match.dateTimeGMT ? new Date(match.dateTimeGMT || match.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "TBA" },
    { label: "Toss", value: match.tossWinner ? `${match.tossWinner} won the toss & chose to ${match.tossChoice}` : "Not yet decided" },
    { label: "Status", value: match.status || "Scheduled" },
    { label: "Result", value: match.matchEnded ? match.status : "—" },
  ].filter(r => r.value);

  return (
    <div className="animate-fade-in">
      <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--glass-border)" }}>
        {infoRows.map((row, i) => (
          <div key={i} style={{
            display: "flex", gap: 16,
            padding: "16px 24px",
            background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
            borderBottom: i < infoRows.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
            alignItems: "flex-start"
          }}>
            <div style={{
              minWidth: 180, fontSize: 12, fontWeight: 800, textTransform: "uppercase",
              letterSpacing: 0.8, color: "var(--text3)", paddingTop: 2
            }}>{row.label}</div>
            <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500, lineHeight: 1.5 }}>{row.value}</div>
          </div>
        ))}
      </div>

      {/* Team flags */}
      {match.teamInfo?.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Teams</div>
          <div style={{ display: "flex", gap: 16 }}>
            {match.teamInfo.map((team, idx) => (
              <div key={idx} style={{
                flex: 1, padding: "20px 24px",
                background: "rgba(255,255,255,0.03)", borderRadius: 14,
                border: "1px solid var(--glass-border)",
                display: "flex", alignItems: "center", gap: 16
              }}>
                {team.img
                  ? <img src={team.img} alt={team.name} style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid var(--glass-border)" }} onError={e => e.target.style.display = "none"} />
                  : <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "var(--primary-light)" }}>{team.shortname}</div>
                }
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{team.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{team.shortname}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN MATCH DETAIL PAGE
───────────────────────────────────────────── */
export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("scorecard");

  const { data: infoData, isLoading, error } = useQuery({
    queryKey: ["matchInfo", id],
    queryFn: () => fetchMatchInfo(id),
    refetchInterval: 30000,
  });

  const match = infoData?.data;
  const isLive = match?.matchStarted && !match?.matchEnded;
  const matchEnded = match?.matchEnded;

  // Auto-select correct tab on load
  useEffect(() => {
    if (match) {
      if (isLive) setTab("scorecard");
      else if (matchEnded) setTab("scorecard");
      else setTab("info");
    }
  }, [match?.id]);

  if (isLoading) return (
    <div className="container" style={{ textAlign: "center", paddingTop: 120 }}>
      <div className="spinner" />
      <p style={{ color: "var(--text3)", marginTop: 20 }}>Loading match data from Cricbuzz...</p>
    </div>
  );

  if (error || !match) return (
    <div className="container" style={{ paddingTop: 60 }}>
      <div className="card glass" style={{ textAlign: "center", padding: 60, borderColor: "var(--error)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏏</div>
        <h2 style={{ color: "var(--error)", marginBottom: 12 }}>Match Not Found</h2>
        <p style={{ color: "var(--text3)" }}>Unable to retrieve data for match #{id}. {error?.message}</p>
        <button onClick={() => navigate("/")} className="btn btn-primary" style={{ marginTop: 24 }}>← Back to Dashboard</button>
      </div>
    </div>
  );

  const tabs = [
    { id: "scorecard", label: "📊 Scorecard" },
    { id: "commentary", label: "🎙️ Commentary" },
    { id: "info", label: "ℹ️ Match Info" },
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 80, paddingTop: 20 }}>
      <SEO
        title={`${match.name} Live Score, Scorecard & Commentary | LiveCricketZone`}
        description={`${match.name} live score, full scorecard, ball-by-ball commentary, and match analysis. ${match.status}`}
        url={`/match/${id}`}
        type="article"
        keywords={`${match.name}, live cricket score, scorecard, commentary`}
      />

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)",
          color: "var(--text2)", borderRadius: 10, padding: "8px 18px",
          fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 24, transition: "0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
      >
        ← Back
      </button>

      {/* ── HERO MATCH HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(26,31,53,0.95) 0%, rgba(17,24,39,0.95) 100%)",
        border: "1px solid var(--glass-border)",
        borderRadius: 24, padding: "36px 40px", marginBottom: 28,
        position: "relative", overflow: "hidden",
        backdropFilter: "blur(12px)"
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: -80, right: -80, width: 300, height: 300,
          background: isLive
            ? "radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(30,64,175,0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        {/* Series + Status row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
                {match.matchType}
              </span>
              {match.venue && (
                <>
                  <span style={{ width: 1, height: 12, background: "var(--divider)" }} />
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>📍 {match.venue}</span>
                </>
              )}
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 0, color: "var(--text)", letterSpacing: -0.5 }}>
              {match.name}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {isLive && (
              <span className="badge badge-live">🔴 LIVE</span>
            )}
            {matchEnded && (
              <span className="badge badge-completed">✅ FINAL</span>
            )}
            {!isLive && !matchEnded && (
              <span className="badge badge-upcoming">📅 UPCOMING</span>
            )}
          </div>
        </div>

        {/* Team Scores vs Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 20, alignItems: "center" }}>
          {/* Team 1 */}
          {match.teamInfo?.slice(0, 1).map((team, idx) => {
            const teamScore = match.score?.find(s =>
              s.inning?.toLowerCase().includes(team.name?.toLowerCase()) ||
              s.inning?.toLowerCase().includes(team.shortname?.toLowerCase())
            );
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {team.img
                  ? <img src={team.img} alt={team.name} style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)" }} onError={e => e.target.style.display = "none"} />
                  : <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16 }}>{team.shortname}</div>
                }
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 2 }}>{team.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{team.shortname}</div>
                  {teamScore && (
                    <div style={{ fontSize: 22, fontWeight: 900, color: isLive ? "var(--primary-light)" : "var(--text)", marginTop: 4 }}>
                      {teamScore.r}/{teamScore.w}
                      <span style={{ fontSize: 13, color: "var(--text3)", fontWeight: 600, marginLeft: 6 }}>({teamScore.o} ov)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* VS divider */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 14, fontWeight: 900, color: "var(--text3)",
              padding: "10px 20px", borderRadius: 12,
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)"
            }}>VS</div>
          </div>

          {/* Team 2 */}
          {match.teamInfo?.slice(1, 2).map((team, idx) => {
            const teamScore = match.score?.find(s =>
              s.inning?.toLowerCase().includes(team.name?.toLowerCase()) ||
              s.inning?.toLowerCase().includes(team.shortname?.toLowerCase())
            );
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16, flexDirection: "row-reverse", textAlign: "right" }}>
                {team.img
                  ? <img src={team.img} alt={team.name} style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)" }} onError={e => e.target.style.display = "none"} />
                  : <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--secondary), var(--secondary-dark))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16 }}>{team.shortname}</div>
                }
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 2 }}>{team.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{team.shortname}</div>
                  {teamScore && (
                    <div style={{ fontSize: 22, fontWeight: 900, color: isLive ? "var(--primary-light)" : "var(--text)", marginTop: 4 }}>
                      {teamScore.r}/{teamScore.w}
                      <span style={{ fontSize: 13, color: "var(--text3)", fontWeight: 600, marginLeft: 6 }}>({teamScore.o} ov)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status bar */}
        <div style={{
          marginTop: 24, padding: "14px 20px",
          background: isLive ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)",
          borderRadius: 12, border: `1px solid ${isLive ? "rgba(239,68,68,0.2)" : "var(--glass-border)"}`,
          display: "flex", alignItems: "center", gap: 12
        }}>
          {isLive && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary-light)", animation: "livePulse 2s infinite", display: "inline-block" }} />}
          <span style={{ fontSize: 14, fontWeight: 600, color: isLive ? "var(--primary-light)" : "var(--text2)" }}>
            {match.status || "Match scheduled"}
          </span>
          {match.tossWinner && (
            <>
              <span style={{ color: "var(--divider)" }}>·</span>
              <span style={{ fontSize: 13, color: "var(--text3)" }}>
                🪙 {match.tossWinner} won toss, chose to {match.tossChoice}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: "2px solid var(--glass-border)" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            onClick={() => setTab(t.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 28px", fontSize: 14, fontWeight: 700,
              color: tab === t.id ? "var(--primary-light)" : "var(--text3)",
              position: "relative", transition: "color 0.2s",
              borderBottom: tab === t.id ? "2px solid var(--primary-light)" : "2px solid transparent",
              marginBottom: -2, letterSpacing: 0.2,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div>
        {tab === "scorecard" && <ScorecardTab matchId={id} />}
        {tab === "commentary" && <CommentaryTab matchId={id} />}
        {tab === "info" && <MatchInfoTab match={match} />}
      </div>
    </div>
  );
}
