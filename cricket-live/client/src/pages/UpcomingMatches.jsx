import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingMatches } from "../api";
import MatchCard from "../components/MatchCard";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

const FORMATS = ["All", "test", "odi", "t20"];

export default function UpcomingMatches() {
  const [format, setFormat] = useState("All");
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming"],
    queryFn: fetchUpcomingMatches,
  });

  const all = Array.isArray(data?.data) ? data.data : [];
  const filtered = format === "All" ? all : all.filter(m => m.matchType?.toLowerCase() === format);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Upcoming Cricket Matches 2026 — Fixtures, Dates & Venues"
        description="Upcoming cricket matches 2026 — all fixtures with dates, venues and match timings. IPL 2026, T20 World Cup, ODI and Test series upcoming schedule. Never miss a cricket match."
        keywords="upcoming cricket matches, upcoming cricket 2026, cricket fixtures 2026, IPL 2026 upcoming matches, T20 World Cup 2026 fixtures, upcoming ODI matches, upcoming Test matches, next cricket match, cricket today upcoming, cricket schedule today"
        url="/upcoming"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(56,189,248,0.09) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(56,189,248,0.15)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          📅 Upcoming <span style={{ color: "#38BDF8" }}>Matches</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          All upcoming cricket fixtures — IPL, T20 World Cup, ODI & Test series
        </p>
      </div>

      {/* Format filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FORMATS.map(f => (
          <button key={f} onClick={() => setFormat(f)} style={{
            padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
            background: format === f ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${format === f ? "rgba(56,189,248,0.4)" : "rgba(255,255,255,0.08)"}`,
            color: format === f ? "#38BDF8" : "var(--text3)",
            transition: "all 0.15s",
          }}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "20px", color: "#f87171", background: "rgba(248,113,113,0.08)", borderRadius: 10, marginBottom: 20 }}>Failed to load matches.</div>}

      <AdBanner type="auto" />

      {!isLoading && !error && (
        filtered.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 12, marginTop: 16 }}>
            {filtered.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div style={{ padding: "40px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", margin: "16px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📅</div>
            <p style={{ color: "var(--text3)", fontSize: 14 }}>No {format !== "All" ? format.toUpperCase() : ""} upcoming matches found — check back shortly.</p>
          </div>
        )
      )}

      {/* Rich SEO content */}
      <section style={{ marginTop: 32, padding: "24px 24px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(56,189,248,0.07)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#38BDF8,#0EA5E9)", display: "inline-block" }} />
          Upcoming Cricket Matches — What's Coming Up
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Never miss a cricket match with Live Cricket Zone's upcoming matches page. All scheduled fixtures across every format — <strong style={{ color: "var(--text2)" }}>IPL 2026 upcoming matches</strong>, T20 internationals, bilateral ODI series, Test series, County Championship and global T20 leagues — are listed here with match dates, venues and local start times.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Use the format filter above to see only upcoming <strong style={{ color: "var(--text2)" }}>Test matches</strong>, <strong style={{ color: "var(--text2)" }}>ODIs</strong> or <strong style={{ color: "var(--text2)" }}>T20Is</strong>. Each match card shows the competing teams, format, venue and scheduled date. Click any fixture to jump to that match's dedicated page where live scoring and ball-by-ball commentary go live when the match starts, with official post-match highlights added afterwards.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          The 2026 cricket calendar features a dense schedule of major events. The ICC T20 World Cup 2026 in June brings together 16 nations across 45 matches. IPL 2026 runs from March through May. PSL 2026 occupies February and March. The BBL fills Australia's summer through January and February. County Championship 2026 runs across the English summer from April to September. Bilateral series between India, Australia, England, Pakistan and South Africa fill the gaps in the ICC Future Tours Programme schedule.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          Upcoming match data is refreshed continuously so you always see the latest confirmed fixtures. Bookmark this page to stay on top of the cricket calendar — completely free, no account required.
        </p>
      </section>
    </div>
  );
}
