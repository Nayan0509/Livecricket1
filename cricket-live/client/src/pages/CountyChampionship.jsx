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
      seoTitle="County Championship 2026 Live Score Today — Division One & Two Live"
      seoDesc="County Championship 2026 live scores with ball-by-ball commentary for all Division One and Division Two matches. All 18 English counties covered — Surrey, Essex, Yorkshire, Lancashire, Somerset and more. Updated every 15 seconds."
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
          q: "Where can I watch County Championship 2026 live scores?",
          a: "Live Cricket Zone provides real-time County Championship 2026 live scores with ball-by-ball commentary for all Division One and Division Two matches. Every delivery is covered and the scorecard is updated every 15 seconds — free, no sign-up required.",
        },
        {
          q: "What is the County Championship?",
          a: "The County Championship is England's premier first-class cricket competition, running since 1890. It features 18 counties split into Division One and Division Two, with promotion and relegation between the two divisions each season.",
        },
        {
          q: "How many teams are in the County Championship?",
          a: "The County Championship features 18 first-class counties split into Division One (10 teams) and Division Two (8 teams). The bottom teams in Division One are relegated and replaced by the top finishers in Division Two.",
        },
        {
          q: "Which counties are in Division One of the County Championship 2026?",
          a: "Division One of the County Championship 2026 includes the top 10 counties from the previous season's standings — typically Surrey, Essex, Yorkshire, Lancashire, Hampshire, Kent, Warwickshire, Nottinghamshire, Somerset and one promoted side.",
        },
        {
          q: "Can I watch County Championship live on YouTube?",
          a: "Yes — some County Championship matches are streamed live on YouTube by the ECB and individual county clubs. Use the Watch button on any live match page on Live Cricket Zone to find the available stream.",
        },
        {
          q: "How long does a County Championship match last?",
          a: "County Championship matches are four-day first-class matches. Each team bats twice over the four days. Points are awarded for wins, draws and batting/bowling bonus points accumulated during the first 110 overs of each team's first innings.",
        },
      ]}
      aboutText={`Live Cricket Zone delivers real-time County Championship 2026 live scores with ball-by-ball commentary for every Division One and Division Two match. All 18 English counties — Surrey, Essex, Yorkshire, Lancashire, Hampshire, Kent, Warwickshire, Nottinghamshire, Somerset, Durham, Sussex, Middlesex, Worcestershire, Gloucestershire, Northamptonshire, Leicestershire, Glamorgan and Derbyshire — are covered from the first ball of the season to the last.

The County Championship is England's oldest and most prestigious domestic cricket competition, first contested in 1890. Four-day matches are played across the English summer at grounds ranging from historic Test venues like Lord's and Headingley to traditional county outgrounds. Points are accumulated through wins, draws and first-innings batting and bowling bonus points, with Division One champions crowned as England's best county side.

The competition's two-division structure, introduced in 2000, adds promotion and relegation drama throughout the season. Division One's ten counties battle to avoid the drop while chasing the title, while Division Two's eight sides compete for the two promotion places that could transform their season. This structure produces meaningful cricket at every stage of the campaign.

Live Cricket Zone covers every County Championship match ball by ball with full scorecard, batting averages, bowling figures, day-by-day session reports and match results. Whether you're following Surrey's title defence, an Ashes hopeful making a big score for Yorkshire, or a young spinner claiming a five-for at Taunton — every delivery is covered here, completely free with no account required.`}
    />
  );
}
