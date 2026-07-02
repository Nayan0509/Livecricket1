import React from "react";
import { Link } from "react-router-dom";
import AdBanner from "./AdBanner";

export default function Footer() {
  return (
    <footer style={{
      background: "rgba(9,9,11,0.98)",
      borderTop: "1px solid rgba(59,130,246,0.1)",
      marginTop: 60,
    }}>
      {/* Ad above footer */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "16px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <AdBanner type="leaderboard" />
        </div>
      </div>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "40px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 36 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg,#2563EB,#3B82F6)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.5"/>
                  <path d="M5 12 Q8 8 12 12 Q16 16 19 12" stroke="#fff" strokeWidth="1.5" fill="none"/>
                  <path d="M12 3 Q16 8 12 12 Q8 16 12 21" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 15, color: "#fff", lineHeight: 1 }}>
                  Live Cricket <span style={{ color: "#3B82F6" }}>Zone</span>
                </div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px", marginTop: 2 }}>LIVE SCORES · NEWS · HIGHLIGHTS</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.7, maxWidth: 200 }}>
              Fast live cricket scores, IPL 2026 points table, ball-by-ball commentary and official match highlights.
            </p>
          </div>

          {/* Matches */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 14, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "#3B82F6", display: "inline-block" }} />
              Matches
            </div>
            {[
              ["Live Scores",    "/live"],
              ["Highlights",     "/watch-live"],
              ["Upcoming",       "/upcoming"],
              ["Results",        "/results"],
              ["Schedule",       "/schedule"],
            ].map(([label, href]) => (
              <Link key={href} to={href} style={{ display: "block", color: "var(--text3)", fontSize: 13, marginBottom: 8, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#3B82F6"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; }}
              >{label}</Link>
            ))}
          </div>

          {/* Tournaments */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 14, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "#38BDF8", display: "inline-block" }} />
              Tournaments
            </div>
            {[
              ["IPL 2026",           "/ipl"],
              ["T20 World Cup",       "/t20-world-cup"],
              ["County Championship", "/county-championship"],
              ["Asia Cup",            "/asia-cup"],
              ["Champions Trophy",    "/champions-trophy"],
              ["PSL 2026",            "/psl"],
              ["BBL",                 "/bbl"],
            ].map(([label, href]) => (
              <Link key={href} to={href} style={{ display: "block", color: "var(--text3)", fontSize: 13, marginBottom: 8, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#38BDF8"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; }}
              >{label}</Link>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 14, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "#38BDF8", display: "inline-block" }} />
              Resources
            </div>
            {[
              ["News",        "/news"],
              ["ICC Rankings","/rankings"],
              ["Stats",       "/stats"],
              ["Players",     "/players"],
              ["Teams",       "/teams"],
              ["All Series",  "/series"],
              ["About Us",    "/about"],
            ].map(([label, href]) => (
              <Link key={href} to={href} style={{ display: "block", color: "var(--text3)", fontSize: 13, marginBottom: 8, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text2)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; }}
              >{label}</Link>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "20px 0 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
            <svg width="18" height="14" viewBox="0 0 20 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <rect width="20" height="15" rx="3.5" fill="#FF0000"/>
              <polygon points="8,4.5 8,10.5 14,7.5" fill="white"/>
            </svg>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, margin: 0 }}>
              All videos displayed on this website are sourced from{" "}
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: "#f87171", textDecoration: "none" }}>YouTube</a>{" "}
              and are the sole property of their respective owners. Live Cricket Zone does not host, upload, store, or claim ownership of any video content. Videos are embedded using YouTube's official IFrame Embed API in full compliance with YouTube's Terms of Service. All trademarks, logos, and brand names belong to their respective owners.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🏏</span>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, margin: 0 }}>
              Cricket scores and match data are sourced from publicly available information. Live Cricket Zone is an independent fan site and is not affiliated with, endorsed by, or officially connected to the ICC, BCCI, PCB, Cricket Australia, or any other cricket board. All team names, logos, and tournament names are trademarks of their respective organizations.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "14px 0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            © {new Date().getFullYear()}{" "}
            <a href="https://www.livecricketzone.com" style={{ color: "#3B82F6", textDecoration: "none" }}>LiveCricketZone.com</a>
            {" "}— Independent Cricket Score Engine
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              ["Privacy Policy",   "/privacy-policy"],
              ["Terms of Use",     "/terms-of-use"],
              ["DMCA / Copyright", "/dmca-copyright"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.28)"; }}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
