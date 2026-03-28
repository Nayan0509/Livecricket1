import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { fetchLiveMatches, fetchUpcomingMatches, fetchSchedule } from "../api";
import MatchCard from "../components/MatchCard";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

const SITE_SD = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Live Cricket Matches",
  "sport": "Cricket",
  "url": "https://criclive.vercel.app"
};

function PlayMatchCard({ match }) {
  const navigate = useNavigate();
  const isLive = match.matchStarted && !match.matchEnded;

  return (
    <div className="card" style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}
      onClick={() => navigate("/watch-live")}>
      {isLive && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "var(--radius)",
          border: "2px solid var(--red)", pointerEvents: "none",
          animation: "glow-border 2s infinite"
        }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600, textTransform: "uppercase" }}>
          {match.matchType}
        </span>
        {isLive
          ? <span className="badge badge-live"><span className="pulse">●</span> LIVE</span>
          : <span className="badge badge-upcoming">Upcoming</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        {match.teamInfo?.slice(0, 2).map((t, i) => (
          <React.Fragment key={i}>
            {i === 1 && <span style={{ color: "var(--text3)", fontSize: 12, fontWeight: 700 }}>vs</span>}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {t.img && <img src={t.img} alt={t.shortname} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />}
              <span style={{ fontWeight: 700, fontSize: 14 }}>{t.shortname}</span>
            </div>
          </React.Fragment>
        ))}
        {!match.teamInfo?.length && <span style={{ fontWeight: 700, fontSize: 14 }}>{match.name}</span>}
      </div>
      {match.score?.map((s, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between",
          padding: "3px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
          <span style={{ color: "var(--text2)" }}>{s.inning?.replace(" Inning", "")}</span>
          <span style={{ fontWeight: 700, color: "var(--green)" }}>{s.r}/{s.w}
            <span style={{ color: "var(--text3)", fontSize: 11 }}> ({s.o})</span>
          </span>
        </div>
      ))}
      <div style={{ fontSize: 12, color: isLive ? "var(--red)" : "var(--text2)", marginTop: 8 }}>
        {match.status}
      </div>
      <div style={{
        position: "absolute", bottom: 12, right: 12,
        width: 44, height: 44, borderRadius: "50%",
        background: isLive ? "var(--red)" : "var(--green)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, boxShadow: `0 4px 16px ${isLive ? "rgba(255,82,82,0.5)" : "rgba(0,200,83,0.5)"}`,
        transition: "transform 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >▶</div>
    </div>
  );
}

function ScheduleRow({ match }) {
  const navigate = useNavigate();
  const startMs = parseInt(match.startDate);
  const startTime = isNaN(startMs) ? match.startDate : new Date(startMs).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px", borderBottom: "1px solid var(--border)",
      transition: "background 0.15s", cursor: "pointer"
    }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      onClick={() => navigate("/watch-live")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg3)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
            {match.team1?.teamSName?.slice(0, 3)}
          </div>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{match.team1?.teamSName}</span>
        </div>
        <span style={{ color: "var(--text3)", fontSize: 11 }}>vs</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--bg3)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
            {match.team2?.teamSName?.slice(0, 3)}
          </div>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{match.team2?.teamSName}</span>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: "var(--text3)" }}>{startTime}</div>
        <span className="badge badge-upcoming" style={{ fontSize: 10, marginTop: 2 }}>{match.matchFormat}</span>
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: "var(--green)", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 14, color: "#000",
        boxShadow: "0 2px 8px rgba(0,200,83,0.4)", transition: "transform 0.2s"
      }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >▶</div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const { data: liveData, isLoading: liveLoading } = useQuery({
    queryKey: ["liveMatches"], queryFn: fetchLiveMatches, refetchInterval: 30000,
  });
  const { data: upcomingData } = useQuery({
    queryKey: ["upcoming"], queryFn: fetchUpcomingMatches,
  });
  const { data: scheduleData } = useQuery({
    queryKey: ["schedule"], queryFn: fetchSchedule,
  });

  const liveMatches = liveData?.data?.slice(0, 4) || [];
  const upcoming = upcomingData?.data?.filter(m => !m.matchEnded).slice(0, 4) || [];

  const scheduleRows = [];
  for (const s of (scheduleData?.response?.schedules || []).slice(0, 3)) {
    const wrapper = s.scheduleAdWrapper;
    if (!wrapper) continue;
    for (const series of wrapper.matchScheduleList || [])
      for (const m of series.matchInfo || [])
        scheduleRows.push({ ...m, seriesName: series.seriesName, date: wrapper.date });
    if (scheduleRows.length >= 8) break;
  }

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <SEO
        title="Live Cricket Scores, IPL 2026, T20 & ODI Match Updates"
        description="Get live cricket scores, ball-by-ball commentary, IPL 2026 live updates, T20 World Cup, ODI & Test match scorecards, player stats and ICC rankings on CricLive."
        url="/"
        structuredData={SITE_SD}
      />

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%)",
        border: "1px solid var(--border)", borderRadius: 16,
        padding: "48px 32px", marginBottom: 32, textAlign: "center",
      }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🏏</div>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: "var(--green)", marginBottom: 8 }}>Live Cricket Zone</h1>
        <p style={{ color: "var(--text2)", fontSize: 18, marginBottom: 24 }}>
          Live scores • Ball-by-ball • News • Stats
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/live" className="btn btn-primary">🔴 Live Matches</Link>
          <button onClick={() => navigate("/watch-live")} className="btn btn-outline"
            style={{ background: "rgba(255,82,82,0.1)", borderColor: "var(--red)", color: "var(--red)" }}>
            ▶ Watch Live Stream
          </button>
          <Link to="/schedule" className="btn btn-outline">📅 Schedule</Link>
        </div>
      </div>

      <AdBanner type="responsive" slot="1234567890" style={{ marginBottom: 32 }} />

      {/* Live Matches */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>
            <span className="pulse" style={{ color: "var(--red)" }}>●</span> Live Now
          </h2>
          <Link to="/live" style={{ color: "var(--green)", fontSize: 13 }}>View all →</Link>
        </div>
        {liveLoading ? <div className="spinner" /> : (
          liveMatches.length ? (
            <div className="grid-2">
              {liveMatches.map(m => <PlayMatchCard key={m.id} match={m} />)}
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", color: "var(--text2)", padding: 32 }}>
              No live matches right now •{" "}
              <Link to="/upcoming" style={{ color: "var(--green)" }}>See upcoming →</Link>
            </div>
          )
        )}
      </section>

      <AdBanner type="responsive" slot="1234567891" style={{ marginBottom: 40 }} />

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>📅 Upcoming</h2>
            <Link to="/upcoming" style={{ color: "var(--green)", fontSize: 13 }}>View all →</Link>
          </div>
          <div className="grid-2">
            {upcoming.map(m => <PlayMatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {/* Schedule */}
      {scheduleRows.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>🗓️ Today's Schedule</h2>
            <Link to="/schedule" style={{ color: "var(--green)", fontSize: 13 }}>Full schedule →</Link>
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            {scheduleRows.slice(0, 8).map((m, i) => (
              <ScheduleRow key={m.matchId || i} match={m} />
            ))}
          </div>
        </section>
      )}

      <AdBanner type="responsive" slot="1234567892" style={{ marginBottom: 40 }} />

      {/* Watch Live CTA */}
      <section style={{ marginBottom: 40 }}>
        <div onClick={() => navigate("/watch-live")} style={{
          background: "linear-gradient(135deg, #1a0000, #2d0000)",
          border: "1px solid rgba(255,82,82,0.3)", borderRadius: 16,
          padding: "32px 24px", cursor: "pointer", textAlign: "center",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,82,82,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
        >
          <div style={{ fontSize: 48, marginBottom: 8 }}>📡</div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--red)", marginBottom: 8 }}>
            Watch Live Cricket Stream
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 20, fontSize: 14 }}>
            Click to access live match streaming — free, no signup
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "var(--red)", color: "white", padding: "14px 32px",
            borderRadius: 10, fontWeight: 700, fontSize: 16
          }}>
            <span style={{ fontSize: 20 }}>▶</span> Click Here to Watch
          </div>
        </div>
      </section>

      <AdBanner type="responsive" slot="1234567893" style={{ marginBottom: 40 }} />

      {/* Quick Links */}
      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Quick Access</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 12 }}>
          {[
            { icon: "🏆", label: "Series", to: "/series" },
            { icon: "👥", label: "Teams", to: "/teams" },
            { icon: "🧑‍🤝‍🧑", label: "Players", to: "/players" },
            { icon: "📊", label: "Rankings", to: "/rankings" },
            { icon: "📈", label: "Stats", to: "/stats" },
            { icon: "📅", label: "Schedule", to: "/schedule" },
          ].map(q => (
            <Link key={q.to} to={q.to} style={{ textDecoration: "none" }}>
              <div className="card" style={{ textAlign: "center", padding: "20px 12px" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{q.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{q.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes glow-border { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}
