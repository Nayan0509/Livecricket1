import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "./SEO";
import AdBanner from "./AdBanner";
import ContentBlocks, { Inline, Faq } from "./ContentBlocks";
import { MotionGrid, MotionItem } from "./MotionGrid";
import { fetchAllMatches, subscribeLiveMatchStream } from "../api";
import { TOURNAMENTS, FACTS_NOTE } from "../content/tournaments";
import { getStaticRouteMeta } from "../content/routeMeta";
import { stripInline } from "../content/inline";

/**
 * Hub page for a cricket competition or format. All written content (intro,
 * teams, format sections, FAQ) comes from src/content/tournaments.js, which
 * api/render.js also reads. Match data comes only from the live feed; when the
 * feed has nothing for the competition the page says so instead of showing
 * placeholder fixtures or standings.
 */
export default function TournamentPage({ slug, children }) {
  const t = TOURNAMENTS[slug];
  const meta = getStaticRouteMeta(`/${slug}`) || {};
  const accentColor = t?.accentColor || "#3B82F6";
  const filterKeywords = t?.filterKeywords;

  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filterKeywords) return undefined;
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

  if (!t) return null;

  const faqItems = t.faq || [];
  const faqSD = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": stripInline(f.q),
      "acceptedAnswer": { "@type": "Answer", "text": stripInline(f.a) }
    }))
  } : null;

  const hasFeed = liveMatches.length + recentMatches.length + upcomingMatches.length > 0;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60 }}>
      <SEO
        title={meta.title}
        description={meta.description}
        url={`/${slug}`}
        structuredData={faqSD}
      />

      {/* Hero */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          padding: "36px 24px", marginBottom: 24, textAlign: "center",
          background: `linear-gradient(135deg, ${accentColor}25 0%, rgba(13,20,38,0.98) 100%)`,
          borderRadius: 20, border: `1px solid ${accentColor}30`,
          boxShadow: `0 10px 30px -10px ${accentColor}25`
        }}
      >
        <h1 className="font-display" style={{ fontSize: 34, fontWeight: 900, marginBottom: 12, color: "var(--text)" }}>
          {t.icon} {t.name}
        </h1>
        <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.75, maxWidth: 720, margin: "0 auto 20px" }}>
          <Inline text={t.intro} />
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/live" style={{ padding: "9px 20px", borderRadius: 10, background: accentColor, color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none", boxShadow: `0 0 16px ${accentColor}50` }}>
            All Live Matches
          </Link>
          <Link to="/schedule" style={{ padding: "9px 20px", borderRadius: 10, border: `1px solid ${accentColor}50`, color: accentColor, fontWeight: 700, fontSize: 13, textDecoration: "none", background: "rgba(255,255,255,0.02)" }}>
            Cricket Schedule
          </Link>
          <Link to="/guides" style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", color: "var(--text2)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            Guides
          </Link>
        </div>
      </motion.div>

      <AdBanner type="leaderboard" />

      {/* Live feed for this competition */}
      <section aria-label={`${t.shortName} matches`} style={{ marginTop: 24, marginBottom: 28 }}>
        {loading && <div className="spinner" style={{ margin: "32px auto" }} />}

        {!loading && !hasFeed && (
          <div style={{
            padding: "14px 18px", borderRadius: 12,
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)",
            fontSize: 14, color: "var(--text2)", lineHeight: 1.7
          }}>
            No {t.shortName} matches are in the live feed right now. Scores, results and fixtures appear here automatically while the competition is being played.
            {t.season && <> <strong style={{ color: "var(--text)" }}>When it is played:</strong> {t.season}</>}
          </div>
        )}

        {liveMatches.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF1053", display: "inline-block", animation: "livePulse 1.5s infinite" }} />
              {t.shortName} Live Now
            </h2>
            <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {liveMatches.map(m => (
                <MotionItem key={m.id}>
                  <MatchLinkCard m={m} live accentColor={accentColor} />
                </MotionItem>
              ))}
            </MotionGrid>
          </div>
        )}

        {recentMatches.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <SectionTitle color="#34D399">{t.shortName} Recent Results</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {recentMatches.map(m => <MatchLinkCard key={m.id} m={m} accentColor={accentColor} />)}
            </div>
          </div>
        )}

        {upcomingMatches.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <SectionTitle color={accentColor}>{t.shortName} Upcoming Fixtures</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {upcomingMatches.map(m => <MatchLinkCard key={m.id} m={m} accentColor={accentColor} />)}
            </div>
          </div>
        )}
      </section>

      {/* Page-specific live extras (e.g. the IPL points table) */}
      {children}

      {/* Written content */}
      <article style={{ maxWidth: 860 }}>
        {t.season && (
          <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.85, margin: "0 0 14px" }}>
            <strong style={{ color: "var(--text)" }}>Season:</strong> <Inline text={t.season} />
          </p>
        )}

        {t.teams && t.teams.length > 0 && (
          <section style={{ marginBottom: 8 }}>
            <SectionTitle color={accentColor} as="h2">Teams and home grounds</SectionTitle>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 18 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, color: "var(--text2)" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)", color: "var(--text)" }}>
                    <th style={CELL}>Team</th>
                    <th style={CELL}>Short</th>
                    <th style={CELL}>Home ground</th>
                  </tr>
                </thead>
                <tbody>
                  {t.teams.map(team => (
                    <tr key={team.name}>
                      <td style={{ ...CELL, color: "var(--text)", fontWeight: 700 }}>{team.name}</td>
                      <td style={CELL}>{team.short}</td>
                      <td style={CELL}>{team.home}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {t.venues && t.venues.length > 0 && (
          <section style={{ marginBottom: 8 }}>
            <SectionTitle color={accentColor} as="h2">Main venues</SectionTitle>
            <ul style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.85, paddingLeft: 22, margin: "0 0 18px" }}>
              {t.venues.map(v => (
                <li key={v.name}><strong style={{ color: "var(--text)" }}>{v.name}</strong>{v.city ? `, ${v.city}` : ""}</li>
              ))}
            </ul>
          </section>
        )}

        <ContentBlocks blocks={t.sections} />
        <Faq items={faqItems} title="Frequently asked questions" />
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7, margin: "18px 0 0" }}><Inline text={FACTS_NOTE} /></p>
      </article>

      <div style={{ marginTop: 28 }}><AdBanner type="auto" /></div>
    </div>
  );
}

