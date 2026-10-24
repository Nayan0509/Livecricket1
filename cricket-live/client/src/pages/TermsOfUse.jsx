import React from "react";
import SEO from "../components/SEO";
import { StaticPage } from "../components/ContentBlocks";
import { TERMS } from "../content/pages";

export default function TermsOfUse() {
  return (
    <StaticPage page={TERMS}>
      <SEO url="/terms-of-use" />
    </StaticPage>
  );
}
