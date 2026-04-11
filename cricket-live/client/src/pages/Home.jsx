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
  { to: "/ipl", label: "IPL 2026", color: "#4F46E5" },
  { to: "/t20-world-cup", label: "T20 WC", color: "#EC4899" },
  { to: "/world-cup", label: "World Cup", color: "#F59E0B" },
  { to: "/champions-trophy", label: "Champions Trophy", color: "#14B8A6" },
  { to: "/psl", label: "PSL", color: "#10B981" },
  { to: "/bbl", label: "BBL", color: "#F97316" },
  { to: "/womens-cricket", label: "Women's", color: "#D946EF" },
  { to: "/rankings", label: "Rankings", color: "#6366F1" },
];

/* ── Compact match strip card ── */
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
        minWidth: 220, maxWidth: 220, cursor: "pointer",
        background: isLive ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isLive ? "rgba(239,68,68,0.25)" : "var(--glass-border)"}`,
        borderRadius: 12, padding: "14px 16px",
        transition: "all 0.2s", flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = isLive ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = isLive ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.03)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {match.matchType}
        </span>
        {isLive
          ? <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "livePulse 2s infinite" }} />
              LIVE
            </span>
          : match.matchEnded
          ? <span style={{ fontSize: 10, color: "var(--accent-green)", fontWeight: 700 }}>FINAL</span>
          : <span style={{ fontSize: 10, color: "var(--accent-teal)", fontWeight: 700 }}>UPCOMING</span>
        }
      </div>

      {/* Team rows */}
      {[{ team: t1, score: s1 }, { team: t2, score: s2 }].map(({ team, score }, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {team?.img
              ? <img src={team.img} alt={team.name} style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
              : <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "var(--primary-light)" }}>{team?.shortname?.slice(0, 2) || "?"}</div>
            }
            <span style={{ fontSize: 13, fontWeight: 700 }}>{team?.shortname || "TBD"}</span>
          </div>
          {score && (
            <span style={{ fontSize: 13, fontWeight: 900, color: isLive ? "var(--primary-light)" : "var(--text)" }}>
              {score.r}/{score.w}
              <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 500, marginLeft: 4 }}>({score.o})</span>
            </span>
          )}
        </div>
      ))}

      <div style={{ marginTop: 10, fontSize: 11, color: isLive ? "var(--primary-light)" : "var(--text3)", fontWeight: 600, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
        {match.status}
      </div>
    </div>
  );
}

/* ── Full match row (main list) ── */
function MatchRow({ match }) {
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
        display: "grid", gridTemplateColumns: "1fr auto 1fr auto",
        alignItems: "center", gap: 12,
        padding: "14px 20px", cursor: "pointer",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s",
        background: isLive ? "rgba(239,68,68,0.03)" : "transparent",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = isLive ? "rgba(239,68,68,0.03)" : "transparent"; }}
    >
      {/* Team 1 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {t1?.img
          ? <img src={t1.img} alt={t1.name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--glass-border)" }} onError={e => e.target.style.display = "none"} />
          : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "var(--primary-light)" }}>{t1?.shortname?.slice(0, 2) || "?"}</div>
        }
        <div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{t1?.shortname || match.teams?.[0] || "TBD"}</div>
          {s1 && <div style={{ fontSize: 15, fontWeight: 900, color: isLive ? "var(--primary-light)" : "var(--text)" }}>{s1.r}/{s1.w} <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 500 }}>({s1.o})</span></div>}
        </div>
      </div>

      {/* VS */}
      <div style={{ textAlign: "center", padding: "0 8px" }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: "var(--text3)", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "4px 8px" }}>VS</div>
        {isLive && <div style={{ fontSize: 9, color: "#ef4444", fontWeight: 800, marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "livePulse 2s infinite" }} />LIVE
        </div>}
      </div>

      {/* Team 2 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse", textAlign: "right" }}>
        {t2?.img
          ? <img src={t2.img} alt={t2.name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--glass-border)" }} onError={e => e.target.style.display = "none"} />
          : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "var(--secondary)" }}>{t2?.shortname?.slice(0, 2) || "?"}</div>
        }
        <div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{t2?.shortname || match.teams?.[1] || "TBD"}</div>
          {s2 && <div style={{ fontSize: 15, fontWeight: 900, color: isLive ? "var(--primary-light)" : "var(--text)" }}>{s2.r}/{s2.w} <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 500 }}>({s2.o})</span></div>}
        </div>
      </div>

      {/* Status + meta */}
      <div style={{ textAlign: "right", minWidth: 120 }}>
        <div style={{ fontSize: 11, color: isLive ? "var(--primary-light)" : match.matchEnded ? "var(--accent-green)" : "var(--accent-teal)", fontWeight: 700, marginBottom: 4 }}>
          {isLive ? "🔴 LIVE" : match.matchEnded ? "✅ FINAL" : "📅 UPCOMING"}
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.4, maxWidth: 160, marginLeft: "auto", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {match.status}
        </div>
        {match.venue && <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>📍 {match.venue.split(",")[0]}</div>}
      </div>
    </div>
  );
}

/* ── News card ── */
function NewsCard({ item }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
      <div style={{
        padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: "var(--primary-light)", fontWeight: 800, textTransform: "uppercase" }}>{item.source}</span>
          <span style={{ fontSize: 10, color: "var(--text3)" }}>{item.hoursAgo != null ? `${item.hoursAgo}h ago` : item.date}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
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
        title="Live Cricket Score Today - Ball by Ball Commentary, IPL 2026 & Live Match Updates"
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

      {/* ── MAIN GRID ── */}
      <div className="home-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

        {/* ── LEFT: MATCHES + NEWS ── */}
        <div>
          {/* Match tabs */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
            {/* Tab header */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--glass-border)" }}>
              {[
                { key: "live", label: "Live", count: liveMatches.length, color: "#ef4444" },
                { key: "recent", label: "Recent", count: recentMatches.length, color: "var(--accent-teal)" },
                { key: "upcoming", label: "Upcoming", count: upcomingMatches.length, color: "var(--accent-orange)" },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1, background: "none", border: "none", cursor: "pointer",
                    padding: "12px 16px", fontSize: 13, fontWeight: 700,
                    color: activeTab === tab.key ? tab.color : "var(--text3)",
                    borderBottom: activeTab === tab.key ? `2px solid ${tab.color}` : "2px solid transparent",
                    marginBottom: -1, transition: "all 0.2s",
                  }}
                >
                  {tab.label}
                  <span style={{ marginLeft: 6, fontSize: 11, background: activeTab === tab.key ? `${tab.color}22` : "rgba(255,255,255,0.06)", color: activeTab === tab.key ? tab.color : "var(--text3)", padding: "1px 7px", borderRadius: 10, fontWeight: 800 }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Match list */}
            {matchesLoading ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <div className="spinner" style={{ margin: "0 auto" }} />
              </div>
            ) : tabMatches.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🏏</div>
                <p style={{ color: "var(--text3)", fontSize: 14 }}>
                  {activeTab === "live" ? "No live matches right now." : activeTab === "recent" ? "No recent matches." : "No upcoming matches scheduled."}
                </p>
              </div>
            ) : (
              tabMatches.map(m => <MatchRow key={m.id} match={m} />)
            )}
          </div>

          {/* News section */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--glass-border)" }}>
              <span style={{ fontSize: 14, fontWeight: 800 }}>📰 Latest News</span>
              <Link to="/news" style={{ fontSize: 12, color: "var(--primary-light)", fontWeight: 700 }}>View All →</Link>
            </div>
            {newsItems.length === 0 ? (
              <div style={{ padding: "30px 20px", textAlign: "center", color: "var(--text3)", fontSize: 13 }}>Loading news...</div>
            ) : (
              newsItems.map((item, i) => <NewsCard key={item.id || i} item={item} />)
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Stats widget */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--glass-border)", fontSize: 14, fontWeight: 800 }}>📊 Today's Stats</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
              {[
                { label: "Live", value: liveMatches.length, color: "#ef4444" },
                { label: "Recent", value: recentMatches.length, color: "var(--accent-orange)" },
                { label: "Upcoming", value: upcomingMatches.length, color: "var(--accent-teal)" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "16px 12px", textAlign: "center", borderRight: i < 2 ? "1px solid var(--glass-border)" : "none" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Series links */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--glass-border)", fontSize: 14, fontWeight: 800 }}>🏆 Series & Leagues</div>
            <div style={{ padding: "8px 0" }}>
              {QUICK_LINKS.map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 20px", fontSize: 13, fontWeight: 600, color: "var(--text2)",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick nav */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--glass-border)", fontSize: 14, fontWeight: 800 }}>🔗 Quick Access</div>
            <div style={{ padding: "8px 0" }}>
              {[
                { to: "/schedule", label: "📅 Schedule" },
                { to: "/results", label: "📋 Results" },
                { to: "/players", label: "👤 Players" },
                { to: "/teams", label: "🏏 Teams" },
                { to: "/series", label: "🏆 All Series" },
                { to: "/stats", label: "📈 Stats" },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: "block", padding: "10px 20px", fontSize: 13, fontWeight: 600, color: "var(--text2)",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .home-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        ::-webkit-scrollbar { height: 4px; width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>
    </div>
  );
}
