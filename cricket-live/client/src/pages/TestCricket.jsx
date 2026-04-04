import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function TestCricket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const testMatches = (data?.data || []).filter(m => m.format === "Test" || m.name?.includes("Test"));
        setMatches(testMatches);
      } catch (error) {
        console.error("Error loading Test matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Test Cricket Live Score - Test Match Updates & Commentary"
        description="Test cricket live score today. Get real-time updates for Test matches with ball-by-ball commentary and statistics."
        keywords="Test cricket, Test cricket live score, Test matches today, Test cricket live, Test cricket commentary"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Test Cricket Live Score</h1>
          <p className="text-xl mb-4">The Longest Format - Real-time Updates & Commentary</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-red-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Now
            </Link>
            <Link to="/schedule" className="bg-red-700 text-white px-6 py-2 rounded font-bold hover:bg-red-800">
              Schedule
            </Link>
            <Link to="/results" className="bg-red-700 text-white px-6 py-2 rounded font-bold hover:bg-red-800">
              Results
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live Test Matches</h2>
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
                      <div className="text-red-600 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No Test matches currently available
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">About Test Cricket</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Test cricket is the longest and most traditional format of the game, played between international teams over 5 days. 
              Each team gets two innings to bat, making it the ultimate test of skill, endurance, and strategy.
            </p>
            <p>
              Follow live Test cricket scores with detailed ball-by-ball commentary, player statistics, and comprehensive match analysis. 
              Get real-time updates for all international Test matches.
            </p>
            <p>
              Test cricket showcases the finest batting techniques, bowling strategies, and fielding excellence in the sport.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/live" className="bg-red-600 text-white p-4 rounded text-center font-bold hover:bg-red-700">
            Live Scores
          </Link>
          <Link to="/schedule" className="bg-orange-600 text-white p-4 rounded text-center font-bold hover:bg-orange-700">
            Schedule
          </Link>
          <Link to="/results" className="bg-yellow-600 text-white p-4 rounded text-center font-bold hover:bg-yellow-700">
            Results
          </Link>
          <Link to="/rankings" className="bg-pink-600 text-white p-4 rounded text-center font-bold hover:bg-pink-700">
            Rankings
          </Link>
        </div>
      </div>
    </>
  );
}
