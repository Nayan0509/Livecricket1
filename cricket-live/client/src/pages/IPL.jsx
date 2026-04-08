import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { fetchLiveMatches } from "../api";

export default function IPL() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchLiveMatches();
        // Filter for IPL matches
        const iplMatches = (data?.data || []).filter(m => m.series?.includes("IPL") || m.name?.includes("IPL"));
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
        title="IPL 2026 Live Score, Betting Odds, Fantasy Tips & Predictions | Polymarket"
        description="IPL 2026 live score, betting odds, Polymarket predictions, Dream11 fantasy tips, match analysis. Get real-time updates, DFS lineups, and winning predictions for Indian Premier League 2026."
        keywords="IPL 2026, IPL live score, IPL betting odds, IPL predictions, Polymarket IPL, Dream11 IPL, IPL fantasy cricket, DraftKings IPL, IPL 2026 odds, IPL match prediction, fantasy cricket tips, IPL DFS, cricket betting, IPL today"
        image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630&fit=crop"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="hero" style={{ marginBottom: 40 }}>
          <h1 className="hero-title">IPL 2026 Live Score</h1>
          <p className="hero-subtitle">Indian Premier League - Real-time Updates & Coverage</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/ipl/live" className="btn btn-primary">
              Live Matches
            </Link>
            <Link to="/ipl/standings" className="btn btn-outline">
              Standings
            </Link>
            <Link to="/ipl/schedule" className="btn btn-outline">
              Schedule
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid-4" style={{ marginBottom: 40 }}>
          <div className="stat-card">
            <div className="stat-value">10</div>
            <div className="stat-label">Teams</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">70</div>
            <div className="stat-label">Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">140</div>
            <div className="stat-label">Days</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">1000+</div>
            <div className="stat-label">Players</div>
          </div>
        </div>

        {/* Live Matches Section */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-header">
            <h2 className="section-title">Live & Upcoming IPL Matches</h2>
            <Link to="/live" className="link-primary">View all →</Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : matches.length > 0 ? (
            <div className="grid-2">
              {matches.slice(0, 5).map(match => (
                <Link key={match.id} to={`/match/${match.id}`} style={{ textDecoration: "none" }}>
                  <div className="card match-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase" }}>
                        {match.matchType}
                      </span>
                      <span className="badge badge-live">● LIVE</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: "var(--text)" }}>{match.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text2)" }}>{match.date}</div>
                    <div style={{ fontSize: 14, color: "var(--primary-light)", marginTop: 12, fontWeight: 600 }}>{match.status}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏏</div>
              <p style={{ color: "var(--text2)", marginBottom: 16 }}>No IPL matches currently available</p>
              <Link to="/upcoming" className="btn btn-primary">View Upcoming Matches</Link>
            </div>
          )}
        </div>

        {/* IPL Teams */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-header">
            <h2 className="section-title">IPL 2026 Teams</h2>
          </div>
          <div className="grid-4">
            {["MI", "CSK", "RCB", "KKR", "DC", "RR", "SRH", "PBKS", "GT", "LSG"].map(team => (
              <div key={team} className="card" style={{ textAlign: "center", padding: 20, cursor: "pointer" }}>
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  background: "var(--gradient-primary)", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  margin: "0 auto 12px",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#fff"
                }}>{team.slice(0, 2)}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{team}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">IPL 2026: The World's Premier T20 Cricket League</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              The <strong>Indian Premier League (IPL) 2026</strong> continues its legacy as the world's most lucrative and 
              entertaining T20 cricket tournament. Since its inception in 2008, the IPL has revolutionized cricket by 
              combining international superstars with emerging Indian talent in a high-octane, franchise-based format that 
              has captivated audiences worldwide. With over 400 million viewers globally, the IPL has transcended sport to 
              become a cultural phenomenon that influences entertainment, fashion, and popular culture across India and beyond.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">Tournament Format and Structure</h3>
            <p>
              IPL 2026 features <strong>10 franchise teams</strong> representing different Indian cities, each competing in 
              approximately 70 matches over a thrilling 8-week period. The tournament follows a double round-robin format 
              where each team plays 14 matches - seven at home and seven away. The top four teams advance to the playoffs, 
              consisting of Qualifier 1, Eliminator, Qualifier 2, and the grand finale. This format ensures maximum 
              competitiveness and keeps fans engaged throughout the season.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">The IPL Teams: Powerhouses of T20 Cricket</h3>
            <p>
              The league comprises ten formidable franchises: <strong>Mumbai Indians</strong> (5-time champions), 
              <strong>Chennai Super Kings</strong> (5-time champions), <strong>Royal Challengers Bangalore</strong>, 
              <strong>Kolkata Knight Riders</strong> (2-time champions), <strong>Delhi Capitals</strong>, 
              <strong>Rajasthan Royals</strong> (inaugural champions), <strong>Sunrisers Hyderabad</strong> (2016 champions), 
              <strong>Punjab Kings</strong>, <strong>Gujarat Titans</strong> (2022 champions), and 
              <strong>Lucknow Super Giants</strong>. Each team is allowed a squad of 25 players with a maximum of 8 overseas 
              players, creating a perfect blend of international experience and local talent.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">What Makes IPL Unique</h3>
            <p>
              The IPL's distinctive appeal lies in its innovative approach to cricket. The <strong>player auction system</strong> 
              creates unprecedented drama as franchises bid for players, sometimes reaching astronomical figures. Strategic 
              timeouts allow teams to regroup during crucial moments, adding a tactical dimension rarely seen in cricket. 
              The tournament's evening matches under floodlights, combined with cheerleaders, music, and entertainment, create 
              a carnival atmosphere that attracts families and casual viewers alongside hardcore cricket fans.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">Star Players and International Talent</h3>
            <p>
              IPL 2026 showcases the world's best cricketers competing on the same platform. From established legends to 
              emerging youngsters, the tournament provides a stage where reputations are made and broken. International stars 
              from Australia, England, South Africa, West Indies, New Zealand, and other cricket nations join forces with 
              India's finest players, creating dream teams that fans could only imagine in other formats. The league has 
              launched countless careers and provided a platform for unknown players to become household names.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">Impact on Indian Cricket</h3>
            <p>
              The IPL's influence on Indian cricket cannot be overstated. It has created a robust domestic cricket economy, 
              providing financial security to players and creating opportunities for thousands of cricketers, coaches, and 
              support staff. The tournament has improved India's T20 capabilities significantly, with IPL experience directly 
              translating to success in international T20 competitions. Young Indian players get invaluable exposure playing 
              alongside and against international stars, accelerating their development and preparing them for the pressures 
              of international cricket.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">Records and Milestones</h3>
            <p>
              The IPL has witnessed numerous historic moments and record-breaking performances. From Chris Gayle's 
              unbelievable 175* off 66 balls to Lasith Malinga's four wickets in four balls, the tournament consistently 
              produces unforgettable moments. The league holds records for the highest team totals, fastest centuries, 
              most sixes in an innings, and countless individual achievements that push the boundaries of what's possible 
              in T20 cricket.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">How to Follow IPL 2026</h3>
            <p>
              Stay connected with every ball of IPL 2026 through our comprehensive coverage. Get <strong>live scores</strong> 
              updated ball-by-ball, detailed <strong>match scorecards</strong>, <strong>player statistics</strong>, 
              <strong>team standings</strong>, and <strong>points tables</strong> updated in real-time. Our platform provides 
              match schedules with venue information, team news, injury updates, and expert analysis. Whether you're following 
              your favorite team's journey or tracking individual player performances, we provide all the data and insights 
              you need to stay informed throughout the tournament.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">IPL 2026 Betting Odds and Predictions</h3>
            <p>
              The IPL 2026 betting market has seen unprecedented activity across platforms like <strong>Polymarket</strong>, 
              traditional sportsbooks, and prediction markets. According to current odds, Mumbai Indians lead as favorites 
              with betting odds around 5.50, followed by Royal Challengers Bengaluru and Punjab Kings. Polymarket's 
              decentralized prediction market shows Mumbai Indians with approximately 28% probability, reflecting real-time 
              market sentiment backed by actual financial stakes.
            </p>
            <p style={{ marginTop: 12 }}>
              Popular betting markets include match winners, top batsman predictions, toss results, powerplay runs, and 
              over 100 specialized markets. Platforms offer odds on individual player performances, team totals, and 
              in-play betting options that update ball-by-ball. Fantasy cricket platforms like <strong>Dream11</strong>, 
              <strong>FanDuel</strong>, and <strong>DraftKings</strong> have integrated IPL contests, allowing fans to 
              create fantasy teams and compete for prizes based on actual player performances.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">Fantasy Cricket and DFS for IPL 2026</h3>
            <p>
              <strong>Fantasy cricket</strong> has become integral to the IPL experience, with millions of fans participating 
              in daily fantasy sports (DFS) contests. Dream11, India's leading fantasy platform, offers IPL-specific contests 
              where users select 11 players within a budget constraint and earn points based on real match performances. 
              International platforms like DraftKings and FanDuel have also entered the cricket fantasy space, providing 
              salary-cap based contests with substantial prize pools.
            </p>
            <p style={{ marginTop: 12 }}>
              Fantasy cricket strategy involves analyzing pitch conditions, player form, head-to-head statistics, and team 
              combinations. Key positions include selecting reliable captains (who earn 2x points) and vice-captains (1.5x points). 
              Popular fantasy picks for IPL 2026 include consistent performers like Virat Kohli, Rohit Sharma, Jasprit Bumrah, 
              and emerging talents who offer value at lower price points. Fantasy experts recommend diversifying team selections 
              across multiple contests to maximize winning potential.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">IPL Match Predictions and Analysis</h3>
            <p>
              Match prediction models for IPL 2026 utilize advanced analytics, machine learning algorithms, and historical 
              data to forecast outcomes. Factors considered include team composition, venue statistics, weather conditions, 
              head-to-head records, recent form, and player availability. Prediction platforms like <strong>Polymarket</strong> 
              aggregate crowd wisdom through prediction markets, often proving more accurate than traditional expert analysis.
            </p>
            <p style={{ marginTop: 12 }}>
              Toss predictions, powerplay scores, and individual player performance forecasts have become popular betting 
              markets. Data shows that teams winning the toss in IPL matches have a slight advantage, particularly at venues 
              with dew factor in evening games. Analyzing these patterns helps bettors and fantasy players make informed 
              decisions throughout the tournament.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-6">
              <h4 className="font-bold text-lg mb-2">IPL 2026 Key Information</h4>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Teams:</strong> 10 franchise teams</li>
                <li><strong>Matches:</strong> 70 league matches + 4 playoff matches</li>
                <li><strong>Format:</strong> T20 (20 overs per side)</li>
                <li><strong>Duration:</strong> Approximately 8 weeks</li>
                <li><strong>Players:</strong> 250 players (25 per squad)</li>
                <li><strong>Overseas Players:</strong> Maximum 4 per playing XI</li>
                <li><strong>Prize Money:</strong> Substantial rewards for winners and top performers</li>
                <li><strong>Betting Markets:</strong> 200+ markets per match on major platforms</li>
                <li><strong>Fantasy Platforms:</strong> Dream11, DraftKings, FanDuel, TradeStars</li>
                <li><strong>Prediction Markets:</strong> Polymarket, traditional sportsbooks</li>
              </ul>
            </div>
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
