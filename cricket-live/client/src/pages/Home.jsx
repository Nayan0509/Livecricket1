import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchAllMatches, fetchNews, fetchIPLStandings, fetchRankings, fetchSportMatches, fetchSportNews, subscribeLiveMatchStream } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { MotionGrid, MotionItem } from "../components/MotionGrid";
import { trackMatchCardClick } from "../utils/analytics";
import ContentBlocks, { Faq } from "../components/ContentBlocks";
import { HOME } from "../content/pages";
import { GUIDES } from "../content/guides";

// Guides featured on the homepage, in display order.
const HOME_GUIDES = [
  "how-to-read-a-cricket-scorecard",
  "dls-method-explained",
  "net-run-rate-explained",
  "drs-explained",
].map(slug => GUIDES.find(g => g.slug === slug)).filter(Boolean);

/* ── Structured data ── */
const SITE_SD = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Live Cricket Zone",
    "url": "https://www.livecricketzone.com",
    "description": "Live cricket scores and scorecards, plus plain-English guides to how cricket works."
  }
];

const SPORT_SWITCH = [
  { key: "cricket",    label: "Cricket"    },
  { key: "football",   label: "Football"   },
  { key: "basketball", label: "Basketball" },
  { key: "tennis",     label: "Tennis"     },
];

const FORMAT_TABS = [
  { key: "all",      label: "All" },
  { key: "ipl",      label: "IPL" },
  { key: "intl",     label: "International" },
  { key: "domestic", label: "Domestic" },
  { key: "women",    label: "Women's" },
];

function filterByFormat(matches, fmt) {
  if (fmt === "all") return matches;
  const kw = {
    ipl:      ["ipl", "indian premier league"],
    intl:     ["test", "odi", "t20i", "international"],
    domestic: ["county", "ranji", "domestic", "sheffield", "plunket", "super smash"],
    women:    ["women", "woman", "wt20", "wodi"],
  }[fmt] || [];
  return matches.filter(m =>
    kw.some(k => m.series?.toLowerCase().includes(k) || m.name?.toLowerCase().includes(k) || m.matchType?.toLowerCase().includes(k))
  );
}

/* ── Live Dot ── */
function LiveDot() {
  return (
    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#d1202a", display: "inline-block", animation: "livePulse 1.5s infinite", marginRight: 5 }} />
  );
}

/* ── Score Bar ── */
function ScoreBar({ score }) {
  if (!score?.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {score.map((s, i) => (
        <span key={i} style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", background: "rgba(15,23,42,0.07)", padding: "3px 8px", borderRadius: 6 }}>
          {s.inning?.split(" ")[0] || ""} {s.r}/{s.w} ({s.o} ov)
        </span>
      ))}
    </div>
  );
}

