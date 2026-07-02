import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function PSL() {
  return (
    <TournamentPage
      slug="psl"
      name="PSL 2026"
      shortName="PSL"
      filterKeywords={["PSL", "Pakistan Super League", "HBL PSL"]}
      accentColor="#60A5FA"
      seoTitle="PSL 2026 Live Score — Pakistan Super League T20"
      seoDesc="PSL 2026 live score with ball-by-ball commentary for all Pakistan Super League matches. Follow Karachi Kings, Lahore Qalandars, Multan Sultans, Islamabad United and all 6 teams. Updated every 15 seconds, free."
      seoKeywords="PSL 2026 live score, Pakistan Super League live score, PSL live today, PSL ball by ball, PSL scorecard, PSL points table 2026, PSL schedule 2026, PSL match today, HBL PSL live score, Karachi Kings live, Lahore Qalandars live, Multan Sultans live, Islamabad United live, Babar Azam PSL, Shaheen Afridi PSL, PSL highlights"
      stats={[
        { value: "6", label: "Teams" },
        { value: "34", label: "Matches" },
        { value: "T20", label: "Format" },
        { value: "Free", label: "Coverage" },
      ]}
      teams={["Karachi Kings", "Lahore Qalandars", "Multan Sultans", "Peshawar Zalmi", "Islamabad United", "Quetta Gladiators"]}
      faqItems={[
        {
          q: "Where can I watch PSL 2026 live score?",
          a: "Live Cricket Zone provides real-time PSL 2026 live score with ball-by-ball commentary. Get Pakistan Super League live updates faster than any other cricket website — updated every 15 seconds, free, no sign-up needed.",
        },
        {
          q: "How many teams are in PSL 2026?",
          a: "PSL 2026 features 6 teams: Karachi Kings, Lahore Qalandars, Multan Sultans, Peshawar Zalmi, Islamabad United, and Quetta Gladiators. Each franchise represents one of Pakistan's major cities.",
        },
        {
          q: "When does PSL 2026 take place?",
          a: "The Pakistan Super League 2026 typically runs from February to March, with 34 matches played across Pakistan's major cricket venues in Lahore, Karachi, Rawalpindi and Multan.",
        },
        {
          q: "Who are the top players in PSL 2026?",
          a: "PSL 2026 features Pakistan's elite cricketers including Babar Azam, Shaheen Shah Afridi, Shadab Khan, Mohammad Rizwan and Fakhar Zaman, alongside international T20 specialists from Australia, England, West Indies and beyond.",
        },
        {
          q: "How can I follow PSL 2026 matches on Live Cricket Zone?",
          a: "Live Cricket Zone gives you PSL 2026 live scores, ball-by-ball commentary, full scorecards and the points table, plus official post-match highlights embedded from the league's YouTube channel. To watch matches live, use your official licensed broadcaster.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time PSL 2026 live scores with ball-by-ball commentary for every Pakistan Super League match. The PSL is Pakistan's premier T20 franchise tournament and one of the fastest-growing cricket leagues in the world. Launched in 2016 and initially held in the UAE before successfully moving to Pakistan in 2018, the PSL has become a major event in the global T20 cricket calendar.

Six franchises representing Pakistan's cricket heartlands compete for the PSL trophy: Karachi Kings, Lahore Qalandars, Multan Sultans, Peshawar Zalmi, Islamabad United and Quetta Gladiators. Matches are hosted at world-class venues including the National Stadium Karachi, Gaddafi Stadium Lahore, Rawalpindi Cricket Stadium and the Multan Cricket Stadium. The PSL's return to Pakistan has been transformative, with packed stadiums, electric atmospheres and the sight of international cricket stars performing in front of passionate home crowds. The tournament has played a crucial role in re-establishing Pakistan as a safe and vibrant host nation for international cricket.

Pakistan's best cricketers are the heartbeat of PSL — Babar Azam, the world's top-ranked white-ball batter, Shaheen Shah Afridi's searing pace, Shadab Khan's wrist spin, Mohammad Rizwan's explosive keeping and batting, and Fakhar Zaman's devastating left-hand stroke-play. These domestic stars are joined by international marquee signings who add world-class depth across all six franchises.

Live Cricket Zone provides full ball-by-ball commentary, complete scorecards, points table, player stats and official post-match highlights for every PSL 2026 match. Whether you're in Pakistan or following from abroad, track the PSL — completely free, updated every 15 seconds with no account required. To watch matches live, use your official licensed broadcaster.`}
    />
  );
}
