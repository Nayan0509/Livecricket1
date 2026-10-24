import React from "react";
import { Link } from "react-router-dom";
import { parseInline } from "../content/inline";

// React renderer for the content block schema in src/content/pages.js.
// api/render.js renders the same blocks to an HTML string, so the server
// response and the hydrated page carry identical text.

export function Inline({ text }) {
  return parseInline(text).map((tok, i) => {
    if (tok.t === "b") return <strong key={i} style={{ color: "var(--text)" }}>{tok.v}</strong>;
    if (tok.t === "a") {
      if (/^(https?:|mailto:)/i.test(tok.href)) {
        const ext = /^https?:/i.test(tok.href);
        return (
          <a key={i} href={tok.href} style={{ color: "var(--secondary)" }}
            {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {tok.v}
          </a>
        );
      }
      return <Link key={i} to={tok.href} style={{ color: "var(--secondary)" }}>{tok.v}</Link>;
    }
    return <React.Fragment key={i}>{tok.v}</React.Fragment>;
  });
}

const P = { color: "var(--text2)", lineHeight: 1.85, fontSize: 15, margin: "0 0 14px" };
const H2 = { fontSize: 20, fontWeight: 800, color: "var(--text)", margin: "28px 0 12px" };
const H3 = { fontSize: 16, fontWeight: 800, color: "var(--text)", margin: "20px 0 8px" };
const CELL = { padding: "10px 12px", borderBottom: "1px solid rgba(15,23,42,0.07)", textAlign: "left", verticalAlign: "top" };

function Block({ b }) {
  switch (b.type) {
    case "h2": return <h2 style={H2}><Inline text={b.text} /></h2>;
    case "h3": return <h3 style={H3}><Inline text={b.text} /></h3>;
    case "p": return <p style={P}><Inline text={b.text} /></p>;
    case "callout":
      return (
        <div style={{ ...P, padding: "14px 18px", borderRadius: 12, background: "rgba(11,99,196,0.06)", border: "1px solid rgba(11,99,196,0.2)" }}>
          <Inline text={b.text} />
        </div>
      );
    case "ul":
    case "ol": {
      const Tag = b.type;
      return (
        <Tag style={{ ...P, paddingLeft: 22 }}>
          {b.items.map((it, i) => <li key={i} style={{ marginBottom: 6 }}><Inline text={it} /></li>)}
        </Tag>
      );
    }
    case "kv":
      return (
        <dl style={{ ...P, display: "grid", gridTemplateColumns: "minmax(120px, 200px) 1fr", gap: "8px 16px" }}>
          {b.items.map((it, i) => (
            <React.Fragment key={i}>
              <dt style={{ fontWeight: 800, color: "var(--text)" }}><Inline text={it.k} /></dt>
              <dd style={{ margin: 0 }}><Inline text={it.v} /></dd>
            </React.Fragment>
          ))}
        </dl>
      );
    case "table":
      return (
        <div style={{ overflowX: "auto", margin: "0 0 18px", borderRadius: 12, border: "1px solid rgba(15,23,42,0.08)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, color: "var(--text2)" }}>
            <thead>
              <tr style={{ background: "rgba(15,23,42,0.04)", color: "var(--text)" }}>
                {b.head.map((h, i) => <th key={i} style={CELL}><Inline text={h} /></th>)}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r}>{row.map((c, i) => <td key={i} style={CELL}><Inline text={c} /></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return <Faq items={b.items} />;
    default:
      return null;
  }
}

export function Faq({ items, title }) {
  if (!items || items.length === 0) return null;
  return (
    <section style={{ margin: "8px 0 18px" }}>
      {title && <h2 style={H2}>{title}</h2>}
      {items.map((f, i) => (
        <div key={i} style={{ padding: "14px 18px", borderRadius: 12, marginBottom: 10, background: "var(--card)", border: "1px solid rgba(15,23,42,0.07)" }}>
          <h3 style={{ ...H3, margin: "0 0 6px", fontSize: 15 }}><Inline text={f.q} /></h3>
          <p style={{ ...P, margin: 0, fontSize: 14 }}><Inline text={f.a} /></p>
        </div>
      ))}
    </section>
  );
}

export default function ContentBlocks({ blocks }) {
  if (!blocks || blocks.length === 0) return null;
  return <>{blocks.map((b, i) => <Block key={i} b={b} />)}</>;
}

// Layout for a written page with { h1, lede, blocks } (About, Editorial Policy).
export function StaticPage({ page, children }) {
  return (
    <div className="container" style={{ paddingBottom: 60, maxWidth: 860 }}>
      {children}
      <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", margin: "12px 0 10px" }}>{page.h1}</h1>
      {page.lede && <p style={{ ...P, fontSize: 16, color: "var(--text)" }}><Inline text={page.lede} /></p>}
      <ContentBlocks blocks={page.blocks} />
    </div>
  );
}

// Intro text for a data page (src/content/pages.js PAGE_INTROS). Rendered
// above the live data so the page says what it is even when the feed is empty.
export function PageIntro({ intro, children }) {
  if (!intro) return null;
  return (
    <section style={{ margin: "0 0 22px", maxWidth: 860 }}>
      <ContentBlocks blocks={intro.blocks} />
      {children}
    </section>
  );
}
