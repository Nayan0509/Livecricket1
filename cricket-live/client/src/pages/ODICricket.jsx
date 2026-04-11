import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function ODICricket() {
  return (
    <TournamentPage
      slug="odi"
      name="ODI Cricket 2026"
      shortName="ODI"
      filterKeywords={["ODI", "One Day International", "One-Day"]}
      accentColor="#38bdf8"
      seoTitle="ODI Cricket Live Score Today - One Day International Ball by Ball Commentary"
      seoDesc="ODI cricket live score today. Get real-time One Day International match updates with ball-by-ball commentary. All ODI series, World Cup qualifiers and bilateral series covered."
      seoKeywords="ODI cricket live score, ODI live score today, One Day International live, ODI cricket today, ODI matches today, ODI ball by ball, ODI cricket score, live ODI score, ODI cricket 2026, ODI World Cup live"
      stats={[
        { value: "12", label: "Series" },
        { value: "50", label: "Overs" },
        { value: "10", label: "Teams" },
        { value: "300+", label: "Matches/Year" },
      ]}
      teams={["India", "Australia", "England", "Pakistan", "South Africa", "New Zealand", "West Indies", "Sri Lanka", "Bangladesh", "Afghanistan"]}
      faqItems={[
        { q: "Where can I watch ODI cricket live score today?", a: "Live Cricket Zone provides real-time ODI cricket live score with ball-by-ball commentary for all One Day International matches." },
        { q: "What is ODI cricket?", a: "ODI (One Day International) cricket is a format where each team bats for 50 overs. It's the format used in the ICC Cricket World Cup and bilateral series between international teams." },
        { q: "How often is the ODI live score updated?", a: "ODI cricket live score on Live Cricket Zone is updated every 15 seconds with ball-by-ball commentary." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest ODI cricket live score with real-time ball-by-ball commentary for all One Day International matches. Follow every ODI series, ICC Cricket World Cup qualifier and bilateral series with live scorecard, player stats and match results updated every 15 seconds."
    />
  );
}
