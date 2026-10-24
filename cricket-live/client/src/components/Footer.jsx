import React from "react";
import { Link } from "react-router-dom";
import { OPEN_COOKIE_SETTINGS } from "./CookieConsent";
import { EDITOR_NAME } from "../content/site";
import AdBanner from "./AdBanner";

export default function Footer() {
  return (
    <footer style={{
      background: "rgba(255,255,255,0.98)",
      borderTop: "1px solid rgba(11,99,196,0.1)",
      marginTop: 60,
    }}>
      {/* Ad above footer */}
      <div style={{ borderBottom: "1px solid rgba(15,23,42,0.04)", padding: "16px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <AdBanner type="leaderboard" />
        </div>
      </div>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "40px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 36 }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              {/* Same mark as the header logo (Navbar.jsx LogoMark) */}
              <svg width="32" height="32" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <circle cx="13" cy="13" r="12.5" fill="#0b7a55" />
                <rect x="8.6" y="8" width="1.6" height="10" rx="0.8" fill="#fff" />
                <rect x="12.2" y="8" width="1.6" height="10" rx="0.8" fill="#fff" />
                <rect x="15.8" y="8" width="1.6" height="10" rx="0.8" fill="#fff" />
                <rect x="8.4" y="6.6" width="9.2" height="1.1" rx="0.55" fill="#fff" />
              </svg>
              <div>
                <div style={{ fontWeight: 900, fontSize: 15, color: "var(--text)", lineHeight: 1 }}>
                  Live Cricket <span style={{ color: "#0b7a55" }}>Zone</span>
                </div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px", marginTop: 2 }}>SCORES · GUIDES · CALCULATORS</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.7, maxWidth: 200 }}>
              Live cricket scores and scorecards, plain-English guides to the rules, and free cricket calculators.
            </p>
          </div>

          {/* Matches */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 14, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "#0b7a55", display: "inline-block" }} />
              Matches
            </div>
            {[
              ["Live Scores",    "/live"],
              ["Highlights",     "/videos"],
              ["Upcoming",       "/upcoming"],
              ["Results",        "/results"],
              ["Schedule",       "/schedule"],
            ].map(([label, href]) => (
              <Link key={href} to={href} style={{ display: "block", color: "var(--text3)", fontSize: 13, marginBottom: 8, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#0b7a55"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; }}
              >{label}</Link>
            ))}
          </div>

          {/* Tournaments */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 14, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "#0b63c4", display: "inline-block" }} />
              Tournaments
            </div>
            {[
              ["IPL",                "/ipl"],
              ["T20 World Cup",       "/t20-world-cup"],
              ["County Championship", "/county-championship"],
              ["Asia Cup",            "/asia-cup"],
              ["Champions Trophy",    "/champions-trophy"],
              ["PSL",                 "/psl"],
              ["BBL",                 "/bbl"],
            ].map(([label, href]) => (
              <Link key={href} to={href} style={{ display: "block", color: "var(--text3)", fontSize: 13, marginBottom: 8, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#0b63c4"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; }}
              >{label}</Link>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 14, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 3, height: 12, borderRadius: 2, background: "#0b63c4", display: "inline-block" }} />
              Resources
            </div>
            {[
              ["Guides",           "/guides"],
              ["Calculators",      "/tools"],
              ["News",             "/news"],
              ["Games",            "/games"],
              ["ICC Rankings",     "/rankings"],
              ["Stats",            "/stats"],
              ["Players",          "/players"],
              ["Teams",            "/teams"],
              ["All Series",       "/series"],
              ["Editorial Policy", "/editorial-policy"],
              ["Contact Us",       "/contact"],
              ["About Us",         "/about"],
            ].map(([label, href]) => (
              <Link key={href} to={href} style={{ display: "block", color: "var(--text3)", fontSize: 13, marginBottom: 8, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text2)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text3)"; }}
              >{label}</Link>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ borderTop: "1px solid rgba(15,23,42,0.05)", padding: "20px 0 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
            <svg width="18" height="14" viewBox="0 0 20 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <rect width="20" height="15" rx="3.5" fill="#d1202a"/>
              <polygon points="8,4.5 8,10.5 14,7.5" fill="white"/>
            </svg>
            <p style={{ fontSize: 11, color: "rgba(15,23,42,0.35)", lineHeight: 1.7, margin: 0 }}>
              All videos displayed on this website are sourced from{" "}
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c81e28", textDecoration: "none" }}>YouTube</a>{" "}
              and are the sole property of their respective owners. Live Cricket Zone does not host, upload, store, or claim ownership of any video content. Videos are embedded using YouTube's official IFrame Embed API in full compliance with YouTube's Terms of Service. All trademarks, logos, and brand names belong to their respective owners.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}></span>
            <p style={{ fontSize: 11, color: "rgba(15,23,42,0.3)", lineHeight: 1.7, margin: 0 }}>
              Cricket scores and match data are sourced from publicly available information. Live Cricket Zone is an independent fan site and is not affiliated with, endorsed by, or officially connected to the ICC, BCCI, PCB, Cricket Australia, or any other cricket board. All team names, logos, and tournament names are trademarks of their respective organizations.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(15,23,42,0.05)", padding: "14px 0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            © {new Date().getFullYear()}{" "}
            <a href="https://www.livecricketzone.com" style={{ color: "#0b7a55", textDecoration: "none" }}>LiveCricketZone.com</a>
            {" "}· Owned and edited by {EDITOR_NAME}
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              ["About Us",          "/about"],
              ["Editorial Policy",  "/editorial-policy"],
              ["Contact Us",        "/contact"],
              ["Privacy Policy",    "/privacy-policy"],
              ["Terms of Use",      "/terms-of-use"],
              ["DMCA / Copyright",  "/dmca-copyright"],
            ].map(([label, href]) => (
              <Link key={label} to={href} style={{ fontSize: 11, color: "rgba(15,23,42,0.45)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#0b63c4"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(15,23,42,0.45)"; }}
              >{label}</Link>
            ))}
            <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}
              style={{ fontSize: 11, color: "rgba(15,23,42,0.45)", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
              Cookie settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
