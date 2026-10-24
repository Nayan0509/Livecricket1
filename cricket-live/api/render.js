// Server HTML for page requests. Every visitor, human or crawler, gets the
// same response: the React build's index.html with the route's <title>,
// description, canonical and robots tags set, and the route's written
// content (from client/src/content) rendered into #root. React replaces
// #root on load and renders the same text from the same modules.

const fs = require("fs");
const path = require("path");
const { SITE_NAME, SITE_URL, NAV_PRIMARY } = require("../client/src/content/site");
const { inlineToHtml, escapeHtml, stripInline } = require("../client/src/content/inline");
const { STATIC_ROUTES, NOINDEX_PREFIXES, isNoindexPath } = require("../client/src/content/routeMeta");
const PAGES = require("../client/src/content/pages");
const { GUIDES, GUIDE_CATEGORIES, getGuide } = require("../client/src/content/guides");
const { TOURNAMENTS } = require("../client/src/content/tournaments");
const { SPORTS } = require("../client/src/content/sports");
const { TOOLS, getTool } = require("../client/src/content/tools");

const isNoindex = isNoindexPath;

// ─── Block renderer (mirror of client/src/components/ContentBlocks.jsx) ─────

function blockToHtml(b) {
  switch (b.type) {
    case "h2": return `<h2>${inlineToHtml(b.text)}</h2>`;
    case "h3": return `<h3>${inlineToHtml(b.text)}</h3>`;
    case "p": return `<p>${inlineToHtml(b.text)}</p>`;
    case "callout": return `<div>${inlineToHtml(b.text)}</div>`;
    case "ul":
    case "ol":
      return `<${b.type}>${b.items.map(it => `<li>${inlineToHtml(it)}</li>`).join("")}</${b.type}>`;
    case "kv":
      return `<dl>${b.items.map(it => `<dt>${inlineToHtml(it.k)}</dt><dd>${inlineToHtml(it.v)}</dd>`).join("")}</dl>`;
    case "table":
      return `<table><thead><tr>${b.head.map(h => `<th>${inlineToHtml(h)}</th>`).join("")}</tr></thead><tbody>${
        b.rows.map(r => `<tr>${r.map(c => `<td>${inlineToHtml(c)}</td>`).join("")}</tr>`).join("")
      }</tbody></table>`;
    case "faq":
      return faqToHtml(b.items);
    default:
      return "";
  }
}

const blocksToHtml = blocks => (blocks || []).map(blockToHtml).join("\n");

function faqToHtml(items, title) {
  if (!items || items.length === 0) return "";
  return (title ? `<h2>${escapeHtml(title)}</h2>` : "") +
    items.map(f => `<h3>${inlineToHtml(f.q)}</h3><p>${inlineToHtml(f.a)}</p>`).join("\n");
}

// ─── Per-route page model ─────────────────────────────────────────────────────

function pageFor(p) {
  const meta = STATIC_ROUTES[p];

  if (p === "/") {
    return {
      meta,
      body: `<h1>${escapeHtml(PAGES.HOME.h1)}</h1>` +
        PAGES.HOME.intro.map(t => `<p>${inlineToHtml(t)}</p>`).join("") +
        `<h2>Guides</h2><ul>${GUIDES.slice(0, 6).map(g => `<li><a href="/guides/${g.slug}">${escapeHtml(g.title)}</a></li>`).join("")}</ul>` +
        faqToHtml(PAGES.HOME.faq, "Frequently asked questions"),
    };
  }
  const written = {
    "/about": PAGES.ABOUT,
    "/editorial-policy": PAGES.EDITORIAL,
    "/privacy-policy": PAGES.PRIVACY,
    "/terms-of-use": PAGES.TERMS,
    "/dmca-copyright": PAGES.DMCA,
  }[p];
  if (written) {
    return { meta, body: `<h1>${escapeHtml(written.h1)}</h1><p>${inlineToHtml(written.lede)}</p>${blocksToHtml(written.blocks)}` };
  }
  if (p === "/contact") {
    const c = PAGES.CONTACT;
    const mail = `<a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a>`;
    return {
      meta,
      body: `<h1>${escapeHtml(c.h1)}</h1><p>${inlineToHtml(c.lede)}</p><p>${mail}</p>` +
        c.reasons.map(r =>
          `<h2>${escapeHtml(r.title)}</h2><p>${inlineToHtml(r.body)}</p>` +
          `<p><a href="mailto:${escapeHtml(c.email)}?subject=${encodeURIComponent(r.subject)}">Email us with the subject "${escapeHtml(r.subject)}"</a></p>`
        ).join("") +
        `<p>${inlineToHtml(c.note)}</p>`,
    };
  }
  if (p === "/guides") {
    return {
      meta,
      body: "<h1>Guides</h1>" + GUIDE_CATEGORIES.map(cat =>
        `<h2>${escapeHtml(cat)}</h2><ul>${GUIDES.filter(g => g.category === cat).map(g =>
          `<li><a href="/guides/${g.slug}">${escapeHtml(g.title)}</a>: ${escapeHtml(g.description)}</li>`).join("")}</ul>`
      ).join(""),
    };
  }
  if (p.startsWith("/guides/")) {
    const g = getGuide(p.slice("/guides/".length));
    if (!g) return null;
    return {
      meta: { title: g.title, description: stripInline(g.description) },
      ogType: "article",
      body: `<article><h1>${escapeHtml(g.title)}</h1><p>By the ${escapeHtml(SITE_NAME)} editorial team · Last reviewed ${escapeHtml(g.reviewed)}</p>${blocksToHtml(g.blocks)}</article>`,
    };
  }
  if (p === "/tools") {
    return {
      meta,
      body: "<h1>Cricket Calculators</h1>" + `<ul>${TOOLS.map(t =>
        `<li><a href="/tools/${t.slug}">${escapeHtml(t.title)}</a>: ${escapeHtml(t.description)}</li>`).join("")}</ul>`,
    };
  }
  if (p.startsWith("/tools/")) {
    const tool = getTool(p.slice("/tools/".length));
    if (!tool) return null;
    return {
      meta: { title: tool.title, description: tool.description },
      body: `<h1>${escapeHtml(tool.title)}</h1><p>${inlineToHtml(tool.intro)}</p><p><em>The calculator runs in your browser and needs JavaScript.</em></p>${blocksToHtml(tool.blocks)}`,
    };
  }
  const t = TOURNAMENTS[p.slice(1)];
  if (t) {
    const teams = t.teams && t.teams.length
      ? `<h2>Teams</h2><ul>${t.teams.map(x => `<li>${escapeHtml(x.name)}${x.home ? ` (${escapeHtml(x.home)})` : ""}</li>`).join("")}</ul>`
      : "";
    return {
      meta,
      body: `<h1>${escapeHtml(t.name)}</h1><p>${inlineToHtml(t.intro)}</p>${t.season ? `<p>${inlineToHtml(t.season)}</p>` : ""}${teams}${blocksToHtml(t.sections)}${faqToHtml(t.faq, "Frequently asked questions")}`,
    };
  }
  const s = SPORTS[p.slice(1)];
  if (s) {
    return {
      meta,
      body: `<h1>${escapeHtml(s.name)}</h1><p>${inlineToHtml(s.intro)}</p>${blocksToHtml(s.sections)}${faqToHtml(s.faq, "Frequently asked questions")}`,
    };
  }
  const intro = PAGES.PAGE_INTROS[p];
  if (intro) return { meta, body: `<h1>${escapeHtml(intro.h1)}</h1>${blocksToHtml(intro.blocks)}` };
  if (meta) return { meta, body: `<h1>${escapeHtml(meta.title)}</h1><p>${escapeHtml(meta.description)}</p>` };
  return null;
}

