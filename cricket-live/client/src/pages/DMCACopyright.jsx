import React from "react";
import SEO from "../components/SEO";
import { StaticPage } from "../components/ContentBlocks";
import { DMCA } from "../content/pages";

export default function DMCACopyright() {
  return (
    <StaticPage page={DMCA}>
      <SEO url="/dmca-copyright" />
    </StaticPage>
  );
}
