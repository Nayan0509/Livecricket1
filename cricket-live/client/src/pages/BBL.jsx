import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function BBL() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        const bblMatches = (data?.data || []).filter(m => m.series?.includes("BBL") || m.name?.includes("Big Bash"));
        setMatches(bblMatches);
      } catch (error) {
        console.error("Error loading BBL matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="BBL Live Score - Big Bash League Live Updates"
        description="BBL live score today. Get real-time updates for Big Bash League matches with ball-by-ball commentary."
        keywords="BBL, Big Bash League, BBL live score, BBL today, BBL cricket"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">BBL Live Score</h1>
          <p className="text-xl mb-4">Big Bash League - Real-time Updates</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-yellow-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Matches
            </Link>
            <Link to="/schedule" className="bg-yellow-700 text-white px-6 py-2 rounded font-bold hover:bg-yellow-800">
              Schedule
            </Link>
            <Link to="/results" className="bg-yellow-700 text-white px-6 py-2 rounded font-bold hover:bg-yellow-800">
              Results
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-yellow-600">8</div>
            <div className="text-gray-600">Teams</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-orange-600">61</div>
            <div className="text-gray-600">Matches</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-red-600">60</div>
            <div className="text-gray-600">Days</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-pink-600">200+</div>
            <div className="text-gray-600">Players</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live BBL Matches</h2>
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
                      <div className="text-yellow-600 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No BBL matches currently available
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">BBL Teams</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Sydney Sixers", "Melbourne Stars", "Brisbane Heat", "Perth Scorchers", "Adelaide Strikers", "Hobart Hurricanes", "Sydney Thunder", "Melbourne Renegades"].map(team => (
              <div key={team} className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
                <div className="font-bold text-sm">{team}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">About BBL</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The Big Bash League (BBL) is Australia's premier T20 cricket league featuring 8 teams competing for the championship. 
              Get live scores, ball-by-ball commentary, and real-time updates for all BBL matches.
            </p>
            <p>
              Follow your favorite BBL teams including Sydney Sixers, Melbourne Stars, Brisbane Heat, Perth Scorchers, 
              Adelaide Strikers, Hobart Hurricanes, Sydney Thunder, and Melbourne Renegades.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/live" className="bg-yellow-600 text-white p-4 rounded text-center font-bold hover:bg-yellow-700">
            Live Matches
          </Link>
          <Link to="/schedule" className="bg-orange-600 text-white p-4 rounded text-center font-bold hover:bg-orange-700">
            Schedule
          </Link>
          <Link to="/results" className="bg-red-600 text-white p-4 rounded text-center font-bold hover:bg-red-700">
            Results
          </Link>
          <Link to="/standings" className="bg-pink-600 text-white p-4 rounded text-center font-bold hover:bg-pink-700">
            Standings
          </Link>
          <Link to="/teams" className="bg-purple-600 text-white p-4 rounded text-center font-bold hover:bg-purple-700">
            Teams
          </Link>
          <Link to="/players" className="bg-indigo-600 text-white p-4 rounded text-center font-bold hover:bg-indigo-700">
            Players
          </Link>
        </div>
      </div>
    </>
  );
}
