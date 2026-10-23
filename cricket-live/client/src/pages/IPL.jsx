import React from "react";
import { useQuery } from "@tanstack/react-query";
import TournamentPage from "../components/TournamentPage";
import { fetchIPLStandings } from "../api";

const CELL = { padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", textAlign: "center" };

/* Live IPL points table. Rendered only when the standings feed returns rows;
   off-season or on a feed failure the section is omitted entirely. */
function PointsTable() {
  const { data } = useQuery({
    queryKey: ["iplStandings"],
    queryFn: fetchIPLStandings,
    refetchInterval: 300000,
  });

  const rows = Array.isArray(data?.data) ? data.data : [];
  if (rows.length === 0) return null;

  return (
    <section aria-label="IPL points table" style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", margin: "8px 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 3, height: 16, borderRadius: 2, background: "#00F0FF", display: "inline-block" }} />
        IPL Points Table
      </h2>
      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, color: "var(--text2)", minWidth: 480 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", color: "var(--text)" }}>
              {["#", "Team", "P", "W", "L", "NR", "NRR", "Pts"].map(h => (
                <th key={h} style={{ ...CELL, textAlign: h === "Team" ? "left" : "center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.team} style={{ background: i < 4 ? "rgba(0,240,255,0.04)" : "transparent" }}>
                <td style={CELL}>{i + 1}</td>
                <td style={{ ...CELL, textAlign: "left", color: "var(--text)", fontWeight: 700 }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: r.color || "#00F0FF", marginRight: 8 }} />
                  {r.team}
                </td>
                <td style={CELL}>{r.p}</td>
                <td style={CELL}>{r.w}</td>
                <td style={CELL}>{r.l}</td>
                <td style={CELL}>{r.nr}</td>
                <td style={CELL}>{r.nrr}</td>
                <td style={{ ...CELL, color: "var(--text)", fontWeight: 800 }}>{r.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>
        The top four after the league stage reach the playoffs. Teams level on points are separated by net run rate.
      </p>
    </section>
  );
}

export default function IPL() {
  return (
    <TournamentPage slug="ipl">
      <PointsTable />
    </TournamentPage>
  );
}
