import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "./SEO";
import { fetchLiveMatches, fetchUpcomingMatches } from "../api";

/**
 * Reusable tournament page with expert-level SEO:
 * - Dynamic title/description/keywords
 * - SportsEvent + FAQPage structured data
 * - Keyword-rich content block
 * - Live + upcoming match sections
 * - Teams grid
 */
export default function TournamentPage({
  slug,           // URL slug e.g. "t20-world-cup"
  name,           // Full name e.g. "T20 World Cup 2026"
  shortName,      // e.g. "T20 WC"
  filterKeywords, // array of strings to match against match.series / match.name
  seoTitle,
  seoDesc,
  seoKeywords,
  accentColor = "#6366f1",
  teams = [],
  stats = [],
  aboutText,
  faqItems = [],
  startDate,
  endDate,
}) {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [liveRes, upcomingRes] = await Promise.all([
          fetchLiveMatches(),
          fetchUpcomingMatches(),
        ]);
        const filter = (m) =>
          filterKeywords.some(
            (kw) =>
              m.series?.toLowerCase().includes(kw.toLowerCase()) ||
              m.name?.toLowerCase().includes(kw.toLowerCase())
          );
        setLiveMatches((liveRes?.data || []).filter(filter));
        setUpcomingMatches((upcomingRes?.data || []).filter(filter));
      } catch (e) {
        console.error("Tournament load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
      <div style={{
        padding: "44px 32px", borderRadius: 20, marginBottom: 28, textAlign: "center",
        background: `linear-gradient(135deg, ${accentColor}18 0%, rgba(13,20,38,0.95) 100%)`,
        border: `1px solid ${accentColor}30`
      }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 8, color: "var(--text)" }}>
          {name} Live Score
        </h1>
        <p style={{ fontSize: 15, color: "var(--text2)", marginBottom: 20 }}>
          Ball-by-Ball Commentary &amp; Real-Time Scorecard
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/live" style={{ padding: "10px 22px", borderRadius: 10, background: accentColor, color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
            🔴 Live Updates
          </Link>
          <Link to="/schedule" style={{ padding: "10px 22px", borderRadius: 10, border: `1px solid ${accentColor}50`, color: accentColor, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            📅 Schedule
          </Link>
          <Link to="/results" style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", color: "var(--text2)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            📋 Results
          </Link>
        </div>
      </div>

      {/* Stats row */}
      {stats.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 12, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "18px 12px", borderRadius: 12, textAlign: "center", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: accentColor }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {loading && <div className="spinner" />}

      {!loading && (
        <>
          {/* Live Matches */}
          <section aria-label={`${name} Live Matches`} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "livePulse 2s infinite" }} />
              {shortName} Live Matches
            </h2>
            {liveMatches.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {liveMatches.map(m => (
                  <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      padding: "18px", borderRadius: 12,
                      background: "rgba(244,63,94,0.05)", border: "1px solid rgba(244,63,94,0.2)",
                      transition: "transform 0.2s"
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 10, color: "#fb7185", fontWeight: 800, background: "rgba(244,63,94,0.1)", padding: "2px 7px", borderRadius: 5 }}>🔴 LIVE</span>
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>{m.matchType}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6, color: "var(--text)" }}>{m.name}</div>
                      <div style={{ color: "#fb7185", fontWeight: 600, fontSize: 12 }}>{m.status}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ padding: "28px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ color: "var(--text3)", fontSize: 13 }}>No {shortName} matches live right now.</p>
              </div>
            )}
          </section>

          {/* Upcoming Matches */}
          <section aria-label={`${name} Upcoming Matches`} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>
              📅 {shortName} Upcoming Matches
            </h2>
            {upcomingMatches.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {upcomingMatches.map(m => (
                  <div key={m.id} style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 5, fontWeight: 700 }}>{m.date}</div>
                    <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 5, color: "var(--text)" }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{m.status}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ color: "var(--text3)", fontSize: 13 }}>No upcoming {shortName} matches found.</p>
              </div>
            )}
          </section>
        </>
      )}

      {/* Teams */}
      {teams.length > 0 && (
        <section aria-label={`${name} Teams`} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>🏏 {shortName} Teams</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {teams.map(t => (
              <div key={t} style={{
                padding: "14px 10px", borderRadius: 10, textAlign: "center",
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                fontSize: 12, fontWeight: 700, color: "var(--text2)",
                transition: "border-color 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${accentColor}50`}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              >
                {t}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section — renders in SERP as rich snippets */}
      {faqItems.length > 0 && (
        <section aria-label="Frequently Asked Questions" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>❓ Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqItems.map((f, i) => (
              <details key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 18px" }}>
                <summary style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", cursor: "pointer", listStyle: "none" }}>
                  {f.q}
                </summary>
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--text3)", lineHeight: 1.7 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* SEO Content Block */}
      {aboutText && (
        <section aria-label={`About ${name}`} style={{
          padding: "24px 28px", borderRadius: 14,
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)"
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>About {name} Live Score</h2>
          <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.8 }}>{aboutText}</p>
        </section>
      )}
    </div>
  );
}
