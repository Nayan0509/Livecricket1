import React from "react";
import { Link } from "react-router-dom";
import AdBanner from "./AdBanner";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", marginTop: 60, padding: "40px 0 20px" }}>
      {/* Leaderboard ad above footer links */}
      <div className="container" style={{ marginBottom: 32 }}>
        <AdBanner type="responsive" slot="1234567899" />
      </div>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🏏</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: "var(--green)" }}>CricketZone</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
              Your go-to destination for live cricket scores, news, and stats.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>Matches</div>
            {[["Live", "/live"], ["Upcoming", "/upcoming"], ["Results", "/results"], ["Schedule", "/schedule"]].map(([l, h]) => (
              <Link key={h} to={h} style={{ display: "block", color: "var(--text2)", fontSize: 13, marginBottom: 8 }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>Popular Leagues</div>
            {[
              ["IPL 2026", "/ipl"], 
              ["T20 World Cup", "/t20-world-cup"], 
              ["Asia Cup", "/asia-cup"], 
              ["Champions Trophy", "/champions-trophy"],
              ["PSL 2026", "/psl"],
              ["BBL", "/bbl"]
            ].map(([l, h]) => (
              <Link key={h} to={h} style={{ display: "block", color: "var(--text2)", fontSize: 13, marginBottom: 8 }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>Resources</div>
            {[["News", "/news"], ["Stats", "/stats"], ["Rankings", "/rankings"], ["About", "/about"]].map(([l, h]) => (
              <Link key={h} to={h} style={{ display: "block", color: "var(--text2)", fontSize: 13, marginBottom: 8 }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, textAlign: "center", fontSize: 12, color: "var(--text3)" }}>
          © 2026 <a href="https://www.livecricketzone.com" style={{ color: "var(--green)" }}>LiveCricketZone.com</a>. Enterprise Grade Independent Scraper Engine.
        </div>

      </div>
    </footer>
  );
}
