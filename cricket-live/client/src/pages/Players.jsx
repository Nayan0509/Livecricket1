import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchPlayers } from "../api";
import AdBanner from "../components/AdBanner";

export default function Players() {
  const [input, setInput] = useState("virat");
  const [search, setSearch] = useState("virat");

  const { data, isLoading, error } = useQuery({
    queryKey: ["players", search],
    queryFn: () => fetchPlayers(search),
    enabled: !!search,
  });

  // CricketData.org: { data: [{id, name, country}] }
  const players = data?.data || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <h1 className="page-title">🧑‍🤝‍🧑 Players</h1>

      <form onSubmit={e => { e.preventDefault(); setSearch(input); }}
        style={{ display: "flex", gap: 10, marginBottom: 24, maxWidth: 500 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Search player name..." />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load: {error.message}</div>}

      {!isLoading && <AdBanner type="responsive" slot="1234567898" style={{ marginBottom: 24 }} />}

      {!isLoading && !error && (
        <div className="grid-3">
          {players.map(p => (
            <Link key={p.id} to={`/players/${p.id}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--bg3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 700, flexShrink: 0, color: "var(--green)" }}>
                  {p.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>🌍 {p.country}</div>
                </div>
              </div>
            </Link>
          ))}
          {players.length === 0 && !isLoading && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", color:"var(--text2)", padding:40 }}>
              No players found for "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
