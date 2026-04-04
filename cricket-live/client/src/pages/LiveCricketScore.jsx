import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function LiveCricketScore() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        setMatches(data?.data || []);
      } catch (error) {
        console.error("Error loading matches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
    const interval = setInterval(loadMatches, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SEO 
        title="Live Cricket Score Today - Fastest Real-Time Cricket Updates 2026"
        description="Get the fastest live cricket score today with real-time ball-by-ball updates. Faster than Cricbuzz and ESPNcricinfo. Live cricket scores for IPL, T20 World Cup, ODI, Test matches updated every 15 seconds."
        keywords="live cricket score, live cricket score today, cricket live score, cricket score live, live score cricket, cricket live, live cricket, cricket score today, live cricket match, cricket match live score, ball by ball cricket score, fastest cricket score, real time cricket score, instant cricket score, cricket score faster than cricbuzz, better than espncricinfo"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Live Cricket Score Today</h1>
          <p className="text-xl mb-4">Fastest Real-Time Cricket Updates • Updated Every 15 Seconds</p>
          <div className="bg-white/20 p-4 rounded-lg mb-4">
            <div className="text-sm mb-1">⚡ Auto-refreshing every 15 seconds</div>
            <div className="text-sm">🔴 Live ball-by-ball commentary</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-red-600 mb-2">15s</div>
            <div className="text-gray-600">Update Speed</div>
            <div className="text-xs text-gray-500 mt-1">Faster than competitors</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-gray-600">Free Forever</div>
            <div className="text-xs text-gray-500 mt-1">No subscription needed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Live Coverage</div>
            <div className="text-xs text-gray-500 mt-1">All formats & leagues</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🔴 Live Cricket Matches Now</h2>
          {loading ? (
            <div className="text-center py-8">Loading live scores...</div>
          ) : matches.length > 0 ? (
            <div className="grid gap-4">
              {matches.map(match => (
                <Link key={match.id} to={`/match/${match.id}/live-score`} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                        <span className="text-red-600 font-bold text-sm">LIVE</span>
                      </div>
                      <div className="font-bold text-xl mb-1">{match.name}</div>
                      <div className="text-gray-600 text-sm">{match.venue}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-bold text-sm">{match.status}</div>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="text-sm text-gray-500">Click for ball-by-ball commentary →</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center">
              <div className="text-gray-600 mb-4">No live matches at the moment</div>
              <Link to="/upcoming" className="text-blue-600 hover:underline">View upcoming matches →</Link>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Why Choose Live Cricket Zone?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">⚡ Fastest Updates</h3>
              <p className="text-gray-700">Get live cricket scores updated every 15 seconds - faster than Cricbuzz and ESPNcricinfo. Real-time ball-by-ball commentary for all matches.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">🆓 100% Free</h3>
              <p className="text-gray-700">No subscription, no registration, no hidden fees. Access all live cricket scores, stats, and commentary completely free forever.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">🏏 All Formats</h3>
              <p className="text-gray-700">Coverage for IPL, T20 World Cup, ODI World Cup, Test cricket, PSL, BBL, CPL, BPL, Asia Cup, Champions Trophy, and all international matches.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">📱 Mobile Friendly</h3>
              <p className="text-gray-700">Optimized for mobile devices. Get live cricket scores on the go with our fast-loading, responsive design.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Live Cricket Score Features</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <strong>Ball-by-Ball Commentary:</strong> Get detailed ball-by-ball updates for every delivery with expert commentary
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <strong>Live Scorecard:</strong> Complete scorecard with batting, bowling, and partnership details updated in real-time
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <strong>Match Statistics:</strong> Comprehensive stats including run rate, required run rate, partnerships, and player performance
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <strong>Auto-Refresh:</strong> Scores automatically refresh every 15 seconds so you never miss a moment
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <strong>All Leagues:</strong> IPL, T20 World Cup, ODI World Cup, Test cricket, PSL, BBL, CPL, BPL, Asia Cup, Champions Trophy
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Popular Cricket Searches</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/ipl" className="text-blue-600 hover:underline">IPL Live Score</Link>
            <Link to="/t20-world-cup" className="text-blue-600 hover:underline">T20 World Cup Live</Link>
            <Link to="/world-cup" className="text-blue-600 hover:underline">ODI World Cup Live</Link>
            <Link to="/asia-cup" className="text-blue-600 hover:underline">Asia Cup Live</Link>
            <Link to="/psl" className="text-blue-600 hover:underline">PSL Live Score</Link>
            <Link to="/bbl" className="text-blue-600 hover:underline">BBL Live Score</Link>
            <Link to="/test" className="text-blue-600 hover:underline">Test Cricket Live</Link>
            <Link to="/womens-cricket" className="text-blue-600 hover:underline">Women's Cricket Live</Link>
          </div>
        </div>
      </div>
    </>
  );
}
