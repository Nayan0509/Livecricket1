import React, { useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchPlayers, fetchRankings } from "../api";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";
import AdBanner from "../components/AdBanner";

const QUICK_SEARCHES = ["virat", "rohit", "bumrah", "babar", "root", "cummins", "smith", "head", "gill", "pant"];

const RANK_CATS = [
  { category: "ICC #1 Test Batter",   type: "batting", format: "tests" },
  { category: "ICC #1 ODI Batter",    type: "batting", format: "odis"  },
  { category: "ICC #1 T20I Batter",   type: "batting", format: "t20s"  },
  { category: "ICC #1 Test Bowler",   type: "bowling", format: "tests" },
  { category: "ICC #1 ODI Bowler",    type: "bowling", format: "odis"  },
  { category: "ICC #1 T20I Bowler",   type: "bowling", format: "t20s"  },
];

export default function Stats() {
  const [searchTerm, setSearchTerm] = useState("virat");
  const [inputVal, setInputVal] = useState("");

  const { data: searchData, isLoading: isSearchLoading } = useQuery({
    queryKey: ["players", searchTerm],
    queryFn: () => fetchPlayers(searchTerm),
  });

  const players = Array.isArray(searchData?.data) ? searchData.data : [];
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

  const statsSD = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Cricket Player Statistics",
    "description": "Current ICC ranking leaders and searchable player career statistics across Test, ODI and T20 cricket.",
    "url": "https://www.livecricketzone.com/stats",
    "publisher": {
      "@type": "Organization",
      "name": "Live Cricket Zone",
      "url": "https://www.livecricketzone.com"
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) setSearchTerm(inputVal.trim());
  };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        url="/stats"
        structuredData={statsSD}
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "32px 28px", borderRadius: 20,
        background: "linear-gradient(135deg, rgba(11,99,196,0.12) 0%, rgba(255,255,255,0.98) 100%)",
        border: "1px solid rgba(11,99,196,0.2)",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(11,99,196,0.15)", border: "1px solid rgba(11,99,196,0.3)", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: "#0b63c4", marginBottom: 12 }}>
          <span></span> CRICKET ANALYTICS &amp; RECORDS
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
          Cricket <span style={{ color: "#0b63c4" }}>Statistics</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, maxWidth: 650 }}>
          Current ICC number ones in each format, and searchable player career profiles across Test, ODI and T20 cricket.
        </p>
      </div>

      <PageIntro intro={PAGE_INTROS["/stats"]} />

      {/* Live ICC #1-ranked leaders */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "#0b63c4", display: "inline-block" }} />
          Official ICC #1 Ranked Players
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {leaders.map(s => (
            <div key={s.category} style={{ padding: "16px 18px", borderRadius: 12, background: "var(--card)", border: "1px solid rgba(15,23,42,0.07)" }}>
              <div style={{ fontSize: 10, color: "#0b63c4", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{s.category}</div>
              {s.loading ? (
                <div style={{ height: 36, borderRadius: 8, background: "rgba(15,23,42,0.04)" }} />
              ) : s.player ? (
                <>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 2 }}>{s.player}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>{s.country}</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: "#0b7a55" }}>{s.value}</span>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: "var(--text3)" }}>Rankings updating…</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Player Search & Directory */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#0b63c4,#0a58ad)", display: "inline-block" }} />
          Instant Player Directory &amp; Search
        </h2>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Search by player name or team (e.g. Kohli, Bumrah, Gill, Head)..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{
              flex: 1, padding: "12px 16px", borderRadius: 12,
              background: "var(--card)", border: "1px solid rgba(15,23,42,0.1)",
              color: "var(--text)", fontSize: 14, outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 24px", borderRadius: 12, background: "#0b63c4", color: "#fff",
              fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        {/* Quick Search Chips */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {QUICK_SEARCHES.map(s => (
            <button key={s} onClick={() => setSearchTerm(s)} style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: searchTerm === s ? "rgba(11,99,196,0.15)" : "rgba(15,23,42,0.03)",
              border: `1px solid ${searchTerm === s ? "rgba(11,99,196,0.4)" : "rgba(15,23,42,0.07)"}`,
              color: searchTerm === s ? "#0b63c4" : "var(--text3)",
              textTransform: "capitalize", transition: "all 0.15s",
            }}>
              {s}
            </button>
          ))}
        </div>

        {isSearchLoading && <div className="spinner" style={{ margin: "24px auto" }} />}

        {!isSearchLoading && players.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {players.map(p => (
              <Link key={p.id} to={`/players/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                  borderRadius: 12, background: "var(--card)", border: "1px solid rgba(15,23,42,0.07)",
                  transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#0b63c4"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(11,99,196,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(15,23,42,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {p.img ? (
                    <img src={p.img} alt={p.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(11,99,196,0.3)" }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(11,99,196,0.1)", border: "1.5px solid rgba(11,99,196,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#0b63c4", flexShrink: 0 }}>
                      {p.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{p.country || p.team || "International"}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#0b63c4", fontSize: 14, flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <AdBanner type="auto" />

      {/* What the numbers mean */}
      <section style={{ marginTop: 24, padding: "20px 24px", borderRadius: 16, background: "var(--card)", border: "1px solid rgba(11,99,196,0.08)" }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>What the numbers mean</h2>
        <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.85, margin: 0 }}>
          Averages, strike rates and economy rates each answer a different question, and what counts as good
          depends on the format. Our guide to{" "}
          <Link to="/guides/batting-average-strike-rate-economy-explained" style={{ color: "var(--secondary)" }}>batting average, strike rate and economy</Link>{" "}
          explains each one, and the{" "}
          <Link to="/tools/batting-and-bowling-average-calculator" style={{ color: "var(--secondary)" }}>average calculator</Link>{" "}
          works them out from raw figures.
        </p>
      </section>
    </div>
  );
}
