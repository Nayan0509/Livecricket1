import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllMatches, fetchNews } from "../api";
import SEO from "../components/SEO";

const SITE_SD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Live Cricket Zone",
  "url": "https://www.livecricketzone.com",
  "description": "Live cricket scores, ball-by-ball commentary, IPL 2026, T20 World Cup updates",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://www.livecricketzone.com/players?search={search_term_string}" },
    "query-input": "required name=search_term_string"
  }
};

const QUICK_LINKS = [
  { to: "/ipl",             label: "IPL 2026",         color: "#818cf8" },
  { to: "/t20-world-cup",   label: "T20 WC",           color: "#f472b6" },
  { to: "/world-cup",       label: "World Cup",        color: "#fbbf24" },
  { to: "/champions-trophy",label: "Champions Trophy", color: "#2dd4bf" },
  { to: "/psl",             label: "PSL",              color: "#4ade80" },
  { to: "/bbl",             label: "BBL",              color: "#fb923c" },
  { to: "/womens-cricket",  label: "Women's",          color: "#e879f9" },
  { to: "/rankings",        label: "Rankings",         color: "#38bdf8" },
];

/* ─────────────────────────────────────────────
   STRIP CARD — double-row score layout
   Top row: team name + flag
   Middle row: big score (runs/wkts + overs)
   ───────────────────────────────────────────── */
function TeamScoreBlock({ team, score, isLive, align = "left" }) {
  const isRight = align === "right";
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: isRight ? "flex-end" : "flex-start", gap: 4 }}>
      {/* Top: flag + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexDirection: isRight ? "row-reverse" : "row" }}>
        {team?.img
          ? <img src={team.img} alt={team?.name} style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.12)" }} onError={e => { e.target.style.display = "none"; }} />
          : <div style={{ width: 20, height: 20, borderRadius: "50%", background: isRight ? "rgba(99,102,241,0.2)" : "rgba(244,63,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: isRight ? "#818cf8" : "#fb7185" }}>
              {team?.shortname?.slice(0, 2) || "?"}
            </div>
        }
        <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text2)", textTransform: "uppercase", letterSpacing: 0.5 }}>
          {team?.shortname || "TBD"}
        </span>
      </div>
      {/* Middle: big score */}
      {score ? (
        <div style={{ textAlign: isRight ? "right" : "left" }}>
          <span style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: isLive ? (isRight ? "#818cf8" : "#fb7185") : "var(--text)", lineHeight: 1 }}>
            {score.r}/{score.w}
          </span>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, marginLeft: 4 }}>
            ({score.o})
          </span>
        </div>
      ) : (
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Yet to bat</span>
      )}
    </div>
  );
}

