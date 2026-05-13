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
      seoTitle="Test Cricket Live Score Today - Test Match Commentary"
      seoDesc="Test cricket live score today. Real-time Test match updates with ball-by-ball commentary, day-by-day scorecard and session reports. All Test series covered."
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
      aboutText={`Live Cricket Zone delivers the fastest Test cricket live score with real-time ball-by-ball commentary for all Test matches across the world. Follow every Test series — the Ashes, Border-Gavaskar Trophy, India vs England, Pakistan vs South Africa, and all ICC World Test Championship fixtures — with session-by-session scorecards, day reports, player stats and match results updated every 15 seconds.

Test cricket is the oldest and most revered form of the game. Played over five days with each team batting twice, Test matches are a supreme examination of technique, temperament and tactical awareness. A bowler's ability to extract movement from a flattening pitch on Day 4, or a batsman's concentration facing 300 balls to save a match — these are the moments that define cricketing greatness.

The ICC World Test Championship (WTC) is the pinnacle competition in Test cricket, running in two-year cycles. Nations accumulate points across every bilateral Test series, with the top two sides at the end of each cycle meeting in the WTC Final at Lord's or The Oval. India, Australia, England, New Zealand, South Africa, Pakistan, Sri Lanka, Bangladesh, West Indies and Zimbabwe all compete in the WTC.

Live Cricket Zone covers every Test match ball by ball with detailed commentary, batting and bowling scorecards, fall of wickets, partnership records, and live day progress. Whether you're following a historic Ashes battle at Lord's or the Border-Gavaskar Trophy at the WACA, you can track every session here, completely free.`}
    />
  );
}
