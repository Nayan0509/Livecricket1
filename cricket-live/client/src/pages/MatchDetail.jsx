import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMatchInfo } from "../api";
import VideoPlayer from "../components/VideoPlayer";
import AdBanner from "../components/AdBanner";

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("info");

  const { data, isLoading, error } = useQuery({
    queryKey: ["matchInfo", id],
    queryFn: () => fetchMatchInfo(id),
  });

  // CricketData.org match_info: { data: {id, name, matchType, status, venue, date, dateTimeGMT,
  //   teams, teamInfo:[{name,shortname,img}], score:[{r,w,o,inning}],
  //   tossWinner, tossChoice, series_id, matchStarted, matchEnded} }
  const match = data?.data;

  if (isLoading) return <div className="container"><div className="spinner" /></div>;
  if (error || !match) return (
    <div className="container">
      <div className="error-box">Match not found — {error?.message}</div>
    </div>
  );

  const isLive = match.matchStarted && !match.matchEnded;

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: 16, fontSize: 13 }}>← Back</button>

      {/* Match Header */}
      <div className="card" style={{ marginBottom: 20, background: "linear-gradient(135deg, var(--bg3), var(--card))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 4, textTransform: "uppercase" }}>
              {match.matchType} • {match.series_id?.slice(0, 8)}
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.3 }}>{match.name}</h1>
          </div>
          {isLive && <span className="badge badge-live"><span className="pulse">●</span> LIVE</span>}
          {match.matchEnded && <span className="badge badge-completed">Completed</span>}
        </div>

        {/* Team flags */}
        <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
          {match.teamInfo?.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {t.img && <img src={t.img} alt={t.shortname} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />}
              <span style={{ fontWeight: 700 }}>{t.name}</span>
            </div>
          ))}
        </div>

        {/* Scores */}
        {match.score?.map((s, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 0", borderBottom: "1px solid var(--border)"
          }}>
            <span style={{ color: "var(--text2)", fontSize: 14 }}>{s.inning}</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: "var(--green)" }}>
              {s.r}/{s.w} <span style={{ fontSize: 13, color: "var(--text2)" }}>({s.o} ov)</span>
            </span>
          </div>
        ))}

        <div style={{ marginTop: 12, fontSize: 14, color: isLive ? "var(--red)" : "var(--text2)", fontWeight: 500 }}>
          {match.status}
        </div>
      </div>

      {/* Tabs */}
      <AdBanner type="responsive" slot="1234567896" style={{ marginBottom: 20 }} />
      <div className="tab-bar">
        {[["info","📋 Info"], ["scorecard","📊 Scorecard"], ["videos","📺 Videos"]].map(([t, l]) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "info" && (
        <div className="card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {[
              ["📅 Date", match.date],
              ["⏰ Time (GMT)", match.dateTimeGMT?.split("T")[1]?.slice(0,5)],
              ["📍 Venue", match.venue],
              ["🏏 Format", match.matchType?.toUpperCase()],
              ["🪙 Toss", match.tossWinner ? `${match.tossWinner} won, chose to ${match.tossChoice}` : "TBD"],
              ["🏆 Series", match.series_id || "N/A"],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>{k}</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{v || "N/A"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "scorecard" && (
        <div style={{ textAlign: "center", padding: 20 }}>
          <Link to={`/match/${id}/scorecard`} className="btn btn-primary">View Full Scorecard</Link>
        </div>
      )}

      {tab === "videos" && (
        <div>
          <p style={{ color: "var(--text2)", marginBottom: 16, fontSize: 14 }}>Highlights for this match</p>
          <VideoPlayer videoId="Yd4XBXqFLAY" title={`${match.name} — Highlights`} />
        </div>
      )}
    </div>
  );
}
