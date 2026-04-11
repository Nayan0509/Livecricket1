import React from "react";
import { Link } from "react-router-dom";
import TournamentPage from "../components/TournamentPage";

export default function T20Cricket() {
  return (
    <TournamentPage
      slug="t20"
      name="T20 Cricket 2026"
      shortName="T20"
      filterKeywords={["T20", "Twenty20", "T20I"]}
      accentColor="#818cf8"
      seoTitle="T20 Cricket Live Score Today - All T20 Matches & Ball by Ball Commentary"
      seoDesc="T20 cricket live score today. Get real-time updates for all T20 matches — IPL 2026, T20 World Cup, PSL, BBL, CPL, BPL — with ball-by-ball commentary updated every 15 seconds."
      seoKeywords="T20 cricket live score, T20 live score today, T20 cricket today, T20 matches today, T20 cricket live, T20 ball by ball, T20 cricket score, live T20 score, T20 cricket 2026, T20 international live"
      stats={[
        { value: "IPL", label: "10 Teams" },
        { value: "T20 WC", label: "16 Teams" },
        { value: "PSL", label: "6 Teams" },
        { value: "BBL", label: "8 Teams" },
      ]}
      teams={["IPL 2026", "T20 World Cup 2026", "PSL 2026", "BBL 2026", "CPL 2026", "BPL 2026", "T20 Internationals", "Women's T20"]}
      faqItems={[
        { q: "Where can I watch T20 cricket live score today?", a: "Live Cricket Zone provides the fastest T20 cricket live score today with ball-by-ball commentary for all T20 matches including IPL, T20 World Cup, PSL, BBL, CPL and BPL." },
        { q: "Which T20 leagues are covered on Live Cricket Zone?", a: "Live Cricket Zone covers all major T20 leagues: IPL 2026, T20 World Cup 2026, PSL 2026, BBL 2026, CPL 2026, BPL 2026, and all T20 International matches." },
        { q: "How often is the T20 live score updated?", a: "T20 cricket live score on Live Cricket Zone is updated every 15 seconds — faster than Cricbuzz and ESPNcricinfo." },
      ]}
      aboutText="Live Cricket Zone delivers the fastest T20 cricket live score with real-time ball-by-ball commentary for all T20 matches worldwide. Follow IPL 2026, T20 World Cup, PSL, BBL, CPL, BPL and T20 International matches with live scorecard, toss updates, player stats and match results updated every 15 seconds."
    />
  );
}
