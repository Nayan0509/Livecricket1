import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeamDetail, fetchPlayers } from "../api";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("squad");

  const { data: teamData, isLoading: teamLoading } = useQuery({
    queryKey: ["team", id],
    queryFn: () => fetchTeamDetail(id),
  });

  const team = teamData?.data;

  const { data: playersData, isLoading: playersLoading } = useQuery({
    queryKey: ["players", team?.name],
    queryFn: () => fetchPlayers(team?.name || "india"),
    enabled: !!team?.name,
  });

  const players = playersData?.data || [];

  if (teamLoading) return <div className="container" style={{ textAlign: "center", paddingTop: 100 }}><div className="spinner" /></div>;
  if (!team) return <div className="container" style={{ textAlign: "center", paddingTop: 60 }}><p>Team not found.</p><button onClick={() => navigate("/teams")} className="btn">Back to Teams</button></div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title={`${team.name} Cricket Team Profile — Squad, Schedule & Stats`}
        description={`Full profile of the ${team.name} cricket team. Latest squad, upcoming match schedule, and player statistics on Live Cricket Zone.`}
        url={`/teams/${id}`}
      />

      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", padding: "16px 0", fontSize: 13, fontWeight: 600 }}>← Back</button>

      {/* Hero */}
      <div style={{
        padding: "32px 40px", borderRadius: 24, marginBottom: 24,
        background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(9,9,11,1) 100%)",
        border: "1px solid rgba(16,185,129,0.2)",
        display: "flex", alignItems: "center", gap: 32,
      }}>
        {team.img ? (
          <img src={team.img} alt={team.name} style={{ width: 100, height: 100, borderRadius: "50%", border: "4px solid rgba(16,185,129,0.3)", objectFit: "cover" }} />
        ) : (
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "4px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🏏</div>
        )}
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "var(--text)", margin: "0 0 4px" }}>{team.name}</h1>
          <div style={{ fontSize: 14, color: "var(--text3)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{team.shortname} — Cricket Team</div>
        </div>
      </div>

      <AdBanner type="leaderboard" />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 32, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 24 }}>
        {["squad", "schedule"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "12px 4px", background: "none", border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: tab === t ? 800 : 500,
              color: tab === t ? "#10B981" : "var(--text3)",
              borderBottom: tab === t ? "3px solid #10B981" : "3px solid transparent",
              textTransform: "uppercase", letterSpacing: 1, transition: "all 0.2s",
            }}
          >{t}</button>
        ))}
      </div>

      {tab === "squad" && (
        <div className="animate-fade-in">
          {playersLoading ? <div className="spinner" /> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {players.map(p => (
                <Link key={p.id} to={`/players/${p.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 16,
                    transition: "transform 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#10B981" }}>
                      {p.name?.[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text3)" }}>{p.role || "Player"}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "schedule" && (
        <div className="animate-fade-in">
          <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", background: "rgba(255,255,255,0.01)" }}>
            {team.schedule?.map((m, i) => (
              <Link key={m.id} to={`/match/${m.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "18px 24px", borderBottom: i < team.schedule.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#10B981", marginBottom: 4 }}>{m.date}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>{m.series} • {m.venue}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", background: "rgba(245,158,11,0.1)", padding: "4px 12px", borderRadius: 100 }}>{m.status}</div>
                </div>
              </Link>
            ))}
            {(!team.schedule || team.schedule.length === 0) && (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text3)" }}>No upcoming fixtures scheduled.</div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: 40 }}><AdBanner type="auto" /></div>
    </div>
  );
}
