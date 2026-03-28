import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlayers, fetchPlayerInfo } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";

const SEARCHES = ["virat", "rohit", "babar", "smith", "root"];

export default function Stats() {
  const [activeSearch, setActiveSearch] = useState("virat");

  const { data, isLoading } = useQuery({
    queryKey: ["players", activeSearch],
    queryFn: () => fetchPlayers(activeSearch),
  });

  const players = data?.data || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <h1 className="page-title">📈 Player Stats</h1>

      {/* Quick search buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {SEARCHES.map(s => (
          <button key={s} onClick={() => setActiveSearch(s)}
            className={`btn ${activeSearch === s ? "btn-primary" : "btn-outline"}`}
            style={{ fontSize: 13, padding: "8px 16px", textTransform: "capitalize" }}>
            {s}
          </button>
        ))}
      </div>

      {isLoading && <div className="spinner" />}

      {!isLoading && players.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--text2)" }}>
            Search results for "{activeSearch}"
          </h2>
          <div className="grid-3" style={{ marginBottom: 32 }}>
            {players.map(p => (
              <Link key={p.id} to={`/players/${p.id}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 700, color: "var(--green)", flexShrink: 0 }}>
                    {p.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>🌍 {p.country}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "var(--green)", fontSize: 18 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🏏</div>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Click any player to see full stats</div>
        <div style={{ color: "var(--text2)", fontSize: 14 }}>
          Batting & bowling stats across Test, ODI and T20 formats with charts
        </div>
      </div>
    </div>
  );
}
