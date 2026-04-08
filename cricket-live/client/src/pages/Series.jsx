import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSeries } from "../api";
import SEO from "../components/SEO";

export default function Series() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({ queryKey: ["series"], queryFn: fetchSeries });

  const categories = data?.data || { international: [], domestic: [], league: [], women: [] };
  const filterList = (list) => list?.filter(s => s.name?.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <SEO
        title="Cricket Series 2026 — IPL, T20, ODI & Test Series"
        description="All cricket series in 2026 including IPL 2026, T20 World Cup, ODI series and Test series."
        url="/series"
      />
      <h1 className="page-title">🏆 Series Archive</h1>
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search series by name..." style={{ maxWidth: 400, marginBottom: 32 }} />

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load series: {error.message}</div>}

      {!isLoading && !error && Object.keys(categories).map(catKey => {
        const filtered = filterList(categories[catKey]);
        if (!filtered.length) return null;

        return (
          <section key={catKey} style={{ marginBottom: 48 }}>
            <h2 className="section-title" style={{ textTransform: "capitalize", marginBottom: 20 }}>
              {catKey} Series
            </h2>
            <div className="grid-3">
              {filtered.map(s => (
                <Link key={s.id} to={`/series/${s.id}`} style={{ textDecoration: "none" }}>
                  <div className="card h-full" style={{ padding: 24 }}>
                    <div style={{ fontWeight: 800, marginBottom: 12, fontSize: 17, lineHeight: 1.3 }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text3)", display: "flex", alignItems: "center", gap: 8 }}>
                       <span>📅</span> {s.date}
                    </div>
                    {s.url && (
                        <div style={{ marginTop: 16, fontSize: 11, color: "var(--primary-light)", fontWeight: 700, textTransform: "uppercase" }}>
                          View Match Schedule →
                        </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {!isLoading && !error && Object.values(categories).every(l => !filterList(l).length) && (
        <div className="card glass" style={{ textAlign: "center", color: "var(--text2)", padding: 60, borderRadius: "var(--radius-lg)" }}>
          <h3>No Series Found</h3>
          <p>Try searching with a different keyword or check back later.</p>
        </div>
      )}
    </div>
  );
}

