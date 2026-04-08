import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "../api";

export default function Teams() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });

  const categories = data?.response || { international: [], domestic: [], league: [], women: [] };
  
  const filterList = (list) => list?.filter(t => t.name?.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <h1 className="page-title">👥 Teams</h1>
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search teams..." style={{ maxWidth: 400, marginBottom: 32 }} />

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load teams: {error.message}</div>}

      {!isLoading && !error && Object.keys(categories).map(catKey => {
        const filtered = filterList(categories[catKey]);
        if (!filtered.length) return null;
        
        return (
          <section key={catKey} style={{ marginBottom: 40 }}>
            <h2 className="section-title" style={{ textTransform: "capitalize", marginBottom: 20 }}>
              {catKey} Teams
            </h2>
            <div className="grid-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {filtered.map((t) => (
                <Link key={t.id} to={`/teams/${t.id}`} state={{ team: t }} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <img 
                      src={t.img} 
                      alt={t.name}
                      onError={(e) => { e.target.src = "https://www.cricbuzz.com/a/img/v1/72x72/i1/c1/team-flag.jpg"; }}
                      style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flexShrink: 0, background: "var(--bg3)" }} 
                    />
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{t.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {!isLoading && !error && Object.values(categories).every(l => !filterList(l).length) && (
        <div className="card" style={{ textAlign: "center", color: "var(--text2)", padding: 40 }}>No teams found</div>
      )}
    </div>
  );
}

