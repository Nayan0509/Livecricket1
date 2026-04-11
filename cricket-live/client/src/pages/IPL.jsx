import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches, fetchUpcomingMatches } from "../api";

const IPL_SD = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Indian Premier League 2026",
  "alternateName": "IPL 2026",
  "description": "IPL 2026 live scores, ball-by-ball commentary, points table, schedule and match results for all Indian Premier League matches.",
  "sport": "Cricket",
  "startDate": "2026-03-22",
  "endDate": "2026-05-26",
  "location": { "@type": "Place", "name": "India", "address": { "@type": "PostalAddress", "addressCountry": "IN" } },
  "organizer": { "@type": "SportsOrganization", "name": "Board of Control for Cricket in India", "alternateName": "BCCI" },
  "url": "https://www.livecricketzone.com/ipl",
  "image": "https://www.livecricketzone.com/og-image.png",
  "offers": { "@type": "Offer", "url": "https://www.livecricketzone.com/ipl", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
};

const IPL_FAQ_SD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Where can I watch IPL 2026 live score?",
      "acceptedAnswer": { "@type": "Answer", "text": "You can watch IPL 2026 live score on Live Cricket Zone. We provide real-time ball-by-ball commentary, live scorecard and match updates updated every 15 seconds." }
    },
    {
      "@type": "Question",
      "name": "How many teams are in IPL 2026?",
      "acceptedAnswer": { "@type": "Answer", "text": "IPL 2026 features 10 teams: Mumbai Indians, Chennai Super Kings, Royal Challengers Bengaluru, Kolkata Knight Riders, Gujarat Titans, Lucknow Super Giants, Delhi Capitals, Punjab Kings, Rajasthan Royals, and Sunrisers Hyderabad." }
    },
    {
      "@type": "Question",
      "name": "What is the IPL 2026 schedule?",
      "acceptedAnswer": { "@type": "Answer", "text": "IPL 2026 runs from March to May 2026 with 74 matches across India. Visit Live Cricket Zone for the complete IPL 2026 schedule, match timings and venue details." }
    }
  ]
};

const IPL_TEAMS = [
  { name: "Mumbai Indians",          short: "MI",  color: "#004BA0" },
  { name: "Chennai Super Kings",     short: "CSK", color: "#F9CD05" },
  { name: "Royal Challengers Bengaluru", short: "RCB", color: "#EC1C24" },
  { name: "Kolkata Knight Riders",   short: "KKR", color: "#3A225D" },
  { name: "Gujarat Titans",          short: "GT",  color: "#1C1C1C" },
  { name: "Lucknow Super Giants",    short: "LSG", color: "#A72056" },
  { name: "Delhi Capitals",          short: "DC",  color: "#0078BC" },
  { name: "Punjab Kings",            short: "PBKS",color: "#ED1B24" },
  { name: "Rajasthan Royals",        short: "RR",  color: "#254AA5" },
  { name: "Sunrisers Hyderabad",     short: "SRH", color: "#F7A721" },
];

