import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function PSL() {
  const teams = [
    { name: "Islamabad United", flag: "🦁", captain: "Shadab Khan", titles: "3 Titles (2016, 2018, 2024 - Record Winners)" },
    { name: "Lahore Qalandars", flag: "🦅", captain: "Shaheen Shah Afridi", titles: "2 Titles (2022, 2023 - Back-to-Back)" },
    { name: "Multan Sultans", flag: "👑", captain: "Mohammad Rizwan", titles: "1 Title (2021) & 4-time Finalists" },
    { name: "Peshawar Zalmi", flag: "⚡", captain: "Babar Azam", titles: "1 Title (2017) & 4-time Finalists" },
    { name: "Karachi Kings", flag: "👑", captain: "Shan Masood", titles: "1 Title (2020)" },
    { name: "Quetta Gladiators", flag: "⚔️", captain: "Rilee Rossouw", titles: "1 Title (2019) & 3-time Finalists" },
  ];

  const standings = [
    { team: "Multan Sultans", flag: "👑", played: 10, won: 7, lost: 3, nrr: "+1.150", points: 14 },
    { team: "Islamabad United", flag: "🦁", played: 10, won: 6, lost: 4, nrr: "+0.224", points: 12 },
    { team: "Peshawar Zalmi", flag: "⚡", played: 10, won: 5, lost: 5, nrr: "+0.147", points: 10 },
    { team: "Quetta Gladiators", flag: "⚔️", played: 10, won: 5, lost: 5, nrr: "-0.753", points: 10 },
    { team: "Karachi Kings", flag: "👑", played: 10, won: 4, lost: 6, nrr: "-0.192", points: 8 },
    { team: "Lahore Qalandars", flag: "🦅", played: 10, won: 3, lost: 7, nrr: "-0.554", points: 6 },
  ];

  const fixtures = [
    { name: "Islamabad United vs Lahore Qalandars (Opening Match)", stage: "League Match 1", date: "Feb 15, 2026", venue: "Gaddafi Stadium, Lahore" },
    { name: "Multan Sultans vs Karachi Kings", stage: "League Match 2", date: "Feb 16, 2026", venue: "Multan Cricket Stadium, Multan" },
    { name: "Peshawar Zalmi vs Quetta Gladiators", stage: "League Match 3", date: "Feb 17, 2026", venue: "Rawalpindi Cricket Stadium" },
    { name: "Qualifier 1 (1st vs 2nd)", stage: "Playoffs", date: "Mar 18, 2026", venue: "National Stadium, Karachi" },
    { name: "Eliminator 1 (3rd vs 4th)", stage: "Playoffs", date: "Mar 19, 2026", venue: "National Stadium, Karachi" },
    { name: "Eliminator 2", stage: "Playoffs", date: "Mar 20, 2026", venue: "National Stadium, Karachi" },
    { name: "HBL PSL 2026 Grand Final", stage: "Grand Final", date: "Mar 23, 2026", venue: "National Stadium, Karachi" },
  ];

  const records = [
    { label: "Most PSL Runs", value: "3,504 Runs", holder: "Babar Azam" },
    { label: "Most PSL Wickets", value: "113 Wickets", holder: "Wahab Riaz" },
    { label: "Highest Team Score", value: "262/3", holder: "Multan Sultans vs Quetta Gladiators (2023)" },
    { label: "Highest Individual Score", value: "145*", holder: "Jason Roy (Quetta Gladiators)" },
    { label: "Best Bowling Figures", value: "6/16", holder: "Ravi Bopara (Karachi Kings)" },
  ];

  const venues = [
    { name: "National Stadium", city: "Karachi", country: "Pakistan", capacity: "34,228", pitch: "True bounce with heavy boundary scoring under lights." },
    { name: "Gaddafi Stadium", city: "Lahore", country: "Pakistan", capacity: "27,000", pitch: "Fast-scoring deck with great atmosphere." },
    { name: "Rawalpindi Cricket Stadium", city: "Rawalpindi", country: "Pakistan", capacity: "15,000", pitch: "High-scoring pitch with compact boundaries." },
    { name: "Multan Cricket Stadium", city: "Multan", country: "Pakistan", capacity: "35,000", pitch: "Dry pitch offering turn for spin bowlers in second innings." },
  ];

  return (
    <TournamentPage
      slug="psl"
      name="Pakistan Super League 2026"
      shortName="PSL"
      filterKeywords={["PSL", "Pakistan Super League", "HBL PSL"]}
      accentColor="#D896FF"
      seoTitle="PSL 2026 Live Score — Pakistan Super League T20"
      seoDesc="PSL 2026 live score with ball-by-ball commentary for all Pakistan Super League matches. Follow Karachi Kings, Lahore Qalandars, Multan Sultans, Islamabad United and all 6 teams. Updated every 15 seconds, free."
      seoKeywords="PSL 2026 live score, Pakistan Super League live score, PSL live today, PSL ball by ball, PSL scorecard, PSL points table 2026, PSL schedule 2026, PSL match today, HBL PSL live score, Karachi Kings live, Lahore Qalandars live, Multan Sultans live, Islamabad United live, Babar Azam PSL, Shaheen Afridi PSL, PSL highlights"
      stats={[
        { value: "6", label: "Franchises" },
        { value: "34", label: "T20 Matches" },
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
          q: "Where can I watch PSL 2026 live score?",
          a: "Live Cricket Zone provides real-time PSL 2026 live score with ball-by-ball commentary updated every 15 seconds for free.",
        },
        {
          q: "How many teams are in PSL 2026?",
          a: "PSL 2026 features 6 teams: Islamabad United, Lahore Qalandars, Multan Sultans, Peshawar Zalmi, Karachi Kings, and Quetta Gladiators.",
        },
        {
          q: "Who has won the most PSL titles?",
          a: "Islamabad United are the most successful franchise in PSL history with 3 titles (2016, 2018, 2024), followed by Lahore Qalandars with 2 titles (2022, 2023).",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time PSL 2026 live scores with ball-by-ball commentary for every Pakistan Super League match. The PSL is Pakistan's premier T20 franchise tournament and one of the most exciting cricket leagues in the world.

Six franchises representing Pakistan's cricket heartlands compete for the PSL trophy: Karachi Kings, Lahore Qalandars, Multan Sultans, Peshawar Zalmi, Islamabad United and Quetta Gladiators. Matches are hosted at world-class venues in Karachi, Lahore, Rawalpindi and Multan.

Live Cricket Zone provides full ball-by-ball commentary, complete scorecards, points table, player stats and match highlights completely free.`}
    />
  );
}
