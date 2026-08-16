import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Ticker from "./components/Ticker";
import ErrorBoundary from "./components/ErrorBoundary";
import { trackPageView } from "./utils/analytics";

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
import Games from "./pages/Games";
import Schedule from "./pages/Schedule";
import Stats from "./pages/Stats";
import About from "./pages/About";
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
import WatchLive from "./pages/WatchLive";
import Videos from "./pages/Videos";
import CountyChampionship from "./pages/CountyChampionship";
import ICCCWCLeague2 from "./pages/ICCCWCLeague2";
import CricketWebsite from "./pages/CricketWebsite";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import DMCACopyright from "./pages/DMCACopyright";
import Contact from "./pages/Contact";
import EditorialPolicy from "./pages/EditorialPolicy";
import Fantasy from "./pages/Fantasy";
import Football from "./pages/Football";
import Basketball from "./pages/Basketball";
import Tennis from "./pages/Tennis";
import CookieConsent from "./components/CookieConsent";


function AppShell() {
  const location = useLocation();

  // Track every SPA route change as a GA4 page_view
  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <Ticker />
      <main style={{ minHeight: "calc(100vh - 140px)", paddingTop: "16px" }} className="animate-fade-in">
        {/* Keyed by path so a crashed page auto-recovers on navigation */}
        <ErrorBoundary resetKey={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<LiveMatches />} />
            {/* Retired keyword-variant doorway pages (duplicate content) → canonical /live */}
            <Route path="/live-cricket-score" element={<Navigate to="/live" replace />} />
            <Route path="/cricket-score-today" element={<Navigate to="/live" replace />} />
            <Route path="/cricket-matches-today" element={<Navigate to="/live" replace />} />
            <Route path="/ball-by-ball" element={<Navigate to="/live" replace />} />
            <Route path="/watch-live" element={<WatchLive />} />
            <Route path="/highlights" element={<WatchLive />} />
            <Route path="/watch" element={<Navigate to="/watch-live" replace />} />
            <Route path="/live-stream" element={<Navigate to="/watch-live" replace />} />
            {/* Retired IPL live-stream doorway pages → canonical IPL page */}
            <Route path="/ipl-live-stream" element={<Navigate to="/ipl" replace />} />
            <Route path="/ipl-live" element={<Navigate to="/ipl" replace />} />
            <Route path="/watch-ipl-live" element={<Navigate to="/ipl" replace />} />
            <Route path="/ipl-stream" element={<Navigate to="/ipl" replace />} />
            <Route path="/videos" element={<Videos />} />

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
            <Route path="/games" element={<Games />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/editorial-policy" element={<EditorialPolicy />} />
            <Route path="/cricket-website" element={<CricketWebsite />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/dmca-copyright" element={<DMCACopyright />} />

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
            <Route path="/county-championship" element={<CountyChampionship />} />
            <Route path="/county-cricket" element={<CountyChampionship />} />
            <Route path="/icc-cwc-league-2" element={<ICCCWCLeague2 />} />
            <Route path="/namibia-vs-scotland" element={<ICCCWCLeague2 />} />
            <Route path="/fantasy" element={<Fantasy />} />

            <Route path="/football" element={<Football />} />
            <Route path="/basketball" element={<Basketball />} />
            <Route path="/tennis" element={<Tennis />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <CookieConsent />
      <Footer />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://www.livecricketzone.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.livecricketzone.com/players?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}
      </script>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
