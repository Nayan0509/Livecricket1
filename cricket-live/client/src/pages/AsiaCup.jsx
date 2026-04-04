import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function AsiaCup() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const asiaMatches = (data?.data || []).filter(m => m.series?.includes("Asia Cup") || m.name?.includes("Asia Cup"));
        setMatches(asiaMatches);
      } catch (error) {
        console.error("Error loading Asia Cup matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Asia Cup 2026 Live Score - Asia Cup Cricket Updates"
        description="Asia Cup 2026 live score, schedule, standings. Get real-time Asia Cup cricket updates for India, Pakistan, Sri Lanka, Bangladesh."
        keywords="Asia Cup, Asia Cup 2026, Asia Cup live score, Asia Cup today, India vs Pakistan"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Asia Cup 2026 Live Score</h1>
          <p className="text-xl mb-4">Asia's Premier Cricket Tournament</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-orange-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Matches
            </Link>
            <Link to="/schedule" className="bg-orange-700 text-white px-6 py-2 rounded font-bold hover:bg-orange-800">
              Schedule
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Participating Teams</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["India", "Pakistan", "Sri Lanka", "Bangladesh", "Afghanistan", "Nepal"].map(team => (
              <div key={team} className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
                <div className="font-bold">{team}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live Asia Cup Matches</h2>
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
                      <div className="text-orange-600 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No Asia Cup matches currently available
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">About Asia Cup</h2>
          <p className="text-gray-700">
            The Asia Cup is a premier cricket tournament featuring teams from Asia including India, Pakistan, Sri Lanka, 
            Bangladesh, Afghanistan, and Nepal. Get live scores and real-time updates for all Asia Cup matches.
          </p>
        </div>
      </div>
    </>
  );
}
