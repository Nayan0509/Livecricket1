import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveMatches } from "../api";
import MatchCard from "../components/MatchCard";
import AdBanner from "../components/AdBanner";

export default function LiveMatches() {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
  });

  // CricketData.org: { data: [{id, name, matchType, status, venue, date, teams, teamInfo, score, matchStarted, matchEnded}] }
  const matches = data?.data || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          <span className="pulse" style={{ color: "var(--red)" }}>●</span> Live Matches
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {dataUpdatedAt > 0 && (
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              Updated {new Date(dataUpdatedAt).toLocaleTimeString()}
            </span>
          )}
          <button className="btn btn-outline" onClick={refetch} style={{ fontSize: 13 }}>↻ Refresh</button>
        </div>
      </div>

      {isLoading && <div className="spinner" />}
      {error && (
        <div className="error-box">
          Failed to load: {error.message}
          <br /><small>Check CRICAPI_KEY in server/.env</small>
        </div>
      )}

      {!isLoading && !error && (
        matches.length ? (
          <>
            <p style={{ color: "var(--text2)", marginBottom: 20, fontSize: 14 }}>
              {matches.length} match{matches.length !== 1 ? "es" : ""} in progress • Auto-refreshes every 30s
            </p>
            {/* Ad above match list */}
            <AdBanner type="responsive" slot="1234567895" style={{ marginBottom: 20 }} />
            <div className="grid-2">
              {matches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No live matches right now</div>
            <div style={{ color: "var(--text2)" }}>Check back during match hours or see upcoming matches</div>
          </div>
        )
      )}
    </div>
  );
}
