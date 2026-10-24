import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAllMatches } from "../api";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";
import AdBanner from "../components/AdBanner";

/* Fantasy Tips Data */
const FANTASY_TIPS = [
  { emoji: "👑", title: "Pick Form Players", tip: "Always choose batsmen in form. Check last 5 matches average. Form > reputation.", priority: "Must" },
  { emoji: "🏏", title: "Pitch Report Matters", tip: "High-scoring pitches? Pick batters. Low, slow surfaces? Go bowling heavy.", priority: "Must" },
  { emoji: "🎯", title: "All-Rounders are Gold", tip: "Quality all-rounders score double points. Prioritize them as captain/VC.", priority: "Must" },
  { emoji: "💡", title: "Captain Strategy", tip: "Captain earns 2x points. Pick consistent run-scorers or top-order batsmen for tests.", priority: "Key" },
  { emoji: "⚡", title: "Powerplay Bowlers", tip: "In T20s, powerplay bowlers get more wicket chances. Pick 1-2 powerplay specialists.", priority: "Key" },
  { emoji: "🌤️", title: "Weather & Toss", tip: "Weather affects pitch. Toss winners often dictate the game. Monitor closely.", priority: "Key" },
  { emoji: "📊", title: "Head-to-Head Stats", tip: "Some bowlers have great H2H vs specific batsmen. Exploit matchups.", priority: "Bonus" },
  { emoji: "🔄", title: "Differential Picks", tip: "Low-ownership players who perform can win leagues. Take calculated risks.", priority: "Bonus" },
];

const PRIORITY_COLORS = { Must: "#FF1053", Key: "#FFEA00", Bonus: "#B026FF" };

