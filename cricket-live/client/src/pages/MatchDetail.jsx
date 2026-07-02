import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMatchInfo, fetchMatchScorecard, fetchMatchCommentary, fetchMatchLiveData, fetchMatchSquad, fetchMatchAnalysis, fetchMatchH2H } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import WatchSection from "../components/WatchSection";
import StreamDisclaimer from "../components/StreamDisclaimer";
import { trackMatchView, trackTabSwitch } from "../utils/analytics";

/* ── Analysis Tab ── */
function AnalysisTab({ matchId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["analysis", matchId],
    queryFn: () => fetchMatchAnalysis(matchId),
  });
  const analysis = data?.data;

  if (isLoading) return <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}><div className="spinner" /></div>;
  if (!analysis) return (
    <div style={{ padding: "60px 0", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
      <p style={{ color: "var(--text3)" }}>No detailed analysis available for this match yet.</p>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 32px" }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", marginBottom: 20, lineHeight: 1.3 }}>{analysis.title}</h2>
      <div style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
        {analysis.content}
      </div>
      <div style={{ marginTop: 24, padding: "16px", borderRadius: 12, background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", fontSize: 13, color: "var(--text3)" }}>
        <strong>Note:</strong> This analysis is retrieved from live editorial feeds and professional match reporting services.
      </div>
    </div>
  );
}

function eventColor(event) {
  if (!event) return "var(--text3)";
  if (event === "SIX")    return "#38BDF8";
  if (event === "FOUR")   return "#3B82F6";
  if (event === "WICKET") return "#F87171";
  if (event === "WIDE" || event === "NO_BALL") return "#A78BFA";
  return "var(--text3)";
}
function eventBg(event) {
  if (event === "SIX")    return "rgba(56,189,248,0.1)";
  if (event === "FOUR")   return "rgba(34,197,94,0.1)";
  if (event === "WICKET") return "rgba(248,113,113,0.1)";
  return "transparent";
}
function eventEmoji(event) {
  if (event === "SIX")    return "6";
  if (event === "FOUR")   return "4";
  if (event === "WICKET") return "W";
  if (event === "WIDE")   return "Wd";
  if (event === "NO_BALL") return "Nb";
  return "";
}

/* ── Ball-by-ball mini strip for current over ── */
function BallStrip({ commentary }) {
  const currentOver = commentary?.find(c => c.over !== "" && c.over !== undefined);
  if (!currentOver) return null;
  const overNum = currentOver.over;
  const balls = commentary
    .filter(c => c.over === overNum)
    .slice(0, 6)
    .reverse();
  if (!balls.length) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0 0" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap" }}>Over {overNum}:</span>
      <div style={{ display: "flex", gap: 5 }}>
        {balls.map((b, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: "50%",
            background: eventBg(b.event) || "rgba(255,255,255,0.05)",
            border: `1.5px solid ${eventColor(b.event)}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 900, color: eventColor(b.event),
            flexShrink: 0,
          }}>
            {b.event && b.event !== "default" ? eventEmoji(b.event) : (b.runs ?? "·")}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Scorecard Tab ── */
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
      <p style={{ color: "var(--text3)", fontSize: 15 }}>Scorecard data is pending. Check back when the match starts.</p>
    </div>
  );

  const inn = innings[innIdx];

  return (
    <div className="animate-fade-in">
      {/* Innings selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {innings.map((inn, idx) => (
          <button
            key={idx}
            onClick={() => setInnIdx(idx)}
            style={{
              background: innIdx === idx ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
              color: innIdx === idx ? "#3B82F6" : "var(--text2)",
              border: `1.5px solid ${innIdx === idx ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 100, padding: "8px 18px", fontWeight: 700, fontSize: 13,
              cursor: "pointer", transition: "all 0.2s",
            }}
          >{inn.team}</button>
        ))}
      </div>

      {/* Innings header */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: "20px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700, marginBottom: 4 }}>
            {inn.team} — Innings {innIdx + 1}
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, color: "var(--text)", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
            {inn.score}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 4 }}>Extras</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text2)" }}>{inn.extras || "0"}</div>
        </div>
      </div>

      {/* Batting table */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10, paddingLeft: 4 }}>Batting</div>
        <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border)" }}>
                {["Batsman", "Dismissal", "R", "B", "4s", "6s", "SR"].map(h => (
                  <th key={h} style={{ padding: "13px 16px", textAlign: h === "Batsman" || h === "Dismissal" ? "left" : "right", fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inn.batsmen?.map((b, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: i < inn.batsmen.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {b.name}
                      {b.dismissal === "not out" && (
                        <span style={{ fontSize: 10, color: "#3B82F6", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", padding: "2px 7px", borderRadius: 20, fontWeight: 800 }}>NOT OUT</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text3)", maxWidth: 200 }}>{b.dismissal}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 900, fontSize: 16, color: "var(--text)", fontFamily: "'Poppins',sans-serif" }}>{b.r}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text2)", fontWeight: 600 }}>{b.b}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "#3B82F6", fontWeight: 700 }}>{b.fours}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "#38BDF8", fontWeight: 700 }}>{b.sixes}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text2)", fontWeight: 600 }}>{b.sr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fall of Wickets */}
      {inn.fow && inn.fow.length > 0 && (
        <div style={{ marginBottom: 24, padding: "14px 18px", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 12, fontSize: 12, color: "var(--text2)" }}>
          <span style={{ fontWeight: 700, color: "#F87171", marginRight: 10 }}>Fall of Wickets:</span>
          <span style={{ lineHeight: 2 }}>{inn.fow.join("  •  ")}</span>
        </div>
      )}
      
      {/* Partnerships */}
      {inn.partnerships && inn.partnerships.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10, paddingLeft: 4 }}>Partnerships</div>
          <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border)" }}>
                  {["Batsmen", "Runs", "Balls"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: h === "Batsmen" ? "left" : "center", fontSize: 11, color: "var(--text3)", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inn.partnerships.map((p, i) => (
                  <tr key={i} style={{ borderBottom: i < inn.partnerships.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text2)" }}>{p.batsman1} & {p.batsman2}</td>
                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 900, color: "#3B82F6", textAlign: "center" }}>{p.runs}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text3)", textAlign: "center" }}>{p.balls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bowling table */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10, paddingLeft: 4 }}>Bowling</div>
        <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 460 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border)" }}>
                {["Bowler", "O", "M", "R", "W", "Econ"].map(h => (
                  <th key={h} style={{ padding: "13px 16px", textAlign: h === "Bowler" ? "left" : "right", fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inn.bowlers?.map((bw, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: i < inn.bowlers.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14 }}>{bw.name}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text2)", fontWeight: 600 }}>{bw.o}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text2)", fontWeight: 600 }}>{bw.m}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{bw.r}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 900, fontSize: 16, color: "#3B82F6", fontFamily: "'Poppins',sans-serif" }}>{bw.w}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, color: "var(--text2)" }}>{bw.eco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Commentary Tab ── */
function CommentaryTab({ matchId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["commentary", matchId],
    queryFn: () => fetchMatchCommentary(matchId),
    refetchInterval: 15000,
  });
  const commentary = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) return <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}><div className="spinner" /></div>;
  if (error) return <div style={{ padding: "60px 0", textAlign: "center" }}><p style={{ color: "var(--text3)" }}>Failed to load commentary.</p></div>;
  if (!commentary.length) return <div style={{ padding: "60px 0", textAlign: "center" }}><p style={{ color: "var(--text3)" }}>Commentary unavailable.</p></div>;

  return (
    <div className="animate-fade-in">
      {/* Current over strip */}
      <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#3B82F6", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Current Over</div>
        <BallStrip commentary={commentary} />
      </div>

      {/* Ball entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {commentary.slice(0, 100).map((c, i) => {
          if (c.overSeparator) {
            return (
              <div key={`sep-${i}`} style={{
                margin: "12px 0 6px", padding: "12px 20px", borderRadius: 14,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#3B82F6" }}>
                  End of Over {c.over}
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text2)" }}>
                  <span>Runs: <strong>{c.overSeparator.runs}</strong></span>
                  <span>Wkts: <strong>{c.overSeparator.wickets}</strong></span>
                  <span style={{ color: "var(--text3)" }}>{c.overSeparator.o_summary}</span>
                </div>
              </div>
            );
          }

          const isKey = c.event === "SIX" || c.event === "FOUR" || c.event === "WICKET";
          return (
            <div
              key={i}
              style={{
                display: "flex", gap: 14, padding: isKey ? "14px 16px" : "12px 16px",
                background: isKey ? eventBg(c.event) : "var(--card)",
                borderRadius: 12,
                border: `1px solid ${isKey ? `${eventColor(c.event)}30` : "var(--border)"}`,
                borderLeft: `3px solid ${eventColor(c.event)}`,
              }}
            >
              <div style={{ minWidth: 52, textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: eventColor(c.event), lineHeight: 1 }}>
                  {c.over !== "" && c.over !== undefined ? `${c.over}.${c.ball}` : "—"}
                </div>
                {c.event && c.event !== "default" && (
                  <div style={{
                    marginTop: 4, fontSize: 10, fontWeight: 900, color: "#000",
                    background: eventColor(c.event),
                    padding: "2px 5px", borderRadius: 4, display: "inline-block",
                  }}>{eventEmoji(c.event)}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                {c.batsmanStriker && (
                  <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginRight: 8 }}>{c.batsmanStriker}</span>
                )}
                <span style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{c.text || "—"}</span>
              </div>
              {c.runs !== undefined && (
                <div style={{
                  minWidth: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: eventBg(c.event) || "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${eventColor(c.event)}40`,
                  color: eventColor(c.event), fontSize: 14, fontWeight: 900,
                }}>
                  {c.runs}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Match Info Tab ── */
function MatchInfoTab({ match }) {
  const infoRows = [
    { label: "Match",    value: match.name },
    { label: "Series",   value: match.series || match.matchType },
    { label: "Format",   value: match.matchType },
    { label: "Venue",    value: match.venue || "TBA" },
    { label: "Date",     value: match.date || "TBA" },
    { label: "Toss",     value: match.tossWinner ? `${match.tossWinner} won · elected to ${match.tossChoice}` : "TBA" },
    { label: "Status",   value: match.status || "Scheduled" },
    { label: "Umpires",  value: match.umpire || null },
    { label: "TV Umpire", value: match.tvUmpire || null },
    { label: "Referee",  value: match.referee || null },
  ].filter(r => r.value);

  return (
    <div className="animate-fade-in">
      <div style={{ borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden" }}>
        {infoRows.map((row, i) => (
          <div
            key={i}
            style={{ display: "flex", padding: "16px 20px", borderBottom: i < infoRows.length - 1 ? "1px solid var(--border)" : "none", alignItems: "flex-start", transition: "background 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ minWidth: 140, fontSize: 12, fontWeight: 700, color: "var(--text3)", paddingTop: 1 }}>{row.label}</div>
            <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500, flex: 1 }}>{row.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <H2HSection matchId={match.id} />
      </div>
    </div>
  );
}

function H2HSection({ matchId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["h2h", matchId],
    queryFn: () => fetchMatchH2H(matchId),
  });
  const h2h = data?.data || [];

  if (isLoading || !h2h.length) return null;

  return (
    <div style={{ padding: "20px 24px", borderRadius: 18, background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.12)", marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#38BDF8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Head to Head (Last 5)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {h2h.map((itm, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < h2h.length - 1 ? "1px solid rgba(56,189,248,0.1)" : "none", paddingBottom: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{itm.result}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{itm.series} • {itm.date}</div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)" }}>H2H</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ── */
/* ── Live Data Panel ── */
function LiveDataPanel({ matchId, isLive }) {
  const { data } = useQuery({
    queryKey: ["liveData", matchId],
    queryFn: () => fetchMatchLiveData(matchId),
    refetchInterval: 10000,
    enabled: !!isLive,
  });
  const ld = data?.data;
  const ms = ld?.miniscore;
  if (!ms || !isLive) return null;

  return (
    <div style={{ marginBottom: 16, padding: "16px 20px", borderRadius: 14, background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.18)" }}>
      <div style={{ fontSize: 10, fontWeight: 900, color: "#3B82F6", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
        🟢 Live Match Situation
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {/* Batting */}
        <div>
          <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Batting</div>
          {[ms.batsman1, ms.batsman2].filter(b => b?.name).map((b, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderRadius: 8, marginBottom: 4, background: b.isStriker ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${b.isStriker ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)"}` }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: b.isStriker ? "#3B82F6" : "var(--text2)" }}>
                {b.name}{b.isStriker ? " *" : ""}
              </span>
              <span style={{ fontSize: 12, fontWeight: 900, color: "var(--text)" }}>{b.runs} <span style={{ fontSize: 10, color: "var(--text3)" }}>({b.balls}) SR:{b.sr}</span></span>
            </div>
          ))}
        </div>
        {/* Bowling */}
        <div>
          <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Bowling</div>
          {[ms.bowler, ms.bowler2].filter(b => b?.name).map((b, i) => (
            <div key={i} style={{ padding: "6px 10px", borderRadius: 8, marginBottom: 4, background: i === 0 ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)"}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? "#fb7185" : "var(--text2)" }}>{b.name}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{b.overs}-{b.maidens}-{b.runs}-{b.wickets} | Econ: {b.economy}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {ms.partnership?.balls > 0 && (
          <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", fontSize: 11, color: "#38BDF8", fontWeight: 700 }}>
            Partnership: {ms.partnership.runs}({ms.partnership.balls})
          </div>
        )}
        {ms.currentRunRate && (
          <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>
            CRR: {ms.currentRunRate}
          </div>
        )}
        {ms.requiredRunRate && (
          <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", fontSize: 11, color: "#f87171", fontWeight: 700 }}>
            RRR: {ms.requiredRunRate}
          </div>
        )}
        {ms.target && (
          <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", fontSize: 11, color: "#a78bfa", fontWeight: 700 }}>
            Target: {ms.target}
            {ms.remRuns != null ? ` | Need ${ms.remRuns}` : ""}
          </div>
        )}
      </div>

      {ms.recentOvers && (
        <div style={{ fontSize: 11, color: "var(--text3)" }}>
          <span style={{ fontWeight: 700, marginRight: 6 }}>Recent:</span>
          {ms.recentOvers}
        </div>
      )}
      {ms.lastWicket && (
        <div style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}>
          <span style={{ fontWeight: 700, marginRight: 6 }}>Last wicket:</span>
          {ms.lastWicket}
        </div>
      )}
    </div>
  );
}

/* ── Squad Tab ── */
function SquadTab({ matchId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["squad", matchId],
    queryFn: () => fetchMatchSquad(matchId),
  });
  const squad = data?.data || {};
  const teams = Object.entries(squad);

  if (isLoading) return <div style={{ padding: "40px 0", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;
  if (!teams.length) return <div style={{ padding: "40px 0", textAlign: "center" }}><p style={{ color: "var(--text3)" }}>Squad not yet announced.</p></div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {teams.map(([teamName, players]) => (
          <div key={teamName} style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "rgba(34,197,94,0.07)", borderBottom: "1px solid rgba(34,197,94,0.15)", fontWeight: 800, fontSize: 14, color: "#3B82F6" }}>
              {teamName}
            </div>
            <div>
              {players.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: i < players.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#3B82F6", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                      {p.name}
                      {p.isCaptain  && <span style={{ fontSize: 9, background: "#38BDF8", color: "#000", padding: "1px 5px", borderRadius: 3, fontWeight: 900 }}>C</span>}
                      {p.isVCaptain && <span style={{ fontSize: 9, background: "rgba(56,189,248,0.3)", color: "#38BDF8", padding: "1px 5px", borderRadius: 3, fontWeight: 900 }}>VC</span>}
                      {p.isWk       && <span style={{ fontSize: 9, background: "rgba(56,189,248,0.2)", color: "#38bdf8", padding: "1px 5px", borderRadius: 3, fontWeight: 900 }}>WK</span>}
                    </div>
                    {p.role && <div style={{ fontSize: 11, color: "var(--text3)" }}>{p.role}</div>}
                  </div>
                  {!p.isPlayingXI && <span style={{ fontSize: 9, color: "var(--text3)", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 4 }}>Sub</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MatchDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [tab, setTab] = useState("scorecard");

  const { data: infoData, isLoading } = useQuery({
    queryKey: ["matchInfo", id],
    queryFn: () => fetchMatchInfo(id),
    refetchInterval: 30000,
  });
  const { data: commentaryData } = useQuery({
    queryKey: ["commentary", id],
    queryFn: () => fetchMatchCommentary(id),
    refetchInterval: 15000,
    enabled: !!id,
  });

  const match       = infoData?.data;
  const isLive      = match?.matchStarted && !match?.matchEnded;
  const matchEnded  = match?.matchEnded;
  const commentary  = Array.isArray(commentaryData?.data) ? commentaryData.data : [];

  useEffect(() => {
    if (match) {
      if (isLive || matchEnded) setTab("scorecard"); else setTab("info");
      trackMatchView(id, match.name, isLive);
    }
  }, [match?.id]);

  if (isLoading) return (
    <div className="container" style={{ textAlign: "center", paddingTop: 120 }}>
      <div className="spinner" />
    </div>
  );
  if (!match) return (
    <div className="container" style={{ paddingTop: 60 }}>
      <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <p style={{ color: "var(--text3)", fontSize: 15 }}>Match not found.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: 16, padding: "9px 22px", borderRadius: 100, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#3B82F6", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>← Back to Home</button>
      </div>
    </div>
  );

  const t1     = match.teamInfo?.[0];
  const t2     = match.teamInfo?.[1];
  const scores = match.score || [];

  const getTeamScore = (team) =>
    scores.find(s =>
      s.inning?.toLowerCase().includes(team?.name?.toLowerCase()) ||
      s.inning?.toLowerCase().includes(team?.shortname?.toLowerCase())
    );

  const s1 = getTeamScore(t1) || scores[0];
  const s2 = getTeamScore(t2) || scores[1];

  const isIPL = match.series?.toLowerCase().includes("ipl") || match.name?.toLowerCase().includes("ipl");

  /* gradient based on match state */
  const heroBg = isLive
    ? "linear-gradient(160deg, rgba(22,163,74,0.14) 0%, rgba(9,9,11,1) 55%)"
    : matchEnded
      ? "linear-gradient(160deg, rgba(34,197,94,0.08) 0%, rgba(9,9,11,1) 55%)"
      : "linear-gradient(160deg, rgba(56,189,248,0.08) 0%, rgba(9,9,11,1) 55%)";

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 80px" }}>
      <SEO
        title={`${match.name} — Live Score, Scorecard & Commentary`}
        description={`${match.name} live score, full scorecard and ball-by-ball commentary. ${match.status || ""}`}
        url={`/match/${id}`}
      />

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: "var(--text3)", padding: "16px 0 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "color 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#3B82F6"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; }}
      >
        ← Back
      </button>

      {/* ── HERO ── */}
      <div style={{
        background: heroBg,
        border: `1px solid ${isLive ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 24, padding: "28px 32px", marginBottom: 20,
        position: "relative", overflow: "hidden",
        boxShadow: isLive ? "0 0 60px rgba(34,197,94,0.08)" : "none",
      }}>
        {/* Decorative */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "repeating-linear-gradient(90deg, #3B82F6 0 1px, transparent 1px 60px)", pointerEvents: "none" }} />

        {/* Status row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {isLive && (
              <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)", color: "#3B82F6", padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", animation: "livePulse 1.8s infinite" }} />
                LIVE
              </span>
            )}
            {matchEnded && (
              <span style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "#60A5FA", padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>
                FINAL
              </span>
            )}
            {!isLive && !matchEnded && (
              <span style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8", padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>
                UPCOMING
              </span>
            )}
            <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{match.matchType}</span>
            {match.venue && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>• {match.venue}</span>}
          </div>

          {isLive && (
            <button
              onClick={() => navigate(`/match/${id}?watch=1`)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)",
                color: "#F87171", borderRadius: 100, padding: "8px 18px",
                fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.24)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.color = "#F87171"; }}
            >
              ▶ Highlights
            </button>
          )}
        </div>

        {/* Series name */}
        <div style={{ fontSize: 12, fontWeight: 600, color: isIPL ? "#38BDF8" : "var(--text3)", marginBottom: 16, position: "relative" }}>
          {match.series || match.name}
        </div>

        {/* Teams & Scores */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", position: "relative" }}>

          {/* Team 1 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {t1?.img
              ? <img src={t1.img} alt={t1.name} style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid rgba(34,197,94,0.3)", objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
              : <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#3B82F6", flexShrink: 0 }}>
                  {t1?.shortname?.slice(0, 2) || "?"}
                </div>
            }
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", lineHeight: 1.2 }}>{t1?.name || t1?.shortname || "Team 1"}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{t1?.shortname}</div>
              {s1 ? (
                <div style={{ fontFamily: "'Poppins',sans-serif" }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: isLive ? "#3B82F6" : "var(--text)", lineHeight: 1 }}>{s1.r}/{s1.w}</span>
                  <span style={{ fontSize: 13, color: "var(--text3)", fontWeight: 500, marginLeft: 8 }}>({s1.o} ov)</span>
                </div>
              ) : (
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>Yet to bat</span>
              )}
            </div>
          </div>

          {/* VS */}
          <div style={{
            padding: "10px 18px", borderRadius: 12,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            fontSize: 13, fontWeight: 900, color: "var(--text-muted)", textAlign: "center",
          }}>
            <div>VS</div>
            {isLive && <BallStrip commentary={commentary} />}
          </div>

          {/* Team 2 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexDirection: "row-reverse" }}>
            {t2?.img
              ? <img src={t2.img} alt={t2.name} style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid rgba(56,189,248,0.3)", objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
              : <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(56,189,248,0.1)", border: "2px solid rgba(56,189,248,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#38BDF8", flexShrink: 0 }}>
                  {t2?.shortname?.slice(0, 2) || "?"}
                </div>
            }
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", lineHeight: 1.2 }}>{t2?.name || t2?.shortname || "Team 2"}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{t2?.shortname}</div>
              {s2 ? (
                <div style={{ fontFamily: "'Poppins',sans-serif" }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: isLive ? "#3B82F6" : "var(--text)", lineHeight: 1 }}>{s2.r}/{s2.w}</span>
                  <span style={{ fontSize: 13, color: "var(--text3)", fontWeight: 500, marginLeft: 8 }}>({s2.o} ov)</span>
                </div>
              ) : (
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>Yet to bat</span>
              )}
            </div>
          </div>
        </div>

        {/* Match status banner */}
        <div style={{
          marginTop: 20, padding: "11px 16px", borderRadius: 12,
          background: isLive ? "rgba(34,197,94,0.07)" : matchEnded ? "rgba(74,222,128,0.05)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${isLive ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`,
          fontSize: 14, fontWeight: 600,
          color: isLive ? "#60A5FA" : matchEnded ? "#3B82F6" : "var(--text2)",
          display: "flex", alignItems: "center", gap: 8, position: "relative",
        }}>
          {isLive && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", animation: "livePulse 1.8s infinite", flexShrink: 0 }} />}
          {match.status || "Scheduled"}
        </div>

        {/* Toss */}
        {match.tossWinner && (
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)", paddingLeft: 4 }}>
            🪙 <strong style={{ color: "var(--text3)" }}>{match.tossWinner}</strong> won the toss · elected to <strong style={{ color: "var(--text3)" }}>{match.tossChoice}</strong>
          </div>
        )}
      </div>

      {/* Live data panel — current batsmen, bowler, partnership, RRR */}
      <LiveDataPanel matchId={id} isLive={isLive} />

      {/* Watch Section */}
      <WatchSection match={match} autoOpen={true} />
      <StreamDisclaimer />

      {/* Ad */}
      <div style={{ marginBottom: 20 }}><AdBanner type="leaderboard" /></div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 24, overflowX: "auto", scrollbarWidth: "none" }}>
        {[
          { id: "scorecard",   label: "Scorecard" },
          { id: "commentary",  label: "Commentary" },
          { id: "analysis",    label: "Analysis" },
          { id: "squad",       label: "Squad" },
          { id: "info",        label: "Match Info" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); trackTabSwitch(t.id, id); }}
            style={{
              flexShrink: 0, background: "transparent", border: "none", cursor: "pointer",
              padding: "14px 20px", fontSize: 13, fontWeight: tab === t.id ? 800 : 600,
              color: tab === t.id ? "#3B82F6" : "var(--text3)",
              borderBottom: tab === t.id ? "2.5px solid #3B82F6" : "2.5px solid transparent",
              marginBottom: -1, transition: "color 0.2s", fontFamily: "'Inter',sans-serif",
              whiteSpace: "nowrap",
            }}
          >{t.label}</button>
        ))}
      </div>

      {tab === "scorecard"  && <ScorecardTab matchId={id} />}
      {tab === "commentary" && <CommentaryTab matchId={id} />}
      {tab === "analysis"   && <AnalysisTab matchId={id} />}
      {tab === "squad"      && <SquadTab matchId={id} />}
      {tab === "info"       && <MatchInfoTab match={match} />}

      {/* Bottom ad */}
      <div style={{ marginTop: 32 }}><AdBanner type="auto" /></div>
    </div>
  );
}
