import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function WomensCricket() {
  return (
    <TournamentPage
      slug="womens-cricket"
      name="Women's Cricket 2026"
      shortName="Women's Cricket"
      filterKeywords={["Women", "WODI", "WT20", "Women's", "Womens"]}
      accentColor="#e879f9"
      seoTitle="Women's Cricket Live Score 2026 - ICC Women's T20 & ODI Ball by Ball"
      seoDesc="Women's cricket live score 2026 with ball-by-ball commentary. Get real-time ICC Women's T20 World Cup, Women's ODI and Women's Test match updates on Live Cricket Zone."
      seoKeywords="women's cricket live score, ICC women's T20 World Cup live, women's cricket today, women's ODI live score, women's cricket 2026, women's T20 live score, women's cricket ball by ball"
      stats={[
        { value: "10", label: "Teams" },
        { value: "23", label: "Matches" },
        { value: "20", label: "Days" },
        { value: "200+", label: "Players" },
      ]}
      teams={["India Women", "Australia Women", "England Women", "South Africa Women", "New Zealand Women", "West Indies Women", "Pakistan Women", "Sri Lanka Women", "Bangladesh Women", "Ireland Women"]}
      faqItems={[
        { q: "Where can I watch Women's cricket live score?", a: "Live Cricket Zone provides real-time Women's cricket live score with ball-by-ball commentary for ICC Women's T20 World Cup, Women's ODI and Women's Test matches." },
        { q: "Which women's cricket tournaments are covered?", a: "Live Cricket Zone covers all major women's cricket tournaments including ICC Women's T20 World Cup, Women's ODI World Cup, Women's Ashes, and bilateral series." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest Women's cricket live score with real-time ball-by-ball commentary. Follow every ICC Women's T20 World Cup, Women's ODI and Women's Test match with live scorecard, player stats and match results updated every 15 seconds."
    />
  );
}
