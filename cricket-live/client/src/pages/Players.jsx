import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchPlayers } from "../api";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";

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
        url="/players"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.14)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          👤 Cricket <span style={{ color: "#B026FF" }}>Players</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          Search player profiles, career stats and records across all formats
        </p>
      </div>

      <PageIntro intro={PAGE_INTROS["/players"]} />

      {/* Search */}
      <form onSubmit={e => { e.preventDefault(); setSearch(input); }}
        style={{ display: "flex", gap: 10, marginBottom: 20, maxWidth: 500 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search player name (e.g. Virat, Babar, Root)..."
          style={{ flex: 1, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", fontSize: 13 }}
        />
        <button type="submit" style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#B026FF", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Search
        </button>
      </form>

      {/* Quick search chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {STAR_PLAYERS.map(p => (
          <button key={p.search} onClick={() => { setInput(p.search); setSearch(p.search); }} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
            background: search === p.search ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${search === p.search ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`,
            color: search === p.search ? "#B026FF" : "var(--text3)",
            transition: "all 0.15s",
          }}>
            {p.name}
          </button>
        ))}
      </div>

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "16px", color: "#FF5C8A", background: "rgba(248,113,113,0.08)", borderRadius: 10, marginBottom: 16 }}>Failed to load players.</div>}

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
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.05)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(59,130,246,0.1)", border: "1.5px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#B026FF", flexShrink: 0 }}>
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

    </div>
  );
}
