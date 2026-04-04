import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchMatches } from "../api";

export default function IPL() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches();
        // Filter for IPL matches
        const iplMatches = data.filter(m => m.series?.includes("IPL") || m.name?.includes("IPL"));
        setMatches(iplMatches);
      } catch (error) {
        console.error("Error loading IPL matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="IPL 2026 Live Score - Indian Premier League Live Updates"
        description="IPL 2026 live score, schedule, standings, teams, and news. Get real-time cricket updates for Indian Premier League matches today."
        keywords="IPL 2026, IPL live score, IPL today, Indian Premier League, IPL standings, IPL schedule"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">IPL 2026 Live Score</h1>
          <p className="text-xl mb-4">Indian Premier League - Real-time Updates & Coverage</p>
          <div className="flex gap-4">
            <Link to="/ipl/live" className="bg-white text-blue-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Matches
            </Link>
            <Link to="/ipl/standings" className="bg-blue-700 text-white px-6 py-2 rounded font-bold hover:bg-blue-800">
              Standings
            </Link>
            <Link to="/ipl/schedule" className="bg-blue-700 text-white px-6 py-2 rounded font-bold hover:bg-blue-800">
              Schedule
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">10</div>
            <div className="text-gray-600">Teams</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">70</div>
            <div className="text-gray-600">Matches</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">140</div>
            <div className="text-gray-600">Days</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-orange-600">1000+</div>
            <div className="text-gray-600">Players</div>
          </div>
        </div>

        {/* Live Matches Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live & Upcoming IPL Matches</h2>
          {loading ? (
            <div className="text-center py-8">Loading matches...</div>
          ) : matches.length > 0 ? (
            <div className="grid gap-4">
              {matches.slice(0, 5).map(match => (
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
              No IPL matches currently available
            </div>
          )}
        </div>

        {/* IPL Teams */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">IPL 2026 Teams</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["MI", "CSK", "RCB", "KKR", "DC", "RR", "SRH", "PBKS", "GT", "LSG"].map(team => (
              <div key={team} className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
                <div className="font-bold text-lg">{team}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">About IPL 2026</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The Indian Premier League (IPL) 2026 is the premier T20 cricket tournament in India. 
              Get live scores, ball-by-ball commentary, and real-time updates for all IPL matches.
            </p>
            <p>
              Follow your favorite teams including Mumbai Indians, Chennai Super Kings, Royal Challengers Bangalore, 
              Kolkata Knight Riders, Delhi Capitals, Rajasthan Royals, Sunrisers Hyderabad, Punjab Kings, Gujarat Titans, and Lucknow Super Giants.
            </p>
            <p>
              Stay updated with IPL standings, schedule, player statistics, and breaking news from the tournament.
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/ipl/live" className="bg-blue-600 text-white p-4 rounded text-center font-bold hover:bg-blue-700">
            IPL Live Matches
          </Link>
          <Link to="/ipl/standings" className="bg-purple-600 text-white p-4 rounded text-center font-bold hover:bg-purple-700">
            IPL Standings
          </Link>
          <Link to="/ipl/schedule" className="bg-green-600 text-white p-4 rounded text-center font-bold hover:bg-green-700">
            IPL Schedule
          </Link>
          <Link to="/ipl/teams" className="bg-orange-600 text-white p-4 rounded text-center font-bold hover:bg-orange-700">
            IPL Teams
          </Link>
          <Link to="/ipl/news" className="bg-red-600 text-white p-4 rounded text-center font-bold hover:bg-red-700">
            IPL News
          </Link>
          <Link to="/players" className="bg-indigo-600 text-white p-4 rounded text-center font-bold hover:bg-indigo-700">
            IPL Players
          </Link>
        </div>
      </div>
    </>
  );
}
