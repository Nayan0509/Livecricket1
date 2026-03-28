import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSeries } from "../api";
import SEO from "../components/SEO";

export default function Series() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({ queryKey: ["series"], queryFn: fetchSeries });

  // CricketData.org: { data: [{id, name, startDate, endDate, odi, t20, test, matches}] }
  const all = data?.data || [];
  const filtered = all.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <SEO
        title="Cricket Series 2026 — IPL, T20, ODI & Test Series"
        description="All cricket series in 2026 including IPL 2026, T20 World Cup, ODI series and Test series. Match schedules, squads and results."
        url="/series"
      />
      <h1 className="page-title">🏆 Series</h1>
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search series..." style={{ maxWidth: 400, marginBottom: 24 }} />

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load: {error.message}</div>}

      {!isLoading && !error && (
        <div className="grid-3">
          {filtered.map(s => (
            <Link key={s.id} to={`/series/${s.id}`} style={{ textDecoration: "none" }}>
              <div className="card">
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>
                  📅 {s.startDate} → {s.endDate}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {s.test > 0 && <span className="badge badge-upcoming">{s.test} Test</span>}
                  {s.odi > 0  && <span className="badge badge-upcoming">{s.odi} ODI</span>}
                  {s.t20 > 0  && <span className="badge badge-upcoming">{s.t20} T20</span>}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 8 }}>{s.matches} matches total</div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", color:"var(--text2)", padding:40 }}>
              No series found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
