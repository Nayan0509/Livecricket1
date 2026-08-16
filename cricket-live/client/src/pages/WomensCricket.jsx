import React from "react";
import TournamentPage from "../components/TournamentPage";

export default function WomensCricket() {
  const teams = [
    { name: "Australia Women", flag: "🇦🇺", captain: "Alyssa Healy", titles: "6 T20 WCs & 7 ODI WCs (Record Dominance)" },
    { name: "India Women", flag: "🇮🇳", captain: "Harmanpreet Kaur", titles: "Asia Cup Champions & WPL Powerhouse" },
    { name: "England Women", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", captain: "Heather Knight", titles: "4 ODI WCs & 1 T20 WC" },
    { name: "South Africa Women", flag: "🇿🇦", captain: "Laura Wolvaardt", titles: "2-time T20 WC Finalists" },
    { name: "New Zealand Women", flag: "🇳🇿", captain: "Sophie Devine", titles: "T20 WC Champions (2024)" },
    { name: "West Indies Women", flag: "🌴", captain: "Hayley Matthews", titles: "T20 WC Champions (2016)" },
    { name: "Sri Lanka Women", flag: "🇱🇰", captain: "Chamari Athapaththu", titles: "Asia Cup Champions (2024)" },
    { name: "Pakistan Women", flag: "🇵🇰", captain: "Fatima Sana", titles: "Rising Asian Power" },
    { name: "Bangladesh Women", flag: "🇧🇩", captain: "Nigar Sultana Joty", titles: "Main Stage Regulars" },
    { name: "Ireland Women", flag: "🇮🇪", captain: "Laura Delany", titles: "European Leaders" },
  ];

  const standings = [
    { team: "Australia Women", flag: "🇦🇺", played: 5, won: 5, lost: 0, nrr: "+2.340", points: 10 },
    { team: "India Women", flag: "🇮🇳", played: 5, won: 4, lost: 1, nrr: "+1.650", points: 8 },
    { team: "England Women", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 5, won: 3, lost: 2, nrr: "+0.920", points: 6 },
    { team: "South Africa Women", flag: "🇿🇦", played: 5, won: 3, lost: 2, nrr: "+0.450", points: 6 },
    { team: "New Zealand Women", flag: "🇳🇿", played: 5, won: 2, lost: 3, nrr: "-0.210", points: 4 },
    { team: "West Indies Women", flag: "🌴", played: 5, won: 2, lost: 3, nrr: "-0.650", points: 4 },
    { team: "Sri Lanka Women", flag: "🇱🇰", played: 5, won: 1, lost: 4, nrr: "-1.120", points: 2 },
    { team: "Pakistan Women", flag: "🇵🇰", played: 5, won: 0, lost: 5, nrr: "-2.100", points: 0 },
  ];

  const fixtures = [
    { name: "India Women vs Australia Women", stage: "Super Series", date: "Jul 10, 2026", venue: "Lord's, London" },
    { name: "England Women vs South Africa Women", stage: "T20I Series", date: "Jul 14, 2026", venue: "The Kia Oval, London" },
    { name: "New Zealand Women vs West Indies Women", stage: "ODI Clash", date: "Jul 18, 2026", venue: "Edgbaston, Birmingham" },
    { name: "India Women vs England Women", stage: "Final", date: "Jul 22, 2026", venue: "Lord's, London" },
  ];

  const records = [
    { label: "Most ODI Runs", value: "7,805 Runs", holder: "Mithali Raj (India)" },
    { label: "Most ODI Wickets", value: "255 Wickets", holder: "Jhulan Goswami (India)" },
    { label: "Highest Individual Score (ODI)", value: "232*", holder: "Amelia Kerr (New Zealand vs Ireland)" },
    { label: "Highest T20I Score", value: "148*", holder: "Alyssa Healy (Australia vs Sri Lanka)" },
    { label: "Most T20 World Cups", value: "6 Titles", holder: "Australia Women" },
  ];

  const venues = [
    { name: "Lord's Cricket Ground", city: "London", country: "England", capacity: "31,100", pitch: "Historic slope offering great balance between bat and ball." },
    { name: "Melbourne Cricket Ground (MCG)", city: "Melbourne", country: "Australia", capacity: "100,024", pitch: "Iconic ground that hosted 86,174 fans at the 2020 Women's T20 World Cup final." },
    { name: "DY Patil Stadium", city: "Navi Mumbai", country: "India", capacity: "45,300", pitch: "High-scoring batting paradise and home of epic Women's Premier League clashes." },
  ];

  return (
    <TournamentPage
      slug="womens-cricket"
      name="Women's Cricket Hub 2026"
      shortName="Women's Cricket"
      filterKeywords={["Women", "WODI", "WT20", "Women's", "Womens", "WPL"]}
      accentColor="#e879f9"
      seoTitle="Women's Cricket Live Score 2026 — ICC WT20, WODI & Series"
      seoDesc="Women's cricket live score 2026 with ball-by-ball commentary. ICC Women's T20 World Cup, Women's ODI series, Women's Ashes and all bilateral women's cricket matches. Updated every 15 seconds, free."
      seoKeywords="women's cricket live score, ICC women's T20 World Cup live, women's cricket today, women's ODI live score, women's cricket 2026, women's T20 live score, women's cricket ball by ball, India women cricket live, Australia women cricket live, England women cricket live, Smriti Mandhana live, women's ashes live, ICC women's cricket 2026, women cricket score today"
      stats={[
        { value: "10+", label: "Elite Nations" },
        { value: "All", label: "Formats" },
        { value: "WT20/WODI", label: "ICC Events" },
        { value: "Free", label: "Ball-by-Ball Live" },
      ]}
      teams={teams}
      standings={standings}
      fixtures={fixtures}
      records={records}
      venues={venues}
      faqItems={[
        {
          q: "Where can I watch Women's cricket live score?",
          a: "Live Cricket Zone provides real-time Women's cricket live score with ball-by-ball commentary for ICC Women's T20 World Cup, Women's ODI World Cup, Women's Ashes, and all bilateral women's cricket series. Free, no sign-up required.",
        },
        {
          q: "Which women's cricket tournaments are covered on Live Cricket Zone?",
          a: "Live Cricket Zone covers all major women's cricket tournaments including the ICC Women's T20 World Cup, ICC Women's ODI World Cup, Women's Ashes, Women's Premier League (WPL), Women's Big Bash League (WBBL), and all bilateral series.",
        },
        {
          q: "Who are the top women cricketers in the world?",
          a: "Smriti Mandhana, Alyssa Healy, Ellyse Perry, Laura Wolvaardt, Nat Sciver-Brunt, Deepti Sharma, Sophie Ecclestone, and Chamari Athapaththu are among the world's premier women cricketers.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time Women's cricket live scores with ball-by-ball commentary for every ICC women's tournament and bilateral international series. Women's cricket is experiencing its most exciting era of growth, with record crowds, massive broadcast deals, new franchise competitions and a generation of elite players pushing the game to new heights around the world.

Live Cricket Zone covers all women's cricket with the same real-time ball-by-ball detail as any men's international series — complete scorecard, batting and bowling figures, toss updates and official post-match highlights completely free.`}
    />
  );
}
