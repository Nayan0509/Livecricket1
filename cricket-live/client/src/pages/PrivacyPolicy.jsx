import React from "react";
import SEO from "../components/SEO";
import { StaticPage } from "../components/ContentBlocks";
import { PRIVACY } from "../content/pages";

export default function PrivacyPolicy() {
  return (
    <StaticPage page={PRIVACY}>
      <SEO url="/privacy-policy" />
    </StaticPage>
  );
}