/* ── Match Card ── */
function MatchCard({ match, onClick }) {
  const isLive = match.matchStarted && !match.matchEnded;
  const isCompleted = match.matchEnded;
  const [t1, t2] = match.teamInfo || [];

  const statusColor = isLive ? "#d1202a" : isCompleted ? "var(--text3)" : "#0b63c4";
  const statusBg = isLive ? "rgba(209,32,42,0.1)" : isCompleted ? "rgba(15,23,42,0.04)" : "rgba(96,165,250,0.1)";

  return (
    <div
      className="match-card-cb"
      onClick={onClick}
      style={{ cursor: "pointer", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", transition: "all 0.2s", position: "relative" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(209,32,42,0.3)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      {/* Top strip */}
      <div style={{ height: 2, background: isLive ? "linear-gradient(90deg,#d1202a,#c2410c)" : isCompleted ? "rgba(15,23,42,0.08)" : "linear-gradient(90deg,#0b7a55,#0b63c4)" }} />

      <div style={{ padding: "12px 14px" }}>
        {/* Series + status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5, maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {match.series || match.matchType || "Cricket"}
          </span>
          <span style={{ fontSize: 10, fontWeight: 800, color: statusColor, background: statusBg, padding: "2px 7px", borderRadius: 20, display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
            {isLive && <LiveDot />}
            {isLive ? "LIVE" : isCompleted ? "Result" : "Upcoming"}
          </span>
        </div>

        {/* Teams */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[t1, t2].map((team, i) => {
            const sc = match.score?.[i] || match.score?.[i * 2] || null;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  {team?.img ? (
                    <img src={team.img} alt={team.name} style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", background: "rgba(15,23,42,0.05)" }}
                      onError={e => { e.target.style.display = "none"; }} />
                  ) : (
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(15,23,42,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, color: "var(--text3)" }}>
                      {(team?.shortname || team?.name || "?").slice(0, 2)}
                    </div>
                  )}
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                    {team?.shortname || team?.name || match.teams?.[i] || "TBA"}
                  </span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {sc ? `${sc.r}/${sc.w}` : match.matchStarted ? "-" : ""}
                  {sc?.o ? <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, marginLeft: 3 }}>({sc.o})</span> : null}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status text */}
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--divider)" }}>
          <p style={{ fontSize: 11, color: isLive ? "#c81e28" : "var(--text3)", fontWeight: isLive ? 700 : 500, margin: 0, lineHeight: 1.4 }}>
            {match.status || (match.matchStarted ? "In Progress" : `${match.date || ""}`)}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Generic team-vs-team match card (football/basketball/tennis) ── */
function GenericMatchCard({ match }) {
  const [a, b] = match.teams || [];
  const isLive = match.isLive;
  const statusColor = isLive ? "#d1202a" : match.matchEnded ? "var(--text3)" : "#0b63c4";
  const statusBg = isLive ? "rgba(209,32,42,0.1)" : match.matchEnded ? "rgba(15,23,42,0.04)" : "rgba(96,165,250,0.1)";

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ height: 2, background: isLive ? "linear-gradient(90deg,#d1202a,#c2410c)" : match.matchEnded ? "rgba(15,23,42,0.08)" : "linear-gradient(90deg,#0b7a55,#0b63c4)" }} />
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5, maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {match.league}
          </span>
          <span style={{ fontSize: 10, fontWeight: 800, color: statusColor, background: statusBg, padding: "2px 7px", borderRadius: 20, display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
            {isLive && <LiveDot />}
            {isLive ? "LIVE" : match.matchEnded ? "Result" : "Upcoming"}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[a, b].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{t?.name || "TBD"}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{t?.score || ""}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--divider)" }}>
          <p style={{ fontSize: 11, color: isLive ? "#c81e28" : "var(--text3)", fontWeight: isLive ? 700 : 500, margin: 0, lineHeight: 1.4 }}>
            {match.status}{match.venue ? ` — ${match.venue}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Home content for a non-cricket sport tab ── */
const SPORT_NAMES = { football: "Football", basketball: "Basketball", tennis: "Tennis" };
const SPORT_PAGE = { football: "/football", basketball: "/basketball", tennis: "/tennis" };

function OtherSportContent({ sport, data, news, loading }) {
  const name = SPORT_NAMES[sport] || sport;
  const { live = [], upcoming = [], recent = [] } = data;

  if (loading) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <div className="spinner" style={{ margin: "0 auto", width: 32, height: 32 }} />
        <p style={{ color: "var(--text3)", marginTop: 12, fontSize: 13 }}>Loading {name.toLowerCase()} scores…</p>
      </div>
    );
  }

  return (
    <>
      {live.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <SectionHeader title={`${name} — Live Now`} link={SPORT_PAGE[sport]} linkLabel="Full Page →" accent="#d1202a" />
          <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
            {live.map(m => <MotionItem key={m.id}><GenericMatchCard match={m} /></MotionItem>)}
          </MotionGrid>
        </section>
      )}

      <AdBanner type="leaderboard" />

      {news.length > 0 && (
        <section style={{ marginBottom: 24, marginTop: 20 }}>
          <SectionHeader title={`${name} News`} accent="#0b7a55" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {news.slice(0, 6).map(n => (
              <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "var(--card)", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{n.title}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <SectionHeader title="Recent Results" accent="#6d28d9" />
          <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
            {recent.slice(0, 6).map(m => <MotionItem key={m.id}><GenericMatchCard match={m} /></MotionItem>)}
          </MotionGrid>
        </section>
      )}

      {upcoming.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <SectionHeader title="Upcoming" link={SPORT_PAGE[sport]} linkLabel="Full Page →" accent="#b45309" />
          <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
            {upcoming.slice(0, 6).map(m => <MotionItem key={m.id}><GenericMatchCard match={m} /></MotionItem>)}
          </MotionGrid>
        </section>
      )}

      {live.length === 0 && upcoming.length === 0 && recent.length === 0 && (
        <div style={{ padding: "60px 24px", textAlign: "center", background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--text)", marginBottom: 8, fontSize: 18 }}>No {name.toLowerCase()} matches found right now</h3>
          <p style={{ color: "var(--text3)", fontSize: 13 }}>Check back soon, or visit the full <Link to={SPORT_PAGE[sport]} style={{ color: "#0b7a55" }}>{name} page</Link>.</p>
        </div>
      )}
    </>
  );
}


/* ── IPL Points Table Widget ── */
function IPLStandingsWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ["iplStandings"],
    queryFn: fetchIPLStandings,
    refetchInterval: 300000,
  });
  // Only the current season's table; outside the season the feed is empty.
  const rows = Array.isArray(data?.data) ? data.data : [];
  const season = rows[0]?.season;

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid var(--divider)" }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 3, height: 14, borderRadius: 2, background: "#d1202a", display: "inline-block" }} />
            IPL Points Table
          </span>
          {season && (
            <span style={{ fontSize: 9, color: "var(--text3)", fontWeight: 700, marginLeft: 9, textTransform: "uppercase" }}>{season}</span>
          )}
        </div>
        <Link to="/ipl" style={{ fontSize: 11, color: "#d1202a", fontWeight: 700, textDecoration: "none" }}>Full Table →</Link>
      </div>
      {isLoading && rows.length === 0 ? (
        <div style={{ padding: 20, textAlign: "center" }}><div className="spinner" style={{ width: 20, height: 20, margin: "0 auto" }} /></div>
      ) : rows.length === 0 ? (
        <p style={{ padding: "14px", margin: 0, fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
          The table appears here while the IPL season is being played, usually from late March to the end of May.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(209,32,42,0.05)" }}>
                {["#", "Team", "P", "W", "L", "NRR", "Pts"].map(h => (
                  <th key={h} style={{ padding: "7px 10px", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text3)", textAlign: h === "Team" ? "left" : "center", borderBottom: "1px solid var(--divider)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((r, i) => (
                <tr key={r.short || i} style={{ borderBottom: "1px solid rgba(15,23,42,0.03)", background: i < 4 ? "rgba(209,32,42,0.03)" : "transparent", transition: "background 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,23,42,0.03)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = i < 4 ? "rgba(209,32,42,0.03)" : "transparent"; }}>
                  <td style={{ padding: "8px 10px", fontSize: 11, color: i < 4 ? "#d1202a" : "var(--text3)", fontWeight: 700, textAlign: "center" }}>{i + 1}</td>
                  <td style={{ padding: "8px 10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${r.color}22`, border: `1.5px solid ${r.color}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 900, color: r.color, flexShrink: 0 }}>
                        {r.short?.slice(0, 3)}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap" }}>{r.short}</span>
                    </div>
                  </td>
                  {["p", "w", "l", "nrr", "pts"].map(k => (
                    <td key={k} style={{ padding: "8px 10px", textAlign: "center", fontSize: 11, fontWeight: k === "pts" ? 900 : 600, color: k === "pts" ? "#d1202a" : k === "nrr" ? (String(r[k]).startsWith("+") ? "#15803d" : "#c81e28") : "var(--text2)" }}>
                      {r[k]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Rankings Widget ── */
function RankingsWidget() {
  const [format, setFormat] = useState("tests");
  const { data, isLoading } = useQuery({
    queryKey: ["rankings-widget", "batting", format, "men"],
    queryFn: () => fetchRankings("batting", format, "men"),
    staleTime: 3600000,
  });
  const ranks = data?.response || [];

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid var(--divider)" }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 3, height: 14, borderRadius: 2, background: "#0b7a55", display: "inline-block" }} />
          ICC Rankings — Batting
        </span>
        <Link to="/rankings" style={{ fontSize: 11, color: "#0b7a55", fontWeight: 700, textDecoration: "none" }}>Full →</Link>
      </div>
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--divider)" }}>
        {["tests", "odis", "t20s"].map(f => (
          <button key={f} onClick={() => setFormat(f)} style={{ flex: 1, background: "none", border: "none", padding: "8px 4px", fontSize: 10, fontWeight: format === f ? 800 : 600, color: format === f ? "#0b7a55" : "var(--text3)", borderBottom: format === f ? "2px solid #0b7a55" : "2px solid transparent", cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {f === "tests" ? "Test" : f === "odis" ? "ODI" : "T20"}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div style={{ padding: 16, textAlign: "center" }}><div className="spinner" style={{ width: 18, height: 18, margin: "0 auto" }} /></div>
      ) : (
        <div>
          {ranks.slice(0, 5).map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderBottom: i < 4 ? "1px solid rgba(15,23,42,0.04)" : "none" }}>
              <span style={{ width: 18, textAlign: "center", fontSize: 11, fontWeight: 800, color: i < 3 ? "#d1202a" : "var(--text3)" }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{r.name}</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>{r.country}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 900, color: "#0b7a55", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{r.rating}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── News cards: headline, source and age (the feed carries no images) ── */
function newsAge(item) {
  return item.hoursAgo < 24 ? `${item.hoursAgo}h ago` : `${Math.floor((item.hoursAgo || 0) / 24)}d ago`;
}

function NewsCardSidebar({ item }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", padding: "10px 0", borderBottom: "1px solid var(--divider)" }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.45, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {item.title}
      </p>
      <span style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, display: "block" }}>{item.source} · {newsAge(item)}</span>
    </a>
  );
}

function NewsCardFeatured({ item }) {
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.45, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</h3>
      <span style={{ fontSize: 11, color: "var(--text3)" }}>{item.source} · {newsAge(item)}</span>
    </a>
  );
}

/* ── Trending Topics — derived from real live/upcoming/recent series, not a fixed list ── */
function deriveTrendingTopics(matches) {
  const counts = {};
  matches.forEach(m => {
    const s = (m.series || m.matchType || "").trim();
    if (s) counts[s] = (counts[s] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);
}

function TrendingChips({ topics }) {
  const navigate = useNavigate();
  if (!topics.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {topics.map(t => (
        <button key={t} onClick={() => navigate(`/players?search=${encodeURIComponent(t)}`)} style={{ padding: "6px 13px", borderRadius: 20, background: "var(--card)", border: "1px solid rgba(15,23,42,0.09)", color: "var(--text2)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Inter',sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(209,32,42,0.1)"; e.currentTarget.style.borderColor = "rgba(209,32,42,0.25)"; e.currentTarget.style.color = "#d1202a"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(15,23,42,0.04)"; e.currentTarget.style.borderColor = "rgba(15,23,42,0.09)"; e.currentTarget.style.color = "var(--text2)"; }}>
          {t}
        </button>
      ))}
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ title, link, linkLabel, accent = "#d1202a" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 3, height: 16, borderRadius: 2, background: accent, display: "inline-block" }} />
        {title}
      </h2>
      {link && (
        <Link to={link} style={{ fontSize: 12, color: accent, fontWeight: 700, textDecoration: "none" }}>{linkLabel || "View all →"}</Link>
      )}
    </div>
  );
}

/* ── Fantasy Promo Card ── */
function FantasyPromoCard() {
  return (
    <div style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(11,99,196,0.08) 100%)", border: "1px solid rgba(109,40,217,0.2)", borderRadius: 12, padding: "16px 18px", marginTop: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: "#0b7a55", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Fantasy Cricket</div>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", margin: "0 0 8px", lineHeight: 1.4 }}>Build Your Dream Team</h3>
      <p style={{ fontSize: 12, color: "var(--text3)", margin: "0 0 12px", lineHeight: 1.6 }}>How fantasy points are scored and how to think about captaincy and team balance.</p>
      <Link to="/fantasy" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "rgba(109,40,217,0.2)", border: "1px solid rgba(109,40,217,0.35)", color: "#0b7a55", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
        Fantasy Guide →
      </Link>
    </div>
  );
}

/* ── Quick Links ── */
function QuickLinks() {
  const LINKS = [
    { label: "Live scores", to: "/live" },
    { label: "Schedule", to: "/schedule" },
    { label: "Results", to: "/results" },
    { label: "Series", to: "/series" },
    { label: "Rankings", to: "/rankings" },
    { label: "Guides", to: "/guides" },
    { label: "Calculators", to: "/tools" },
  ];
  return (
    <nav aria-label="Sections" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      {LINKS.map(l => (
        <Link key={l.to} to={l.to} style={{ padding: "7px 14px", fontSize: 13, fontWeight: 600, color: "var(--text2)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, textDecoration: "none" }}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

/* ── Editorial Section & FAQ Accordion for AdSense ── */
function HomeEditorialSection() {
  return (
    <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
      <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", marginBottom: 12 }}>About this site</h2>
        <ContentBlocks blocks={HOME.intro.map(text => ({ type: "p", text }))} />
      </section>
      <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "8px 24px 16px" }}>
        <Faq title="Frequently asked questions" items={HOME.faq} />
      </section>
    </div>
  );
}

/* ── Main Export ── */
export default function Home() {
  const navigate = useNavigate();
  const [fmt, setFmt] = useState("all");
  const [activeSport, setActiveSport] = useState("cricket");
  const queryClient = useQueryClient();

  const { data: matchData, isLoading } = useQuery({
    queryKey: ["allMatches"],
    queryFn: fetchAllMatches,
    refetchInterval: 30000,
    enabled: activeSport === "cricket",
  });

  useEffect(() => {
    if (activeSport !== "cricket") return;
    const unsubscribe = subscribeLiveMatchStream((streamData) => {
      if (streamData && (streamData.live || streamData.recent || streamData.upcoming)) {
        queryClient.setQueryData(["allMatches"], { data: streamData });
      }
    });
    return () => unsubscribe();
  }, [activeSport, queryClient]);

  const { data: newsData } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    staleTime: 300000,
    enabled: activeSport === "cricket",
  });

  const { data: otherSportMatches, isLoading: otherSportLoading } = useQuery({
    queryKey: ["sportMatches", activeSport],
    queryFn: () => fetchSportMatches(activeSport),
    refetchInterval: 30000,
    enabled: activeSport !== "cricket",
  });

  const { data: otherSportNews } = useQuery({
    queryKey: ["sportNews", activeSport],
    queryFn: () => fetchSportNews(activeSport),
    staleTime: 300000,
    enabled: activeSport !== "cricket",
  });

  const allMatches = matchData?.data || {};
  const liveRaw = allMatches.live || [];
  const recentRaw = allMatches.recent || [];
  const upcomingRaw = allMatches.upcoming || [];
  const allList = [...liveRaw, ...recentRaw, ...upcomingRaw];

  const filtered = filterByFormat(allList, fmt);
  const filteredLive = filtered.filter(m => m.matchStarted && !m.matchEnded);
  const filteredRecent = filtered.filter(m => m.matchEnded);
  const filteredUpcoming = filtered.filter(m => !m.matchStarted);

  const newsItems = newsData?.data || [];

  const goToMatch = (m) => {
    trackMatchCardClick(m.id, m.name);
    navigate(`/match/${m.id}`);
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 12px 60px" }}>
      <SEO url="/" structuredData={SITE_SD} />

      {/* Page H1. Visually compact but a real heading — the homepage previously
          rendered no <h1> at all, which costs the site its clearest on-page
          topic signal. Reflects the sport the visitor is actually viewing. */}
      <h1 style={{
        fontSize: 19, fontWeight: 800, letterSpacing: "-0.01em",
        color: "var(--text)", margin: "14px 0 4px",
      }}>
        {activeSport === "cricket"
          ? HOME.h1
          : `${SPORT_NAMES[activeSport]} Live Scores, Fixtures & Results`}
      </h1>

      {/* Sport Switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, marginTop: 8, flexWrap: "wrap" }}>
        {SPORT_SWITCH.map(s => {
          const active = activeSport === s.key;
          return (
            <button key={s.key} onClick={() => setActiveSport(s.key)} className="font-hud" style={{
              position: "relative", padding: "7px 18px", borderRadius: 20, fontSize: 14,
              fontWeight: active ? 700 : 500,
              background: "var(--card)",
              border: `1px solid ${active ? "rgba(11,99,196,0.35)" : "rgba(15,23,42,0.09)"}`,
              color: active ? "#1a2027" : "var(--text2)", cursor: "pointer", overflow: "hidden",
            }}>
              {active && (
                <motion.div
                  layoutId="sport-switch-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  style={{ position: "absolute", inset: 0, background: "var(--gradient-primary)", opacity: 0.28 }}
                />
              )}
              <span style={{ position: "relative" }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Format Tabs (cricket only) */}
      {activeSport === "cricket" && (
        <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "1px solid var(--divider)", overflowX: "auto", scrollbarWidth: "none" }}>
          {FORMAT_TABS.map(t => (
            <button key={t.key} onClick={() => setFmt(t.key)} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: "10px 18px", fontSize: 13, fontWeight: fmt === t.key ? 800 : 600, color: fmt === t.key ? "#d1202a" : "var(--text3)", borderBottom: `2px solid ${fmt === t.key ? "#d1202a" : "transparent"}`, transition: "all 0.18s", fontFamily: "'Inter',sans-serif" }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* 2-column layout: main (65%) + sidebar (35%) */}
      <div className="home-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: 20, alignItems: "start" }}>

        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Quick Links */}
          <QuickLinks />

          {/* Loading */}
          {isLoading && (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <div className="spinner" style={{ margin: "0 auto", width: 32, height: 32 }} />
              <p style={{ color: "var(--text3)", marginTop: 12, fontSize: 13 }}>Loading matches…</p>
            </div>
          )}

          {activeSport === "cricket" ? (
            <>
              {/* LIVE MATCHES */}
              {!isLoading && filteredLive.length > 0 && (
                <section style={{ marginBottom: 24 }}>
                  <SectionHeader title="Live Matches" link="/live" linkLabel="All Live →" accent="#d1202a" />
                  <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                    {filteredLive.map(m => <MotionItem key={m.id}><MatchCard match={m} onClick={() => goToMatch(m)} /></MotionItem>)}
                  </MotionGrid>
                </section>
              )}

              {/* Ad */}
              <AdBanner type="leaderboard" />

              {/* NEWS GRID (featured articles) */}
              {newsItems.length > 0 && (
                <section style={{ marginBottom: 24, marginTop: 20 }}>
                  <SectionHeader title="Top Stories" link="/news" linkLabel="All News →" accent="#0b7a55" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
                    {newsItems.slice(0, 6).map((n, i) => <NewsCardFeatured key={n.id || i} item={n} />)}
                  </div>
                </section>
              )}

              {/* RECENT RESULTS */}
              {!isLoading && filteredRecent.length > 0 && (
                <section style={{ marginBottom: 24 }}>
                  <SectionHeader title="Recent Results" link="/results" linkLabel="All Results →" accent="#6d28d9" />
                  <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                    {filteredRecent.slice(0, 6).map(m => <MotionItem key={m.id}><MatchCard match={m} onClick={() => goToMatch(m)} /></MotionItem>)}
                  </MotionGrid>
                </section>
              )}

              {/* UPCOMING MATCHES */}
              {!isLoading && filteredUpcoming.length > 0 && (
                <section style={{ marginBottom: 24 }}>
                  <SectionHeader title="Upcoming Matches" link="/upcoming" linkLabel="Full Schedule →" accent="#b45309" />
                  <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                    {filteredUpcoming.slice(0, 6).map(m => <MotionItem key={m.id}><MatchCard match={m} onClick={() => goToMatch(m)} /></MotionItem>)}
                  </MotionGrid>
                </section>
              )}

              {/* Trending */}
              <section style={{ marginBottom: 24 }}>
                <SectionHeader title="Trending" accent="#b45309" />
                <TrendingChips topics={deriveTrendingTopics(allList)} />
              </section>

              {/* Guides: the site's own writing */}
              <section style={{ marginBottom: 32 }}>
                <SectionHeader title="Cricket Guides" link="/guides" linkLabel="All Guides →" accent="#0b63c4" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                  {HOME_GUIDES.map(g => (
                    <Link key={g.slug} to={`/guides/${g.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#0b63c4", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{g.category}</span>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", lineHeight: 1.45, margin: "0 0 8px" }}>{g.title}</h3>
                      <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6, margin: 0 }}>{g.description}</p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* All-format empty state */}
              {!isLoading && filtered.length === 0 && (
                <div style={{ padding: "60px 24px", textAlign: "center", background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}></div>
                  <h3 style={{ color: "var(--text)", marginBottom: 8, fontSize: 18 }}>No matches for this filter</h3>
                  <p style={{ color: "var(--text3)", fontSize: 13 }}>Try a different category or check back soon.</p>
                </div>
              )}

              {/* Editorial Content & FAQ Section for AdSense High Value Content */}
              <HomeEditorialSection />
            </>
          ) : (
            <OtherSportContent
              sport={activeSport}
              data={otherSportMatches?.data || { live: [], upcoming: [], recent: [] }}
              news={otherSportNews?.data || []}
              loading={otherSportLoading}
            />
          )}

          <div style={{ marginTop: 24 }}><AdBanner type="auto" /></div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 16 }}>
          {activeSport === "cricket" ? (
            <>
              <IPLStandingsWidget />
              <RankingsWidget />

              {/* News sidebar */}
              {newsItems.length > 0 && (
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--divider)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 3, height: 14, borderRadius: 2, background: "#b45309", display: "inline-block" }} />
                      Latest News
                    </span>
                    <Link to="/news" style={{ fontSize: 11, color: "#b45309", fontWeight: 700, textDecoration: "none" }}>All →</Link>
                  </div>
                  <div style={{ padding: "4px 14px" }}>
                    {newsItems.slice(0, 8).map((n, i) => <NewsCardSidebar key={n.id || i} item={n} />)}
                  </div>
                </div>
              )}

              <FantasyPromoCard />

              {/* Featured Tournaments */}
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 3, height: 14, borderRadius: 2, background: "#0b63c4", display: "inline-block" }} />
                  Featured Tournaments
                </div>
                {[
                  { to: "/ipl", label: "IPL", dot: "#d1202a" },
                  { to: "/t20-world-cup", label: "T20 World Cup", dot: "#b45309" },
                  { to: "/champions-trophy", label: "Champions Trophy", dot: "#0b7a55" },
                  { to: "/psl", label: "PSL", dot: "#0b63c4" },
                  { to: "/world-cup", label: "ODI World Cup", dot: "#15803d" },
                  { to: "/asia-cup", label: "Asia Cup", dot: "#be185d" },
                  { to: "/bbl", label: "Big Bash League", dot: "#c2410c" },
                  { to: "/womens-cricket", label: "Women's Cricket", dot: "#7c3aed" },
                ].map(s => (
                  <Link key={s.to} to={s.to} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(15,23,42,0.04)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", transition: "color 0.15s" }}>{s.label}</span>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Other-sport news sidebar */}
              {(otherSportNews?.data || []).length > 0 && (
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--divider)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 3, height: 14, borderRadius: 2, background: "#b45309", display: "inline-block" }} />
                      Latest News
                    </span>
                  </div>
                  <div style={{ padding: "4px 14px" }}>
                    {otherSportNews.data.slice(0, 8).map((n, i) => <NewsCardSidebar key={n.id || i} item={n} />)}
                  </div>
                </div>
              )}

              {/* Other Sports quick links */}
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 3, height: 14, borderRadius: 2, background: "#0b63c4", display: "inline-block" }} />
                  More Sports
                </div>
                {SPORT_SWITCH.filter(s => s.key !== activeSport).map(s => (
                  <button key={s.key} onClick={() => setActiveSport(s.key)} style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(15,23,42,0.04)", color: "var(--text2)", fontSize: 12, fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
