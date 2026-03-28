import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container" style={{ paddingBottom: 40, maxWidth: 800 }}>
      <h1 className="page-title">About CricLive</h1>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏏</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Your Live Cricket Hub</h2>
        <p style={{ color: "var(--text2)", lineHeight: 1.8, marginBottom: 16 }}>
          CricLive delivers real-time cricket scores, ball-by-ball commentary, match schedules,
          player stats, and the latest cricket news — all in one place.
        </p>
        <p style={{ color: "var(--text2)", lineHeight: 1.8 }}>
          Powered by <a href="https://cricketdata.org" target="_blank" rel="noreferrer" style={{ color: "var(--green)" }}>CricketData.org</a> (formerly CricAPI)
          and Cricbuzz data via RapidAPI, we bring you accurate, up-to-date cricket data 24/7.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Data Sources</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "CricketData.org", url: "https://cricketdata.org", desc: "Live scores, match info, scorecards, player stats, series data" },
            { name: "Cricbuzz via RapidAPI", url: "https://rapidapi.com/Creativesdev/api/free-cricbuzz-cricket-api", desc: "News, rankings, schedules" },
            { name: "YouTube IFrame API", url: "https://developers.google.com/youtube/iframe_api_reference", desc: "Free video embeds — no API key needed" },
          ].map(s => (
            <div key={s.name} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <a href={s.url} target="_blank" rel="noreferrer" style={{ color: "var(--green)", fontWeight: 600 }}>{s.name}</a>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Get Started</h3>
        <p style={{ color: "var(--text2)", marginBottom: 16, fontSize: 14 }}>
          To use live data, sign up for free API keys:
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="https://cricketdata.org" target="_blank" rel="noreferrer" className="btn btn-primary">
            Get CricketData Key (Free)
          </a>
          <a href="https://rapidapi.com/Creativesdev/api/free-cricbuzz-cricket-api" target="_blank" rel="noreferrer" className="btn btn-outline">
            Get RapidAPI Key (Free)
          </a>
        </div>
      </div>
    </div>
  );
}
