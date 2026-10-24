import React, { useState } from "react";
import SEO from "../components/SEO";
import { PageIntro } from "../components/ContentBlocks";
import { PAGE_INTROS } from "../content/pages";
import AdBanner from "../components/AdBanner";
import CricketStrikerGame from "../components/games/CricketStrikerGame";
import KachufulGame from "../components/games/KachufulGame";
import CricketTriviaGame from "../components/games/CricketTriviaGame";
import CricketMemoryGame from "../components/games/CricketMemoryGame";

const GAMES_LIST = [
  {
    id: "cricket-striker",
    title: "Cricket Super Striker",
    emoji: "🏏",
    category: "Action & Batting",
    badge: "Most Popular",
    desc: "Target chase batting challenge! Time your lofted drives and helicopter sixes to chase down the target before overs run out.",
  },
  {
    id: "kachuful",
    title: "Kachuful (Judgement)",
    emoji: "🃏",
    category: "Card Strategy",
    badge: "Traditional Classic",
    desc: "The famous Indian card trick-taking game! Predict your tricks, follow the trump suit, and outscore Rahul, Priya, and Amit.",
  },
  {
    id: "trivia",
    title: "Cricket Trivia Master",
    emoji: "🧠",
    category: "Kids Quiz",
    badge: "Brain Challenge",
    desc: "Exciting cricket quiz for kids and fans! Answer 10 fast-paced questions against the timer and build streak multipliers.",
  },
  {
    id: "memory-match",
    title: "Cricket Memory Match",
    emoji: "🧩",
    category: "Puzzle for Kids",
    badge: "Easy & Fun",
    desc: "Flip and match cricket equipment, World Cup trophies, and legendary gear in minimum moves.",
  },
];

export default function Games() {
  const [activeGame, setActiveGame] = useState("cricket-striker");

  const gamesSD = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Live Cricket Zone Arcade Games",
    "applicationCategory": "GameApplication",
    "operatingSystem": "All",
    "description": "Free playable online cricket games and Kachuful card games for children and cricket fans directly in the browser.",
    "url": "https://www.livecricketzone.com/games"
  };

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 16px 60px" }}>
      <SEO
        url="/games"
        structuredData={gamesSD}
      />

      {/* Hero Banner */}
      <div style={{
        margin: "16px 0 24px", padding: "32px 28px", borderRadius: 20,
        background: "linear-gradient(135deg, rgba(0,240,255,0.12) 0%, rgba(13,20,38,0.98) 60%, rgba(216,150,255,0.1) 100%)",
        border: "1px solid rgba(0,240,255,0.25)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,240,255,0.15)", border: "1px solid rgba(0,240,255,0.3)", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, color: "#00F0FF", marginBottom: 12 }}>
          <span>🎮</span> FREE ONLINE CRICKET ARCADE
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text)", margin: "0 0 8px" }}>
          Play Cricket &amp; <span style={{ color: "#00F0FF" }}>Kachuful Games</span>
        </h1>
        <p style={{ fontSize: 14, color: "var(--text2)", margin: 0, maxWidth: 680, lineHeight: 1.7 }}>
          Enjoy fun, interactive, and child-friendly cricket games directly in your browser. No download or install required — tap and play instantly on mobile, tablet, or desktop!
        </p>
      </div>

      <PageIntro intro={PAGE_INTROS["/games"]} />

      {/* Game Selection Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14, marginBottom: 28 }}>
        {GAMES_LIST.map((game) => {
          const isSelected = activeGame === game.id;
          return (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              style={{
                background: isSelected ? "linear-gradient(135deg, rgba(0,240,255,0.15), rgba(13,20,38,0.9))" : "rgba(255,255,255,0.025)",
                border: `1px solid ${isSelected ? "#00F0FF" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 16,
                padding: "18px 20px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: isSelected ? "0 0 20px rgba(0,240,255,0.25)" : "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 32 }}>{game.emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: isSelected ? "#00F0FF" : "#D896FF", background: isSelected ? "rgba(0,240,255,0.15)" : "rgba(216,150,255,0.1)", padding: "2px 8px", borderRadius: 12 }}>
                    {game.badge}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: isSelected ? "#fff" : "var(--text)", marginBottom: 4 }}>
                  {game.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>
                  {game.desc}
                </div>
              </div>

              <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: 12, fontWeight: 800, color: isSelected ? "#00F0FF" : "var(--text2)" }}>
                {isSelected ? "▶️ Playing Now" : "Play Game →"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Container */}
      <div style={{
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(59,130,246,0.12)",
        borderRadius: 20,
        padding: "24px 16px",
        marginBottom: 32,
      }}>
        {activeGame === "cricket-striker" && <CricketStrikerGame />}
        {activeGame === "kachuful" && <KachufulGame />}
        {activeGame === "trivia" && <CricketTriviaGame />}
        {activeGame === "memory-match" && <CricketMemoryGame />}
      </div>

      <div style={{ marginTop: 24 }}><AdBanner type="auto" /></div>

      {/* Game Rules & Kids Guide Section */}
      <section style={{ marginTop: 32, padding: "28px", borderRadius: 16, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 18, borderRadius: 2, background: "linear-gradient(180deg,#00F0FF,#00B8D9)", display: "inline-block" }} />
          How to Play Kachuful &amp; Cricket Games
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#00F0FF", margin: "0 0 8px" }}>🃏 Kachuful (Judgement) Rules</h3>
            <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7, margin: 0 }}>
              Kachuful is a beloved Indian card game named after the suits in order: <strong>Ka</strong> (Kadi/Spades), <strong>Chu</strong> (Chukat/Diamonds), <strong>Fu</strong> (Fuli/Clubs), and <strong>L</strong> (Lal/Hearts). Players predict the exact number of hands they will win. Winning your exact bid earns 10 + (bid × 10) points!
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#D896FF", margin: "0 0 8px" }}>🏏 Cricket Super Striker Tips</h3>
            <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7, margin: 0 }}>
              Watch the bowler's release! Hit the button or press Spacebar when the ball reaches the batsman's crease. Select <strong>Lofted Six</strong> or <strong>Helicopter</strong> for boundary maximums, or play safe ground <strong>Cover Drives</strong> to avoid getting caught out!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
