import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { fetchSeriesInfo } from "../api";

export default function SeriesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("schedule");

  const { data, isLoading, error } = useQuery({
    queryKey: ["seriesInfo", id],
    queryFn: () => fetchSeriesInfo(id),
  });

  const series   = data?.data || {};
  const schedule  = Array.isArray(series.schedule)  ? series.schedule  : [];
  const standings = Array.isArray(series.standings) ? series.standings : [];
  const stats     = series.stats || { batting: [], bowling: [] };

  // derive series name from first match if not directly available
  const seriesName = schedule[0]?.series || `Series ${id}`;

  if (isLoading) return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 16px", textAlign: "center" }}>
      <div className="spinner" style={{ margin: "0 auto" }} />
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 16px" }}>
      <div style={{ padding: "24px", borderRadius: 12, background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171", textAlign: "center" }}>
        Failed to load series. <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#3B82F6", fontWeight: 700, cursor: "pointer" }}>← Go back</button>
      </div>
    </div>
  );

  const TABS = [
    { id: "schedule",  label: "Schedule & Results", show: schedule.length > 0 },
    { id: "standings", label: "Points Table",        show: standings.length > 0 },
    { id: "stats",     label: "Top Performers",      show: stats.batting?.length > 0 || stats.bowling?.length > 0 },
  ].filter(t => t.show);

  const live     = schedule.filter(m => m.matchStarted && !m.matchEnded);
  const recent   = schedule.filter(m => m.matchEnded);
  const upcoming = schedule.filter(m => !m.matchStarted);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title={`${seriesName} — Live Score, Schedule & Results`}
        description={`${seriesName} live scores, full match schedule, results with scorecards, points table and top performers. Real-time ball-by-ball updates on Live Cricket Zone.`}
        url={`/series/${id}`}
      />

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{ marginTop: 16, marginBottom: 16, padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text3)", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}
      >
        ← Back
      </button>

      {/* Hero */}
      <div style={{
        padding: "24px 28px", borderRadius: 16, marginBottom: 20,
        background: "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(34,197,94,0.15)",
      }}>
        <div style={{ fontSize: 11, color: "#3B82F6", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>🏆 Series</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", margin: "0 0 10px", lineHeight: 1.3 }}>{seriesName}</h1>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {live.length > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 20, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fb7185" }}>
              ● {live.length} Live
            </span>
          )}
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 20, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)", color: "#3B82F6" }}>
            {schedule.length} Matches
          </span>
          {upcoming.length > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 20, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)", color: "#38BDF8" }}>
              {upcoming.length} Upcoming
            </span>
          )}
        </div>
      </div>

      <AdBanner type="leaderboard" />

      {/* Tabs */}
      {TABS.length > 1 && (
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 20, overflowX: "auto", scrollbarWidth: "none" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flexShrink: 0, background: "none", border: "none", cursor: "pointer",
              padding: "11px 20px", fontSize: 13, fontWeight: 700,
              color: tab === t.id ? "#3B82F6" : "var(--text3)",
              borderBottom: tab === t.id ? "2px solid #3B82F6" : "2px solid transparent",
              marginBottom: -1, transition: "color 0.2s", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* ── SCHEDULE ── */}
      {(tab === "schedule" || TABS.length === 0) && (
        <div>
          {live.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#fb7185", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444", animation: "livePulse 2s infinite", display: "inline-block" }} />
                Live Now
              </h2>
              <MatchList matches={live} accent="#EF4444" />
            </section>
          )}

          {upcoming.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#38BDF8", marginBottom: 12 }}>📅 Upcoming</h2>
              <MatchList matches={upcoming} accent="#38BDF8" />
            </section>
          )}

          {recent.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#60A5FA", marginBottom: 12 }}>✅ Results</h2>
              <MatchList matches={recent} accent="#3B82F6" />
            </section>
          )}

          {schedule.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ color: "var(--text3)", fontSize: 13 }}>No match schedule available yet.</p>
            </div>
          )}
        </div>
      )}

      {/* ── STANDINGS ── */}
      {tab === "standings" && standings.length > 0 && (
        <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 540 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["#","Team","P","W","L","NR","NRR","Pts"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: h === "Team" ? "left" : "right", fontSize: 10, color: "var(--text3)", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {standings.map((row, i) => (
                <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, color: i < 4 ? "#3B82F6" : "var(--text3)", fontWeight: 700 }}>{i + 1}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {row.img && <img src={row.img} alt={row.team} style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{row.team}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{row.short}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, color: "var(--text2)" }}>{row.p}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, color: "#3B82F6", fontWeight: 700 }}>{row.w}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, color: "#f87171" }}>{row.l}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, color: "var(--text3)" }}>{row.nr}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 12, color: Number((row.nrr || "0").replace("+","")) >= 0 ? "#3B82F6" : "#f87171" }}>{row.nrr}</td>
                  <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 14, fontWeight: 900, color: "var(--text)" }}>{row.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── STATS ── */}
      {tab === "stats" && (
        <div>
          {stats.batting?.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#3B82F6", marginBottom: 12 }}>🏏 Top Batsmen</h2>
              <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                      {["#","Player","Country","M","Inn","Runs","Avg","SR","HS"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: h==="Player"||h==="Country"?"left":"right", fontSize: 10, color: "var(--text3)", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.batting.map((p, i) => (
                      <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text3)" }}>{i+1}</td>
                        <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap" }}>{p.name}</td>
                        <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--text3)", whiteSpace: "nowrap" }}>{p.country}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{p.matches}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{p.innings}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 14, fontWeight: 900, color: "#3B82F6" }}>{p.runs}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{p.avg ?? "—"}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{p.sr ?? "—"}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{p.hs || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {stats.bowling?.length > 0 && (
            <section>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#3B82F6", marginBottom: 12 }}>🎳 Top Bowlers</h2>
              <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                      {["#","Player","Country","M","Wkts","Avg","Econ","Best"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: h==="Player"||h==="Country"?"left":"right", fontSize: 10, color: "var(--text3)", fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.bowling.map((p, i) => (
                      <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text3)" }}>{i+1}</td>
                        <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap" }}>{p.name}</td>
                        <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--text3)", whiteSpace: "nowrap" }}>{p.country}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{p.matches}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 14, fontWeight: 900, color: "#3B82F6" }}>{p.wickets}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{p.avg ?? "—"}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{p.economy ?? "—"}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text2)" }}>{p.bestFig || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}

      <div style={{ marginTop: 24 }}><AdBanner type="auto" /></div>
    </div>
  );
}

/* ── Match list helper ── */
function MatchList({ matches, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {matches.map(m => (
        <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
          <div style={{
            padding: "14px 18px", borderRadius: 10,
            background: `${accent}05`,
            border: `1px solid ${accent}20`,
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${accent}0a`; e.currentTarget.style.borderColor = `${accent}35`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${accent}05`; e.currentTarget.style.borderColor = `${accent}20`; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  {m.matchStarted && !m.matchEnded && (
                    <span style={{ fontSize: 9, fontWeight: 900, background: "#EF4444", color: "#fff", padding: "1px 6px", borderRadius: 10 }}>● LIVE</span>
                  )}
                  <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{m.matchType}</span>
                  {m.date && <span style={{ fontSize: 10, color: "var(--text3)" }}>· {m.date}</span>}
                </div>
                <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                {m.venue && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>📍 {m.venue}</div>}
                {m.status && m.matchEnded && (
                  <div style={{ fontSize: 11, color: "#60A5FA", marginTop: 2, fontWeight: 600 }}>{m.status}</div>
                )}
              </div>
              <span style={{
                flexShrink: 0, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 16,
                background: `${accent}10`, border: `1px solid ${accent}25`, color: accent,
              }}>
                {m.matchEnded ? "Result →" : m.matchStarted ? "Live →" : "Preview →"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
