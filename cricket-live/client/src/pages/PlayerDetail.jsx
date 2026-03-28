import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPlayerInfo } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import SEO from "../components/SEO";

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statFormat, setStatFormat] = useState("test");

  const { data, isLoading, error } = useQuery({
    queryKey: ["player", id],
    queryFn: () => fetchPlayerInfo(id),
  });

  // CricketData.org players_info:
  // { data: { id, name, dateOfBirth, role, battingStyle, bowlingStyle, country, playerImg,
  //   stats: [{fn:"batting"|"bowling", matchtype:"test"|"odi"|"t20", stat:"m"|"inn"|"runs"|"avg"|"sr"|"100s"|"50s"|"wkts"|"econ", value}] } }
  const player = data?.data;

  if (isLoading) return <div className="container"><div className="spinner" /></div>;
  if (error || !player) return <div className="container"><div className="error-box">Player not found</div></div>;

  const playerSD = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": player.name,
    "nationality": player.country,
    "birthDate": player.dateOfBirth?.split("T")[0],
    "birthPlace": player.placeOfBirth,
    "description": `${player.name} cricket stats — ${player.role}, ${player.battingStyle}, ${player.country}`,
    "image": player.playerImg,
    "url": `https://criclive.vercel.app/players/${id}`,
  };

  // Convert flat stats array into grouped object: { batting: { test: {m,inn,runs,...}, odi:{...} }, bowling:{...} }
  const grouped = {};
  (player.stats || []).forEach(s => {
    if (!grouped[s.fn]) grouped[s.fn] = {};
    if (!grouped[s.fn][s.matchtype]) grouped[s.fn][s.matchtype] = {};
    grouped[s.fn][s.matchtype][s.stat] = s.value;
  });

  const formats = ["test", "odi", "t20"];
  const battingFormats = formats.filter(f => grouped.batting?.[f]);
  const bowlingFormats = formats.filter(f => grouped.bowling?.[f]);

  // Chart data for batting runs by format
  const chartData = battingFormats.map(f => ({
    format: f.toUpperCase(),
    runs: parseInt(grouped.batting[f]?.runs) || 0,
    avg: parseFloat(grouped.batting[f]?.avg) || 0,
  }));

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <SEO
        title={`${player.name} Cricket Stats — Batting, Bowling & Career Records`}
        description={`${player.name} cricket career stats. ${player.role} from ${player.country}. Batting average, bowling figures, centuries, wickets across Test, ODI and T20 formats.`}
        url={`/players/${id}`}
        image={player.playerImg}
        type="profile"
        structuredData={playerSD}
      />
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: 16, fontSize: 13 }}>← Back</button>

      {/* Profile */}
      <div className="card" style={{ marginBottom: 24, background: "linear-gradient(135deg, var(--bg3), var(--card))" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {player.playerImg ? (
            <img src={player.playerImg} alt={player.name}
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--green)" }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--bg2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 700, color: "var(--green)", border: "3px solid var(--green)" }}>
              {player.name?.[0]}
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800 }}>{player.name}</h1>
            <div style={{ color: "var(--text2)", fontSize: 14, marginTop: 4 }}>
              🌍 {player.country} &nbsp;•&nbsp; 🎭 {player.role}
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
              🏏 {player.battingStyle} &nbsp;•&nbsp; 🎳 {player.bowlingStyle}
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
              🎂 {player.dateOfBirth?.split("T")[0]} &nbsp;•&nbsp; 📍 {player.placeOfBirth}
            </div>
          </div>
        </div>
      </div>

      {/* Batting Stats */}
      {battingFormats.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--green)" }}>🏏 Batting</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--bg3)" }}>
                  {["Format","M","Inn","Runs","HS","Avg","SR","100s","50s"].map(h => (
                    <th key={h} style={{ padding:"8px 10px", textAlign:h==="Format"?"left":"right",
                      color:"var(--text2)", fontWeight:600, borderBottom:"1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {battingFormats.map(f => {
                  const s = grouped.batting[f];
                  return (
                    <tr key={f} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding:"8px 10px", fontWeight:700 }}>{f.toUpperCase()}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s.m}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s.inn}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right", fontWeight:700, color:"var(--green)" }}>{s.runs}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s.hs}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s.avg}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s.sr}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s["100s"]}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s["50s"]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bowling Stats */}
      {bowlingFormats.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--text2)" }}>🎳 Bowling</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--bg3)" }}>
                  {["Format","M","Wkts","Avg","Econ","SR","5W","10W"].map(h => (
                    <th key={h} style={{ padding:"8px 10px", textAlign:h==="Format"?"left":"right",
                      color:"var(--text2)", fontWeight:600, borderBottom:"1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bowlingFormats.map(f => {
                  const s = grouped.bowling[f];
                  return (
                    <tr key={f} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding:"8px 10px", fontWeight:700 }}>{f.toUpperCase()}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s.m}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right", fontWeight:700, color:"var(--red)" }}>{s.wkts}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s.avg}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s.econ}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s.sr}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s["5w"]}</td>
                      <td style={{ padding:"8px 10px", textAlign:"right" }}>{s["10w"]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📊 Runs by Format</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="format" tick={{ fill: "var(--text2)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--text2)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="runs" fill="var(--green)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
