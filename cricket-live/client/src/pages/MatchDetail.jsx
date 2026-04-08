import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMatchInfo, fetchMatchScorecard } from "../api";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

function ScorecardTab({ matchId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["scorecard", matchId],
    queryFn: () => fetchMatchScorecard(matchId),
    refetchInterval: 30000
  });

  const innings = data?.data?.innings || [];

  if (isLoading) return <div className="spinner" />;
  if (!innings.length) return (
    <div className="card glass" style={{ padding: 60, textAlign: "center" }}>
       <div style={{ fontSize: 40, marginBottom: 16 }}>📡</div>
       <p style={{ color: "var(--text3)" }}>Scorecard data pending transmission from primary link.</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {innings.map((inn, idx) => (
        <div key={idx} className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
             <h3 style={{ fontSize: 18, fontWeight: 900, color: "var(--primary-light)" }}>{inn.team}</h3>
             <span style={{ fontSize: 20, fontWeight: 900 }}>{inn.score}</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Batsman", "Status", "R", "B", "SR"].map(h => (
                    <th key={h} style={{ padding: 12, textAlign: h==="Batsman"||h==="Status"?"left":"right", fontSize: 11, color: "var(--text3)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inn.batsmen.map((b, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--divider)" }}>
                    <td style={{ padding: 12, fontWeight: 700 }}>{b.name}</td>
                    <td style={{ padding: 12, fontSize: 11, color: "var(--text3)" }}>{b.dismissal}</td>
                    <td style={{ padding: 12, textAlign: "right", fontWeight: 800 }}>{b.r}</td>
                    <td style={{ padding: 12, textAlign: "right", color: "var(--text2)" }}>{b.b}</td>
                    <td style={{ padding: 12, textAlign: "right", color: "var(--accent-teal)" }}>{b.sr}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Bowler", "O", "R", "W", "ECON"].map(h => (
                    <th key={h} style={{ padding: 12, textAlign: h==="Bowler"?"left":"right", fontSize: 11, color: "var(--text3)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inn.bowlers.map((bw, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--divider)" }}>
                    <td style={{ padding: 12, fontWeight: 700 }}>{bw.name}</td>
                    <td style={{ padding: 12, textAlign: "right" }}>{bw.o}</td>
                    <td style={{ padding: 12, textAlign: "right" }}>{bw.r}</td>
                    <td style={{ padding: 12, textAlign: "right", fontWeight: 800, color: "var(--primary-light)" }}>{bw.w}</td>
                    <td style={{ padding: 12, textAlign: "right" }}>{bw.eco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16 }}>
             <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderTop: "1px solid var(--divider)", paddingTop: 12 }}>
                <span style={{ fontWeight: 700, color: "var(--text2)" }}>EXTRAS</span>
                <span style={{ fontWeight: 800 }}>{inn.extras}</span>
             </div>
             {inn.fow && inn.fow.length > 0 && (
               <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>Fall of Wickets</div>
                  <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{inn.fow.join(", ")}</div>
               </div>
             )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Default to scorecard for live matches
  const { data: infoData, isLoading, error } = useQuery({
    queryKey: ["matchInfo", id],
    queryFn: () => fetchMatchInfo(id),
  });
  
  const match = infoData?.data;
  const isLive = match?.matchStarted && !match?.matchEnded;
  const [tab, setTab] = useState(isLive ? "scorecard" : "insights");

  if (isLoading) return <div className="container" style={{ textAlign: "center", padding: 100 }}><div className="spinner" /></div>;
  if (error || !match) return (
    <div className="container">
       <div className="card glass" style={{ marginTop: 40, textAlign: "center", padding: 60, borderColor: "var(--error)" }}>
          <h2 style={{ color: "var(--error)" }}>404 - Match Analytics Lost</h2>
          <p style={{ color: "var(--text3)", marginTop: 12 }}>Unable to retrieve real-time data for this match ID. {error?.message}</p>
          <button onClick={() => navigate("/")} className="btn btn-primary" style={{ marginTop: 24 }}>Return to Dashboard</button>
       </div>
    </div>
  );



  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60 }}>
      <SEO 
        title={`${match.name} Live Score, Ball-by-Ball Commentary, Scorecard | Live Cricket Zone`} 
        description={`Get ${match.name} live cricket score updates, ball-by-ball commentary, full scorecard, and match analysis. Stay updated with real-time insights from ${match.venue}.`}
        url={`/match/${id}`}
        type="article"
        keywords={`${match.name} live score, ${match.name} scorecard, ${match.name} commentary, cricket live score today, ${match.teamInfo?.[0]?.name} vs ${match.teamInfo?.[1]?.name} live`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          "name": match.name,
          "description": match.status,
          "startDate": match.dateTimeGMT,
          "location": {
            "@type": "Place",
            "name": match.venue
          },
          "competitor": match.teamInfo?.map(t => ({
            "@type": "SportsTeam",
            "name": t.name,
            "image": t.img
          }))
        }}
      />
      
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ border: "1px solid var(--glass-border)", background: "var(--glass)", marginBottom: 20 }}>
        ← Dashboard
      </button>

      {/* Match Header Glassmorphism */}
      <div className="glass" style={{ 
        padding: "40px 32px", borderRadius: "var(--radius-xl)", marginBottom: 32,
        backgroundImage: "linear-gradient(135deg, rgba(224, 45, 45, 0.05), rgba(0,0,0,0))"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, alignItems: "center", marginBottom: 32 }}>
           <div>
             <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "var(--primary-light)", fontWeight: 800, textTransform: "uppercase" }}>{match.matchType}</span>
                <span style={{ width: 1, height: 12, background: "var(--divider)" }} />
                <span style={{ fontSize: 13, color: "var(--text3)" }}>{match.venue}</span>
             </div>
             <h1 style={{ fontSize: 32, fontWeight: 900 }}>{match.name}</h1>
           </div>
           <div style={{ display: "flex", gap: 12 }}>
              {isLive && <span className="badge badge-live">🔴 IN-PLAY</span>}
              {match.matchEnded && <span className="badge badge-completed">FINAL RESULT</span>}
           </div>
        </div>

        <div className="grid-2" style={{ alignItems: "center", gap: 60 }}>
           <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {match.teamInfo?.map((team, idx) => {
                 const currentTeamScore = match.score?.find(s => s.inning.includes(team.name));
                 return (
                   <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                         {team.img ? <img src={team.img} alt={team.name} style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid var(--divider)" }} />
                                   : <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{team.shortname}</div>}
                         <span style={{ fontSize: 24, fontWeight: 800 }}>{team.name}</span>
                      </div>
                      {currentTeamScore && (
                        <div style={{ textAlign: "right" }}>
                           <div style={{ fontSize: 28, fontWeight: 900, color: isLive ? "var(--primary-light)" : "var(--text)" }}>{currentTeamScore.r}/{currentTeamScore.w}</div>
                           <div style={{ fontSize: 13, color: "var(--text3)" }}>({currentTeamScore.o} ov)</div>
                        </div>
                      )}
                   </div>
                 );
              })}
           </div>

           <div className="card glass" style={{ border: "1px solid var(--glass-border)", padding: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "var(--primary-light)" }}>{match.status}</div>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
                 <strong>Toss:</strong> {match.tossWinner ? `${match.tossWinner} won, chose to ${match.tossChoice}` : "Waiting for toss report..."}
              </p>
           </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
         <div style={{ flex: 1 }}>
            <div className="section-header" style={{ border: "none", marginBottom: 24 }}>
               <div style={{ display: "flex", gap: 24 }}>
                  {["insights", "scorecard", "teams"].map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{ 
                       background: "none", border: "none", color: tab === t ? "var(--primary-light)" : "var(--text3)",
                       fontSize: 16, fontWeight: 700, cursor: "pointer", position: "relative", padding: "8px 0"
                    }}>
                       {t.toUpperCase()}
                       {tab === t && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "var(--primary-light)", borderRadius: 2 }} />}
                    </button>
                  ))}
               </div>
            </div>

            {tab === "insights" && (
              <div className="animate-fade-in">
                 <div className="card glass" style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 18, marginBottom: 16 }}>📊 Match Analysis</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                       <div style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
                          <span style={{ fontSize: 12, color: "var(--text3)" }}>Win Probability</span>
                          <div style={{ fontSize: 24, fontWeight: 900, color: "var(--accent-green)", marginTop: 4 }}>
                             {match.teamInfo?.[0]?.shortname} 58% - 42% {match.teamInfo?.[1]?.shortname}
                          </div>
                          <div style={{ height: 4, background: "var(--bg3)", marginTop: 8, borderRadius: 2, overflow: "hidden" }}>
                             <div style={{ height: "100%", width: "58%", background: "var(--accent-green)" }} />
                          </div>
                       </div>
                       <div style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
                          <span style={{ fontSize: 12, color: "var(--text3)" }}>Projected Score</span>
                          <div style={{ fontSize: 24, fontWeight: 900, color: "var(--accent-orange)", marginTop: 4 }}>340 - 365</div>
                       </div>
                    </div>
                 </div>
                 
                 {/* Quick Scorecard Preview in Insights */}
                 <ScorecardTab matchId={id} />
              </div>
            )}

            {tab === "scorecard" && (
              <ScorecardTab matchId={id} />
            )}
            
            {tab === "teams" && (
              <div className="grid-2 animate-fade-in">
                 {match.teamInfo?.map((team, idx) => (
                    <div key={idx} className="card glass">
                       <h3 style={{ marginBottom: 16 }}>{team.name}</h3>
                       <div style={{ color: "var(--text3)", fontSize: 14 }}>Squad data syncing...</div>
                    </div>
                 ))}
              </div>
            )}
         </div>

         <aside style={{ width: 340 }}>
            <div className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)" }}>
               <h3 style={{ fontSize: 17, marginBottom: 20 }}>📍 Venue Information</h3>
               <div style={{ fontSize: 14, color: "var(--text2)", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div><strong>Stadium:</strong> {match.venue}</div>
                  <div><strong>Pitch:</strong> Balanced High-Scoring</div>
                  <div><strong>Weather:</strong> 28°C / Clear</div>
               </div>
               <AdBanner type="responsive" slot="54321" style={{ marginTop: 32 }} />
            </div>
         </aside>
      </div>
    </div>
  );
}
