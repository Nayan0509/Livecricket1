import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function CPL() {
  return (
    <TournamentPage
      slug="cpl"
      name="CPL 2026"
      shortName="CPL"
      filterKeywords={["CPL", "Caribbean Premier League", "Caribbean Premier"]}
      accentColor="#38bdf8"
      seoTitle="CPL 2026 Live Score — Caribbean Premier League T20"
      seoDesc="CPL 2026 live score with ball-by-ball commentary for all Caribbean Premier League matches. Follow Trinbago Knight Riders, Barbados Royals, Guyana Amazon Warriors, Jamaica Tallawahs and more. Updated every 15 seconds, free."
      seoKeywords="CPL 2026 live score, Caribbean Premier League live score, CPL live today, CPL ball by ball, CPL scorecard, CPL schedule 2026, Caribbean Premier League live, CPL T20 live, CPL highlights, Trinbago Knight Riders live, Barbados Royals live, Guyana Amazon Warriors live, Jamaica Tallawahs live, CPL 2026 points table"
      stats={[
        { value: "6", label: "Teams" },
        { value: "34", label: "Matches" },
        { value: "T20", label: "Format" },
        { value: "Free", label: "Coverage" },
      ]}
      teams={["Trinbago Knight Riders", "Barbados Royals", "Guyana Amazon Warriors", "Jamaica Tallawahs", "St Kitts & Nevis Patriots", "Saint Lucia Kings"]}
      faqItems={[
        {
          q: "Where can I watch CPL 2026 live score?",
          a: "Live Cricket Zone provides real-time CPL 2026 live score with ball-by-ball commentary for all Caribbean Premier League matches. Updated every 15 seconds — free, no sign-up required.",
        },
        {
          q: "When does CPL 2026 start?",
          a: "The Caribbean Premier League 2026 typically runs from August to September. Six franchises from across the Caribbean region compete in a T20 tournament format with a double round-robin league stage followed by knockout playoffs.",
        },
        {
          q: "Which teams are in CPL 2026?",
          a: "CPL 2026 features six Caribbean franchises: Trinbago Knight Riders (Trinidad & Tobago), Barbados Royals, Guyana Amazon Warriors, Jamaica Tallawahs, St Kitts & Nevis Patriots, and Saint Lucia Kings.",
        },
        {
          q: "Who are the top players in CPL 2026?",
          a: "The CPL attracts top West Indian and international T20 stars. Players like Kieron Pollard, Sunil Narine, Shimron Hetmyer, Andre Russell and Nicholas Pooran have all featured prominently in CPL history alongside leading international signings.",
        },
        {
          q: "What format is the CPL played in?",
          a: "The Caribbean Premier League is a T20 franchise tournament. Each team faces the other five franchises twice in the league stage, with the top four teams advancing to the knockout playoffs — two semi-finals and a final.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time CPL 2026 live scores with ball-by-ball commentary for every Caribbean Premier League match. The CPL is the Caribbean's premier T20 franchise tournament, attracting top West Indian talent and global T20 stars to compete across the six island nations that make up the Caribbean cricket heartland.

Founded in 2013, the Caribbean Premier League has established itself as one of the world's top five T20 leagues. Six franchises — Trinbago Knight Riders, Barbados Royals, Guyana Amazon Warriors, Jamaica Tallawahs, St Kitts & Nevis Patriots and Saint Lucia Kings — each represent a different Caribbean island, creating fierce local rivalries and passionate crowd support throughout the tournament.

The CPL follows a T20 franchise format: a double round-robin league stage where every team plays each other twice, followed by knockout semi-finals and a final. The tournament typically runs through August and September, filling the cricket calendar during the Caribbean summer. Matches are played at iconic grounds such as the Queen's Park Oval in Trinidad, Kensington Oval in Barbados and Sabina Park in Jamaica. Legendary West Indian players including Chris Gayle, Kieron Pollard, Dwayne Bravo, Sunil Narine and Andre Russell have all been pivotal figures in CPL history, and the tournament continues to serve as an important showcase for the next generation of West Indies international talent.

Live Cricket Zone covers all CPL 2026 matches with the same real-time ball-by-ball detail as any international series — full scorecard, batting and bowling figures, toss information, official post-match highlights and match results. Follow every six, wicket and boundary from the Caribbean, completely free with no account required. To watch matches live, use your official licensed broadcaster.`}
    />
  );
}
