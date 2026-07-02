import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";

export default function Teams() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });

  const categories = data?.response || { international: [], domestic: [], league: [], women: [] };
  const filterList = (list) => list?.filter(t => t.name?.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        title="Cricket Teams 2026 — International, IPL, Domestic & Women's"
        description="All cricket teams in 2026 — international teams, IPL franchises, domestic teams and women's cricket teams. Find team profiles, squads and live match links."
        keywords="cricket teams 2026, international cricket teams, IPL teams 2026, cricket team profiles, India cricket team, Australia cricket team, England cricket team, Pakistan cricket team, domestic cricket teams, women cricket teams, ICC teams"
        url="/teams"
      />

      {/* Hero */}
      <div style={{
        margin: "16px 0 24px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(9,9,11,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.14)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
          👥 Cricket <span style={{ color: "#3B82F6" }}>Teams</span>
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
          International teams, IPL franchises, domestic sides and women's cricket teams
        </p>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search teams..."
        style={{ maxWidth: 400, width: "100%", padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", fontSize: 13, marginBottom: 24 }}
      />

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}
      {error && <div style={{ padding: "16px", color: "#f87171", background: "rgba(248,113,113,0.08)", borderRadius: 10, marginBottom: 16 }}>Failed to load teams.</div>}

      {!isLoading && !error && Object.keys(categories).map(catKey => {
        const filtered = filterList(categories[catKey]);
        if (!filtered.length) return null;
        const catColors = { international: "#3B82F6", domestic: "#38BDF8", league: "#F87171", women: "#e879f9" };
        const catColor = catColors[catKey] || "#3B82F6";
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

      {/* Rich SEO content */}
      <section style={{ marginTop: 24, padding: "24px 24px", borderRadius: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(59,130,246,0.07)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 16, borderRadius: 2, background: "linear-gradient(180deg,#3B82F6,#2563EB)", display: "inline-block" }} />
          Cricket Teams — International, Franchise & Domestic
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          Live Cricket Zone covers cricket teams at every level — from the 12 ICC full-member international nations to franchise T20 teams and domestic first-class sides. The <strong style={{ color: "var(--text2)" }}>ICC full members</strong> playing international cricket in 2026 are India, Australia, England, Pakistan, South Africa, New Zealand, West Indies, Sri Lanka, Bangladesh, Zimbabwe, Afghanistan and Ireland.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          <strong style={{ color: "var(--text2)" }}>India</strong> are the current T20 World Cup holders and one of the world's best ODI and Test sides. <strong style={{ color: "var(--text2)" }}>Australia</strong> are the most successful World Cup nation in ODI cricket. <strong style={{ color: "var(--text2)" }}>England</strong> are the reigning 50-over World Cup holders and won back-to-back T20 World Cup titles in 2010 and 2022. <strong style={{ color: "var(--text2)" }}>Pakistan</strong> are consistently ranked among the top five in all formats, while <strong style={{ color: "var(--text2)" }}>South Africa</strong> host the 2027 ODI World Cup.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85, marginBottom: 12 }}>
          In franchise cricket, the 10 <strong style={{ color: "var(--text2)" }}>IPL 2026 teams</strong> — Mumbai Indians, Chennai Super Kings, Royal Challengers Bengaluru, Kolkata Knight Riders, Gujarat Titans, Lucknow Super Giants, Delhi Capitals, Punjab Kings, Rajasthan Royals and Sunrisers Hyderabad — are among the most valuable and well-followed cricket franchises in the world. Click any IPL team to find their squad, live scores and upcoming fixtures.
        </p>
        <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.85 }}>
          Domestic cricket teams from the County Championship, Ranji Trophy, Sheffield Shield and other competitions are also covered, alongside women's cricket teams from all ICC member nations. Click any team to see their profile, squad and recent match results.
        </p>
      </section>
    </div>
  );
}
