import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function CricketWebsite() {
  return (
    <>
      <SEO 
        title="Best Cricket Website 2026 - Free Live Cricket Scores & Updates"
        description="Live Cricket Zone is the best cricket website for live scores, ball-by-ball commentary, IPL 2026, T20 World Cup updates. Better than ESPNcricinfo and Cricbuzz. 100% free forever."
        keywords="cricket website, best cricket website, cricket site, best cricket site, cricket score website, live cricket website, free cricket website, cricket website free, top cricket website, cricket website live score"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Best Cricket Website 2026</h1>
          <p className="text-xl mb-4">Free • Fast • Comprehensive Cricket Coverage</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live-cricket-score" className="bg-white text-indigo-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Scores
            </Link>
            <Link to="/cricket-score-today" className="bg-indigo-700 text-white px-6 py-2 rounded font-bold hover:bg-indigo-800">
              Today's Matches
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-xl mb-2">Fastest Updates</h3>
            <p className="text-gray-600">Live scores updated every 15 seconds - faster than any other cricket website</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-3">🆓</div>
            <h3 className="font-bold text-xl mb-2">100% Free</h3>
            <p className="text-gray-600">No subscription, no registration, no hidden fees. Free forever.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-bold text-xl mb-2">Complete Coverage</h3>
            <p className="text-gray-600">All formats, all leagues, all tournaments worldwide</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Why Live Cricket Zone is the Best Cricket Website</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-1">Real-Time Live Scores</h3>
                <p className="text-gray-700">Get live cricket scores updated every 15 seconds with ball-by-ball commentary for all matches</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-1">All Major Tournaments</h3>
                <p className="text-gray-700">IPL 2026, T20 World Cup, ODI World Cup, Test cricket, Asia Cup, Champions Trophy, PSL, BBL, CPL, BPL</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-1">Comprehensive Statistics</h3>
                <p className="text-gray-700">Player stats, team rankings, ICC rankings 2026, career records, match statistics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-1">Live Streaming Links</h3>
                <p className="text-gray-700">Access live cricket streaming for all major matches - free and easy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-1">Mobile Optimized</h3>
                <p className="text-gray-700">Fast-loading, responsive design works perfectly on all devices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-1">Latest Cricket News</h3>
                <p className="text-gray-700">Breaking cricket news, match analysis, player updates, tournament news</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Complete Cricket Coverage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Tournaments & Leagues</h3>
              <ul className="space-y-2">
                <li><Link to="/ipl" className="text-blue-600 hover:underline">IPL 2026 Live Score</Link></li>
                <li><Link to="/t20-world-cup" className="text-blue-600 hover:underline">T20 World Cup Live</Link></li>
                <li><Link to="/world-cup" className="text-blue-600 hover:underline">ODI World Cup Live</Link></li>
                <li><Link to="/asia-cup" className="text-blue-600 hover:underline">Asia Cup Live Score</Link></li>
                <li><Link to="/champions-trophy" className="text-blue-600 hover:underline">Champions Trophy Live</Link></li>
                <li><Link to="/womens-cricket" className="text-blue-600 hover:underline">Women's Cricket Live</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Cricket Formats</h3>
              <ul className="space-y-2">
                <li><Link to="/t20" className="text-blue-600 hover:underline">T20 Cricket Live Score</Link></li>
                <li><Link to="/odi" className="text-blue-600 hover:underline">ODI Cricket Live Score</Link></li>
                <li><Link to="/test" className="text-blue-600 hover:underline">Test Cricket Live Score</Link></li>
                <li><Link to="/ball-by-ball" className="text-blue-600 hover:underline">Ball by Ball Commentary</Link></li>
                <li><Link to="/live-cricket-score" className="text-blue-600 hover:underline">Live Cricket Score</Link></li>
                <li><Link to="/cricket-score-today" className="text-blue-600 hover:underline">Cricket Score Today</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Start Using the Best Cricket Website</h2>
          <p className="text-gray-700 mb-6">
            Join millions of cricket fans who trust Live Cricket Zone for live scores, ball-by-ball commentary, 
            and comprehensive cricket coverage. Experience the fastest, most reliable cricket website available today.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700">
              🔴 View Live Matches
            </Link>
            <Link to="/schedule" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">
              📅 See Schedule
            </Link>
            <Link to="/rankings" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700">
              📊 ICC Rankings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
