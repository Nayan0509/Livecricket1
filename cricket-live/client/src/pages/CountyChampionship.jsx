import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function CountyChampionship() {
  const teams = [
    { name: "Surrey", flag: "🦁", captain: "Rory Burns", titles: "22 Titles (Dominant Champions)" },
    { name: "Essex", flag: "🦅", captain: "Tom Westley", titles: "8 Titles (Recent Dynasties)" },
    { name: "Yorkshire", flag: "🌹", captain: "Shan Masood", titles: "33 Titles (Record Winners)" },
    { name: "Lancashire", flag: "🌹", captain: "Keaton Jennings", titles: "9 Titles (Red Rose Pride)" },
    { name: "Warwickshire", flag: "🐻", captain: "Alex Davies", titles: "8 Titles (2021 Champions)" },
    { name: "Somerset", flag: "🐉", captain: "Lewis Gregory", titles: "White-Ball Giants & Title Chasers" },
    { name: "Hampshire", flag: "👑", captain: "James Vince", titles: "2 Titles & Top 3 Regulars" },
    { name: "Nottinghamshire", flag: "🏹", captain: "Haseeb Hameed", titles: "6 Titles" },
    { name: "Durham", flag: "⚔️", captain: "Scott Borthwick", titles: "3 Titles" },
    { name: "Sussex", flag: "🦈", captain: "John Simpson", titles: "Division 1 Contenders" },
    { name: "Middlesex", flag: "🗡️", captain: "Toby Roland-Jones", titles: "11 Titles (Lord's Home)" },
    { name: "Worcestershire", flag: "🍐", captain: "Brett D'Oliveira", titles: "5 Titles" },
    { name: "Kent", flag: "🐎", captain: "Daniel Bell-Drummond", titles: "6 Titles" },
    { name: "Gloucestershire", flag: "🌲", captain: "Graeme van Buuren", titles: "Division 2 Contenders" },
    { name: "Northamptonshire", flag: "🏰", captain: "Luke Procter", titles: "Steelbacks Pride" },
    { name: "Leicestershire", flag: "🦊", captain: "Lewis Hill", titles: "3 Titles" },
    { name: "Glamorgan", flag: "🐉", captain: "Sam Northeast", titles: "3 Titles (Welsh Pride)" },
    { name: "Derbyshire", flag: "🦌", captain: "David Lloyd", titles: "1 Title" },
  ];

  const standings = [
    { team: "Surrey", flag: "🦁", played: 14, won: 8, lost: 1, nrr: "+18 Bonus", points: 221 },
    { team: "Essex", flag: "🦅", played: 14, won: 7, lost: 2, nrr: "+15 Bonus", points: 198 },
    { team: "Hampshire", flag: "👑", played: 14, won: 6, lost: 3, nrr: "+14 Bonus", points: 184 },
    { team: "Somerset", flag: "🐉", played: 14, won: 6, lost: 3, nrr: "+12 Bonus", points: 178 },
    { team: "Warwickshire", flag: "🐻", played: 14, won: 5, lost: 4, nrr: "+10 Bonus", points: 156 },
    { team: "Nottinghamshire", flag: "🏹", played: 14, won: 4, lost: 5, nrr: "+8 Bonus", points: 142 },
    { team: "Durham", flag: "⚔️", played: 14, won: 4, lost: 5, nrr: "+9 Bonus", points: 139 },
    { team: "Worcestershire", flag: "🍐", played: 14, won: 3, lost: 6, nrr: "+6 Bonus", points: 122 },
    { team: "Lancashire", flag: "🌹", played: 14, won: 2, lost: 7, nrr: "+5 Bonus", points: 110 },
    { team: "Kent", flag: "🐎", played: 14, won: 1, lost: 8, nrr: "+4 Bonus", points: 88 },
  ];

  const fixtures = [
    { name: "Surrey vs Essex", stage: "Division One", date: "Apr 04, 2026", venue: "The Kia Oval, London" },
    { name: "Yorkshire vs Lancashire (Roses Match)", stage: "Division One", date: "Apr 11, 2026", venue: "Headingley, Leeds" },
    { name: "Warwickshire vs Somerset", stage: "Division One", date: "Apr 18, 2026", venue: "Edgbaston, Birmingham" },
    { name: "Hampshire vs Nottinghamshire", stage: "Division One", date: "Apr 25, 2026", venue: "The Ageas Bowl, Southampton" },
    { name: "Middlesex vs Sussex", stage: "Division Two", date: "May 02, 2026", venue: "Lord's Cricket Ground, London" },
    { name: "Durham vs Surrey", stage: "Division One", date: "May 09, 2026", venue: "Riverside Ground, Chester-le-Street" },
  ];

  const records = [
    { label: "Most County Titles", value: "33 Titles", holder: "Yorkshire CCC" },
    { label: "Highest Individual Score", value: "501*", holder: "Brian Lara (Warwickshire vs Durham, 1994)" },
    { label: "Most First-Class Runs", value: "61,760 Runs", holder: "Sir Jack Hobbs (Surrey)" },
    { label: "Most First-Class Wickets", value: "4,204 Wickets", holder: "Wilfred Rhodes (Yorkshire)" },
    { label: "Highest Team Innings", value: "887", holder: "Yorkshire vs Warwickshire, 1896" },
  ];

  const venues = [
    { name: "Lord's Cricket Ground", city: "London", country: "England", capacity: "31,100", pitch: "Historic slope with early seam movement and classic carry." },
    { name: "The Kia Oval", city: "London", country: "England", capacity: "27,500", pitch: "Fast-scoring, true-bounce track ideal for top-order strokeplay." },
    { name: "Edgbaston", city: "Birmingham", country: "England", capacity: "25,000", pitch: "Lively surface with pace for fast bowlers and reverse swing." },
    { name: "Headingley", city: "Leeds", country: "England", capacity: "18,350", pitch: "Overhead conditions dictate swing, with turn developing on Days 3 and 4." },
    { name: "The Cooper Associates County Ground", city: "Taunton", country: "England", capacity: "8,500", pitch: "Ciderbad spin track offering massive assistance to turners." },
  ];

  return (
    <TournamentPage
      slug="county-championship"
      name="County Championship 2026"
      shortName="County"
      filterKeywords={[
        "County", "County Championship", "Division One", "Division Two",
        "Essex", "Surrey", "Yorkshire", "Lancashire", "Hampshire", "Kent",
        "Warwickshire", "Nottinghamshire", "Somerset", "Durham", "Sussex",
        "Middlesex", "Worcestershire", "Gloucestershire", "Northamptonshire",
        "Leicestershire", "Glamorgan", "Derbyshire",
      ]}
      accentColor="#003087"
      seoTitle="County Championship 2026 Live Score Today — Division One & Two Live"
      seoDesc="County Championship 2026 live scores with ball-by-ball commentary for all Division One and Division Two matches. All 18 English counties covered — Surrey, Essex, Yorkshire, Lancashire, Somerset and more. Updated every 15 seconds."
      seoKeywords="county championship 2026 live score today, county championship live score, county cricket live today, county championship today, county cricket today, division one cricket live, division two cricket live, english county cricket live, county championship results, county championship schedule 2026, surrey cricket live, yorkshire cricket live, lancashire cricket live, hampshire cricket live, kent cricket live, essex cricket live, warwickshire cricket live, somerset cricket live, nottinghamshire cricket live, durham cricket live, sussex cricket live, middlesex cricket live, worcestershire cricket live, gloucestershire cricket live, northamptonshire cricket live, leicestershire cricket live, glamorgan cricket live, derbyshire cricket live, county championship 2026 table, county cricket scores today, county cricket live score uk, county cricket ball by ball, county cricket highlights, county championship 2026 points table"
      stats={[
        { value: "18", label: "Historic Counties" },
        { value: "2", label: "Divisions" },
        { value: "98", label: "4-Day Matches" },
        { value: "Free", label: "Ball-by-Ball Live" },
      ]}
      teams={teams}
      standings={standings}
      fixtures={fixtures}
      records={records}
      venues={venues}
      faqItems={[
        {
          q: "Where can I watch County Championship 2026 live scores?",
          a: "Live Cricket Zone provides real-time County Championship 2026 live scores with ball-by-ball commentary for all Division One and Division Two matches. Every delivery is covered and the scorecard is updated every 15 seconds — free, no sign-up required.",
        },
        {
          q: "What is the County Championship?",
          a: "The County Championship is England's premier first-class cricket competition, running since 1890. It features 18 counties split into Division One and Division Two, with promotion and relegation between the two divisions each season.",
        },
        {
          q: "How many teams are in the County Championship?",
          a: "The County Championship features 18 first-class counties split into Division One (10 teams) and Division Two (8 teams). The bottom teams in Division One are relegated and replaced by the top finishers in Division Two.",
        },
        {
          q: "How long does a County Championship match last?",
          a: "County Championship matches are four-day first-class matches. Each team bats twice over the four days. Points are awarded for wins, draws and batting/bowling bonus points accumulated during the first 110 overs of each team's first innings.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time County Championship 2026 live scores with ball-by-ball commentary for every Division One and Division Two match. All 18 English counties — Surrey, Essex, Yorkshire, Lancashire, Hampshire, Kent, Warwickshire, Nottinghamshire, Somerset, Durham, Sussex, Middlesex, Worcestershire, Gloucestershire, Northamptonshire, Leicestershire, Glamorgan and Derbyshire — are covered from the first ball of the season to the last.

The County Championship is England's oldest and most prestigious domestic cricket competition, first contested in 1890. Four-day matches are played across the English summer at grounds ranging from historic Test venues like Lord's and Headingley to traditional county outgrounds.

Live Cricket Zone covers every County Championship match ball by ball with full scorecard, batting averages, bowling figures, day-by-day session reports and match results completely free.`}
    />
  );
}
