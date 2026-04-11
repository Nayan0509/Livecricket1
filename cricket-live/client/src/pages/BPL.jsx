import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function BPL() {
  return (
    <TournamentPage
      slug="bpl"
      name="BPL 2026"
      shortName="BPL"
      filterKeywords={["BPL", "Bangladesh Premier League", "Bangladesh Premier"]}
      accentColor="#a78bfa"
      seoTitle="BPL 2026 Live Score - Bangladesh Premier League"
      seoDesc="BPL 2026 live score, ball-by-ball commentary, schedule and match results. Get real-time Bangladesh Premier League 2026 updates on Live Cricket Zone."
      seoKeywords="BPL 2026 live score, Bangladesh Premier League live score, BPL live today, BPL ball by ball, BPL scorecard, BPL schedule 2026, Bangladesh Premier League live"
      stats={[
        { value: "7", label: "Teams" },
        { value: "46", label: "Matches" },
        { value: "40", label: "Days" },
        { value: "150+", label: "Players" },
      ]}
      teams={["Comilla Victorians", "Dhaka Dominators", "Rangpur Riders", "Sylhet Strikers", "Khulna Tigers", "Chattogram Challengers", "Fortune Barishal"]}
      faqItems={[
        { q: "Where can I watch BPL 2026 live score?", a: "Live Cricket Zone provides real-time BPL 2026 live score with ball-by-ball commentary for all Bangladesh Premier League matches." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest BPL 2026 live score with real-time ball-by-ball commentary. Follow every Bangladesh Premier League 2026 match with live scorecard and player stats."
    />
  );
}
