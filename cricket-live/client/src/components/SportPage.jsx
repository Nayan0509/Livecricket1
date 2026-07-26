import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SEO from "./SEO";
import AdBanner from "./AdBanner";
import { MotionGrid, MotionItem } from "./MotionGrid";
import { fetchSportMatches, fetchSportNews } from "../api";

/**
 * Shared landing page for a non-cricket sport (football, basketball, tennis).
 * One component, config-driven per sport — mirrors the TournamentPage.jsx
 * pattern used for cricket tournaments, so adding a sport never means
 * hand-duplicating a whole page file.
 */
export default function SportPage({
  sport,          // "football" | "basketball" | "tennis"
  slug,           // URL slug, e.g. "football"
  name,           // Display name, e.g. "Football"
  icon,           // emoji
  leagues = [],   // display list of covered leagues/tours
  seoTitle,
  seoDesc,
  seoKeywords,
  accentColor = "#B026FF",
  aboutText,
  faqItems = [],
}) {
  const [matches, setMatches] = useState({ live: [], upcoming: [], recent: [] });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [matchesRes, newsRes] = await Promise.all([
          fetchSportMatches(sport),
          fetchSportNews(sport),
        ]);
        if (cancelled) return;
        setMatches(matchesRes?.data || { live: [], upcoming: [], recent: [] });
        setNews(newsRes?.data || []);
      } catch (e) {
        console.error(`${sport} load error:`, e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, [sport]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${name} Live Scores`,
    "description": seoDesc,
    "sport": name,
    "url": `https://www.livecricketzone.com/${slug}`,
    "image": "https://www.livecricketzone.com/og-image.png",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSD) }} />
      )}

      {/* Hero */}
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          padding: "40px 32px", marginBottom: 28, textAlign: "center",
          background: `linear-gradient(135deg, ${accentColor}20 0%, rgba(13,20,38,0.95) 100%)`,
        }}
      >
        <h1 className="font-display" style={{ fontSize: 34, fontWeight: 900, marginBottom: 8, color: "var(--text)" }}>
          {icon} {name} Live Scores
        </h1>
        <p className="font-hud" style={{ fontSize: 16, color: "var(--text2)" }}>
          {leagues.length > 0 ? leagues.join(" · ") : `Real-time ${name.toLowerCase()} scores worldwide`}
        </p>
      </motion.div>

      <AdBanner type="leaderboard" />

      {loading && <div className="spinner" style={{ margin: "40px auto" }} />}

      {!loading && (
        <>
          {/* Live */}
          <section aria-label={`${name} live matches`} style={{ marginTop: 28, marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF1053", display: "inline-block", animation: "livePulse 2s infinite" }} />
              Live Now
            </h2>
            {matches.live.length > 0 ? (
              <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {matches.live.map(m => <MotionItem key={m.id}><MatchCard match={m} live /></MotionItem>)}
              </MotionGrid>
            ) : (
              <EmptyState text={`No ${name.toLowerCase()} matches live right now.`} />
            )}
          </section>

          {/* Upcoming */}
          <section aria-label={`${name} upcoming matches`} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>📅 Upcoming</h2>
            {matches.upcoming.length > 0 ? (
              <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {matches.upcoming.slice(0, 12).map(m => <MotionItem key={m.id}><MatchCard match={m} /></MotionItem>)}
              </MotionGrid>
            ) : (
              <EmptyState text={`No upcoming ${name.toLowerCase()} matches found.`} />
            )}
          </section>

          {/* Recent results */}
          <section aria-label={`${name} recent results`} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>✅ Recent Results</h2>
            {matches.recent.length > 0 ? (
              <MotionGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {matches.recent.slice(0, 12).map(m => <MotionItem key={m.id}><MatchCard match={m} /></MotionItem>)}
              </MotionGrid>
            ) : (
              <EmptyState text={`No recent ${name.toLowerCase()} results yet.`} />
            )}
          </section>

          {/* News */}
          {news.length > 0 && (
            <section aria-label={`${name} news`} style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>📰 {name} News</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {news.slice(0, 8).map(n => (
                  <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 4 }}>{n.title}</div>
                      {n.description && <div style={{ fontSize: 12, color: "var(--text3)" }}>{n.description}</div>}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section aria-label="Frequently Asked Questions" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>❓ Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqItems.map((f, i) => (
              <details key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 18px" }}>
                <summary style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", cursor: "pointer", listStyle: "none" }}>{f.q}</summary>
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--text3)", lineHeight: 1.7 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <div style={{ marginBottom: 20 }}><AdBanner type="auto" /></div>

      {/* About */}
      {aboutText && (
        <section aria-label={`About ${name} on Live Cricket Zone`} style={{
          padding: "24px 28px", borderRadius: 14,
          background: "rgba(255,255,255,0.02)", border: `1px solid ${accentColor}15`,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 3, height: 16, borderRadius: 2, background: `linear-gradient(180deg,${accentColor},${accentColor}99)`, display: "inline-block" }} />
            About {name} on Live Cricket Zone
          </h2>
          {String(aboutText).split("\n\n").map((para, i) => (
            <p key={i} style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>{para}</p>
          ))}
        </section>
      )}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ padding: "28px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ color: "var(--text3)", fontSize: 13 }}>{text}</p>
    </div>
  );
}

function MatchCard({ match: m, live }) {
  const [a, b] = m.teams || [];
  const border = live ? "rgba(244,63,94,0.2)" : "rgba(255,255,255,0.07)";
  const bg = live ? "rgba(244,63,94,0.05)" : "rgba(255,255,255,0.025)";
  return (
    <div style={{ padding: "16px 18px", borderRadius: 12, background: bg, border: `1px solid ${border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: "var(--text3)", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 5 }}>{m.league}</span>
        {live && <span style={{ fontSize: 10, color: "#FF5C8A", fontWeight: 800 }}>🔴 LIVE</span>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{a?.name || "TBD"}</span>
        {a?.score && <span style={{ fontSize: 13, fontWeight: 800, color: live ? "#FF5C8A" : "var(--text2)" }}>{a.score}</span>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{b?.name || "TBD"}</span>
        {b?.score && <span style={{ fontSize: 13, fontWeight: 800, color: live ? "#FF5C8A" : "var(--text2)" }}>{b.score}</span>}
      </div>
      <div style={{ fontSize: 11, color: "var(--text3)" }}>{m.status}{m.venue ? ` — ${m.venue}` : ""}</div>
    </div>
  );
}
