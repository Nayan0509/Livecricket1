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
        "Warwickshire", "Nottinghamshire", "Somerset", "Durham", "Sussex",
        "Middlesex", "Worcestershire", "Gloucestershire", "Northamptonshire",
        "Leicestershire", "Glamorgan", "Derbyshire",
      ]}
      accentColor="#003087"
      seoTitle="County Championship 2026 Live Score - UK Cricket"
      seoDesc="County Championship 2026 live scores, Division One and Two results. Surrey, Yorkshire, Lancashire and all 18 English counties. Updated every 15 seconds."
      seoKeywords="county championship 2026, county championship live score, county cricket live score, county championship today, county cricket today, division one cricket, division two cricket, english county cricket, county championship results, county championship schedule, surrey cricket live, yorkshire cricket live, lancashire cricket live, hampshire cricket live, kent cricket live, essex cricket live, warwickshire cricket live, somerset cricket live, nottinghamshire cricket live, durham cricket live, sussex cricket live, middlesex cricket live, worcestershire cricket live, gloucestershire cricket live, northamptonshire cricket live, leicestershire cricket live, glamorgan cricket live, derbyshire cricket live, county championship 2026 table, county cricket scores today, watch county cricket live, county cricket live stream"
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
          q: "Where can I watch County Championship 2026 live scores?",
          a: "Live Cricket Zone provides real-time County Championship 2026 live scores with ball-by-ball commentary for all Division One and Division Two matches. Updated every 15 seconds.",
        },
        {
          q: "How many teams are in the County Championship?",
          a: "The County Championship features 18 first-class counties split into Division One (10 teams) and Division Two (8 teams). Teams are promoted and relegated between divisions.",
        },
        {
          q: "When does County Championship 2026 start?",
          a: "The County Championship 2026 season runs from April to September, with matches played across England and Wales at county grounds.",
        },
        {
          q: "Can I watch County Championship live on YouTube?",
          a: "Yes — some County Championship matches are streamed live on YouTube by the ECB and county clubs. Use the Watch button on any match page to find the live stream.",
        },
        {
          q: "Who won the County Championship recently?",
          a: "Surrey have been dominant in recent years. Check our live scores and results pages for the latest County Championship standings and results.",
        },
      ]}
      aboutText="Live Cricket Zone is your home for County Championship 2026 live scores. We cover all 18 English counties across Division One and Division Two with real-time ball-by-ball commentary, full scorecards, batting and bowling figures, and match results. The County Championship is England's premier first-class cricket competition, running since 1890, and is followed by millions of cricket fans across the UK and worldwide. Whether you support Surrey, Yorkshire, Lancashire, Hampshire, Kent or any other county, get the fastest live scores right here — free, no signup required."
    />
  );
}
