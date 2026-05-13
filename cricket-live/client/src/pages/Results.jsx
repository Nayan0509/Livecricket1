import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingMatches } from "../api";
import MatchCard from "../components/MatchCard";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

export default function Results() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming"],
    queryFn: fetchUpcomingMatches,
  });

  const all = Array.isArray(data?.data) ? data.data : [];
  const completed = all.filter(m => m.matchEnded);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Cricket Match Results 2026 — Scorecards & Summaries"
        description="Recent cricket match results with full scorecards. IPL 2026, T20 World Cup, ODI and Test match results with batting and bowling summaries. Updated in real time."
        keywords="cricket results today, cricket match results, IPL 2026 results, T20 cricket results, ODI results, Test match results, cricket scorecard, cricket match summary, cricket results 2026, cricket scores today"
        url="/results"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(16,185,129,0.14)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          ✅ Cricket <span style={{ color: "#10B981" }}>Results</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          Recent match results — IPL, T20, ODI & Test cricket with full scorecards
        </p>
      </div>

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "20px", color: "#f87171", background: "rgba(248,113,113,0.08)", borderRadius: 10, marginBottom: 20 }}>Failed to load results.</div>}

      <AdBanner type="auto" />

      {!isLoading && !error && (
        completed.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 12, marginTop: 16 }}>
            {completed.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div style={{ padding: "40px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", margin: "16px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🏏</div>
            <p style={{ color: "var(--text3)", fontSize: 14 }}>No completed matches in current data — check back shortly.</p>
          </div>
        )
      )}

      {/* Rich SEO content */}
      <section style={{ marginTop: 32, padding: "24px 24px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(16,185,129,0.07)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#F59E0B,#D97706)", display: "inline-block" }} />
          Cricket Match Results — Scorecards & Summaries
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Live Cricket Zone's results page gives you the outcomes of all recent cricket matches across every format and competition. Whether you're looking for the <strong style={{ color: "var(--text2)" }}>IPL 2026 match results</strong>, T20 World Cup scores, bilateral ODI series results or Test match final scorecards — all completed matches are listed here with direct links to full ball-by-ball scorecards.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Each result card shows the match name, final scores, result summary and a link to the complete scorecard. Click any completed match to view the full batting card, bowling figures, fall of wickets, partnership records, and over-by-over run progression. For T20 and ODI matches you'll also find the powerplay scores, death-over analysis and player of the match details.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Results are updated in real time as matches complete. The <strong style={{ color: "var(--text2)" }}>IPL 2026 results</strong> update live from each morning game, while international ODI and Test match results are posted ball-by-ball as innings close. For multi-day Test matches, end-of-day scorecards are available after each day's play.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          Coverage includes all IPL 2026 results, T20 internationals, ODI series, Test series, County Championship 2026, PSL 2026, BBL, CPL, BPL and all associate nation cricket — updated continuously throughout the cricket calendar, free with no account required.
        </p>
      </section>
    </div>
  );
}
