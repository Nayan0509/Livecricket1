import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSchedule, fetchDetailedSchedule } from "../api";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";

const SCHEDULE_TABS = [
  { id: "all",           label: "📅 All Upcoming" },
  { id: "international", label: "🌍 International" },
  { id: "league",        label: "🏆 T20 Leagues" },
  { id: "women",         label: "👩 Women's" },
  { id: "domestic",      label: "🏏 Domestic" },
];

export default function Schedule() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
  });

  const { data: detailedData, isLoading: detailedLoading } = useQuery({
    queryKey: ["detailedSchedule", activeTab],
    queryFn: () => fetchDetailedSchedule(activeTab, null, new Date().getFullYear()),
    enabled: activeTab !== "all",
  });

  const schedules = allData?.response?.schedules || [];
  const detailedMatches = detailedData?.data || [];

  const scheduleSD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Cricket Schedule",
    "description": "Upcoming cricket matches, series, tours and tournaments.",
    "url": "https://www.livecricketzone.com/schedule"
  };

  const isLoading = activeTab === "all" ? allLoading : detailedLoading;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        url="/schedule"
        structuredData={scheduleSD}
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "32px 28px", borderRadius: 20,
        background: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(13,20,38,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.2)",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: "#00F0FF", marginBottom: 12 }}>
          <span>📅</span> GLOBAL CRICKET CALENDAR
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
          Cricket <span style={{ color: "#00F0FF" }}>Schedule</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, maxWidth: 650 }}>
          All upcoming cricket fixtures, tournament dates, and match timings across International tours, T20 Leagues, Women's cricket, and First-Class Domestic competitions.
        </p>
      </div>

      <PageIntro intro={PAGE_INTROS["/schedule"]} />

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {SCHEDULE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
              background: activeTab === t.id ? "rgba(0,240,255,0.15)" : "rgba(255,255,255,0.025)",
              border: `1px solid ${activeTab === t.id ? "#00F0FF" : "rgba(255,255,255,0.07)"}`,
              color: activeTab === t.id ? "#fff" : "var(--text3)",
              boxShadow: activeTab === t.id ? "0 0 14px rgba(0,240,255,0.25)" : "none"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}

      {/* TAB: ALL UPCOMING MATCHES */}
      {!isLoading && activeTab === "all" && (
        <div>
          {schedules.length > 0 ? (
            schedules.map((s, si) => {
              const wrapper = s.scheduleAdWrapper;
              if (!wrapper) return null;
              return (
                <div key={si} style={{ marginBottom: 28 }}>
                  <div style={{
                    background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
                    borderRadius: 10, padding: "10px 18px", marginBottom: 14,
                    fontWeight: 800, fontSize: 13, color: "#00F0FF", display: "inline-block"
                  }}>
                    📅 {wrapper.date}
                  </div>
                  {wrapper.matchScheduleList?.map((series, sIdx) => (
                    <div key={sIdx} style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 800, marginBottom: 10, paddingLeft: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        🏆 {series.seriesName}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                        {series.matchInfo?.map((m, mIdx) => {
                          const startMs = parseInt(m.startDate);
                          const startDate = isNaN(startMs) ? m.startDate : new Date(startMs).toLocaleString();
                          return (
                            <div key={mIdx} style={{
                              padding: "16px 18px", borderRadius: 12,
                              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                              display: "flex", flexDirection: "column", justifyContent: "space-between"
                            }}>
                              <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 12, background: "rgba(56,189,248,0.1)", color: "#00F0FF", border: "1px solid rgba(56,189,248,0.2)" }}>
                                    {m.matchFormat || "Match"}
                                  </span>
                                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>⏰ {startDate}</span>
                                </div>
                                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>
                                  {m.team1?.teamName} vs {m.team2?.teamName}
                                </div>
                                <div style={{ fontSize: 12, color: "var(--text3)" }}>
                                  {m.matchDesc} {m.venueInfo?.ground ? `• 📍 ${m.venueInfo.ground}` : ""}
                                </div>
                              </div>
                              {m.matchId && (
                                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                  <Link to={`/match/${m.matchId}`} style={{ fontSize: 12, fontWeight: 700, color: "#00F0FF", textDecoration: "none" }}>
                                    Match Center →
                                  </Link>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          ) : (
            <div style={{ padding: "40px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
              <p style={{ color: "var(--text3)", fontSize: 14, margin: 0 }}>Upcoming schedule fixtures updating continuously.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB: SPECIFIC CATEGORY SCHEDULE */}
      {!isLoading && activeTab !== "all" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {detailedMatches.length > 0 ? (
            detailedMatches.map((m, idx) => (
              <div key={m.id || idx} style={{
                padding: "16px 18px", borderRadius: 12,
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", flexDirection: "column", justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 12, background: "rgba(176,38,255,0.15)", color: "#B026FF", border: "1px solid rgba(176,38,255,0.3)" }}>
                      {m.format || m.matchType || "Fixture"}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>📅 {m.date}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#00F0FF", fontWeight: 700, marginBottom: 4 }}>{m.series}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{m.name}</div>
                </div>
                {m.id && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <Link to={`/match/${m.id}`} style={{ fontSize: 12, fontWeight: 700, color: "#00F0FF", textDecoration: "none" }}>
                      Match Details →
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", padding: "40px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ color: "var(--text3)", fontSize: 14, margin: 0 }}>Fixtures for this category will be listed as announced by governing bodies.</p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 28 }}><AdBanner type="auto" /></div>

    </div>
  );
}
