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

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Ticker />
      <main style={{ minHeight: "calc(100vh - 140px)", paddingTop: "16px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<LiveMatches />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
