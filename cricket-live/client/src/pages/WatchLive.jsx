import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMatches } from "../api";
import SEO from "../components/SEO";
import WatchSection from "../components/WatchSection";

const WATCH_SD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Watch Live Cricket Online Free - Live Stream 2026",
  "description": "Watch live cricket matches online free. Stream IPL 2026, T20 World Cup, ODI, Test matches live on YouTube. Free cricket live streaming with no signup required.",
  "url": "https://www.livecricketzone.com/watch-live",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.livecricketzone.com" },
      { "@type": "ListItem", "position": 2, "name": "Watch Live Cricket", "item": "https://www.livecricketzone.com/watch-live" }
    ]
  },
  "mainEntity": {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to watch live cricket online free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can watch live cricket online free on Live Cricket Zone. Click the Watch button on any live match to stream it directly via YouTube. No signup or subscription required."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I watch IPL 2026 live stream free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Watch IPL 2026 live stream free on Live Cricket Zone. We embed official YouTube streams for every IPL match. Click any live IPL match and hit the Watch button."
        }
      },
      {
        "@type": "Question",
        "name": "Can I watch cricket live without subscription?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Live Cricket Zone provides free cricket live streaming via YouTube embeds. No subscription, no signup — just click Watch on any live match."
        }
      },
      {
        "@type": "Question",
        "name": "Which cricket matches are available to watch live?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All live cricket matches are available including IPL 2026, T20 World Cup, ODI series, Test matches, PSL, BBL, CPL and more. International matches often have official YouTube streams from cricket boards."
        }
      }
    ]
  }
};

export default function WatchLive() {
  const navigate = useNavigate();
  const [openMatch, setOpenMatch] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["allMatches"],
    queryFn: fetchAllMatches,
    refetchInterval: 30000,
  });

  const liveMatches = data?.data?.live || [];
  const upcomingMatches = (data?.data?.upcoming || []).slice(0, 6);

  return (
    <>
      <SEO
        title="Watch Live Cricket Online Free - Live Stream 2026"
        description="Watch live cricket match online free. Stream IPL 2026, T20 World Cup, ODI, Test matches live on YouTube. Free cricket live streaming — no signup required. Watch cricket live stream today."
        keywords="watch live cricket, watch cricket live, live cricket streaming, watch live match, cricket live stream free, watch cricket online, live cricket match today, stream cricket live, watch ipl live, watch t20 world cup live, free cricket streaming, cricket live tv, watch cricket match online, live cricket video, cricket streaming sites, watch cricket live free online, cricket live stream today, live cricket stream, cricket online free, watch cricket free, cricket live watch, live cricket online, cricket streaming free, watch cricket match live, cricket live match watch, live cricket stream free, cricket watch online free"
        url="/watch-live"
        structuredData={WATCH_SD}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(17,24,39,0.95) 100%)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 20, padding: "32px 28px", marginBottom: 28, textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📺</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 10, letterSpacing: -0.5 }}>
            Watch Live Cricket Online Free
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 20px", lineHeight: 1.6 }}>
            Stream live cricket matches directly via YouTube — no signup, no subscription. IPL 2026, T20 World Cup, ODI, Test matches and more.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["IPL 2026", "T20 World Cup", "ODI Series", "Test Cricket", "PSL", "BBL"].map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
                color: "#f87171",
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Live matches */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "livePulse 2s infinite" }} />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#ef4444", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Live Now — Click to Watch
            </h2>
          </div>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 72, borderRadius: 12, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          ) : liveMatches.length === 0 ? (
            <div style={{
              padding: "32px 20px", textAlign: "center",
              background: "rgba(255,255,255,0.02)", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🏏</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>No live matches right now. Check upcoming matches below.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {liveMatches.map(match => (
                <div key={match.id}>
                  <div
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 18px", borderRadius: openMatch === match.id ? "12px 12px 0 0" : 12,
                      background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
                      cursor: "pointer", gap: 12,
                    }}
                    onClick={() => navigate(`/match/${match.id}?watch=1`)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 3 }}>{match.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{match.matchType} · {match.venue?.split(",")[0]}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: "#ef4444", background: "rgba(239,68,68,0.15)", padding: "2px 8px", borderRadius: 20 }}>● LIVE</span>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/match/${match.id}?watch=1`); }}
                        style={{
                          background: "#ef4444", color: "#fff", border: "none",
                          borderRadius: 8, padding: "6px 14px", fontSize: 12,
                          fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        ▶ Watch
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        {upcomingMatches.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "rgba(255,255,255,0.7)", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>
              📅 Upcoming Matches
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {upcomingMatches.map(match => (
                <div
                  key={match.id}
                  onClick={() => navigate(`/match/${match.id}`)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 18px", borderRadius: 10, cursor: "pointer",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 2 }}>{match.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{match.matchType} · {match.date}</div>
                  </div>
                  <span style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>Set Reminder →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO text block — visible to crawlers and users */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: "24px 28px", marginBottom: 28,
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
            How to Watch Live Cricket Online Free
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { n: "1", t: "Find your match", d: "Browse live or upcoming matches above. All current cricket matches are listed in real time." },
              { n: "2", t: "Click Watch", d: "Hit the Watch button on any match. We search YouTube for the official live stream or highlights." },
              { n: "3", t: "Stream instantly", d: "The YouTube video plays directly on the page — no redirect, no signup, completely free." },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#f87171", flexShrink: 0,
                }}>{s.n}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 3 }}>{s.t}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ — helps with "People also ask" */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: "24px 28px",
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: "Is live cricket streaming free on this site?", a: "Yes, completely free. We embed YouTube streams — no subscription or account needed." },
            { q: "Which tournaments can I watch live?", a: "IPL 2026, T20 World Cup, ODI series, Test matches, PSL, BBL, CPL, BPL and all international cricket." },
            { q: "Do I need to create an account to watch?", a: "No account needed. Just click Watch on any match and the stream loads instantly." },
            { q: "Why can't I find a stream for some matches?", a: "Some domestic matches may not have official YouTube streams. We automatically search for the best available video." },
          ].map((faq, i) => (
            <div key={i} style={{
              paddingBottom: 14, marginBottom: 14,
              borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 6 }}>Q: {faq.q}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>A: {faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity: 0.35; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </>
  );
}
