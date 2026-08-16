import React, { useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchPlayers, fetchRankings, fetchCareerRecords } from "../api";
import SEO from "../components/SEO";
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
  const [activeRecordTab, setActiveRecordTab] = useState("runs");

  const { data: searchData, isLoading: isSearchLoading } = useQuery({
    queryKey: ["players", searchTerm],
    queryFn: () => fetchPlayers(searchTerm),
  });

  const { data: recordsData } = useQuery({
    queryKey: ["careerRecords"],
    queryFn: fetchCareerRecords,
    staleTime: 86400000,
  });

  const players = Array.isArray(searchData?.data) ? searchData.data : [];
  const records = recordsData?.data || {
    mostRuns: [
      { player: "Sachin Tendulkar", country: "India", matches: 664, runs: 34357, avg: "48.52", hundreds: 100 },
      { player: "Kumar Sangakkara", country: "Sri Lanka", matches: 594, runs: 28016, avg: "46.77", hundreds: 63 },
      { player: "Ricky Ponting", country: "Australia", matches: 560, runs: 27483, avg: "45.95", hundreds: 71 },
      { player: "Virat Kohli", country: "India", matches: 540, runs: 27150, avg: "53.20", hundreds: 80 },
      { player: "Jacques Kallis", country: "South Africa", matches: 519, runs: 25534, avg: "49.10", hundreds: 62 },
      { player: "Brian Lara", country: "West Indies", matches: 430, runs: 22358, avg: "46.28", hundreds: 53 },
      { player: "Rahul Dravid", country: "India", matches: 509, runs: 24208, avg: "45.41", hundreds: 48 },
    ],
    mostWickets: [
      { player: "Muttiah Muralitharan", country: "Sri Lanka", matches: 495, wickets: 1347, avg: "22.86", fiveWkts: 77 },
      { player: "Shane Warne", country: "Australia", matches: 339, wickets: 1001, avg: "25.51", fiveWkts: 38 },
      { player: "James Anderson", country: "England", matches: 401, wickets: 991, avg: "27.20", fiveWkts: 34 },
      { player: "Anil Kumble", country: "India", matches: 403, wickets: 956, avg: "30.06", fiveWkts: 37 },
      { player: "Glenn McGrath", country: "Australia", matches: 376, wickets: 949, avg: "21.76", fiveWkts: 36 },
      { player: "Wasim Akram", country: "Pakistan", matches: 460, wickets: 916, avg: "23.57", fiveWkts: 31 },
    ],
    highestScores: [
      { player: "Brian Lara", format: "Test", score: "400*", opponent: "England", year: "2004" },
      { player: "Matthew Hayden", format: "Test", score: "380", opponent: "Zimbabwe", year: "2003" },
      { player: "Rohit Sharma", format: "ODI", score: "264", opponent: "Sri Lanka", year: "2014" },
      { player: "Martin Guptill", format: "ODI", score: "237*", opponent: "West Indies", year: "2015" },
      { player: "Virender Sehwag", format: "ODI", score: "219", opponent: "West Indies", year: "2011" },
      { player: "Aaron Finch", format: "T20I", score: "172", opponent: "Zimbabwe", year: "2018" },
      { player: "Hazratullah Zazai", format: "T20I", score: "162*", opponent: "Ireland", year: "2019" },
    ]
  };

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
    "name": "Cricket Player Statistics & Career Records 2026",
    "description": "Comprehensive career records, batting averages, bowling figures, and statistics across Test, ODI, and T20 cricket formats.",
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
        title="Cricket Player Stats 2026 — Batting, Bowling & All-Round Records"
        description="Cricket player stats 2026 — batting averages, bowling figures, centuries, wickets and career records across Test, ODI and T20 formats. Virat Kohli, Babar Azam, Joe Root, Jasprit Bumrah and more."
        keywords="cricket player stats, cricket statistics 2026, batting average cricket, bowling average, cricket centuries, most runs cricket, most wickets cricket, Virat Kohli stats, Babar Azam stats, Joe Root stats, Jasprit Bumrah stats, T20 stats cricket, ODI stats cricket, Test cricket stats, IPL stats 2026"
        url="/stats"
        structuredData={statsSD}
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "32px 28px", borderRadius: 20,
        background: "linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(13,20,38,0.98) 100%)",
        border: "1px solid rgba(56,189,248,0.2)",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: "#00F0FF", marginBottom: 12 }}>
          <span>📊</span> CRICKET ANALYTICS &amp; RECORDS
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
          Cricket <span style={{ color: "#00F0FF" }}>Statistics &amp; Records</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, maxWidth: 650 }}>
          All-time historical cricket records, live ICC rankings, and searchable player career profiles across Test, ODI, and T20 formats.
        </p>
      </div>

      {/* Live ICC #1-ranked leaders */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "#00F0FF", display: "inline-block" }} />
          Official ICC #1 Ranked Players
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {leaders.map(s => (
            <div key={s.category} style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: 10, color: "#00F0FF", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{s.category}</div>
              {s.loading ? (
                <div style={{ height: 36, borderRadius: 8, background: "rgba(255,255,255,0.04)" }} />
              ) : s.player ? (
                <>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", marginBottom: 2 }}>{s.player}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>🌍 {s.country}</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: "#B026FF" }}>{s.value}</span>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: "var(--text3)" }}>Rankings updating…</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* All-Time Historical Cricket Records */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 3, height: 16, borderRadius: 2, background: "#B026FF", display: "inline-block" }} />
            All-Time Historical Cricket Records
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { id: "runs", label: "🏏 Most Runs" },
              { id: "wickets", label: "🎯 Most Wickets" },
              { id: "scores", label: "💥 Highest Scores" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveRecordTab(tab.id)}
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  background: activeRecordTab === tab.id ? "rgba(176,38,255,0.2)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeRecordTab === tab.id ? "#B026FF" : "rgba(255,255,255,0.07)"}`,
                  color: activeRecordTab === tab.id ? "#fff" : "var(--text3)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.015)" }}>
          {activeRecordTab === "runs" && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text3)" }}>
                  <th style={{ padding: "12px 14px" }}>#</th>
                  <th style={{ padding: "12px 14px" }}>Player</th>
                  <th style={{ padding: "12px 14px" }}>Country</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>Matches</th>
                  <th style={{ padding: "12px 14px", textAlign: "center", fontWeight: 800, color: "#00F0FF" }}>Runs</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>Average</th>
                  <th style={{ padding: "12px 14px", textAlign: "center", color: "#B026FF" }}>100s</th>
                </tr>
              </thead>
              <tbody>
                {records.mostRuns.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 800, color: "var(--text)" }}>{r.player}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text2)" }}>{r.country}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", color: "var(--text3)" }}>{r.matches}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 900, color: "#00F0FF" }}>{r.runs.toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", color: "var(--text2)" }}>{r.avg}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 800, color: "#B026FF" }}>{r.hundreds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeRecordTab === "wickets" && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text3)" }}>
                  <th style={{ padding: "12px 14px" }}>#</th>
                  <th style={{ padding: "12px 14px" }}>Player</th>
                  <th style={{ padding: "12px 14px" }}>Country</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>Matches</th>
                  <th style={{ padding: "12px 14px", textAlign: "center", fontWeight: 800, color: "#00F0FF" }}>Wickets</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>Average</th>
                  <th style={{ padding: "12px 14px", textAlign: "center", color: "#B026FF" }}>5W Hauls</th>
                </tr>
              </thead>
              <tbody>
                {records.mostWickets.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 800, color: "var(--text)" }}>{r.player}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text2)" }}>{r.country}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", color: "var(--text3)" }}>{r.matches}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 900, color: "#00F0FF" }}>{r.wickets.toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", color: "var(--text2)" }}>{r.avg}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 800, color: "#B026FF" }}>{r.fiveWkts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeRecordTab === "scores" && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text3)" }}>
                  <th style={{ padding: "12px 14px" }}>#</th>
                  <th style={{ padding: "12px 14px" }}>Player</th>
                  <th style={{ padding: "12px 14px" }}>Format</th>
                  <th style={{ padding: "12px 14px", textAlign: "center", fontWeight: 800, color: "#00F0FF" }}>Score</th>
                  <th style={{ padding: "12px 14px" }}>Against</th>
                  <th style={{ padding: "12px 14px", textAlign: "center" }}>Year</th>
                </tr>
              </thead>
              <tbody>
                {records.highestScores.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 800, color: "var(--text)" }}>{r.player}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text2)" }}>{r.format}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 900, color: "#00F0FF" }}>{r.score}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text2)" }}>{r.opponent}</td>
                    <td style={{ padding: "12px 14px", textAlign: "center", color: "var(--text3)" }}>{r.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Player Search & Directory */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#00F0FF,#00B8D9)", display: "inline-block" }} />
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
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text)", fontSize: 14, outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 24px", borderRadius: 12, background: "#00F0FF", color: "#000",
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
              background: searchTerm === s ? "rgba(0,240,255,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${searchTerm === s ? "rgba(0,240,255,0.4)" : "rgba(255,255,255,0.07)"}`,
              color: searchTerm === s ? "#00F0FF" : "var(--text3)",
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
                  borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                  transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#00F0FF"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,240,255,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {p.img ? (
                    <img src={p.img} alt={p.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(0,240,255,0.3)" }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,240,255,0.1)", border: "1.5px solid rgba(0,240,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#00F0FF", flexShrink: 0 }}>
                      {p.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{p.country || p.team || "International"}</div>
                  </div>
                  <span style={{ marginLeft: "auto", color: "#00F0FF", fontSize: 14, flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <AdBanner type="auto" />

      {/* Rich Editorial Guide */}
      <section style={{ marginTop: 24, padding: "24px 28px", borderRadius: 16, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(56,189,248,0.08)" }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#00F0FF,#00B8D9)", display: "inline-block" }} />
          Cricket Statistics Guide — Batting, Bowling &amp; All-Round Metrics
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Cricket statistics are the quantitative foundation of the sport. <strong style={{ color: "var(--text2)" }}>Batting average</strong> — total runs divided by dismissals — remains the definitive metric for evaluating consistency. A Test batting average above 45 is world-class, while averages above 50 (like Virat Kohli, Steve Smith, and Kumar Sangakkara) represent true greatness. In modern white-ball cricket, <strong style={{ color: "var(--text2)" }}>strike rate</strong> is equally vital, especially in T20 leagues where a 140+ strike rate at the top of the order creates match-winning momentum.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          <strong style={{ color: "var(--text2)" }}>Bowling statistics</strong> evaluate wicket-taking capability and run suppression. A Test bowling average below 25 is elite, while in ODIs and T20s, economy rate and dot-ball percentage are paramount. Bowlers like Jasprit Bumrah, Pat Cummins, Mitchell Starc, and Rashid Khan maintain exceptional economy rates alongside consistent strike rates across all three international formats.
        </p>
      </section>
    </div>
  );
}
