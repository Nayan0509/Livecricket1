import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function ChampionsTrophy() {
  const teams = [
    { name: "India", flag: "🇮🇳", captain: "Rohit Sharma", titles: "2 Titles (2002, 2013)" },
    { name: "Australia", flag: "🇦🇺", captain: "Pat Cummins", titles: "2 Titles (2006, 2009)" },
    { name: "Pakistan", flag: "🇵🇰", captain: "Babar Azam", titles: "1 Title (2017)" },
    { name: "South Africa", flag: "🇿🇦", captain: "Temba Bavuma", titles: "1 Title (1998)" },
    { name: "New Zealand", flag: "🇳🇿", captain: "Mitchell Santner", titles: "1 Title (2000)" },
    { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", captain: "Jos Buttler", titles: "Runners-Up (2004, 2013)" },
    { name: "Afghanistan", flag: "🇦🇫", captain: "Hashmatullah Shahidi", titles: "Semi-Finalist" },
    { name: "Bangladesh", flag: "🇧🇩", captain: "Najmul Hossain Shanto", titles: "Semi-Finalist (2017)" },
  ];

  const standings = [
    { team: "India", flag: "🇮🇳", played: 3, won: 3, lost: 0, nrr: "+1.250", points: 6 },
    { team: "Australia", flag: "🇦🇺", played: 3, won: 2, lost: 1, nrr: "+0.840", points: 4 },
    { team: "South Africa", flag: "🇿🇦", played: 3, won: 2, lost: 1, nrr: "+0.320", points: 4 },
    { team: "Pakistan", flag: "🇵🇰", played: 3, won: 1, lost: 2, nrr: "-0.150", points: 2 },
    { team: "New Zealand", flag: "🇳🇿", played: 3, won: 1, lost: 2, nrr: "-0.410", points: 2 },
    { team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 3, won: 1, lost: 2, nrr: "-0.550", points: 2 },
    { team: "Afghanistan", flag: "🇦🇫", played: 3, won: 1, lost: 2, nrr: "-0.620", points: 2 },
    { team: "Bangladesh", flag: "🇧🇩", played: 3, won: 0, lost: 3, nrr: "-0.880", points: 0 },
  ];

  const fixtures = [
    { name: "India vs Pakistan", stage: "Group A", date: "Feb 23, 2025", venue: "Dubai International Stadium" },
    { name: "Australia vs England", stage: "Group B", date: "Feb 24, 2025", venue: "Gaddafi Stadium, Lahore" },
    { name: "South Africa vs Afghanistan", stage: "Group B", date: "Feb 25, 2025", venue: "National Stadium, Karachi" },
    { name: "New Zealand vs India", stage: "Group A", date: "Feb 27, 2025", venue: "Dubai International Stadium" },
    { name: "Pakistan vs Bangladesh", stage: "Group A", date: "Feb 28, 2025", venue: "Rawalpindi Cricket Stadium" },
    { name: "Semi-Final 1 (A1 vs B2)", stage: "Semi-Final", date: "Mar 04, 2025", venue: "Dubai International Stadium" },
    { name: "Semi-Final 2 (B1 vs A2)", stage: "Semi-Final", date: "Mar 05, 2025", venue: "Gaddafi Stadium, Lahore" },
    { name: "Grand Final", stage: "Final", date: "Mar 09, 2025", venue: "Dubai International Stadium" },
  ];

  const records = [
    { label: "Highest Team Total", value: "347/4", holder: "New Zealand vs USA, 2004" },
    { label: "Most Career Runs", value: "791 Runs", holder: "Chris Gayle (West Indies)" },
    { label: "Highest Individual Score", value: "145*", holder: "Nathan Astle vs USA, 2004" },
    { label: "Most Career Wickets", value: "28 Wickets", holder: "Kyle Mills (New Zealand)" },
    { label: "Best Bowling Figures", value: "6/52", holder: "Josh Hazlewood vs NZ, 2017" },
    { label: "Most Centuries", value: "3 Centuries", holder: "Sourav Ganguly, Chris Gayle, Shikhar Dhawan" },
  ];

  const venues = [
    { name: "Dubai International Stadium", city: "Dubai", country: "UAE", capacity: "25,000", pitch: "Balanced pitch with true bounce and dew factor under lights." },
    { name: "Gaddafi Stadium", city: "Lahore", country: "Pakistan", capacity: "27,000", pitch: "High-scoring batting track with reverse swing in death overs." },
    { name: "National Stadium", city: "Karachi", country: "Pakistan", capacity: "34,228", pitch: "Fast-scoring ground with seam movement early on." },
    { name: "Rawalpindi Cricket Stadium", city: "Rawalpindi", country: "Pakistan", capacity: "15,000", pitch: "Flat deck with high-paced scoring and short boundaries." },
  ];

  return (
    <TournamentPage
      slug="champions-trophy"
      name="ICC Champions Trophy 2025"
      shortName="Champions Trophy"
      filterKeywords={["Champions Trophy", "ICC Champions Trophy", "CT 2025", "CT"]}
      accentColor="#FF2E9A"
      seoTitle="Champions Trophy 2025 Live Score — ICC CT 2025 All Matches"
      seoDesc="ICC Champions Trophy 2025 live score with ball-by-ball commentary. All 15 matches covered — India, Pakistan, Australia, England, South Africa and all 8 teams. Updated every 15 seconds, free."
      seoKeywords="Champions Trophy 2025 live score, ICC Champions Trophy live, Champions Trophy live score today, Champions Trophy ball by ball, Champions Trophy schedule 2025, ICC CT 2025 live, India vs Pakistan Champions Trophy live, Champions Trophy final live, ICC Champions Trophy 2025 winner, Champions Trophy India live, India Champions Trophy 2025"
      stats={[
        { value: "8", label: "Elite Teams" },
        { value: "15", label: "High-Octane Matches" },
        { value: "ODI", label: "50-Over Format" },
        { value: "Free", label: "Live Ball-by-Ball" },
      ]}
      teams={teams}
      standings={standings}
      fixtures={fixtures}
      records={records}
      venues={venues}
      faqItems={[
        {
          q: "Where can I watch Champions Trophy 2025 live score?",
          a: "Live Cricket Zone provides real-time ICC Champions Trophy 2025 live score with ball-by-ball commentary updated every 15 seconds. Free, no sign-up required.",
        },
        {
          q: "Which teams are in ICC Champions Trophy 2025?",
          a: "ICC Champions Trophy 2025 features 8 teams: India, Pakistan, Australia, England, South Africa, New Zealand, Bangladesh and Afghanistan — the top 8 nations in the ICC ODI rankings.",
        },
        {
          q: "What is the format of the Champions Trophy?",
          a: "The ICC Champions Trophy features 8 teams split into two groups of four. The top two from each group advance to semi-finals, followed by a final. All matches are played in 50-over ODI format, making it a compact 15-match tournament.",
        },
        {
          q: "Who has won the ICC Champions Trophy the most times?",
          a: "India and Australia are joint-most successful with two Champions Trophy titles each. Pakistan won in 2017, West Indies in 2004, Sri Lanka shared the trophy in 2002, and South Africa won in 1998.",
        },
        {
          q: "What makes the Champions Trophy different from the ODI World Cup?",
          a: "The Champions Trophy is often called the 'mini World Cup' — it features only the top 8 ODI nations, meaning every match is between elite teams. There are no mismatches, producing knockout-level intensity from the opening ball.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time ICC Champions Trophy 2025 live scores with ball-by-ball commentary for all 15 matches. The ICC Champions Trophy is one of cricket's most prestigious events — a compact, high-intensity ODI tournament reserved exclusively for the top 8 nations in the ICC ODI rankings. First contested in 1998, the Champions Trophy returns in 2025 after an eight-year gap following the 2017 edition, making it one of the most anticipated cricket events in recent memory.

The format is deliberately compact and high-quality: 8 elite nations split into two groups of four, with the top two from each group advancing to semi-finals before the final. There are no easy matches — every game is a contest between world-class ODI sides, producing a tournament where the group stage already has the intensity of knockout cricket. With just 15 matches total, every result matters from the opening ball.

India vs Pakistan in the Champions Trophy is a match of extraordinary significance. The two nations rarely meet in bilateral cricket, meaning ICC events provide the only regular competitive platform. Their 2017 Champions Trophy final remains one of ODI cricket's most dramatic results.

Live Cricket Zone covers every Champions Trophy 2025 match with full ball-by-ball commentary, complete scorecards, batting and bowling figures, toss updates, official post-match highlights and match results. Whether it's the opening group match or the final itself, follow all ICC Champions Trophy 2025 action completely free.`}
    />
  );
}
