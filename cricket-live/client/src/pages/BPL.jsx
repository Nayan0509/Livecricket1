import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function BPL() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const bplMatches = (data?.data || []).filter(m => m.series?.includes("BPL") || m.name?.includes("Bangladesh Premier"));
        setMatches(bplMatches);
      } catch (error) {
        console.error("Error loading BPL matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="BPL Live Score - Bangladesh Premier League 2026"
        description="BPL 2026 live score, schedule, standings. Get real-time Bangladesh Premier League cricket updates."
        keywords="BPL, Bangladesh Premier League, BPL live score, BPL 2026, BPL today, Bangladesh cricket"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-700 to-red-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">BPL 2026 Live Score</h1>
          <p className="text-xl mb-4">Bangladesh Premier League - Real-time Updates</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-green-700 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Matches
            </Link>
            <Link to="/schedule" className="bg-green-800 text-white px-6 py-2 rounded font-bold hover:bg-green-900">
              Schedule
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live BPL Matches</h2>
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
                      <div className="text-green-700 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No BPL matches currently available
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">About BPL</h2>
          <p className="text-gray-700">
            The Bangladesh Premier League (BPL) is Bangladesh's premier T20 cricket league. 
            Get live scores, ball-by-ball commentary, and real-time updates for all BPL matches.
          </p>
        </div>
      </div>
    </>
  );
}
