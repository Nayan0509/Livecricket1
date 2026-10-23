import React from "react";
import SEO from "../components/SEO";
import { StaticPage } from "../components/ContentBlocks";
import { EDITORIAL } from "../content/pages";

export default function EditorialPolicy() {
  const editorialSD = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Editorial Policy & Corrections",
    "url": "https://www.livecricketzone.com/editorial-policy"
  };

  return (
    <StaticPage page={EDITORIAL}>
      <SEO url="/editorial-policy" structuredData={editorialSD} />
    </StaticPage>
  );
}
