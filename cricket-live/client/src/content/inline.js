// A deliberately tiny inline-markup parser shared by the React block renderer
// and the server HTML renderer. Content authors may use:
//   **bold text**
//   [link text](/internal/path)  or  [link text](https://example.com)
// Nothing else. Both renderers consume the token stream this produces, which
// guarantees a crawler and a browser see identical text.

const TOKEN_RE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function parseInline(text) {
  if (text == null) return [];
  const str = String(text);
  const out = [];
  let last = 0;
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(str)) !== null) {
    if (m.index > last) out.push({ t: "text", v: str.slice(last, m.index) });
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push({ t: "b", v: tok.slice(2, -2) });
    } else {
      const close = tok.indexOf("](");
      out.push({ t: "a", v: tok.slice(1, close), href: tok.slice(close + 2, -1) });
    }
    last = m.index + tok.length;
  }
  if (last < str.length) out.push({ t: "text", v: str.slice(last) });
  return out;
}

// Plain-text version (for meta descriptions, JSON-LD, word counts).
function stripInline(text) {
  return parseInline(text).map(t => t.v).join("");
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Server-side: tokens → HTML string. Internal links stay relative so the SPA
// router picks them up after hydration; external links open in a new tab.
function inlineToHtml(text) {
  return parseInline(text).map(tok => {
    if (tok.t === "b") return `<strong>${escapeHtml(tok.v)}</strong>`;
    if (tok.t === "a") {
      const ext = /^https?:\/\//i.test(tok.href);
      const attrs = ext ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapeHtml(tok.href)}"${attrs}>${escapeHtml(tok.v)}</a>`;
    }
    return escapeHtml(tok.v);
  }).join("");
}

module.exports = { parseInline, stripInline, escapeHtml, inlineToHtml };
