import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "CricLive";
const SITE_URL = "https://criclive.vercel.app";
const DEFAULT_DESC = "CricLive — Live cricket scores, ball-by-ball commentary, match schedules, player stats, ICC rankings and latest cricket news. IPL, T20 World Cup, ODI, Test matches.";
const DEFAULT_IMG = `${SITE_URL}/og-image.png`;
const KEYWORDS = "live cricket score, cricket live, IPL 2026, T20 World Cup, cricket scorecard, ball by ball, cricket news, ICC rankings, cricket schedule, cricket players stats";

export default function SEO({
  title,
  description = DEFAULT_DESC,
  keywords = KEYWORDS,
  image = DEFAULT_IMG,
  url,
  type = "website",
  noindex = false,
  structuredData,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Live Cricket Scores & News`;
  const canonical = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@CricLive" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
