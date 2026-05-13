import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function ODICricket() {
  return (
    <TournamentPage
      slug="odi"
      name="ODI Cricket 2026"
      shortName="ODI"
      filterKeywords={["ODI", "One Day International", "One-Day", "Namibia", "Scotland", "CWC League", "ICC CWC"]}
      accentColor="#38bdf8"
      seoTitle="ODI Cricket Live Score Today — One Day International Matches"
      seoDesc="ODI cricket live score today with ball-by-ball commentary. All One Day International matches, ICC World Cup qualifiers, bilateral ODI series — live updates every 15 seconds."
      seoKeywords="ODI cricket live score today, ODI live score, One Day International live score, ODI cricket today, ODI matches today, ODI ball by ball, ODI cricket score, live ODI score, ODI cricket 2026, ODI World Cup 2027, ICC ODI rankings, 50 over cricket live"
      stats={[
        { value: "50", label: "Overs" },
        { value: "3", label: "Nations", },
        { value: "ODI", label: "Format" },
        { value: "Live", label: "Now" },
      ]}
      teams={[
        "Namibia", "Scotland", "Oman",
        "India", "Australia", "England", "Pakistan",
        "South Africa", "New Zealand", "West Indies",
        "Sri Lanka", "Bangladesh", "Afghanistan",
      ]}
      faqItems={[
        {
          q: "Where can I watch ODI cricket live score today?",
          a: "Watch any live ODI match on Live Cricket Zone — click the match to get a real-time ball-by-ball scorecard, live commentary, and free streaming links. Updated every 15 seconds, no sign-up needed.",
        },
        {
          q: "What is the ICC CWC League 2?",
          a: "The ICC Cricket World Cup League 2 is a qualifying pathway for the ICC ODI World Cup. Associate nations compete in tri-series and qualifying events to earn a place in the global qualifier and ultimately the World Cup.",
        },
        {
          q: "Where can I watch ODI cricket live score today?",
          a: "Live Cricket Zone provides real-time ODI cricket live score with ball-by-ball commentary for all One Day International matches including ICC CWC League 2.",
        },
        {
          q: "What is ODI cricket?",
          a: "ODI (One Day International) cricket is a format where each team bats for 50 overs. It's the format used in the ICC Cricket World Cup and bilateral series between international teams.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers the fastest ODI cricket live score with real-time ball-by-ball commentary updated every 15 seconds. Follow every One Day International match played anywhere in the world — bilateral series, tri-nations, Champions Trophy, Asia Cup, and ICC ODI World Cup qualifiers — with complete live scorecard and over-by-over analysis.

One Day International cricket is cricket's 50-over format and the foundation of the ICC World Cup cycle. Two teams each bat for a maximum of 50 overs, making strategic use of powerplay restrictions, batting depth, and death-over execution. ODIs produce the most varied cricket — from aggressive power-hitting openers to defensive 50th-over finishers, from swing bowlers exploiting morning conditions to spinners tightening up the middle overs.

The ICC Men's Cricket World Cup 2027 in South Africa, Zimbabwe and Namibia will be the pinnacle of ODI cricket in the coming years. The qualification pathway — through ICC CWC League 2 and the Global Qualifier — has nations from across Africa, Asia, Americas, and Europe competing intensely for a place among the top 10 ODI nations. Live Cricket Zone covers all of these qualifying matches with the same detail as full bilateral international series.

Current ODI cricket follows the ICC Future Tours Programme (FTP), with India, Australia, England, Pakistan, South Africa, New Zealand, West Indies, Sri Lanka, Bangladesh and Afghanistan all playing bilateral ODI series throughout 2025–2026. Live Cricket Zone's coverage includes live ball-by-ball commentary, match scorecards, team line-ups, toss results and player statistics for every match.`}
    />
  );
}
