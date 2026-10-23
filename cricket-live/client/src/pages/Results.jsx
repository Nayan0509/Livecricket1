import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingMatches } from "../api";
import MatchCard from "../components/MatchCard";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";

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
        background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.14)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          ✅ Cricket <span style={{ color: "#B026FF" }}>Results</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          Recent match results — IPL, T20, ODI & Test cricket with full scorecards
        </p>
      </div>

      <PageIntro intro={PAGE_INTROS["/results"]} />

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "20px", color: "#FF5C8A", background: "rgba(248,113,113,0.08)", borderRadius: 10, marginBottom: 20 }}>Failed to load results.</div>}

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

    </div>
  );
}
