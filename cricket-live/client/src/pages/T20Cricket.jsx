import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function T20Cricket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        // Filter for T20 matches
        const t20Matches = (data?.data || []).filter(m => m.format === "T20" || m.name?.includes("T20"));
        setMatches(t20Matches);
      } catch (error) {
        console.error("Error loading T20 matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="T20 Cricket Live Score Today - Live T20 Matches & Updates"
        description="T20 cricket live score today. Get real-time updates for all T20 matches including IPL, T20 World Cup, PSL, BBL, and more."
        keywords="T20 cricket, T20 live score, T20 matches today, T20 cricket live, T20 world cup"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">T20 Cricket Live Score</h1>
          <p className="text-xl mb-4">Real-time Updates for All T20 Matches Worldwide</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-green-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Now
            </Link>
            <Link to="/schedule" className="bg-green-700 text-white px-6 py-2 rounded font-bold hover:bg-green-800">
              Schedule
            </Link>
            <Link to="/results" className="bg-green-700 text-white px-6 py-2 rounded font-bold hover:bg-green-800">
              Results
            </Link>
          </div>
        </div>

        {/* T20 Leagues */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Major T20 Leagues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/ipl" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-2xl font-bold text-blue-600 mb-2">IPL</div>
              <div className="text-gray-600">Indian Premier League</div>
              <div className="text-sm text-gray-500 mt-2">10 Teams • 70 Matches</div>
            </Link>
            <Link to="/t20-world-cup" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-2xl font-bold text-purple-600 mb-2">T20 WC</div>
              <div className="text-gray-600">T20 World Cup 2026</div>
              <div className="text-sm text-gray-500 mt-2">16 Teams • 45 Matches</div>
            </Link>
            <Link to="/psl" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-2xl font-bold text-green-600 mb-2">PSL</div>
              <div className="text-gray-600">Pakistan Super League</div>
              <div className="text-sm text-gray-500 mt-2">6 Teams • 34 Matches</div>
            </Link>
            <Link to="/bbl" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-2xl font-bold text-yellow-600 mb-2">BBL</div>
              <div className="text-gray-600">Big Bash League</div>
              <div className="text-sm text-gray-500 mt-2">8 Teams • 61 Matches</div>
            </Link>
            <Link to="/cpl" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-2xl font-bold text-red-600 mb-2">CPL</div>
              <div className="text-gray-600">Caribbean Premier League</div>
              <div className="text-sm text-gray-500 mt-2">6 Teams • 34 Matches</div>
            </Link>
            <Link to="/bpl" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-2xl font-bold text-orange-600 mb-2">BPL</div>
              <div className="text-gray-600">Bangladesh Premier League</div>
              <div className="text-sm text-gray-500 mt-2">7 Teams • 42 Matches</div>
            </Link>
          </div>
        </div>

        {/* Live Matches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live T20 Matches Today</h2>
          {loading ? (
            <div className="text-center py-8">Loading matches...</div>
          ) : matches.length > 0 ? (
            <div className="grid gap-4">
              {matches.slice(0, 8).map(match => (
                <Link key={match.id} to={`/match/${match.id}`} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg">{match.name}</div>
                      <div className="text-gray-600 text-sm">{match.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No T20 matches currently available
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">T20 Cricket - The Fastest Format</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              T20 cricket is the shortest and most exciting format of the game. Each team plays 20 overs, 
              making it perfect for fast-paced entertainment and thrilling finishes.
            </p>
            <p>
              Follow live T20 cricket scores from all major leagues including IPL, T20 World Cup, PSL, BBL, CPL, and BPL. 
              Get real-time ball-by-ball commentary, player statistics, and match analysis.
            </p>
            <p>
              Whether you're interested in domestic T20 leagues or international T20 tournaments, 
              we provide comprehensive coverage with live scores, standings, schedules, and breaking news.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/live" className="bg-green-600 text-white p-4 rounded text-center font-bold hover:bg-green-700">
            Live Scores
          </Link>
          <Link to="/schedule" className="bg-teal-600 text-white p-4 rounded text-center font-bold hover:bg-teal-700">
            Schedule
          </Link>
          <Link to="/results" className="bg-blue-600 text-white p-4 rounded text-center font-bold hover:bg-blue-700">
            Results
          </Link>
          <Link to="/rankings" className="bg-purple-600 text-white p-4 rounded text-center font-bold hover:bg-purple-700">
            Rankings
          </Link>
        </div>
      </div>
    </>
  );
}
