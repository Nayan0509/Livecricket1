import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveMatches } from "../api";
import MatchCard from "../components/MatchCard";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

export default function LiveMatches() {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["liveMatches"],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
  });

  const matches = data?.data || [];

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
            <p style={{ color: "var(--text2)", fontSize: 15 }}>Monitoring {matches.length} active engagements globally.</p>
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

      {isLoading && <div className="spinner" />}
      
      {error && (
        <div className="card glass" style={{ borderColor: "var(--error)", padding: 40, textAlign: "center" }}>
          <h2 style={{ color: "var(--error)" }}>Data Link Failure</h2>
          <p style={{ color: "var(--text2)", marginTop: 12 }}>{error.message}</p>
          <button className="btn btn-primary" onClick={refetch} style={{ marginTop: 24 }}>Retry Connection</button>
        </div>
      )}

      {!isLoading && !error && (
        matches.length ? (
          <div className="grid-2">
            {matches.map(m => (
              <div key={m.id} className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <MatchCard match={m} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass" style={{ textAlign: "center", padding: 80, borderRadius: "var(--radius-xl)" }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>📊</div>
            <h2 style={{ marginBottom: 16 }}>Market Neutral</h2>
            <p style={{ color: "var(--text3)", maxWidth: 500, margin: "0 auto" }}>
              No live matches are currently transmitting. All global nodes are on standby. 
              Check the upcoming schedule for the next data stream.
            </p>
            <button className="btn btn-outline" style={{ marginTop: 32 }} onClick={() => window.location.href="/schedule"}>View Pipeline Schedule</button>
          </div>
        )
      )}

      <AdBanner type="responsive" slot="12345678" style={{ marginTop: 40 }} />
    </div>
  );
}
