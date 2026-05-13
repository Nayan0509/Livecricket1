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

  const matchesMap = data?.data || data || { live: [], recent: [], upcoming: [] };
  const currentTabMatches = matchesMap[activeTab] || [];

  const processGroupedMatches = (matchesList) => {
    const grouped = {};
    matchesList.forEach(match => {
      let seriesName = "International & Other Matches";
      const seriesMatchInfo = match.url ? match.url.match(/(?:live-cricket-scores\/\d+\/)(.+)$/i) : null;
      
      if (seriesMatchInfo && seriesMatchInfo[1]) {
        const slug = seriesMatchInfo[1];
        const extracted = slug.match(/-(ipl|psl|bbl|wt20|t20i|odi|test|league)-(\d{4})/i);
        if (extracted) seriesName = `${extracted[1].toUpperCase()} ${extracted[2]}`;
        else {
           const generic = slug.match(/(?:match|t20is|odis|tests)-(.+)$/i);
           if (generic && generic[1]) seriesName = generic[1].replace(/-/g, ' ').toUpperCase();
        }
      }

      if (!grouped[seriesName]) grouped[seriesName] = [];
      grouped[seriesName].push(match);
    });
    
    const highVoltageKeywords = ["IPL", "WORLD CUP", "INDIA", "PAKISTAN", "ASHES", "AUSTRALIA", "ENGLAND", "PSL"];
    const sortedGrouped = {};
    Object.keys(grouped).sort((a, b) => {
       const aHigh = highVoltageKeywords.some(kw => a.toUpperCase().includes(kw)) ? 1 : 0;
       const bHigh = highVoltageKeywords.some(kw => b.toUpperCase().includes(kw)) ? 1 : 0;
       if (aHigh !== bHigh) return bHigh - aHigh;
       return a.localeCompare(b);
    }).forEach(k => { sortedGrouped[k] = grouped[k]; });
    
    return sortedGrouped;
  };

  const groupedMatches = processGroupedMatches(currentTabMatches);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: 80, paddingTop: 32, maxWidth: 1000, margin: "0 auto" }}>
      <SEO title="Live Matches - CricketZone" url="/live" />
      
      <div style={{ padding: "40px 48px", borderRadius: 32, marginBottom: 40, background: "var(--card)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 12px 0", color: "var(--text)" }}>Live Center</h1>
          <p style={{ color: "var(--text2)", fontSize: 16, margin: 0 }}>Tracking {currentTabMatches.length} matches globally across {Object.keys(groupedMatches).length} series.</p>
        </div>
        <button onClick={refetch} style={{ background: "var(--primary)", border: "none", color: "#161619", padding: "12px 24px", borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--primary-light)"} onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}>
          Refresh Feeds
        </button>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 40, gap: 16, overflowX: "auto" }}>
        {["live", "recent", "upcoming"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "transparent", border: "none", fontWeight: 600, fontSize: 15, padding: "16px 24px",
              color: activeTab === tab ? "var(--primary)" : "var(--text3)",
              borderBottom: activeTab === tab ? "3px solid var(--primary)" : "3px solid transparent",
              cursor: "pointer", textTransform: "capitalize", transition: "color 0.2s ease", marginBottom: -1
            }}
          >
            {tab} Matches
          </button>
        ))}
      </div>

      {isLoading && <div className="spinner" style={{ margin: "60px auto" }} />}
      
      {error && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: 40, textAlign: "center" }}>
          <h2 style={{ color: "var(--live)" }}>Connection Failed</h2>
          <p style={{ color: "var(--text2)" }}>{error.message}</p>
        </div>
      )}

      {!isLoading && !error && (
        Object.keys(groupedMatches).length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {Object.keys(groupedMatches).map(series => (
              <div key={series}>
                <h3 style={{ background: "var(--bg3)", padding: "12px 24px", borderRadius: 100, marginBottom: 24, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: "var(--text)", display: "inline-block", textTransform: "uppercase" }}>
                  {series}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                  {groupedMatches[series].map(m => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "var(--card)", borderRadius: 32, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
            <h2 style={{ fontSize: 24, marginBottom: 12 }}>No matches active</h2>
            <p style={{ color: "var(--text3)", fontSize: 16 }}>Check the upcoming tab for scheduled streams.</p>
          </div>
        )
      )}

      <AdBanner type="responsive" slot="12345678" style={{ marginTop: 60 }} />
    </div>
  );
}
