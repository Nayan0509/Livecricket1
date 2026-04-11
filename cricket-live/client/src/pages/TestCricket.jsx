import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function TestCricket() {
  return (
    <TournamentPage
      slug="test"
      name="Test Cricket 2026"
      shortName="Test"
      filterKeywords={["Test", "Test Match", "Test cricket"]}
      accentColor="#f87171"
      seoTitle="Test Cricket Live Score Today - Test Match Ball by Ball Commentary"
      seoDesc="Test cricket live score today. Get real-time Test match updates with ball-by-ball commentary, day-by-day scorecard and session reports. All Test series and Ashes covered."
      seoKeywords="Test cricket live score, Test match live score today, Test cricket today, Test match today, Test cricket ball by ball, Test cricket score, live Test score, Test cricket 2026, Ashes live score, Test match commentary"
      stats={[
        { value: "5", label: "Days" },
        { value: "2", label: "Innings" },
        { value: "10", label: "Test Nations" },
        { value: "100+", label: "Tests/Year" },
      ]}
      teams={["India", "Australia", "England", "Pakistan", "South Africa", "New Zealand", "West Indies", "Sri Lanka", "Bangladesh", "Zimbabwe"]}
      faqItems={[
        { q: "Where can I watch Test cricket live score today?", a: "Live Cricket Zone provides real-time Test cricket live score with ball-by-ball commentary, session reports and day-by-day scorecard for all Test matches." },
        { q: "What is Test cricket?", a: "Test cricket is the longest format of the game, played over 5 days with each team getting two innings. It is considered the pinnacle of cricket and the ultimate test of skill and endurance." },
        { q: "How often is the Test match live score updated?", a: "Test cricket live score on Live Cricket Zone is updated every 15 seconds with ball-by-ball commentary and over-by-over analysis." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest Test cricket live score with real-time ball-by-ball commentary for all Test matches. Follow every Test series, Ashes, Border-Gavaskar Trophy and bilateral Test series with live scorecard, session reports, player stats and match results updated every 15 seconds."
    />
  );
}
