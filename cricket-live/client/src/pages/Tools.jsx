import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { TOOLS } from "../content/tools";

export default function Tools() {
  return (
    <div className="container" style={{ paddingBottom: 60, maxWidth: 960 }}>
      <SEO url="/tools" />

      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", margin: "12px 0 10px" }}>Cricket Calculators</h1>
      <p style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 15, maxWidth: 760, marginBottom: 28 }}>
        Free calculators for the numbers that decide cricket matches and tables: net run rate, the
        required run rate in a chase, and batting and bowling averages. Each one shows its working and
        links to the guide that explains the rules behind it. Nothing you enter is stored or sent anywhere.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {TOOLS.map(t => (
          <Link key={t.slug} to={`/tools/${t.slug}`} style={{ textDecoration: "none" }}>
            <article style={{ height: "100%", padding: "18px 20px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", margin: "0 0 8px" }}>{t.title}</h2>
              <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7, margin: 0 }}>{t.description}</p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
