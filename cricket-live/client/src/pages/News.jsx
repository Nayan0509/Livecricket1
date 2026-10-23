import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";

const INTRO = PAGE_INTROS["/news"];

const CATEGORIES = ["All", "IPL", "Test", "ODI", "T20", "Women's", "Cricket"];

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562552476-8ac325b57623?w=400&auto=format&fit=crop",
];

function getCat(title) {
  const t = title.toLowerCase();
  if (t.includes("ipl")) return "IPL";
  if (t.includes("test") && !t.includes("testing")) return "Test";
  if (t.includes("odi")) return "ODI";
  if (t.includes("t20")) return "T20";
  if (t.includes("women") || t.includes("woman")) return "Women's";
  return "Cricket";
}

const CAT_COLORS = {
  IPL: "#FF1053",
  Test: "#9D00FF",
  ODI: "#B026FF",
  T20: "#FFEA00",
  "Women's": "#FF36AB",
  Cricket: "#00FFA3",
  All: "#6b7280",
};

// Every headline links out to the publisher's original report.
function NewsLink({ item, style, children }) {
  return <a href={item.url} target="_blank" rel="noopener noreferrer" style={style}>{children}</a>;
}

export default function News() {
  const [category, setCategory] = useState("All");
  const [view, setView] = useState("grid"); // grid | list

  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    refetchInterval: 300000,
  });

  const apiItems = (data?.data || []).map((n, i) => ({
    ...n,
    id: n.id || `news-${i}`,
    img: n.img || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
    category: n.category || getCat(n.title || ""),
    daysAgo: Math.floor((n.hoursAgo || 0) / 24),
  }));

  const rawItems = apiItems;

  const items = category === "All" ? rawItems : rawItems.filter(n => n.category === category);
  const featured = items.slice(0, 3);
  const rest = items.slice(3);

  const newsItemListSD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Cricket News Headlines",
    "itemListElement": rawItems.slice(0, 10).map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.title,
      "url": item.url
    }))
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO url="/news" structuredData={newsItemListSD} />

      {/* Hero */}
      <div style={{
        margin: "16px 0 20px", padding: "28px 24px", borderRadius: 16,
        background: "linear-gradient(135deg, rgba(239,68,68,0.07) 0%, rgba(9,9,11,0.98) 60%, rgba(59,130,246,0.05) 100%)",
        border: "1px solid rgba(239,68,68,0.15)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", margin: "0 0 6px" }}>
              Cricket <span style={{ color: "#FF1053" }}>News</span>
            </h1>
            <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>
              Headlines from established publishers · each links to the original report
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* View toggle */}
            {["grid", "list"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "7px 14px", borderRadius: 8, background: view === v ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${view === v ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.1)"}`,
                color: view === v ? "#FF1053" : "var(--text3)", fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}>
                {v === "grid" ? "⊞" : "☰"} {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <PageIntro intro={INTRO} />

      {/* Category Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {CATEGORIES.map(cat => {
          const active = category === cat;
          const color = CAT_COLORS[cat] || "#6b7280";
          return (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "7px 16px", borderRadius: 20, fontWeight: active ? 800 : 600, fontSize: 12,
              background: active ? `${color}20` : "rgba(255,255,255,0.04)",
              border: `1px solid ${active ? `${color}50` : "rgba(255,255,255,0.09)"}`,
              color: active ? color : "var(--text3)", cursor: "pointer", transition: "all 0.18s",
              fontFamily: "'Inter',sans-serif",
            }}>
              {cat}
              {cat !== "All" && rawItems.filter(n => n.category === cat).length > 0 && (
                <span style={{ marginLeft: 5, fontSize: 9, fontWeight: 900, opacity: 0.7 }}>
                  {rawItems.filter(n => n.category === cat).length}
                </span>
              )}
            </button>
          );
        })}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", padding: "5px 12px", borderRadius: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF1053", animation: "livePulse 1.8s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#FF1053" }}>{items.length} Stories</span>
        </div>
      </div>

      <AdBanner type="leaderboard" />

      {isLoading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div className="spinner" style={{ margin: "0 auto" }} />
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 12 }}>Loading news…</p>
        </div>
      )}

      {error && (
        <div style={{ padding: "40px 24px", textAlign: "center", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 14 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📡</div>
          <h3 style={{ color: "#FF5C8A", marginBottom: 8, fontSize: 16 }}>News unavailable</h3>
          <p style={{ color: "var(--text3)", fontSize: 13 }}>{error.message}</p>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div style={{ padding: "60px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px dashed rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p style={{ color: "var(--text3)", fontSize: 14 }}>{category === "All" ? INTRO.empty : "No news stories for this category. Try another filter."}</p>
        </div>
      )}

      {!isLoading && !error && items.length > 0 && (
        <>
          {/* Featured 3 */}
          {featured.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
              {/* Main featured */}
              <NewsLink item={featured[0]} style={{ textDecoration: "none" }}>
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", transition: "all 0.2s", height: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ height: 220, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                    <img src={featured[0].img} alt={featured[0].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />
                    <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: CAT_COLORS[featured[0].category] || "#FF1053", background: `${CAT_COLORS[featured[0].category] || "#FF1053"}22`, border: `1px solid ${CAT_COLORS[featured[0].category] || "#FF1053"}40`, padding: "3px 10px", borderRadius: 20 }}>
                        {featured[0].category}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", lineHeight: 1.4, margin: "0 0 8px" }}>{featured[0].title}</h2>
                    <p style={{ fontSize: 13, color: "var(--text3)", margin: "0 0 10px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{featured[0].description}</p>
                    <span style={{ fontSize: 11, color: "var(--text3)" }}>{featured[0].source} · {featured[0].hoursAgo < 24 ? `${featured[0].hoursAgo}h ago` : `${featured[0].daysAgo}d ago`}</span>
                  </div>
                </div>
              </NewsLink>

              {/* Side featured 2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {featured.slice(1, 3).map((n, i) => (
                  <NewsLink key={i} item={n} style={{ textDecoration: "none" }}>
                    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", display: "flex", gap: 0, flex: 1, transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.transform = "translateX(2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}>
                      <div style={{ width: 90, height: 90, flexShrink: 0, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                        <img src={n.img} alt={n.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                      </div>
                      <div style={{ padding: "10px 12px", flex: 1 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: CAT_COLORS[n.category] || "#FF1053" }}>{n.category}</span>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", lineHeight: 1.4, margin: "4px 0 6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{n.title}</p>
                        <span style={{ fontSize: 10, color: "var(--text3)" }}>{n.source} · {n.hoursAgo < 24 ? `${n.hoursAgo}h` : `${n.daysAgo}d`} ago</span>
                      </div>
                    </div>
                  </NewsLink>
                ))}
              </div>
            </div>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            view === "grid" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
                {rest.map((n, i) => <NewsCard key={n.id || i} item={n} idx={i} />)}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {rest.map((n, i) => <NewsListItem key={n.id || i} item={n} />)}
              </div>
            )
          )}
        </>
      )}

      <div style={{ marginTop: 32 }}><AdBanner type="auto" /></div>
    </div>
  );
}

function NewsCard({ item: n, idx }) {
  const color = CAT_COLORS[n.category] || "#FF1053";
  return (
    <NewsLink item={n} style={{ textDecoration: "none" }}>
      <div style={{ display: "flex", flexDirection: "column", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", transition: "all 0.22s", height: "100%" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.boxShadow = `0 8px 30px ${color}15`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}>
        <div style={{ height: 130, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
          <img src={n.img} alt={n.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} onError={e => e.target.style.display = "none"} />
          <div style={{ position: "absolute", top: 8, left: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", background: color, padding: "3px 8px", borderRadius: 20 }}>{n.category}</span>
          </div>
        </div>
        <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)" }}>{n.source}</span>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{n.hoursAgo < 24 ? `${n.hoursAgo}h ago` : `${n.daysAgo}d ago`}</span>
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", lineHeight: 1.5, margin: "0 0 8px", flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{n.title}</h3>
          <span style={{ fontSize: 11, color: color, fontWeight: 700 }}>Read more →</span>
        </div>
      </div>
    </NewsLink>
  );
}

function NewsListItem({ item: n }) {
  const color = CAT_COLORS[n.category] || "#FF1053";
  return (
    <NewsLink item={n} style={{ textDecoration: "none" }}>
      <div style={{ display: "flex", gap: 14, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", padding: "12px 14px", transition: "all 0.18s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card)"; }}>
        <div style={{ width: 80, height: 70, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.05)" }}>
          <img src={n.img} alt={n.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", background: color, padding: "2px 8px", borderRadius: 20 }}>{n.category}</span>
            <span style={{ fontSize: 10, color: "var(--text3)" }}>{n.source}</span>
            <span style={{ fontSize: 10, color: "var(--text3)", marginLeft: "auto" }}>{n.hoursAgo < 24 ? `${n.hoursAgo}h ago` : `${n.daysAgo}d ago`}</span>
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.5, margin: 0 }}>{n.title}</h3>
        </div>
      </div>
    </NewsLink>
  );
}
