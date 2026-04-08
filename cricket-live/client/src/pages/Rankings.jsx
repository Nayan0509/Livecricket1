import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRankings } from "../api";
import SEO from "../components/SEO";


export default function Rankings() {
  const [category, setCategory] = useState("men"); // men | women
  const [type, setType] = useState("batting"); // batting | bowling | all-rounders | teams
  const [format, setFormat] = useState("tests"); // tests | odis | t20s

  const { data, isLoading, error } = useQuery({ 
    queryKey: ["rankings", category, type, format], 
    queryFn: () => fetchRankings(type, format, category) 
  });

  const ranks = data?.response || [];

  return (
    <div className="container" style={{ paddingBottom: 60 }}>
      <SEO
        title={`ICC ${category.toUpperCase()} ${type.toUpperCase()} Rankings 2026`}
        description={`Latest ICC cricket rankings for ${category} ${type} in ${format} format.`}
        url="/rankings"
      />
      
      <h1 className="page-title">📊 ICC Rankings</h1>

      {/* Main Categories */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        {["men", "women"].map(c => (
          <button 
            key={c}
            onClick={() => { setCategory(c); if (c === "women" && format === "tests") setFormat("odis"); }}
            className={`btn ${category === c ? "btn-primary" : "btn-outline"}`}
            style={{ textTransform: "uppercase", padding: "10px 24px" }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="glass" style={{ borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 32 }}>
         {/* Sub Types */}
         <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, borderBottom: "1px solid var(--glass-border)", paddingBottom: 16 }}>
            {["batting", "bowling", "all-rounders", "teams"].map(t => (
               <button 
                key={t}
                onClick={() => setType(t)}
                style={{ 
                   background: type === t ? "var(--primary)" : "transparent",
                   color: type === t ? "#fff" : "var(--text2)",
                   border: "none",
                   padding: "8px 16px",
                   borderRadius: "var(--radius)",
                   cursor: "pointer",
                   fontWeight: 700,
                   textTransform: "capitalize",
                   fontSize: 14
                }}
               >
                 {t.replace("-", " ")}
               </button>
            ))}
         </div>

         {/* Formats */}
         <div style={{ display: "flex", gap: 12 }}>
            {(category === "men" ? ["tests", "odis", "t20s"] : ["odis", "t20s"]).map(f => (
               <label key={f} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: format === f ? "var(--primary-light)" : "var(--text3)" }}>
                  <input type="radio" name="format" checked={format === f} onChange={() => setFormat(f)} style={{ accentColor: "var(--primary)" }} />
                  {f.toUpperCase()}
               </label>
            ))}
         </div>
      </div>

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load rankings: {error.message}</div>}

      {!isLoading && !error && (
        <div className="card glass" style={{ padding: 0, overflowX: "auto", border: "1px solid var(--glass-border)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                <th style={thStyle}>Pos</th>
                <th style={{ ...thStyle, textAlign: "left" }}>{type === "teams" ? "Team" : "Player"}</th>
                {type !== "teams" && <th style={thStyle}>Country</th>}
                <th style={thStyle}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {ranks.length > 0 ? ranks.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--glass-border)" }} className="hover-row">
                  <td style={tdStyle}>{r.rank || i + 1}</td>
                  <td style={{ ...tdStyle, textAlign: "left", fontWeight: 700 }}>{r.name}</td>
                  {type !== "teams" && <td style={tdStyle}>{r.country}</td>}
                  <td style={{ ...tdStyle, color: "var(--primary-light)", fontWeight: 800 }}>{r.rating}</td>
                </tr>
              )) : (
                <tr>
                   <td colSpan={4} style={{ padding: 60, textAlign: "center", color: "var(--text3)" }}>
                      No ranking data available for this selection.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = { 
  padding: "16px 20px", 
  textAlign: "center", 
  color: "var(--text2)", 
  fontWeight: 800, 
  fontSize: 12, 
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};

const tdStyle = { 
  padding: "16px 20px", 
  textAlign: "center", 
  fontSize: 15,
  color: "var(--text)"
};

