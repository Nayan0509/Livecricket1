import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function BBL() {
  const teams = [
    { name: "Perth Scorchers", flag: "🔥", captain: "Ashton Turner", titles: "5 Titles (Record Champions)" },
    { name: "Sydney Sixers", flag: "💖", captain: "Moises Henriques", titles: "3 Titles (2012, 2020, 2021)" },
    { name: "Brisbane Heat", flag: "🌊", captain: "Usman Khawaja", titles: "2 Titles (2013, 2024)" },
    { name: "Adelaide Strikers", flag: "⚡", captain: "Matthew Short", titles: "1 Title (2018)" },
    { name: "Melbourne Renegades", flag: "🔴", captain: "Nic Maddinson", titles: "1 Title (2019)" },
    { name: "Sydney Thunder", flag: "⚡", captain: "Chris Green", titles: "1 Title (2016)" },
    { name: "Hobart Hurricanes", flag: "🌀", captain: "Nathan Ellis", titles: "2-time Finalists" },
    { name: "Melbourne Stars", flag: "💚", captain: "Glenn Maxwell", titles: "3-time Finalists" },
  ];

  const standings = [
    { team: "Brisbane Heat", flag: "🌊", played: 10, won: 7, lost: 1, nrr: "+0.972", points: 16 },
    { team: "Sydney Sixers", flag: "💖", played: 10, won: 6, lost: 2, nrr: "+0.339", points: 14 },
    { team: "Perth Scorchers", flag: "🔥", played: 10, won: 6, lost: 3, nrr: "+0.725", points: 13 },
    { team: "Adelaide Strikers", flag: "⚡", played: 10, won: 5, lost: 4, nrr: "+0.331", points: 11 },
    { team: "Hobart Hurricanes", flag: "🌀", played: 10, won: 4, lost: 6, nrr: "-0.268", points: 8 },
    { team: "Melbourne Stars", flag: "💚", played: 10, won: 4, lost: 6, nrr: "-1.051", points: 8 },
    { team: "Melbourne Renegades", flag: "🔴", played: 10, won: 2, lost: 7, nrr: "-0.452", points: 5 },
    { team: "Sydney Thunder", flag: "⚡", played: 10, won: 1, lost: 7, nrr: "-0.652", points: 3 },
  ];

  const fixtures = [
    { name: "Brisbane Heat vs Melbourne Stars", stage: "Match 1", date: "Dec 15, 2026", venue: "The Gabba, Brisbane" },
    { name: "Sydney Sixers vs Melbourne Renegades", stage: "Match 2", date: "Dec 16, 2026", venue: "SCG, Sydney" },
    { name: "Perth Scorchers vs Hobart Hurricanes", stage: "Match 3", date: "Dec 17, 2026", venue: "Optus Stadium, Perth" },
    { name: "Adelaide Strikers vs Sydney Thunder", stage: "Match 4", date: "Dec 18, 2026", venue: "Adelaide Oval, Adelaide" },
    { name: "The Qualifier (1st vs 2nd)", stage: "Finals", date: "Jan 22, 2027", venue: "The Gabba, Brisbane" },
    { name: "The Knockout (3rd vs 4th)", stage: "Finals", date: "Jan 23, 2027", venue: "Optus Stadium, Perth" },
    { name: "The Challenger", stage: "Finals", date: "Jan 25, 2027", venue: "SCG, Sydney" },
    { name: "KFC BBL Grand Final", stage: "Grand Final", date: "Jan 28, 2027", venue: "The Gabba, Brisbane" },
  ];

  const records = [
    { label: "Most BBL Runs", value: "3,150 Runs", holder: "Chris Lynn" },
    { label: "Most BBL Wickets", value: "145 Wickets", holder: "Sean Abbott" },
    { label: "Highest Team Total", value: "273/2", holder: "Melbourne Stars vs Hobart Hurricanes (2022)" },
    { label: "Highest Individual Score", value: "154*", holder: "Glenn Maxwell (Melbourne Stars, 2022)" },
    { label: "Best Bowling Figures", value: "6/7", holder: "Lasith Malinga (Melbourne Stars)" },
  ];

  const venues = [
    { name: "Optus Stadium", city: "Perth", country: "Australia", capacity: "60,000", pitch: "Fast, bouncy deck with incredible carry for pace bowlers." },
    { name: "Melbourne Cricket Ground (MCG)", city: "Melbourne", country: "Australia", capacity: "100,024", pitch: "Colossal ground requiring athletic boundary running." },
    { name: "Sydney Cricket Ground (SCG)", city: "Sydney", country: "Australia", capacity: "48,000", pitch: "Historic pitch with spin assistance in second innings." },
    { name: "Adelaide Oval", city: "Adelaide", country: "Australia", capacity: "53,500", pitch: "Short square boundaries and batting-friendly strip." },
    { name: "The Gabba", city: "Brisbane", country: "Australia", capacity: "42,000", pitch: "Hard, true bounce producing massive six-hitting." },
  ];

  return (
    <TournamentPage
      slug="bbl"
      name="Big Bash League 2026"
      shortName="BBL"
      filterKeywords={["BBL", "Big Bash", "Big Bash League"]}
      accentColor="#00F0FF"
      seoTitle="BBL 2026 Live Score — Big Bash League Cricket Australia"
      seoDesc="BBL 2026 live score with ball-by-ball commentary for all Big Bash League matches. Follow Sydney Sixers, Perth Scorchers, Melbourne Stars, Brisbane Heat and all 8 teams. Updated every 15 seconds, free."
      seoKeywords="BBL 2026 live score, Big Bash League live score, BBL live today, BBL ball by ball, BBL scorecard, BBL schedule 2026, Big Bash live score, BBL match today, Sydney Sixers live, Perth Scorchers live, Melbourne Stars live, Brisbane Heat live, BBL 2026 table, Big Bash 2026 live"
      stats={[
        { value: "8", label: "Aussie Franchises" },
        { value: "61", label: "T20 Matches" },
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
          q: "Where can I watch BBL 2026 live score?",
          a: "Live Cricket Zone provides real-time BBL 2026 live score with ball-by-ball commentary for all Big Bash League matches. Updated every 15 seconds — free, no sign-up required.",
        },
        {
          q: "Who has won the most BBL titles?",
          a: "Perth Scorchers are the most successful team in BBL history with 5 championship titles, followed by Sydney Sixers with 3 titles.",
        },
        {
          q: "How many teams are in the Big Bash League?",
          a: "The Big Bash League features 8 Australian city-based teams: Perth Scorchers, Sydney Sixers, Brisbane Heat, Adelaide Strikers, Melbourne Stars, Melbourne Renegades, Hobart Hurricanes, and Sydney Thunder.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time BBL 2026 live scores with ball-by-ball commentary for every Big Bash League match. The Big Bash League is Australia's premier T20 cricket competition, launched in its franchise format in the 2011–12 season and now one of the world's best-attended and most-watched domestic T20 leagues.

Live Cricket Zone covers all BBL 2026 matches with full ball-by-ball commentary, complete scorecards, batting and bowling figures, and official post-match highlights completely free.`}
    />
  );
}
