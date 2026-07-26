import React from "react";
import SportPage from "../components/SportPage";

export default function Tennis() {
  return (
    <SportPage
      sport="tennis"
      slug="tennis"
      name="Tennis"
      icon="🎾"
      leagues={["ATP Tour", "WTA Tour"]}
      accentColor="#FFEA00"
      seoTitle="Tennis Live Scores Today — ATP & WTA Tour | Live Cricket Zone"
      seoDesc="Live tennis scores today from the ATP and WTA tours, with set-by-set scores for matches in progress, upcoming fixtures and recent results."
      seoKeywords="tennis live score, ATP live score, WTA live score, tennis scores today, tennis results"
      aboutText={
        "Live Cricket Zone tracks singles matches across the ATP and WTA tours, covering tournaments as they happen worldwide.\n\nEach match card shows both players, the set-by-set score, and the current match status, so you can follow a match live or check the result of one that's already finished."
      }
      faqItems={[
        { q: "Which tennis tours does Live Cricket Zone cover?", a: "The ATP Tour (men's) and WTA Tour (women's), across their active tournaments." },
        { q: "How often do tennis scores update?", a: "Live scores refresh automatically every 30 seconds while a match is in progress." },
      ]}
    />
  );
}
