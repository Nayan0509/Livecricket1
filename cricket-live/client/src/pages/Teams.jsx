import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "../api";

export default function Teams() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });

  // RapidAPI /cricket-teams: { status:"success", response: [{id, title, image}] }
  const teams = data?.response || [];
  const filtered = teams.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <h1 className="page-title">👥 Teams</h1>
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search teams..." style={{ maxWidth: 400, marginBottom: 24 }} />

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load: {error.message}</div>}

      {!isLoading && !error && (
        filtered.length ? (
          <div className="grid-3">
            {filtered.map((t, i) => (
              <Link key={t.id} to={`/teams/${t.id}`} state={{ team: t }} style={{ textDecoration: "none" }}>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {t.image ? (
                    <img src={t.image} alt={t.title}
                      style={{ width: 48, height: 36, objectFit: "contain", flexShrink: 0 }} />
                  ) : (
                    <div style={{ fontSize: 28, flexShrink: 0 }}>🏏</div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.title}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", color: "var(--text2)", padding: 40 }}>No teams found</div>
        )
      )}
    </div>
  );
}
