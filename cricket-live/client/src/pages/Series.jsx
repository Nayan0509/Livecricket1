import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSeries } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";

export default function Series() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({ queryKey: ["series"], queryFn: fetchSeries });

  const categories = data?.data || { international: [], domestic: [], league: [], women: [] };
  const filterList = (list) => list?.filter(s => s.name?.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Cricket Series 2026 — All International, IPL & Domestic Series"
        description="All cricket series in 2026 — international series, IPL 2026, T20 leagues, Test series and domestic competitions. Find series schedules, results and live scores."
        keywords="cricket series 2026, all cricket series, IPL 2026 series, T20 World Cup series, cricket international series 2026, Test series 2026, ODI series 2026, domestic cricket series, cricket series schedule"
        url="/series"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.14)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          🏆 Cricket <span style={{ color: "#3B82F6" }}>Series</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          All international series, leagues and domestic competitions in 2026
        </p>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search series by name..."
        style={{ maxWidth: 400, width: "100%", padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", fontSize: 13, marginBottom: 24 }}
      />

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "16px", color: "#f87171", background: "rgba(248,113,113,0.08)", borderRadius: 10, marginBottom: 16 }}>Failed to load series.</div>}

      {!isLoading && !error && Object.keys(categories).map(catKey => {
        const filtered = filterList(categories[catKey]);
        if (!filtered.length) return null;
        const catColors = { international: "#3B82F6", domestic: "#38BDF8", league: "#F87171", women: "#e879f9" };
        const catColor = catColors[catKey] || "#3B82F6";
        return (
          <section key={catKey} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 14, textTransform: "capitalize", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 3, height: 14, borderRadius: 2, background: catColor, display: "inline-block" }} />
              {catKey} Series
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {filtered.map(s => (
                <Link key={s.id} to={`/series/${s.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    padding: "16px 18px", borderRadius: 10, height: "100%",
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${catColor}06`; e.currentTarget.style.borderColor = `${catColor}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span>📅</span> {s.date}
                    </div>
                    {s.url && (
                      <div style={{ marginTop: 10, fontSize: 11, color: catColor, fontWeight: 700 }}>
                        View Schedule →
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {!isLoading && !error && Object.values(categories).every(l => !filterList(l).length) && (
        <div style={{ padding: "40px 20px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ color: "var(--text)", marginBottom: 8 }}>No Series Found</h3>
          <p style={{ color: "var(--text3)", fontSize: 13 }}>Try a different search keyword or check back later.</p>
        </div>
      )}

      <AdBanner type="auto" />

      {/* Rich SEO content */}
      <section style={{ marginTop: 24, padding: "24px 24px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(59,130,246,0.07)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#3B82F6,#2563EB)", display: "inline-block" }} />
          Cricket Series 2026 — Complete Guide
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          The cricket series archive on Live Cricket Zone lists every active and upcoming international series, franchise T20 tournament and domestic competition in 2026. Browse by category — international bilateral series, franchise leagues, domestic competitions and women's cricket series — or search by name to find the specific series you're looking for.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          <strong style={{ color: "var(--text2)" }}>International series</strong> in 2026 follow the ICC Future Tours Programme, with bilateral Test, ODI and T20I series scheduled between all 12 ICC full-member nations throughout the year. Major Test series include the Border-Gavaskar Trophy (India vs Australia), The Ashes (England vs Australia), and Pakistan's home series against England and South Africa. These bilateral series are the backbone of Test cricket's World Test Championship cycle.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          <strong style={{ color: "var(--text2)" }}>Franchise leagues</strong> — IPL 2026, PSL 2026, BBL 2025-26, CPL 2026, BPL 2026, The Hundred and Women's IPL — fill the T20 calendar with high-quality competitive cricket. The <strong style={{ color: "var(--text2)" }}>ICC tournaments</strong> are the pinnacle events: the T20 World Cup 2026 in June and the ICC Champions Trophy 2025 are the flagship competitions above bilateral series.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          Click any series to view its full match schedule, live scores for current matches, and results with scorecards for completed matches. All series data is updated in real time — free, no account required.
        </p>
      </section>
    </div>
  );
}
