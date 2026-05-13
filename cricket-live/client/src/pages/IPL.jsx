import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { fetchLiveMatches, fetchUpcomingMatches, fetchIPLStandings } from "../api";
import { trackMatchCardClick } from "../utils/analytics";

const IPL_SD = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Indian Premier League 2026",
  "alternateName": ["IPL 2026", "IPL 19", "TATA IPL 2026"],
  "description": "IPL 2026 live scores, ball-by-ball commentary, points table, schedule and match results.",
  "sport": "Cricket",
  "startDate": "2026-03-28",
  "endDate": "2026-05-31",
  "location": { "@type": "Place", "name": "India", "address": { "@type": "PostalAddress", "addressCountry": "IN" } },
  "organizer": { "@type": "SportsOrganization", "name": "Board of Control for Cricket in India", "alternateName": "BCCI" },
  "url": "https://www.livecricketzone.com/ipl",
};

const IPL_FAQ_SD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question", "name": "What are the today's IPL 2026 live matches?",
      "acceptedAnswer": { "@type": "Answer", "text": "Check Live Cricket Zone for today's IPL 2026 live matches with real-time ball-by-ball scores, live streaming links and match commentary." }
    },
    {
      "@type": "Question", "name": "How many teams are in IPL 2026?",
      "acceptedAnswer": { "@type": "Answer", "text": "IPL 2026 features 10 teams: Mumbai Indians (MI), Chennai Super Kings (CSK), Royal Challengers Bengaluru (RCB), Kolkata Knight Riders (KKR), Gujarat Titans (GT), Lucknow Super Giants (LSG), Delhi Capitals (DC), Punjab Kings (PBKS), Rajasthan Royals (RR), and Sunrisers Hyderabad (SRH)." }
    },
    {
      "@type": "Question", "name": "What is the IPL 2026 points table?",
      "acceptedAnswer": { "@type": "Answer", "text": "The IPL 2026 points table is updated live after every match on Live Cricket Zone. Top 4 teams qualify for the playoffs." }
    },
    {
      "@type": "Question", "name": "When does IPL 2026 start and end?",
      "acceptedAnswer": { "@type": "Answer", "text": "IPL 2026 runs from March 28 to May 31, 2026 with 84 league matches across India." }
    },
  ]
};

const IPL_TEAMS = [
  { name: "Mumbai Indians",              short: "MI",   color: "#004BA0", captain: "Hardik Pandya",   key: "Rohit Sharma, Tilak Varma" },
  { name: "Chennai Super Kings",         short: "CSK",  color: "#F9CD05", captain: "Ruturaj Gaikwad", key: "MS Dhoni, Ravindra Jadeja" },
  { name: "Royal Challengers Bengaluru", short: "RCB",  color: "#EC1C24", captain: "Rajat Patidar",   key: "Virat Kohli, Phil Salt" },
  { name: "Kolkata Knight Riders",       short: "KKR",  color: "#3A225D", captain: "Ajinkya Rahane",  key: "Sunil Narine, Andre Russell" },
  { name: "Gujarat Titans",              short: "GT",   color: "#1B8B4B", captain: "Shubman Gill",    key: "Kagiso Rabada, Jos Buttler" },
  { name: "Lucknow Super Giants",        short: "LSG",  color: "#A72056", captain: "Rishabh Pant",    key: "Mitchell Marsh, Aiden Markram" },
  { name: "Delhi Capitals",              short: "DC",   color: "#0078BC", captain: "Axar Patel",      key: "Jake Fraser-McGurk, Kuldeep Yadav" },
  { name: "Punjab Kings",                short: "PBKS", color: "#ED1B24", captain: "Shreyas Iyer",    key: "Glenn Maxwell, Arshdeep Singh" },
  { name: "Rajasthan Royals",            short: "RR",   color: "#254AA5", captain: "Riyan Parag",     key: "Yashasvi Jaiswal, Dhruv Jurel" },
  { name: "Sunrisers Hyderabad",         short: "SRH",  color: "#F7A721", captain: "Pat Cummins",     key: "Heinrich Klaasen, Travis Head" },
];

