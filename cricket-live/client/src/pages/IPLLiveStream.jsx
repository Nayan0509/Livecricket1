import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMatches } from "../api";
import SEO from "../components/SEO";
import WatchSection from "../components/WatchSection";

// ── Structured data ────────────────────────────────────────────────────────
const SD_WEBPAGE = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "IPL 2026 Live Stream Free - Watch IPL Online",
  "description": "Watch IPL 2026 live stream free online. Stream every Indian Premier League match live — MI, CSK, RCB, KKR, GT, LSG, DC, PBKS, RR, SRH. No signup, no subscription.",
  "url": "https://www.livecricketzone.com/ipl-live-stream",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",        "item": "https://www.livecricketzone.com" },
      { "@type": "ListItem", "position": 2, "name": "IPL 2026",    "item": "https://www.livecricketzone.com/ipl" },
      { "@type": "ListItem", "position": 3, "name": "IPL Live Stream", "item": "https://www.livecricketzone.com/ipl-live-stream" }
    ]
  }
};

const SD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How to watch IPL 2026 live stream free?",
      "acceptedAnswer": { "@type": "Answer", "text": "Watch IPL 2026 live stream free on Live Cricket Zone at livecricketzone.com/ipl-live-stream. Click any live IPL match and the stream opens instantly in a new tab. No signup, no subscription, no payment required." }
    },
    {
      "@type": "Question",
      "name": "Where can I watch IPL live stream online free?",
      "acceptedAnswer": { "@type": "Answer", "text": "Watch IPL live stream online free on livecricketzone.com. We provide free live streaming for every IPL 2026 match — MI vs RCB, CSK vs DC, LSG vs GT, KKR vs SRH and all other matches. Works on mobile and desktop." }
    },
    {
      "@type": "Question",
      "name": "Can I watch IPL live stream without JioCinema subscription?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Live Cricket Zone provides free IPL live streaming without any JioCinema, Hotstar or Star Sports subscription. Watch IPL 2026 free online — no account needed." }
    },
    {
      "@type": "Question",
      "name": "Which app is best for IPL live stream free?",
      "acceptedAnswer": { "@type": "Answer", "text": "Live Cricket Zone (livecricketzone.com) is the best free IPL live stream website. Open it in Chrome browser for the best experience. No app download needed — works directly in your browser." }
    },
    {
      "@type": "Question",
      "name": "How to watch IPL live stream on mobile free?",
      "acceptedAnswer": { "@type": "Answer", "text": "Open livecricketzone.com/ipl-live-stream on your mobile Chrome browser. Click any live IPL match — the stream opens in a new tab. Free, no signup, works on Android and iPhone." }
    },
    {
      "@type": "Question",
      "name": "Where to watch IPL 2026 live stream in India?",
      "acceptedAnswer": { "@type": "Answer", "text": "Watch IPL 2026 live stream free in India on Live Cricket Zone. Stream every match live — Wankhede, Eden Gardens, Ekana, Chinnaswamy and all IPL venues. Free, no JioCinema subscription needed." }
    },
    {
      "@type": "Question",
      "name": "Where to watch IPL 2026 live stream in UK?",
      "acceptedAnswer": { "@type": "Answer", "text": "Watch IPL 2026 live stream free in UK on Live Cricket Zone. Stream every IPL match live without Sky Sports subscription. Works on all UK devices — free, no signup." }
    },
    {
      "@type": "Question",
      "name": "Is IPL live stream free on Live Cricket Zone?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes — IPL live stream is completely free on Live Cricket Zone. No subscription, no account, no payment. Just open the site, click any live IPL match and watch." }
    }
  ]
};

const SD_VIDEO = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "IPL 2026 Live Stream Free - Indian Premier League Live",
  "description": "Watch IPL 2026 live stream free online. Every Indian Premier League match streamed live — no signup, no subscription required.",
  "thumbnailUrl": "https://www.livecricketzone.com/og-image.png",
  "uploadDate": "2026-03-28",
  "contentUrl": "https://www.livecricketzone.com/ipl-live-stream",
  "embedUrl": "https://www.livecricketzone.com/ipl-live-stream",
  "isAccessibleForFree": true,
  "isLiveBroadcast": true
};

const IPL_TEAMS = [
  { short: "MI",   name: "Mumbai Indians",              color: "#004BA0" },
  { short: "CSK",  name: "Chennai Super Kings",         color: "#F9CD05" },
  { short: "RCB",  name: "Royal Challengers Bengaluru", color: "#EC1C24" },
  { short: "KKR",  name: "Kolkata Knight Riders",       color: "#3A225D" },
  { short: "GT",   name: "Gujarat Titans",              color: "#1B8B4B" },
  { short: "LSG",  name: "Lucknow Super Giants",        color: "#A72056" },
  { short: "DC",   name: "Delhi Capitals",              color: "#0078BC" },
  { short: "PBKS", name: "Punjab Kings",                color: "#ED1B24" },
  { short: "RR",   name: "Rajasthan Royals",            color: "#254AA5" },
  { short: "SRH",  name: "Sunrisers Hyderabad",         color: "#F7A721" },
];

