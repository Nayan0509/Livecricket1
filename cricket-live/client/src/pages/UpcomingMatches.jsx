import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingMatches } from "../api";
import MatchCard from "../components/MatchCard";
import SEO from "../components/SEO";

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
      <SEO
        title="Upcoming Cricket Matches 2026 — Schedule, Fixtures & Match Calendar"
        description="Complete list of upcoming cricket matches in 2026. IPL 2026 fixtures, T20 World Cup schedule, ODI series and Test match fixtures with dates, venues, team info and match timings."
        keywords="upcoming cricket matches, cricket fixtures 2026, IPL 2026 fixtures, T20 World Cup fixtures, cricket schedule, upcoming matches today, cricket calendar, future cricket matches"
        url="/upcoming"
      />
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
