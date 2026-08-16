import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function CPL() {
  const teams = [
    { name: "Trinbago Knight Riders", flag: "🇹🇹", captain: "Kieron Pollard", titles: "4 Titles (2015, 2017, 2018, 2020 - Record Winners)" },
    { name: "Guyana Amazon Warriors", flag: "🇬🇾", captain: "Imran Tahir", titles: "1 Title (2023) & 5-time Finalists" },
    { name: "Saint Lucia Kings", flag: "🇱🇨", captain: "Faf du Plessis", titles: "Defending Champions (2024)" },
    { name: "Barbados Royals", flag: "🇧🇧", captain: "Rovman Powell", titles: "2 Titles (2014, 2019)" },
    { name: "St Kitts & Nevis Patriots", flag: "🇰🇳", captain: "Evin Lewis", titles: "1 Title (2021)" },
    { name: "Antigua & Barbuda Falcons", flag: "🇦🇬", captain: "Chris Green", titles: "New Caribbean Force" },
  ];

  const standings = [
    { team: "Guyana Amazon Warriors", flag: "🇬🇾", played: 10, won: 7, lost: 3, nrr: "+0.887", points: 14 },
    { team: "Saint Lucia Kings", flag: "🇱🇨", played: 10, won: 7, lost: 3, nrr: "+0.645", points: 14 },
    { team: "Trinbago Knight Riders", flag: "🇹🇹", played: 10, won: 6, lost: 4, nrr: "+0.420", points: 12 },
    { team: "Barbados Royals", flag: "🇧🇧", played: 10, won: 5, lost: 5, nrr: "-0.061", points: 10 },
    { team: "Antigua & Barbuda Falcons", flag: "🇦🇬", played: 10, won: 3, lost: 7, nrr: "-0.620", points: 6 },
    { team: "St Kitts & Nevis Patriots", flag: "🇰🇳", played: 10, won: 2, lost: 8, nrr: "-1.271", points: 4 },
  ];

  const fixtures = [
    { name: "Antigua & Barbuda Falcons vs St Kitts & Nevis Patriots", stage: "Match 1", date: "Aug 28, 2026", venue: "Sir Vivian Richards Stadium, Antigua" },
    { name: "Trinbago Knight Riders vs Guyana Amazon Warriors", stage: "Match 2", date: "Aug 30, 2026", venue: "Queen's Park Oval, Port of Spain" },
    { name: "Barbados Royals vs Saint Lucia Kings", stage: "Match 3", date: "Sep 02, 2026", venue: "Kensington Oval, Bridgetown" },
    { name: "Qualifier 1 (1st vs 2nd)", stage: "Playoffs", date: "Oct 01, 2026", venue: "Providence Stadium, Guyana" },
    { name: "Eliminator (3rd vs 4th)", stage: "Playoffs", date: "Oct 02, 2026", venue: "Providence Stadium, Guyana" },
    { name: "Qualifier 2", stage: "Playoffs", date: "Oct 04, 2026", venue: "Providence Stadium, Guyana" },
    { name: "Republic Bank CPL 2026 Grand Final", stage: "Grand Final", date: "Oct 06, 2026", venue: "Providence Stadium, Guyana" },
  ];

  const records = [
    { label: "Most CPL Runs", value: "2,763 Runs", holder: "Lendl Simmons" },
    { label: "Most CPL Wickets", value: "129 Wickets", holder: "Dwayne Bravo" },
    { label: "Highest Team Score", value: "267/2", holder: "Trinbago Knight Riders vs Jamaica (2019)" },
    { label: "Highest Individual Score", value: "132*", holder: "Brandon King (Guyana Amazon Warriors)" },
    { label: "Most CPL Titles", value: "4 Titles", holder: "Trinbago Knight Riders" },
  ];

  const venues = [
    { name: "Providence Stadium", city: "Georgetown", country: "Guyana", capacity: "15,000", pitch: "Slow, spin-friendly surface rewarding disciplined bowling." },
    { name: "Queen's Park Oval", city: "Port of Spain", country: "Trinidad", capacity: "20,000", pitch: "Historic ground with fast outfield and high energy." },
    { name: "Kensington Oval", city: "Bridgetown", country: "Barbados", capacity: "28,000", pitch: "True pace and bounce offering great strokeplay." },
    { name: "Daren Sammy Cricket Ground", city: "Gros Islet", country: "Saint Lucia", capacity: "15,000", pitch: "Breezy conditions assisting early swing." },
    { name: "Sir Vivian Richards Stadium", city: "North Sound", country: "Antigua", capacity: "10,000", pitch: "Balanced pitch with true carry." },
  ];

  return (
    <TournamentPage
      slug="cpl"
      name="Caribbean Premier League 2026"
      shortName="CPL"
      filterKeywords={["CPL", "Caribbean Premier League", "Caribbean Premier"]}
      accentColor="#00F0FF"
      seoTitle="CPL 2026 Live Score — Caribbean Premier League T20"
      seoDesc="CPL 2026 live score with ball-by-ball commentary for all Caribbean Premier League matches. Follow Trinbago Knight Riders, Barbados Royals, Guyana Amazon Warriors, Saint Lucia Kings and all 6 teams. Updated every 15 seconds, free."
      seoKeywords="CPL 2026 live score, Caribbean Premier League live score, CPL live today, CPL ball by ball, CPL scorecard, CPL schedule 2026, Caribbean Premier League live, CPL T20 live, CPL highlights, Trinbago Knight Riders live, Barbados Royals live, Guyana Amazon Warriors live, CPL 2026 points table"
      stats={[
        { value: "6", label: "Caribbean Islands" },
        { value: "34", label: "Carnival T20s" },
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
          q: "Where can I watch CPL 2026 live score?",
          a: "Live Cricket Zone provides real-time CPL 2026 live score with ball-by-ball commentary for all Caribbean Premier League matches. Updated every 15 seconds — free, no sign-up required.",
        },
        {
          q: "Who has won the most CPL titles?",
          a: "Trinbago Knight Riders are the most decorated CPL team with 4 championship titles (2015, 2017, 2018, 2020), followed by Barbados Royals with 2 titles.",
        },
        {
          q: "Which teams compete in the Caribbean Premier League?",
          a: "The six CPL teams are Trinbago Knight Riders, Guyana Amazon Warriors, Saint Lucia Kings, Barbados Royals, Antigua & Barbuda Falcons, and St Kitts & Nevis Patriots.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time CPL 2026 live scores with ball-by-ball commentary for every Caribbean Premier League match. The CPL is the Caribbean's premier T20 franchise tournament, attracting top West Indian talent and global T20 stars to compete across the six island nations that make up the Caribbean cricket heartland.

Live Cricket Zone covers all CPL 2026 matches with complete scorecards, batting and bowling figures, and official post-match highlights completely free.`}
    />
  );
}
