import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "../api";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";
import AdBanner from "../components/AdBanner";

export default function Teams() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });

  const categories = data?.response || { international: [], domestic: [], league: [], women: [] };
  const filterList = (list) => list?.filter(t => t.name?.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        url="/teams"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.14)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          👥 Cricket <span style={{ color: "#B026FF" }}>Teams</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          International teams, IPL franchises, domestic sides and women's cricket teams
        </p>
      </div>

      <PageIntro intro={PAGE_INTROS["/teams"]} />

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search teams..."
        style={{ maxWidth: 400, width: "100%", padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", fontSize: 13, marginBottom: 24 }}
      />

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "16px", color: "#FF5C8A", background: "rgba(248,113,113,0.08)", borderRadius: 10, marginBottom: 16 }}>Failed to load teams.</div>}

      {!isLoading && !error && Object.keys(categories).map(catKey => {
        const filtered = filterList(categories[catKey]);
        if (!filtered.length) return null;
        const catColors = { international: "#B026FF", domestic: "#00F0FF", league: "#FF5C8A", women: "#e879f9" };
        const catColor = catColors[catKey] || "#B026FF";
        return (
          <section key={catKey} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 14, textTransform: "capitalize", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 3, height: 14, borderRadius: 2, background: catColor, display: "inline-block" }} />
              {catKey} Teams
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {filtered.map(t => (
                <Link key={t.id} to={`/teams/${t.id}`} state={{ team: t }} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                    borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${catColor}08`; e.currentTarget.style.borderColor = `${catColor}25`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                  >
                    <img
                      src={t.img}
                      alt={t.name}
                      onError={e => { e.target.src = "https://www.cricbuzz.com/a/img/v1/72x72/i1/c1/team-flag.jpg"; }}
                      style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", flexShrink: 0, background: "rgba(255,255,255,0.05)" }}
                    />
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", lineHeight: 1.3 }}>{t.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {!isLoading && !error && Object.values(categories).every(l => !filterList(l).length) && (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text3)", fontSize: 14 }}>No teams found for "{search}"</div>
      )}

      <AdBanner type="auto" />

    </div>
  );
}