function StripCard({ match }) {
  const navigate = useNavigate();
  const isLive = match.matchStarted && !match.matchEnded;
  const t1 = match.teamInfo?.[0];
  const t2 = match.teamInfo?.[1];
  const s1 = match.score?.[0];
  const s2 = match.score?.[1];

  return (
    <div
      onClick={() => navigate(`/match/${match.id}`)}
      style={{
        minWidth: 230, maxWidth: 230, cursor: "pointer", flexShrink: 0,
        background: isLive
          ? "linear-gradient(145deg, rgba(244,63,94,0.07) 0%, rgba(13,20,38,0.95) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(13,20,38,0.9) 100%)",
        border: `1px solid ${isLive ? "rgba(244,63,94,0.28)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 14, padding: "12px 14px",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = isLive ? "0 8px 24px rgba(244,63,94,0.2)" : "0 8px 24px rgba(0,0,0,0.4)";
        e.currentTarget.style.borderColor = isLive ? "rgba(244,63,94,0.45)" : "rgba(255,255,255,0.14)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = isLive ? "rgba(244,63,94,0.28)" : "rgba(255,255,255,0.08)";
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2, borderRadius: "14px 14px 0 0",
        background: isLive ? "linear-gradient(90deg,#f43f5e,#fb7185)" : match.matchEnded ? "linear-gradient(90deg,#22c55e,#4ade80)" : "linear-gradient(90deg,#6366f1,#818cf8)",
      }} />

      {/* Header: match type + status badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
          {match.matchType}
        </span>
        {isLive
          ? <span style={{ fontSize: 9, color: "#fb7185", fontWeight: 800, display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f43f5e", display: "inline-block", animation: "livePulse 1.8s infinite" }} />
              LIVE
            </span>
          : match.matchEnded
          ? <span style={{ fontSize: 9, color: "#4ade80", fontWeight: 800 }}>✓ FINAL</span>
          : <span style={{ fontSize: 9, color: "#38bdf8", fontWeight: 800 }}>UPCOMING</span>
        }
      </div>

      {/* ── DOUBLE ROW SCORE SECTION ── */}
      {/* Row 1: Team 1 */}
      <div style={{ marginBottom: 6 }}>
        <TeamScoreBlock team={t1} score={s1} isLive={isLive} align="left" />
      </div>

      {/* Divider with VS */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        <span style={{ fontSize: 9, fontWeight: 900, color: "var(--text-muted)", letterSpacing: 1 }}>VS</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Row 2: Team 2 */}
      <div style={{ marginBottom: 10 }}>
        <TeamScoreBlock team={t2} score={s2} isLive={isLive} align="left" />
      </div>

      {/* Status text */}
      <div style={{
        fontSize: 10, fontWeight: 600, lineHeight: 1.4,
        color: isLive ? "#fb7185" : match.matchEnded ? "#4ade80" : "var(--text3)",
        overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        padding: "6px 8px", borderRadius: 6,
        background: isLive ? "rgba(244,63,94,0.06)" : match.matchEnded ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)",
      }}>
        {match.status}
      </div>
    </div>
  );
}

/* ── Full match row (main list) ── */
function MatchRow({ match }) {
  const navigate = useNavigate();
  const isLive = match.matchStarted && !match.matchEnded;
  const isCompleted = match.matchEnded;
  const t1 = match.teamInfo?.[0];
  const t2 = match.teamInfo?.[1];
  const s1 = match.score?.[0];
  const s2 = match.score?.[1];

  const scoreColor = isLive ? "#fb7185" : isCompleted ? "#4ade80" : "var(--text)";

  return (
    <div
      onClick={() => navigate(`/match/${match.id}`)}
      style={{
        display: "grid", gridTemplateColumns: "1fr 56px 1fr",
        alignItems: "center", gap: 8,
        padding: "13px 18px", cursor: "pointer",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s",
        background: isLive ? "rgba(244,63,94,0.03)" : "transparent",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = isLive ? "rgba(244,63,94,0.03)" : "transparent"; }}
    >
      {/* Team 1 — left aligned */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        {t1?.img
          ? <img src={t1.img} alt={t1.name} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.1)", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
          : <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(244,63,94,0.12)", border: "1.5px solid rgba(244,63,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#fb7185", flexShrink: 0 }}>{t1?.shortname?.slice(0, 2) || "?"}</div>
        }
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t1?.shortname || match.teams?.[0] || "TBD"}
          </div>
          {s1 && (
            <div style={{ fontSize: 16, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: scoreColor, lineHeight: 1.1 }}>
              {s1.r}/{s1.w}
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, marginLeft: 4 }}>({s1.o})</span>
            </div>
          )}
        </div>
      </div>

      {/* Centre VS + live dot */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "3px 6px", display: "inline-block" }}>VS</div>
        {isLive && (
          <div style={{ marginTop: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f43f5e", display: "inline-block", animation: "livePulse 1.8s infinite" }} />
            <span style={{ fontSize: 8, color: "#fb7185", fontWeight: 800 }}>LIVE</span>
          </div>
        )}
        {isCompleted && (
          <div style={{ marginTop: 3, fontSize: 8, color: "#4ade80", fontWeight: 800 }}>FINAL</div>
        )}
      </div>

      {/* Team 2 — right aligned */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse", minWidth: 0 }}>
        {t2?.img
          ? <img src={t2.img} alt={t2.name} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.1)", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
          : <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(99,102,241,0.12)", border: "1.5px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#818cf8", flexShrink: 0 }}>{t2?.shortname?.slice(0, 2) || "?"}</div>
        }
        <div style={{ minWidth: 0, textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t2?.shortname || match.teams?.[1] || "TBD"}
          </div>
          {s2 && (
            <div style={{ fontSize: 16, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: scoreColor, lineHeight: 1.1 }}>
              {s2.r}/{s2.w}
              <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, marginLeft: 4 }}>({s2.o})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── News card ── */
function NewsCard({ item }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
      <div
        style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.035)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <span style={{ fontSize: 9, color: "#fb7185", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, background: "rgba(244,63,94,0.1)", padding: "2px 7px", borderRadius: 4 }}>
            {item.source}
          </span>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
            {item.hoursAgo != null ? `${item.hoursAgo}h ago` : item.date}
          </span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.title}
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("live");

  const { data: allMatchesData, isLoading: matchesLoading } = useQuery({
    queryKey: ["allMatches"],
    queryFn: fetchAllMatches,
    refetchInterval: 30000,
  });

  const { data: newsData } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  const liveMatches = allMatchesData?.data?.live || [];
  const recentMatches = allMatchesData?.data?.recent || [];
  const upcomingMatches = allMatchesData?.data?.upcoming || [];
  const newsItems = Array.isArray(newsData?.data) ? newsData.data.slice(0, 12) : [];

  const tabMatches = activeTab === "live" ? liveMatches : activeTab === "recent" ? recentMatches : upcomingMatches;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Live Cricket Score Today - IPL 2026 & Ball by Ball"
        description="Fastest live cricket score today, ball by ball commentary, IPL 2026 live updates, T20 World Cup, ODI & Test match scorecards."
        url="/"
        keywords="live cricket score, cricket score today, IPL 2026 live score, live match today, ball by ball commentary"
        structuredData={SITE_SD}
      />

      {/* ── LIVE MATCHES STRIP ── */}
      {(liveMatches.length > 0 || matchesLoading) && (
        <div style={{ marginBottom: 20, paddingTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "livePulse 2s infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: 0.5 }}>Live Now</span>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>{liveMatches.length} match{liveMatches.length !== 1 ? "es" : ""}</span>
          </div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "thin" }}>
            {matchesLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ minWidth: 220, height: 120, borderRadius: 12, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s infinite", flexShrink: 0 }} />
                ))
              : liveMatches.map(m => <StripCard key={m.id} match={m} />)
            }
          </div>
        </div>
      )}

      {/* ── QUICK LINKS ── */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" }}>
        {QUICK_LINKS.map(l => (
          <Link key={l.to} to={l.to} style={{
            flexShrink: 0, padding: "6px 14px", borderRadius: 20,
            fontSize: 12, fontWeight: 700, color: l.color,
            background: `${l.color}18`, border: `1px solid ${l.color}40`,
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${l.color}30`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${l.color}18`; }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* ── MAIN 3-COLUMN GRID: Matches | News | Sidebar ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 280px", gap: 16, alignItems: "start" }} className="home-3col">

        {/* ── COL 1: MATCHES ── */}
        <div>
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            {/* Tab header */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { key: "live",     label: "Live",     count: liveMatches.length,     color: "#f43f5e" },
                { key: "recent",   label: "Recent",   count: recentMatches.length,   color: "#4ade80" },
                { key: "upcoming", label: "Upcoming", count: upcomingMatches.length, color: "#38bdf8" },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1, background: "none", border: "none", cursor: "pointer",
                    padding: "11px 8px", fontSize: 12, fontWeight: 700,
                    color: activeTab === tab.key ? tab.color : "var(--text-muted)",
                    borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : "2px solid transparent",
                    marginBottom: -1, transition: "color 0.2s",
                    fontFamily: "'Inter',sans-serif",
                  }}
                >
                  {tab.label}
                  <span style={{
                    marginLeft: 5, fontSize: 10,
                    background: activeTab === tab.key ? `${tab.color}20` : "rgba(255,255,255,0.05)",
                    color: activeTab === tab.key ? tab.color : "var(--text-muted)",
                    padding: "1px 6px", borderRadius: 8, fontWeight: 800,
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Match list */}
            {matchesLoading ? (
              <div style={{ padding: 32, textAlign: "center" }}>
                <div className="spinner" style={{ margin: "0 auto", width: 32, height: 32 }} />
              </div>
            ) : tabMatches.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🏏</div>
                <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                  {activeTab === "live" ? "No live matches right now." : activeTab === "recent" ? "No recent matches." : "No upcoming matches."}
                </p>
              </div>
            ) : (
              tabMatches.map(m => <MatchRow key={m.id} match={m} />)
            )}
          </div>
        </div>

        {/* ── COL 2: NEWS (middle) ── */}
        <div>
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#f43f5e,#fb7185)", display: "inline-block" }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>Latest News</span>
              </div>
              <Link to="/news" style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700, transition: "opacity 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                View All →
              </Link>
            </div>
            {newsItems.length === 0 ? (
              <div style={{ padding: "28px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
                Loading news...
              </div>
            ) : (
              newsItems.map((item, i) => <NewsCard key={item.id || i} item={item} />)
            )}
          </div>
        </div>

        {/* ── COL 3: SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Stats */}
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, fontWeight: 800, color: "var(--text)" }}>
              📊 Today
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              {[
                { label: "Live",     value: liveMatches.length,     color: "#f43f5e", bg: "rgba(244,63,94,0.08)" },
                { label: "Recent",   value: recentMatches.length,   color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
                { label: "Soon",     value: upcomingMatches.length, color: "#38bdf8", bg: "rgba(56,189,248,0.08)" },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "14px 8px", textAlign: "center",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: s.bg,
                }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: "'Poppins',sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Series & Leagues */}
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, fontWeight: 800, color: "var(--text)" }}>
              🏆 Series & Leagues
            </div>
            <div style={{ padding: "6px 0" }}>
              {QUICK_LINKS.map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "var(--text2)",
                  transition: "background 0.15s, color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: l.color, flexShrink: 0, boxShadow: `0 0 5px ${l.color}80` }} />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick nav */}
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, fontWeight: 800, color: "var(--text)" }}>
              🔗 Quick Access
            </div>
            <div style={{ padding: "6px 0" }}>
              {[
                { to: "/schedule", label: "📅 Schedule" },
                { to: "/results",  label: "📋 Results"  },
                { to: "/players",  label: "👤 Players"  },
                { to: "/teams",    label: "🏏 Teams"    },
                { to: "/series",   label: "🏆 All Series" },
                { to: "/stats",    label: "📈 Stats"    },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: "block", padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "var(--text2)",
                  transition: "background 0.15s, color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .home-3col { grid-template-columns: 1fr 1fr !important; }
          .home-3col > div:last-child { display: none; }
        }
        @media (max-width: 700px) {
          .home-3col { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.35; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
