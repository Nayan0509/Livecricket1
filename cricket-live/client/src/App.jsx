import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Ticker from "./components/Ticker";
import ErrorBoundary from "./components/ErrorBoundary";
import { trackPageView } from "./utils/analytics";
import { ROUTE_REDIRECTS } from "./content/routeMeta";

// Home is eager — it's the most common entry point, so lazy-loading it would
// only add a round trip before first paint. Every other route is split into its
// own chunk so a visitor landing on /football never downloads the cricket
// scorecard, fantasy and admin-ish pages too. Keeps LCP/INP (Core Web Vitals)
// off the critical path of a single 340 kB bundle.
import Home from "./pages/Home";
import CookieConsent from "./components/CookieConsent";

const LiveMatches = lazy(() => import("./pages/LiveMatches"));
const MatchDetail = lazy(() => import("./pages/MatchDetail"));
const Scorecard = lazy(() => import("./pages/Scorecard"));
const LiveScore = lazy(() => import("./pages/LiveScore"));
const UpcomingMatches = lazy(() => import("./pages/UpcomingMatches"));
const Results = lazy(() => import("./pages/Results"));
const Series = lazy(() => import("./pages/Series"));
const SeriesDetail = lazy(() => import("./pages/SeriesDetail"));
const Teams = lazy(() => import("./pages/Teams"));
const TeamDetail = lazy(() => import("./pages/TeamDetail"));
const Players = lazy(() => import("./pages/Players"));
const PlayerDetail = lazy(() => import("./pages/PlayerDetail"));
const Rankings = lazy(() => import("./pages/Rankings"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const Guides = lazy(() => import("./pages/Guides"));
const GuideDetail = lazy(() => import("./pages/GuideDetail"));
const Tools = lazy(() => import("./pages/Tools"));
const ToolDetail = lazy(() => import("./pages/ToolDetail"));
const Games = lazy(() => import("./pages/Games"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Stats = lazy(() => import("./pages/Stats"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const IPL = lazy(() => import("./pages/IPL"));
const T20Cricket = lazy(() => import("./pages/T20Cricket"));
const T20WorldCup = lazy(() => import("./pages/T20WorldCup"));
const ODICricket = lazy(() => import("./pages/ODICricket"));
const TestCricket = lazy(() => import("./pages/TestCricket"));
const PSL = lazy(() => import("./pages/PSL"));
const BBL = lazy(() => import("./pages/BBL"));
const CPL = lazy(() => import("./pages/CPL"));
const BPL = lazy(() => import("./pages/BPL"));
const WorldCup = lazy(() => import("./pages/WorldCup"));
const AsiaCup = lazy(() => import("./pages/AsiaCup"));
const ChampionsTrophy = lazy(() => import("./pages/ChampionsTrophy"));
const WomensCricket = lazy(() => import("./pages/WomensCricket"));
const Videos = lazy(() => import("./pages/Videos"));
const CountyChampionship = lazy(() => import("./pages/CountyChampionship"));
const ICCCWCLeague2 = lazy(() => import("./pages/ICCCWCLeague2"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const DMCACopyright = lazy(() => import("./pages/DMCACopyright"));
const Contact = lazy(() => import("./pages/Contact"));
const EditorialPolicy = lazy(() => import("./pages/EditorialPolicy"));
const Fantasy = lazy(() => import("./pages/Fantasy"));
const Football = lazy(() => import("./pages/Football"));
const Basketball = lazy(() => import("./pages/Basketball"));
const Tennis = lazy(() => import("./pages/Tennis"));

// While a route's code downloads: on the first page of a visit, keep showing
// the server-rendered text for that page (captured in index.js) instead of a
// spinner, so the content does not disappear and reappear.
function RouteFallback() {
  const location = useLocation();
  const ssr = window.__SSR_PAGE__;
  if (ssr && ssr.path === location.pathname) {
    return <div className="container ssr-body" dangerouslySetInnerHTML={{ __html: ssr.html }} />;
  }
  return <div className="spinner" role="status" aria-label="Loading page" />;
}


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
      <main style={{ minHeight: "calc(100vh - 140px)", paddingTop: "16px" }}>
        {/* Keyed by path so a crashed page auto-recovers on navigation */}
        <ErrorBoundary resetKey={location.pathname}>
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            {Object.entries(ROUTE_REDIRECTS).map(([from, to]) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}
            <Route path="/live" element={<LiveMatches />} />
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
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:slug" element={<GuideDetail />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/:slug" element={<ToolDetail />} />
            <Route path="/games" element={<Games />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/editorial-policy" element={<EditorialPolicy />} />
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
            <Route path="/icc-cwc-league-2" element={<ICCCWCLeague2 />} />
            <Route path="/fantasy" element={<Fantasy />} />

            <Route path="/football" element={<Football />} />
            <Route path="/basketball" element={<Basketball />} />
            <Route path="/tennis" element={<Tennis />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
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
