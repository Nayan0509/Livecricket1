import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMatchInfo, fetchMatchScorecard, fetchMatchCommentary, fetchMatchLiveData, fetchMatchSquad, fetchMatchH2H, fetchMatchFullInfo, fetchMatchOvers } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import WatchSection from "../components/WatchSection";
import StreamDisclaimer from "../components/StreamDisclaimer";
import { trackMatchView, trackTabSwitch } from "../utils/analytics";

/* ── Match numbers: figures the site works out from the live data ── */
const FORMAT_OVERS = { T20: 20, T20I: 20, ODI: 50, ODIS: 50 };

function ballsOf(oversStr) {
  const [o, b = "0"] = String(oversStr || 0).split(".");
  return Number(o) * 6 + Number(b);
}

function MatchNumbersTab({ matchId, match }) {
  const { data: liveRes, isLoading: l1 } = useQuery({ queryKey: ["livedata", matchId], queryFn: () => fetchMatchLiveData(matchId), refetchInterval: 15000 });
  const { data: oversRes, isLoading: l2 } = useQuery({ queryKey: ["overs", matchId], queryFn: () => fetchMatchOvers(matchId), refetchInterval: 30000 });
  const live = liveRes?.data;
  const overs = oversRes?.data || [];

  if (l1 || l2) return <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}><div className="spinner" /></div>;
  if (!live && !overs.length) return (
    <p style={{ padding: "40px 0", textAlign: "center", color: "var(--text3)" }}>Match numbers appear here once play is under way.</p>
  );

  const quota = FORMAT_OVERS[String(match?.matchType || "").toUpperCase()];
  const rows = [];
  if (live) {
    const crr = parseFloat(live.currentRunRate);
    if (crr > 0) rows.push(["Current run rate", crr.toFixed(2)]);
    if (live.target) {
      rows.push(["Target", live.target]);
      if (live.remRuns != null) rows.push(["Runs needed", live.remRuns]);
      if (live.remBalls != null) rows.push(["Balls left", live.remBalls]);
      if (parseFloat(live.requiredRunRate) > 0) rows.push(["Required run rate", parseFloat(live.requiredRunRate).toFixed(2)]);
    } else if (quota && crr > 0 && live.overs) {
      const ballsLeft = quota * 6 - ballsOf(live.overs);
      const current = overs.length ? Number(String(overs[overs.length - 1].score).split("/")[0]) : null;
      if (ballsLeft > 0 && current != null) rows.push(["Projected total at this run rate", Math.round(current + (crr * ballsLeft) / 6)]);
    }
    if (live.partnership?.runs != null) rows.push(["Current partnership", `${live.partnership.runs} (${live.partnership.balls} balls)`]);
  }
  if (overs.length) {
    const balls = overs.flatMap(o => o.summary.split(/\s+/).filter(Boolean));
    const last5 = overs.slice(-5);
    rows.push([`Runs in the last ${last5.length} overs`, last5.reduce((t, o) => t + o.runs, 0)]);
    rows.push([`Wickets in the last ${last5.length} overs`, last5.reduce((t, o) => t + o.wickets, 0)]);
    rows.push([`Fours / sixes in the last ${overs.length} overs`, `${balls.filter(b => b === "4").length} / ${balls.filter(b => b === "6").length}`]);
    rows.push([`Dot balls in the last ${overs.length} overs`, balls.filter(b => b === "0").length]);
  }

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 24px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} style={{ borderBottom: "1px solid var(--divider)" }}>
              <td style={{ padding: "10px 0", color: "var(--text2)" }}>{k}</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 700, color: "var(--text)" }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ margin: "14px 0 0", fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
        Worked out by Live Cricket Zone from the live score and the most recent overs. A projected total assumes the current run rate holds; it is arithmetic, not a prediction.
      </p>
    </div>
  );
}

