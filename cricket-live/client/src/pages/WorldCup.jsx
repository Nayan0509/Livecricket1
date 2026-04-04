import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function WorldCup() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const wcMatches = (data?.data || []).filter(m => m.series?.includes("World Cup") || m.name?.includes("World Cup"));
        setMatches(wcMatches);
      } catch (error) {
        console.error("Error loading World Cup matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Cricket World Cup 2026 Live Score - ODI World Cup Updates"
        description="Cricket World Cup 2026 live score, schedule, standings. Get real-time ODI World Cup cricket updates today."
        keywords="cricket world cup, world cup 2026, ODI world cup, cricket world cup live score, world cup schedule"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Cricket World Cup 2026</h1>
          <p className="text-xl mb-4">ODI World Cup - Live Score & Updates</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-blue-700 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Matches
            </Link>
            <Link to="/schedule" className="bg-blue-800 text-white px-6 py-2 rounded font-bold hover:bg-blue-900">
              Schedule
            </Link>
            <Link to="/results" className="bg-blue-800 text-white px-6 py-2 rounded font-bold hover:bg-blue-900">
              Results
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-700">10</div>
            <div className="text-gray-600">Teams</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-indigo-600">48</div>
            <div className="text-gray-600">Matches</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">45</div>
            <div className="text-gray-600">Days</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-pink-600">300+</div>
            <div className="text-gray-600">Players</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live World Cup Matches</h2>
          {loading ? (
            <div className="text-center py-8">Loading matches...</div>
          ) : matches.length > 0 ? (
            <div className="grid gap-4">
              {matches.slice(0, 6).map(match => (
                <Link key={match.id} to={`/match/${match.id}`} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg">{match.name}</div>
                      <div className="text-gray-600 text-sm">{match.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-700 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No World Cup matches currently available
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">About Cricket World Cup</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The ICC Cricket World Cup is the premier ODI cricket tournament featuring the top 10 teams from around the world. 
              Get live scores, ball-by-ball commentary, and real-time updates for all World Cup matches.
            </p>
            <p>
              Follow your favorite teams including India, Pakistan, Australia, England, South Africa, New Zealand, 
              Sri Lanka, Bangladesh, West Indies, and Afghanistan competing for the World Cup trophy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
