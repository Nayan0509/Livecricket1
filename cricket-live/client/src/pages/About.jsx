import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container" style={{ paddingBottom: 60, maxWidth: 900 }}>
      <div className="hero" style={{ marginBottom: 40, textAlign: "left" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏏</div>
        <h1 className="hero-title" style={{ textAlign: "left" }}>About Live Cricket Zone</h1>
        <p className="hero-subtitle" style={{ textAlign: "left" }}>Your trusted source for live cricket scores, news, and comprehensive coverage</p>
      </div>

      <div className="card feature-card" style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: "var(--text)" }}>Your Live Cricket Hub</h2>
        <p style={{ color: "var(--text2)", lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>
          Live Cricket Zone is your comprehensive destination for everything cricket. We deliver real-time cricket scores, 
          detailed ball-by-ball commentary, complete match schedules, in-depth player statistics, team rankings, and the 
          latest cricket news from around the world — all in one convenient platform.
        </p>
        <p style={{ color: "var(--text2)", lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>
          Founded by passionate cricket enthusiasts, our mission is to bring cricket fans closer to the game they love. 
          Whether you're following the Indian Premier League, international Test matches, T20 World Cup, or domestic 
          tournaments like PSL, BBL, and CPL, we provide comprehensive coverage with lightning-fast updates.
        </p>
        <p style={{ color: "var(--text2)", lineHeight: 1.8, marginBottom: 20, fontSize: 15 }}>
          Our platform aggregates data from trusted sources including <a href="https://cricketdata.org" target="_blank" 
          rel="noreferrer" className="link-primary">CricketData.org</a> (formerly CricAPI) and Cricbuzz via 
          RapidAPI, ensuring you receive accurate, up-to-date cricket information 24/7. We process millions of data 
          points daily to bring you the most reliable cricket statistics and live scores.
        </p>
        <p style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 15 }}>
          What sets us apart is our commitment to user experience. We've designed our interface to be fast, intuitive, 
          and accessible on all devices. Whether you're on desktop, tablet, or mobile, you get the same seamless 
          experience with instant score updates, detailed match analysis, and comprehensive player profiles.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <div className="section-header" style={{ borderBottom: "none", paddingBottom: 0 }}>
          <h3 className="section-title">Why Choose Live Cricket Zone?</h3>
        </div>
        <div className="grid-2" style={{ gap: 20 }}>
          <div className="feature-card" style={{ padding: 24 }}>
            <div className="feature-icon">⚡</div>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18, color: "var(--text)" }}>Real-Time Updates</div>
            <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, lineHeight: 1.7 }}>
              Get instant score updates with our live refresh system. Never miss a boundary, wicket, or milestone 
              with our ball-by-ball commentary that updates every few seconds during live matches.
            </p>
          </div>
          <div className="feature-card" style={{ padding: 24 }}>
            <div className="feature-icon">📊</div>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18, color: "var(--text)" }}>Comprehensive Statistics</div>
            <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, lineHeight: 1.7 }}>
              Access detailed player statistics, career records, head-to-head comparisons, team rankings, and 
              historical data. Our database covers international cricket, domestic leagues, and major tournaments 
              with extensive statistical analysis.
            </p>
          </div>
          <div className="feature-card" style={{ padding: 24 }}>
            <div className="feature-icon">🌍</div>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18, color: "var(--text)" }}>Global Coverage</div>
            <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, lineHeight: 1.7 }}>
              Follow cricket from every corner of the world. From IPL and Big Bash to international Test series 
              and T20 leagues, we cover all major cricket events across all formats - Test, ODI, and T20.
            </p>
          </div>
          <div className="feature-card" style={{ padding: 24 }}>
            <div className="feature-icon">📱</div>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18, color: "var(--text)" }}>Mobile Optimized</div>
            <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, lineHeight: 1.7 }}>
              Our responsive design ensures perfect viewing on any device. Check scores on the go, watch live 
              streams, and stay updated with push notifications for your favorite teams and players.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Our Features</h3>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ padding: 12, borderLeft: "3px solid var(--green)", background: "var(--bg3)" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>🔴 Live Match Coverage</div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              Experience cricket matches as they happen with our live scoring system. Get ball-by-ball updates, 
              live commentary, player performance tracking, and match statistics updated in real-time. Our system 
              processes data within seconds of each delivery, ensuring you never miss a moment of the action.
            </p>
          </div>
          <div style={{ padding: 12, borderLeft: "3px solid var(--green)", background: "var(--bg3)" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>📅 Complete Match Schedules</div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              Plan your cricket viewing with our comprehensive match schedules. We list all upcoming international 
              matches, domestic leagues, and tournaments with dates, times, venues, and team information. Set 
              reminders for your favorite matches and never miss an important game.
            </p>
          </div>
          <div style={{ padding: 12, borderLeft: "3px solid var(--green)", background: "var(--bg3)" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>👥 Player Profiles & Stats</div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              Explore detailed player profiles with career statistics, recent form, batting and bowling averages, 
              strike rates, economy rates, and milestone achievements. Compare players across different formats 
              and track their performance throughout tournaments.
            </p>
          </div>
          <div style={{ padding: 12, borderLeft: "3px solid var(--green)", background: "var(--bg3)" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>🏆 Tournament Coverage</div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              Follow all major cricket tournaments including IPL, T20 World Cup, ODI World Cup, Champions Trophy, 
              Asia Cup, and domestic leagues like PSL, BBL, CPL, and BPL. Get tournament standings, points tables, 
              playoff scenarios, and championship predictions.
            </p>
          </div>
          <div style={{ padding: 12, borderLeft: "3px solid var(--green)", background: "var(--bg3)" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>📊 ICC Rankings</div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              Stay updated with the latest ICC rankings for teams and players across all formats. Track ranking 
              movements, see who's climbing the charts, and understand how performances impact global standings.
            </p>
          </div>
          <div style={{ padding: 12, borderLeft: "3px solid var(--green)", background: "var(--bg3)" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>📰 Cricket News & Updates</div>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>
              Read the latest cricket news, match reports, player interviews, transfer updates, and expert analysis. 
              Our news section aggregates stories from trusted sources to keep you informed about everything 
              happening in the cricket world.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Trusted Data Sources</h3>
        <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 16, lineHeight: 1.6 }}>
          We partner with industry-leading cricket data providers to ensure accuracy and reliability. Our data 
          infrastructure processes information from multiple sources, cross-validates statistics, and delivers 
          verified cricket data to our users.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { name: "CricketData.org", url: "https://cricketdata.org", desc: "Primary source for live scores, match information, detailed scorecards, player statistics, series data, and historical records. Provides comprehensive coverage of international and domestic cricket." },
            { name: "Cricbuzz via RapidAPI", url: "https://rapidapi.com/Creativesdev/api/free-cricbuzz-cricket-api", desc: "Supplementary data for cricket news, ICC rankings, match schedules, and tournament information. Offers additional context and editorial content." },
            { name: "YouTube IFrame API", url: "https://developers.google.com/youtube/iframe_api_reference", desc: "Enables embedded video highlights and live streaming content. No API key required for basic video embeds, making cricket content accessible to all users." },
          ].map(s => (
            <div key={s.name} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <a href={s.url} target="_blank" rel="noreferrer" style={{ color: "var(--green)", fontWeight: 600 }}>{s.name}</a>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Getting Started with Live Cricket Zone</h3>
        <p style={{ color: "var(--text2)", marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}>
          Live Cricket Zone is completely free to use for all cricket fans. Simply navigate through our sections 
          to access live scores, match schedules, player statistics, and cricket news. No registration required 
          for basic features.
        </p>
        <p style={{ color: "var(--text2)", marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}>
          For developers interested in building cricket applications, you can access the same data sources we use. 
          Both CricketData.org and RapidAPI offer free tier API keys that provide substantial data access for 
          personal projects and small applications.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <a href="https://cricketdata.org" target="_blank" rel="noreferrer" className="btn btn-primary">
            Get CricketData Key (Free)
          </a>
          <a href="https://rapidapi.com/Creativesdev/api/free-cricbuzz-cricket-api" target="_blank" rel="noreferrer" className="btn btn-outline">
            Get RapidAPI Key (Free)
          </a>
        </div>
        <div style={{ padding: 16, background: "var(--bg3)", borderRadius: 8, marginTop: 16 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Contact & Support</h4>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, margin: 0 }}>
            Have questions, feedback, or suggestions? We'd love to hear from you. While we're a data aggregation 
            platform and don't control match schedules or scores, we're always working to improve our service and 
            add new features based on user feedback. Check our <Link to="/" style={{ color: "var(--green)" }}>homepage</Link> for 
            the latest updates and features.
          </p>
        </div>
      </div>
    </div>
  );
}
