import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function AsiaCup() {
  const teams = [
    { name: "India", flag: "🇮🇳", captain: "Suryakumar Yadav / Rohit Sharma", titles: "8 Titles (Record Champions)" },
    { name: "Sri Lanka", flag: "🇱🇰", captain: "Charith Asalanka", titles: "6 Titles (Defending Quality)" },
    { name: "Pakistan", flag: "🇵🇰", captain: "Mohammad Rizwan / Babar Azam", titles: "2 Titles (2000, 2012)" },
    { name: "Bangladesh", flag: "🇧🇩", captain: "Najmul Hossain Shanto", titles: "3-time Finalists" },
    { name: "Afghanistan", flag: "🇦🇫", captain: "Rashid Khan", titles: "Dangerous Dark Horses" },
    { name: "Nepal", flag: "🇳🇵", captain: "Rohit Paudel", titles: "Premier Cup Champions" },
  ];

  const standings = [
    { team: "India", flag: "🇮🇳", played: 3, won: 3, lost: 0, nrr: "+1.420", points: 6 },
    { team: "Sri Lanka", flag: "🇱🇰", played: 3, won: 2, lost: 1, nrr: "+0.680", points: 4 },
    { team: "Pakistan", flag: "🇵🇰", played: 3, won: 2, lost: 1, nrr: "+0.450", points: 4 },
    { team: "Bangladesh", flag: "🇧🇩", played: 3, won: 1, lost: 2, nrr: "-0.210", points: 2 },
    { team: "Afghanistan", flag: "🇦🇫", played: 3, won: 1, lost: 2, nrr: "-0.740", points: 2 },
    { team: "Nepal", flag: "🇳🇵", played: 3, won: 0, lost: 3, nrr: "-1.600", points: 0 },
  ];

  const fixtures = [
    { name: "India vs Pakistan", stage: "Group Stage", date: "Sep 12, 2026", venue: "R. Premadasa Stadium, Colombo" },
    { name: "Sri Lanka vs Bangladesh", stage: "Group Stage", date: "Sep 13, 2026", venue: "Pallekele Cricket Stadium, Kandy" },
    { name: "Afghanistan vs Pakistan", stage: "Group Stage", date: "Sep 15, 2026", venue: "R. Premadasa Stadium, Colombo" },
    { name: "India vs Nepal", stage: "Group Stage", date: "Sep 16, 2026", venue: "Pallekele Cricket Stadium, Kandy" },
    { name: "Super 4 - Match 1", stage: "Super 4", date: "Sep 19, 2026", venue: "R. Premadasa Stadium, Colombo" },
    { name: "Super 4 - Match 2", stage: "Super 4", date: "Sep 20, 2026", venue: "Pallekele Cricket Stadium, Kandy" },
    { name: "Super 4 - India vs Pakistan (Rematch)", stage: "Super 4", date: "Sep 23, 2026", venue: "R. Premadasa Stadium, Colombo" },
    { name: "Grand Final", stage: "Final", date: "Sep 27, 2026", venue: "R. Premadasa Stadium, Colombo" },
  ];

  const records = [
    { label: "Highest Team Total", value: "385/7", holder: "Pakistan vs Bangladesh, 2010" },
    { label: "Most Career Runs", value: "1,220 Runs", holder: "Sanath Jayasuriya (Sri Lanka)" },
    { label: "Highest Individual Score", value: "183 Runs", holder: "Virat Kohli vs Pakistan, 2012" },
    { label: "Most Career Wickets", value: "30 Wickets", holder: "Muttiah Muralitharan (Sri Lanka)" },
    { label: "Best Bowling Figures", value: "6/13", holder: "Ajantha Mendis vs India, 2008" },
    { label: "Most 100s in Asia Cup", value: "6 Centuries", holder: "Sanath Jayasuriya" },
  ];

  const venues = [
    { name: "R. Premadasa International Cricket Stadium", city: "Colombo", country: "Sri Lanka", capacity: "35,000", pitch: "Spin-friendly pitch that rewards variations under lights." },
    { name: "Pallekele International Cricket Stadium", city: "Kandy", country: "Sri Lanka", capacity: "35,000", pitch: "Seamer friendly early on with good batting carry in evening." },
    { name: "Dubai International Cricket Stadium", city: "Dubai", country: "UAE", capacity: "25,000", pitch: "True bounce with heavy dew influence in second innings." },
  ];

  return (
    <TournamentPage
      slug="asia-cup"
      name="ACC Asia Cup 2026"
      shortName="Asia Cup"
      filterKeywords={["Asia Cup", "ACC Asia Cup", "AsiaCup"]}
      accentColor="#2dd4bf"
      seoTitle="Asia Cup 2026 Live Score — India vs Pakistan & All Matches"
      seoDesc="Asia Cup 2026 live score with ball-by-ball commentary. Follow India vs Pakistan, Sri Lanka, Bangladesh, Afghanistan and Nepal in the ACC Asia Cup 2026. Updated every 15 seconds, free."
      seoKeywords="Asia Cup 2026 live score, Asia Cup live score today, India vs Pakistan Asia Cup live, Asia Cup ball by ball, Asia Cup schedule 2026, ACC Asia Cup live, Asia Cup cricket 2026, India vs Pakistan live score Asia Cup, Asia Cup 2026 final live, Asia Cup T20 live, Asia Cup winner 2026, India Asia Cup 2026"
      stats={[
        { value: "6", label: "Continental Giants" },
        { value: "13", label: "Fierce Matches" },
        { value: "T20/ODI", label: "Dynamic Format" },
        { value: "Free", label: "Live Ball-by-Ball" },
      ]}
      teams={teams}
      standings={standings}
      fixtures={fixtures}
      records={records}
      venues={venues}
      faqItems={[
        {
          q: "Where can I watch Asia Cup 2026 live score?",
          a: "Live Cricket Zone provides real-time Asia Cup 2026 live score with ball-by-ball commentary for all matches including the India vs Pakistan live score. Updated every 15 seconds — free, no sign-up required.",
        },
        {
          q: "Which teams are in Asia Cup 2026?",
          a: "Asia Cup 2026 features 6 teams: India, Pakistan, Sri Lanka, Bangladesh, Afghanistan and Nepal competing for the Asia Cup trophy.",
        },
        {
          q: "What is the format of the Asia Cup?",
          a: "The Asia Cup alternates between ODI and T20I formats every two years. The tournament features a group stage followed by a Super 4 round, with the top two sides from the Super 4 meeting in the final.",
        },
        {
          q: "Who has won the most Asia Cup titles?",
          a: "India are the most successful Asia Cup nation with 8 titles, followed by Sri Lanka with 6 titles and Pakistan with 2 titles. The competition's history stretches back to 1984.",
        },
        {
          q: "When is the India vs Pakistan Asia Cup match?",
          a: "India vs Pakistan is the marquee encounter of the Asia Cup. Check Live Cricket Zone for real-time ball-by-ball scores, toss results, playing XIs, and highlights.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time Asia Cup 2026 live scores with ball-by-ball commentary for every match. The Asia Cup is the continent's premier cricket tournament, organized by the Asian Cricket Council (ACC) and contested by the six leading cricket nations of Asia. Since its inaugural edition in 1984, the Asia Cup has grown into one of the most watched cricket events on the global calendar.

The tournament features India, Pakistan, Sri Lanka, Bangladesh, Afghanistan and Nepal competing across a group stage and Super 4 format, culminating in a final. The Asia Cup alternates between the ODI and T20I formats every two years, meaning fans experience the full range of Asia's cricketing quality.

The marquee fixture of every Asia Cup is India vs Pakistan. Their Asia Cup clashes consistently rank among the most-watched cricket broadcasts globally, with hundreds of millions tuning in from the subcontinent alone.

Live Cricket Zone provides complete ball-by-ball coverage for all Asia Cup 2026 matches — full scorecard, batting and bowling figures, toss information, official post-match highlights and match results completely free.`}
    />
  );
}
