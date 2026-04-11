import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function AsiaCup() {
  return (
    <TournamentPage
      slug="asia-cup"
      name="Asia Cup 2026"
      shortName="Asia Cup"
      filterKeywords={["Asia Cup", "ACC Asia Cup"]}
      accentColor="#2dd4bf"
      seoTitle="Asia Cup 2026 Live Score - ACC Asia Cup Ball by Ball Commentary"
      seoDesc="Asia Cup 2026 live score, ball-by-ball commentary, schedule and match results. Get real-time ACC Asia Cup 2026 updates including India vs Pakistan live score."
      seoKeywords="Asia Cup 2026 live score, Asia Cup live score today, India vs Pakistan Asia Cup live, Asia Cup ball by ball, Asia Cup schedule 2026, ACC Asia Cup live, Asia Cup cricket 2026"
      stats={[
        { value: "6", label: "Teams" },
        { value: "13", label: "Matches" },
        { value: "15", label: "Days" },
        { value: "100+", label: "Players" },
      ]}
      teams={["India", "Pakistan", "Sri Lanka", "Bangladesh", "Afghanistan", "Nepal"]}
      faqItems={[
        { q: "Where can I watch Asia Cup 2026 live score?", a: "Live Cricket Zone provides real-time Asia Cup 2026 live score with ball-by-ball commentary including India vs Pakistan live score updates." },
        { q: "Which teams are in Asia Cup 2026?", a: "Asia Cup 2026 features 6 teams: India, Pakistan, Sri Lanka, Bangladesh, Afghanistan and Nepal competing for the Asia Cup trophy." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest Asia Cup 2026 live score with real-time ball-by-ball commentary. Follow every Asia Cup match including the highly anticipated India vs Pakistan live score with updates every 15 seconds."
    />
  );
}
