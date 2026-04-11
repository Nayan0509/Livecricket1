import React from "react";
import { Link } from "react-router-dom";
import AdBanner from "./AdBanner";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", marginTop: 60, padding: "40px 0 0" }}>
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
            {[["Live", "/live"], ["Watch Live", "/watch-live"], ["Upcoming", "/upcoming"], ["Results", "/results"], ["Schedule", "/schedule"]].map(([l, h]) => (
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

        {/* YouTube / Video Content Disclaimer */}
        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: 20, marginBottom: 0,
          background: "rgba(255,0,0,0.04)", borderRadius: "0 0 0 0",
          padding: "16px 0",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <rect width="20" height="15" rx="3.5" fill="#FF0000"/>
              <polygon points="8,4.5 8,10.5 14,7.5" fill="white"/>
            </svg>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                YouTube Video Content — Copyright Disclaimer
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>
                All videos displayed on this website are sourced from{" "}
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171", textDecoration: "none" }}>YouTube</a>{" "}
                and are the sole property of their respective owners, channels, and content creators. Live Cricket Zone does not host, upload, store, or claim ownership of any video content. Videos are embedded using YouTube's official{" "}
                <a href="https://developers.google.com/youtube/iframe_api_reference" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171", textDecoration: "none" }}>IFrame Embed API</a>{" "}
                in full compliance with{" "}
                <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171", textDecoration: "none" }}>YouTube's Terms of Service</a>{" "}
                and{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171", textDecoration: "none" }}>Google's Privacy Policy</a>.
                All trademarks, logos, and brand names belong to their respective owners. If you are a content owner and wish to have your video removed, please contact the respective YouTube channel directly or{" "}
                <a href="https://support.google.com/youtube/answer/2807622" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171", textDecoration: "none" }}>submit a copyright claim to YouTube</a>.
              </p>
            </div>
          </div>

          {/* Cricket data disclaimer */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🏏</span>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>
              Cricket scores and match data are sourced from publicly available information. Live Cricket Zone is an independent fan site and is not affiliated with, endorsed by, or officially connected to the ICC, BCCI, PCB, Cricket Australia, or any other cricket board or official body. All team names, logos, and tournament names are trademarks of their respective organizations.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid var(--border)", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>
            © {new Date().getFullYear()}{" "}
            <a href="https://www.livecricketzone.com" style={{ color: "var(--green)" }}>LiveCricketZone.com</a>
            {" "}— Independent Cricket Score Engine
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              ["Privacy Policy", "/about"],
              ["Terms of Use", "/about"],
              ["DMCA / Copyright", "/about"],
              ["Sitemap", "/sitemap.xml"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
