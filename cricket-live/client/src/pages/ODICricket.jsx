import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function ODICricket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const odiMatches = (data?.data || []).filter(m => m.format === "ODI" || m.name?.includes("ODI"));
        setMatches(odiMatches);
      } catch (error) {
        console.error("Error loading ODI matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="ODI Cricket Live Score Today - One Day International Matches"
        description="ODI cricket live score today. Get real-time updates for One Day International matches with ball-by-ball commentary."
        keywords="ODI cricket, ODI live score, One Day International, ODI matches today, ODI cricket live"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">ODI Cricket Live Score</h1>
          <p className="text-xl mb-4">One Day International Matches - Real-time Updates</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-blue-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Now
            </Link>
            <Link to="/schedule" className="bg-blue-700 text-white px-6 py-2 rounded font-bold hover:bg-blue-800">
              Schedule
            </Link>
            <Link to="/results" className="bg-blue-700 text-white px-6 py-2 rounded font-bold hover:bg-blue-800">
              Results
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live ODI Matches</h2>
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
                      <div className="text-blue-600 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No ODI matches currently available
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">About ODI Cricket</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              One Day International (ODI) cricket is played between international teams with each side batting for a maximum of 50 overs. 
              It's the traditional format that bridges Test and T20 cricket.
            </p>
            <p>
              Follow live ODI cricket scores with ball-by-ball commentary, player statistics, and match analysis. 
              Get real-time updates for all international ODI matches.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/live" className="bg-blue-600 text-white p-4 rounded text-center font-bold hover:bg-blue-700">
            Live Scores
          </Link>
          <Link to="/schedule" className="bg-cyan-600 text-white p-4 rounded text-center font-bold hover:bg-cyan-700">
            Schedule
          </Link>
          <Link to="/results" className="bg-indigo-600 text-white p-4 rounded text-center font-bold hover:bg-indigo-700">
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
