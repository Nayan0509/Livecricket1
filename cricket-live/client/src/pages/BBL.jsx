import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function BBL() {
  return (
    <TournamentPage
      slug="bbl"
      name="BBL 2026"
      shortName="BBL"
      filterKeywords={["BBL", "Big Bash", "Big Bash League"]}
      accentColor="#fb923c"
      seoTitle="BBL 2026 Live Score - Big Bash League Ball by Ball Commentary"
      seoDesc="BBL 2026 live score, ball-by-ball commentary, schedule and match results. Get real-time Big Bash League 2026 updates on Live Cricket Zone."
      seoKeywords="BBL 2026 live score, Big Bash League live score, BBL live today, BBL ball by ball, BBL scorecard, BBL schedule 2026, Big Bash live score, BBL match today"
      stats={[
        { value: "8", label: "Teams" },
        { value: "61", label: "Matches" },
        { value: "55", label: "Days" },
        { value: "200+", label: "Players" },
      ]}
      teams={["Sydney Sixers", "Melbourne Stars", "Perth Scorchers", "Brisbane Heat", "Adelaide Strikers", "Hobart Hurricanes", "Melbourne Renegades", "Sydney Thunder"]}
      faqItems={[
        { q: "Where can I watch BBL 2026 live score?", a: "Live Cricket Zone provides real-time BBL 2026 live score with ball-by-ball commentary for all Big Bash League matches." },
        { q: "How many teams are in BBL 2026?", a: "BBL 2026 features 8 Australian city-based teams competing in the Big Bash League T20 tournament." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest BBL 2026 live score with real-time ball-by-ball commentary. Follow every Big Bash League 2026 match with live scorecard, player stats and match results."
    />
  );
}
