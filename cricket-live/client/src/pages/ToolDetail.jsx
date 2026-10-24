import React from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import AdBanner from "../components/AdBanner";
import ContentBlocks, { Inline } from "../components/ContentBlocks";
import { CALCULATORS } from "../components/Calculators";
import NotFound from "./NotFound";
import { getTool } from "../content/tools";

export default function ToolDetail() {
  const { slug } = useParams();
  const tool = getTool(slug);
  const Calculator = CALCULATORS[slug];
  if (!tool || !Calculator) return <NotFound />;

  const url = `/tools/${tool.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.title,
    "description": tool.description,
    "url": `https://www.livecricketzone.com${url}`,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
  };

  return (
    <div className="container" style={{ paddingBottom: 60, maxWidth: 860 }}>
      <SEO title={tool.title} description={tool.description} url={url} structuredData={structuredData} />

      <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "var(--text3)", margin: "8px 0 14px" }}>
        <Link to="/tools" style={{ color: "var(--secondary)", textDecoration: "none" }}>Calculators</Link>
        <span> / {tool.title}</span>
      </nav>

      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", lineHeight: 1.25, margin: "0 0 10px" }}>{tool.title}</h1>
      <p style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 15, margin: "0 0 20px" }}><Inline text={tool.intro} /></p>

      <Calculator />

      <ContentBlocks blocks={tool.blocks} />

      <AdBanner type="auto" />
    </div>
  );
}
