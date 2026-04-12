import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Live Cricket Zone";
const SITE_URL = "https://www.livecricketzone.com";
const DEFAULT_DESC = "Live Cricket Zone — real-time cricket scores, ball-by-ball commentary, IPL 2026, T20 World Cup, ODI & Test scorecards, player stats and ICC rankings.";
const DEFAULT_IMG = `${SITE_URL}/og-image.png`;
const KEYWORDS = "live cricket score, cricket live score today, IPL 2026 live score today, LSG vs GT live, MI vs RCB live, IPL today match live score, IPL match today, IPL 2026 today, watch IPL live, IPL live streaming free, IPL live stream today, T20 World Cup live, cricket scorecard, ball by ball cricket commentary, cricket news today, ICC rankings 2026, cricket schedule, cricket players stats, cricket match today live, live cricket streaming, cricket score update, cricket live match, ODI cricket live, Test cricket live, cricket highlights, cricket results, cricket fixtures, watch live cricket free, watch cricket online, cricket live stream, live cricket watch, cricket streaming free, cricket live tv, watch cricket match live, cricket score now, live score cricket today, domestic cricket live score, county cricket live, PSL live score, BBL live score, CPL live score, BPL live score, cricket match today score, today cricket match live, cricket today live, live cricket score ball by ball, watch cricket live stream free, cricket streaming sites 2026, free cricket live stream, Virat Kohli live score, Rohit Sharma IPL live, Rishabh Pant LSG, Shubman Gill GT, Hardik Pandya MI, Yashasvi Jaiswal RR, Heinrich Klaasen SRH, Kagiso Rabada GT, Tilak Varma MI, Rajat Patidar RCB, Axar Patel DC, Riyan Parag RR, Pat Cummins SRH, Travis Head SRH, MS Dhoni CSK, Ruturaj Gaikwad CSK, Sunil Narine KKR, Andre Russell KKR, Arshdeep Singh PBKS, Mumbai Indians live, Chennai Super Kings live, Royal Challengers Bengaluru live, Kolkata Knight Riders live, Gujarat Titans live, Lucknow Super Giants live, Delhi Capitals live, Punjab Kings live, Rajasthan Royals live, Sunrisers Hyderabad live, Namibia vs Scotland live, ICC CWC League 2, county championship live, Essex vs Somerset, Notts vs Glamorgan";

export default function SEO({
  title,
  description = DEFAULT_DESC,
  keywords = KEYWORDS,
  image = DEFAULT_IMG,
  url,
  type = "website",
  noindex = false,
  structuredData,
  article = null,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Live Cricket Scores & IPL 2026`;
  const canonical = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Search Engine Robots */}
      {!noindex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Additional SEO */}
      <meta name="author" content="Live Cricket Zone" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta httpEquiv="content-language" content="en-US" />
      
      {/* Mobile & Design */}
      <meta name="theme-color" content="#00c853" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Live Cricket Zone" />
      
      {/* Geo Targeting */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

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
      
      {/* BreadcrumbList for better SERP visibility */}
      {url && url !== "/" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": SITE_URL
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": title,
                "item": canonical
              }
            ]
          })}
        </script>
      )}

      {/* Directives for Web Spiders */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://g.cricapi.com" />
      <link rel="dns-prefetch" href="https://api.cricapi.com" />
    </Helmet>
  );
}
