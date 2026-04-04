import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchMatches } from "../api";

export default function PSL() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches();
        const pslMatches = data.filter(m => m.series?.includes("PSL") || m.name?.includes("PSL"));
        setMatches(pslMatches);
      } catch (error) {
        console.error("Error loading PSL matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  return (
    <>
      <SEO 
        title="PSL Live Score - Pakistan Super League Live Updates"
        description="PSL live score today. Get real-time updates for Pakistan Super League matches with ball-by-ball commentary."
        keywords="PSL, Pakistan Super League, PSL live score, PSL today, PSL cricket"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">PSL Live Score</h1>
          <p className="text-xl mb-4">Pakistan Super League - Real-time Updates</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/live" className="bg-white text-green-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
              Live Matches
            </Link>
            <Link to="/schedule" className="bg-green-700 text-white px-6 py-2 rounded font-bold hover:bg-green-800">
              Schedule
            </Link>
            <Link to="/results" className="bg-green-700 text-white px-6 py-2 rounded font-bold hover:bg-green-800">
              Results
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">6</div>
            <div className="text-gray-600">Teams</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-emerald-600">34</div>
            <div className="text-gray-600">Matches</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-teal-600">50</div>
            <div className="text-gray-600">Days</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-cyan-600">150+</div>
            <div className="text-gray-600">Players</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Live PSL Matches</h2>
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
                      <div className="text-green-600 font-bold">{match.status}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center text-gray-600">
              No PSL matches currently available
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">PSL Teams</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["Karachi Kings", "Lahore Qalandars", "Multan Sultans", "Peshawar Zalmi", "Islamabad United", "Quetta Gladiators"].map(team => (
              <div key={team} className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition">
                <div className="font-bold">{team}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">About PSL</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              The Pakistan Super League (PSL) is Pakistan's premier T20 cricket league featuring 6 teams competing for the championship. 
              Get live scores, ball-by-ball commentary, and real-time updates for all PSL matches.
            </p>
            <p>
              Follow your favorite PSL teams including Karachi Kings, Lahore Qalandars, Multan Sultans, Peshawar Zalmi, 
              Islamabad United, and Quetta Gladiators.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/live" className="bg-green-600 text-white p-4 rounded text-center font-bold hover:bg-green-700">
            Live Matches
          </Link>
          <Link to="/schedule" className="bg-emerald-600 text-white p-4 rounded text-center font-bold hover:bg-emerald-700">
            Schedule
          </Link>
          <Link to="/results" className="bg-teal-600 text-white p-4 rounded text-center font-bold hover:bg-teal-700">
            Results
          </Link>
          <Link to="/standings" className="bg-cyan-600 text-white p-4 rounded text-center font-bold hover:bg-cyan-700">
            Standings
          </Link>
          <Link to="/teams" className="bg-blue-600 text-white p-4 rounded text-center font-bold hover:bg-blue-700">
            Teams
          </Link>
          <Link to="/players" className="bg-purple-600 text-white p-4 rounded text-center font-bold hover:bg-purple-700">
            Players
          </Link>
        </div>
      </div>
    </>
  );
}
