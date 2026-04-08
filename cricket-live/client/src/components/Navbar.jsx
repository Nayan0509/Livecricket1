import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const NAV = [
  { to: "/live", label: "🔴 Live" },
  { to: "/live-cricket-score", label: "Live Score" },
  { to: "/cricket-score-today", label: "Today" },
  { to: "/ball-by-ball", label: "Ball by Ball" },
  { to: "/watch-live", label: "▶ Watch" },
  { to: "/ipl", label: "IPL" },
  { to: "/t20-world-cup", label: "T20 WC" },
  { to: "/world-cup", label: "WC" },
  { to: "/asia-cup", label: "Asia Cup" },
  { to: "/champions-trophy", label: "CT" },
  { to: "/womens-cricket", label: "Women" },
  { to: "/t20", label: "T20" },
  { to: "/odi", label: "ODI" },
  { to: "/test", label: "Test" },
  { to: "/psl", label: "PSL" },
  { to: "/bbl", label: "BBL" },
  { to: "/cpl", label: "CPL" },
  { to: "/bpl", label: "BPL" },
  { to: "/upcoming", label: "Upcoming" },
  { to: "/results", label: "Results" },
  { to: "/series", label: "Series" },
  { to: "/teams", label: "Teams" },
  { to: "/players", label: "Players" },
  { to: "/rankings", label: "Rankings" },
  { to: "/news", label: "News" },
  { to: "/stats", label: "Stats" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/players?search=${search}`); setSearch(""); }
  };

  return (
    <nav style={{
      position: "sticky", 
      top: 0, 
      zIndex: 100,
      background: scrolled ? "rgba(15, 20, 25, 0.98)" : "var(--bg2)",
      borderBottom: scrolled ? "1px solid var(--primary)" : "1px solid var(--border)",
      backdropFilter: "blur(16px)",
      boxShadow: scrolled ? "var(--shadow-lg)" : "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", height: 72, gap: 20 }}>
        {/* Logo */}
        <Link to="/" style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 10, 
          flexShrink: 0,
          transition: "transform 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: 32 }}>🏏</span>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ 
              fontWeight: 900, 
              fontSize: 22, 
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'Poppins', sans-serif"
            }}>CricketZone</span>
            <span style={{ fontSize: 9, color: "var(--text3)", fontWeight: 600, letterSpacing: "1px" }}>LIVE SCORES</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ 
          display: "flex", 
          gap: 4, 
          flex: 1, 
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }} className="desktop-nav">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
              padding: "8px 14px", 
              borderRadius: "var(--radius)", 
              fontSize: 13, 
              fontWeight: 600, 
              whiteSpace: "nowrap",
              color: isActive ? "#ffffff" : "var(--text2)",
              background: isActive ? "var(--gradient-primary)" : "transparent",
              border: isActive ? "none" : "1px solid transparent",
              transition: "all 0.2s",
              boxShadow: isActive ? "0 2px 8px rgba(26, 115, 232, 0.3)" : "none"
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = "var(--bg3)";
                e.currentTarget.style.borderColor = "var(--border)";
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "transparent";
              }
            }}
            >
              {n.label}
            </NavLink>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <input
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search players..."
            style={{ 
              width: 180, 
              padding: "10px 14px", 
              fontSize: 13,
              background: "var(--bg3)",
              border: "2px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text)",
              transition: "all 0.3s"
            }}
            onFocus={e => {
              e.target.style.borderColor = "var(--primary)";
              e.target.style.background = "var(--bg4)";
            }}
            onBlur={e => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.background = "var(--bg3)";
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ 
            padding: "10px 16px", 
            fontSize: 13,
            minWidth: "auto"
          }}>
            🔍
          </button>
        </form>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} style={{
          display: "none", 
          background: "var(--bg3)", 
          border: "2px solid var(--border)",
          borderRadius: "var(--radius)",
          color: "var(--text)", 
          fontSize: 24, 
          cursor: "pointer",
          padding: "8px 12px",
          transition: "all 0.2s"
        }} className="mobile-toggle">☰</button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ 
          background: "var(--bg2)", 
          borderTop: "1px solid var(--border)", 
          padding: "16px 20px",
          maxHeight: "70vh",
          overflowY: "auto"
        }}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}
              style={({ isActive }) => ({ 
                display: "block", 
                padding: "12px 16px", 
                color: isActive ? "var(--primary-light)" : "var(--text2)", 
                fontSize: 15,
                fontWeight: isActive ? 600 : 500,
                background: isActive ? "rgba(26, 115, 232, 0.1)" : "transparent",
                borderRadius: "var(--radius)",
                marginBottom: "4px",
                transition: "all 0.2s"
              })}>
              {n.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        .desktop-nav::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
