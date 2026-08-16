import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function WorldCup() {
  const teams = [
    { name: "Australia", flag: "🇦🇺", captain: "Pat Cummins", titles: "6 Titles (Record Champions)" },
    { name: "India", flag: "🇮🇳", captain: "Rohit Sharma / Shubman Gill", titles: "2 Titles (1983, 2011)" },
    { name: "West Indies", flag: "🌴", captain: "Shai Hope", titles: "2 Titles (1975, 1979)" },
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", captain: "Jos Buttler", titles: "1 Title (2019)" },
    { name: "Pakistan", flag: "🇵🇰", captain: "Babar Azam", titles: "1 Title (1992)" },
    { name: "Sri Lanka", flag: "🇱🇰", captain: "Charith Asalanka", titles: "1 Title (1996)" },
    { name: "South Africa", flag: "🇿🇦", captain: "Temba Bavuma", titles: "Co-Hosts & Semi-Finalists" },
    { name: "New Zealand", flag: "🇳🇿", captain: "Tom Latham", titles: "2-time Finalists (2015, 2019)" },
    { name: "Afghanistan", flag: "🇦🇫", captain: "Hashmatullah Shahidi", titles: "Top 6 Finish (2023)" },
    { name: "Bangladesh", flag: "🇧🇩", captain: "Najmul Hossain Shanto", titles: "Quarter-Finalists" },
    { name: "Zimbabwe", flag: "🇿🇼", captain: "Craig Ervine", titles: "Co-Hosts" },
    { name: "Namibia", flag: "🇳🇦", captain: "Gerhard Erasmus", titles: "Co-Hosts" },
    { name: "Netherlands", flag: "🇳🇱", captain: "Scott Edwards", titles: "Main Stage Regulars" },
    { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", captain: "Richie Berrington", titles: "Global Qualifiers" },
  ];

  const standings = [
    { team: "India", flag: "🇮🇳", played: 9, won: 9, lost: 0, nrr: "+2.570", points: 18 },
    { team: "South Africa", flag: "🇿🇦", played: 9, won: 7, lost: 2, nrr: "+1.261", points: 14 },
    { team: "Australia", flag: "🇦🇺", played: 9, won: 7, lost: 2, nrr: "+0.841", points: 14 },
    { team: "New Zealand", flag: "🇳🇿", played: 9, won: 5, lost: 4, nrr: "+0.743", points: 10 },
    { team: "Pakistan", flag: "🇵🇰", played: 9, won: 4, lost: 5, nrr: "-0.198", points: 8 },
    { team: "Afghanistan", flag: "🇦🇫", played: 9, won: 4, lost: 5, nrr: "-0.336", points: 8 },
    { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 9, won: 3, lost: 6, nrr: "-0.572", points: 6 },
    { team: "Bangladesh", flag: "🇧🇩", played: 9, won: 2, lost: 7, nrr: "-1.087", points: 4 },
    { team: "Sri Lanka", flag: "🇱🇰", played: 9, won: 2, lost: 7, nrr: "-1.419", points: 4 },
    { team: "Netherlands", flag: "🇳🇱", played: 9, won: 2, lost: 7, nrr: "-1.825", points: 4 },
  ];

  const fixtures = [
    { name: "South Africa vs Australia (Opening Match)", stage: "Group Stage", date: "Oct 08, 2027", venue: "Wanderers Stadium, Johannesburg" },
    { name: "India vs Pakistan (Blockbuster)", stage: "Group Stage", date: "Oct 14, 2027", venue: "SuperSport Park, Centurion" },
    { name: "England vs New Zealand", stage: "Group Stage", date: "Oct 18, 2027", venue: "Newlands Cricket Ground, Cape Town" },
    { name: "Zimbabwe vs West Indies", stage: "Group Stage", date: "Oct 22, 2027", venue: "Harare Sports Club, Harare" },
    { name: "Semi-Final 1 (1st vs 4th)", stage: "Semi-Final", date: "Nov 17, 2027", venue: "Wanderers Stadium, Johannesburg" },
    { name: "Semi-Final 2 (2nd vs 3rd)", stage: "Semi-Final", date: "Nov 18, 2027", venue: "Kingsmead, Durban" },
    { name: "ICC Cricket World Cup 2027 Grand Final", stage: "Grand Final", date: "Nov 21, 2027", venue: "Wanderers Stadium, Johannesburg" },
  ];

  const records = [
    { label: "Highest Team Total", value: "428/5", holder: "South Africa vs Sri Lanka, 2023" },
    { label: "Most World Cup Runs", value: "2,278 Runs", holder: "Sachin Tendulkar (India)" },
    { label: "Most Runs in Single CWC", value: "765 Runs", holder: "Virat Kohli (2023 Edition)" },
    { label: "Most World Cup Wickets", value: "71 Wickets", holder: "Glenn McGrath (Australia)" },
    { label: "Most Centuries in CWC", value: "7 Centuries", holder: "Rohit Sharma (India)" },
    { label: "Best Bowling Figures", value: "7/15", holder: "Glenn McGrath vs Namibia, 2003" },
  ];

  const venues = [
    { name: "The Wanderers Stadium", city: "Johannesburg", country: "South Africa", capacity: "34,000", pitch: "Bullring stadium with lively bounce and fast outfield." },
    { name: "Newlands Cricket Ground", city: "Cape Town", country: "South Africa", capacity: "25,000", pitch: "Scenic ground beneath Table Mountain offering seam and swing." },
    { name: "SuperSport Park", city: "Centurion", country: "South Africa", capacity: "22,000", pitch: "Pacey wicket with steep bounce rewarding genuine fast bowling." },
    { name: "Kingsmead Cricket Ground", city: "Durban", country: "South Africa", capacity: "25,000", pitch: "Humid coastal air creating early morning swing." },
    { name: "Harare Sports Club", city: "Harare", country: "Zimbabwe", capacity: "10,000", pitch: "Classic batting surface with true bounce." },
    { name: "Wanderers Cricket Ground", city: "Windhoek", country: "Namibia", capacity: "7,000", pitch: "Dry pitch offering good carry for shotmakers." },
  ];

  return (
    <TournamentPage
      slug="world-cup"
      name="ICC Cricket World Cup 2027"
      shortName="World Cup"
      filterKeywords={["World Cup", "ODI World Cup", "ICC World Cup", "Cricket World Cup", "CWC"]}
      accentColor="#00F0FF"
      seoTitle="Cricket World Cup 2027 Live Score — ICC ODI World Cup"
      seoDesc="ICC Cricket World Cup 2027 live score with ball-by-ball commentary. All 48 matches across South Africa, Zimbabwe and Namibia covered — India, Australia, Pakistan, England and 14 nations. Updated every 15 seconds, free."
      seoKeywords="Cricket World Cup 2027 live score, ICC World Cup live, ODI World Cup live score, Cricket World Cup schedule 2027, World Cup ball by ball, ICC World Cup 2027, cricket world cup today match, India World Cup 2027, World Cup South Africa 2027, ODI World Cup qualifier, ICC CWC 2027 live, Cricket World Cup final live"
      stats={[
        { value: "14", label: "Global Nations" },
        { value: "48", label: "50-Over Battles" },
        { value: "ODI", label: "Historic Format" },
        { value: "Free", label: "Live Ball-by-Ball" },
      ]}
      teams={teams}
      standings={standings}
      fixtures={fixtures}
      records={records}
      venues={venues}
      faqItems={[
        {
          q: "Where can I watch Cricket World Cup 2027 live score?",
          a: "Live Cricket Zone provides the fastest ICC Cricket World Cup 2027 live score with ball-by-ball commentary updated every 15 seconds. Free, no sign-up required.",
        },
        {
          q: "When and where is the ICC Cricket World Cup 2027?",
          a: "The ICC Cricket World Cup 2027 will be co-hosted by South Africa, Zimbabwe, and Namibia across 48 ODI matches.",
        },
        {
          q: "What is the format of the 2027 Cricket World Cup?",
          a: "The ICC Cricket World Cup 2027 features 14 teams in a round-robin group stage followed by knockout semi-finals and a final. All matches are played in 50-over ODI format.",
        },
        {
          q: "Who has won the most Cricket World Cup titles?",
          a: "Australia is the most decorated World Cup nation with 6 titles (1987, 1999, 2003, 2007, 2015, 2023). India and West Indies have won twice each, while England, Pakistan, and Sri Lanka have won once.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time ICC Cricket World Cup 2027 live scores with ball-by-ball commentary for all 48 matches. The ICC Men's Cricket World Cup is the pinnacle of 50-over ODI cricket, held every four years and regarded as one of the world's great sporting events. The 2027 edition will be hosted across South Africa, Zimbabwe and Namibia — returning the ODI World Cup to African soil for the first time since 2003.

Fourteen nations will compete in the ICC Cricket World Cup 2027 across 48 matches, culminating in the grand final in Johannesburg.

Live Cricket Zone provides full ball-by-ball commentary for every ICC Cricket World Cup 2027 match — complete scorecards, batting and bowling figures, toss information, player statistics, official post-match highlights and match reports completely free.`}
    />
  );
}
