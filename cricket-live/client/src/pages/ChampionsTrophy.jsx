import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function ChampionsTrophy() {
  return (
    <TournamentPage
      slug="champions-trophy"
      name="ICC Champions Trophy 2025"
      shortName="Champions Trophy"
      filterKeywords={["Champions Trophy", "ICC Champions Trophy", "CT 2025"]}
      accentColor="#818cf8"
      seoTitle="Champions Trophy 2025 Live Score - ICC CT 2025"
      seoDesc="ICC Champions Trophy 2025 live score, ball-by-ball commentary, schedule and results. Real-time Champions Trophy 2025 updates."
      seoKeywords="Champions Trophy 2025 live score, ICC Champions Trophy live, Champions Trophy live score today, Champions Trophy ball by ball, Champions Trophy schedule 2025, ICC CT 2025 live"
      stats={[
        { value: "8", label: "Teams" },
        { value: "15", label: "Matches" },
        { value: "18", label: "Days" },
        { value: "200+", label: "Players" },
      ]}
      teams={["India", "Pakistan", "Australia", "England", "South Africa", "New Zealand", "Bangladesh", "Afghanistan"]}
      faqItems={[
        { q: "Where can I watch Champions Trophy 2025 live score?", a: "Live Cricket Zone provides real-time ICC Champions Trophy 2025 live score with ball-by-ball commentary updated every 15 seconds." },
        { q: "Which teams are in ICC Champions Trophy 2025?", a: "ICC Champions Trophy 2025 features 8 teams: India, Pakistan, Australia, England, South Africa, New Zealand, Bangladesh and Afghanistan." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest ICC Champions Trophy 2025 live score with real-time ball-by-ball commentary. Follow every Champions Trophy match with live scorecard, toss updates, player stats and match results."
    />
  );
}
