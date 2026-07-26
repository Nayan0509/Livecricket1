import React from "react";
import SportPage from "../components/SportPage";

export default function Basketball() {
  return (
    <SportPage
      sport="basketball"
      slug="basketball"
      name="Basketball"
      icon="🏀"
      leagues={["NBA", "NCAA Men's", "NCAA Women's"]}
      accentColor="#F97316"
      seoTitle="Basketball Live Scores Today — NBA & NCAA | Live Cricket Zone"
      seoDesc="Live basketball scores today for the NBA, NCAA Men's and NCAA Women's basketball, with live, upcoming and recent results updated in real time."
      seoKeywords="basketball live score, NBA live score, NBA scores today, NCAA basketball live score, basketball scores today"
      aboutText={
        "Live Cricket Zone covers NBA games alongside NCAA Men's and Women's college basketball, with scores organized into Live, Upcoming and Recent Results.\n\nEach game card shows both teams' current score, the game clock or final result, and the venue, so you can check in on a game in progress or catch up on last night's results at a glance."
      }
      faqItems={[
        { q: "Which basketball leagues does Live Cricket Zone cover?", a: "NBA games plus NCAA Men's and Women's college basketball." },
        { q: "How often do basketball scores update?", a: "Live scores refresh automatically every 30 seconds while a game is in progress." },
      ]}
    />
  );
}