export default function IPLLiveStream() {
  const navigate = useNavigate();
  const [expandedMatch, setExpandedMatch] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["allMatches"],
    queryFn: fetchAllMatches,
    refetchInterval: 30000,
  });

  const liveMatches  = (data?.data?.live     || []).filter(m =>
    m.name?.toLowerCase().includes("ipl") ||
    m.series?.toLowerCase().includes("ipl") ||
    ["mumbai indians","chennai super kings","royal challengers","kolkata knight riders",
     "gujarat titans","lucknow super giants","delhi capitals","punjab kings",
     "rajasthan royals","sunrisers hyderabad"].some(t => m.name?.toLowerCase().includes(t))
  );
  const upcomingMatches = (data?.data?.upcoming || []).filter(m =>
    m.name?.toLowerCase().includes("ipl") ||
    m.series?.toLowerCase().includes("ipl")
  ).slice(0, 6);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>
      <SEO
        title="IPL 2026 Live Stream Free - Watch IPL Online No Signup"
        description="Watch IPL 2026 live stream free online. Stream every IPL match live — MI, CSK, RCB, KKR, GT, LSG, DC, PBKS, RR, SRH. No JioCinema subscription needed. Free, no signup, works on mobile & desktop."
        keywords="IPL live stream free, IPL 2026 live stream, watch IPL live stream, IPL live stream online free, IPL live streaming free, watch IPL online free, IPL live stream today, IPL 2026 live streaming, free IPL live stream, IPL stream free, watch IPL live free, IPL live stream no signup, IPL live stream without subscription, IPL live stream India free, IPL live stream UK free, IPL live stream mobile free, watch IPL 2026 online, IPL live cricket stream, IPL streaming free 2026, IPL live stream HD free, watch IPL live stream today, IPL match live stream free, IPL 2026 stream online, live IPL stream free, IPL live stream website, best IPL live stream site, IPL free live stream 2026, watch IPL without JioCinema, watch IPL without Hotstar, IPL live stream no subscription, MI live stream, CSK live stream, RCB live stream, KKR live stream, IPL live stream ball by ball, IPL score live stream, IPL 2026 live match stream"
        url="/ipl-live-stream"
        structuredData={[SD_WEBPAGE, SD_FAQ, SD_VIDEO]}
      />

      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(17,24,39,0.98) 60%, rgba(245,158,11,0.08) 100%)",
        border: "1px solid rgba(239,68,68,0.25)", borderRadius: 20,
        padding: "32px 28px 28px", marginBottom: 24,
      }}>
        {/* Live badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{
            fontSize: 10, fontWeight: 900, background: "#ef4444", color: "#fff",
            padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 1,
            animation: "livePulse 2s infinite",
          }}>● LIVE</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>IPL 2026 · Free Stream</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 10px", lineHeight: 1.2 }}>
          IPL 2026 Live Stream Free
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 20px", lineHeight: 1.6 }}>
          Watch every Indian Premier League 2026 match live online — free, no signup, no subscription.
          Works on mobile &amp; desktop. Open in <strong style={{ color: "#fde047" }}>Chrome</strong> for best experience.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/ipl" style={{
            padding: "10px 22px", borderRadius: 10,
            background: "linear-gradient(135deg,#f59e0b,#ef4444)",
            color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none",
          }}>🏏 IPL 2026 Scores</Link>
          <Link to="/watch-live" style={{
            padding: "10px 22px", borderRadius: 10,
            border: "1px solid rgba(239,68,68,0.4)", color: "#fb7185",
            fontWeight: 700, fontSize: 13, textDecoration: "none",
          }}>📺 All Live Streams</Link>
          <Link to="/live" style={{
            padding: "10px 22px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)",
            fontWeight: 700, fontSize: 13, textDecoration: "none",
          }}>📊 Live Scores</Link>
        </div>
      </div>

      {/* ── LIVE IPL MATCHES ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", animation: "livePulse 2s infinite" }} />
          <h2 style={{ fontSize: 14, fontWeight: 800, color: "#ef4444", margin: 0, textTransform: "uppercase", letterSpacing: 0.8 }}>
            IPL Live Now
          </h2>
          {liveMatches.length > 0 && (
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{liveMatches.length} match{liveMatches.length !== 1 ? "es" : ""}</span>
          )}
        </div>

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2].map(i => <div key={i} style={{ height: 68, borderRadius: 12, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s infinite" }} />)}
          </div>
        ) : liveMatches.length === 0 ? (
          <div style={{ padding: "28px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏏</div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>No IPL matches live right now. Check upcoming matches below.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {liveMatches.map(match => (
              <div key={match.id}>
                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: expandedMatch === match.id ? "12px 12px 0 0" : 12,
                    background: expandedMatch === match.id ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.06)",
                    border: `1px solid ${expandedMatch === match.id ? "rgba(239,68,68,0.35)" : "rgba(239,68,68,0.18)"}`,
                    borderBottom: expandedMatch === match.id ? "none" : undefined,
                    cursor: "pointer", transition: "all 0.15s",
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
                        border: "none", color: "#fff", borderRadius: 7, padding: "5px 14px",
                        fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "background 0.15s",
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polygon points="2,1 2,9 9,5" fill="white"/></svg>
                      {expandedMatch === match.id ? "Close" : "Watch Free"}
                    </button>
                  </div>
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

      {/* ── UPCOMING IPL ── */}
      {upcomingMatches.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>
            📅 Upcoming IPL Matches
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
                <span style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700, flexShrink: 0 }}>Stream Soon →</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── IPL TEAMS ── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>
          🏏 Watch All IPL Teams Live
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
          {IPL_TEAMS.map(t => (
            <Link key={t.short} to="/ipl" style={{ textDecoration: "none" }}>
              <div style={{
                padding: "12px 10px", borderRadius: 10, textAlign: "center",
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                transition: "border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.color}60`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", margin: "0 auto 8px",
                  background: `${t.color}22`, border: `2px solid ${t.color}60`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 11, color: t.color,
                }}>{t.short}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", lineHeight: 1.3 }}>{t.name}</div>
                <div style={{ fontSize: 9, color: t.color, fontWeight: 700, marginTop: 4 }}>Watch Live →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── SEO CONTENT BLOCK ── */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 28px", marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
          Watch IPL 2026 Live Stream Free — No Subscription Needed
        </h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 12 }}>
          Live Cricket Zone is the best free website to <strong style={{ color: "#fff" }}>watch IPL 2026 live stream online</strong>. Stream every Indian Premier League match live — Mumbai Indians (MI), Chennai Super Kings (CSK), Royal Challengers Bengaluru (RCB), Kolkata Knight Riders (KKR), Gujarat Titans (GT), Lucknow Super Giants (LSG), Delhi Capitals (DC), Punjab Kings (PBKS), Rajasthan Royals (RR) and Sunrisers Hyderabad (SRH).
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 12 }}>
          No JioCinema subscription, no Hotstar, no Star Sports login needed. <strong style={{ color: "#fff" }}>IPL live stream free</strong> — just open the site, click any live match and watch instantly. Works on mobile (Android &amp; iPhone) and desktop. Open in <strong style={{ color: "#fde047" }}>Google Chrome</strong> for the best streaming experience.
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
          Available worldwide — <strong style={{ color: "#fff" }}>IPL live stream India</strong>, IPL live stream UK, IPL live stream USA, IPL live stream Pakistan, IPL live stream Australia, IPL live stream UAE, IPL live stream Canada, IPL live stream South Africa. Watch Virat Kohli (RCB), Rohit Sharma (MI), Hardik Pandya (MI), Rishabh Pant (LSG), Shubman Gill (GT) and all IPL 2026 stars live for free.
        </p>
        {/* Keyword tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
          {[
            "IPL Live Stream Free", "Watch IPL Online Free", "IPL 2026 Live Stream",
            "IPL Stream No Signup", "Free IPL Streaming", "IPL Live HD Free",
            "Watch IPL Mobile Free", "IPL Live Stream India", "IPL Live Stream UK",
            "MI Live Stream", "CSK Live Stream", "RCB Live Stream", "KKR Live Stream",
            "No JioCinema Needed", "No Hotstar Needed",
          ].map(tag => (
            <span key={tag} style={{
              fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
              color: "#fb7185",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "24px 28px" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
          IPL Live Stream — Frequently Asked Questions
        </h2>
        {[
          { q: "Is IPL 2026 live stream really free?",           a: "Yes — completely free. No subscription, no account, no payment. Just open livecricketzone.com/ipl-live-stream and click any live IPL match." },
          { q: "How to watch IPL live stream on mobile?",        a: "Open livecricketzone.com/ipl-live-stream in Chrome on your Android or iPhone. Click any live IPL match — stream opens in a new tab instantly." },
          { q: "Can I watch IPL without JioCinema?",             a: "Yes. Live Cricket Zone provides free IPL streaming without JioCinema, Hotstar or any other paid subscription." },
          { q: "Which browser is best for IPL live stream?",     a: "Google Chrome gives the best IPL live stream experience. We recommend using Chrome on both mobile and desktop." },
          { q: "Can I watch IPL live stream in UK / USA?",       a: "Yes — IPL live stream works worldwide including UK, USA, Pakistan, Australia, UAE, Canada and South Africa. No geo-restrictions." },
          { q: "What IPL matches can I watch live?",             a: "All 84 IPL 2026 matches — MI, CSK, RCB, KKR, GT, LSG, DC, PBKS, RR, SRH. Every match from March 28 to May 31, 2026." },
        ].map((f, i, arr) => (
          <div key={i} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: "#fff", marginBottom: 4 }}>Q: {f.q}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>A: {f.a}</div>
          </div>
        ))}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:.7} }`}</style>
    </div>
  );
}