function eventColor(event) {
  if (!event) return "var(--text3)";
  if (event === "SIX")    return "#0b63c4";
  if (event === "FOUR")   return "#0b7a55";
  if (event === "WICKET") return "#c81e28";
  if (event === "WIDE" || event === "NO_BALL") return "#0b7a55";
  return "var(--text3)";
}
function eventBg(event) {
  if (event === "SIX")    return "rgba(11,99,196,0.1)";
  if (event === "FOUR")   return "rgba(21,128,61,0.1)";
  if (event === "WICKET") return "rgba(209,32,42,0.1)";
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
            background: eventBg(b.event) || "rgba(15,23,42,0.05)",
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
      <div style={{ fontSize: 48, marginBottom: 16 }}></div>
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
              background: innIdx === idx ? "rgba(21,128,61,0.15)" : "rgba(15,23,42,0.04)",
              color: innIdx === idx ? "#0b7a55" : "var(--text2)",
              border: `1.5px solid ${innIdx === idx ? "rgba(21,128,61,0.4)" : "rgba(15,23,42,0.08)"}`,
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
              <tr style={{ background: "rgba(15,23,42,0.02)", borderBottom: "1px solid var(--border)" }}>
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
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,23,42,0.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {b.name}
                      {b.dismissal === "not out" && (
                        <span style={{ fontSize: 10, color: "#0b7a55", background: "rgba(21,128,61,0.12)", border: "1px solid rgba(21,128,61,0.25)", padding: "2px 7px", borderRadius: 20, fontWeight: 800 }}>NOT OUT</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text3)", maxWidth: 200 }}>{b.dismissal}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 900, fontSize: 16, color: "var(--text)", fontFamily: "'Poppins',sans-serif" }}>{b.r}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text2)", fontWeight: 600 }}>{b.b}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "#0b7a55", fontWeight: 700 }}>{b.fours}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "#0b63c4", fontWeight: 700 }}>{b.sixes}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text2)", fontWeight: 600 }}>{b.sr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fall of Wickets */}
      {inn.fow && inn.fow.length > 0 && (
        <div style={{ marginBottom: 24, padding: "14px 18px", background: "rgba(209,32,42,0.05)", border: "1px solid rgba(209,32,42,0.15)", borderRadius: 12, fontSize: 12, color: "var(--text2)" }}>
          <span style={{ fontWeight: 700, color: "#c81e28", marginRight: 10 }}>Fall of Wickets:</span>
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
                <tr style={{ background: "rgba(15,23,42,0.02)", borderBottom: "1px solid var(--border)" }}>
                  {["Batsmen", "Runs", "Balls"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: h === "Batsmen" ? "left" : "center", fontSize: 11, color: "var(--text3)", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inn.partnerships.map((p, i) => (
                  <tr key={i} style={{ borderBottom: i < inn.partnerships.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text2)" }}>{p.batsman1} & {p.batsman2}</td>
                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 900, color: "#0b7a55", textAlign: "center" }}>{p.runs}</td>
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
              <tr style={{ background: "rgba(15,23,42,0.02)", borderBottom: "1px solid var(--border)" }}>
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
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,23,42,0.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14 }}>{bw.name}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text2)", fontWeight: 600 }}>{bw.o}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text2)", fontWeight: 600 }}>{bw.m}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{bw.r}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 900, fontSize: 16, color: "#0b7a55", fontFamily: "'Poppins',sans-serif" }}>{bw.w}</td>
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
      <div style={{ background: "rgba(21,128,61,0.04)", border: "1px solid rgba(21,128,61,0.12)", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#0b7a55", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Current Over</div>
        <BallStrip commentary={commentary} />
      </div>

      {/* Ball entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {commentary.slice(0, 100).map((c, i) => {
          if (c.overSeparator) {
            return (
              <div key={`sep-${i}`} style={{
                margin: "12px 0 6px", padding: "12px 20px", borderRadius: 14,
                background: "var(--card)", border: "1px solid rgba(15,23,42,0.08)",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0b7a55" }}>
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
                  background: eventBg(c.event) || "rgba(15,23,42,0.04)",
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
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,23,42,0.02)"; }}
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

// Head-to-head between the two sides in this format, computed from Cricsheet's
// open ball-by-ball data (api/cricsheet.js). Internationals only.
function H2HSection({ matchId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["h2h", matchId],
    queryFn: () => fetchMatchH2H(matchId),
    staleTime: 3600000,
  });
  const h = data?.data;
  if (isLoading || !h || !h.matches) return null;

  const fmt = { test: "Tests", odi: "ODIs", t20i: "T20 internationals" }[h.format] || "matches";
  const others = [h.draws ? `${h.draws} drawn` : "", h.ties ? `${h.ties} tied` : "", h.noResults ? `${h.noResults} no result` : ""].filter(Boolean).join(", ");

  return (
    <section style={{ padding: "18px 22px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)", marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", margin: "0 0 6px" }}>Head to head in {fmt}</h3>
      <p style={{ fontSize: 14, color: "var(--text2)", margin: "0 0 12px" }}>
        {h.matches} {h.matches === 1 ? "match" : "matches"} since {h.firstDate.slice(0, 4)}: <strong>{h.teamA.name} {h.teamA.wins}</strong>, <strong>{h.teamB.name} {h.teamB.wins}</strong>{others ? `, ${others}` : ""}.
      </p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {h.last5.map(r => (
          <li key={r.matchId || r.date} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderTop: "1px solid var(--divider)", fontSize: 13 }}>
            <span style={{ color: "var(--text)", fontWeight: 600 }}>{r.result}</span>
            <span style={{ color: "var(--text3)", textAlign: "right" }}>{r.venue} · {r.date}</span>
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6, margin: "10px 0 0" }}>{h.attribution}</p>
    </section>
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
    <div style={{ marginBottom: 16, padding: "16px 20px", borderRadius: 14, background: "rgba(21,128,61,0.05)", border: "1px solid rgba(21,128,61,0.18)" }}>
      <div style={{ fontSize: 10, fontWeight: 900, color: "#0b7a55", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
        Live Match Situation
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {/* Batting */}
        <div>
          <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Batting</div>
          {[ms.batsman1, ms.batsman2].filter(b => b?.name).map((b, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderRadius: 8, marginBottom: 4, background: b.isStriker ? "rgba(21,128,61,0.08)" : "rgba(15,23,42,0.03)", border: `1px solid ${b.isStriker ? "rgba(21,128,61,0.2)" : "rgba(15,23,42,0.05)"}` }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: b.isStriker ? "#0b7a55" : "var(--text2)" }}>
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
            <div key={i} style={{ padding: "6px 10px", borderRadius: 8, marginBottom: 4, background: i === 0 ? "rgba(209,32,42,0.06)" : "rgba(15,23,42,0.03)", border: `1px solid ${i === 0 ? "rgba(209,32,42,0.15)" : "rgba(15,23,42,0.05)"}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? "#c81e28" : "var(--text2)" }}>{b.name}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{b.overs}-{b.maidens}-{b.runs}-{b.wickets} | Econ: {b.economy}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {ms.partnership?.balls > 0 && (
          <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(11,99,196,0.1)", border: "1px solid rgba(11,99,196,0.2)", fontSize: 11, color: "#0b63c4", fontWeight: 700 }}>
            Partnership: {ms.partnership.runs}({ms.partnership.balls})
          </div>
        )}
        {ms.currentRunRate && (
          <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(11,99,196,0.1)", border: "1px solid rgba(11,99,196,0.2)", fontSize: 11, color: "#0b63c4", fontWeight: 700 }}>
            CRR: {ms.currentRunRate}
          </div>
        )}
        {ms.requiredRunRate && (
          <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(209,32,42,0.1)", border: "1px solid rgba(209,32,42,0.2)", fontSize: 11, color: "#c81e28", fontWeight: 700 }}>
            RRR: {ms.requiredRunRate}
          </div>
        )}
        {ms.target && (
          <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", fontSize: 11, color: "#0b7a55", fontWeight: 700 }}>
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
        <div style={{ fontSize: 11, color: "#c81e28", marginTop: 4 }}>
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
          <div key={teamName} style={{ borderRadius: 14, border: "1px solid rgba(15,23,42,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", background: "rgba(21,128,61,0.07)", borderBottom: "1px solid rgba(21,128,61,0.15)", fontWeight: 800, fontSize: 14, color: "#0b7a55" }}>
              {teamName}
            </div>
            <div>
              {players.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: i < players.length - 1 ? "1px solid rgba(15,23,42,0.04)" : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(21,128,61,0.1)", border: "1px solid rgba(21,128,61,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#0b7a55", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                      {p.name}
                      {p.isCaptain  && <span style={{ fontSize: 9, background: "#0b63c4", color: "#fff", padding: "1px 5px", borderRadius: 3, fontWeight: 900 }}>C</span>}
                      {p.isVCaptain && <span style={{ fontSize: 9, background: "rgba(11,99,196,0.3)", color: "#0b63c4", padding: "1px 5px", borderRadius: 3, fontWeight: 900 }}>VC</span>}
                      {p.isWk       && <span style={{ fontSize: 9, background: "rgba(11,99,196,0.2)", color: "#0b63c4", padding: "1px 5px", borderRadius: 3, fontWeight: 900 }}>WK</span>}
                    </div>
                    {p.role && <div style={{ fontSize: 11, color: "var(--text3)" }}>{p.role}</div>}
                  </div>
                  {!p.isPlayingXI && <span style={{ fontSize: 9, color: "var(--text3)", background: "rgba(15,23,42,0.05)", padding: "2px 6px", borderRadius: 4 }}>Sub</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Over Summary Tab ── */
function OverSummaryTab({ matchId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["overs", matchId],
    queryFn: () => fetchMatchOvers(matchId),
    refetchInterval: 30000,
  });
  const overs = data?.data || [];

  if (isLoading) return <div style={{ padding: "40px 0", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto" }} /></div>;
  if (!overs.length) return (
    <div style={{ padding: "50px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}></div>
      <p style={{ color: "var(--text3)", fontSize: 14 }}>Over summary not available yet. Check back once the match begins.</p>
    </div>
  );

  const runColors = (runs) => {
    if (runs >= 18) return "#d1202a";
    if (runs >= 12) return "#c2410c";
    if (runs >= 8) return "#b45309";
    if (runs <= 3) return "#0b63c4";
    return "var(--text2)";
  };

  return (
    <div className="animate-fade-in">
      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>The last {overs.length} over{overs.length !== 1 ? "s" : ""} bowled, newest first.</div>
      <div style={{ height: 180, marginBottom: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 8px 4px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={overs.map(o => ({ over: `${o.batTeam ? o.batTeam + " " : ""}${o.overNum}`, runs: o.runs, wickets: o.wickets }))}>
            <XAxis dataKey="over" tick={{ fontSize: 11, fill: "var(--text3)" }} />
            <YAxis allowDecimals={false} width={28} tick={{ fontSize: 11, fill: "var(--text3)" }} />
            <Tooltip formatter={(v, n) => [v, n === "runs" ? "Runs" : n]} />
            <Bar dataKey="runs" fill="#0b7a55" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
        {[...overs].reverse().map((ov, i) => (
          <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", borderLeft: `3px solid ${runColors(ov.runs)}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5 }}>Over {ov.overNum}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: runColors(ov.runs), fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{ov.runs} run{ov.runs === 1 ? "" : "s"}</span>
                {ov.wickets > 0 && <span style={{ fontSize: 12, fontWeight: 800, color: "#c81e28", background: "rgba(209,32,42,0.1)", padding: "1px 7px", borderRadius: 10 }}>{ov.wickets}W</span>}
              </div>
            </div>
            {ov.summary && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
              {ov.summary.split(" ").map((ball, bi) => {
                const isWicket = ball === "W" || ball === "W!";
                const isFour = ball === "4";
                const isSix = ball === "6";
                const isExtra = ball.startsWith("wd") || ball.startsWith("nb") || ball === "Wd" || ball === "Nb";
                const bg = isWicket ? "#d1202a" : isSix ? "#0b63c4" : isFour ? "#0b7a55" : isExtra ? "#0b7a55" : "rgba(15,23,42,0.08)";
                const color = isWicket || isSix || isFour || isExtra ? "#fff" : "var(--text2)";
                return (
                  <span key={bi} style={{ width: 26, height: 26, borderRadius: "50%", background: bg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color, flexShrink: 0 }}>
                    {ball}
                  </span>
                );
              })}
            </div>}
            <div style={{ fontSize: 11, color: "var(--text3)" }}>
              {ov.batStriker && <span>{ov.batStriker}</span>}
              {ov.batStriker && ov.bowlStriker && <span style={{ margin: "0 6px" }}>→</span>}
              {ov.bowlStriker && <span>{ov.bowlStriker}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── This ground's record in the format (Cricsheet data) ── */
function VenueRecord({ v }) {
  const fmt = { test: "Tests", odi: "ODIs", t20i: "T20 internationals" }[v.format] || "matches";
  const decided = (v.batFirstWins || 0) + (v.batSecondWins || 0);
  return (
    <section style={{ marginBottom: 16, padding: "14px 18px", borderRadius: 8, background: "var(--card)", border: "1px solid var(--border)" }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", margin: "0 0 8px" }}>{v.name} in {fmt}</h3>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text2)", lineHeight: 1.8 }}>
        <li>{v.matches} {v.matches === 1 ? "match" : "matches"} since {String(v.firstDate).slice(0, 4)}</li>
        {v.avgFirstInnings ? <li>Average first-innings score: {v.avgFirstInnings} (from {v.firstInningsSample} innings)</li> : null}
        {decided > 0 && <li>Won batting first {v.batFirstWins}, won chasing {v.batSecondWins}</li>}
        {v.highestTotal && <li>Highest total: {v.highestTotal.score} by {v.highestTotal.team} v {v.highestTotal.opponent} ({v.highestTotal.date})</li>}
      </ul>
      <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6, margin: "8px 0 0" }}>{v.attribution}</p>
    </section>
  );
}

