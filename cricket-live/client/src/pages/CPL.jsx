import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchMatches } from "../api";

export default function CPL() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches();
        const cplMatches = data.filter(m => m.series?.includes("CPL") || m.name?.includes("Caribbean"));
        setMatches(cplMatches);
      } catch (error) {
        console.error("Error loading CPL matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="CPL Live Score - Caribbean Premier League 2026 Updates"
        description="CPL 2026 live score, schedule, standings. Get real-time Caribbean Premier League cricket updates today."
        keywords="CPL, Caribbean Premier League, CPL live score, CPL 2026, CPL today, West Indies cricket"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">CPL 2026 Live Score</h1>
          <p className="text-xl mb-4">Caribbean Premier League - Real-time Updates</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-red-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Matches
            </Link>
            <Link to="/schedule" className="bg-red-700 text-white px-6 py-2 rounded font-bold hover:bg-red-800">
              Schedule
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-red-600">6</div>
            <div className="text-gray-600">Teams</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-pink-600">34</div>
            <div className="text-gray-600">Matches</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">45</div>
            <div className="text-gray-600">Days</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-orange-600">150+</div>
            <div className="text-gray-600">Players</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live CPL Matches</h2>
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
                      <div className="text-red-600 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No CPL matches currently available
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">CPL Teams</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["Barbados Royals", "Guyana Amazon Warriors", "Jamaica Tallawahs", "St Kitts and Nevis Patriots", "St Lucia Kings", "Trinbago Knight Riders"].map(team => (
              <div key={team} className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
                <div className="font-bold text-sm">{team}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">About CPL</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The Caribbean Premier League (CPL) is the premier T20 cricket tournament in the West Indies featuring 6 teams. 
              Get live scores, ball-by-ball commentary, and real-time updates for all CPL matches.
            </p>
            <p>
              Follow teams like Barbados Royals, Guyana Amazon Warriors, Jamaica Tallawahs, St Kitts and Nevis Patriots, 
              St Lucia Kings, and Trinbago Knight Riders competing for the CPL trophy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
