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
  "name": "Live Cricket Matches - IPL 2026, T20 World Cup, ODI & Test",
  "sport": "Cricket",
  "url": "https://www.livecricketzone.com",
  "description": "Watch live cricket matches, get real-time scores, ball-by-ball commentary for IPL 2026, T20 World Cup, ODI and Test cricket",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://www.livecricketzone.com"
  },
  "organizer": {
    "@type": "Organization",
    "name": "Live Cricket Zone",
    "url": "https://www.livecricketzone.com"
  }
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
        title="Live Cricket Scores, IPL 2026, T20 World Cup & ODI Match Updates Today"
        description="Get live cricket scores, ball-by-ball commentary, IPL 2026 live updates, T20 World Cup, ODI & Test match scorecards, player statistics, ICC rankings 2026 and cricket news today on Live Cricket Zone. Watch live cricket streaming and get instant score updates."
        keywords="live cricket score, cricket live score today, IPL 2026 live score, T20 World Cup live, cricket scorecard, ball by ball cricket commentary, cricket news today, ICC rankings 2026, cricket schedule, cricket players stats, cricket match today live, live cricket streaming, cricket score update, cricket live match, ODI cricket live, Test cricket live"
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
          Live Cricket Scores • Ball-by-Ball Commentary • IPL 2026 • T20 World Cup • ODI & Test Updates
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

      {/* Popular Leagues & Tournaments */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>🏆 Popular Leagues & Tournaments</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <Link to="/ipl" className="card" style={{ padding: 16, textAlign: "center", background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", color: "white", border: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🏏</div>
            <div style={{ fontWeight: 700 }}>IPL 2026</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>Indian Premier League</div>
          </Link>
          <Link to="/t20-world-cup" className="card" style={{ padding: 16, textAlign: "center", background: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)", color: "white", border: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🌍</div>
            <div style={{ fontWeight: 700 }}>T20 World Cup</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>ICC T20 WC 2026</div>
          </Link>
          <Link to="/world-cup" className="card" style={{ padding: 16, textAlign: "center", background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)", color: "white", border: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🏆</div>
            <div style={{ fontWeight: 700 }}>World Cup</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>ODI World Cup</div>
          </Link>
          <Link to="/asia-cup" className="card" style={{ padding: 16, textAlign: "center", background: "linear-gradient(135deg, #F97316 0%, #DC2626 100%)", color: "white", border: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🌏</div>
            <div style={{ fontWeight: 700 }}>Asia Cup</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>Asia Cup 2026</div>
          </Link>
          <Link to="/champions-trophy" className="card" style={{ padding: 16, textAlign: "center", background: "linear-gradient(135deg, #14B8A6 0%, #0891B2 100%)", color: "white", border: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🏅</div>
            <div style={{ fontWeight: 700 }}>Champions Trophy</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>ICC CT 2026</div>
          </Link>
          <Link to="/womens-cricket" className="card" style={{ padding: 16, textAlign: "center", background: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)", color: "white", border: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>👩</div>
            <div style={{ fontWeight: 700 }}>Women's Cricket</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>All Women's Matches</div>
          </Link>
          <Link to="/psl" className="card" style={{ padding: 16, textAlign: "center", background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", color: "white", border: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🇵🇰</div>
            <div style={{ fontWeight: 700 }}>PSL</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>Pakistan Super League</div>
          </Link>
          <Link to="/bbl" className="card" style={{ padding: 16, textAlign: "center", background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", color: "white", border: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🇦🇺</div>
            <div style={{ fontWeight: 700 }}>BBL</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>Big Bash League</div>
          </Link>
          <Link to="/cpl" className="card" style={{ padding: 16, textAlign: "center", background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)", color: "white", border: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🏝️</div>
            <div style={{ fontWeight: 700 }}>CPL</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>Caribbean Premier League</div>
          </Link>
          <Link to="/bpl" className="card" style={{ padding: 16, textAlign: "center", background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", color: "white", border: "none" }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🇧🇩</div>
            <div style={{ fontWeight: 700 }}>BPL</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>Bangladesh Premier League</div>
          </Link>
        </div>
      </section>

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

      {/* SEO Content Section */}
      <section style={{ marginTop: 48, padding: "32px 24px", background: "var(--bg2)", borderRadius: 12, border: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "var(--green)" }}>
          Live Cricket Zone - Your Ultimate Cricket Destination
        </h2>
        <div style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 15 }}>
          <p style={{ marginBottom: 16 }}>
            Welcome to <strong>Live Cricket Zone</strong>, your premier destination for <strong>live cricket scores</strong>, 
            real-time ball-by-ball commentary, and comprehensive cricket coverage. Stay updated with <strong>IPL 2026 live scores</strong>, 
            <strong>T20 World Cup</strong> updates, ODI matches, and Test cricket from around the world.
          </p>
          <p style={{ marginBottom: 16 }}>
            Our platform provides instant <strong>cricket score updates</strong>, detailed scorecards, player statistics, 
            <strong>ICC rankings 2026</strong>, team standings, and the latest cricket news. Whether you're following the 
            Indian Premier League, international tournaments, or bilateral series, we've got you covered with live streaming 
            links and match highlights.
          </p>
          <p style={{ marginBottom: 16 }}>
            Get access to comprehensive <strong>cricket player stats</strong>, career records, match schedules, upcoming fixtures, 
            results, and in-depth analysis. Follow your favorite teams and players with our detailed profiles, rankings, and 
            performance metrics. Experience cricket like never before with our user-friendly interface and real-time updates.
          </p>
          <div style={{ marginTop: 20, padding: "16px", background: "var(--bg3)", borderRadius: 8, borderLeft: "4px solid var(--green)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "var(--green)" }}>
              Key Features:
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>🔴 Live cricket scores with ball-by-ball commentary</li>
              <li style={{ marginBottom: 8 }}>🏏 IPL 2026 live updates and scorecards</li>
              <li style={{ marginBottom: 8 }}>🌍 T20 World Cup, ODI & Test match coverage</li>
              <li style={{ marginBottom: 8 }}>📊 ICC rankings 2026 and player statistics</li>
              <li style={{ marginBottom: 8 }}>📅 Complete cricket schedule and fixtures</li>
              <li style={{ marginBottom: 8 }}>📺 Live cricket streaming links</li>
              <li style={{ marginBottom: 8 }}>📰 Latest cricket news and updates</li>
              <li style={{ marginBottom: 8 }}>🏆 Team and player profiles with career records</li>
            </ul>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes glow-border { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}
