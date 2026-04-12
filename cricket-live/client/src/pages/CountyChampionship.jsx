import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function CountyChampionship() {
  return (
    <TournamentPage
      slug="county-championship"
      name="County Championship 2026"
      shortName="County"
      filterKeywords={[
        "County", "County Championship", "Division One", "Division Two",
        "Essex", "Surrey", "Yorkshire", "Lancashire", "Hampshire", "Kent",
        "Warwickshire", "Nottinghamshire", "Notts", "Somerset", "Durham", "Sussex",
        "Middlesex", "Worcestershire", "Gloucestershire", "Northamptonshire",
        "Leicestershire", "Glamorgan", "Derbyshire",
      ]}
      accentColor="#003087"
      seoTitle="County Championship 2026 Live Score Today - Essex vs Somerset, Notts vs Glamorgan"
      seoDesc="County Championship 2026 live score today: Essex vs Somerset, Notts vs Glamorgan, Surrey vs Leicestershire, Durham — Day 3 live. Ball-by-ball updates for all 18 English counties."
      seoKeywords="county championship 2026 live score today, Essex vs Somerset live score, Notts vs Glamorgan live score, Surrey vs Leicestershire live score, Durham cricket live today, county championship day 3 live, county cricket live today, county championship today, county cricket today, division one cricket live, division two cricket live, english county cricket live, county championship results today, county championship schedule 2026, surrey cricket live, yorkshire cricket live, lancashire cricket live, hampshire cricket live, kent cricket live, essex cricket live, warwickshire cricket live, somerset cricket live, nottinghamshire cricket live, durham cricket live, sussex cricket live, middlesex cricket live, worcestershire cricket live, gloucestershire cricket live, northamptonshire cricket live, leicestershire cricket live, glamorgan cricket live, derbyshire cricket live, county championship 2026 table, county cricket scores today, watch county cricket live, county cricket live stream, county cricket live score uk, county cricket live score free, Jake Weatherald county cricket, Rishi Patel county cricket, Cameron Bancroft Durham, Alex Lees Durham"
      stats={[
        { value: "18", label: "Counties" },
        { value: "2", label: "Divisions" },
        { value: "98", label: "Matches" },
        { value: "4", label: "Days/Match" },
      ]}
      teams={[
        "Surrey", "Essex", "Yorkshire", "Lancashire", "Hampshire", "Kent",
        "Warwickshire", "Nottinghamshire", "Somerset", "Durham",
        "Sussex", "Middlesex", "Worcestershire", "Gloucestershire",
        "Northamptonshire", "Leicestershire", "Glamorgan", "Derbyshire",
      ]}
      faqItems={[
        {
          q: "What county cricket matches are live today?",
          a: "Today's County Championship 2026 live matches (April 12, Day 3): Essex vs Somerset, Notts vs Glamorgan, Surrey vs Leicestershire, and Durham fixtures. Get live scores on Live Cricket Zone with ball-by-ball commentary.",
        },
        {
          q: "Where can I watch Essex vs Somerset live score today?",
          a: "Watch Essex vs Somerset live score today on Live Cricket Zone. Real-time County Championship 2026 ball-by-ball updates, batting and bowling figures updated every 15 seconds. Free, no signup required.",
        },
        {
          q: "Where can I watch Notts vs Glamorgan live score today?",
          a: "Watch Notts vs Glamorgan (Nottinghamshire vs Glamorgan) live score today on Live Cricket Zone. County Championship 2026 Day 3 live updates with full scorecard.",
        },
        {
          q: "Where can I watch Surrey vs Leicestershire live score today?",
          a: "Watch Surrey vs Leicestershire live score today on Live Cricket Zone. County Championship 2026 live ball-by-ball commentary and scorecard updated every 15 seconds.",
        },
        {
          q: "Where can I watch County Championship 2026 live scores?",
          a: "Live Cricket Zone provides real-time County Championship 2026 live scores with ball-by-ball commentary for all Division One and Division Two matches. Updated every 15 seconds.",
        },
        {
          q: "How many teams are in the County Championship?",
          a: "The County Championship features 18 first-class counties split into Division One (10 teams) and Division Two (8 teams). Teams are promoted and relegated between divisions.",
        },
        {
          q: "Can I watch County Championship live on YouTube?",
          a: "Yes — some County Championship matches are streamed live on YouTube by the ECB and county clubs. Use the Watch button on any match page to find the live stream.",
        },
      ]}
      aboutText="Live Cricket Zone is your home for County Championship 2026 live scores. Today (April 12, Day 3) features Essex vs Somerset at Chelmsford, Notts vs Glamorgan, Surrey vs Leicestershire, and Durham fixtures. Key players in action include Jake Weatherald, Rishi Patel (Essex), Cameron Bancroft and Alex Lees (Durham). We cover all 18 English counties across Division One and Division Two with real-time ball-by-ball commentary, full scorecards, batting and bowling figures, and match results. The County Championship is England's premier first-class cricket competition, running since 1890, followed by millions of cricket fans across the UK and worldwide. Get the fastest live scores right here — free, no signup required."
    />
  );
}
