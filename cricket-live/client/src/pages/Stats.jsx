import React, { useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchPlayers, fetchRankings } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";

const SEARCHES = ["virat", "rohit", "babar", "smith", "root"];

// Live ICC #1-ranked players, scraped per discipline+format from the rankings API.
const RANK_CATS = [
  { category: "ICC #1 Test Batter",   type: "batting", format: "tests" },
  { category: "ICC #1 ODI Batter",    type: "batting", format: "odis"  },
  { category: "ICC #1 T20I Batter",   type: "batting", format: "t20s"  },
  { category: "ICC #1 Test Bowler",   type: "bowling", format: "tests" },
  { category: "ICC #1 ODI Bowler",    type: "bowling", format: "odis"  },
  { category: "ICC #1 T20I Bowler",   type: "bowling", format: "t20s"  },
];

export default function Stats() {
  const [activeSearch, setActiveSearch] = useState("virat");

  const { data, isLoading } = useQuery({
    queryKey: ["players", activeSearch],
    queryFn: () => fetchPlayers(activeSearch),
  });

  const players = Array.isArray(data?.data) ? data.data : [];

  // Live ICC #1-ranked leader per discipline/format (real, scraped)
  const rankQueries = useQueries({
    queries: RANK_CATS.map((c) => ({
      queryKey: ["rankings", c.type, c.format, "men"],
      queryFn: () => fetchRankings(c.type, c.format, "men"),
      staleTime: 3600000,
    })),
  });
  const leaders = RANK_CATS.map((c, i) => {
    const top = rankQueries[i]?.data?.response?.[0];
    return {
      category: c.category,
      player: top?.name || null,
      country: top?.country || "",
      value: top?.rating ? `${top.rating} pts` : "",
      loading: rankQueries[i]?.isLoading,
    };
  });
  const anyLeader = leaders.some((l) => l.player);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Cricket Player Stats 2026 — Batting, Bowling & All-Rounder Records"
        description="Cricket player stats 2026 — batting averages, bowling figures, centuries, wickets and career records across Test, ODI and T20 formats. Virat Kohli, Babar Azam, Joe Root, Jasprit Bumrah and more."
        keywords="cricket player stats, cricket statistics 2026, batting average cricket, bowling average, cricket centuries, most runs cricket, most wickets cricket, Virat Kohli stats, Babar Azam stats, Joe Root stats, Jasprit Bumrah stats, T20 stats cricket, ODI stats cricket, Test cricket stats, IPL stats 2026"
        url="/stats"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(56,189,248,0.15)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          📈 Player <span style={{ color: "#38BDF8" }}>Stats</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          Career batting & bowling statistics — Test, ODI and T20 formats
        </p>
      </div>

      {/* Live ICC #1-ranked leaders (scraped) */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 14, borderRadius: 2, background: "linear-gradient(180deg,#38BDF8,#0EA5E9)", display: "inline-block" }} />
          ICC #1 Ranked — Live
          <span style={{ fontSize: 10, fontWeight: 700, color: "#3B82F6", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 20, padding: "2px 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>Live</span>
        </h2>
        {!anyLeader && leaders.every((l) => !l.loading) ? (
          <div style={{ padding: "20px 16px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ color: "var(--text3)", fontSize: 13, margin: 0 }}>Rankings are updating — check back shortly.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {leaders.map(s => (
              <div key={s.category} style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.12)" }}>
                <div style={{ fontSize: 10, color: "#38BDF8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{s.category}</div>
                {s.loading ? (
                  <div style={{ height: 34, borderRadius: 6, background: "rgba(255,255,255,0.05)" }} />
                ) : s.player ? (
                  <>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", marginBottom: 2 }}>{s.player}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "var(--text3)" }}>{s.country}</span>
                      <span style={{ fontSize: 15, fontWeight: 900, color: "#3B82F6", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>{s.value}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>—</div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Player search */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 14, borderRadius: 2, background: "linear-gradient(180deg,#3B82F6,#2563EB)", display: "inline-block" }} />
          Player Profiles
        </h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {SEARCHES.map(s => (
            <button key={s} onClick={() => setActiveSearch(s)} style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: activeSearch === s ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeSearch === s ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`,
              color: activeSearch === s ? "#3B82F6" : "var(--text3)",
              textTransform: "capitalize", transition: "all 0.15s",
            }}>
              {s}
            </button>
          ))}
        </div>

        {isLoading && <div className="spinner" style={{ margin: "24px auto" }} />}

        {!isLoading && players.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {players.map(p => (
              <Link key={p.id} to={`/players/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.05)"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(59,130,246,0.1)", border: "1.5px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#3B82F6", flexShrink: 0 }}>
                    {p.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>🌍 {p.country}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#3B82F6", fontSize: 14, flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <AdBanner type="auto" />

      {/* Rich SEO content */}
      <section style={{ marginTop: 24, padding: "24px 24px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(56,189,248,0.07)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#38BDF8,#0EA5E9)", display: "inline-block" }} />
          Cricket Statistics Guide — Batting, Bowling & All-Round
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Cricket statistics are the backbone of how the game is analysed and debated. <strong style={{ color: "var(--text2)" }}>Batting average</strong> — total runs divided by dismissals — remains the gold standard metric for a batter's overall quality. A Test batting average above 45 is considered elite, while averages above 55 belong to the true greats of the game. For white-ball cricket, <strong style={{ color: "var(--text2)" }}>strike rate</strong> (runs per 100 balls) becomes equally important alongside average, particularly for T20 batting where a 140+ strike rate at the top of the order is considered world-class.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          <strong style={{ color: "var(--text2)" }}>Bowling statistics</strong> tell the story of wicket-taking ability and economy. Bowling average (runs conceded per wicket) below 25 in Tests is elite. Economy rate (runs conceded per over) is crucial in white-ball cricket — the best ODI bowlers average under 5 runs per over, while leading T20 bowlers aim to stay under 7. Five-wicket hauls in Tests and four-wicket hauls in ODIs are the landmark performances that define a bowler's career trajectory.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Virat Kohli's record of 50+ ODI centuries makes him the leading century-scorer in ODI history. Joe Root is England's all-time Test run-scorer with over 13,000 runs, while Babar Azam's consistency across all three formats has seen him reach the top of ICC rankings simultaneously in T20I and ODI cricket — a feat achieved by only a handful of players in history. Jasprit Bumrah's ability to deliver yorkers in the death overs at 145km/h makes him the most dangerous T20 bowler of his generation.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          Click any player above to see full career statistics, recent form and match-by-match performance. All cricket statistics on Live Cricket Zone are sourced from Cricbuzz and updated continuously throughout the season.
        </p>
      </section>
    </div>
  );
}
