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
  "description": "Watch live cricket matches online free. Stream IPL 2026, T20 World Cup, ODI, Test matches live on YouTube. Free cricket live streaming — no signup required.",
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
      { "@type": "Question", "name": "How to watch live cricket online free?", "acceptedAnswer": { "@type": "Answer", "text": "Watch live cricket free on Live Cricket Zone. Click Watch on any live match — YouTube stream plays instantly, no signup needed." } },
      { "@type": "Question", "name": "Where can I watch IPL 2026 live stream free?", "acceptedAnswer": { "@type": "Answer", "text": "Watch IPL 2026 live stream free at livecricketzone.com/ipl — official YouTube streams embedded for every match." } },
      { "@type": "Question", "name": "Can I watch cricket live without subscription?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Live Cricket Zone embeds YouTube streams — completely free, no subscription or account required." } },
      { "@type": "Question", "name": "Which countries can watch cricket live here?", "acceptedAnswer": { "@type": "Answer", "text": "Available worldwide — UK, India, Pakistan, Australia, USA, Canada, UAE, South Africa and all cricket-following nations." } }
    ]
  }
};

// Country audience tags — shows global reach
const COUNTRIES = [
  { flag: "🇬🇧", name: "UK" },
  { flag: "🇮🇳", name: "India" },
  { flag: "🇵🇰", name: "Pakistan" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇺🇸", name: "USA" },
  { flag: "🇿🇦", name: "South Africa" },
  { flag: "🇳🇿", name: "New Zealand" },
  { flag: "🇦🇪", name: "UAE" },
  { flag: "🇧🇩", name: "Bangladesh" },
  { flag: "🇱🇰", name: "Sri Lanka" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇯🇲", name: "West Indies" },
];

export default function WatchLive() {
  const navigate = useNavigate();
  const [expandedMatch, setExpandedMatch] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["allMatches"],
    queryFn: fetchAllMatches,
    refetchInterval: 30000,
  });

  const liveMatches = data?.data?.live || [];
  const upcomingMatches = (data?.data?.upcoming || []).slice(0, 8);

  return (
    <>
      <SEO
        title="Watch Live Cricket Online Free - Live Stream 2026"
        description="Watch live cricket match online free. Stream IPL 2026, T20 World Cup, ODI, Test matches live on YouTube. Free cricket live streaming worldwide — UK, India, Pakistan, Australia, USA. No signup required."
        keywords="watch live cricket, watch cricket live, live cricket streaming, watch live match, cricket live stream free, watch cricket online, live cricket match today, stream cricket live, watch ipl live, watch t20 world cup live, free cricket streaming, cricket live tv, watch cricket match online, live cricket video, cricket streaming sites, watch cricket live free online, cricket live stream today, live cricket stream, cricket online free, watch cricket free, cricket live watch, live cricket online, cricket streaming free, watch cricket match live, cricket live match watch, live cricket stream free, cricket watch online free, watch cricket uk, watch cricket india, watch cricket pakistan, watch cricket australia, watch cricket usa, cricket live stream uk, cricket live stream free uk, sky sports cricket live stream free, watch cricket online uk free"
        url="/watch-live"
        structuredData={WATCH_SD}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(17,24,39,0.98) 60%, rgba(99,102,241,0.08) 100%)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 20, padding: "28px 24px 24px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <svg width="44" height="32" viewBox="0 0 44 32" fill="none">
              <rect width="44" height="32" rx="6" fill="#FF0000"/>
              <polygon points="17,9 17,23 30,16" fill="white"/>
            </svg>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: -0.3 }}>
                Watch Live Cricket Free
              </h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "3px 0 0" }}>
                YouTube streams · No signup · Works worldwide
              </p>
            </div>
          </div>

          {/* Country flags — global audience signal */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {COUNTRIES.map(c => (
              <span key={c.name} style={{
                fontSize: 11, padding: "3px 9px", borderRadius: 20,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 4,
              }}>
                {c.flag} {c.name}
              </span>
            ))}
          </div>

          {/* Tournament tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { label: "IPL 2026", color: "#818cf8" },
              { label: "T20 World Cup", color: "#f472b6" },
              { label: "ODI Series", color: "#fbbf24" },
              { label: "Test Cricket", color: "#4ade80" },
              { label: "County Championship 🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "#60a5fa" },
              { label: "PSL", color: "#34d399" },
              { label: "BBL", color: "#fb923c" },
              { label: "CPL", color: "#38bdf8" },
              { label: "Women's Cricket", color: "#e879f9" },
            ].map(t => (
              <span key={t.label} style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                background: `${t.color}18`, border: `1px solid ${t.color}40`,
                color: t.color,
              }}>{t.label}</span>
            ))}
          </div>
        </div>

        {/* Live matches with inline watch */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "livePulse 2s infinite" }} />
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "#ef4444", margin: 0, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Live Now
            </h2>
            {liveMatches.length > 0 && (
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
                {liveMatches.length} match{liveMatches.length !== 1 ? "es" : ""}
              </span>
            )}
          </div>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1, 2].map(i => (
                <div key={i} style={{ height: 68, borderRadius: 12, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          ) : liveMatches.length === 0 ? (
            <div style={{
              padding: "28px 20px", textAlign: "center",
              background: "rgba(255,255,255,0.02)", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏏</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>No live matches right now.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {liveMatches.map(match => (
                <div key={match.id}>
                  {/* Match row */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: expandedMatch === match.id ? "12px 12px 0 0" : 12,
                    background: expandedMatch === match.id
                      ? "rgba(239,68,68,0.12)"
                      : "rgba(239,68,68,0.06)",
                    border: `1px solid ${expandedMatch === match.id ? "rgba(239,68,68,0.35)" : "rgba(239,68,68,0.18)"}`,
                    borderBottom: expandedMatch === match.id ? "none" : undefined,
                    gap: 12, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                    onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: "#fff", marginBottom: 2 }}>{match.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                        {match.matchType} · {match.venue?.split(",")[0] || ""}
                        {match.score?.length > 0 && (
                          <span style={{ marginLeft: 8, color: "#f87171", fontWeight: 700 }}>
                            {match.score.map(s => `${s.r}/${s.w}`).join(" | ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 9, fontWeight: 900, color: "#ef4444", background: "rgba(239,68,68,0.15)", padding: "2px 7px", borderRadius: 20 }}>● LIVE</span>
                      <button
                        onClick={e => { e.stopPropagation(); setExpandedMatch(expandedMatch === match.id ? null : match.id); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          background: expandedMatch === match.id ? "#ef4444" : "rgba(239,68,68,0.2)",
                          border: "none", color: "#fff",
                          borderRadius: 7, padding: "5px 12px",
                          fontSize: 11, fontWeight: 700, cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polygon points="2,1 2,9 9,5" fill="white"/></svg>
                        {expandedMatch === match.id ? "Close" : "Watch"}
                      </button>
                    </div>
                  </div>

                  {/* Inline WatchSection */}
                  {expandedMatch === match.id && (
                    <div style={{ borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
                      <WatchSection match={match} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        {upcomingMatches.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.6)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>
              📅 Upcoming — Highlights Available After Match
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {upcomingMatches.map(match => (
                <div
                  key={match.id}
                  onClick={() => navigate(`/match/${match.id}`)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 16px", borderRadius: 10, cursor: "pointer",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12, color: "#fff", marginBottom: 1 }}>{match.name}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{match.matchType} · {match.date}</div>
                  </div>
                  <span style={{ fontSize: 10, color: "#38bdf8", fontWeight: 700, flexShrink: 0 }}>View →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO content — "People also ask" + global audience */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: "22px 24px", marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
            Watch Cricket Live from Anywhere in the World
          </h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 14 }}>
            Cricket is followed by over 2.5 billion fans worldwide — from the UK, India, Pakistan, Australia, South Africa, New Zealand, West Indies, Bangladesh, Sri Lanka, UAE, USA and Canada. Live Cricket Zone brings you free live cricket streams via YouTube so fans everywhere can watch without a subscription.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", label: "UK viewers", detail: "Sky Sports, BBC Sport, County Championship" },
              { flag: "🇮🇳", label: "India viewers", detail: "Star Sports, JioCinema streams" },
              { flag: "🇵🇰", label: "Pakistan viewers", detail: "PTV Sports, Geo Super streams" },
              { flag: "🇦🇺", label: "Australia viewers", detail: "Fox Cricket, Channel 7 streams" },
            ].map(r => (
              <div key={r.label} style={{
                padding: "10px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{r.flag} {r.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{r.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: "22px 24px",
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: "Is live cricket streaming free?", a: "Yes — completely free. We embed YouTube streams. No subscription, no account needed." },
            { q: "Can I watch cricket live in the UK?", a: "Yes. We search for Sky Sports Cricket, BBC Sport and other UK broadcaster streams on YouTube." },
            { q: "Which tournaments can I watch?", a: "IPL 2026, T20 World Cup, ODI series, Test matches, PSL, BBL, CPL, BPL and all international cricket." },
            { q: "Why is the video muted at first?", a: "Browsers require videos to start muted for autoplay. Just click the volume icon in the player to unmute." },
            { q: "What if no stream is found?", a: "We automatically try multiple search queries. If still not found, a direct YouTube search link is provided." },
          ].map((faq, i, arr) => (
            <div key={i} style={{
              paddingBottom: 12, marginBottom: 12,
              borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: "#fff", marginBottom: 4 }}>Q: {faq.q}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>A: {faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 0.7; } }
      `}</style>
    </>
  );
}
