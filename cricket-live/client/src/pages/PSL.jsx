import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function PSL() {
  return (
    <TournamentPage
      slug="psl"
      name="PSL 2026"
      shortName="PSL"
      filterKeywords={["PSL", "Pakistan Super League", "HBL PSL"]}
      accentColor="#4ade80"
      seoTitle="PSL 2026 Live Score - Pakistan Super League Ball by Ball Commentary"
      seoDesc="PSL 2026 live score, ball-by-ball commentary, points table, schedule and match results. Get real-time Pakistan Super League 2026 updates on Live Cricket Zone."
      seoKeywords="PSL 2026 live score, Pakistan Super League live score, PSL live today, PSL ball by ball, PSL scorecard, PSL points table 2026, PSL schedule 2026, PSL match today, HBL PSL live score"
      stats={[
        { value: "6", label: "Teams" },
        { value: "34", label: "Matches" },
        { value: "50", label: "Days" },
        { value: "150+", label: "Players" },
      ]}
      teams={["Karachi Kings", "Lahore Qalandars", "Multan Sultans", "Peshawar Zalmi", "Islamabad United", "Quetta Gladiators"]}
      faqItems={[
        { q: "Where can I watch PSL 2026 live score?", a: "Live Cricket Zone provides real-time PSL 2026 live score with ball-by-ball commentary. Get Pakistan Super League live updates faster than any other cricket website." },
        { q: "How many teams are in PSL 2026?", a: "PSL 2026 features 6 teams: Karachi Kings, Lahore Qalandars, Multan Sultans, Peshawar Zalmi, Islamabad United, and Quetta Gladiators." },
        { q: "What is the PSL 2026 schedule?", a: "PSL 2026 runs for approximately 50 days with 34 matches played across Pakistan. Visit Live Cricket Zone for the complete PSL 2026 schedule and match timings." },
      ]}
      aboutText="Live Cricket Zone provides the fastest PSL 2026 live score with real-time ball-by-ball commentary. Follow every Pakistan Super League 2026 match with live scorecard, toss updates, player stats and match results. Our PSL live score today coverage is updated every 15 seconds."
    />
  );
}
