import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function TestCricket() {
  const teams = [
    { name: "India", flag: "🇮🇳", captain: "Rohit Sharma", titles: "2-time WTC Finalists & Border-Gavaskar Champions" },
    { name: "Australia", flag: "🇦🇺", captain: "Pat Cummins", titles: "WTC Champions (2023) & Ashes Holders" },
    { name: "South Africa", flag: "🇿🇦", captain: "Temba Bavuma", titles: "Pacey Home Fortress" },
    { name: "New Zealand", flag: "🇳🇿", captain: "Tom Latham", titles: "Inaugural WTC Champions (2021)" },
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", captain: "Ben Stokes", titles: "Bazball Era Pioneers" },
    { name: "Pakistan", flag: "🇵🇰", captain: "Shan Masood", titles: "Historic Asian Test Power" },
    { name: "Sri Lanka", flag: "🇱🇰", captain: "Dhananjaya de Silva", titles: "Galle Spin Fortress" },
    { name: "West Indies", flag: "🌴", captain: "Kraigg Brathwaite", titles: "Historic Legacy & Gabba 2024 Winners" },
    { name: "Bangladesh", flag: "🇧🇩", captain: "Najmul Hossain Shanto", titles: "Historic Away Series Winners in Pakistan" },
  ];

  const standings = [
    { team: "India", flag: "🇮🇳", played: 14, won: 9, lost: 4, nrr: "PCT: 68.51%", points: 98 },
    { team: "Australia", flag: "🇦🇺", played: 12, won: 8, lost: 3, nrr: "PCT: 62.50%", points: 90 },
    { team: "South Africa", flag: "🇿🇦", played: 8, won: 4, lost: 3, nrr: "PCT: 54.16%", points: 52 },
    { team: "New Zealand", flag: "🇳🇿", played: 8, won: 4, lost: 4, nrr: "PCT: 50.00%", points: 48 },
    { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 16, won: 8, lost: 7, nrr: "PCT: 45.83%", points: 81 },
    { team: "Sri Lanka", flag: "🇱🇰", played: 9, won: 4, lost: 5, nrr: "PCT: 44.44%", points: 48 },
    { team: "Pakistan", flag: "🇵🇰", played: 10, won: 3, lost: 7, nrr: "PCT: 27.50%", points: 33 },
    { team: "West Indies", flag: "🌴", played: 9, won: 2, lost: 6, nrr: "PCT: 25.00%", points: 28 },
    { team: "Bangladesh", flag: "🇧🇩", played: 10, won: 2, lost: 8, nrr: "PCT: 20.00%", points: 24 },
  ];

  const fixtures = [
    { name: "England vs India 1st Test", stage: "WTC Cycle 2025-27", date: "Jun 20, 2026", venue: "Headingley, Leeds" },
    { name: "England vs India 2nd Test", stage: "WTC Cycle 2025-27", date: "Jul 02, 2026", venue: "Edgbaston, Birmingham" },
    { name: "England vs India 3rd Test", stage: "WTC Cycle 2025-27", date: "Jul 16, 2026", venue: "Lord's, London" },
    { name: "Australia vs South Africa 1st Test", stage: "WTC Cycle 2025-27", date: "Nov 26, 2026", venue: "The Gabba, Brisbane" },
  ];

  const records = [
    { label: "Highest Individual Test Score", value: "400*", holder: "Brian Lara (West Indies vs England, 2004)" },
    { label: "Most Career Test Runs", value: "15,921 Runs", holder: "Sachin Tendulkar (India)" },
    { label: "Most Career Test Wickets", value: "800 Wickets", holder: "Muttiah Muralitharan (Sri Lanka)" },
    { label: "Most Test Centuries", value: "51 Centuries", holder: "Sachin Tendulkar (India)" },
    { label: "Highest Test Innings Total", value: "952/6 dec", holder: "Sri Lanka vs India (1997)" },
  ];

  const venues = [
    { name: "Lord's Cricket Ground", city: "London", country: "England", capacity: "31,100", pitch: "Home of Cricket and permanent WTC Final venue." },
    { name: "Melbourne Cricket Ground (MCG)", city: "Melbourne", country: "Australia", capacity: "100,024", pitch: "Traditional Boxing Day Test venue." },
    { name: "Eden Gardens", city: "Kolkata", country: "India", capacity: "66,000", pitch: "Historic venue of the famous 2001 VVS Laxman 281 Test." },
    { name: "The Gabba", city: "Brisbane", country: "Australia", capacity: "42,000", pitch: "Fierce pace, bounce, and historic Test matches." },
  ];

  return (
    <TournamentPage
      slug="test"
      name="Test Cricket Hub 2026"
      shortName="Test"
      filterKeywords={["Test", "Test Match", "Test cricket", "WTC"]}
      accentColor="#FF5C8A"
      seoTitle="Test Cricket Live Score Today - Test Match Commentary"
      seoDesc="Test cricket live score today. Real-time Test match updates with ball-by-ball commentary, day-by-day scorecard and session reports. All Test series covered."
      seoKeywords="Test cricket live score, Test match live score today, Test cricket today, Test match today, Test cricket ball by ball, Test cricket score, live Test score, Test cricket 2026, Ashes live score, Test match commentary, WTC standings"
      stats={[
        { value: "5", label: "Days per Match" },
        { value: "2", label: "Innings" },
        { value: "9", label: "WTC Teams" },
        { value: "Free", label: "Ball-by-Ball Live" },
      ]}
      teams={teams}
      standings={standings}
      fixtures={fixtures}
      records={records}
      venues={venues}
      faqItems={[
        { q: "Where can I watch Test cricket live score today?", a: "Live Cricket Zone provides real-time Test cricket live score with ball-by-ball commentary, session reports and day-by-day scorecards for all Test matches." },
        { q: "What is the ICC World Test Championship (WTC)?", a: "The World Test Championship is a 2-year league format where the top 9 Test nations play 6 series each. The top 2 sides on points percentage (PCT) qualify for the WTC Final at Lord's." },
      ]}
      aboutText={`Live Cricket Zone delivers the fastest Test cricket live score with real-time ball-by-ball commentary for all Test matches across the world. Follow every Test series — the Ashes, Border-Gavaskar Trophy, India vs England, Pakistan vs South Africa, and all ICC World Test Championship fixtures — with session-by-session scorecards, day reports, player stats and match results updated every 15 seconds.`}
    />
  );
}
