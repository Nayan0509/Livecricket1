import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "./SEO";
import AdBanner from "./AdBanner";
import { MotionGrid, MotionItem } from "./MotionGrid";
import { fetchAllMatches, subscribeLiveMatchStream } from "../api";

export default function TournamentPage({
  slug,
  name,
  shortName,
  filterKeywords = [],
  seoTitle,
  seoDesc,
  seoKeywords,
  accentColor = "#3B82F6",
  teams = [],
  stats = [],
  fixtures = [],
  standings = [],
  records = [],
  venues = [],
  aboutText,
  faqItems = [],
  startDate,
  endDate,
}) {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [activeTab, setActiveTab] = useState("fixtures");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const filter = (m) =>
      filterKeywords.some(
        (kw) =>
          m.series?.toLowerCase().includes(kw.toLowerCase()) ||
          m.name?.toLowerCase().includes(kw.toLowerCase()) ||
          m.matchType?.toLowerCase().includes(kw.toLowerCase())
      );

    const load = async () => {
      try {
        const allRes = await fetchAllMatches();
        const data = allRes?.data || allRes || {};
        if (mounted) {
          setLiveMatches((data.live || []).filter(filter));
          setRecentMatches((data.recent || []).filter(filter));
          setUpcomingMatches((data.upcoming || []).filter(filter));
        }
      } catch (e) {
        console.error("Tournament load error:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();

    const unsubscribe = subscribeLiveMatchStream((streamData) => {
      if (!mounted || !streamData) return;
      if (streamData.live) setLiveMatches((streamData.live || []).filter(filter));
      if (streamData.recent) setRecentMatches((streamData.recent || []).filter(filter));
      if (streamData.upcoming) setUpcomingMatches((streamData.upcoming || []).filter(filter));
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [filterKeywords]);

  // Combined fixtures: live API upcoming matches + tournament schedule fixtures
  const displayFixtures = upcomingMatches.length > 0 ? upcomingMatches : fixtures;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": name,
    "description": seoDesc,
    "sport": "Cricket",
    ...(startDate && { "startDate": startDate }),
    ...(endDate && { "endDate": endDate }),
    "location": { "@type": "Place", "name": "International", "address": { "@type": "PostalAddress", "addressCountry": "IN" } },
    "url": `https://www.livecricketzone.com/${slug}`,
    "image": "https://www.livecricketzone.com/og-image.png",
    "offers": { "@type": "Offer", "url": `https://www.livecricketzone.com/${slug}`, "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
  };

  const faqSD = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  } : null;

  const TABS = [
    { id: "fixtures",  label: "📅 Fixtures & Live" },
    { id: "standings", label: "🏆 Points Table / Groups" },
    { id: "teams",     label: "🏏 Teams & Squads" },
    { id: "records",   label: "📊 Records & Stats" },
    { id: "venues",    label: "🏟️ Venues" },
    { id: "guide",     label: "📖 FAQ & Guide" },
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60 }}>
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        url={`/${slug}`}
        structuredData={structuredData}
      />
      {faqSD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSD) }}
        />
      )}

      {/* Hero */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          padding: "40px 24px", marginBottom: 24, textAlign: "center",
          background: `linear-gradient(135deg, ${accentColor}25 0%, rgba(13,20,38,0.98) 100%)`,
          borderRadius: 20, border: `1px solid ${accentColor}30`,
          boxShadow: `0 10px 30px -10px ${accentColor}25`
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${accentColor}20`, border: `1px solid ${accentColor}40`, padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800, color: accentColor, marginBottom: 12 }}>
          <span>🏆</span> OFFICIAL TOURNAMENT HUB
        </div>
        <h1 className="font-display" style={{ fontSize: 34, fontWeight: 900, marginBottom: 8, color: "var(--text)" }}>
          {name}
        </h1>
        <p className="font-hud" style={{ fontSize: 15, color: "var(--text2)", marginBottom: 20, maxWidth: 650, margin: "0 auto 20px" }}>
          Real-time live scores, ball-by-ball commentary, points table, team rosters, and complete tournament schedule.
        </p>

        {/* Stats Row */}
        {stats.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(110px, 1fr))`, gap: 10, maxWidth: 700, margin: "0 auto 20px" }}>
            {stats.map((s, i) => (
              <div key={i} style={{ padding: "12px 8px", borderRadius: 12, textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: accentColor }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/live" style={{ padding: "9px 20px", borderRadius: 10, background: accentColor, color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none", boxShadow: `0 0 16px ${accentColor}50` }}>
            🔴 All Live Matches
          </Link>
          <Link to="/schedule" style={{ padding: "9px 20px", borderRadius: 10, border: `1px solid ${accentColor}50`, color: accentColor, fontWeight: 700, fontSize: 13, textDecoration: "none", background: "rgba(255,255,255,0.02)" }}>
            📅 Cricket Calendar
          </Link>
          <Link to="/rankings" style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", color: "var(--text2)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            ⭐ ICC Rankings
          </Link>
        </div>
      </motion.div>

      {/* Ad Banner */}
      <AdBanner type="leaderboard" />

      {/* Navigation Tabs */}
      <div style={{
        display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24,
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
              background: activeTab === t.id ? `${accentColor}25` : "rgba(255,255,255,0.02)",
              border: `1px solid ${activeTab === t.id ? accentColor : "rgba(255,255,255,0.07)"}`,
              color: activeTab === t.id ? "#fff" : "var(--text3)",
              boxShadow: activeTab === t.id ? `0 0 14px ${accentColor}35` : "none"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div className="spinner" style={{ margin: "32px auto" }} />}

      {!loading && (
        <AnimatePresence mode="wait">
          {/* TAB 1: FIXTURES & LIVE MATCHES */}
          {activeTab === "fixtures" && (
            <motion.div key="fixtures" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* Off-Season / Active Status Notice */}
              {liveMatches.length === 0 && upcomingMatches.length === 0 && (
                <div style={{
                  padding: "14px 18px", borderRadius: 12, marginBottom: 24,
                  background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", gap: 12
                }}>
                  <span style={{ fontSize: 20 }}>🏏</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)" }}>
                      {name} — Official Tournament Hub
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>
                      Live scorecards and delivery commentary update dynamically whenever matches are in progress. Browse official records, venues, and match roadmaps below.
                    </div>
                  </div>
                </div>
              )}

              {/* Live Section */}
              {liveMatches.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF1053", display: "inline-block", animation: "livePulse 1.5s infinite" }} />
                    {shortName} Live Right Now
                  </h2>
                  <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                    {liveMatches.map(m => (
                      <MotionItem key={m.id}>
                        <Link to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                          <div style={{
                            padding: "18px", borderRadius: 14, background: "rgba(255,16,83,0.08)",
                            border: "1px solid rgba(255,16,83,0.3)", transition: "transform 0.2s, box-shadow 0.2s"
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                              <span style={{ fontSize: 10, color: "#FF5C8A", fontWeight: 800, background: "rgba(255,16,83,0.15)", padding: "2px 8px", borderRadius: 6 }}>🔴 LIVE</span>
                              <span style={{ fontSize: 11, color: "var(--text3)" }}>{m.matchType}</span>
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>{m.name}</div>
                            {m.score?.length > 0 && (
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                                {m.score.map((sc, sci) => (
                                  <span key={sci} style={{ fontSize: 11, fontWeight: 800, color: "var(--text)", background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4 }}>
                                    {sc.inning?.split(" ")[0]} {sc.r}/{sc.w}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div style={{ color: "#FF5C8A", fontWeight: 700, fontSize: 13 }}>{m.status}</div>
                          </div>
                        </Link>
                      </MotionItem>
                    ))}
                  </MotionGrid>
                </section>
              )}

              {/* Recent Match Results Section (if available from real API) */}
              {recentMatches.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 3, height: 16, borderRadius: 2, background: "#34D399", display: "inline-block" }} />
                    {shortName} Recent Results &amp; Final Scores
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                    {recentMatches.map(m => (
                      <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                        <div style={{
                          padding: "16px 18px", borderRadius: 12,
                          background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                          transition: "border-color 0.2s"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                            <span>📅 {m.date || "Completed"}</span>
                            <span style={{ color: "#34D399" }}>Result</span>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{m.name}</div>
                          {m.score?.length > 0 && (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                              {m.score.map((sc, sci) => (
                                <span key={sci} style={{ fontSize: 11, fontWeight: 800, color: "var(--text2)", background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>
                                  {sc.inning?.split(" ")[0]} {sc.r}/{sc.w}
                                </span>
                              ))}
                            </div>
                          )}
                          <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.4 }}>{m.status}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Tournament Fixtures / Roadmap */}
              <section>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 3, height: 16, borderRadius: 2, background: accentColor, display: "inline-block" }} />
                  {upcomingMatches.length > 0 ? `${name} Upcoming Match Schedule` : `${name} Official Roadmap & Fixtures`}
                </h2>
                {displayFixtures.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                    {displayFixtures.map((m, idx) => (
                      <div key={m.id || idx} style={{
                        padding: "16px 18px", borderRadius: 12,
                        background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                        display: "flex", flexDirection: "column", justifyContent: "space-between"
                      }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
                            <span>📅 {m.date || "Scheduled"}</span>
                            <span style={{ color: accentColor }}>{m.stage || m.format || "Match"}</span>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text2)" }}>📍 {m.venue || "International Cricket Stadium"}</div>
                        </div>
                        {m.id && (
                          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <Link to={`/match/${m.id}`} style={{ fontSize: 12, fontWeight: 700, color: accentColor, textDecoration: "none" }}>
                              View Match Details →
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "28px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ color: "var(--text3)", fontSize: 13, margin: 0 }}>Tournament fixtures will be finalized according to the official ICC schedule.</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {/* TAB 2: STANDINGS / POINTS TABLE */}
          {activeTab === "standings" && (
            <motion.div key="standings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <section style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 3, height: 16, borderRadius: 2, background: accentColor, display: "inline-block" }} />
                  {name} Standings &amp; Points Table
                </h2>
                {standings.length > 0 ? (
                  <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text3)" }}>
                          <th style={{ padding: "12px 14px" }}>Pos</th>
                          <th style={{ padding: "12px 14px" }}>Team</th>
                          <th style={{ padding: "12px 14px", textAlign: "center" }}>P</th>
                          <th style={{ padding: "12px 14px", textAlign: "center" }}>W</th>
                          <th style={{ padding: "12px 14px", textAlign: "center" }}>L</th>
                          <th style={{ padding: "12px 14px", textAlign: "center" }}>NRR</th>
                          <th style={{ padding: "12px 14px", textAlign: "center", fontWeight: 800, color: accentColor }}>Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((row, idx) => (
                          <tr key={idx} style={{
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                            background: idx < 2 ? "rgba(59,130,246,0.04)" : "transparent"
                          }}>
                            <td style={{ padding: "12px 14px", fontWeight: 700 }}>{idx + 1}</td>
                            <td style={{ padding: "12px 14px", fontWeight: 800, color: "var(--text)" }}>
                              <span style={{ marginRight: 8 }}>{row.flag || "🏏"}</span>
                              {row.team || row.name}
                            </td>
                            <td style={{ padding: "12px 14px", textAlign: "center", color: "var(--text2)" }}>{row.p || row.played || 0}</td>
                            <td style={{ padding: "12px 14px", textAlign: "center", color: "#34D399", fontWeight: 700 }}>{row.w || row.won || 0}</td>
                            <td style={{ padding: "12px 14px", textAlign: "center", color: "#F87171" }}>{row.l || row.lost || 0}</td>
                            <td style={{ padding: "12px 14px", textAlign: "center", color: "var(--text3)" }}>{row.nrr || "+0.000"}</td>
                            <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 900, color: accentColor }}>{row.pts || row.points || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: "28px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ color: "var(--text3)", fontSize: 13, margin: 0 }}>Points table will automatically calculate and update as matches are played.</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {/* TAB 3: TEAMS & SQUADS */}
          {activeTab === "teams" && (
            <motion.div key="teams" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <section style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 3, height: 16, borderRadius: 2, background: accentColor, display: "inline-block" }} />
                  Participating Teams &amp; Squads
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                  {teams.map((t, idx) => {
                    const teamName = typeof t === "string" ? t : t.name;
                    const captain = typeof t === "object" ? t.captain : null;
                    const titles = typeof t === "object" ? t.titles : null;
                    const flag = typeof t === "object" ? t.flag : "🏏";
                    return (
                      <div key={idx} style={{
                        padding: "16px 14px", borderRadius: 12, textAlign: "center",
                        background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                        transition: "transform 0.15s, border-color 0.15s"
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
                      >
                        <div style={{ fontSize: 28, marginBottom: 6 }}>{flag}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>{teamName}</div>
                        {captain && <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>👑 Captain: <strong style={{ color: "var(--text2)" }}>{captain}</strong></div>}
                        {titles && <div style={{ fontSize: 10, color: accentColor, fontWeight: 700, background: `${accentColor}15`, padding: "2px 8px", borderRadius: 10, display: "inline-block" }}>🏆 {titles}</div>}
                      </div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {/* TAB 4: RECORDS & STATS */}
          {activeTab === "records" && (
            <motion.div key="records" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <section style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 3, height: 16, borderRadius: 2, background: accentColor, display: "inline-block" }} />
                  {name} All-Time Tournament Records
                </h2>
                {records.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                    {records.map((r, idx) => (
                      <div key={idx} style={{ padding: "16px", borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ fontSize: 11, color: accentColor, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{r.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", marginBottom: 2 }}>{r.value}</div>
                        <div style={{ fontSize: 12, color: "var(--text3)" }}>{r.holder}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "28px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ color: "var(--text3)", fontSize: 13, margin: 0 }}>Tournament historical records updated before every edition.</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {/* TAB 5: VENUES */}
          {activeTab === "venues" && (
            <motion.div key="venues" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <section style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 3, height: 16, borderRadius: 2, background: accentColor, display: "inline-block" }} />
                  Official Match Venues &amp; Stadiums
                </h2>
                {venues.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                    {venues.map((v, idx) => (
                      <div key={idx} style={{ padding: "18px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🏟️ {v.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>📍 {v.city}, {v.country}</div>
                        {v.capacity && <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>👥 Capacity: <strong style={{ color: "var(--text)" }}>{v.capacity}</strong></div>}
                        {v.pitch && <div style={{ fontSize: 11, color: accentColor, marginTop: 6, background: `${accentColor}10`, padding: "4px 8px", borderRadius: 6 }}>🏏 {v.pitch}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: "28px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ color: "var(--text3)", fontSize: 13, margin: 0 }}>Official venue list is updated per tournament host allocations.</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {/* TAB 6: FAQ & GUIDE */}
          {activeTab === "guide" && (
            <motion.div key="guide" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {faqItems.length > 0 && (
                <section style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>❓ Frequently Asked Questions</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {faqItems.map((f, i) => (
                      <details key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px" }}>
                        <summary style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", cursor: "pointer", listStyle: "none" }}>
                          {f.q}
                        </summary>
                        <p style={{ marginTop: 10, fontSize: 13, color: "var(--text3)", lineHeight: 1.75, margin: "10px 0 0" }}>{f.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {aboutText && (
                <section style={{ padding: "24px 28px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: `1px solid ${accentColor}20` }}>
                  <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 3, height: 16, borderRadius: 2, background: accentColor, display: "inline-block" }} />
                    About {name}
                  </h2>
                  {String(aboutText).split("\n\n").map((para, i) => (
                    <p key={i} style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>{para}</p>
                  ))}
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Auto Ad Banner */}
      <div style={{ marginTop: 28 }}><AdBanner type="auto" /></div>
    </div>
  );
}
