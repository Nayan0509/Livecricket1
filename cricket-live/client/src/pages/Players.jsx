import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchPlayers } from "../api";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

const STAR_PLAYERS = [
  { name: "Virat Kohli", country: "India", role: "Batter", search: "virat" },
  { name: "Rohit Sharma", country: "India", role: "Batter", search: "rohit" },
  { name: "Babar Azam", country: "Pakistan", role: "Batter", search: "babar" },
  { name: "Steve Smith", country: "Australia", role: "Batter", search: "smith" },
  { name: "Joe Root", country: "England", role: "Batter", search: "root" },
  { name: "Jasprit Bumrah", country: "India", role: "Bowler", search: "bumrah" },
  { name: "Shaheen Afridi", country: "Pakistan", role: "Bowler", search: "shaheen" },
  { name: "Pat Cummins", country: "Australia", role: "All-Rounder", search: "cummins" },
];

export default function Players() {
  const [input, setInput] = useState("virat");
  const [search, setSearch] = useState("virat");

  const { data, isLoading, error } = useQuery({
    queryKey: ["players", search],
    queryFn: () => fetchPlayers(search),
    enabled: !!search,
  });

  const players = Array.isArray(data?.data) ? data.data : [];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Cricket Players Stats — Batting & Bowling Records 2026"
        description="Cricket player profiles with batting averages, bowling records, centuries, wickets and career stats. Search any international or IPL player — Virat Kohli, Babar Azam, Steve Smith, Joe Root and more."
        keywords="cricket players stats, cricket player profiles, Virat Kohli stats, Babar Azam stats, Steve Smith cricket, Joe Root cricket, Jasprit Bumrah stats, batting average cricket, bowling average, cricket centuries, cricket wickets, player statistics, cricket career records, Test cricket stats, ODI stats, T20 stats, IPL players 2026"
        url="/players"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(16,185,129,0.14)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          👤 Cricket <span style={{ color: "#10B981" }}>Players</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          Search player profiles, career stats and records across all formats
        </p>
      </div>

      {/* Search */}
      <form onSubmit={e => { e.preventDefault(); setSearch(input); }}
        style={{ display: "flex", gap: 10, marginBottom: 20, maxWidth: 500 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search player name (e.g. Virat, Babar, Root)..."
          style={{ flex: 1, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", fontSize: 13 }}
        />
        <button type="submit" style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Search
        </button>
      </form>

      {/* Quick search chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {STAR_PLAYERS.map(p => (
          <button key={p.search} onClick={() => { setInput(p.search); setSearch(p.search); }} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
            background: search === p.search ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${search === p.search ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.07)"}`,
            color: search === p.search ? "#10B981" : "var(--text3)",
            transition: "all 0.15s",
          }}>
            {p.name}
          </button>
        ))}
      </div>

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "16px", color: "#f87171", background: "rgba(248,113,113,0.08)", borderRadius: 10, marginBottom: 16 }}>Failed to load players.</div>}

      <AdBanner type="auto" />

      {!isLoading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginTop: 16 }}>
          {players.map(p => (
            <Link key={p.id} to={`/players/${p.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                transition: "border-color 0.15s, background 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(16,185,129,0.05)"; e.currentTarget.style.borderColor = "rgba(16,185,129,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "1.5px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#10B981", flexShrink: 0 }}>
                  {p.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>🌍 {p.country}</div>
                </div>
              </div>
            </Link>
          ))}
          {players.length === 0 && !isLoading && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--text3)", padding: 32, fontSize: 14 }}>
              No players found for "{search}" — try a different search term.
            </div>
          )}
        </div>
      )}

      {/* Rich SEO content */}
      <section style={{ marginTop: 32, padding: "24px 24px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(16,185,129,0.07)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#10B981,#059669)", display: "inline-block" }} />
          Cricket Player Stats & Profiles
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Search any international or IPL cricket player on Live Cricket Zone to find their full career profile — batting averages, bowling figures, centuries, half-centuries, five-wicket hauls, wicket tallies and match records across all three formats: Test, ODI and T20I. Type a player's name in the search bar above to find their complete stats.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          <strong style={{ color: "var(--text2)" }}>Virat Kohli</strong> holds the record for most ODI centuries (50+) and is India's highest run-scorer across formats. <strong style={{ color: "var(--text2)" }}>Babar Azam</strong> is Pakistan's premier batter and consistently ranked in the top 3 across all ICC white-ball rankings. <strong style={{ color: "var(--text2)" }}>Steve Smith</strong> has the highest Test batting average of any active player, while <strong style={{ color: "var(--text2)" }}>Joe Root</strong> is England's all-time leading Test run-scorer. <strong style={{ color: "var(--text2)" }}>Jasprit Bumrah</strong> is ranked among the world's best Test bowlers, and <strong style={{ color: "var(--text2)" }}>Shaheen Shah Afridi</strong> leads Pakistan's pace attack.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Use the quick search chips above to jump straight to profiles for cricket's most searched stars. Each player profile page shows career statistics broken down by format, recent match performances, batting style, bowling style, nationality and age.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          Player data covers all ICC full member nations — India, Australia, England, Pakistan, South Africa, New Zealand, West Indies, Sri Lanka, Bangladesh, Zimbabwe, Afghanistan and Ireland — as well as IPL franchise players. Stats are sourced from Cricbuzz and updated continuously throughout the cricket season.
        </p>
      </section>
    </div>
  );
}
