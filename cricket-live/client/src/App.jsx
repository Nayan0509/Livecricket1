import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Ticker from "./components/Ticker";

import Home from "./pages/Home";
import LiveMatches from "./pages/LiveMatches";
import MatchDetail from "./pages/MatchDetail";
import Scorecard from "./pages/Scorecard";
import LiveScore from "./pages/LiveScore";
import UpcomingMatches from "./pages/UpcomingMatches";
import Results from "./pages/Results";
import Series from "./pages/Series";
import SeriesDetail from "./pages/SeriesDetail";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Players from "./pages/Players";
import PlayerDetail from "./pages/PlayerDetail";
import Rankings from "./pages/Rankings";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Schedule from "./pages/Schedule";
import Stats from "./pages/Stats";
import About from "./pages/About";
import WatchLive from "./pages/WatchLive";
import NotFound from "./pages/NotFound";
import IPL from "./pages/IPL";
import T20Cricket from "./pages/T20Cricket";
import T20WorldCup from "./pages/T20WorldCup";
import ODICricket from "./pages/ODICricket";
import TestCricket from "./pages/TestCricket";
import PSL from "./pages/PSL";
import BBL from "./pages/BBL";
import CPL from "./pages/CPL";
import BPL from "./pages/BPL";
import WorldCup from "./pages/WorldCup";
import AsiaCup from "./pages/AsiaCup";
import ChampionsTrophy from "./pages/ChampionsTrophy";
import WomensCricket from "./pages/WomensCricket";
import LiveCricketScore from "./pages/LiveCricketScore";
import CricketScoreToday from "./pages/CricketScoreToday";
import BallByBall from "./pages/BallByBall";
import CricketWebsite from "./pages/CricketWebsite";
import FantasyGuide from "./pages/FantasyGuide";
import BettingGuide from "./pages/BettingGuide";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Ticker />
      <main style={{ minHeight: "calc(100vh - 140px)", paddingTop: "16px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<LiveMatches />} />
          <Route path="/live-cricket-score" element={<LiveCricketScore />} />
          <Route path="/cricket-score-today" element={<CricketScoreToday />} />
          <Route path="/ball-by-ball" element={<BallByBall />} />
          <Route path="/best-cricket-website" element={<CricketWebsite />} />
          <Route path="/match/:id" element={<MatchDetail />} />
          <Route path="/match/:id/scorecard" element={<Scorecard />} />
          <Route path="/match/:id/live-score" element={<LiveScore />} />
          <Route path="/upcoming" element={<UpcomingMatches />} />
          <Route path="/results" element={<Results />} />
          <Route path="/series" element={<Series />} />
          <Route path="/series/:id" element={<SeriesDetail />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/about" element={<About />} />
          <Route path="/watch-live" element={<WatchLive />} />
          
          {/* League Pages */}
          <Route path="/ipl" element={<IPL />} />
          <Route path="/t20" element={<T20Cricket />} />
          <Route path="/t20-world-cup" element={<T20WorldCup />} />
          <Route path="/odi" element={<ODICricket />} />
          <Route path="/test" element={<TestCricket />} />
          <Route path="/psl" element={<PSL />} />
          <Route path="/bbl" element={<BBL />} />
          <Route path="/cpl" element={<CPL />} />
          <Route path="/bpl" element={<BPL />} />
          <Route path="/world-cup" element={<WorldCup />} />
          <Route path="/asia-cup" element={<AsiaCup />} />
          <Route path="/champions-trophy" element={<ChampionsTrophy />} />
          <Route path="/womens-cricket" element={<WomensCricket />} />
          
          {/* Guide Pages */}
          <Route path="/fantasy-cricket-guide" element={<FantasyGuide />} />
          <Route path="/cricket-betting-guide" element={<BettingGuide />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
