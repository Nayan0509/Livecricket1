import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRecords } from "../api";

// International records computed by the site from Cricsheet's open
// ball-by-ball data (api/cricsheet.js, served by /api/stats). Coverage starts
// in 2001-2009 depending on format, so these are records within the data, not
// all-time records; the section says so above every list.

const FORMATS = [["test", "Tests"], ["odi", "ODIs"], ["t20i", "T20Is"]];
const GENDERS = [["men", "Men"], ["women", "Women"]];

const LISTS = [
  { key: "mostRuns", title: "Most runs", cols: [["Runs", r => r.runs], ["Inns", r => r.innings], ["Avg", r => r.average], ["HS", r => r.highScore]] },
  { key: "mostWickets", title: "Most wickets", cols: [["Wkts", r => r.wickets], ["Avg", r => r.average], ["Best", r => r.best]] },
  { key: "highestScores", title: "Highest individual scores", cols: [["Score", r => `${r.score}${r.balls ? ` (${r.balls})` : ""}`], ["v", r => r.opponent], ["Date", r => r.date]] },
  { key: "bestBowling", title: "Best bowling in an innings", cols: [["Figures", r => r.figures], ["v", r => r.opponent], ["Date", r => r.date]] },
  { key: "mostHundreds", title: "Most hundreds", cols: [["100s", r => r.hundreds], ["Inns", r => r.innings], ["Runs", r => r.runs]] },
  { key: "highestTeamTotals", title: "Highest team totals", team: true, cols: [["Score", r => r.score], ["v", r => r.opponent], ["Date", r => r.date]] },
];

const pill = active => ({
  padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: active ? 700 : 600, cursor: "pointer",
  background: active ? "var(--primary)" : "var(--card)", color: active ? "#fff" : "var(--text2)",
  border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
});
const CELL = { padding: "7px 8px", borderBottom: "1px solid var(--divider)", fontSize: 13, textAlign: "right", whiteSpace: "nowrap" };

export default function RecordsSection() {
  const [format, setFormat] = useState("test");
  const [gender, setGender] = useState("men");
  const { data, isLoading } = useQuery({
    queryKey: ["records", format, gender],
    queryFn: () => fetchRecords(format, gender),
    staleTime: 3600000,
  });
  const rec = data?.data;
  const label = FORMATS.find(f => f[0] === format)[1];

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", margin: "0 0 10px" }}>International records</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {FORMATS.map(([k, l]) => <button key={k} onClick={() => setFormat(k)} style={pill(format === k)}>{l}</button>)}
        <span style={{ width: 12 }} />
        {GENDERS.map(([k, l]) => <button key={k} onClick={() => setGender(k)} style={pill(gender === k)}>{l}</button>)}
      </div>

      {isLoading && <div className="spinner" style={{ margin: "24px auto" }} />}
      {!isLoading && !rec && <p style={{ color: "var(--text3)" }}>Records are unavailable right now.</p>}

      {rec && (
        <>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, margin: "0 0 14px" }}>
            Worked out by Live Cricket Zone from ball-by-ball data for <strong>{rec.coverage.matches.toLocaleString()} {gender === "men" ? "men's" : "women's"} {label}</strong> played
            between {rec.coverage.firstDate} and {rec.coverage.lastDate}. These are records within that data, not all-time records:
            earlier matches are not included, and players marked * may have played before the data starts.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
            {LISTS.map(list => {
              const rows = (rec[list.key] || []).slice(0, 10);
              if (!rows.length) return null;
              return (
                <div key={list.key} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", overflowX: "auto" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", margin: "0 0 6px" }}>{list.title}</h3>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ ...CELL, textAlign: "left", color: "var(--text3)", fontWeight: 700 }}>{list.team ? "Team" : "Player"}</th>
                        {list.cols.map(([h]) => <th key={h} style={{ ...CELL, color: "var(--text3)", fontWeight: 700 }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i}>
                          <td style={{ ...CELL, textAlign: "left", color: "var(--text)", fontWeight: 600, whiteSpace: "normal" }}>
                            {list.team ? r.team : r.name}{r.mayBeIncomplete ? " *" : ""}
                            {!list.team && <span style={{ display: "block", fontSize: 11, color: "var(--text3)", fontWeight: 500 }}>{r.team}</span>}
                          </td>
                          {list.cols.map(([h, f]) => <td key={h} style={{ ...CELL, color: "var(--text2)" }}>{f(r) ?? "–"}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6, margin: "12px 0 0" }}>{rec.attribution}</p>
        </>
      )}
    </section>
  );
}
