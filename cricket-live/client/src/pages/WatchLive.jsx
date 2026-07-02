import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMatches } from "../api";
import SEO from "../components/SEO";
import WatchSection from "../components/WatchSection";
import StreamDisclaimer from "../components/StreamDisclaimer";

const HIGHLIGHTS_SD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Cricket Highlights - Official Match Highlights & Live Scores",
  "description":
    "Watch official cricket match highlights and follow live scores for IPL, T20, ODI and Test matches. Highlights are embedded from official YouTube channels.",
  "url": "https://www.livecricketzone.com/watch-live",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.livecricketzone.com" },
      { "@type": "ListItem", "position": 2, "name": "Cricket Highlights", "item": "https://www.livecricketzone.com/watch-live" },
    ],
  },
};

export default function WatchLive() {
  const navigate = useNavigate();
  const [expandedMatch, setExpandedMatch] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["allMatches"],
    queryFn: fetchAllMatches,
    refetchInterval: 60000,
  });

  const recentMatches = (data?.data?.recent || []).slice(0, 12);
  const liveMatches = data?.data?.live || [];

  return (
    <>
      <SEO
        title="Cricket Highlights - Official Match Highlights & Live Scores"
        description="Watch official cricket match highlights and follow live scores. Post-match highlights from IPL, T20 World Cup, ODI and Test cricket are embedded directly from official YouTube channels."
        keywords="cricket highlights, match highlights, IPL highlights, T20 highlights, cricket live scores"
        url="/watch-live"
        structuredData={HIGHLIGHTS_SD}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.14) 0%, rgba(17,24,39,0.98) 60%, rgba(59,130,246,0.06) 100%)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 20, padding: "28px 24px 24px", marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="44" height="32" viewBox="0 0 44 32" fill="none">
              <rect width="44" height="32" rx="6" fill="#FF0000" />
              <polygon points="17,9 17,23 30,16" fill="white" />
            </svg>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: -0.3 }}>
                Cricket Highlights
              </h1>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "3px 0 0" }}>
                Official post-match highlights · Live scores
              </p>
            </div>
          </div>
        </div>

        {/* Live now — scores only, link to live scores */}
        {liveMatches.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#ef4444", margin: 0, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Live Now
              </h2>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                Follow ball-by-ball scores
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {liveMatches.slice(0, 6).map((match) => (
                <div
                  key={match.id}
                  onClick={() => navigate(`/match/${match.id}`)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                    background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#fff", marginBottom: 2 }}>{match.name}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                      {match.matchType} · {match.venue?.split(",")[0] || ""}
                      {match.score?.length > 0 && (
                        <span style={{ marginLeft: 8, color: "#f87171", fontWeight: 700 }}>
                          {match.score.map((s) => `${s.r}/${s.w}`).join(" | ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: "#f87171", fontWeight: 700, flexShrink: 0 }}>Live Score →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent matches with highlights */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.7)", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>
            🏏 Recent Match Highlights
          </h2>

          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: 68, borderRadius: 12, background: "rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          ) : recentMatches.length === 0 ? (
            <div
              style={{
                padding: "28px 20px", textAlign: "center",
                background: "rgba(255,255,255,0.02)", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏏</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
                No recent matches available right now.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentMatches.map((match) => (
                <div key={match.id}>
                  <div
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: expandedMatch === match.id ? "12px 12px 0 0" : 12,
                      background: expandedMatch === match.id ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${expandedMatch === match.id ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.07)"}`,
                      borderBottom: expandedMatch === match.id ? "none" : undefined,
                      gap: 12, cursor: "pointer", transition: "all 0.15s",
                    }}
                    onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: "#fff", marginBottom: 2 }}>{match.name}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                        {match.matchType} · {match.status || match.venue?.split(",")[0] || ""}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMatch(expandedMatch === match.id ? null : match.id);
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        background: expandedMatch === match.id ? "#3B82F6" : "rgba(59,130,246,0.2)",
                        border: "none", color: "#fff", borderRadius: 7, padding: "5px 12px",
                        fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polygon points="2,1 2,9 9,5" fill="white" /></svg>
                      {expandedMatch === match.id ? "Close" : "Highlights"}
                    </button>
                  </div>

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

        {/* Disclaimer */}
        <StreamDisclaimer />

        {/* Informational content */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14, padding: "22px 24px", marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
            About Cricket Highlights on Live Cricket Zone
          </h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 12 }}>
            This page collects official post-match highlight reels for recently completed cricket
            matches across all formats — the Indian Premier League, T20 World Cup, ODI series and Test
            matches. Highlights are embedded directly from the official YouTube channels of the rights
            holders (such as the IPL, ICC and broadcaster channels), usually within a couple of hours
            of play ending.
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
            To follow a match in progress, open any live fixture above for live scores, ball-by-ball
            commentary and the full scorecard. For live television coverage, please use your official
            licensed broadcaster — Live Cricket Zone does not host or rebroadcast live matches.
          </p>
        </div>

        {/* FAQ */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14, padding: "22px 24px",
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: "Where do the highlights come from?", a: "Every clip is embedded from the official YouTube channel of the rights holder or broadcaster. We do not host or upload any video ourselves." },
            { q: "How soon are highlights available?", a: "Official channels usually publish highlight reels within a couple of hours of a match ending. If nothing shows yet, check back a little later." },
            { q: "Can I watch matches live here?", a: "No. We show live scores and scorecards, but not live video. To watch live, use your official licensed broadcaster." },
            { q: "Why is a match missing highlights?", a: "Not every match has an official highlights upload, and some are region-restricted on YouTube. When that happens we link you to a YouTube search instead." },
          ].map((faq, i, arr) => (
            <div
              key={i}
              style={{
                paddingBottom: 12, marginBottom: 12,
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 12, color: "#fff", marginBottom: 4 }}>Q: {faq.q}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>A: {faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
