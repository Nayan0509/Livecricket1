import React from "react";
import SportPage from "../components/SportPage";

export default function Football() {
  return (
    <SportPage
      sport="football"
      slug="football"
      name="Football"
      icon="⚽"
      leagues={["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1", "Champions League", "MLS"]}
      accentColor="#39FF14"
      seoTitle="Football Live Scores Today — Premier League, La Liga, Champions League | Live Cricket Zone"
      seoDesc="Live football scores today across the Premier League, La Liga, Serie A, Bundesliga, Ligue 1, UEFA Champions League and MLS, updated in real time."
      seoKeywords="football live score, premier league live score, la liga live score, champions league live score, football scores today"
      aboutText={
        "Live Cricket Zone tracks football scores from the world's biggest leagues and competitions in one place — the Premier League, La Liga, Serie A, Bundesliga, Ligue 1, the UEFA Champions League and Major League Soccer.\n\nEach match card shows the current score, match status and venue, refreshed automatically. Fixtures move between Upcoming, Live and Recent Results as they kick off and finish, so you can follow a matchday from start to finish without reloading."
      }
      faqItems={[
        { q: "Which football leagues does Live Cricket Zone cover?", a: "Premier League, La Liga, Serie A, Bundesliga, Ligue 1, the UEFA Champions League and MLS, with more competitions added over time." },
        { q: "How often do football scores update?", a: "Live scores refresh automatically every 30 seconds while a match is in progress." },
      ]}
    />
  );
}
