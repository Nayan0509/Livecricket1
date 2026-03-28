import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingMatches } from "../api";
import MatchCard from "../components/MatchCard";

const FORMATS = ["All", "test", "odi", "t20"];

export default function UpcomingMatches() {
  const [format, setFormat] = useState("All");
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming"],
    queryFn: fetchUpcomingMatches,
  });

  // CricketData.org: { data: [{id, name, matchType, status, venue, date, teams, teamInfo}] }
  const all = data?.data || [];
  const filtered = format === "All" ? all : all.filter(m => m.matchType?.toLowerCase() === format);

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <h1 className="page-title">📅 Upcoming Matches</h1>

      <div className="tab-bar" style={{ maxWidth: 400, marginBottom: 24 }}>
        {FORMATS.map(f => (
          <button key={f} className={`tab ${format === f ? "active" : ""}`} onClick={() => setFormat(f)}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load: {error.message}</div>}

      {!isLoading && !error && (
        filtered.length ? (
          <div className="grid-2">
            {filtered.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", color: "var(--text2)", padding: 40 }}>
            No {format !== "All" ? format.toUpperCase() : ""} matches found
          </div>
        )
      )}
    </div>
  );
}
