import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSchedule } from "../api";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

export default function Schedule() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
  });

  const schedules = data?.response?.schedules || [];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Cricket Schedule 2026 — Fixtures, Match Timings & Venues"
        description="Complete cricket schedule 2026 — all upcoming fixtures, match timings and venues. IPL 2026, T20 World Cup, ODI and Test series timetable. Never miss a cricket match."
        keywords="cricket schedule 2026, cricket fixtures, upcoming cricket matches, IPL 2026 schedule, T20 World Cup schedule 2026, ODI series schedule, Test cricket schedule, cricket calendar 2026, cricket match timings, cricket timetable 2026"
        url="/schedule"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(34,197,94,0.14)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          📅 Cricket <span style={{ color: "#22C55E" }}>Schedule 2026</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          All upcoming cricket fixtures — IPL, T20 World Cup, ODI & Test series
        </p>
      </div>

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "20px", color: "#f87171", background: "rgba(248,113,113,0.08)", borderRadius: 10, marginBottom: 20 }}>Failed to load schedule. Try refreshing.</div>}

      {!isLoading && <AdBanner type="auto" />}

      {!isLoading && !error && schedules.map((s, si) => {
        const wrapper = s.scheduleAdWrapper;
        if (!wrapper) return null;
        return (
          <div key={si} style={{ marginBottom: 28 }}>
            <div style={{
              background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)",
              borderRadius: 8, padding: "8px 16px", marginBottom: 12,
              fontWeight: 700, fontSize: 13, color: "#22C55E",
            }}>
              📅 {wrapper.date}
            </div>
            {wrapper.matchScheduleList?.map((series, sIdx) => (
              <div key={sIdx} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, marginBottom: 8, paddingLeft: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  🏆 {series.seriesName}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {series.matchInfo?.map((m, mIdx) => {
                    const startMs = parseInt(m.startDate);
                    const startDate = isNaN(startMs) ? m.startDate : new Date(startMs).toLocaleString();
                    return (
                      <div key={mIdx} style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>
                              {m.team1?.teamName} vs {m.team2?.teamName}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 2 }}>
                              {m.matchDesc} &nbsp;•&nbsp; 📍 {m.venueInfo?.ground}, {m.venueInfo?.city}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>⏰ {startDate}</div>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, background: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)", flexShrink: 0 }}>
                            {m.matchFormat}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {!isLoading && !error && schedules.length === 0 && (
        <div style={{ padding: "40px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📅</div>
          <p style={{ color: "var(--text3)", fontSize: 14 }}>Schedule loading — check back shortly.</p>
        </div>
      )}

      {/* Rich SEO content */}
      <section style={{ marginTop: 32, padding: "24px 24px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(34,197,94,0.07)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#22C55E,#16A34A)", display: "inline-block" }} />
          Cricket Schedule 2026 — Complete Fixtures Guide
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Live Cricket Zone's cricket schedule 2026 page gives you every upcoming international and domestic cricket fixture in one place. From the <strong style={{ color: "var(--text2)" }}>IPL 2026 schedule</strong> to the T20 World Cup 2026, Champions Trophy, ODI series and Test matches — all upcoming cricket match timings, venues and dates are updated in real time directly from the live fixture data.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          The 2026 cricket calendar is packed with major events. The <strong style={{ color: "var(--text2)" }}>ICC T20 World Cup 2026</strong> runs in June 2026 with 16 nations competing across 45 matches. The IPL 2026 runs from March through May with 10 franchises playing 74 matches. County Championship 2026 runs throughout the English summer, while PSL, BBL, CPL and BPL fill the global T20 league calendar. The ICC Future Tours Programme also schedules bilateral ODI and Test series between all major nations throughout the year.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          For each upcoming fixture, Live Cricket Zone shows the match name, venue, date and local time. Once a match begins, click through to get real-time ball-by-ball live score, full scorecard, toss information and free live stream links. The schedule refreshes automatically — you never need to reload the page to see updated fixtures.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          Use the format filter to view only Test matches, ODIs or T20Is. Check back daily as new fixtures are added to the schedule — all completely free with no account or subscription required.
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
          {["IPL 2026 Schedule", "T20 World Cup 2026 Fixtures", "ODI Series 2026", "Test Schedule 2026", "PSL 2026 Schedule", "BBL 2026 Fixtures", "CPL 2026 Schedule", "Cricket Calendar 2026"].map(tag => (
            <span key={tag} style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.14)", color: "rgba(74,222,128,0.8)" }}>{tag}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
