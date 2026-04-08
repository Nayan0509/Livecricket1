import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMatchScorecard, fetchMatchInfo } from "../api";
import SEO from "../components/SEO";

function BattingTable({ team, batsmen }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div className="section-header" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--primary-light)" }}>Batting: {team}</h3>
      </div>
      <div className="glass" style={{ overflowX: "auto", borderRadius: "var(--radius)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["BATSMAN", "STATUS", "R", "B", "4s", "6s", "SR"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: h==="BATSMAN"||h==="STATUS"?"left":"right", color: "var(--text3)", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {batsmen.map((b, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--divider)", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: 14 }}>{b.name}</td>
                <td style={{ padding: "14px 20px", color: "var(--text3)", fontSize: 12 }}>{b.dismissal}</td>
                <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 900, fontSize: 15, color: "var(--text)" }}>{b.r}</td>
                <td style={{ padding: "14px 20px", textAlign: "right", color: "var(--text2)" }}>{b.b}</td>
                <td style={{ padding: "14px 20px", textAlign: "right", color: "var(--text2)" }}>{b.fours}</td>
                <td style={{ padding: "14px 20px", textAlign: "right", color: "var(--text2)" }}>{b.sixes}</td>
                <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 600, color: "var(--accent-teal)" }}>{b.sr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BowlingTable({ bowlers }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div className="section-header" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800 }}>Bowling Analysis</h3>
      </div>
      <div className="glass" style={{ overflowX: "auto", borderRadius: "var(--radius)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["BOWLER", "O", "M", "R", "W", "ECON"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: h==="BOWLER"?"left":"right", color: "var(--text3)", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bowlers.map((b, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--divider)", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: 14 }}>{b.name}</td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>{b.o}</td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>{b.m}</td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>{b.r}</td>
                <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 900, fontSize: 15, color: "var(--primary-light)" }}>{b.w}</td>
                <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 600 }}>{b.eco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Scorecard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [innIdx, setInnIdx] = useState(0);

  const { data: scData, isLoading, error } = useQuery({
    queryKey: ["scorecard", id],
    queryFn: () => fetchMatchScorecard(id),
    refetchInterval: 30000
  });

  const innings = scData?.data?.innings || [];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 80 }}>
      <SEO title="Statistical Match Scorecard" description="In-depth ball-by-ball match statistics." />
      
      <div className="glass" style={{ padding: "30px 40px", borderRadius: "var(--radius-xl)", marginBottom: 40, marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 4 }}>📊 Match Scorecard</h1>
            <p style={{ color: "var(--text3)", fontSize: 14 }}>Full Innings Statistics & Performance Metrics</p>
          </div>
          <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: "10px 20px", fontSize: 13 }}>← RETURN</button>
        </div>
      </div>

      {isLoading && <div className="spinner" />}
      
      {error && (
        <div className="card glass" style={{ padding: 60, textAlign: "center", borderColor: "var(--error)" }}>
           <h2 style={{ color: "var(--error)" }}>Data Link Failure</h2>
           <p style={{ color: "var(--text3)", marginTop: 12 }}>Statistical data for match {id} is currently unavailable.</p>
        </div>
      )}

      {!isLoading && !error && innings.length > 0 && (
        <>
          <div className="glass" style={{ display: "inline-flex", padding: 6, borderRadius: "14px", marginBottom: 32, gap: 4 }}>
            {innings.map((inn, i) => (
              <button 
                key={i} 
                onClick={() => setInnIdx(i)}
                className={`btn ${innIdx === i ? 'btn-primary' : ''}`}
                style={{ padding: "10px 24px", fontSize: 13, border: "none", background: innIdx === i ? 'var(--gradient-primary)' : 'transparent', color: innIdx === i ? '#fff' : 'var(--text2)' }}
              >
                {inn.team}
              </button>
            ))}
          </div>

          <div key={innIdx} className="animate-fade-in">
             <BattingTable team={innings[innIdx].team} batsmen={innings[innIdx].batsmen} />
             <BowlingTable bowlers={innings[innIdx].bowlers} />
          </div>
        </>
      )}

      {!isLoading && !error && innings.length === 0 && (
        <div className="card glass" style={{ padding: 100, textAlign: "center" }}>
           <div style={{ fontSize: 60, marginBottom: 20 }}>🕐</div>
           <h2>Live Stream Initializing</h2>
           <p style={{ color: "var(--text3)", marginTop: 16 }}>Detailed scorecard data will populate once the primary nodes receive first-innings metrics.</p>
        </div>
      )}
    </div>
  );
}