/* ── IPL Points Table (full page version) ── */
function PointsTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["iplStandings"],
    queryFn: fetchIPLStandings,
    refetchInterval: 300000,
  });

  const rows = data?.data || [];
  const teamMap = Object.fromEntries(IPL_TEAMS.map(t => [t.short, t]));

  if (isLoading) return (
    <div style={{ padding: "40px 0", textAlign: "center" }}>
      <div className="spinner" style={{ margin: "0 auto 12px", width: 32, height: 32 }} />
      <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading points table…</p>
    </div>
  );

  if (isError || rows.length === 0) return (
    <div style={{ padding: "32px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
      <p style={{ color: "var(--text3)", fontSize: 14 }}>Points table data unavailable right now.</p>
    </div>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
        <thead>
          <tr style={{ background: "rgba(245,158,11,0.07)", borderBottom: "2px solid rgba(245,158,11,0.15)" }}>
            {[
              { h: "#",    align: "center",  w: 36 },
              { h: "Team", align: "left",    w: null },
              { h: "P",    align: "center",  w: 42 },
              { h: "W",    align: "center",  w: 42 },
              { h: "L",    align: "center",  w: 42 },
              { h: "NR",   align: "center",  w: 42 },
              { h: "NRR",  align: "center",  w: 72 },
              { h: "Pts",  align: "center",  w: 54 },
            ].map(col => (
              <th key={col.h} style={{
                padding: "12px 10px",
                textAlign: col.align,
                fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                letterSpacing: 0.6, color: "#F59E0B",
                width: col.w || undefined,
              }}>{col.h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const teamInfo = teamMap[r.short] || {};
            const isQualified = i < 4;
            const isEliminated = i >= 7;
            return (
              <tr
                key={r.short || i}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: isQualified ? "rgba(34,197,94,0.04)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = isQualified ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.025)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = isQualified ? "rgba(34,197,94,0.04)" : "transparent"; }}
              >
                {/* Rank */}
                <td style={{ padding: "14px 10px", textAlign: "center" }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: isQualified ? "rgba(34,197,94,0.15)" : isEliminated ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)",
                    border: isQualified ? "1.5px solid rgba(34,197,94,0.35)" : "1.5px solid rgba(255,255,255,0.06)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 900,
                    color: isQualified ? "#22C55E" : isEliminated ? "#F87171" : "var(--text3)",
                  }}>{i + 1}</div>
                </td>

                {/* Team */}
                <td style={{ padding: "14px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Color circle */}
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                      background: `${teamInfo.color || r.color || "#555"}22`,
                      border: `2px solid ${teamInfo.color || r.color || "#555"}60`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 900, color: teamInfo.color || r.color || "#aaa",
                      letterSpacing: -0.5,
                    }}>
                      {r.short}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", lineHeight: 1.2 }}>
                        {r.team || teamInfo.name || r.short}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                        {teamInfo.captain ? `C: ${teamInfo.captain}` : ""}
                      </div>
                    </div>
                    {isQualified && (
                      <span style={{
                        marginLeft: "auto", fontSize: 9, fontWeight: 800,
                        color: "#22C55E", background: "rgba(34,197,94,0.12)",
                        border: "1px solid rgba(34,197,94,0.25)",
                        padding: "2px 7px", borderRadius: 20, whiteSpace: "nowrap",
                      }}>Q</span>
                    )}
                  </div>
                </td>

                {/* Stats */}
                <td style={{ padding: "14px 10px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "var(--text2)" }}>{r.p ?? "—"}</td>
                <td style={{ padding: "14px 10px", textAlign: "center", fontSize: 14, fontWeight: 800, color: "#22C55E" }}>{r.w ?? "—"}</td>
                <td style={{ padding: "14px 10px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#F87171" }}>{r.l ?? "—"}</td>
                <td style={{ padding: "14px 10px", textAlign: "center", fontSize: 13, color: "var(--text3)" }}>{r.nr ?? "—"}</td>
                <td style={{ padding: "14px 10px", textAlign: "center" }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: r.nrr && r.nrr.startsWith("+") ? "#22C55E" : r.nrr && r.nrr.startsWith("-") ? "#F87171" : "var(--text3)",
                  }}>{r.nrr || "—"}</span>
                </td>
                <td style={{ padding: "14px 10px", textAlign: "center" }}>
                  <span style={{
                    fontSize: 16, fontWeight: 900, fontFamily: "'Poppins',sans-serif",
                    color: isQualified ? "#F59E0B" : "var(--text)",
                  }}>{r.pts ?? "—"}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.04)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text3)" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(34,197,94,0.3)", border: "1px solid rgba(34,197,94,0.5)", display: "inline-block" }} />
          Qualify for Playoffs (Top 4)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text3)" }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#F59E0B" }}>Q</span> Qualified
        </div>
      </div>
    </div>
  );
}

