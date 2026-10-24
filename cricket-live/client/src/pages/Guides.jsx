import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { GUIDES, GUIDE_CATEGORIES } from "../content/guides";
import { EDITOR_NAME } from "../content/site";

export default function Guides() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Cricket & Sports Guides",
    "url": "https://www.livecricketzone.com/guides",
    "hasPart": GUIDES.map(g => ({
      "@type": "Article",
      "headline": g.title,
      "url": `https://www.livecricketzone.com/guides/${g.slug}`,
    })),
  };

  return (
    <div className="container" style={{ paddingBottom: 60, maxWidth: 960 }}>
      <SEO url="/guides" structuredData={structuredData} />

      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", margin: "12px 0 10px" }}>Guides</h1>
      <p style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 15, maxWidth: 760, marginBottom: 28 }}>
        Plain-English explanations of how cricket works: reading a scorecard, the ways of getting out,
        DLS, net run rate, DRS, rankings and the competitions themselves. Each guide is edited by{" "}
        {EDITOR_NAME}, checked against the Laws of Cricket and the ICC playing conditions, and shows
        the date it was last reviewed.
      </p>

      {GUIDE_CATEGORIES.map(cat => (
        <section key={cat} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 14 }}>{cat}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {GUIDES.filter(g => g.category === cat).map(g => (
              <Link key={g.slug} to={`/guides/${g.slug}`} style={{ textDecoration: "none" }}>
                <article style={{ height: "100%", padding: "18px 20px", borderRadius: 14, background: "var(--card)", border: "1px solid rgba(15,23,42,0.08)" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", margin: "0 0 8px" }}>{g.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7, margin: 0 }}>{g.description}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
