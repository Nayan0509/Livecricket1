import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function CPL() {
  return (
    <TournamentPage
      slug="cpl"
      name="CPL 2026"
      shortName="CPL"
      filterKeywords={["CPL", "Caribbean Premier League", "Caribbean Premier"]}
      accentColor="#38bdf8"
      seoTitle="CPL 2026 Live Score - Caribbean Premier League Ball by Ball Commentary"
      seoDesc="CPL 2026 live score, ball-by-ball commentary, schedule and match results. Get real-time Caribbean Premier League 2026 updates on Live Cricket Zone."
      seoKeywords="CPL 2026 live score, Caribbean Premier League live score, CPL live today, CPL ball by ball, CPL scorecard, CPL schedule 2026, Caribbean Premier League live"
      stats={[
        { value: "6", label: "Teams" },
        { value: "34", label: "Matches" },
        { value: "30", label: "Days" },
        { value: "120+", label: "Players" },
      ]}
      teams={["Trinbago Knight Riders", "Barbados Royals", "Guyana Amazon Warriors", "Jamaica Tallawahs", "St Kitts & Nevis Patriots", "Saint Lucia Kings"]}
      faqItems={[
        { q: "Where can I watch CPL 2026 live score?", a: "Live Cricket Zone provides real-time CPL 2026 live score with ball-by-ball commentary for all Caribbean Premier League matches." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest CPL 2026 live score with real-time ball-by-ball commentary. Follow every Caribbean Premier League 2026 match with live scorecard and player stats."
    />
  );
}