export default function IPL() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [liveRes, upcomingRes] = await Promise.all([
          fetchLiveMatches(),
          fetchUpcomingMatches()
        ]);
        const filterIPL = (m) =>
          m.series?.toLowerCase().includes("ipl") ||
          m.name?.toLowerCase().includes("ipl") ||
          m.name?.toLowerCase().includes("indian premier league");
        setLiveMatches((liveRes?.data || []).filter(filterIPL));
        setUpcomingMatches((upcomingRes?.data || []).filter(filterIPL));
      } catch (error) {
        console.error("Error loading IPL data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60 }}>
      <SEO
        title="IPL 2026 Live Score - Indian Premier League"
        description="IPL 2026 live score, ball-by-ball commentary, points table, schedule and match results. Get real-time Indian Premier League 2026 updates faster than Cricbuzz."
        keywords="IPL 2026 live score, IPL live score today, Indian Premier League 2026, IPL ball by ball, IPL scorecard, IPL points table 2026, IPL schedule 2026, IPL match today, IPL live cricket score, IPL 2026 results"
        url="/ipl"
        structuredData={IPL_SD}
      />
      {/* Inject FAQ schema separately */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(IPL_FAQ_SD) }} />

      {/* Hero */}
      <div style={{
        padding: "48px 32px", borderRadius: 20, marginBottom: 32, textAlign: "center",
        background: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(13,20,38,0.95) 100%)",
        border: "1px solid rgba(245,158,11,0.2)"
      }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 8, color: "var(--text)" }}>
          IPL 2026 Live Score
        </h1>
        <p style={{ fontSize: 16, color: "var(--text2)", marginBottom: 20 }}>
          Indian Premier League 2026 — Ball-by-Ball Commentary &amp; Real-Time Scorecard
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/live" style={{ padding: "10px 24px", borderRadius: 10, background: "rgba(245,158,11,0.9)", color: "#000", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
            🔴 Live Updates
          </Link>
          <Link to="/schedule" style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(245,158,11,0.4)", color: "#f59e0b", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            📅 IPL Schedule
          </Link>
          <Link to="/rankings" style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", color: "var(--text2)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            🏆 Points Table
          </Link>
        </div>
      </div>

      {loading && <div className="spinner" />}

      {!loading && (
        <>
          {/* Live Matches */}
          <section aria-label="IPL 2026 Live Matches" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "livePulse 2s infinite" }} />
              IPL 2026 Live Matches
            </h2>
            {liveMatches.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {liveMatches.map(m => (
                  <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      padding: "20px", borderRadius: 14,
                      background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.25)",
                      transition: "transform 0.2s"
                    }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 10, color: "#fb7185", fontWeight: 800, background: "rgba(244,63,94,0.12)", padding: "3px 8px", borderRadius: 6 }}>🔴 LIVE</span>
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>{m.matchType}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>{m.name}</div>
                      <div style={{ color: "#fb7185", fontWeight: 600, fontSize: 13 }}>{m.status}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ padding: "32px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ color: "var(--text3)", fontSize: 14 }}>No IPL matches live right now. Check upcoming matches below.</p>
              </div>
            )}
          </section>

          {/* Upcoming Matches */}
          <section aria-label="IPL 2026 Upcoming Matches" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>
              📅 IPL 2026 Upcoming Matches
            </h2>
            {upcomingMatches.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {upcomingMatches.map(m => (
                  <div key={m.id} style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6, fontWeight: 700 }}>{m.date}</div>
                    <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6, color: "var(--text)" }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{m.status}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ color: "var(--text3)", fontSize: 14 }}>No upcoming IPL matches found. Check back soon.</p>
              </div>
            )}
          </section>
        </>
      )}

      {/* Teams Grid */}
      <section aria-label="IPL 2026 Teams" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>🏏 IPL 2026 Teams</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {IPL_TEAMS.map(t => (
            <div key={t.name} style={{
              padding: "16px 12px", borderRadius: 12, textAlign: "center",
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer", transition: "transform 0.2s, border-color 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = `${t.color}60`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%", margin: "0 auto 10px",
                background: `${t.color}22`, border: `2px solid ${t.color}60`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 13, color: t.color
              }}>{t.short}</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text2)", lineHeight: 1.3 }}>{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Content Block — keyword-rich text for crawlers */}
      <section aria-label="About IPL 2026" style={{
        padding: "28px 32px", borderRadius: 16,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)"
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>About IPL 2026 Live Score</h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.8, marginBottom: 10 }}>
          Live Cricket Zone provides the fastest <strong style={{ color: "var(--text2)" }}>IPL 2026 live score</strong> with ball-by-ball commentary updated every 15 seconds. Follow every match of the Indian Premier League 2026 with real-time scorecard, toss updates, player stats and match results.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.8 }}>
          Get <strong style={{ color: "var(--text2)" }}>IPL 2026 points table</strong>, complete schedule, team standings and player performance stats. Our <strong style={{ color: "var(--text2)" }}>IPL live score today</strong> coverage is faster than Cricbuzz and ESPNcricinfo with no ads interrupting your experience.
        </p>
      </section>
    </div>
  );
}
