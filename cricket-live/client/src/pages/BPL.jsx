import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function BPL() {
  const teams = [
    { name: "Comilla Victorians", flag: "👑", captain: "Litton Das", titles: "4 Titles (2015, 2019, 2022, 2023 - Record Champions)" },
    { name: "Fortune Barishal", flag: "🐯", captain: "Tamim Iqbal", titles: "Defending Champions (2024)" },
    { name: "Rangpur Riders", flag: "⚡", captain: "Nurul Hasan", titles: "1 Title (2017) & Super 4 Regulars" },
    { name: "Sylhet Strikers", flag: "⚔️", captain: "Mashrafe Mortaza", titles: "Finalists (2023)" },
    { name: "Khulna Tigers", flag: "🐅", captain: "Anamul Haque", titles: "Finalists (2020)" },
    { name: "Chattogram Challengers", flag: "🚢", captain: "Shuvagata Hom", titles: "Playoff Contenders" },
    { name: "Dhaka Capitals", flag: "🏛️", captain: "Mosaddek Hossain", titles: "3 Titles (Dhaka Franchise)" },
  ];

  const standings = [
    { team: "Rangpur Riders", flag: "⚡", played: 12, won: 9, lost: 3, nrr: "+1.430", points: 18 },
    { team: "Comilla Victorians", flag: "👑", played: 12, won: 8, lost: 4, nrr: "+1.120", points: 16 },
    { team: "Fortune Barishal", flag: "🐯", played: 12, won: 7, lost: 5, nrr: "+0.450", points: 14 },
    { team: "Chattogram Challengers", flag: "🚢", played: 12, won: 7, lost: 5, nrr: "-0.210", points: 14 },
    { team: "Khulna Tigers", flag: "🐅", played: 12, won: 5, lost: 7, nrr: "-0.440", points: 10 },
    { team: "Sylhet Strikers", flag: "⚔️", played: 12, won: 5, lost: 7, nrr: "-0.890", points: 10 },
    { team: "Dhaka Capitals", flag: "🏛️", played: 12, won: 1, lost: 11, nrr: "-1.450", points: 2 },
  ];

  const fixtures = [
    { name: "Fortune Barishal vs Rangpur Riders", stage: "Match 1", date: "Jan 05, 2026", venue: "Sher-e-Bangla Stadium, Mirpur" },
    { name: "Comilla Victorians vs Sylhet Strikers", stage: "Match 2", date: "Jan 06, 2026", venue: "Sher-e-Bangla Stadium, Mirpur" },
    { name: "Khulna Tigers vs Chattogram Challengers", stage: "Match 3", date: "Jan 08, 2026", venue: "Zahur Ahmed Chowdhury Stadium, Chattogram" },
    { name: "Qualifier 1 (1st vs 2nd)", stage: "Playoffs", date: "Feb 24, 2026", venue: "Sher-e-Bangla Stadium, Mirpur" },
    { name: "Eliminator (3rd vs 4th)", stage: "Playoffs", date: "Feb 25, 2026", venue: "Sher-e-Bangla Stadium, Mirpur" },
    { name: "Qualifier 2", stage: "Playoffs", date: "Feb 27, 2026", venue: "Sher-e-Bangla Stadium, Mirpur" },
    { name: "BPL 2026 Grand Final", stage: "Grand Final", date: "Mar 01, 2026", venue: "Sher-e-Bangla Stadium, Mirpur" },
  ];

  const records = [
    { label: "Most BPL Runs", value: "3,115 Runs", holder: "Tamim Iqbal" },
    { label: "Most BPL Wickets", value: "135 Wickets", holder: "Shakib Al Hasan" },
    { label: "Highest Team Score", value: "239/4", holder: "Rangpur Riders vs Chittagong Vikings" },
    { label: "Highest Individual Score", value: "146*", holder: "Chris Gayle (Rangpur Riders, 2017)" },
    { label: "Most BPL Titles", value: "4 Titles", holder: "Comilla Victorians" },
  ];

  const venues = [
    { name: "Sher-e-Bangla National Cricket Stadium", city: "Mirpur, Dhaka", country: "Bangladesh", capacity: "26,000", pitch: "Home of Bangladesh cricket offering sharp spin and variable bounce." },
    { name: "Zahur Ahmed Chowdhury Stadium", city: "Chattogram", country: "Bangladesh", capacity: "20,000", pitch: "High-scoring batting paradise with true bounce." },
    { name: "Sylhet International Cricket Stadium", city: "Sylhet", country: "Bangladesh", capacity: "18,500", pitch: "Scenic green ground with early seam movement and fast outfield." },
  ];

  return (
    <TournamentPage
      slug="bpl"
      name="Bangladesh Premier League 2026"
      shortName="BPL"
      filterKeywords={["BPL", "Bangladesh Premier League", "Bangladesh Premier"]}
      accentColor="#FF2E9A"
      seoTitle="BPL 2026 Live Score — Bangladesh Premier League T20"
      seoDesc="BPL 2026 live score with ball-by-ball commentary for all Bangladesh Premier League matches. Follow Comilla Victorians, Fortune Barishal, Rangpur Riders, Sylhet Strikers and all 7 teams. Updated every 15 seconds, free."
      seoKeywords="BPL 2026 live score, Bangladesh Premier League live score, BPL live today, BPL ball by ball, BPL scorecard, BPL schedule 2026, Bangladesh Premier League live, BPL T20 live, BPL highlights, Comilla Victorians live, Fortune Barishal live, Rangpur Riders live, BPL 2026 points table, Shakib Al Hasan BPL"
      stats={[
        { value: "7", label: "Franchises" },
        { value: "46", label: "T20 Matches" },
        { value: "T20", label: "Format" },
        { value: "Free", label: "Ball-by-Ball Live" },
      ]}
      teams={teams}
      standings={standings}
      fixtures={fixtures}
      records={records}
      venues={venues}
      faqItems={[
        {
          q: "Where can I watch BPL 2026 live score?",
          a: "Live Cricket Zone provides real-time BPL 2026 live score with ball-by-ball commentary for all Bangladesh Premier League matches. Updated every 15 seconds — free, no sign-up required.",
        },
        {
          q: "Who has won the most BPL titles?",
          a: "Comilla Victorians are the most successful franchise in BPL history with 4 championship titles (2015, 2019, 2022, 2023).",
        },
        {
          q: "Which teams compete in the Bangladesh Premier League?",
          a: "The seven BPL franchises are Comilla Victorians, Fortune Barishal, Rangpur Riders, Sylhet Strikers, Khulna Tigers, Chattogram Challengers, and Dhaka Capitals.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time BPL 2026 live scores with ball-by-ball commentary for every Bangladesh Premier League match. The BPL is Bangladesh's premier T20 franchise tournament and one of Asia's most competitive domestic cricket competitions.

Live Cricket Zone covers all BPL 2026 matches with complete scorecards, batting and bowling figures, points table and match highlights completely free.`}
    />
  );
}
