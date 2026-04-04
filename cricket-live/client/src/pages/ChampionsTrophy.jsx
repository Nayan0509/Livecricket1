import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchMatches } from "../api";

export default function ChampionsTrophy() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches();
        const ctMatches = data.filter(m => m.series?.includes("Champions Trophy") || m.name?.includes("Champions Trophy"));
        setMatches(ctMatches);
      } catch (error) {
        console.error("Error loading Champions Trophy matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Champions Trophy 2026 Live Score - ICC Champions Trophy"
        description="Champions Trophy 2026 live score, schedule, standings. Get real-time ICC Champions Trophy cricket updates."
        keywords="Champions Trophy, Champions Trophy 2026, ICC Champions Trophy, Champions Trophy live score"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Champions Trophy 2026</h1>
          <p className="text-xl mb-4">ICC Champions Trophy - Live Score & Updates</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-teal-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Matches
            </Link>
            <Link to="/schedule" className="bg-teal-700 text-white px-6 py-2 rounded font-bold hover:bg-teal-800">
              Schedule
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live Champions Trophy Matches</h2>
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
                      <div className="text-teal-600 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No Champions Trophy matches currently available
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">About Champions Trophy</h2>
          <p className="text-gray-700">
            The ICC Champions Trophy is a premier ODI cricket tournament featuring the top 8 teams. 
            Get live scores and real-time updates for all Champions Trophy matches.
          </p>
        </div>
      </div>
    </>
  );
}
