import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const NAV = [
  { to: "/live", label: "🔴 Live" },
  { to: "/watch-live", label: "▶ Watch" },
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
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(10,15,13,0.97)" : "var(--bg2)",
      borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(12px)",
      transition: "background 0.3s"
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", height: 64, gap: 16 }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 28 }}>🏏</span>
          <span style={{ fontWeight: 800, fontSize: 20, color: "var(--green)" }}>CricLive</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto" }} className="desktop-nav">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
              padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap",
              color: isActive ? "var(--green)" : "var(--text2)",
              background: isActive ? "rgba(0,200,83,0.1)" : "transparent",
            })}>
              {n.label}
            </NavLink>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search players..."
            style={{ width: 160, padding: "6px 12px", fontSize: 13 }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: 13 }}>
            🔍
          </button>
        </form>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} style={{
          display: "none", background: "none", border: "none",
          color: "var(--text)", fontSize: 22, cursor: "pointer"
        }} className="mobile-toggle">☰</button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "12px 20px" }}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "10px 0", color: "var(--text2)", fontSize: 15 }}>
              {n.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
