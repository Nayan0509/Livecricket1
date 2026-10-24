import React from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import ContentBlocks from "../components/ContentBlocks";
import NotFound from "./NotFound";
import { getGuide } from "../content/guides";
import { stripInline } from "../content/inline";
import { EDITOR_NAME } from "../content/site";

export default function GuideDetail() {
  const { slug } = useParams();
  const guide = getGuide(slug);
  if (!guide) return <NotFound />;

  const related = (guide.related || []).map(getGuide).filter(Boolean);
  const url = `/guides/${guide.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": stripInline(guide.description),
    "author": { "@type": "Organization", "name": "Live Cricket Zone", "url": "https://www.livecricketzone.com/about" },
    "editor": { "@type": "Person", "name": EDITOR_NAME, "url": "https://www.livecricketzone.com/about" },
    "publisher": { "@type": "Organization", "name": "Live Cricket Zone", "url": "https://www.livecricketzone.com" },
    "mainEntityOfPage": `https://www.livecricketzone.com${url}`,
  };

  return (
    <div className="container" style={{ paddingBottom: 60, maxWidth: 860 }}>
      <SEO title={guide.title} description={stripInline(guide.description)} url={url} type="article" structuredData={structuredData} />

      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "var(--text3)", margin: "8px 0 14px" }}>
        <Link to="/guides" style={{ color: "var(--secondary)", textDecoration: "none" }}>Guides</Link>
        <span> / {guide.category}</span>
      </nav>

      <article>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", lineHeight: 1.25, margin: "0 0 10px" }}>{guide.title}</h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: "0 0 24px" }}>
          Edited by <Link to="/about" style={{ color: "var(--secondary)" }}>{EDITOR_NAME}</Link> · Last reviewed {guide.reviewed}
        </p>
        <ContentBlocks blocks={guide.blocks} />

        {guide.corrections.length > 0 && (
          <section aria-label="Corrections" style={{ marginTop: 28, padding: "14px 18px", borderRadius: 12, background: "var(--card)", border: "1px solid rgba(15,23,42,0.07)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: "0 0 8px" }}>Corrections</h2>
            <ul style={{ margin: 0, paddingLeft: 20, color: "var(--text2)", fontSize: 14, lineHeight: 1.8 }}>
              {guide.corrections.map((c, i) => (
                <li key={i}><strong style={{ color: "var(--text)" }}>{c.date}:</strong> {c.text}</li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <AdBanner type="auto" />

      {related.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 12 }}>Related guides</h2>
          <ul style={{ paddingLeft: 20, color: "var(--text2)", lineHeight: 2 }}>
            {related.map(r => (
              <li key={r.slug}><Link to={`/guides/${r.slug}`} style={{ color: "var(--secondary)" }}>{r.title}</Link></li>
            ))}
          </ul>
        </section>
      )}

      <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 28 }}>
        Spotted an error? See our <Link to="/editorial-policy" style={{ color: "var(--secondary)" }}>corrections policy</Link> or <Link to="/contact" style={{ color: "var(--secondary)" }}>contact us</Link>.
      </p>
    </div>
  );
}
