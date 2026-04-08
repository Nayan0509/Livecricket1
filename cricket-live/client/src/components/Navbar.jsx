import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const PRIMARY_NAV = [
  { to: "/live", label: "Live Hub", icon: "🔴" },
  { to: "/news", label: "Newsroom", icon: "📰" },
  { to: "/rankings", label: "Rankings", icon: "📊" },
  { to: "/series", label: "Series", icon: "🏆" },
  { to: "/teams", label: "Teams", icon: "👥" },
];

const LEAGUES = [
  { to: "/ipl", label: "IPL 2026" },
  { to: "/t20-world-cup", label: "T20 WC" },
  { to: "/world-cup", label: "World Cup" },
  { to: "/asia-cup", label: "Asia Cup" },
  { to: "/psl", label: "PSL" },
  { to: "/bbl", label: "BBL" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLeagues, setShowLeagues] = useState(false);
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
    <nav className="glass" style={{
      position: "sticky", 
      top: 0, 
      zIndex: 1000,
      borderTop: "none", borderLeft: "none", borderRight: "none",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      padding: scrolled ? "4px 0" : "12px 0"
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        {/* Brand */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="glass" style={{ width: 42, height: 42, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, background: "var(--gradient-primary)", border: "none" }}>
            🏏
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.5px", background: "linear-gradient(to right, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CRICKET ZONE</span>
            <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, letterSpacing: 2 }}>ENTERPRISE ANALYTICS</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          <div style={{ display: "flex", gap: 8 }}>
            {PRIMARY_NAV.map(n => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`} style={({ isActive }) => ({
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 700,
                background: isActive ? "var(--gradient-primary)" : "transparent",
                color: isActive ? "#fff" : "var(--text2)",
                border: "none"
              })}>
                {n.label}
              </NavLink>
            ))}
            
            {/* Leagues Dropdown */}
            <div style={{ position: "relative" }} 
                 onMouseEnter={() => setShowLeagues(true)}
                 onMouseLeave={() => setShowLeagues(false)}>
              <button className="btn" style={{ padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "var(--text2)", background: "transparent", border: "none" }}>
                Leagues {showLeagues ? "▲" : "▼"}
              </button>
              {showLeagues && (
                <div className="glass" style={{ position: "absolute", top: "100%", left: 0, width: 220, padding: 12, borderRadius: "var(--radius)", boxShadow: "var(--glass-shadow)", marginTop: 8 }}>
                  {LEAGUES.map(l => (
                    <Link key={l.to} to={l.to} style={{ display: "block", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "var(--text2)", borderRadius: "8px", transition: "0.2s" }}
                          onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.05)"}
                          onMouseLeave={e => e.target.style.background = "transparent"}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ height: 24, width: 1, background: "var(--glass-border)" }} />

          {/* Search */}
          <form onSubmit={handleSearch} style={{ position: "relative" }}>
            <input
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Query Player Database..."
              style={{ width: 220, padding: "10px 40px 10px 16px", fontSize: 12, background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", borderRadius: "10px", color: "#fff", outline: "none" }}
            />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>🔍</span>
          </form>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }} className="mobile-toggle">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="glass" style={{ position: "absolute", top: "100%", left: 0, width: "100%", borderTop: "1px solid var(--glass-border)", padding: 20 }}>
          {PRIMARY_NAV.concat(LEAGUES).map(n => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} style={{ display: "block", padding: 12, color: "var(--text2)", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {n.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
