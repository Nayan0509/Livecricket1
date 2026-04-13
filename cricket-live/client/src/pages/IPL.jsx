import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches, fetchUpcomingMatches } from "../api";

const IPL_SD = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Indian Premier League 2026",
  "alternateName": ["IPL 2026", "IPL 19", "TATA IPL 2026"],
  "description": "IPL 2026 live scores, ball-by-ball commentary, points table, schedule and match results. Today: LSG vs GT (Match 19) and MI vs RCB (Match 20).",
  "sport": "Cricket",
  "startDate": "2026-03-28",
  "endDate": "2026-05-31",
  "location": { "@type": "Place", "name": "India", "address": { "@type": "PostalAddress", "addressCountry": "IN" } },
  "organizer": { "@type": "SportsOrganization", "name": "Board of Control for Cricket in India", "alternateName": "BCCI" },
  "url": "https://www.livecricketzone.com/ipl",
  "image": "https://www.livecricketzone.com/og-image.png",
  "performer": [
    { "@type": "Person", "name": "Virat Kohli", "affiliation": "Royal Challengers Bengaluru" },
    { "@type": "Person", "name": "Rohit Sharma", "affiliation": "Mumbai Indians" },
    { "@type": "Person", "name": "Hardik Pandya", "affiliation": "Mumbai Indians" },
    { "@type": "Person", "name": "Rishabh Pant", "affiliation": "Lucknow Super Giants" },
    { "@type": "Person", "name": "Shubman Gill", "affiliation": "Gujarat Titans" },
    { "@type": "Person", "name": "Rajat Patidar", "affiliation": "Royal Challengers Bengaluru" },
    { "@type": "Person", "name": "Tilak Varma", "affiliation": "Mumbai Indians" },
    { "@type": "Person", "name": "Yashasvi Jaiswal", "affiliation": "Rajasthan Royals" },
    { "@type": "Person", "name": "Heinrich Klaasen", "affiliation": "Sunrisers Hyderabad" },
    { "@type": "Person", "name": "Riyan Parag", "affiliation": "Rajasthan Royals" },
    { "@type": "Person", "name": "Axar Patel", "affiliation": "Delhi Capitals" },
    { "@type": "Person", "name": "Kagiso Rabada", "affiliation": "Gujarat Titans" },
    { "@type": "Person", "name": "Mitchell Marsh", "affiliation": "Lucknow Super Giants" },
    { "@type": "Person", "name": "Aiden Markram", "affiliation": "Lucknow Super Giants" }
  ],
  "offers": { "@type": "Offer", "url": "https://www.livecricketzone.com/ipl", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
};

const IPL_FAQ_SD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are today's IPL 2026 matches?",
      "acceptedAnswer": { "@type": "Answer", "text": "Today's IPL 2026 matches (April 12): Match 19 — LSG vs GT at Ekana Stadium Lucknow (3:30 PM IST), and Match 20 — MI vs RCB at Wankhede Stadium Mumbai (7:30 PM IST). Get live scores on Live Cricket Zone." }
    },
    {
      "@type": "Question",
      "name": "Where can I watch LSG vs GT live today?",
      "acceptedAnswer": { "@type": "Answer", "text": "Watch LSG vs GT live today on Live Cricket Zone. Rishabh Pant's Lucknow Super Giants vs Shubman Gill's Gujarat Titans — Match 19 of IPL 2026 at Ekana Cricket Stadium, Lucknow. Free live stream via YouTube, no signup needed." }
    },
    {
      "@type": "Question",
      "name": "Where can I watch MI vs RCB live today?",
      "acceptedAnswer": { "@type": "Answer", "text": "Watch MI vs RCB live today on Live Cricket Zone. Hardik Pandya's Mumbai Indians vs Rajat Patidar's Royal Challengers Bengaluru — Match 20 of IPL 2026 at Wankhede Stadium, Mumbai at 7:30 PM IST. Features Rohit Sharma vs Virat Kohli." }
    },
    {
      "@type": "Question",
      "name": "How many teams are in IPL 2026?",
      "acceptedAnswer": { "@type": "Answer", "text": "IPL 2026 features 10 teams: Mumbai Indians (MI), Chennai Super Kings (CSK), Royal Challengers Bengaluru (RCB), Kolkata Knight Riders (KKR), Gujarat Titans (GT), Lucknow Super Giants (LSG), Delhi Capitals (DC), Punjab Kings (PBKS), Rajasthan Royals (RR), and Sunrisers Hyderabad (SRH)." }
    },
    {
      "@type": "Question",
      "name": "Who are the key players in IPL 2026?",
      "acceptedAnswer": { "@type": "Answer", "text": "Key IPL 2026 players include Virat Kohli (RCB), Rohit Sharma (MI), Hardik Pandya (MI captain), Rishabh Pant (LSG captain), Shubman Gill (GT captain), Yashasvi Jaiswal (RR), Heinrich Klaasen (SRH), Rajat Patidar (RCB captain), Axar Patel (DC captain), Riyan Parag (RR captain), Kagiso Rabada (GT), Mitchell Marsh (LSG), Tilak Varma (MI)." }
    },
    {
      "@type": "Question",
      "name": "What is the IPL 2026 schedule?",
      "acceptedAnswer": { "@type": "Answer", "text": "IPL 2026 runs from March 28 to May 31, 2026 with 84 matches across India — the biggest IPL season ever. Visit Live Cricket Zone for the complete IPL 2026 schedule, match timings and venue details." }
    }
  ]
};

