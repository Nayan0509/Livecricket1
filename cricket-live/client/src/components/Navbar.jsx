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
  { to: "/ipl",             label: "IPL 2026",        color: "#6366f1" },
  { to: "/t20-world-cup",   label: "T20 World Cup",   color: "#f43f5e" },
  { to: "/world-cup",       label: "World Cup",       color: "#fbbf24" },
  { to: "/asia-cup",        label: "Asia Cup",        color: "#22d3ee" },
  { to: "/champions-trophy",label: "Champions Trophy",color: "#2dd4bf" },
  { to: "/psl",             label: "PSL",             color: "#10b981" },
  { to: "/bbl",             label: "BBL",             color: "#fb923c" },
  { to: "/womens-cricket",  label: "Women's Cricket", color: "#a78bfa" },
];

export default function Navbar() {
  const [open, setOpen]           = useState(false);
  const [showLeagues, setShowLeagues] = useState(false);
  const [search, setSearch]       = useState("");
  const [scrolled, setScrolled]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/players?search=${encodeURIComponent(search)}`); setSearch(""); }
  };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: scrolled ? "rgba(8,12,26,0.92)" : "rgba(8,12,26,0.75)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"}`,
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", height: 58, gap: 8 }}>

          {/* Brand */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 8, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 4px 12px rgba(244,63,94,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08) rotate(-4deg)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(244,63,94,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(244,63,94,0.4)"; }}
            >🏏</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.5px", background: "linear-gradient(135deg, #fff 0%, #c7d2fe 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                CRICKET ZONE
              </div>
              <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, letterSpacing: 2, marginTop: -1 }}>LIVE SCORES</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            {PRIMARY_NAV.map(n => (
              <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
                padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                color: isActive ? "#fff" : "var(--text3)",
                background: isActive ? "rgba(244,63,94,0.15)" : "transparent",
                border: isActive ? "1px solid rgba(244,63,94,0.3)" : "1px solid transparent",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 5,
              })}
                onMouseEnter={e => { if (!e.currentTarget.classList.contains("active")) { e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
                onMouseLeave={e => { if (!e.currentTarget.classList.contains("active")) { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "transparent"; } }}
              >
                {n.label}
              </NavLink>
            ))}

            {/* Leagues dropdown */}
            <div style={{ position: "relative" }}
              onMouseEnter={() => setShowLeagues(true)}
              onMouseLeave={() => setShowLeagues(false)}
            >
              <button style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                color: showLeagues ? "var(--text2)" : "var(--text3)",
                background: showLeagues ? "rgba(255,255,255,0.05)" : "transparent",
                border: "1px solid transparent",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                transition: "all 0.2s",
              }}>
                Leagues
                <span style={{ fontSize: 9, transition: "transform 0.2s", transform: showLeagues ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}>▼</span>
              </button>

              {/* Dropdown */}
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: 0,
                width: 220, borderRadius: 12,
                background: "rgba(13,18,36,0.97)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
                backdropFilter: "blur(20px)",
                padding: "8px",
                opacity: showLeagues ? 1 : 0,
                transform: showLeagues ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
                pointerEvents: showLeagues ? "all" : "none",
                transition: "opacity 0.2s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                zIndex: 100,
              }}>
                {LEAGUES.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setShowLeagues(false)} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 8,
                    fontSize: 13, fontWeight: 600, color: "var(--text2)",
                    transition: "background 0.15s, color 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: l.color, flexShrink: 0, boxShadow: `0 0 6px ${l.color}` }} />
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="desktop-nav" style={{ position: "relative", flexShrink: 0 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search players..."
              style={{
                width: 200, padding: "8px 36px 8px 14px",
                fontSize: 12, borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff", outline: "none",
                transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
              }}
              onFocus={e => { e.target.style.borderColor = "rgba(244,63,94,0.5)"; e.target.style.background = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "0 0 0 3px rgba(244,63,94,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.boxShadow = "none"; }}
            />
            <button type="submit" style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", fontSize: 13, opacity: 0.5,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0.5"}
            >🔍</button>
          </form>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="mobile-toggle"
            style={{
              display: "none", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
              color: "#fff", fontSize: 18, cursor: "pointer", borderRadius: 8,
              width: 38, height: 38, alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        <div style={{
          overflow: "hidden",
          maxHeight: open ? "600px" : "0",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
          borderTop: open ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}>
          <div style={{ padding: "12px 16px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
            {[...PRIMARY_NAV, ...LEAGUES].map(n => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} style={{
                padding: "11px 14px", borderRadius: 8,
                color: "var(--text2)", fontWeight: 600, fontSize: 14,
                transition: "background 0.15s, color 0.15s",
                display: "flex", alignItems: "center", gap: 8,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}
              >
                {n.color && <span style={{ width: 7, height: 7, borderRadius: "50%", background: n.color, flexShrink: 0 }} />}
                {n.label}
              </Link>
            ))}
            <form onSubmit={handleSearch} style={{ marginTop: 8, position: "relative" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players..." style={{ borderRadius: 8 }} />
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
