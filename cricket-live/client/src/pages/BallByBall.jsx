import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchMatches } from "../api";

export default function BallByBall() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches();
        setMatches(data);
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Ball by Ball Cricket Commentary Live - Real-Time Cricket Updates"
        description="Get ball by ball cricket commentary live for all matches. Real-time ball-by-ball updates, live cricket score, detailed commentary for IPL, T20, ODI, Test matches."
        keywords="ball by ball cricket, ball by ball commentary, cricket ball by ball, live ball by ball, ball by ball cricket score, cricket commentary live, live cricket commentary, ball by ball updates"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Ball by Ball Cricket Commentary</h1>
          <p className="text-xl mb-4">Live Ball-by-Ball Updates • Real-Time Commentary</p>
          <div className="bg-white/20 p-4 rounded-lg">
            <div className="text-sm">🎯 Every ball • Every run • Every wicket • Real-time updates</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live Ball-by-Ball Commentary</h2>
          {loading ? (
            <div className="text-center py-8">Loading matches...</div>
          ) : matches.length > 0 ? (
            <div className="grid gap-4">
              {matches.map(match => (
                <Link key={match.id} to={`/match/${match.id}/live-score`} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-xl mb-2">{match.name}</div>
                      <div className="text-gray-600 text-sm">{match.venue}</div>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">
                        Ball-by-Ball →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center">
              <div className="text-gray-600 mb-4">No live matches at the moment</div>
              <Link to="/upcoming" className="text-blue-600 hover:underline">View upcoming matches →</Link>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ball-by-Ball Features</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div><strong>Every Ball Covered:</strong> Complete ball-by-ball commentary for every delivery</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div><strong>Real-Time Updates:</strong> Live updates within seconds of each ball</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div><strong>Expert Commentary:</strong> Detailed analysis and insights for each delivery</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div><strong>All Formats:</strong> IPL, T20, ODI, Test cricket ball-by-ball coverage</div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
