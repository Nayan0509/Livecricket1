import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllMatches, fetchNews, fetchIPLStandings } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { trackMatchCardClick, trackWatchClick } from "../utils/analytics";
import StreamDisclaimer from "../components/StreamDisclaimer";

/* ── Structured data ── */
const SITE_SD = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Live Cricket Zone",
    "url": "https://www.livecricketzone.com",
    "description": "Live cricket scores, IPL 2026 points table, T20 World Cup, ODI & Test ball-by-ball commentary",
    "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": "https://www.livecricketzone.com/players?search={search_term_string}" }, "query-input": "required name=search_term_string" }
  },
  {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How to watch live cricket free?", "acceptedAnswer": { "@type": "Answer", "text": "Click any live match on Live Cricket Zone and hit Watch to stream free via YouTube — no signup needed." } },
      { "@type": "Question", "name": "Where is the IPL 2026 points table?", "acceptedAnswer": { "@type": "Answer", "text": "The IPL 2026 points table is on livecricketzone.com/ipl with live standings updated after every match." } }
    ]
  }
];

const FORMAT_TABS = [
  { key: "all",        label: "All" },
  { key: "ipl",        label: "IPL 2026" },
  { key: "intl",       label: "International" },
  { key: "domestic",   label: "Domestic" },
  { key: "women",      label: "Women's" },
];

function filterByFormat(matches, fmt) {
  if (fmt === "all") return matches;
  const kw = {
    ipl: ["ipl", "indian premier league"],
    intl: ["test", "odi", "t20i", "international"],
    domestic: ["county", "ranji", "domestic", "sheffield", "plunket", "odi", "sma trophy", "super smash"],
    women: ["women", "woman", "wt20", "wodi"],
  }[fmt] || [];
  return matches.filter(m =>
    kw.some(k => m.series?.toLowerCase().includes(k) || m.name?.toLowerCase().includes(k) || m.matchType?.toLowerCase().includes(k))
  );
}

