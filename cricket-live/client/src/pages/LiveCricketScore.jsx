import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchAllMatches } from "../api";

export default function LiveCricketScore() {
  const [matchesMap, setMatchesMap] = useState({ live: [], recent: [], upcoming: [] });
  const [activeTab, setActiveTab] = useState("live");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const result = await fetchAllMatches();
        // Since `res.json({ status: "success", data })` returns it in data field
        if (result && result.data) {
          setMatchesMap(result.data);
        } else if (result) {
          setMatchesMap(result); // Fallback in case of direct structure
        }
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
    const interval = setInterval(loadMatches, 30000); // 30 seconds refresh
    return () => clearInterval(interval);
  }, []);

  const currentTabMatches = matchesMap[activeTab] || [];

  // Group matches by Series logic based on derived match names or simply categorising
  const processGroupedMatches = (matchesList) => {
    const grouped = {};
    matchesList.forEach(match => {
      const seriesMatchInfo = match.url ? match.url.match(/(?:live-cricket-scores\/\d+\/)(.+)$/i) : null;
      let seriesName = "International & Other Matches";
      
      if (seriesMatchInfo && seriesMatchInfo[1]) {
        const slug = seriesMatchInfo[1];
        const extracted = slug.match(/-(ipl|psl|bbl|wt20|t20i|odi|test|league)-(\d{4})/i);
        if (extracted) {
           seriesName = `${extracted[1].toUpperCase()} ${extracted[2]}`;
        } else {
           const generic = slug.match(/(?:match|t20is|odis|tests)-(.+)$/i);
           if (generic && generic[1]) {
              seriesName = generic[1].replace(/-/g, ' ').toUpperCase();
           }
        }
      }

      if (!grouped[seriesName]) grouped[seriesName] = [];
      grouped[seriesName].push(match);
    });
    return grouped;
  };

  const groupedMatches = processGroupedMatches(currentTabMatches);

  return (
    <>
      <SEO 
        title="Live Cricket Score - Real-Time Cricket Scores Today 2026"
        description="Live cricket score today with real-time updates. IPL 2026, T20 World Cup, ODI, Test matches. Ball-by-ball commentary updated every 15 seconds."
        keywords="live cricket score, cricket live score today, live cricket score today, cricket score live, live score cricket, cricket live score, real time cricket score, live cricket scores today, IPL live score, T20 live score"
        url="/live-cricket-score"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Live Cricket Score Today",
          "description": "Real-time live cricket scores for all matches",
          "url": "https://www.livecricketzone.com/live-cricket-score"
        }}
      />
      
      <div className="container" style={{ paddingBottom: 60, maxWidth: "1200px" }}>
        
        <div style={{ marginBottom: 24 }}>
          <h1 className="page-title" style={{ fontSize: 28, marginBottom: 8 }}>Live Cricket Score</h1>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>Real-time match data across formats matching leading sports dashboards.</p>
        </div>

        {/* Custom Tabs implementation */}
        <div style={{ 
          display: "flex", 
          borderBottom: "1px solid var(--divider)", 
          marginBottom: 24,
          overflowX: "auto"
        }}>
          {["live", "recent", "upcoming"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "transparent",
                border: "none",
                fontWeight: 700,
                fontSize: 15,
                padding: "16px 32px",
                color: activeTab === tab ? "var(--primary-light)" : "var(--text2)",
                borderBottom: activeTab === tab ? "3px solid var(--primary-light)" : "3px solid transparent",
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.2s ease"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" style={{ margin: "60px auto" }} />
        ) : currentTabMatches.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {Object.keys(groupedMatches).map(series => (
              <div key={series} className="card" style={{ padding: 0, overflow: "hidden" }}>
                {/* Series Header */}
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.03)", 
                  padding: "12px 20px", 
                  borderBottom: "1px solid var(--divider)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text)"
                }}>
                  {series}
                </div>
                
                {/* Matches in Series */}
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {groupedMatches[series].map(match => (
                      <Link 
                        key={match.id} 
                        to={`/match/${match.id}/${activeTab === 'live' ? 'live-score' : 'scorecard'}`} 
                        style={{ textDecoration: "none" }}
                      >
                        <div className={`match-card ${activeTab === 'live' ? 'match-card-live' : ''}`} style={{ margin: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                {activeTab === 'live' && <span className="badge badge-live">● LIVE</span>}
                                {activeTab === 'recent' && <span className="badge badge-primary">RESULT</span>}
                                {activeTab === 'upcoming' && <span className="badge badge-outline">UPCOMING</span>}
                                <span style={{ fontSize: 13, color: "var(--text3)", fontWeight: 600 }}>{match.matchType}</span>
                              </div>
                              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{match.name}</div>
                              {match.venue && <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>📍 {match.venue}</div>}
                            </div>
                            <div style={{ textAlign: "right", maxWidth: 150 }}>
                              <div style={{ 
                                color: activeTab === 'live' ? "var(--red)" : "var(--primary-light)", 
                                fontWeight: 600, 
                                fontSize: 13,
                                lineHeight: 1.4
                              }}>
                                {match.status}
                              </div>
                            </div>
                          </div>
                          {match.score && match.score.length > 0 && (
                             <div style={{ display: "flex", gap: 16, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--divider)" }}>
                               {match.score.map((s, idx) => (
                                 <div key={idx}>
                                   <span style={{ fontSize: 12, color: "var(--text2)", marginRight: 8 }}>{s.inning}</span>
                                   <strong style={{ fontSize: 15 }}>{s.r}/{s.w} <span style={{fontSize: 12, color: "var(--text3)", fontWeight: 400}}>({s.o})</span></strong>
                                 </div>
                               ))}
                             </div>
                          )}
                          <div style={{ marginTop: 12, fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>
                            {activeTab === 'live' ? "Live Score & Updates →" : "View Match Center →"}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🦗</div>
            <h3 style={{ color: "var(--text)", marginBottom: 8 }}>No {activeTab} matches at the moment</h3>
            <p style={{ color: "var(--text3)" }}>Check back later or view the other tabs for more cricket action.</p>
          </div>
        )}
      </div>
    </>
  );
}
