import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "../api";
import { Link } from "react-router-dom";

export default function Rankings() {
  const { data, isLoading, error } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });

  // RapidAPI /cricket-teams: { status:"success", response: [{id, title, image}] }
  const teams = data?.response || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <h1 className="page-title">🏆 ICC Teams</h1>
      <p style={{ color: "var(--text2)", marginBottom: 24, fontSize: 14 }}>
        All international cricket teams from Cricbuzz
      </p>

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load: {error.message}</div>}

      {!isLoading && !error && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg3)" }}>
                {["#", "Flag", "Team"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "Team" ? "left" : "center",
                    color: "var(--text2)", fontWeight: 600, borderBottom: "1px solid var(--border)", fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 16px", textAlign: "center", fontWeight: 700,
                    color: i===0?"var(--gold)":i===1?"#c0c0c0":i===2?"#cd7f32":"var(--text)" }}>
                    {i < 3 ? ["🥇","🥈","🥉"][i] : i + 1}
                  </td>
                  <td style={{ padding: "10px 16px", textAlign: "center" }}>
                    {t.image && <img src={t.image} alt={t.title} style={{ width: 36, height: 27, objectFit: "contain" }} />}
                  </td>
                  <td style={{ padding: "10px 16px" }}>
                    <Link to={`/teams/${t.id}`} state={{ team: t }}
                      style={{ fontWeight: 600, color: "var(--text)", textDecoration: "none" }}>
                      {t.title}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
