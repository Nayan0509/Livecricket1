import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSeries } from "../api";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";
import AdBanner from "../components/AdBanner";

export default function Series() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({ queryKey: ["series"], queryFn: fetchSeries });

  const categories = data?.data || { international: [], domestic: [], league: [], women: [] };
  const filterList = (list) => list?.filter(s => s.name?.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        url="/series"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(11,99,196,0.08) 0%, rgba(255,255,255,0.98) 100%)",
        border: "1px solid rgba(11,99,196,0.14)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          Cricket <span style={{ color: "#0b7a55" }}>Series</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          All international series, leagues and domestic competitions
        </p>
      </div>

      <PageIntro intro={PAGE_INTROS["/series"]} />

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search series by name..."
        style={{ maxWidth: 400, width: "100%", padding: "10px 16px", borderRadius: 10, background: "var(--card)", border: "1px solid rgba(15,23,42,0.1)", color: "var(--text)", fontSize: 13, marginBottom: 24 }}
      />

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "16px", color: "#c81e28", background: "rgba(209,32,42,0.08)", borderRadius: 10, marginBottom: 16 }}>Failed to load series.</div>}

      {!isLoading && !error && Object.keys(categories).map(catKey => {
        const filtered = filterList(categories[catKey]);
        if (!filtered.length) return null;
        const catColors = { international: "#0b7a55", domestic: "#0b63c4", league: "#c81e28", women: "#7c3aed" };
        const catColor = catColors[catKey] || "#0b7a55";
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
                    background: "var(--card)", border: "1px solid rgba(15,23,42,0.06)",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${catColor}06`; e.currentTarget.style.borderColor = `${catColor}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(15,23,42,0.02)"; e.currentTarget.style.borderColor = "rgba(15,23,42,0.06)"; }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text)", marginBottom: 8, lineHeight: 1.3 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span></span> {s.date}
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
        <div style={{ padding: "40px 20px", textAlign: "center", background: "var(--card)", borderRadius: 12, border: "1px solid rgba(15,23,42,0.06)" }}>
          <h3 style={{ color: "var(--text)", marginBottom: 8 }}>No Series Found</h3>
          <p style={{ color: "var(--text3)", fontSize: 13 }}>Try a different search keyword or check back later.</p>
        </div>
      )}

      <AdBanner type="auto" />

    </div>
  );
}
