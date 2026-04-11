import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function T20WorldCup() {
  return (
    <TournamentPage
      slug="t20-world-cup"
      name="T20 World Cup 2026"
      shortName="T20 WC"
      filterKeywords={["T20 World Cup", "ICC T20", "WT20"]}
      accentColor="#f472b6"
      seoTitle="T20 World Cup 2026 Live Score - ICC T20 World Cup"
      seoDesc="T20 World Cup 2026 live score, ball-by-ball commentary, schedule, standings and match results. Get real-time ICC T20 World Cup 2026 updates faster than Cricbuzz."
      seoKeywords="T20 World Cup 2026 live score, ICC T20 World Cup live, T20 World Cup schedule 2026, T20 World Cup standings, T20 World Cup ball by ball, T20 World Cup today match, T20 WC live score, ICC T20 2026"
      startDate="2026-06-01"
      endDate="2026-06-29"
      stats={[
        { value: "16", label: "Teams" },
        { value: "45", label: "Matches" },
        { value: "30", label: "Days" },
        { value: "400+", label: "Players" },
      ]}
      teams={["India", "Pakistan", "Australia", "England", "South Africa", "West Indies", "New Zealand", "Sri Lanka", "Bangladesh", "Afghanistan", "Ireland", "Netherlands", "Namibia", "Oman", "UAE", "Zimbabwe"]}
      faqItems={[
        { q: "Where can I watch T20 World Cup 2026 live score?", a: "Live Cricket Zone provides the fastest T20 World Cup 2026 live score with ball-by-ball commentary updated every 15 seconds. No registration required." },
        { q: "When is the T20 World Cup 2026?", a: "The ICC T20 World Cup 2026 is scheduled for June 2026 featuring 16 teams from around the world competing for the T20 World Cup trophy." },
        { q: "Which teams are in T20 World Cup 2026?", a: "T20 World Cup 2026 features 16 teams including India, Pakistan, Australia, England, South Africa, West Indies, New Zealand, Sri Lanka, Bangladesh, Afghanistan and more." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest T20 World Cup 2026 live score with real-time ball-by-ball commentary. Follow every match of the ICC T20 World Cup 2026 with live scorecard, toss updates, player stats and match results. Our T20 World Cup live score today coverage is updated every 15 seconds — faster than Cricbuzz and ESPNcricinfo."
    />
  );
}
