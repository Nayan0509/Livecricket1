import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function WomensCricket() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const womensMatches = (data?.data || []).filter(m => m.name?.includes("Women") || m.series?.includes("Women"));
        setMatches(womensMatches);
      } catch (error) {
        console.error("Error loading Women's matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="Women's Cricket Live Score - Women's Cricket Today"
        description="Women's cricket live score today. Get real-time updates for women's cricket matches, T20 World Cup, ODI, and Test matches."
        keywords="women's cricket, women's cricket live score, women's T20 world cup, women's cricket today, women's IPL"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Women's Cricket Live Score</h1>
          <p className="text-xl mb-4">Real-time Updates for Women's Cricket Worldwide</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-pink-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Now
            </Link>
            <Link to="/schedule" className="bg-pink-700 text-white px-6 py-2 rounded font-bold hover:bg-pink-800">
              Schedule
            </Link>
            <Link to="/rankings" className="bg-pink-700 text-white px-6 py-2 rounded font-bold hover:bg-pink-800">
              Rankings
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Major Women's Tournaments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-2xl font-bold text-pink-600 mb-2">Women's T20 WC</div>
              <div className="text-gray-600">T20 World Cup</div>
              <div className="text-sm text-gray-500 mt-2">16 Teams</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-2xl font-bold text-purple-600 mb-2">Women's ODI WC</div>
              <div className="text-gray-600">ODI World Cup</div>
              <div className="text-sm text-gray-500 mt-2">10 Teams</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-2xl font-bold text-blue-600 mb-2">Women's IPL</div>
              <div className="text-gray-600">Indian Premier League</div>
              <div className="text-sm text-gray-500 mt-2">5 Teams</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live Women's Cricket Matches</h2>
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
                      <div className="text-pink-600 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No women's cricket matches currently available
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Women's Cricket</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Follow live scores for women's cricket including T20 World Cup, ODI World Cup, Women's IPL, 
              and international bilateral series. Get real-time ball-by-ball commentary and match updates.
            </p>
            <p>
              Stay updated with women's cricket rankings, player statistics, and breaking news from tournaments worldwide.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
