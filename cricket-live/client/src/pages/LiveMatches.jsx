import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllMatches } from "../api";
import MatchCard from "../components/MatchCard";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

export default function LiveMatches() {
  const [activeTab, setActiveTab] = useState("live");

  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["allMatches"],
    queryFn: fetchAllMatches,
    refetchInterval: 30000,
  });

  // data from backend is { status: "success", data: { live: [], recent: [], upcoming: [] } }
  // fetchAllMatches returns the full object (usually r.data, which is this wrapper)
  const matchesMap = data?.data || data || { live: [], recent: [], upcoming: [] };
  const currentTabMatches = matchesMap[activeTab] || [];

  // Group matches by Series
  const processGroupedMatches = (matchesList) => {
    const grouped = {};
    matchesList.forEach(match => {
      let seriesName = "International & Other Matches";
      const seriesMatchInfo = match.url ? match.url.match(/(?:live-cricket-scores\/\d+\/)(.+)$/i) : null;
      
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
    
    // Sort logic to bubble "High Voltage" matches on top
    const highVoltageKeywords = ["IPL", "PREMIER LEAGUE", "T20 WORLD CUP", "WORLD CUP", "INDIA", "PAKISTAN", "ASHES", "AUSTRALIA", "ENGLAND", "PSL"];
    
    const sortedGrouped = {};
    const keys = Object.keys(grouped).sort((a, b) => {
       const aHigh = highVoltageKeywords.some(kw => a.toUpperCase().includes(kw)) ? 1 : 0;
       const bHigh = highVoltageKeywords.some(kw => b.toUpperCase().includes(kw)) ? 1 : 0;
       // Primary sort: High voltage first
       if (aHigh !== bHigh) return bHigh - aHigh;
       // Secondary sort: Alphabetical
       return a.localeCompare(b);
    });
    
    keys.forEach(k => {
       sortedGrouped[k] = grouped[k];
    });
    
    return sortedGrouped;
  };

  const groupedMatches = processGroupedMatches(currentTabMatches);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 60 }}>
      <SEO
        title="Scalable Live Center - Real-time Cricket Analytics"
        description="High-frequency live cricket analytics and scores."
        url="/live"
      />
      
      <div className="glass" style={{ padding: "40px", borderRadius: "var(--radius-xl)", marginBottom: 40, background: "linear-gradient(135deg, rgba(224, 45, 45, 0.1), transparent)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: 12 }}>
              <span className="pulse" style={{ color: "var(--red)" }}>●</span> Live Center
            </h1>
            <p style={{ color: "var(--text2)", fontSize: 15 }}>Monitoring {currentTabMatches.length} engagements globally across {Object.keys(groupedMatches).length} series.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {dataUpdatedAt > 0 && (
              <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700 }}>
                LAST HEARTBEAT: {new Date(dataUpdatedAt).toLocaleTimeString()}
              </span>
            )}
            <button className="btn btn-primary" onClick={refetch} style={{ padding: "10px 20px", fontSize: 13 }}>↻ REFRESH PIPELINE</button>
          </div>
        </div>
      </div>

      {/* Tabs Layout matching Cricbuzz Live-Scores Page End-to-End */}
      <div style={{ 
        display: "flex", 
        borderBottom: "1px solid var(--glass-border)", 
        marginBottom: 32,
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
              color: activeTab === tab ? "var(--red)" : "var(--text2)",
              borderBottom: activeTab === tab ? "3px solid var(--red)" : "3px solid transparent",
              cursor: "pointer",
              textTransform: "capitalize",
              transition: "all 0.2s ease"
            }}
          >
            {tab} Matches
          </button>
        ))}
      </div>

      {isLoading && <div className="spinner" />}
      
      {error && (
        <div className="card glass" style={{ borderColor: "var(--error)", padding: 40, textAlign: "center" }}>
          <h2 style={{ color: "var(--error)" }}>Data Link Failure</h2>
          <p style={{ color: "var(--text2)", marginTop: 12 }}>{error.message}</p>
          <button className="btn btn-primary" onClick={refetch} style={{ marginTop: 24 }}>Retry Connection</button>
        </div>
      )}

      {!isLoading && !error && (
        Object.keys(groupedMatches).length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {Object.keys(groupedMatches).map(series => (
              <div key={series} className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                {/* Series Banner */}
                <h3 style={{ 
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "12px 20px", 
                  borderRadius: "8px", 
                  marginBottom: "20px",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "1px",
                  color: "var(--text)",
                  borderLeft: "4px solid var(--primary-light)"
                }}>
                  {series}
                </h3>
                
                <div className="grid-2">
                  {groupedMatches[series].map(m => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass" style={{ textAlign: "center", padding: 80, borderRadius: "var(--radius-xl)" }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>📊</div>
            <h2 style={{ marginBottom: 16 }}>Market Neutral</h2>
            <p style={{ color: "var(--text3)", maxWidth: 500, margin: "0 auto" }}>
              No {activeTab} matches are currently transmitting. All global nodes are on standby. 
              Check the upcoming schedule for the next data stream.
            </p>
          </div>
        )
      )}

      <AdBanner type="responsive" slot="12345678" style={{ marginTop: 40 }} />
    </div>
  );
}