/* Scoring System */
function ScoringSystem({ format }) {
  const batting = format === "test" ? [
    ["Run scored", "+1"], ["Boundary", "+1"], ["Six", "+2"], ["50 runs", "+4"], ["100 runs", "+8"], ["Duck", "-4"],
  ] : format === "odi" ? [
    ["Run scored", "+1"], ["Boundary", "+1"], ["Six", "+2"], ["50 runs", "+4"], ["100 runs", "+8"], ["Duck", "-3"],
  ] : [
    ["Run scored", "+1"], ["Boundary", "+1"], ["Six", "+2"], ["30 runs", "+4"], ["50 runs", "+8"], ["Duck", "-2"],
  ];

  const bowling = format === "test" ? [
    ["Wicket", "+16"], ["5 wickets", "+8"], ["Maiden", "+4"], ["Dot ball", "+1"],
  ] : format === "odi" ? [
    ["Wicket", "+25"], ["4 wickets", "+4"], ["5 wickets", "+8"], ["Maiden", "+4"],
  ] : [
    ["Wicket", "+25"], ["3 wickets", "+4"], ["4 wickets", "+8"], ["Dot ball", "+1"],
  ];

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--divider)", fontSize: 12, fontWeight: 800, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 3, height: 14, borderRadius: 2, background: "#FF1053", display: "inline-block" }} />
        Scoring Guide — {format.toUpperCase()}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <div style={{ padding: "14px 18px", borderRight: "1px solid var(--divider)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#B026FF", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>🏏 Batting</div>
          {batting.map(([lbl, pts], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < batting.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{lbl}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: pts.startsWith("-") ? "#FF5C8A" : "#39FF14" }}>{pts}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#FF1053", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>🎳 Bowling</div>
          {bowling.map(([lbl, pts], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < bowling.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <span style={{ fontSize: 12, color: "var(--text2)" }}>{lbl}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#39FF14" }}>{pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Fantasy() {
  const [format, setFormat] = useState("t20");
  const [activeTab, setActiveTab] = useState("tips");

  const { data: matchData } = useQuery({
    queryKey: ["allMatches"],
    queryFn: fetchAllMatches,
    refetchInterval: 60000,
  });

  const liveMatches = matchData?.data?.live || [];
  const upcomingMatches = matchData?.data?.upcoming || [];
  const allMatches = [...liveMatches, ...upcomingMatches].slice(0, 5);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 80px" }}>
      <SEO
        url="/fantasy"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "32px 28px", borderRadius: 20,
        background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(9,9,11,0.98) 60%, rgba(59,130,246,0.08) 100%)",
        border: "1px solid rgba(139,92,246,0.25)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(139,92,246,0.08)", pointerEvents: "none" }} />
        <div style={{ fontSize: 11, fontWeight: 800, color: "#FF2E9A", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>✨ Fantasy Cricket Hub</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", margin: "0 0 10px", lineHeight: 1.2 }}>
          Build Your <span style={{ color: "#FF2E9A" }}>Dream Team</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--text3)", margin: "0 0 20px", lineHeight: 1.7 }}>
          How fantasy points are scored in each format, and how to think about captaincy, conditions and team balance.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {["t20", "odi", "test"].map(f => (
            <button key={f} onClick={() => setFormat(f)} style={{
              padding: "9px 20px", borderRadius: 8, fontWeight: 800, fontSize: 13,
              background: format === f ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${format === f ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: format === f ? "#FF2E9A" : "var(--text3)", cursor: "pointer", textTransform: "uppercase",
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <AdBanner type="leaderboard" />

      <PageIntro intro={PAGE_INTROS["/fantasy"]} />

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--divider)", marginBottom: 24, marginTop: 20, overflowX: "auto", scrollbarWidth: "none" }}>
        {[
          { id: "tips", label: "📋 Strategy Tips" },
          { id: "scoring", label: "📊 Scoring System" },
          { id: "matches", label: "📅 Upcoming Matches" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: "12px 20px",
            fontSize: 13, fontWeight: activeTab === t.id ? 800 : 600,
            color: activeTab === t.id ? "#FF2E9A" : "var(--text3)",
            borderBottom: `2px solid ${activeTab === t.id ? "#FF2E9A" : "transparent"}`,
            marginBottom: -1, transition: "color 0.18s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tips Tab */}
      {activeTab === "tips" && (
        <div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
            General strategy principles that apply in most fantasy cricket formats.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
            {FANTASY_TIPS.map((tip, i) => {
              const color = PRIORITY_COLORS[tip.priority] || "#6b7280";
              return (
                <div key={i} style={{ background: "var(--card)", border: `1px solid ${color}25`, borderRadius: 14, padding: "18px", borderLeft: `3px solid ${color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 22 }}>{tip.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{tip.title}</span>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 900, color: "#fff", background: color, padding: "2px 8px", borderRadius: 20 }}>
                      {tip.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text3)", margin: 0, lineHeight: 1.7 }}>{tip.tip}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scoring System Tab */}
      {activeTab === "scoring" && (
        <div>
          <div style={{ marginBottom: 16, fontSize: 13, color: "var(--text3)" }}>
            Understanding the fantasy scoring system helps you pick the right players.
          </div>
          <ScoringSystem format={format} />
          <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>🏅 Fielding Points</div>
            {[["Catch", "+8"], ["Stumping", "+12"], ["Run out (direct)", "+12"], ["Run out (indirect)", "+6"]].map(([lbl, pts], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span style={{ fontSize: 12, color: "var(--text2)" }}>{lbl}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#39FF14" }}>{pts}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches Tab */}
      {activeTab === "matches" && (
        <div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
            Create your fantasy team for these upcoming matches.
          </div>
          {allMatches.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
              <p style={{ color: "var(--text3)" }}>No upcoming matches found.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {allMatches.map(m => (
                <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 18px", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; e.currentTarget.style.background = "rgba(139,92,246,0.03)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card)"; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>
                          {m.series || m.matchType} · {m.venue || ""} · {m.date || ""}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#FF2E9A", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", padding: "5px 12px", borderRadius: 20, flexShrink: 0, marginLeft: 12 }}>
                        {m.matchStarted ? "LIVE →" : "Preview →"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AdSense Compliance Disclaimer */}
      <div style={{ marginTop: 32, padding: "16px 20px", borderRadius: 12, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)", color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.6 }}>
        <strong style={{ color: "#fff", display: "block", marginBottom: 4 }}>📌 Educational & Fantasy Strategy Disclaimer</strong>
        Live Cricket Zone provides player statistical analysis, pitch reports, and educational team selection strategies for fantasy cricket games only. We do not host, operate, or promote real-money gambling, betting, or wagering services. All statistical templates are for informational purposes.
      </div>

      <div style={{ marginTop: 24 }}><AdBanner type="auto" /></div>
    </div>
  );
}