const IPL_TEAMS = [
  { name: "Mumbai Indians",              short: "MI",  color: "#004BA0", captain: "Hardik Pandya",  key: "Rohit Sharma, Tilak Varma" },
  { name: "Chennai Super Kings",         short: "CSK", color: "#F9CD05", captain: "Ruturaj Gaikwad",key: "MS Dhoni, Ravindra Jadeja" },
  { name: "Royal Challengers Bengaluru", short: "RCB", color: "#EC1C24", captain: "Rajat Patidar",  key: "Virat Kohli, Phil Salt" },
  { name: "Kolkata Knight Riders",       short: "KKR", color: "#3A225D", captain: "Ajinkya Rahane", key: "Sunil Narine, Andre Russell" },
  { name: "Gujarat Titans",             short: "GT",  color: "#1B8B4B", captain: "Shubman Gill",   key: "Kagiso Rabada, Jos Buttler" },
  { name: "Lucknow Super Giants",        short: "LSG", color: "#A72056", captain: "Rishabh Pant",   key: "Mitchell Marsh, Aiden Markram" },
  { name: "Delhi Capitals",             short: "DC",  color: "#0078BC", captain: "Axar Patel",     key: "Jake Fraser-McGurk, Kuldeep Yadav" },
  { name: "Punjab Kings",               short: "PBKS",color: "#ED1B24", captain: "Shreyas Iyer",   key: "Glenn Maxwell, Arshdeep Singh" },
  { name: "Rajasthan Royals",           short: "RR",  color: "#254AA5", captain: "Riyan Parag",    key: "Yashasvi Jaiswal, Dhruv Jurel" },
  { name: "Sunrisers Hyderabad",        short: "SRH", color: "#F7A721", captain: "Pat Cummins",    key: "Heinrich Klaasen, Travis Head" },
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
        title="IPL 2026 Live Score Today - LSG vs GT & MI vs RCB Live"
        description="IPL 2026 live score today: LSG vs GT (Match 19, Ekana Lucknow) & MI vs RCB (Match 20, Wankhede Mumbai). Watch Virat Kohli vs Rohit Sharma, Rishabh Pant vs Shubman Gill live free."
        keywords="IPL 2026 live score today, LSG vs GT live score, MI vs RCB live score, LSG vs GT today, MI vs RCB today, Lucknow vs Gujarat live, Mumbai vs RCB live, Virat Kohli live score, Rohit Sharma live, Rishabh Pant live, Shubman Gill live, Hardik Pandya IPL, IPL today match live, IPL live today, watch IPL live free, IPL live streaming today, IPL live stream free, IPL 2026 today, IPL match today live score, IPL score today, IPL live score ball by ball, Indian Premier League 2026 live, watch IPL 2026 online free, IPL live cricket today, IPL scorecard today, IPL points table 2026, IPL schedule 2026, IPL 2026 results, IPL streaming free 2026, MI vs RCB Wankhede, LSG vs GT Ekana, Yashasvi Jaiswal RR, Heinrich Klaasen SRH, Tilak Varma MI, Rajat Patidar RCB, Kagiso Rabada GT, Mitchell Marsh LSG"
        url="/ipl"
        structuredData={[IPL_SD, IPL_FAQ_SD]}
      />

      {/* Hero */}
      <div style={{
        padding: "48px 32px", borderRadius: 20, marginBottom: 32, textAlign: "center",
        background: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(13,20,38,0.95) 100%)",
        border: "1px solid rgba(245,158,11,0.2)"
      }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 8, color: "var(--text)" }}>
          IPL 2026 Live Score Today
        </h1>
        <p style={{ fontSize: 16, color: "var(--text2)", marginBottom: 8 }}>
          Indian Premier League 2026 — Ball-by-Ball Commentary &amp; Real-Time Scorecard
        </p>
        <p style={{ fontSize: 13, color: "#f59e0b", fontWeight: 700, marginBottom: 20 }}>
          🔴 Today: LSG vs GT (3:30 PM IST) &nbsp;·&nbsp; MI vs RCB (7:30 PM IST)
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/live" style={{ padding: "10px 24px", borderRadius: 10, background: "rgba(245,158,11,0.9)", color: "#000", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
            🔴 Live Updates
          </Link>
          <Link to="/ipl-live-stream" style={{ padding: "10px 24px", borderRadius: 10, background: "rgba(239,68,68,0.9)", color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
            📺 Watch IPL Live Free
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
              <div style={{ fontWeight: 700, fontSize: 12, color: "var(--text2)", lineHeight: 1.3, marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", lineHeight: 1.4 }}>
                <span style={{ color: t.color, fontWeight: 700 }}>C: </span>{t.captain}
              </div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 3, lineHeight: 1.4 }}>{t.key}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Content Block — today's matches + key players + keyword-rich */}
      <section aria-label="About IPL 2026" style={{
        padding: "28px 32px", borderRadius: 16,
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)"
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>IPL 2026 Today — LSG vs GT &amp; MI vs RCB Live Score</h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.8, marginBottom: 10 }}>
          Today's IPL 2026 action features two blockbuster matches. <strong style={{ color: "var(--text2)" }}>LSG vs GT (Match 19)</strong> at Ekana Cricket Stadium, Lucknow — Rishabh Pant's Lucknow Super Giants take on Shubman Gill's Gujarat Titans at 3:30 PM IST. GT won the toss and elected to bowl. Key players: Mitchell Marsh, Aiden Markram (LSG) vs Kagiso Rabada, Jos Buttler (GT).
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.8, marginBottom: 10 }}>
          The night game brings the most anticipated clash — <strong style={{ color: "var(--text2)" }}>MI vs RCB (Match 20)</strong> at Wankhede Stadium, Mumbai at 7:30 PM IST. Hardik Pandya's Mumbai Indians host defending champions Royal Challengers Bengaluru led by Rajat Patidar. The match features the iconic <strong style={{ color: "var(--text2)" }}>Rohit Sharma vs Virat Kohli</strong> rivalry alongside Tilak Varma, Phil Salt and Mitchell Santner.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.8, marginBottom: 10 }}>
          Also live today: <strong style={{ color: "var(--text2)" }}>Namibia vs Scotland</strong> (ICC CWC League 2 ODI) at Wanderers Cricket Ground, Windhoek. County Championship Day 3 matches — Essex vs Somerset, Notts vs Glamorgan, Surrey vs Leicestershire and Durham fixtures are also in progress.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.8 }}>
          Get the fastest <strong style={{ color: "var(--text2)" }}>IPL 2026 live score</strong> with ball-by-ball commentary updated every 15 seconds. <strong style={{ color: "var(--text2)" }}>Watch IPL live streaming free</strong> — click any match and hit Watch. No signup, no subscription. IPL 2026 runs March 28 – May 31, 2026 with 84 matches — the biggest IPL season ever.
        </p>
        {/* Keyword tags for crawlers */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
          {[
            "LSG vs GT Live", "MI vs RCB Live", "Virat Kohli IPL 2026", "Rohit Sharma IPL",
            "Rishabh Pant LSG", "Shubman Gill GT", "Hardik Pandya MI", "Yashasvi Jaiswal RR",
            "Heinrich Klaasen SRH", "Kagiso Rabada GT", "IPL Today Match", "IPL Live Score",
            "Watch IPL Free", "IPL Streaming", "NAM vs SCO Live", "County Cricket Live"
          ].map(tag => (
            <span key={tag} style={{
              fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
              background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
              color: "#f59e0b"
            }}>{tag}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
