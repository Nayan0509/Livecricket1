import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchMatches } from "../api";

export default function CricketScoreToday() {
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

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <SEO 
        title="Cricket Score Today - All Cricket Matches Live Score Today 2026"
        description="Cricket score today for all live matches. Get today's cricket match scores, live updates, ball-by-ball commentary for IPL, T20, ODI, Test matches. Updated every 15 seconds."
        keywords="cricket score today, today cricket score, cricket match today, cricket today, today cricket match, cricket live today, cricket score live today, today match score, cricket match score today, live cricket today, today cricket live score"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Cricket Score Today</h1>
          <p className="text-xl mb-2">{today}</p>
          <p className="text-lg">All Live Cricket Matches • Real-Time Updates</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Today's Cricket Matches</h2>
          {loading ? (
            <div className="text-center py-8">Loading today's matches...</div>
          ) : matches.length > 0 ? (
            <div className="grid gap-4">
              {matches.map(match => (
                <Link key={match.id} to={`/match/${match.id}`} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-xl mb-2">{match.name}</div>
                      <div className="text-gray-600 text-sm mb-2">{match.venue}</div>
                      <div className="text-gray-500 text-sm">{match.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-bold">{match.status}</div>
                      <Link to={`/match/${match.id}/live-score`} className="text-sm text-green-600 hover:underline mt-2 inline-block">
                        Live Score →
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center">
              <div className="text-gray-600 mb-4">No matches scheduled for today</div>
              <Link to="/upcoming" className="text-blue-600 hover:underline">View upcoming matches →</Link>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Today's Cricket Coverage</h2>
          <p className="text-gray-700 mb-4">
            Get complete cricket score today for all live matches including IPL 2026, T20 World Cup, ODI World Cup, 
            Test cricket, PSL, BBL, CPL, BPL, Asia Cup, and Champions Trophy. Real-time ball-by-ball updates, 
            live scorecard, match statistics, and expert commentary.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/live" className="text-blue-600 hover:underline">Live Matches</Link>
            <Link to="/upcoming" className="text-blue-600 hover:underline">Upcoming Today</Link>
            <Link to="/schedule" className="text-blue-600 hover:underline">Full Schedule</Link>
            <Link to="/results" className="text-blue-600 hover:underline">Recent Results</Link>
          </div>
        </div>
      </div>
    </>
  );
}
