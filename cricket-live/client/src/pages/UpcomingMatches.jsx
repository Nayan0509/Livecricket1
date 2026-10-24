import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingMatches } from "../api";
import MatchCard from "../components/MatchCard";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";

const FORMATS = ["All", "test", "odi", "t20"];

export default function UpcomingMatches() {
  const [format, setFormat] = useState("All");
  const { data, isLoading, error } = useQuery({
    queryKey: ["upcoming"],
    queryFn: fetchUpcomingMatches,
  });

  const all = Array.isArray(data?.data) ? data.data : [];
  const filtered = format === "All" ? all : all.filter(m => m.matchType?.toLowerCase() === format);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        url="/upcoming"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(11,99,196,0.09) 0%, rgba(255,255,255,0.98) 100%)",
        border: "1px solid rgba(11,99,196,0.15)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          Upcoming <span style={{ color: "#0b63c4" }}>Matches</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          All upcoming cricket fixtures — IPL, T20 World Cup, ODI & Test series
        </p>
      </div>

      <PageIntro intro={PAGE_INTROS["/upcoming"]} />

      {/* Format filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FORMATS.map(f => (
          <button key={f} onClick={() => setFormat(f)} style={{
            padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
            background: format === f ? "rgba(11,99,196,0.15)" : "rgba(15,23,42,0.03)",
            border: `1px solid ${format === f ? "rgba(11,99,196,0.4)" : "rgba(15,23,42,0.08)"}`,
            color: format === f ? "#0b63c4" : "var(--text3)",
            transition: "all 0.15s",
          }}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "20px", color: "#c81e28", background: "rgba(209,32,42,0.08)", borderRadius: 10, marginBottom: 20 }}>Failed to load matches.</div>}

      <AdBanner type="auto" />

      {!isLoading && !error && (
        filtered.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 12, marginTop: 16 }}>
            {filtered.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <div style={{ padding: "40px 20px", textAlign: "center", background: "var(--card)", borderRadius: 12, border: "1px solid rgba(15,23,42,0.06)", margin: "16px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}></div>
            <p style={{ color: "var(--text3)", fontSize: 14 }}>No {format !== "All" ? format.toUpperCase() : ""} upcoming matches found — check back shortly.</p>
          </div>
        )
      )}

    </div>
  );
}
