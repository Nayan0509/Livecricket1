import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllMatches, subscribeLiveMatchStream } from "../api";
import MatchCard from "../components/MatchCard";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";

export default function LiveMatches() {
  const [activeTab, setActiveTab] = useState("live");
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["allMatches"],
    queryFn: fetchAllMatches,
    refetchInterval: 25000,
  });

  // Subscribe to real-time Server-Sent Events (SSE) stream for instantaneous score updates
  useEffect(() => {
    const unsubscribe = subscribeLiveMatchStream((streamData) => {
      if (!streamData) return;
      queryClient.setQueryData(["allMatches"], (prev) => {
        const old = prev?.data || prev || {};
        return {
          ...prev,
          data: {
            live: streamData.live || old.live || [],
            recent: streamData.recent || old.recent || [],
            upcoming: streamData.upcoming || old.upcoming || [],
          },
        };
      });
    });

    return () => unsubscribe();
  }, [queryClient]);

  const matchesMap = data?.data || data || { live: [], recent: [], upcoming: [] };
  const currentTabMatches = matchesMap[activeTab] || [];
  const liveCount = matchesMap.live?.length || 0;
  const recentCount = matchesMap.recent?.length || 0;
  const upcomingCount = matchesMap.upcoming?.length || 0;

  const processGroupedMatches = (matchesList) => {
    const grouped = {};
    matchesList.forEach(match => {
      let seriesName = "International & Domestic Matches";
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
    
    const highVoltageKeywords = ["IPL", "WORLD CUP", "INDIA", "PAKISTAN", "ASHES", "AUSTRALIA", "ENGLAND", "PSL", "COUNTY"];
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
      <SEO
        url="/live"
      />
      
      <div style={{ padding: "36px 40px", borderRadius: 28, marginBottom: 36, background: "var(--card)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: liveCount > 0 ? "#10b981" : "#00F0FF", animation: "livePulse 1.8s infinite" }} />
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, color: "var(--text)" }}>Live Match Center</h1>
          </div>
          <p style={{ color: "var(--text2)", fontSize: 15, margin: 0 }}>
            {liveCount > 0 
              ? `Tracking ${liveCount} live match${liveCount > 1 ? "es" : ""} in real time across global leagues and international tours.`
              : `Real-time radar connected. Tracking ${recentCount} recent results & ${upcomingCount} upcoming fixtures globally.`}
          </p>
        </div>
        <button 
          onClick={() => refetch()} 
          style={{ background: "var(--primary)", border: "none", color: "#161619", padding: "12px 24px", borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} 
          onMouseEnter={e => e.currentTarget.style.background = "var(--primary-light)"} 
          onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}
        >
          🔄 Refresh Feeds
        </button>
      </div>

      <PageIntro intro={PAGE_INTROS["/live"]} />

      {/* Tabs with live count badges */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 36, gap: 12, overflowX: "auto" }}>
        {[
          { key: "live", label: "Live Now", count: liveCount, color: "#10b981" },
          { key: "recent", label: "Recent Results", count: recentCount, color: "var(--primary)" },
          { key: "upcoming", label: "Upcoming Fixtures", count: upcomingCount, color: "#a855f7" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: "transparent", border: "none", fontWeight: 700, fontSize: 15, padding: "14px 20px",
              color: activeTab === tab.key ? "var(--primary)" : "var(--text3)",
              borderBottom: activeTab === tab.key ? "3px solid var(--primary)" : "3px solid transparent",
              cursor: "pointer", transition: "color 0.2s ease", marginBottom: -1,
              display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap"
            }}
          >
            {tab.key === "live" && tab.count > 0 && (
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "livePulse 1.8s infinite" }} />
            )}
            {tab.label}
            <span style={{
              fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 12,
              background: activeTab === tab.key ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
              color: activeTab === tab.key ? "var(--primary)" : "var(--text-muted)"
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {isLoading && <div className="spinner" style={{ margin: "60px auto" }} />}
      
      {error && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: 40, textAlign: "center" }}>
          <h2 style={{ color: "var(--live)" }}>Connection Retrying</h2>
          <p style={{ color: "var(--text2)" }}>{error.message || "Reconnecting to live scoring stream..."}</p>
        </div>
      )}

      {!isLoading && !error && (
        Object.keys(groupedMatches).length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {Object.keys(groupedMatches).map(series => (
              <div key={series}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <h3 style={{ background: "var(--bg3)", padding: "8px 20px", borderRadius: 100, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: "var(--text)", margin: 0, textTransform: "uppercase" }}>
                    {series}
                  </h3>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                    {groupedMatches[series].length} {groupedMatches[series].length === 1 ? "match" : "matches"}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 24 }}>
                  {groupedMatches[series].map(m => <MatchCard key={m.id} match={m} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Rich Active Radar Fallback: Never leave the user with an empty/dead screen */
          <div>
            <div style={{ padding: "36px 32px", background: "var(--card)", borderRadius: 24, border: "1px solid var(--border)", marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0, 240, 255, 0.12)", border: "1px solid rgba(0, 240, 255, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  📡
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px 0", color: "var(--text)" }}>
                    Live Radar Active & Listening
                  </h2>
                  <p style={{ color: "var(--text2)", fontSize: 14, margin: 0 }}>
                    Matches are tracked live 24/7. As soon as the next session or fixture commences, live ball-by-ball updates will stream here automatically.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
                <button
                  onClick={() => setActiveTab("recent")}
                  style={{ padding: "10px 20px", borderRadius: 100, background: "rgba(0, 240, 255, 0.12)", border: "1px solid rgba(0, 240, 255, 0.3)", color: "var(--primary)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  ⚡ View Concluded Matches ({recentCount})
                </button>
                <button
                  onClick={() => setActiveTab("upcoming")}
                  style={{ padding: "10px 20px", borderRadius: 100, background: "rgba(168, 85, 247, 0.12)", border: "1px solid rgba(168, 85, 247, 0.3)", color: "#c084fc", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  📅 View Scheduled Fixtures ({upcomingCount})
                </button>
              </div>
            </div>

            {/* Immediately show Recently Completed Matches below so the screen is packed with live data */}
            {matchesMap.recent && matchesMap.recent.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
                    <span>🏆</span> Recently Completed Matches
                  </h3>
                  <button
                    onClick={() => setActiveTab("recent")}
                    style={{ background: "none", border: "none", color: "var(--primary)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                  >
                    View All {recentCount} Results →
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 24 }}>
                  {matchesMap.recent.slice(0, 6).map(m => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}

      <div style={{ marginTop: 48 }}><AdBanner type="auto" /></div>
    </div>
  );
}

