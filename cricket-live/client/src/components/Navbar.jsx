import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const PRIMARY_NAV = [
  { to: "/live",       label: "Live"       },
  { to: "/watch-live", label: "Highlights" },
  { to: "/news",       label: "News"       },
  { to: "/rankings",   label: "Rankings"  },
  { to: "/series",     label: "Series"    },
  { to: "/stats",      label: "Stats"     },
  { to: "/teams",      label: "Teams"     },
  { to: "/fantasy",    label: "Fantasy"   },
];

const SPORTS = [
  { to: "/football",   label: "Football",   dot: "#39FF14" },
  { to: "/basketball",  label: "Basketball", dot: "#FF6B00" },
  { to: "/tennis",      label: "Tennis",     dot: "#FFEA00" },
];

const LEAGUES = [
  { to: "/ipl",                 label: "IPL 2026",            dot: "#00F0FF" },
  { to: "/t20-world-cup",       label: "T20 World Cup",       dot: "#FF1053" },
  { to: "/world-cup",           label: "ODI World Cup",       dot: "#B026FF" },
  { to: "/asia-cup",            label: "Asia Cup",            dot: "#00F0FF" },
  { to: "/champions-trophy",    label: "Champions Trophy",    dot: "#FF2E9A" },
  { to: "/psl",                 label: "PSL 2026",            dot: "#D896FF" },
  { to: "/county-championship", label: "County Championship", dot: "#00B8D9" },
];

