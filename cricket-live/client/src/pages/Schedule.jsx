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

  // RapidAPI /cricket-schedule response:
  // { status, response: { schedules: [ { scheduleAdWrapper: { date:"SUN, MAR 29 2026",
  //   matchScheduleList: [ { seriesName, matchInfo: [ {matchId, seriesId, matchDesc, matchFormat,
  //     startDate(ms), team1:{teamId,teamName,teamSName,imageId}, team2:{...},
  //     venueInfo:{ground,city,country} } ] } ] } } ] } }
  const schedules = data?.response?.schedules || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <SEO
        title="Cricket Schedule 2026 - Fixtures & Match Timings"
        description="Cricket schedule 2026 — all fixtures, match timings and venues. IPL, T20 World Cup, ODI and Test series timetable."
        keywords="cricket schedule, cricket match today, IPL 2026 schedule, T20 World Cup schedule, cricket fixtures, upcoming cricket matches, cricket timetable, cricket calendar 2026"
        url="/schedule"
      />
      <h1 className="page-title">📅 Schedule</h1>

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load: {error.message}</div>}

      {/* Ad above schedule */}
      {!isLoading && <AdBanner type="responsive" slot="1234567897" style={{ marginBottom: 24 }} />}

      {!isLoading && !error && schedules.map((s, si) => {
        const wrapper = s.scheduleAdWrapper;
        if (!wrapper) return null;
        return (
          <div key={si} style={{ marginBottom: 28 }}>
            <div style={{
              background: "var(--bg3)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "8px 16px", marginBottom: 12,
              fontWeight: 700, fontSize: 14, color: "var(--green)"
            }}>
              📅 {wrapper.date}
            </div>

            {wrapper.matchScheduleList?.map((series, sIdx) => (
              <div key={sIdx} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, marginBottom: 8, paddingLeft: 4 }}>
                  🏆 {series.seriesName}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {series.matchInfo?.map((m, mIdx) => {
                    const startMs = parseInt(m.startDate);
                    const startDate = isNaN(startMs) ? m.startDate : new Date(startMs).toLocaleString();
                    return (
                      <div key={mIdx} className="card" style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>
                              {m.team1?.teamName} vs {m.team2?.teamName}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>
                              {m.matchDesc} &nbsp;•&nbsp; 📍 {m.venueInfo?.ground}, {m.venueInfo?.city}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>
                              ⏰ {startDate}
                            </div>
                          </div>
                          <span className="badge badge-upcoming">{m.matchFormat}</span>
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
        <div className="card" style={{ textAlign: "center", color: "var(--text2)", padding: 40 }}>
          No scheduled matches available
        </div>
      )}
    </div>
  );
}
