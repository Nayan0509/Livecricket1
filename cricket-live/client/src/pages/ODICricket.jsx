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
      seoTitle="ODI Cricket Live Score Today - Namibia vs Scotland ICC CWC League 2"
      seoDesc="ODI cricket live score today: Namibia vs Scotland (ICC CWC League 2, Windhoek) live now. Real-time One Day International match updates with ball-by-ball commentary."
      seoKeywords="ODI cricket live score today, Namibia vs Scotland live score, NAM vs SCO live score, Namibia vs Scotland ICC CWC League 2, NAM vs SCO today, Namibia cricket live, Scotland cricket live, ICC CWC League 2 live score, ICC CWC League 2 2026, Windhoek cricket live, ODI live score today, One Day International live, ODI cricket today, ODI matches today, ODI ball by ball, ODI cricket score, live ODI score, ODI cricket 2026, ODI World Cup qualifier live, cricket world cup league 2 live, Namibia batting live, Scotland cricket score today"
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
          q: "Where can I watch Namibia vs Scotland live score today?",
          a: "Watch Namibia vs Scotland (NAM vs SCO) live score today on Live Cricket Zone. ICC CWC League 2 ODI at Wanderers Cricket Ground, Windhoek. Real-time ball-by-ball commentary updated every 15 seconds. Free, no signup.",
        },
        {
          q: "What is the ICC CWC League 2?",
          a: "The ICC Cricket World Cup League 2 is a qualifying pathway for the ICC Cricket World Cup. The 2026 Namibia Tri-Nation Series features Namibia, Scotland and Oman playing ODIs in Windhoek from April 2–12, 2026.",
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
      aboutText="Live Cricket Zone delivers the fastest ODI cricket live score with real-time ball-by-ball commentary. Today (April 12): Namibia vs Scotland in the ICC CWC League 2 at Wanderers Cricket Ground, Windhoek — Namibia are batting in this 50-over ODI. The 2026 Namibia Tri-Nation Series (Namibia, Scotland, Oman) is the final round of the 2024–2026 ICC Cricket World Cup League 2 qualifying pathway. Follow every ODI series, ICC Cricket World Cup qualifier and bilateral series with live scorecard, player stats and match results updated every 15 seconds."
    />
  );
}