/* ── Premium cricket logo mark ── */
function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="13" cy="13" r="12" fill="#0D1120" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
      <circle cx="13" cy="13" r="8" fill="#B026FF" opacity="0.15" />
      {/* Cricket wickets */}
      <rect x="10" y="7" width="1.5" height="9" rx="0.75" fill="#B026FF" />
      <rect x="13.25" y="7" width="1.5" height="9" rx="0.75" fill="#B026FF" />
      {/* Bail */}
      <rect x="9.5" y="7" width="7" height="1.2" rx="0.6" fill="#00F0FF" />
      <rect x="9.5" y="16" width="7" height="1.2" rx="0.6" fill="rgba(255,255,255,0.18)" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen]               = useState(false);
  const [showLeagues, setShowLeagues] = useState(false);
  const [showSports, setShowSports]   = useState(false);
  const [showMore, setShowMore]       = useState(false);
  const [search, setSearch]           = useState("");
  const [scrolled, setScrolled]       = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
          background: "#B026FF",
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
            <motion.div
              animate={{ filter: [
                "drop-shadow(0 0 4px rgba(176,38,255,0.5))",
                "drop-shadow(0 0 12px rgba(0,240,255,0.7))",
                "drop-shadow(0 0 4px rgba(176,38,255,0.5))",
              ] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <LogoMark />
            </motion.div>
            <div style={{ lineHeight: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span className="font-display" style={{
                  fontWeight: 700, fontSize: 15,
                  color: "#F5F0FF", letterSpacing: "-0.01em",
                }}>
                  LiveCricket
                </span>
                <span className="neon-text font-display" style={{
                  fontWeight: 800, fontSize: 15,
                  letterSpacing: "-0.01em",
                }}>
                  Zone
                </span>
              </div>
              <div className="font-hud" style={{
                fontSize: 9, fontWeight: 600, color: "var(--text-muted)",
                letterSpacing: "1.2px", textTransform: "uppercase", marginTop: 2,
              }}>
                Live Scores · News · Highlights
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            {PRIMARY_NAV.map(n => {
              const isActive = location.pathname === n.to || location.pathname.startsWith(n.to + "/");
              return (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className="font-hud"
                  style={{
                    position: "relative",
                    padding: "6px 13px",
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#F5F0FF" : "var(--text2)",
                    background: "transparent",
                    transition: "color 0.15s",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#F5F0FF"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ""; }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      style={{
                        position: "absolute", inset: "2px 2px",
                        borderRadius: 8,
                        background: "linear-gradient(135deg, rgba(255,46,154,0.16), rgba(176,38,255,0.16))",
                        border: "1px solid rgba(0,240,255,0.30)",
                        boxShadow: "0 0 14px rgba(255,46,154,0.30)",
                      }}
                    />
                  )}
                  <span style={{ position: "relative" }}>{n.label}</span>
                </NavLink>
              );
            })}

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

            {/* ── Sports Dropdown ── */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setShowSports(true)}
              onMouseLeave={() => setShowSports(false)}
            >
              <button style={{
                padding: "6px 13px",
                fontSize: 13,
                fontWeight: 400,
                color: showSports ? "#F1F5F9" : "var(--text2)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "color 0.15s",
                fontFamily: "'Inter', sans-serif",
              }}>
                Sports
                <svg
                  width="9" height="9" viewBox="0 0 10 10" fill="currentColor"
                  style={{ transition: "transform 0.18s", transform: showSports ? "rotate(180deg)" : "rotate(0)", marginTop: 1 }}
                >
                  <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {showSports && (
                <div style={{ position: "absolute", top: "100%", left: 0, width: "100%", height: 8 }} />
              )}

              <div style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                width: 180,
                borderRadius: 12,
                background: "#0C1221",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)",
                padding: "6px",
                opacity: showSports ? 1 : 0,
                transform: showSports ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.97)",
                pointerEvents: showSports ? "all" : "none",
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
                    Other Sports
                  </span>
                </div>
                {SPORTS.map(s => (
                  <Link
                    key={s.to}
                    to={s.to}
                    onClick={() => setShowSports(false)}
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
                      background: s.dot, flexShrink: 0, opacity: 0.85,
                    }} />
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── More Dropdown ── */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setShowMore(true)}
              onMouseLeave={() => setShowMore(false)}
            >
              <button style={{
                padding: "6px 13px", fontSize: 13, fontWeight: 400,
                color: showMore ? "#F1F5F9" : "var(--text2)",
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5,
                transition: "color 0.15s", fontFamily: "'Inter', sans-serif",
              }}>
                More
                <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor"
                  style={{ transition: "transform 0.18s", transform: showMore ? "rotate(180deg)" : "rotate(0)", marginTop: 1 }}>
                  <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {showMore && <div style={{ position: "absolute", top: "100%", left: 0, width: "100%", height: 8 }} />}

              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, width: 200,
                borderRadius: 12, background: "#0C1221",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.65)",
                padding: "6px",
                opacity: showMore ? 1 : 0,
                transform: showMore ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.97)",
                pointerEvents: showMore ? "all" : "none",
                transition: "opacity 0.15s cubic-bezier(0.2,0,0,1), transform 0.15s cubic-bezier(0.2,0,0,1)",
                zIndex: 100,
              }}>
                <div style={{ padding: "5px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1.2px", textTransform: "uppercase" }}>More Sections</span>
                </div>
                {[
                  { to: "/schedule",      label: "Schedule",     dot: "#D896FF" },
                  { to: "/results",       label: "Results",      dot: "#39FF14" },
                  { to: "/players",       label: "Players",      dot: "#FFEA00" },
                  { to: "/videos",        label: "Videos",       dot: "#FF5C8A" },
                  { to: "/about",         label: "About",        dot: "#FF2E9A" },
                ].map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setShowMore(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, fontSize: 13, fontWeight: 400, color: "var(--text2)", transition: "background 0.12s, color 0.12s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.045)"; e.currentTarget.style.color = "#F1F5F9"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: l.dot, flexShrink: 0, opacity: 0.85 }} />
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
                e.target.style.borderColor = "rgba(59,130,246,0.45)";
                e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.08)";
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

            {/* Sports */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginBottom: 6 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, color: "var(--text-muted)",
                letterSpacing: "1.2px", textTransform: "uppercase", padding: "0 10px 8px",
              }}>
                Other Sports
              </div>
              {SPORTS.map(s => (
                <Link
                  key={s.to}
                  to={s.to}
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
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0, opacity: 0.8 }} />
                  {s.label}
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