/* ── IPL Points Table Widget ── */
function IPLStandingsWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["iplStandings"],
    queryFn: fetchIPLStandings,
    refetchInterval: 300000, // 5 minutes
  });

  const rows = data?.data || [];

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 3, height: 14, borderRadius: 2, background: "linear-gradient(180deg,#F59E0B,#D97706)", display: "inline-block" }} />
          IPL 2026 — Points Table
        </span>
        <Link to="/ipl" style={{ fontSize: 11, color: "#F59E0B", fontWeight: 700 }}>Full Table →</Link>
      </div>

      {isLoading ? (
        <div style={{ padding: 20, textAlign: "center" }}>
          <div className="spinner" style={{ width: 24, height: 24, margin: "0 auto" }} />
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(245,158,11,0.06)" }}>
                {["#", "Team", "P", "W", "L", "NRR", "Pts"].map(h => (
                  <th key={h} style={{ padding: "7px 10px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text3)", textAlign: h === "Team" ? "left" : "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((r, i) => (
                <tr
                  key={r.short || i}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    background: i < 4 ? "rgba(34,197,94,0.03)" : "transparent",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = i < 4 ? "rgba(34,197,94,0.03)" : "transparent"; }}
                >
                  <td style={{ padding: "8px 10px", fontSize: 10, color: i < 4 ? "#22C55E" : "var(--text-muted)", fontWeight: 700, textAlign: "center" }}>{i + 1}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${r.color}22`, border: `1.5px solid ${r.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 900, color: r.color, flexShrink: 0 }}>
                        {r.short}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", whiteSpace: "nowrap" }}>{r.short}</span>
                    </div>
                  </td>
                  <td style={{ padding: "8px 6px", fontSize: 11, color: "var(--text3)", textAlign: "center" }}>{r.p || "—"}</td>
                  <td style={{ padding: "8px 6px", fontSize: 11, color: "#22C55E", fontWeight: 700, textAlign: "center" }}>{r.w || "—"}</td>
                  <td style={{ padding: "8px 6px", fontSize: 11, color: "#F87171", textAlign: "center" }}>{r.l || "—"}</td>
                  <td style={{ padding: "8px 6px", fontSize: 10, color: "var(--text3)", textAlign: "center", whiteSpace: "nowrap" }}>{r.nrr || "—"}</td>
                  <td style={{ padding: "8px 10px", fontSize: 12, fontWeight: 900, color: i < 4 ? "#F59E0B" : "var(--text)", textAlign: "center" }}>{r.pts || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "6px 12px", fontSize: 9, color: "var(--text-muted)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ color: "#22C55E" }}>●</span> Qualify for Playoffs (Top 4)
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ICC Rankings Mini Widget ── */
const ICC_RANKS = [
  { flag: "🏏", team: "Australia",    rank: 1, rating: 128, format: "Test" },
  { flag: "🏏", team: "India",        rank: 2, rating: 119, format: "Test" },
  { flag: "🏏", team: "England",      rank: 3, rating: 113, format: "Test" },
  { flag: "🏏", team: "South Africa", rank: 4, rating: 107, format: "Test" },
];

function RankingsWidget() {
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 3, height: 14, borderRadius: 2, background: "linear-gradient(180deg,#22C55E,#16A34A)", display: "inline-block" }} />
          ICC Test Rankings
        </span>
        <Link to="/rankings" style={{ fontSize: 11, color: "#22C55E", fontWeight: 700 }}>Full Rankings →</Link>
      </div>
      <div>
        {ICC_RANKS.map(r => (
          <div key={r.team} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.03)",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 10, fontWeight: 900, color: "#22C55E", minWidth: 14 }}>{r.rank}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", flex: 1 }}>{r.team}</span>
            <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700 }}>{r.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Featured Match (largest live match) ── */
function FeaturedMatch({ match }) {
  const navigate = useNavigate();
  const t1 = match.teamInfo?.[0];
  const t2 = match.teamInfo?.[1];
  const s1 = match.score?.[0];
  const s2 = match.score?.[1];

  const TeamBlock = ({ team, score, align }) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: align === "right" ? "flex-end" : "flex-start", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: align === "right" ? "row-reverse" : "row" }}>
        {team?.img
          ? <img src={team.img} alt={team.name} style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(34,197,94,0.3)", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
          : <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#22C55E" }}>
              {team?.shortname?.slice(0, 2) || "?"}
            </div>
        }
        <div style={{ textAlign: align === "right" ? "right" : "left" }}>
          <div style={{ fontWeight: 900, fontSize: 16, color: "#fff" }}>{team?.name || team?.shortname || "TBD"}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{team?.shortname}</div>
        </div>
      </div>
      {score ? (
        <div style={{ textAlign: align === "right" ? "right" : "left" }}>
          <span style={{ fontSize: 34, fontWeight: 900, fontFamily: "'Poppins',sans-serif", color: "#22C55E", lineHeight: 1 }}>
            {score.r}/{score.w}
          </span>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500, marginLeft: 6 }}>
            ({score.o} ov)
          </span>
        </div>
      ) : (
        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>Yet to bat</span>
      )}
    </div>
  );

  return (
    <div
      onClick={() => { trackMatchCardClick(match.id, match.name, true); navigate(`/match/${match.id}`); }}
      style={{
        borderRadius: 18,
        background: "linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(34,197,94,0.3)",
        padding: "24px 28px",
        marginBottom: 14,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 40px rgba(34,197,94,0.08)",
        transition: "all 0.3s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.5)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(34,197,94,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(34,197,94,0.08)"; }}
    >
      {/* Decorative pitch lines */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "repeating-linear-gradient(90deg, #22C55E 0 1px, transparent 1px 40px)", pointerEvents: "none" }} />

      {/* Top meta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="live-chip"><span className="dot" />&nbsp;LIVE</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{match.matchType}</span>
          {match.venue && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>• {match.venue}</span>}
        </div>
        <button
          onClick={e => { e.stopPropagation(); trackWatchClick(match.id, match.name); navigate(`/match/${match.id}?watch=1`); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
            color: "#F87171", borderRadius: 100, padding: "7px 16px",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.28)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#F87171"; }}
        >
          ▶ Watch Live
        </button>
      </div>

      {/* Teams + Scores */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <TeamBlock team={t1} score={s1} align="left" />
        <div style={{
          flexShrink: 0, padding: "8px 14px", borderRadius: 10,
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
          fontSize: 12, fontWeight: 900, color: "rgba(255,255,255,0.4)",
        }}>VS</div>
        <TeamBlock team={t2} score={s2} align="right" />
      </div>

      {/* Status */}
      <div style={{
        marginTop: 18, padding: "9px 14px", borderRadius: 10,
        background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.15)",
        fontSize: 13, fontWeight: 700, color: "#4ADE80",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", animation: "livePulse 1.8s infinite", flexShrink: 0 }} />
        {match.status}
      </div>
    </div>
  );
}

/* ── Compact Match Row ── */
function MatchRow({ match }) {
  const navigate    = useNavigate();
  const isLive      = match.matchStarted && !match.matchEnded;
  const isCompleted = match.matchEnded;
  const t1 = match.teamInfo?.[0];
  const t2 = match.teamInfo?.[1];
  const s1 = match.score?.[0];
  const s2 = match.score?.[1];
  const scoreColor = isLive ? "#22C55E" : isCompleted ? "#4ADE80" : "var(--text)";

  return (
    <div
      onClick={() => { trackMatchCardClick(match.id, match.name, isLive); navigate(`/match/${match.id}`); }}
      style={{
        display: "grid", gridTemplateColumns: "1fr 48px 1fr auto",
        alignItems: "center", gap: 6, padding: "13px 16px", cursor: "pointer",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: isLive ? "rgba(34,197,94,0.03)" : "transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = isLive ? "rgba(34,197,94,0.07)" : "rgba(255,255,255,0.025)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = isLive ? "rgba(34,197,94,0.03)" : "transparent"; }}
    >
      {/* Team 1 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        {t1?.img
          ? <img src={t1.img} alt={t1.name} style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: `1.5px solid rgba(34,197,94,0.2)`, flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
          : <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "1.5px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: "#22C55E", flexShrink: 0 }}>{t1?.shortname?.slice(0, 2) || "?"}</div>
        }
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 12, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {t1?.shortname || match.teams?.[0] || "TBD"}
          </div>
          {s1 && <div style={{ fontSize: 14, fontWeight: 900, color: scoreColor, fontFamily: "'Poppins',sans-serif", lineHeight: 1.1 }}>
            {s1.r}/{s1.w} <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 500 }}>({s1.o})</span>
          </div>}
        </div>
      </div>

      {/* VS centre */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 9, fontWeight: 900, color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", borderRadius: 5, padding: "2px 4px", display: "inline-block" }}>VS</div>
        {isLive && <div style={{ marginTop: 2, fontSize: 8, color: "#22C55E", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#22C55E", animation: "livePulse 1.8s infinite" }} />LIVE
        </div>}
        {isCompleted && <div style={{ marginTop: 2, fontSize: 8, color: "#4ADE80", fontWeight: 800 }}>FIN</div>}
      </div>

      {/* Team 2 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexDirection: "row-reverse", minWidth: 0 }}>
        {t2?.img
          ? <img src={t2.img} alt={t2.name} style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(245,158,11,0.2)", flexShrink: 0 }} onError={e => { e.target.style.display = "none"; }} />
          : <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(245,158,11,0.1)", border: "1.5px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: "#F59E0B", flexShrink: 0 }}>{t2?.shortname?.slice(0, 2) || "?"}</div>
        }
        <div style={{ minWidth: 0, textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 12, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {t2?.shortname || match.teams?.[1] || "TBD"}
          </div>
          {s2 && <div style={{ fontSize: 14, fontWeight: 900, color: scoreColor, fontFamily: "'Poppins',sans-serif", lineHeight: 1.1 }}>
            {s2.r}/{s2.w} <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 500 }}>({s2.o})</span>
          </div>}
        </div>
      </div>

      {/* Watch */}
      <button
        onClick={e => { e.stopPropagation(); trackWatchClick(match.id, match.name); navigate(`/match/${match.id}?watch=1`); }}
        style={{
          display: "flex", alignItems: "center",
          background: isLive ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.07)",
          border: `1px solid ${isLive ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.18)"}`,
          color: isLive ? "#F87171" : "#22C55E",
          borderRadius: 7, padding: "5px 9px", fontSize: 11, fontWeight: 700,
          cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = isLive ? "rgba(239,68,68,0.22)" : "rgba(34,197,94,0.16)"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = isLive ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.07)"; e.currentTarget.style.color = isLive ? "#F87171" : "#22C55E"; }}
      >▶</button>
    </div>
  );
}

/* ── News card (compact sidebar-style) ── */
function NewsCard({ item, compact = false }) {
  if (compact) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
        <div style={{
          padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.03)",
          transition: "background 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 4 }}>
            {item.title}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", display: "flex", gap: 8 }}>
            <span className="news-source-badge">{item.source}</span>
            <span>{item.hoursAgo != null ? `${item.hoursAgo}h ago` : item.date}</span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
      <div style={{
        padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, gap: 8 }}>
          <span className="news-source-badge">{item.source}</span>
          <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>
            {item.hoursAgo != null ? `${item.hoursAgo}h ago` : item.date}
          </span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.5, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.title}
        </div>
        {item.description && (
          <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {item.description}
          </div>
        )}
        <Link
          to="/news"
          onClick={e => e.stopPropagation()}
          style={{ display: "inline-block", marginTop: 8, fontSize: 11, color: "#22C55E", fontWeight: 700, textDecoration: "none" }}
        >
          Read AI Article →
        </Link>
      </div>
    </a>
  );
}

const QUICK_LINKS = [
  { to: "/ipl",              label: "IPL 2026",          color: "#F59E0B" },
  { to: "/t20-world-cup",    label: "T20 World Cup",     color: "#EF4444" },
  { to: "/county-championship", label: "County 2026",   color: "#38BDF8" },
  { to: "/world-cup",        label: "ODI World Cup",     color: "#22C55E" },
  { to: "/champions-trophy", label: "Champions Trophy",  color: "#A78BFA" },
  { to: "/psl",              label: "PSL 2026",          color: "#10B981" },
  { to: "/bbl",              label: "BBL",               color: "#F97316" },
  { to: "/womens-cricket",   label: "Women's",           color: "#EC4899" },
];

export default function Home() {
  const [matchTab,   setMatchTab]   = useState("live");
  const [formatTab,  setFormatTab]  = useState("all");

  const { data: allMatchesData, isLoading: matchesLoading } = useQuery({
    queryKey: ["allMatches"],
    queryFn: fetchAllMatches,
    refetchInterval: 30000,
  });
  const { data: newsData } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
  });

  const liveMatches     = allMatchesData?.data?.live     || [];
  const recentMatches   = allMatchesData?.data?.recent   || [];
  const upcomingMatches = allMatchesData?.data?.upcoming || [];
  const newsItems       = Array.isArray(newsData?.data) ? newsData.data : [];

  const tabPool = matchTab === "live" ? liveMatches : matchTab === "recent" ? recentMatches : upcomingMatches;
  const visibleMatches = filterByFormat(tabPool, formatTab);

  // The "featured" match is the first live IPL or international match
  const featuredMatch = liveMatches.find(m =>
    m.series?.toLowerCase().includes("ipl") ||
    m.name?.toLowerCase().includes("india") ||
    m.name?.toLowerCase().includes("australia") ||
    m.name?.toLowerCase().includes("england") ||
    m.name?.toLowerCase().includes("pakistan")
  ) || liveMatches[0];

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Live Cricket Score Today — IPL 2026 Points Table, T20, ODI, Test Ball-by-Ball"
        description="Live Cricket Zone: IPL 2026 live score, points table, ball-by-ball commentary. T20 World Cup, ODI & Test matches. Watch live cricket free — updated every 15 seconds."
        url="/"
        keywords="live cricket score today, IPL 2026 live score, IPL 2026 points table, T20 World Cup live, cricket score today, watch cricket free, ball by ball cricket, IPL standings 2026"
        structuredData={SITE_SD}
      />

      {/* ── Format Quick Links ── */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginTop: 14, marginBottom: 14, scrollbarWidth: "none" }}>
        {QUICK_LINKS.map(l => (
          <Link key={l.to} to={l.to} style={{
            flexShrink: 0, padding: "6px 14px", borderRadius: 20,
            fontSize: 12, fontWeight: 700, color: l.color,
            background: `${l.color}12`, border: `1px solid ${l.color}30`,
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${l.color}24`; e.currentTarget.style.borderColor = `${l.color}55`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${l.color}12`; e.currentTarget.style.borderColor = `${l.color}30`; }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* ── MAIN LAYOUT: Left (Matches+News) + Right (Sidebar) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: 16, alignItems: "start" }} className="home-main">

        {/* ══ LEFT COLUMN ══ */}
        <div>
          {/* Featured live match */}
          {featuredMatch && <FeaturedMatch match={featuredMatch} />}

          {/* Match panel */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            {/* Status tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {[
                { key: "live",     label: "Live",     count: liveMatches.length,     color: "#EF4444" },
                { key: "recent",   label: "Recent",   count: recentMatches.length,   color: "#22C55E" },
                { key: "upcoming", label: "Upcoming", count: upcomingMatches.length, color: "#F59E0B" },
              ].map(tab => (
                <button key={tab.key} onClick={() => setMatchTab(tab.key)} style={{
                  flex: 1, background: "none", border: "none", cursor: "pointer",
                  padding: "10px 6px", fontSize: 12, fontWeight: 700,
                  color: matchTab === tab.key ? tab.color : "var(--text-muted)",
                  borderBottom: matchTab === tab.key ? `2px solid ${tab.color}` : "2px solid transparent",
                  marginBottom: -1, transition: "color 0.2s", fontFamily: "'Inter',sans-serif",
                }}>
                  {tab.label}
                  <span style={{ marginLeft: 5, fontSize: 10, background: matchTab === tab.key ? `${tab.color}18` : "rgba(255,255,255,0.04)", color: matchTab === tab.key ? tab.color : "var(--text-muted)", padding: "1px 6px", borderRadius: 8, fontWeight: 800 }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Format filter */}
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "0 12px", overflowX: "auto", scrollbarWidth: "none" }}>
              {FORMAT_TABS.map(f => (
                <button key={f.key} onClick={() => setFormatTab(f.key)} style={{
                  background: "none", border: "none", cursor: "pointer", padding: "8px 12px",
                  fontSize: 11, fontWeight: formatTab === f.key ? 800 : 600,
                  color: formatTab === f.key ? "#22C55E" : "var(--text3)",
                  borderBottom: formatTab === f.key ? "2px solid #22C55E" : "2px solid transparent",
                  marginBottom: -1, transition: "color 0.2s", whiteSpace: "nowrap",
                  fontFamily: "'Inter',sans-serif",
                }}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Match list */}
            {matchesLoading
              ? <div style={{ padding: 28, textAlign: "center" }}><div className="spinner" style={{ margin: "0 auto", width: 28, height: 28 }} /></div>
              : visibleMatches.length === 0
              ? <div style={{ padding: "28px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🏏</div>
                  <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    No {matchTab === "live" ? "live" : matchTab === "recent" ? "recent" : "upcoming"} {formatTab !== "all" ? FORMAT_TABS.find(f => f.key === formatTab)?.label : ""} matches right now.
                  </p>
                </div>
              : visibleMatches.map(m => <MatchRow key={m.id} match={m} />)
            }
          </div>

          {/* ── AD: Below match panel ── */}
          <AdBanner type="auto" />

          {/* ── NEWS FEED (below matches on left) ── */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#F59E0B,#D97706)", display: "inline-block" }} />
                Cricket News Today
              </span>
              <Link to="/news" style={{ fontSize: 11, color: "#22C55E", fontWeight: 700 }}>View All →</Link>
            </div>

            {newsItems.length === 0
              ? <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>Loading news…</div>
              : <>
                  {newsItems.slice(0, 5).map((item, i) => <NewsCard key={item.id || i} item={item} />)}
                  <div style={{ padding: "10px 12px" }}><AdBanner type="auto" /></div>
                  {newsItems.slice(5, 10).map((item, i) => <NewsCard key={item.id || (i + 5)} item={item} />)}
                </>
            }
          </div>
        </div>

        {/* ══ RIGHT SIDEBAR ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Today stats */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 11, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "linear-gradient(180deg,#22C55E,#16A34A)", display: "inline-block" }} />
              Today's Cricket
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              {[
                { label: "Live",   v: liveMatches.length,     c: "#EF4444", bg: "rgba(239,68,68,0.07)" },
                { label: "Recent", v: recentMatches.length,   c: "#22C55E", bg: "rgba(34,197,94,0.07)" },
                { label: "Soon",   v: upcomingMatches.length, c: "#F59E0B", bg: "rgba(245,158,11,0.07)" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "12px 6px", textAlign: "center", background: s.bg, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.c, fontFamily: "'Poppins',sans-serif" }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* IPL Points Table */}
          <IPLStandingsWidget />

          {/* Ad rectangle */}
          <AdBanner type="rectangle" />

          {/* ICC Rankings */}
          <RankingsWidget />

          {/* Series & Leagues */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 11, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "linear-gradient(180deg,#F59E0B,#D97706)", display: "inline-block" }} />
              Series &amp; Leagues
            </div>
            <div style={{ padding: "4px 0" }}>
              {QUICK_LINKS.map(l => (
                <Link key={l.to} to={l.to} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "var(--text2)",
                  transition: "background 0.15s, color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.05)"; e.currentTarget.style.color = "#22C55E"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, boxShadow: `0 0 5px ${l.color}70`, flexShrink: 0 }} />
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick nav */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 11, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "linear-gradient(180deg,#22C55E,#16A34A)", display: "inline-block" }} />
              Quick Access
            </div>
            <div style={{ padding: "4px 0" }}>
              {[
                ["📅 Schedule",   "/schedule"],
                ["📋 Results",    "/results"],
                ["👤 Players",    "/players"],
                ["🏏 Teams",      "/teams"],
                ["🏆 All Series", "/series"],
                ["📈 Stats",      "/stats"],
                ["📰 News",       "/news"],
                ["📊 Rankings",   "/rankings"],
              ].map(([label, to]) => (
                <Link key={to} to={to} style={{
                  display: "block", padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "var(--text2)",
                  transition: "background 0.15s, color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.05)"; e.currentTarget.style.color = "#22C55E"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent news (compact sidebar) */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text)" }}>Latest News</span>
              <Link to="/news" style={{ fontSize: 10, color: "#22C55E", fontWeight: 700 }}>More →</Link>
            </div>
            {newsItems.slice(0, 6).map((item, i) => (
              <NewsCard key={item.id || i} item={item} compact />
            ))}
          </div>
        </div>
      </div>

      <StreamDisclaimer />

      {/* ── Ad above SEO section ── */}
      <div style={{ marginTop: 24 }}><AdBanner type="auto" /></div>

      {/* ── SEO Content Block ── */}
      <section aria-label="About Live Cricket Zone" style={{
        marginTop: 16, padding: "22px 24px", borderRadius: 14,
        background: "rgba(255,255,255,0.015)", border: "1px solid rgba(34,197,94,0.06)",
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 3, background: "linear-gradient(180deg,#16A34A,#22C55E)", display: "inline-block" }} />
          Live Cricket Score Today — IPL 2026, T20 &amp; All Formats
        </h2>
        <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.8, marginBottom: 8 }}>
          Live Cricket Zone delivers the fastest live cricket scores updated every 15 seconds with full ball-by-ball commentary. Follow <strong style={{ color: "var(--text2)" }}>IPL 2026 live score and points table</strong>, T20 World Cup, ODI & Test matches worldwide. Watch live cricket streaming free via YouTube — no account needed.
        </p>
        <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.8 }}>
          Coverage includes: <strong style={{ color: "var(--text2)" }}>IPL 2026, T20 World Cup, ODI World Cup, Asia Cup, Champions Trophy, PSL, BBL, CPL, County Championship</strong>, Ranji Trophy, and all international series between all ICC member nations.
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
          {["IPL 2026 Points Table", "IPL Live Score", "T20 Live Score", "Cricket Score Today", "Ball by Ball", "Watch Cricket Free", "ODI Live", "Test Match Live", "ICC Rankings 2026", "Cricket News Today"].map(tag => (
            <span key={tag} style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.14)", color: "rgba(74,222,128,0.8)" }}>{tag}</span>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .home-main { grid-template-columns: 1fr !important; }
        }
        @keyframes skeletonPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}
