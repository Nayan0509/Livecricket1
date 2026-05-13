import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const PRIMARY_NAV = [
  { to: "/live",       label: "Live",       icon: "🔴" },
  { to: "/watch-live", label: "Watch",      icon: "📺" },
  { to: "/news",       label: "News",       icon: "📰" },
  { to: "/rankings",   label: "Rankings",   icon: "📊" },
  { to: "/series",     label: "Series",     icon: "🏆" },
  { to: "/teams",      label: "Teams",      icon: "👥" },
];

const LEAGUES = [
  { to: "/ipl",               label: "IPL 2026",            dot: "#F59E0B" },
  { to: "/t20-world-cup",     label: "T20 World Cup",       dot: "#EF4444" },
  { to: "/world-cup",         label: "ODI World Cup",       dot: "#22C55E" },
  { to: "/asia-cup",          label: "Asia Cup",            dot: "#38BDF8" },
  { to: "/champions-trophy",  label: "Champions Trophy",    dot: "#A78BFA" },
  { to: "/psl",               label: "PSL 2026",            dot: "#10B981" },
  { to: "/county-championship", label: "County Championship", dot: "#F97316" },
];

function CricketBallIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="14" cy="14" r="13" fill="#22C55E" />
      <circle cx="14" cy="14" r="13" fill="url(#ballGrad)" />
      {/* Seam lines */}
      <path d="M7 14 Q10 9 14 9 Q18 9 21 14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M7 14 Q10 19 14 19 Q18 19 21 14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <defs>
        <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#15803D" />
        </radialGradient>
      </defs>
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
    const onScroll = () => setScrolled(window.scrollY > 10);
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
          background: scrolled ? "rgba(9,9,11,0.92)" : "var(--bg)",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(34,197,94,0.12)"
            : "1px solid rgba(255,255,255,0.04)",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.5)" : "none",
          transition: "all 0.3s cubic-bezier(0.2,0,0,1)",
        }}
      >
        {/* Brand accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, #16A34A 0%, #22C55E 40%, #F59E0B 100%)",
          opacity: scrolled ? 1 : 0.6,
          transition: "opacity 0.3s",
        }} />

        <div
          className="container"
          style={{ display: "flex", alignItems: "center", height: 60, gap: 12 }}
        >
          {/* ── Brand Logo ── */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 20, flexShrink: 0, textDecoration: "none" }}
            aria-label="Live Cricket Zone Home"
          >
            <CricketBallIcon />
            <div style={{ lineHeight: 1, fontFamily: "'Poppins', sans-serif" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
                <span style={{ fontWeight: 800, fontSize: 17, color: "#F4F4F5", letterSpacing: "-0.03em" }}>
                  Live Cricket
                </span>
                <span style={{
                  fontWeight: 900, fontSize: 17, letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #22C55E, #4ADE80)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginLeft: 4,
                }}>
                  Zone
                </span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(34,197,94,0.7)", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 1 }}>
                Live Scores · News · Streams
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            {PRIMARY_NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                style={({ isActive }) => ({
                  padding: "7px 14px",
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#22C55E" : "var(--text2)",
                  background: isActive ? "rgba(34,197,94,0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent",
                  transition: "all 0.2s cubic-bezier(0.2,0,0,1)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.01em",
                })}
                onMouseEnter={e => {
                  if (!e.currentTarget.style.color.includes("34,197")) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "var(--text)";
                  }
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.style.color.includes("34,197")) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text2)";
                  }
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
                padding: "7px 14px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                color: showLeagues ? "#22C55E" : "var(--text2)",
                background: showLeagues ? "rgba(34,197,94,0.1)" : "transparent",
                border: showLeagues ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
                fontFamily: "'Inter', sans-serif",
              }}>
                Leagues
                <svg
                  width="10" height="10" viewBox="0 0 10 10" fill="currentColor"
                  style={{ transition: "transform 0.2s", transform: showLeagues ? "rotate(180deg)" : "rotate(0)" }}
                >
                  <path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Bridge to prevent gap-flicker */}
              {showLeagues && (
                <div style={{ position: "absolute", top: "100%", left: 0, width: "100%", height: 10 }} />
              )}

              <div style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                width: 220,
                borderRadius: 16,
                background: "linear-gradient(145deg, #151519, #101014)",
                border: "1px solid rgba(34,197,94,0.12)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                padding: "6px",
                opacity: showLeagues ? 1 : 0,
                transform: showLeagues ? "translateY(0) scale(1)" : "translateY(-6px) scale(0.97)",
                pointerEvents: showLeagues ? "all" : "none",
                transition: "opacity 0.18s cubic-bezier(0.2,0,0,1), transform 0.18s cubic-bezier(0.2,0,0,1)",
                zIndex: 100,
              }}>
                {/* Dropdown header */}
                <div style={{ padding: "6px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Leagues & Tournaments</span>
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
                      padding: "9px 12px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text2)",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "rgba(34,197,94,0.07)";
                      e.currentTarget.style.color = "#22C55E";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text2)";
                    }}
                  >
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: l.dot,
                      boxShadow: `0 0 6px ${l.dot}80`,
                      flexShrink: 0,
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
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              color: "var(--text3)", pointerEvents: "none",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search players or teams…"
              aria-label="Search players or teams"
              style={{
                width: 260,
                padding: "9px 16px 9px 36px",
                fontSize: 13,
                borderRadius: 100,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--text)",
                outline: "none",
                transition: "all 0.2s cubic-bezier(0.2,0,0,1)",
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={e => {
                e.target.style.background = "rgba(255,255,255,0.08)";
                e.target.style.borderColor = "rgba(34,197,94,0.5)";
                e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.1)";
              }}
              onBlur={e => {
                e.target.style.background = "rgba(255,255,255,0.05)";
                e.target.style.borderColor = "rgba(255,255,255,0.08)";
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
              background: open ? "rgba(34,197,94,0.1)" : "transparent",
              border: "1px solid " + (open ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"),
              color: open ? "#22C55E" : "var(--text2)",
              borderRadius: 10,
              width: 38, height: 38,
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <div style={{
          overflow: "hidden",
          maxHeight: open ? "700px" : "0",
          transition: "max-height 0.35s cubic-bezier(0.2,0,0,1)",
          background: "rgba(9,9,11,0.98)",
          borderBottom: open ? "1px solid rgba(34,197,94,0.1)" : "none",
        }}>
          <div style={{ padding: "12px 16px 20px", display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Primary nav */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", padding: "4px 12px 8px" }}>Navigation</div>
              {PRIMARY_NAV.map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "11px 14px",
                    borderRadius: 10,
                    color: "var(--text2)",
                    fontWeight: 500,
                    fontSize: 15,
                    transition: "background 0.15s, color 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.07)"; e.currentTarget.style.color = "#22C55E"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
                >
                  <span style={{ fontSize: 16 }}>{n.icon}</span>
                  {n.label}
                </Link>
              ))}
            </div>

            {/* Leagues */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", padding: "0 12px 8px" }}>Leagues</div>
              {LEAGUES.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    color: "var(--text2)",
                    fontWeight: 500,
                    fontSize: 14,
                    transition: "background 0.15s, color 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.07)"; e.currentTarget.style.color = "#22C55E"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: l.dot, boxShadow: `0 0 6px ${l.dot}80`, flexShrink: 0 }} />
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Mobile search */}
            <form onSubmit={handleSearch} style={{ position: "relative", marginTop: 4 }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search players or teams…"
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 40px",
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  color: "var(--text)",
                  fontSize: 14,
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
