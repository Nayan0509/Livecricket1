import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRankings } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";

const FORMAT_TABS = {
  men:   ["tests", "odis", "t20s"],
  women: ["odis", "t20s"],
};

const TYPE_LABELS = {
  batting:      "Batting",
  bowling:      "Bowling",
  "all-rounders": "All-Rounders",
  teams:        "Teams",
};

export default function Rankings() {
  const [category, setCategory] = useState("men");
  const [type,     setType]     = useState("batting");
  const [format,   setFormat]   = useState("tests");

  const { data, isLoading, error } = useQuery({
    queryKey: ["rankings", category, type, format],
    queryFn:  () => fetchRankings(type, format, category),
  });

  const ranks = data?.response || [];

  const handleCategoryChange = (c) => {
    setCategory(c);
    if (c === "women" && format === "tests") setFormat("odis");
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title={`ICC ${category === "men" ? "Men's" : "Women's"} ${TYPE_LABELS[type]} Rankings — ${format.toUpperCase()} 2026`}
        description={`Latest ICC cricket rankings for ${category === "men" ? "men" : "women"}'s ${type} in ${format} format. Updated rankings for all international teams and players.`}
        keywords="ICC cricket rankings, ICC rankings 2026, batting rankings, bowling rankings, Test rankings, ODI rankings, T20 rankings, cricket team rankings"
        url="/rankings"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px",
        padding: "28px 24px",
        borderRadius: 18,
        background: "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(34,197,94,0.14)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          ICC <span style={{ color: "#22C55E" }}>Rankings</span> 2026
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          Official ICC player & team rankings across all formats
        </p>
      </div>

      {/* Ad */}
      <AdBanner type="leaderboard" />

      {/* Category toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, marginTop: 20 }}>
        {["men", "women"].map(c => (
          <button
            key={c}
            onClick={() => handleCategoryChange(c)}
            style={{
              padding: "9px 22px", borderRadius: 100, cursor: "pointer",
              fontWeight: 700, fontSize: 13, textTransform: "capitalize",
              background: category === c ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
              color: category === c ? "#22C55E" : "var(--text3)",
              border: `1.5px solid ${category === c ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
              transition: "all 0.2s",
            }}
          >{c === "men" ? "Men's" : "Women's"}</button>
        ))}
      </div>

      {/* Main container */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        {/* Type tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", overflowX: "auto", scrollbarWidth: "none" }}>
          {Object.keys(TYPE_LABELS).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                padding: "12px 16px", fontSize: 13, fontWeight: type === t ? 800 : 600,
                color: type === t ? "#22C55E" : "var(--text3)",
                borderBottom: type === t ? "2px solid #22C55E" : "2px solid transparent",
                marginBottom: -1, transition: "color 0.2s", whiteSpace: "nowrap",
                fontFamily: "'Inter',sans-serif",
              }}
            >{TYPE_LABELS[t]}</button>
          ))}
        </div>

        {/* Format radio */}
        <div style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {FORMAT_TABS[category].map(f => (
            <label key={f} style={{
              display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
              fontSize: 12, fontWeight: format === f ? 800 : 600,
              color: format === f ? "#F59E0B" : "var(--text3)",
            }}>
              <input
                type="radio" name="format"
                checked={format === f}
                onChange={() => setFormat(f)}
                style={{ accentColor: "#F59E0B", width: 13, height: 13 }}
              />
              {f.toUpperCase()}
            </label>
          ))}
        </div>

        {/* Table */}
        {isLoading && (
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <div className="spinner" style={{ margin: "0 auto" }} />
          </div>
        )}
        {error && (
          <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
            Failed to load rankings: {error.message}
          </div>
        )}
        {!isLoading && !error && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
              <thead>
                <tr style={{ background: "rgba(34,197,94,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <th style={thStyle}>Pos</th>
                  <th style={{ ...thStyle, textAlign: "left" }}>{type === "teams" ? "Team" : "Player"}</th>
                  {type !== "teams" && <th style={thStyle}>Country</th>}
                  <th style={thStyle}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {ranks.length > 0 ? ranks.map((r, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={tdStyle}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", display: "inline-flex",
                        alignItems: "center", justifyContent: "center",
                        background: i < 3 ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.04)",
                        border: i < 3 ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(255,255,255,0.06)",
                        fontSize: 12, fontWeight: 900,
                        color: i < 3 ? "#F59E0B" : "var(--text3)",
                      }}>{r.rank || i + 1}</div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "left", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{r.name}</td>
                    {type !== "teams" && <td style={{ ...tdStyle, color: "var(--text3)", fontSize: 13 }}>{r.country}</td>}
                    <td style={{ ...tdStyle }}>
                      <span style={{ fontWeight: 900, fontSize: 15, color: "#22C55E", fontFamily: "'Poppins',sans-serif" }}>{r.rating}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ padding: "50px 24px", textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
                      No ranking data available for this selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: 24 }}><AdBanner type="auto" /></div>
    </div>
  );
}

const thStyle = {
  padding: "11px 16px",
  textAlign: "center",
  fontSize: 10, fontWeight: 800, textTransform: "uppercase",
  letterSpacing: 0.6, color: "var(--text3)",
};
const tdStyle = {
  padding: "13px 16px",
  textAlign: "center",
  fontSize: 14,
  color: "var(--text2)",
};