/* ── Match Card ── */
function MatchCard({ match, isLive }) {
  const navigate = useNavigate();
  const t1 = match.teamInfo?.[0];
  const t2 = match.teamInfo?.[1];
  const s1 = match.score?.[0];
  const s2 = match.score?.[1];

  return (
    <div
      onClick={() => { trackMatchCardClick(match.id, match.name, isLive); navigate(`/match/${match.id}`); }}
      style={{
        padding: "18px 20px", borderRadius: 14, cursor: "pointer",
        background: isLive ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isLive ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.07)"}`,
        transition: "all 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = isLive ? "0 8px 30px rgba(34,197,94,0.12)" : "0 8px 20px rgba(0,0,0,0.3)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        {isLive
          ? <span style={{ fontSize: 10, fontWeight: 800, color: "#22C55E", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", padding: "3px 9px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", animation: "livePulse 1.8s infinite" }} />
              LIVE
            </span>
          : <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", padding: "3px 9px", borderRadius: 20 }}>UPCOMING</span>
        }
        <button
          onClick={e => { e.stopPropagation(); navigate(`/match/${match.id}?watch=1`); }}
          style={{ fontSize: 11, fontWeight: 700, color: "#F87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", padding: "4px 12px", borderRadius: 20, cursor: "pointer" }}
        >▶ Watch</button>
      </div>

      {/* Teams */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Team 1 */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>
            {t1?.shortname || match.teams?.[0] || "TBD"}
          </div>
          {s1 ? (
            <div style={{ fontSize: 22, fontWeight: 900, color: "#22C55E", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
              {s1.r}/{s1.w}
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, marginLeft: 6 }}>({s1.o})</span>
            </div>
          ) : <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Yet to bat</div>}
        </div>

        <div style={{ fontSize: 11, fontWeight: 900, color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "5px 10px", borderRadius: 8, flexShrink: 0 }}>VS</div>

        {/* Team 2 */}
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>
            {t2?.shortname || match.teams?.[1] || "TBD"}
          </div>
          {s2 ? (
            <div style={{ fontSize: 22, fontWeight: 900, color: "#22C55E", fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>
              {s2.r}/{s2.w}
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, marginLeft: 6 }}>({s2.o})</span>
            </div>
          ) : <div style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Yet to bat</div>}
        </div>
      </div>

      {/* Status */}
      <div style={{ marginTop: 12, padding: "7px 12px", borderRadius: 8, background: isLive ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)", fontSize: 12, color: isLive ? "#4ADE80" : "var(--text3)", fontWeight: 600 }}>
        {match.status}
      </div>
    </div>
  );
}

export default function IPL() {
  const [activeSection, setActiveSection] = useState("points-table");

  const { data: liveData, isLoading: liveLoading } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
  });
  const { data: upcomingData } = useQuery({
    queryKey: ["upcomingMatches"],
    queryFn: fetchUpcomingMatches,
    refetchInterval: 120000,
  });

  const filterIPL = (m) =>
    m.series?.toLowerCase().includes("ipl") ||
    m.name?.toLowerCase().includes("ipl") ||
    m.name?.toLowerCase().includes("indian premier league");

  const liveMatches     = (liveData?.data     || []).filter(filterIPL);
  const upcomingMatches = (upcomingData?.data  || []).filter(filterIPL);

  const SECTIONS = [
    { key: "points-table", label: "Points Table" },
    { key: "live",         label: `Live (${liveMatches.length})` },
    { key: "upcoming",     label: "Upcoming" },
    { key: "teams",        label: "Teams" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="IPL 2026 Points Table, Live Score & Schedule — Indian Premier League"
        description="IPL 2026 live points table, live scores today, match schedule and team standings. Track Top 4 qualifiers, NRR, wins/losses for all 10 IPL teams updated live."
        keywords="IPL 2026 points table, IPL points table 2026, IPL 2026 standings, IPL live score today, IPL 2026 schedule, IPL 2026 teams, IPL table today, IPL 2026 results, IPL top 4 2026"
        url="/ipl"
        structuredData={[IPL_SD, IPL_FAQ_SD]}
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 20px",
        padding: "32px 28px",
        borderRadius: 20,
        background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(9,9,11,0.98) 60%, rgba(34,197,94,0.06) 100%)",
        border: "1px solid rgba(245,158,11,0.18)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative lines */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(45deg, #F59E0B 0 1px, transparent 1px 28px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 28 }}>🏆</span>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", margin: 0 }}>
                IPL <span style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2026</span>
              </h1>
            </div>
            <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              Indian Premier League · TATA IPL · Mar 28 – May 31, 2026
            </p>
            {liveMatches.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", animation: "livePulse 1.8s infinite" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#22C55E" }}>
                  {liveMatches.length} match{liveMatches.length > 1 ? "es" : ""} live now
                </span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/live" style={{ padding: "9px 20px", borderRadius: 100, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", color: "#22C55E", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              Live Scores
            </Link>
            <Link to="/schedule" style={{ padding: "9px 20px", borderRadius: 100, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
              Schedule
            </Link>
          </div>
        </div>
      </div>

      {/* Ad — top */}
      <AdBanner type="leaderboard" />

      {/* Section Tabs */}
      <div style={{
        display: "flex", gap: 0, borderBottom: "2px solid rgba(255,255,255,0.06)",
        marginBottom: 20, overflowX: "auto", scrollbarWidth: "none",
      }}>
        {SECTIONS.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "12px 20px", fontSize: 13, fontWeight: activeSection === s.key ? 800 : 600,
              color: activeSection === s.key ? "#F59E0B" : "var(--text3)",
              borderBottom: activeSection === s.key ? "2px solid #F59E0B" : "2px solid transparent",
              marginBottom: -2, transition: "color 0.2s", whiteSpace: "nowrap",
              fontFamily: "'Inter',sans-serif",
            }}
          >{s.label}</button>
        ))}
      </div>

      {/* Main 2-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }} className="ipl-main">

        {/* LEFT */}
        <div>
          {/* Points Table */}
          {activeSection === "points-table" && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 3, height: 18, borderRadius: 2, background: "linear-gradient(180deg,#F59E0B,#D97706)", display: "inline-block" }} />
                  IPL 2026 Points Table
                </h2>
                <span style={{ fontSize: 11, color: "var(--text-muted)", background: "rgba(34,197,94,0.07)", padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>
                  Live Updated
                </span>
              </div>
              <PointsTable />
            </div>
          )}

          {/* Live Matches */}
          {activeSection === "live" && (
            <section aria-label="IPL 2026 Live Matches">
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", animation: "livePulse 1.8s infinite" }} />
                IPL 2026 — Live Now
              </h2>
              {liveLoading
                ? <div style={{ textAlign: "center", padding: 40 }}><div className="spinner" style={{ margin: "0 auto" }} /></div>
                : liveMatches.length > 0
                  ? <div style={{ display: "grid", gap: 14 }}>
                      {liveMatches.map(m => <MatchCard key={m.id} match={m} isLive />)}
                    </div>
                  : <div style={{ padding: "40px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>🏏</div>
                      <p style={{ color: "var(--text3)", fontSize: 14 }}>No IPL matches live right now.</p>
                      <button onClick={() => setActiveSection("upcoming")} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 100, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                        View Upcoming →
                      </button>
                    </div>
              }
            </section>
          )}

          {/* Upcoming */}
          {activeSection === "upcoming" && (
            <section aria-label="IPL 2026 Upcoming Matches">
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>
                📅 Upcoming IPL 2026 Matches
              </h2>
              {upcomingMatches.length > 0
                ? <div style={{ display: "grid", gap: 14 }}>
                    {upcomingMatches.map(m => <MatchCard key={m.id} match={m} isLive={false} />)}
                  </div>
                : <div style={{ padding: "40px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p style={{ color: "var(--text3)", fontSize: 14 }}>No upcoming IPL matches in the schedule right now.</p>
                  </div>
              }
            </section>
          )}

          {/* Teams */}
          {activeSection === "teams" && (
            <section aria-label="IPL 2026 Teams">
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>🏏 IPL 2026 Teams</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {IPL_TEAMS.map(t => (
                  <div
                    key={t.short}
                    style={{
                      padding: "18px 16px", borderRadius: 14, textAlign: "center",
                      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                      cursor: "pointer", transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = `${t.color}50`; e.currentTarget.style.boxShadow = `0 8px 30px ${t.color}18`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%", margin: "0 auto 12px",
                      background: `${t.color}20`, border: `2.5px solid ${t.color}55`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, fontSize: 14, color: t.color, letterSpacing: -0.5,
                    }}>{t.short}</div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", marginBottom: 5 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      <span style={{ color: t.color, fontWeight: 700 }}>Captain:</span> {t.captain}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>{t.key}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ad mid */}
          <div style={{ marginTop: 20 }}><AdBanner type="auto" /></div>

          {/* SEO Content */}
          <section style={{
            marginTop: 20, padding: "24px 24px", borderRadius: 14,
            background: "rgba(255,255,255,0.015)", border: "1px solid rgba(245,158,11,0.06)",
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#F59E0B,#D97706)", display: "inline-block" }} />
              About IPL 2026 — Indian Premier League
            </h2>
            <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.8, marginBottom: 8 }}>
              The Indian Premier League 2026 (TATA IPL) is the 19th season of the world's most popular T20 cricket league. Featuring 10 franchises competing in 84 league matches plus 4 playoff games, IPL 2026 runs from March 28 to May 31, 2026 across India.
            </p>
            <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.8 }}>
              Follow <strong style={{ color: "var(--text2)" }}>IPL 2026 live scores</strong>, <strong style={{ color: "var(--text2)" }}>ball-by-ball commentary</strong>, <strong style={{ color: "var(--text2)" }}>IPL points table</strong> and match schedules on Live Cricket Zone. Watch IPL live streaming free via YouTube — no signup required.
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {["IPL 2026 Live", "IPL Points Table", "IPL Schedule", "IPL Teams", "Virat Kohli", "Rohit Sharma", "Rishabh Pant", "Shubman Gill", "IPL Playoffs", "Watch IPL Free"].map(tag => (
                <span key={tag} style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)", color: "#F59E0B" }}>{tag}</span>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Quick nav to sections */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 11, fontWeight: 800, color: "var(--text)" }}>IPL 2026</div>
            {[
              { key: "points-table", label: "📊 Points Table" },
              { key: "live",         label: "🔴 Live Matches" },
              { key: "upcoming",     label: "📅 Upcoming" },
              { key: "teams",        label: "🏏 Teams" },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                style={{
                  display: "block", width: "100%", background: activeSection === s.key ? "rgba(245,158,11,0.07)" : "none",
                  border: "none", cursor: "pointer", padding: "9px 14px", textAlign: "left",
                  fontSize: 12, fontWeight: activeSection === s.key ? 700 : 600,
                  color: activeSection === s.key ? "#F59E0B" : "var(--text2)",
                  borderLeft: activeSection === s.key ? "2px solid #F59E0B" : "2px solid transparent",
                  transition: "all 0.15s", fontFamily: "'Inter',sans-serif",
                }}
              >{s.label}</button>
            ))}
          </div>

          {/* IPL Fast Facts */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 11, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "linear-gradient(180deg,#F59E0B,#D97706)", display: "inline-block" }} />
              IPL 2026 Key Stats
            </div>
            {[
              { label: "Teams",       value: "10", color: "#22C55E" },
              { label: "Matches",     value: "84+4", color: "#F59E0B" },
              { label: "Season",      value: "19th", color: "#A78BFA" },
              { label: "Start Date",  value: "Mar 28", color: "#38BDF8" },
              { label: "Final",       value: "May 31", color: "#F87171" },
              { label: "Title",       value: "TATA IPL", color: "#F59E0B" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Ad */}
          <AdBanner type="rectangle" />

          {/* Key Players */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 11, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "linear-gradient(180deg,#22C55E,#16A34A)", display: "inline-block" }} />
              Star Players
            </div>
            {[
              { name: "Virat Kohli",       team: "RCB", color: "#EC1C24" },
              { name: "Rohit Sharma",      team: "MI",  color: "#004BA0" },
              { name: "Rishabh Pant",      team: "LSG", color: "#A72056" },
              { name: "Shubman Gill",      team: "GT",  color: "#1B8B4B" },
              { name: "Hardik Pandya",     team: "MI",  color: "#004BA0" },
              { name: "Yashasvi Jaiswal",  team: "RR",  color: "#254AA5" },
              { name: "Heinrich Klaasen",  team: "SRH", color: "#F7A721" },
              { name: "Kagiso Rabada",     team: "GT",  color: "#1B8B4B" },
            ].map(p => (
              <div key={p.name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.03)",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>{p.name}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: p.color, background: `${p.color}18`, border: `1px solid ${p.color}35`, padding: "2px 7px", borderRadius: 12 }}>{p.team}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .ipl-main { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