// ─── Page shell ───────────────────────────────────────────────────────────────

// Same footprint as the React Navbar + Ticker, so the content below does not
// move when React mounts. Styles: .ssr-* in client/src/index.css.
// data-ssr-main marks the block client/src/index.js keeps as the first
// route's loading state.
function shell(body) {
  const nav = NAV_PRIMARY.map(n => `<a href="${n.to}">${escapeHtml(n.label)}</a>`).join("");
  return `<nav class="ssr-head" aria-label="Main navigation"><a class="ssr-logo" href="/">${escapeHtml(SITE_NAME)}</a>${nav}</nav>` +
    `<div class="ssr-tick"></div>` +
    `<main class="ssr-main"><div class="container ssr-body" data-ssr-main>${body}</div></main>`;
}

// ─── Template injection ───────────────────────────────────────────────────────

let template = null;
function loadTemplate() {
  if (template === null) {
    // The build script renames index.html to app.html so Vercel cannot serve
    // the bare shell for "/" from the filesystem; every page comes through here.
    const file = path.join(__dirname, "../client/build/app.html");
    template = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  }
  return template;
}

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`, "i");
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(value)}"/>`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `${tag}</head>`);
}

/**
 * Render the HTML for a page path. Returns { status, html, noindex }, or null
 * when the React build is missing (local dev without a build).
 *  - Known routes get their own title/description/canonical and content.
 *  - Unknown routes still get the app shell (the SPA shows its 404 page)
 *    with noindex and a 404 status.
 */
function renderPage(pathname) {
  const tpl = loadTemplate();
  if (!tpl) return null;

  const p = (pathname || "/").replace(/\/+$/, "") || "/";
  const page = pageFor(p);
  const dynamic = !page && NOINDEX_PREFIXES.some(pre => p.startsWith(pre));
  const noindex = isNoindex(p) || (!page && !dynamic);
  const status = page || dynamic ? 200 : 404;

  const title = page && page.meta ? `${page.meta.title} | ${SITE_NAME}` : SITE_NAME;
  const description = page && page.meta ? page.meta.description : "";
  const canonical = `${SITE_URL}${p === "/" ? "/" : p}`;
  const robots = noindex
    ? "noindex, follow"
    : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

  let html = tpl.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  if (description) {
    html = setMeta(html, "name", "description", description);
    html = setMeta(html, "property", "og:description", description);
    html = setMeta(html, "name", "twitter:description", description);
  }
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "name", "twitter:title", title);
  html = setMeta(html, "property", "og:url", canonical);
  html = setMeta(html, "property", "og:type", page && page.ogType ? page.ogType : "website");
  html = setMeta(html, "name", "robots", robots);
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}"/>`);

  if (page && page.body) {
    html = html.replace(/<div id="root">[\s\S]*<\/div>\s*<\/body>/i, `<div id="root">${shell(page.body)}</div>\n  </body>`);
  }
  return { status, html, noindex };
}

module.exports = { renderPage, isNoindex };
