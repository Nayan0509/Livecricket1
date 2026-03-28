import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPlayers } from "../api";
import { Link } from "react-router-dom";

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const team = state?.team; // { id, title, image } from RapidAPI

  // Search players by team name using CricketData.org
  const { data, isLoading } = useQuery({
    queryKey: ["players", team?.title],
    queryFn: () => fetchPlayers(team?.title || "india"),
    enabled: !!team?.title,
  });

  const players = data?.data || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: 20, fontSize: 13 }}>← Back</button>

      <div className="card" style={{ marginBottom: 24, background: "linear-gradient(135deg, var(--bg3), var(--card))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {team?.image ? (
            <img src={team.image} alt={team.title}
              style={{ width: 80, height: 60, objectFit: "contain" }} />
          ) : (
            <div style={{ fontSize: 56 }}>🏏</div>
          )}
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>{team?.title || `Team ${id}`}</h1>
        </div>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Players</h2>
      {isLoading && <div className="spinner" />}

      <div className="grid-3">
        {players.map(p => (
          <Link key={p.id} to={`/players/${p.id}`} style={{ textDecoration: "none" }}>
            <div className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 700, color: "var(--green)", flexShrink: 0 }}>
                {p.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{p.country}</div>
              </div>
            </div>
          </Link>
        ))}
        {!isLoading && players.length === 0 && (
          <div style={{ gridColumn:"1/-1", textAlign:"center", color:"var(--text2)", padding:40 }}>
            No players found
          </div>
        )}
      </div>
    </div>
  );
}
