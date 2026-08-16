import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function ICCCWCLeague2() {
  const teams = [
    { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", captain: "Richie Berrington", titles: "League Leaders & World Cup Qualifiers" },
    { name: "Netherlands", flag: "🇳🇱", captain: "Scott Edwards", titles: "CWC 2023 Main Stage Team" },
    { name: "Namibia", flag: "🇳🇦", captain: "Gerhard Erasmus", titles: "2027 World Cup Co-Hosts" },
    { name: "Nepal", flag: "🇳🇵", captain: "Rohit Paudel", titles: "Massive Fan Base & High Climbers" },
    { name: "Oman", flag: "🇴🇲", captain: "Aqib Ilyas", titles: "Middle East Powerhouse" },
    { name: "Canada", flag: "🇨🇦", captain: "Nicholas Kirton", titles: "North American Qualifiers" },
    { name: "UAE", flag: "🇦🇪", captain: "Muhammad Waseem", titles: "Gulf Champions" },
    { name: "USA", flag: "🇺🇸", captain: "Monank Patel", titles: "T20 WC 2024 Super 8 Team" },
  ];

  const standings = [
    { team: "Netherlands", flag: "🇳🇱", played: 12, won: 9, lost: 3, nrr: "+0.850", points: 18 },
    { team: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", played: 12, won: 8, lost: 4, nrr: "+0.620", points: 16 },
    { team: "Canada", flag: "🇨🇦", played: 12, won: 7, lost: 5, nrr: "+0.210", points: 14 },
    { team: "Namibia", flag: "🇳🇦", played: 12, won: 6, lost: 6, nrr: "-0.110", points: 12 },
    { team: "Oman", flag: "🇴🇲", played: 12, won: 5, lost: 7, nrr: "-0.240", points: 10 },
    { team: "USA", flag: "🇺🇸", played: 12, won: 5, lost: 7, nrr: "-0.320", points: 10 },
    { team: "Nepal", flag: "🇳🇵", played: 12, won: 4, lost: 8, nrr: "-0.450", points: 8 },
    { team: "UAE", flag: "🇦🇪", played: 12, won: 4, lost: 8, nrr: "-0.560", points: 8 },
  ];

  const fixtures = [
    { name: "Namibia vs Scotland", stage: "Tri-Series Match 1", date: "May 10, 2026", venue: "Wanderers Cricket Ground, Windhoek" },
    { name: "Oman vs Netherlands", stage: "Tri-Series Match 2", date: "May 12, 2026", venue: "Al Amerat Cricket Ground, Muscat" },
    { name: "Nepal vs Canada", stage: "Tri-Series Match 3", date: "May 14, 2026", venue: "Tribhuvan University Ground, Kirtipur" },
    { name: "USA vs UAE", stage: "Tri-Series Match 4", date: "May 16, 2026", venue: "Grand Prairie Stadium, Dallas" },
  ];

  const records = [
    { label: "Highest Team Score in League 2", value: "377/3", holder: "Scotland vs Nepal (2023)" },
    { label: "Most Runs in League 2", value: "1,520 Runs", holder: "Gerhard Erasmus (Namibia)" },
    { label: "Most Wickets in League 2", value: "68 Wickets", holder: "Bilal Khan (Oman)" },
    { label: "Highest Individual Score", value: "173*", holder: "Jaskaran Malhotra (USA vs PNG)" },
  ];

  const venues = [
    { name: "Al Amerat Cricket Ground", city: "Muscat", country: "Oman", capacity: "4,000", pitch: "True batting deck with sea breeze in the evening." },
    { name: "Tribhuvan University International Ground", city: "Kirtipur", country: "Nepal", capacity: "25,000", pitch: "High altitude and packed crowds creating immense atmosphere." },
    { name: "Wanderers Cricket Ground", city: "Windhoek", country: "Namibia", capacity: "7,000", pitch: "Hard deck with good pace and bounce." },
    { name: "Grand Prairie Stadium", city: "Dallas, Texas", country: "USA", capacity: "15,000", pitch: "Modern facility offering high-scoring ODI matches." },
  ];

  return (
    <TournamentPage
      slug="icc-cwc-league-2"
      name="ICC CWC League 2 Hub"
      shortName="CWC League 2"
      filterKeywords={[
        "CWC League", "ICC CWC", "Namibia", "Scotland", "Oman",
        "CWC League 2", "World Cup League", "Cricket World Cup League",
      ]}
      accentColor="#B026FF"
      seoTitle="ICC CWC League 2 Live Score — ODI World Cup Qualifying"
      seoDesc="ICC Cricket World Cup League 2 live scores and ball-by-ball commentary. Follow all qualifying ODI matches as nations compete for ICC ODI World Cup berths. Updated every 15 seconds."
      seoKeywords="ICC CWC League 2 live score, ICC Cricket World Cup League 2, CWC League 2 ODI, World Cup qualifier live score, Namibia cricket live, Scotland cricket live, Oman cricket live, ODI qualifier live, cricket world cup qualifying, ICC CWC 2026"
      stats={[
        { value: "8", label: "Associate Nations" },
        { value: "50", label: "Overs" },
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
          q: "What is the ICC CWC League 2?",
          a: "The ICC Cricket World Cup League 2 is the premier qualifying pathway for associate cricket nations to reach the ICC Men's Cricket World Cup.",
        },
        {
          q: "Which teams play in ICC CWC League 2?",
          a: "The 8 associate nations in League 2 are Scotland, Netherlands, Namibia, Nepal, Oman, Canada, UAE, and USA.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time live scores and ball-by-ball commentary for all ICC Cricket World Cup League 2 matches. The CWC League 2 is the pathway for associate cricket nations to qualify for the ICC ODI World Cup — arguably the most important qualifying series in world cricket outside the ICC full-member nations.

Live Cricket Zone provides the same real-time ball-by-ball coverage for ICC CWC League 2 matches as it does for full international series — complete scorecard, batting and bowling figures, toss information and official match highlights completely free.`}
    />
  );
}
