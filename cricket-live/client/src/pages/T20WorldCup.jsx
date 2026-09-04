import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function T20WorldCup() {
  const teams = [
    { name: "India", flag: "🇮🇳", captain: "Suryakumar Yadav", titles: "2-time Champions (2007, 2024)" },
    { name: "West Indies", flag: "🌴", captain: "Rovman Powell", titles: "2-time Champions (2012, 2016)" },
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", captain: "Jos Buttler", titles: "2-time Champions (2010, 2022)" },
    { name: "Australia", flag: "🇦🇺", captain: "Mitchell Marsh", titles: "Champions (2021)" },
    { name: "Pakistan", flag: "🇵🇰", captain: "Babar Azam / Mohammad Rizwan", titles: "Champions (2009)" },
    { name: "South Africa", flag: "🇿🇦", captain: "Aiden Markram", titles: "Finalists (2024)" },
    { name: "New Zealand", flag: "🇳🇿", captain: "Mitchell Santner", titles: "Finalists (2021)" },
    { name: "Sri Lanka", flag: "🇱🇰", captain: "Wanindu Hasaranga", titles: "Champions (2014)" },
    { name: "Afghanistan", flag: "🇦🇫", captain: "Rashid Khan", titles: "Semi-Finalists (2024)" },
    { name: "Bangladesh", flag: "🇧🇩", captain: "Najmul Hossain Shanto", titles: "Super 8 Contenders" },
    { name: "USA", flag: "🇺🇸", captain: "Monank Patel", titles: "Super 8 Qualifiers" },
    { name: "Ireland", flag: "🇮🇪", captain: "Paul Stirling", titles: "Giant Killers" },
    { name: "Netherlands", flag: "🇳🇱", captain: "Scott Edwards", titles: "Main Stage Regulars" },
    { name: "Namibia", flag: "🇳🇦", captain: "Gerhard Erasmus", titles: "African Qualifiers" },
    { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", captain: "Richie Berrington", titles: "European Qualifiers" },
    { name: "Nepal", flag: "🇳🇵", captain: "Rohit Paudel", titles: "Asian Qualifiers" },
  ];

  const standings = [
    { team: "India", flag: "🇮🇳", played: 4, won: 4, lost: 0, nrr: "+2.140", points: 8 },
    { team: "Australia", flag: "🇦🇺", played: 4, won: 3, lost: 1, nrr: "+1.250", points: 6 },
    { team: "South Africa", flag: "🇿🇦", played: 4, won: 3, lost: 1, nrr: "+0.890", points: 6 },
    { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 4, won: 2, lost: 2, nrr: "+0.410", points: 4 },
    { team: "West Indies", flag: "🌴", played: 4, won: 2, lost: 2, nrr: "+0.320", points: 4 },
    { team: "Afghanistan", flag: "🇦🇫", played: 4, won: 2, lost: 2, nrr: "-0.150", points: 4 },
    { team: "Pakistan", flag: "🇵🇰", played: 4, won: 1, lost: 3, nrr: "-0.480", points: 2 },
    { team: "New Zealand", flag: "🇳🇿", played: 4, won: 1, lost: 3, nrr: "-0.950", points: 2 },
  ];

  const fixtures = [
    { name: "India vs Pakistan", stage: "Group Stage", date: "Tournament Stage A", venue: "Wankhede Stadium, Mumbai" },
    { name: "Australia vs England", stage: "Group Stage", date: "Tournament Stage B", venue: "Eden Gardens, Kolkata" },
    { name: "South Africa vs West Indies", stage: "Group Stage", date: "Tournament Stage C", venue: "M. Chinnaswamy Stadium, Bengaluru" },
    { name: "New Zealand vs Afghanistan", stage: "Group Stage", date: "Tournament Stage D", venue: "MA Chidambaram Stadium, Chennai" },
    { name: "Super 8 - Match 1 (A1 vs B2)", stage: "Super 8", date: "Super 8 Stage", venue: "Narendra Modi Stadium, Ahmedabad" },
    { name: "Super 8 - Match 2 (C1 vs D2)", stage: "Super 8", date: "Super 8 Stage", venue: "Arun Jaitley Stadium, Delhi" },
    { name: "Semi-Final 1", stage: "Semi-Final", date: "Knockout Stage", venue: "Wankhede Stadium, Mumbai" },
    { name: "Semi-Final 2", stage: "Semi-Final", date: "Knockout Stage", venue: "Eden Gardens, Kolkata" },
    { name: "ICC T20 World Cup Grand Final", stage: "Grand Final", date: "Championship Final", venue: "Narendra Modi Stadium, Ahmedabad" },
  ];

  const records = [
    { label: "Highest Team Total", value: "260/6", holder: "Sri Lanka vs Kenya, 2007" },
    { label: "Most Career Runs", value: "1,292 Runs", holder: "Virat Kohli (India)" },
    { label: "Highest Individual Score", value: "123 Runs", holder: "Brendon McCullum vs Bangladesh, 2012" },
    { label: "Most Career Wickets", value: "50 Wickets", holder: "Shakib Al Hasan (Bangladesh)" },
    { label: "Best Bowling Figures", value: "6/8", holder: "Ajantha Mendis vs Zimbabwe, 2012" },
    { label: "Most Sixes in T20 WC", value: "63 Sixes", holder: "Chris Gayle (West Indies)" },
  ];

  const venues = [
    { name: "Narendra Modi Stadium", city: "Ahmedabad", country: "India", capacity: "132,000", pitch: "World's largest stadium with fast outfield and high scoring potential." },
    { name: "Wankhede Stadium", city: "Mumbai", country: "India", capacity: "33,000", pitch: "Red soil batting paradise with true bounce and short boundaries." },
    { name: "Eden Gardens", city: "Kolkata", country: "India", capacity: "66,000", pitch: "Historic ground with electric atmosphere and good turn for spinners." },
    { name: "M. Chinnaswamy Stadium", city: "Bengaluru", country: "India", capacity: "40,000", pitch: "Highest altitude and short boundaries creating immense boundary volume." },
    { name: "MA Chidambaram Stadium (Chepauk)", city: "Chennai", country: "India", capacity: "38,000", pitch: "Dry pitch offering great grip and turn for spinners in middle overs." },
  ];

  return (
    <TournamentPage
      slug="t20-world-cup"
      name="ICC Men's T20 World Cup 2026"
      shortName="T20 WC"
      filterKeywords={["T20 World Cup", "ICC T20", "WT20", "T20WC", "World T20", "T20I", "ICC Men's T20", "T20"]}
      accentColor="#f472b6"
      seoTitle="T20 World Cup 2026 Live Score — ICC T20 WC All Matches"
      seoDesc="T20 World Cup 2026 live score with ball-by-ball commentary. All 45 ICC T20 World Cup 2026 matches covered — India, Pakistan, Australia, England and 16 teams. Updated every 15 seconds, free."
      seoKeywords="T20 World Cup 2026 live score, ICC T20 World Cup live, T20 World Cup schedule 2026, T20 World Cup standings, T20 World Cup ball by ball, T20 World Cup today match, T20 WC live score, ICC T20 2026, T20 World Cup India live, T20 World Cup Pakistan live, T20 WC 2026 groups, T20 World Cup winner 2026, India T20 World Cup 2026, ICC WT20 2026 live"
      startDate="2026-06-01"
      endDate="2026-06-29"
      stats={[
        { value: "16", label: "Global Teams" },
        { value: "45", label: "Blockbuster Matches" },
        { value: "T20", label: "20-Over Thrills" },
        { value: "Free", label: "Ball-by-Ball Live" },
      ]}
      teams={teams}
      standings={standings}
      fixtures={fixtures}
      records={records}
      venues={venues}
      faqItems={[
        {
          q: "Where can I watch T20 World Cup 2026 live score?",
          a: "Live Cricket Zone provides the fastest T20 World Cup 2026 live score with ball-by-ball commentary updated every 15 seconds. No registration or subscription required.",
        },
        {
          q: "When is the T20 World Cup 2026?",
          a: "The ICC Men's T20 World Cup 2026 takes place in June 2026, featuring 16 teams from around the world competing over 45 matches to decide the T20 world champions.",
        },
        {
          q: "What is the format of the T20 World Cup 2026?",
          a: "The T20 World Cup 2026 uses a four-group stage format with 4 teams per group. The top two from each group advance to two Super 8 groups. The Super 8 top two then meet in semi-finals, followed by the grand final.",
        },
        {
          q: "Who has won the T20 World Cup most times?",
          a: "India and West Indies have each won the T20 World Cup twice. England won in 2010 and 2022, Australia in 2021, Sri Lanka in 2014, and Pakistan in 2009. India's 2024 victory in Barbados makes them the reigning champions.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time T20 World Cup 2026 live scores with ball-by-ball commentary for all 45 ICC Men's T20 World Cup matches. The T20 World Cup is the pinnacle of international T20 cricket, bringing together the world's 16 best T20 nations to compete for cricket's most prestigious T20 title.

The tournament features 16 nations split into four groups of four, with the top two from each group advancing to two Super 8 groups. The Super 8 produces the semi-final match-ups, before the two finalists meet to decide the world champions.

Live Cricket Zone covers every ball of T20 World Cup 2026 with full commentary, scorecards, player statistics, match reports and official post-match highlights completely free.`}
    />
  );
}
