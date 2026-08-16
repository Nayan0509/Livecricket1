import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function T20Cricket() {
  const teams = [
    { name: "India T20I", flag: "🇮🇳", captain: "Suryakumar Yadav", titles: "Reigning World Champions (2024)" },
    { name: "Australia T20I", flag: "🇦🇺", captain: "Mitchell Marsh", titles: "World Champions (2021)" },
    { name: "England T20I", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", captain: "Jos Buttler", titles: "2-time World Champions (2010, 2022)" },
    { name: "West Indies T20I", flag: "🌴", captain: "Rovman Powell", titles: "2-time World Champions (2012, 2016)" },
    { name: "South Africa T20I", flag: "🇿🇦", captain: "Aiden Markram", titles: "T20 WC Finalists (2024)" },
    { name: "Pakistan T20I", flag: "🇵🇰", captain: "Babar Azam / Rizwan", titles: "World Champions (2009)" },
    { name: "New Zealand T20I", flag: "🇳🇿", captain: "Mitchell Santner", titles: "T20 WC Finalists" },
    { name: "Afghanistan T20I", flag: "🇦🇫", captain: "Rashid Khan", titles: "T20 WC Semi-Finalists (2024)" },
  ];

  const standings = [
    { team: "India", flag: "🇮🇳", played: 15, won: 13, lost: 2, nrr: "Rating: 268", points: 268 },
    { team: "Australia", flag: "🇦🇺", played: 14, won: 10, lost: 4, nrr: "Rating: 259", points: 259 },
    { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 16, won: 10, lost: 6, nrr: "Rating: 254", points: 254 },
    { team: "West Indies", flag: "🌴", played: 15, won: 9, lost: 6, nrr: "Rating: 250", points: 250 },
    { team: "South Africa", flag: "🇿🇦", played: 14, won: 8, lost: 6, nrr: "Rating: 247", points: 247 },
    { team: "New Zealand", flag: "🇳🇿", played: 15, won: 8, lost: 7, nrr: "Rating: 244", points: 244 },
    { team: "Pakistan", flag: "🇵🇰", played: 16, won: 7, lost: 9, nrr: "Rating: 238", points: 238 },
    { team: "Afghanistan", flag: "🇦🇫", played: 14, won: 7, lost: 7, nrr: "Rating: 231", points: 231 },
  ];

  const fixtures = [
    { name: "India vs England 1st T20I", stage: "International Bilateral", date: "Jul 02, 2026", venue: "The Rose Bowl, Southampton" },
    { name: "Australia vs South Africa 1st T20I", stage: "International Bilateral", date: "Jul 05, 2026", venue: "Kingsmead, Durban" },
    { name: "West Indies vs Pakistan 1st T20I", stage: "International Bilateral", date: "Jul 09, 2026", venue: "Kensington Oval, Barbados" },
    { name: "India vs England 2nd T20I", stage: "International Bilateral", date: "Jul 11, 2026", venue: "Old Trafford, Manchester" },
  ];

  const records = [
    { label: "Highest Team Score in T20I", value: "314/3", holder: "Nepal vs Mongolia (2023)" },
    { label: "Most T20I Runs", value: "4,231 Runs", holder: "Rohit Sharma (India)" },
    { label: "Most T20I Hundreds", value: "5 Centuries", holder: "Rohit Sharma & Glenn Maxwell" },
    { label: "Most T20I Wickets", value: "164 Wickets", holder: "Tim Southee (New Zealand)" },
    { label: "Fastest T20I Century", value: "27 Balls", holder: "Sahil Chauhan (Estonia, 2024)" },
  ];

  const venues = [
    { name: "Wankhede Stadium", city: "Mumbai", country: "India", capacity: "33,000", pitch: "Iconic high-scoring T20 track." },
    { name: "Optus Stadium", city: "Perth", country: "Australia", capacity: "60,000", pitch: "Fastest T20 pitch with steep bounce." },
    { name: "The Kia Oval", city: "London", country: "England", capacity: "27,500", pitch: "True batting deck with electric atmosphere." },
  ];

  return (
    <TournamentPage
      slug="t20"
      name="T20 Cricket Hub 2026"
      shortName="T20"
      filterKeywords={["T20", "Twenty20", "T20I"]}
      accentColor="#B026FF"
      seoTitle="T20 Cricket Live Score Today - All T20 Matches"
      seoDesc="T20 cricket live score today. IPL 2026, T20 World Cup, PSL, BBL, CPL, BPL — real-time updates with ball-by-ball commentary every 15 seconds."
      seoKeywords="T20 cricket live score, T20 live score today, T20 cricket today, T20 matches today, T20 cricket live, T20 ball by ball, T20 cricket score, live T20 score, T20 cricket 2026, T20 international live"
      stats={[
        { value: "IPL", label: "10 Franchises" },
        { value: "T20 WC", label: "16 Nations" },
        { value: "PSL/BBL", label: "Top Leagues" },
        { value: "Free", label: "Ball-by-Ball Live" },
      ]}
      teams={teams}
      standings={standings}
      fixtures={fixtures}
      records={records}
      venues={venues}
      faqItems={[
        { q: "Where can I watch T20 cricket live score today?", a: "Live Cricket Zone provides the fastest T20 cricket live score today with ball-by-ball commentary for all T20 matches including IPL, T20 World Cup, PSL, BBL, CPL and BPL." },
        { q: "Which T20 leagues are covered on Live Cricket Zone?", a: "Live Cricket Zone covers all major T20 leagues: IPL 2026, T20 World Cup 2026, PSL 2026, BBL 2026, CPL 2026, BPL 2026, and all T20 International matches." },
      ]}
      aboutText={`Live Cricket Zone delivers the fastest T20 cricket live score with real-time ball-by-ball commentary for every T20 match worldwide. From the IPL 2026 in India to the T20 World Cup, PSL in Pakistan, BBL in Australia, CPL in the Caribbean, and BPL in Bangladesh — all T20 leagues and T20 Internationals are covered with live scorecards updated every 15 seconds.`}
    />
  );
}
