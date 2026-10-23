import React from "react";
import { Helmet } from "react-helmet-async";
import { getStaticRouteMeta } from "../content/routeMeta";

const SITE_NAME = "Live Cricket Zone";
const SITE_URL = "https://www.livecricketzone.com";
const DEFAULT_DESC = "Live Cricket Zone — real-time cricket scores, ball-by-ball commentary, IPL 2026, T20 World Cup, ODI & Test scorecards, player stats and ICC rankings.";
const DEFAULT_IMG = `${SITE_URL}/og-image.png`;

export default function SEO({
  title: titleProp,
  description: descriptionProp,
  keywords = "live cricket score, IPL 2026, cricket score today, ball by ball commentary, T20 World Cup, ICC rankings, cricket news",
  image = DEFAULT_IMG,
  url,
  type = "website",
  noindex = false,
  structuredData,
  article = null,
}) {
  // Static routes take their title and description from content/routeMeta.js,
  // which api/index.js also injects into the server HTML, so both agree.
  const routeMeta = url ? getStaticRouteMeta(url.split("?")[0]) : null;
  const title = routeMeta ? routeMeta.title : titleProp;
  const description = (routeMeta ? routeMeta.description : descriptionProp) || DEFAULT_DESC;
  const robots = noindex
    ? "noindex, follow"
    : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Live Cricket Scores & IPL 2026`;
  const canonical = url ? `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}` : SITE_URL;

  // Build hierarchical breadcrumbs
  const breadcrumbItems = [{ "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL }];
  if (url && url !== "/") {
    const parts = url.replace(/^\/+|\/+$/g, "").split("/");
    if (parts.length === 1) {
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": (title || parts[0]).split("|")[0].split("—")[0].trim(),
        "item": canonical
      });
    } else if (parts.length >= 2) {
      const parentName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace(/-/g, " ");
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": parentName,
        "item": `${SITE_URL}/${parts[0]}`
      });
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 3,
        "name": (title || parts[1]).split("|")[0].split("—")[0].trim(),
        "item": canonical
      });
    }
  }

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Search Engine Robots */}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="bingbot" content={robots} />
      
      {/* Additional SEO
          Note: meta keywords, revisit-after, distribution and rating are
          deliberately omitted — no major search engine reads them, and a
          stuffed keywords tag is a legacy spam signal. */}
      <meta name="author" content="Live Cricket Zone" />
      <meta httpEquiv="content-language" content="en-US" />

      {/* Mobile & Design */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Live Cricket Zone" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || "Live Cricket Zone - Live Cricket Score"} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      {article && <meta property="article:published_time" content={article.publishedTime} />}
      {article && <meta property="article:modified_time" content={article.modifiedTime} />}
      {article && <meta property="article:author" content={article.author} />}
      {article && article.tags && <meta property="article:tag" content={article.tags} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title || "Live Cricket Zone - Live Cricket Score"} />
      <meta name="twitter:site" content="@LiveCricketZone" />
      <meta name="twitter:creator" content="@LiveCricketZone" />

      {/* Structured Data: JSON-LD */}
      {structuredData && !Array.isArray(structuredData) && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {structuredData && Array.isArray(structuredData) && structuredData.map((sd, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(sd)}
        </script>
      ))}
      
      {/* BreadcrumbList for rich SERP breadcrumbs */}
      {url && url !== "/" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems
          })}
        </script>
      )}

      {/* Performance preconnects */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://g.cricapi.com" />
      <link rel="preconnect" href="https://static.cricbuzz.com" />
      <link rel="dns-prefetch" href="https://api.cricapi.com" />
      <link rel="dns-prefetch" href="https://news.google.com" />
    </Helmet>
  );
}
