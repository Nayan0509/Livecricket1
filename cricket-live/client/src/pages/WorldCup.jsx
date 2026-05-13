import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function WorldCup() {
  return (
    <TournamentPage
      slug="world-cup"
      name="ICC Cricket World Cup 2027"
      shortName="World Cup"
      filterKeywords={["World Cup", "ODI World Cup", "ICC World Cup", "Cricket World Cup"]}
      accentColor="#fbbf24"
      seoTitle="Cricket World Cup 2027 Live Score — ICC ODI World Cup"
      seoDesc="ICC Cricket World Cup 2027 live score with ball-by-ball commentary. All 48 matches across South Africa, Zimbabwe and Namibia covered — India, Australia, Pakistan, England and 14 nations. Updated every 15 seconds, free."
      seoKeywords="Cricket World Cup 2027 live score, ICC World Cup live, ODI World Cup live score, Cricket World Cup schedule 2027, World Cup ball by ball, ICC World Cup 2027, cricket world cup today match, India World Cup 2027, World Cup South Africa 2027, ODI World Cup qualifier, ICC CWC 2027 live, Cricket World Cup final live"
      stats={[
        { value: "14", label: "Teams" },
        { value: "48", label: "Matches" },
        { value: "ODI", label: "Format" },
        { value: "Free", label: "Coverage" },
      ]}
      teams={["India", "Pakistan", "Australia", "England", "South Africa", "New Zealand", "West Indies", "Sri Lanka", "Bangladesh", "Afghanistan", "Ireland", "Zimbabwe", "Netherlands", "Scotland"]}
      faqItems={[
        {
          q: "Where can I watch Cricket World Cup 2027 live score?",
          a: "Live Cricket Zone provides the fastest ICC Cricket World Cup 2027 live score with ball-by-ball commentary updated every 15 seconds. Free, no sign-up required.",
        },
        {
          q: "When and where is the ICC Cricket World Cup 2027?",
          a: "The ICC Cricket World Cup 2027 is scheduled to be held across South Africa, Zimbabwe and Namibia in 2027. It will be the first ODI World Cup hosted on African soil since the 2003 edition.",
        },
        {
          q: "What is the format of the 2027 Cricket World Cup?",
          a: "The ICC Cricket World Cup 2027 features 14 teams in a round-robin group stage followed by knockout semi-finals and a final. All matches are played in 50-over ODI format.",
        },
        {
          q: "How do teams qualify for the Cricket World Cup 2027?",
          a: "The top ICC ODI-ranking nations qualify automatically. Associate nations must progress through the ICC Cricket World Cup League 2 and the ICC Cricket World Cup Global Qualifier to earn the remaining berths.",
        },
        {
          q: "Who are the favourites for the Cricket World Cup 2027?",
          a: "India, Australia, England, Pakistan and South Africa — who will have home advantage — are perennial World Cup favourites. New Zealand, West Indies, Sri Lanka and Bangladesh are strong contenders, while Afghanistan continue to grow as a major upset threat.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time ICC Cricket World Cup 2027 live scores with ball-by-ball commentary for all 48 matches. The ICC Men's Cricket World Cup is the pinnacle of 50-over ODI cricket, held every four years and regarded as one of the world's great sporting events. The 2027 edition will be hosted across South Africa, Zimbabwe and Namibia — returning the ODI World Cup to African soil for the first time since 2003.

Fourteen nations will compete in the ICC Cricket World Cup 2027, beginning with a round-robin group stage that gives every team multiple opportunities to qualify for the knockout phase. The top teams from the group stage advance to semi-finals before meeting in a final that will crown the world's best ODI cricket nation. The 50-over format rewards consistent team performance across a full day's play — the full range of cricket skills from morning swing bowling to powerplay hitting, middle-overs strategic play and death-over execution are all tested across 48 matches.

Qualification for the 2027 World Cup runs through the ICC's global ranking system for established nations, while associate nations must navigate the ICC CWC League 2 and Global Qualifier. This pathway — covered comprehensively by Live Cricket Zone — gives cricketing nations from Africa, Asia, the Americas and Europe the chance to earn a place on the world's biggest ODI stage. Nations like Ireland, Afghanistan, Netherlands, Scotland and Zimbabwe have all produced memorable World Cup moments by upsetting established cricket powers.

Live Cricket Zone will provide full ball-by-ball commentary for every ICC Cricket World Cup 2027 match — complete scorecard, batting and bowling figures, toss information, player statistics, live stream links and match reports. Follow every delivery of the 2027 World Cup completely free, with real-time updates every 15 seconds.`}
    />
  );
}
