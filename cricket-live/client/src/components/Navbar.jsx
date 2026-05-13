import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const PRIMARY_NAV = [
  { to: "/live",       label: "Live"      },
  { to: "/watch-live", label: "Watch"     },
  { to: "/news",       label: "News"      },
  { to: "/rankings",   label: "Rankings"  },
  { to: "/series",     label: "Series"    },
  { to: "/teams",      label: "Teams"     },
];

const LEAGUES = [
  { to: "/ipl",                 label: "IPL 2026",            dot: "#F59E0B" },
  { to: "/t20-world-cup",       label: "T20 World Cup",       dot: "#EF4444" },
  { to: "/world-cup",           label: "ODI World Cup",       dot: "#10B981" },
  { to: "/asia-cup",            label: "Asia Cup",            dot: "#38BDF8" },
  { to: "/champions-trophy",    label: "Champions Trophy",    dot: "#A78BFA" },
  { to: "/psl",                 label: "PSL 2026",            dot: "#34D399" },
  { to: "/county-championship", label: "County Championship", dot: "#F97316" },
];

/* ── Premium cricket logo mark ── */
function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="13" cy="13" r="12" fill="#0D1120" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
      <circle cx="13" cy="13" r="8" fill="#10B981" opacity="0.15" />
      {/* Cricket wickets */}
      <rect x="10" y="7" width="1.5" height="9" rx="0.75" fill="#10B981" />
      <rect x="13.25" y="7" width="1.5" height="9" rx="0.75" fill="#10B981" />
      {/* Bail */}
      <rect x="9.5" y="7" width="7" height="1.2" rx="0.6" fill="#F59E0B" />
      <rect x="9.5" y="16" width="7" height="1.2" rx="0.6" fill="rgba(255,255,255,0.18)" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen]               = useState(false);
  const [showLeagues, setShowLeagues] = useState(false);
  const [search, setSearch]           = useState("");
  const [scrolled, setScrolled]       = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/players?search=${encodeURIComponent(search)}`);
      setSearch("");
      setOpen(false);
    }
  };

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "sticky", top: 0, zIndex: 1000,
          background: scrolled ? "rgba(8,12,20,0.96)" : "var(--bg)",
          backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
          borderBottom: "1px solid var(--border)",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.4)" : "none",
          transition: "background 0.25s cubic-bezier(0.2,0,0,1), box-shadow 0.25s cubic-bezier(0.2,0,0,1)",
        }}
      >
        {/* Subtle emerald accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "#10B981",
          opacity: 0.55,
        }} />

        <div
          className="container"
          style={{ display: "flex", alignItems: "center", height: 60, gap: 8 }}
        >
          {/* ── Brand Logo ── */}
          <Link
            to="/"
            style={{
              display: "flex", alignItems: "center", gap: 9,
              marginRight: 24, flexShrink: 0, textDecoration: "none",
            }}
            aria-label="Live Cricket Zone Home"
          >
            <LogoMark />
            <div style={{ lineHeight: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{
                  fontWeight: 700, fontSize: 15,
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  color: "#F1F5F9", letterSpacing: "-0.025em",
                }}>
                  LiveCricket
                </span>
                <span style={{
                  fontWeight: 700, fontSize: 15,
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  color: "#10B981", letterSpacing: "-0.025em",
                }}>
                  Zone
                </span>
              </div>
              <div style={{
                fontSize: 9, fontWeight: 500, color: "var(--text-muted)",
                letterSpacing: "1px", textTransform: "uppercase", marginTop: 2,
              }}>
                Live Scores · News · Streams
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            {PRIMARY_NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                style={({ isActive }) => ({
                  padding: "6px 13px",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#F1F5F9" : "var(--text2)",
                  background: "transparent",
                  transition: "color 0.15s",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.01em",
                  display: "flex",
                  alignItems: "center",
                  textDecoration: isActive ? "underline" : "none",
                  textDecorationColor: "#10B981",
                  textUnderlineOffset: "5px",
                  textDecorationThickness: "2px",
                })}
                onMouseEnter={e => { e.currentTarget.style.color = "#F1F5F9"; }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "";
                }}
              >
                {n.label}
              </NavLink>
            ))}

            {/* ── Leagues Dropdown ── */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setShowLeagues(true)}
              onMouseLeave={() => setShowLeagues(false)}
            >
              <button style={{
                padding: "6px 13px",
                fontSize: 13,
                fontWeight: 400,
                color: showLeagues ? "#F1F5F9" : "var(--text2)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "color 0.15s",
                fontFamily: "'Inter', sans-serif",
              }}>
                Leagues
                <svg
                  width="9" height="9" viewBox="0 0 10 10" fill="currentColor"
                  style={{ transition: "transform 0.18s", transform: showLeagues ? "rotate(180deg)" : "rotate(0)", marginTop: 1 }}
                >
                  <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Hover bridge */}
              {showLeagues && (
                <div style={{ position: "absolute", top: "100%", left: 0, width: "100%", height: 8 }} />
              )}

              {/* Dropdown panel */}
              <div style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                width: 224,
                borderRadius: 12,
                background: "#0C1221",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)",
                padding: "6px",
                opacity: showLeagues ? 1 : 0,
                transform: showLeagues ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.97)",
                pointerEvents: showLeagues ? "all" : "none",
                transition: "opacity 0.15s cubic-bezier(0.2,0,0,1), transform 0.15s cubic-bezier(0.2,0,0,1)",
                zIndex: 100,
              }}>
                <div style={{
                  padding: "5px 12px 8px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  marginBottom: 4,
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: "var(--text-muted)",
                    letterSpacing: "1.2px", textTransform: "uppercase",
                  }}>
                    Leagues & Tournaments
                  </span>
                </div>
                {LEAGUES.map(l => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setShowLeagues(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 400,
                      color: "var(--text2)",
                      transition: "background 0.12s, color 0.12s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.045)";
                      e.currentTarget.style.color = "#F1F5F9";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text2)";
                    }}
                  >
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: l.dot, flexShrink: 0, opacity: 0.85,
                    }} />
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Search Bar ── */}
          <form
            onSubmit={handleSearch}
            className="desktop-nav"
            style={{ position: "relative", flexShrink: 0 }}
          >
            <div style={{
              position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
              color: "var(--text3)", pointerEvents: "none",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search players or teams…"
              aria-label="Search players or teams"
              style={{
                width: 240,
                padding: "8px 14px 8px 33px",
                fontSize: 13,
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "var(--text)",
                outline: "none",
                transition: "all 0.18s cubic-bezier(0.2,0,0,1)",
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={e => {
                e.target.style.background = "rgba(255,255,255,0.07)";
                e.target.style.borderColor = "rgba(16,185,129,0.45)";
                e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.08)";
              }}
              onBlur={e => {
                e.target.style.background = "rgba(255,255,255,0.04)";
                e.target.style.borderColor = "rgba(255,255,255,0.09)";
                e.target.style.boxShadow = "none";
              }}
            />
          </form>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setOpen(!open)}
            className="mobile-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              display: "none",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text2)",
              borderRadius: 8,
              width: 36, height: 36,
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            {open ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <div style={{
          overflow: "hidden",
          maxHeight: open ? "700px" : "0",
          transition: "max-height 0.30s cubic-bezier(0.2,0,0,1)",
          background: "rgba(8,12,20,0.99)",
          borderTop: open ? "1px solid var(--border)" : "none",
        }}>
          <div style={{ padding: "12px 16px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Primary nav */}
            <div style={{ marginBottom: 6 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, color: "var(--text-muted)",
                letterSpacing: "1.2px", textTransform: "uppercase", padding: "4px 10px 8px",
              }}>
                Navigation
              </div>
              {PRIMARY_NAV.map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    color: "var(--text2)",
                    fontWeight: 400,
                    fontSize: 15,
                    transition: "background 0.12s, color 0.12s",
                    display: "block",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#F1F5F9"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
                >
                  {n.label}
                </Link>
              ))}
            </div>

            {/* Leagues */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginBottom: 6 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, color: "var(--text-muted)",
                letterSpacing: "1.2px", textTransform: "uppercase", padding: "0 10px 8px",
              }}>
                Leagues
              </div>
              {LEAGUES.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "9px 12px",
                    borderRadius: 8,
                    color: "var(--text2)",
                    fontWeight: 400,
                    fontSize: 14,
                    transition: "background 0.12s, color 0.12s",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#F1F5F9"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: l.dot, flexShrink: 0, opacity: 0.8 }} />
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Mobile search */}
            <form onSubmit={handleSearch} style={{ position: "relative", marginTop: 4 }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search players or teams…"
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 36px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: 14,
                  fontFamily: "'Inter', sans-serif",
                  outline: "none",
                }}
              />
            </form>
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