const CELL = { padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", textAlign: "left", verticalAlign: "top" };

function SectionTitle({ children, color, as: Tag = "h2" }) {
  return (
    <Tag style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", margin: "8px 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 3, height: 16, borderRadius: 2, background: color, display: "inline-block" }} />
      {children}
    </Tag>
  );
}

function MatchLinkCard({ m, live, accentColor }) {
  return (
    <Link to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
      <div style={{
        padding: "16px 18px", borderRadius: 12, height: "100%",
        background: live ? "rgba(255,16,83,0.08)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${live ? "rgba(255,16,83,0.3)" : "rgba(255,255,255,0.07)"}`
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", fontWeight: 700, marginBottom: 8 }}>
          {live
            ? <span style={{ color: "#FF5C8A", background: "rgba(255,16,83,0.15)", padding: "2px 8px", borderRadius: 6 }}>LIVE</span>
            : <span>{m.date || ""}</span>}
          <span style={{ color: accentColor }}>{m.matchType || ""}</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{m.name}</div>
        {m.score?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
            {m.score.map((sc, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 800, color: "var(--text)", background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4 }}>
                {sc.inning?.split(" ")[0]} {sc.r}/{sc.w}
              </span>
            ))}
          </div>
        )}
        {m.venue && <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 4 }}>{m.venue}</div>}
        <div style={{ fontSize: 12, color: live ? "#FF5C8A" : "var(--text2)", lineHeight: 1.4 }}>{m.status}</div>
      </div>
    </Link>
  );
}
