import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../api";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";

const INTRO = PAGE_INTROS["/news"];

const CATEGORIES = ["All", "IPL", "Test", "ODI", "T20", "Women's", "Cricket"];

function getCat(title) {
  const t = title.toLowerCase();
  if (t.includes("ipl")) return "IPL";
  if (t.includes("test") && !t.includes("testing")) return "Test";
  if (t.includes("odi")) return "ODI";
  if (t.includes("t20")) return "T20";
  if (t.includes("women") || t.includes("woman")) return "Women's";
  return "Cricket";
}

const age = n => (n.hoursAgo < 24 ? `${n.hoursAgo}h ago` : `${Math.floor((n.hoursAgo || 0) / 24)}d ago`);

export default function News() {
  const [category, setCategory] = useState("All");

  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    refetchInterval: 300000,
  });

  // The feed carries headline, source and time only; no images are shown
  // rather than attaching stock photos to real reports.
  const allItems = (data?.data || []).map((n, i) => ({
    ...n,
    id: n.id || `news-${i}`,
    category: n.category || getCat(n.title || ""),
  }));
  const items = category === "All" ? allItems : allItems.filter(n => n.category === category);

  const newsItemListSD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Cricket News Headlines",
    "itemListElement": allItems.slice(0, 10).map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.title,
      "url": item.url
    }))
  };

  return (
    <div className="container" style={{ maxWidth: 900, paddingBottom: 60 }}>
      <SEO url="/news" structuredData={newsItemListSD} />

      <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", margin: "12px 0 6px" }}>Cricket News</h1>
      <p style={{ fontSize: 14, color: "var(--text3)", margin: "0 0 18px" }}>
        Headlines from established publishers. Each one links to the original report.
      </p>

      <PageIntro intro={INTRO} />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {CATEGORIES.map(cat => {
          const active = category === cat;
          return (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "6px 14px", borderRadius: 6, fontWeight: active ? 700 : 600, fontSize: 13, cursor: "pointer",
              background: active ? "var(--primary)" : "var(--card)",
              border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
              color: active ? "#fff" : "var(--text2)",
            }}>
              {cat}
            </button>
          );
        })}
      </div>

      <AdBanner type="leaderboard" />

      {isLoading && <div className="spinner" style={{ margin: "40px auto" }} />}

      {error && (
        <p style={{ padding: "20px", color: "var(--live)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}>
          News is unavailable right now. Please try again shortly.
        </p>
      )}

      {!isLoading && !error && items.length === 0 && (
        <p style={{ padding: "24px", color: "var(--text3)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}>
          {category === "All" ? INTRO.empty : "No headlines in this category right now."}
        </p>
      )}

      {!isLoading && !error && items.length > 0 && (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}>
          {items.map((n, i) => (
            <li key={n.id} style={{ borderTop: i ? "1px solid var(--divider)" : "none" }}>
              <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "14px 18px", textDecoration: "none" }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "var(--text)", lineHeight: 1.45 }}>{n.title}</span>
                <span style={{ display: "block", fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
                  {n.source} · {age(n)} · {n.category}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 32 }}><AdBanner type="auto" /></div>
    </div>
  );
}
