import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMatchScorecard, fetchMatchInfo } from "../api";

function BattingTable({ innings }) {
  const batters = innings.batting || [];
  return (
    <div style={{ overflowX: "auto", marginBottom: 24 }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--green)", fontSize: 15 }}>{innings.inning}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--bg3)" }}>
            {["Batsman","Dismissal","R","B","4s","6s","SR"].map(h => (
              <th key={h} style={{ padding: "8px 10px", textAlign: h==="Batsman"||h==="Dismissal"?"left":"right",
                color:"var(--text2)", fontWeight:600, borderBottom:"1px solid var(--border)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {batters.map((b, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding:"8px 10px", fontWeight:600 }}>{b["batsman-name"] || b.batsman?.name}</td>
              <td style={{ padding:"8px 10px", color:"var(--text2)", fontSize:12 }}>{b["dismissal-text"] || b.dismissal || "not out"}</td>
              <td style={{ padding:"8px 10px", textAlign:"right", fontWeight:700, color:"var(--green)" }}>{b.r}</td>
              <td style={{ padding:"8px 10px", textAlign:"right" }}>{b.b}</td>
              <td style={{ padding:"8px 10px", textAlign:"right" }}>{b["4s"]}</td>
              <td style={{ padding:"8px 10px", textAlign:"right" }}>{b["6s"]}</td>
              <td style={{ padding:"8px 10px", textAlign:"right" }}>{b.sr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BowlingTable({ innings }) {
  const bowlers = innings.bowling || [];
  return (
    <div style={{ overflowX: "auto", marginBottom: 24 }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--text2)", fontSize: 14 }}>Bowling</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--bg3)" }}>
            {["Bowler","O","M","R","W","Econ"].map(h => (
              <th key={h} style={{ padding:"8px 10px", textAlign:h==="Bowler"?"left":"right",
                color:"var(--text2)", fontWeight:600, borderBottom:"1px solid var(--border)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bowlers.map((b, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding:"8px 10px", fontWeight:600 }}>{b["bowler-name"] || b.bowler?.name}</td>
              <td style={{ padding:"8px 10px", textAlign:"right" }}>{b.o}</td>
              <td style={{ padding:"8px 10px", textAlign:"right" }}>{b.m}</td>
              <td style={{ padding:"8px 10px", textAlign:"right" }}>{b.r}</td>
              <td style={{ padding:"8px 10px", textAlign:"right", fontWeight:700, color:"var(--red)" }}>{b.w}</td>
              <td style={{ padding:"8px 10px", textAlign:"right" }}>{b.eco}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Scorecard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inningsIdx, setInningsIdx] = useState(0);

  const { data: scData, isLoading, error } = useQuery({
    queryKey: ["scorecard", id],
    queryFn: () => fetchMatchScorecard(id),
  });
  const { data: infoData } = useQuery({
    queryKey: ["matchInfo", id],
    queryFn: () => fetchMatchInfo(id),
  });

  const scorecard = scData?.data?.scorecard || [];
  const match = infoData?.data;

  if (isLoading) return <div className="container"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: 16, fontSize: 13 }}>← Back</button>
      <h1 className="page-title">📊 Scorecard</h1>
      {match && <div style={{ color: "var(--text2)", marginBottom: 20, fontSize: 14 }}>{match.name}</div>}

      {error && (
        <div className="card" style={{ textAlign: "center", color: "var(--text2)", padding: 40 }}>
          Scorecard not available for this match yet
        </div>
      )}

      {scorecard.length > 0 && (
        <>
          {scorecard.length > 1 && (
            <div className="tab-bar" style={{ marginBottom: 20 }}>
              {scorecard.map((inn, i) => (
                <button key={i} className={`tab ${inningsIdx===i?"active":""}`} onClick={() => setInningsIdx(i)}>
                  {inn.inning?.split(" ").slice(0,2).join(" ")}
                </button>
              ))}
            </div>
          )}
          <div className="card">
            <BattingTable innings={scorecard[inningsIdx]} />
            <BowlingTable innings={scorecard[inningsIdx]} />
          </div>
        </>
      )}

      {!error && scorecard.length === 0 && (
        <div className="card" style={{ textAlign: "center", color: "var(--text2)", padding: 40 }}>
          Scorecard not available yet — check back once the match starts
        </div>
      )}
    </div>
  );
}
