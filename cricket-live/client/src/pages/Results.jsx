import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingMatches } from "../api";
import MatchCard from "../components/MatchCard";
import SEO from "../components/SEO";

export default function Results() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming"],
    queryFn: fetchUpcomingMatches,
  });

  const all = data?.data || [];
  const completed = all.filter(m => m.matchEnded);

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <SEO
        title="Cricket Match Results 2026 — Scorecards & Summaries"
        description="Recent cricket match results with full scorecards. IPL 2026, T20, ODI and Test match results with batting and bowling summaries."
        url="/results"
      />
      <h1 className="page-title">✅ Recent Results</h1>
      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load: {error.message}</div>}
      {!isLoading && !error && (
        completed.length ? (
          <div className="grid-2">
            {completed.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", color: "var(--text2)", padding: 40 }}>
            No completed matches in current data
          </div>
        )
      )}
    </div>
  );
}
