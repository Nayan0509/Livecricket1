import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function ODICricket() {
  const teams = [
    { name: "India", flag: "🇮🇳", captain: "Rohit Sharma", titles: "World No. 1 ODI Side" },
    { name: "Australia", flag: "🇦🇺", captain: "Pat Cummins", titles: "6-time World Cup Champions" },
    { name: "South Africa", flag: "🇿🇦", captain: "Temba Bavuma", titles: "2027 World Cup Hosts" },
    { name: "Pakistan", flag: "🇵🇰", captain: "Babar Azam / Rizwan", titles: "Former World Champions" },
    { name: "New Zealand", flag: "🇳🇿", captain: "Tom Latham", titles: "2-time World Cup Finalists" },
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", captain: "Jos Buttler", titles: "World Champions (2019)" },
    { name: "Sri Lanka", flag: "🇱🇰", captain: "Charith Asalanka", titles: "World Champions (1996)" },
    { name: "Afghanistan", flag: "🇦🇫", captain: "Hashmatullah Shahidi", titles: "World Top 6 Contenders" },
  ];

  const standings = [
    { team: "India", flag: "🇮🇳", played: 18, won: 14, lost: 4, nrr: "Rating: 118", points: 118 },
    { team: "Australia", flag: "🇦🇺", played: 16, won: 12, lost: 4, nrr: "Rating: 114", points: 114 },
    { team: "South Africa", flag: "🇿🇦", played: 15, won: 10, lost: 5, nrr: "Rating: 108", points: 108 },
    { team: "Pakistan", flag: "🇵🇰", played: 17, won: 10, lost: 7, nrr: "Rating: 105", points: 105 },
    { team: "New Zealand", flag: "🇳🇿", played: 16, won: 9, lost: 7, nrr: "Rating: 101", points: 101 },
    { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 18, won: 9, lost: 9, nrr: "Rating: 97", points: 97 },
    { team: "Sri Lanka", flag: "🇱🇰", played: 18, won: 8, lost: 10, nrr: "Rating: 93", points: 93 },
    { team: "Afghanistan", flag: "🇦🇫", played: 16, won: 8, lost: 8, nrr: "Rating: 85", points: 85 },
  ];

  const fixtures = [
    { name: "India vs England 1st ODI", stage: "Bilateral Tour", date: "Upcoming Series", venue: "Lord's, London" },
    { name: "Australia vs South Africa 1st ODI", stage: "Bilateral Tour", date: "Upcoming Series", venue: "Wanderers, Johannesburg" },
    { name: "New Zealand vs Pakistan 1st ODI", stage: "Bilateral Tour", date: "Upcoming Series", venue: "Seddon Park, Hamilton" },
    { name: "India vs England 2nd ODI", stage: "Bilateral Tour", date: "Upcoming Series", venue: "Edgbaston, Birmingham" },
  ];

  const records = [
    { label: "Highest Individual Score", value: "264 Runs", holder: "Rohit Sharma vs Sri Lanka (2014)" },
    { label: "Highest Team Total", value: "498/4", holder: "England vs Netherlands (2022)" },
    { label: "Most ODI Centuries", value: "50 Centuries", holder: "Virat Kohli (India)" },
    { label: "Most Career ODI Runs", value: "18,426 Runs", holder: "Sachin Tendulkar (India)" },
    { label: "Most Career ODI Wickets", value: "534 Wickets", holder: "Muttiah Muralitharan (Sri Lanka)" },
    { label: "Fastest ODI Hundred", value: "31 Balls", holder: "AB de Villiers vs West Indies (2015)" },
  ];

  const venues = [
    { name: "Eden Gardens", city: "Kolkata", country: "India", capacity: "66,000", pitch: "Historic ground where Rohit Sharma scored 264." },
    { name: "Lord's Cricket Ground", city: "London", country: "England", capacity: "31,100", pitch: "Home of cricket and historic 2019 World Cup Final." },
    { name: "Melbourne Cricket Ground", city: "Melbourne", country: "Australia", capacity: "100,024", pitch: "World-class stadium and 2015 World Cup final venue." },
  ];

  return (
    <TournamentPage
      slug="odi"
      name="ODI Cricket Hub 2026"
      shortName="ODI"
      filterKeywords={["ODI", "One Day International", "One-Day", "CWC League", "ICC CWC", "Tri-Series", "One Day", "ODI Series"]}
      accentColor="#00F0FF"
      seoTitle="ODI Cricket Live Score Today — One Day International Matches"
      seoDesc="ODI cricket live score today with ball-by-ball commentary. All One Day International matches, ICC World Cup qualifiers, bilateral ODI series — live updates every 15 seconds."
      seoKeywords="ODI cricket live score today, ODI live score, One Day International live score, ODI cricket today, ODI matches today, ODI ball by ball, ODI cricket score, live ODI score, ODI cricket 2026, ODI World Cup 2027, ICC ODI rankings, 50 over cricket live"
      stats={[
        { value: "50", label: "Overs Per Side" },
        { value: "14+", label: "Global Nations" },
        { value: "ODI", label: "Format" },
        { value: "Free", label: "Ball-by-Ball Live" },
      ]}
      teams={teams}
      standings={standings}
      fixtures={fixtures}
      records={records}
      venues={venues}
      faqItems={[
        {
          q: "Where can I watch ODI cricket live score today?",
          a: "Follow any live ODI match on Live Cricket Zone — real-time ball-by-ball scorecard, live commentary and highlights updated every 15 seconds.",
        },
        {
          q: "What is ODI cricket?",
          a: "ODI (One Day International) cricket is a format where each team bats for 50 overs. It is the format used in the ICC Cricket World Cup and bilateral series between international teams.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers the fastest ODI cricket live score with real-time ball-by-ball commentary updated every 15 seconds. Follow every One Day International match played anywhere in the world — bilateral series, tri-nations, Champions Trophy, Asia Cup, and ICC ODI World Cup qualifiers — with complete live scorecards and over-by-over analysis.`}
    />
  );
}
