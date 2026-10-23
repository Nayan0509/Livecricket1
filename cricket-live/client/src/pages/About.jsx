import React from "react";
import SEO from "../components/SEO";
import { StaticPage } from "../components/ContentBlocks";
import { ABOUT } from "../content/pages";

export default function About() {
  const aboutSD = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Live Cricket Zone",
    "url": "https://www.livecricketzone.com/about"
  };

  return (
    <StaticPage page={ABOUT}>
      <SEO url="/about" structuredData={aboutSD} />
    </StaticPage>
  );
}
