import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function WorldCup() {
  return (
    <TournamentPage
      slug="world-cup"
      name="ICC Cricket World Cup 2027"
      shortName="World Cup"
      filterKeywords={["World Cup", "ODI World Cup", "ICC World Cup", "Cricket World Cup"]}
      accentColor="#fbbf24"
      seoTitle="Cricket World Cup 2027 Live Score - ICC ODI World Cup Ball by Ball"
      seoDesc="ICC Cricket World Cup 2027 live score, ball-by-ball commentary, schedule, standings and match results. Get real-time ODI World Cup updates on Live Cricket Zone."
      seoKeywords="Cricket World Cup 2027 live score, ICC World Cup live, ODI World Cup live score, Cricket World Cup schedule 2027, World Cup ball by ball, ICC World Cup 2027, cricket world cup today match"
      stats={[
        { value: "14", label: "Teams" },
        { value: "48", label: "Matches" },
        { value: "45", label: "Days" },
        { value: "350+", label: "Players" },
      ]}
      teams={["India", "Pakistan", "Australia", "England", "South Africa", "New Zealand", "West Indies", "Sri Lanka", "Bangladesh", "Afghanistan", "Ireland", "Zimbabwe", "Netherlands", "Scotland"]}
      faqItems={[
        { q: "Where can I watch Cricket World Cup 2027 live score?", a: "Live Cricket Zone provides the fastest Cricket World Cup 2027 live score with ball-by-ball commentary updated every 15 seconds." },
        { q: "When is the ICC Cricket World Cup 2027?", a: "The ICC Cricket World Cup 2027 is scheduled to be held in South Africa, Zimbabwe and Namibia in 2027 featuring 14 teams." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest ICC Cricket World Cup 2027 live score with real-time ball-by-ball commentary. Follow every ODI World Cup match with live scorecard, toss updates, player stats and match results."
    />
  );
}