/* ── Enhanced Match Info Tab ── */
function EnhancedMatchInfoTab({ matchId, match }) {
  const { data, isLoading } = useQuery({
    queryKey: ["matchFullInfo", matchId],
    queryFn: () => fetchMatchFullInfo(matchId),
  });
  const info = data?.data;

  const toss = info?.toss || (match.tossWinner ? { winner: match.tossWinner, decision: match.tossChoice, text: `${match.tossWinner} won the toss and elected to ${match.tossChoice}` } : null);
  const umpires = info?.umpires || [
    match.umpire ? { name: match.umpire, type: "Umpires" } : null,
    match.tvUmpire ? { name: match.tvUmpire, type: "TV Umpire" } : null,
    match.referee ? { name: match.referee, type: "Match Referee" } : null,
  ].filter(Boolean);
  const venue = info?.venue || { fullName: match.venue || "TBA" };
  const date = info?.date ? new Date(info.date).toLocaleString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }) : match.date;

  const infoRows = [
    { label: "Series", value: info?.series || match.series || match.matchType, icon: "" },
    { label: "Match Format", value: info?.matchType || match.matchType, icon: "" },
    { label: "Match No.", value: info?.matchNumber || match.matchType, icon: "#️⃣" },
    { label: "Venue", value: venue.fullName || "TBA", icon: "" },
    { label: "Date & Time", value: date || "TBA", icon: "" },
    { label: "Toss", value: toss?.text || "TBA", icon: "" },
    { label: "Status", value: info?.status || match.status || "Scheduled", icon: "" },
  ].filter(r => r.value && r.value !== "TBA");

  return (
    <div className="animate-fade-in">
      {isLoading && (
        <div style={{ padding: "20px 0", textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto", width: 24, height: 24 }} /></div>
      )}

      {info?.venueRecord && <VenueRecord v={info.venueRecord} />}

      {/* Toss Banner */}
      {toss?.text && (
        <div style={{ marginBottom: 16, padding: "14px 18px", borderRadius: 12, background: "rgba(180,83,9,0.08)", border: "1px solid rgba(180,83,9,0.2)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}></span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#b45309", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Toss</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{toss.text}</div>
          </div>
        </div>
      )}

      {/* Info Table */}
      <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden", marginBottom: 16 }}>
        {infoRows.map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 18px", borderBottom: i < infoRows.length - 1 ? "1px solid var(--divider)" : "none", transition: "background 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,23,42,0.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <span style={{ fontSize: 16, marginRight: 12, flexShrink: 0 }}>{row.icon}</span>
            <div style={{ minWidth: 130, fontSize: 12, fontWeight: 700, color: "var(--text3)" }}>{row.label}</div>
            <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500, flex: 1 }}>{row.value}</div>
          </div>
        ))}
      </div>

      {/* Umpires */}
      {umpires.length > 0 && (
        <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--divider)", fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 3, height: 14, borderRadius: 2, background: "#0b7a55", display: "inline-block" }} />
            Officials
          </div>
          {umpires.map((u, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 18px", borderBottom: i < umpires.length - 1 ? "1px solid var(--divider)" : "none" }}>
              <div style={{ minWidth: 130, fontSize: 12, fontWeight: 700, color: "var(--text3)" }}>{u.type}</div>
              <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>{u.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* Venue Details */}
      {(venue.city || venue.country || venue.capacity) && (
        <div style={{ borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--divider)", fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 3, height: 14, borderRadius: 2, background: "#047857", display: "inline-block" }} />
            Venue Details
          </div>
          {[venue.city && ["City", venue.city], venue.country && ["Country", venue.country], venue.capacity && ["Capacity", venue.capacity], venue.established && ["Established", venue.established]].filter(Boolean).map(([lbl, val], i, arr) => (
            <div key={i} style={{ display: "flex", padding: "12px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none" }}>
              <div style={{ minWidth: 130, fontSize: 12, fontWeight: 700, color: "var(--text3)" }}>{lbl}</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {/* H2H */}
      <H2HSection matchId={matchId} />
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
        <div style={{ fontSize: 40, marginBottom: 12 }}></div>
        <p style={{ color: "var(--text3)", fontSize: 15 }}>Match not found.</p>
        <button onClick={() => navigate("/")} style={{ marginTop: 16, padding: "9px 22px", borderRadius: 100, background: "rgba(21,128,61,0.12)", border: "1px solid rgba(21,128,61,0.3)", color: "#0b7a55", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>← Back to Home</button>
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
    ? "linear-gradient(160deg, rgba(22,163,74,0.14) 0%, rgba(255,255,255,1) 55%)"
    : matchEnded
      ? "linear-gradient(160deg, rgba(21,128,61,0.08) 0%, rgba(255,255,255,1) 55%)"
      : "linear-gradient(160deg, rgba(11,99,196,0.08) 0%, rgba(255,255,255,1) 55%)";

  const matchSD = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": match.name ? `${match.name} Live Score` : "Live Cricket Match",
    "sport": "Cricket",
    "description": `${match.name || "Cricket Match"} live score, full scorecard and ball-by-ball commentary. ${match.status || ""}`,
    "url": `https://www.livecricketzone.com/match/${id}`,
    "eventStatus": matchEnded ? "https://schema.org/EventCompleted" : isLive ? "https://schema.org/LiveEventUpdate" : "https://schema.org/EventScheduled",
    ...(match.dateTimeGMT ? { "startDate": new Date(match.dateTimeGMT).toISOString() } : {}),
    "location": {
      "@type": "Place",
      "name": match.venue || "International Cricket Ground",
      "address": { "@type": "PostalAddress", "addressCountry": "IN" }
    },
    ...(t1?.name && t2?.name ? {
      "competitor": [
        { "@type": "SportsTeam", "name": t1.name },
        { "@type": "SportsTeam", "name": t2.name }
      ],
      "homeTeam": { "@type": "SportsTeam", "name": t1.name },
      "awayTeam": { "@type": "SportsTeam", "name": t2.name }
    } : {}),
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": `https://www.livecricketzone.com/match/${id}`
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 80px" }}>
      <SEO
        title={`${match.name || "Cricket Match"} Live Score Today — Scorecard & Ball-by-Ball`}
        description={`${match.name || "Cricket Match"} live score today, full scorecard, ball-by-ball commentary, match statistics and toss update. ${match.status || ""}`}
        url={`/match/${id}`}
        noindex
        structuredData={matchSD}
      />

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: "var(--text3)", padding: "16px 0 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "color 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.color = "#0b7a55"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; }}
      >
        ← Back
      </button>

      {/* ── HERO ── */}
      <div style={{
        background: heroBg,
        border: `1px solid ${isLive ? "rgba(21,128,61,0.25)" : "rgba(15,23,42,0.08)"}`,
        borderRadius: 24, padding: "28px 32px", marginBottom: 20,
        position: "relative", overflow: "hidden",
        boxShadow: isLive ? "none" : "none",
      }}>
        {/* Decorative */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "repeating-linear-gradient(90deg, #0b7a55 0 1px, transparent 1px 60px)", pointerEvents: "none" }} />

        {/* Status row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {isLive && (
              <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(21,128,61,0.12)", border: "1px solid rgba(21,128,61,0.35)", color: "#0b7a55", padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0b7a55", animation: "livePulse 1.8s infinite" }} />
                LIVE
              </span>
            )}
            {matchEnded && (
              <span style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "#0b63c4", padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>
                FINAL
              </span>
            )}
            {!isLive && !matchEnded && (
              <span style={{ background: "rgba(11,99,196,0.1)", border: "1px solid rgba(11,99,196,0.25)", color: "#0b63c4", padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>
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
                background: "rgba(209,32,42,0.12)", border: "1px solid rgba(209,32,42,0.35)",
                color: "#c81e28", borderRadius: 100, padding: "8px 18px",
                fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(209,32,42,0.24)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(209,32,42,0.12)"; e.currentTarget.style.color = "#c81e28"; }}
            >
              Highlights
            </button>
          )}
        </div>

        {/* Series name */}
        <div style={{ fontSize: 12, fontWeight: 600, color: isIPL ? "#0b63c4" : "var(--text3)", marginBottom: 16, position: "relative" }}>
          {match.series || match.name}
        </div>

        {/* Teams & Scores */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", position: "relative" }}>

          {/* Team 1 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {t1?.img
              ? <img src={t1.img} alt={t1.name} style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid rgba(21,128,61,0.3)", objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
              : <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(21,128,61,0.1)", border: "2px solid rgba(21,128,61,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#0b7a55", flexShrink: 0 }}>
                  {t1?.shortname?.slice(0, 2) || "?"}
                </div>
            }
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", lineHeight: 1.2 }}>{t1?.name || t1?.shortname || "Team 1"}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{t1?.shortname}</div>
              {s1 ? (
                <div style={{ fontFamily: "'Poppins',sans-serif" }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: isLive ? "#0b7a55" : "var(--text)", lineHeight: 1 }}>{s1.r}/{s1.w}</span>
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
            background: "var(--card)", border: "1px solid rgba(15,23,42,0.07)",
            fontSize: 13, fontWeight: 900, color: "var(--text-muted)", textAlign: "center",
          }}>
            <div>VS</div>
            {isLive && <BallStrip commentary={commentary} />}
          </div>

          {/* Team 2 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexDirection: "row-reverse" }}>
            {t2?.img
              ? <img src={t2.img} alt={t2.name} style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid rgba(11,99,196,0.3)", objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
              : <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(11,99,196,0.1)", border: "2px solid rgba(11,99,196,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16, color: "#0b63c4", flexShrink: 0 }}>
                  {t2?.shortname?.slice(0, 2) || "?"}
                </div>
            }
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", lineHeight: 1.2 }}>{t2?.name || t2?.shortname || "Team 2"}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{t2?.shortname}</div>
              {s2 ? (
                <div style={{ fontFamily: "'Poppins',sans-serif" }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: isLive ? "#0b7a55" : "var(--text)", lineHeight: 1 }}>{s2.r}/{s2.w}</span>
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
          background: isLive ? "rgba(21,128,61,0.07)" : matchEnded ? "rgba(74,222,128,0.05)" : "rgba(15,23,42,0.03)",
          border: `1px solid ${isLive ? "rgba(21,128,61,0.2)" : "rgba(15,23,42,0.07)"}`,
          fontSize: 14, fontWeight: 600,
          color: isLive ? "#0b63c4" : matchEnded ? "#0b7a55" : "var(--text2)",
          display: "flex", alignItems: "center", gap: 8, position: "relative",
        }}>
          {isLive && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0b7a55", animation: "livePulse 1.8s infinite", flexShrink: 0 }} />}
          {match.status || "Scheduled"}
        </div>

        {/* Toss */}
        {match.tossWinner && (
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)", paddingLeft: 4 }}>
            <strong style={{ color: "var(--text3)" }}>{match.tossWinner}</strong> won the toss · elected to <strong style={{ color: "var(--text3)" }}>{match.tossChoice}</strong>
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
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(15,23,42,0.07)", marginBottom: 24, overflowX: "auto", scrollbarWidth: "none" }}>
        {[
          { id: "scorecard",   label: "Scorecard" },
          { id: "commentary",  label: "Commentary" },
          { id: "overs",       label: "Over Summary" },
          { id: "squad",       label: "Squad" },
          { id: "info",        label: "Match Info" },
          { id: "analysis",    label: "Match numbers" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); trackTabSwitch(t.id, id); }}
            style={{
              flexShrink: 0, background: "transparent", border: "none", cursor: "pointer",
              padding: "14px 18px", fontSize: 13, fontWeight: tab === t.id ? 800 : 600,
              color: tab === t.id ? "#d1202a" : "var(--text3)",
              borderBottom: tab === t.id ? "2.5px solid #d1202a" : "2.5px solid transparent",
              marginBottom: -1, transition: "color 0.2s", fontFamily: "'Inter',sans-serif",
              whiteSpace: "nowrap",
            }}
          >{t.label}</button>
        ))}
      </div>

      {tab === "scorecard"  && <ScorecardTab matchId={id} />}
      {tab === "commentary" && <CommentaryTab matchId={id} />}
      {tab === "overs"      && <OverSummaryTab matchId={id} />}
      {tab === "analysis"   && <MatchNumbersTab matchId={id} match={match} />}
      {tab === "squad"      && <SquadTab matchId={id} />}
      {tab === "info"       && <EnhancedMatchInfoTab matchId={id} match={match} />}

      {/* Bottom ad */}
      <div style={{ marginTop: 32 }}><AdBanner type="auto" /></div>
    </div>
  );
}
