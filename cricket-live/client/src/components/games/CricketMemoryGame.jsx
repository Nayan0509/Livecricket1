import React, { useState, useEffect } from "react";
import { playCardFlipSound, playCorrectSound, playWinFanfare } from "../../utils/gameAudio";

const CARDS_DATA = [
  { id: "bat",      name: "Cricket Bat", emoji: "🏏" },
  { id: "ball",     name: "Leather Ball", emoji: "🔴" },
  { id: "trophy",   name: "World Cup",   emoji: "🏆" },
  { id: "stumps",   name: "Wicket Stumps", emoji: "🎯" },
  { id: "helmet",   name: "Protective Helmet", emoji: "🪖" },
  { id: "gloves",   name: "Batting Gloves", emoji: "🧤" },
  { id: "stadium",  name: "Cricket Stadium", emoji: "🏟️" },
  { id: "fire",     name: "Sixer Blast",  emoji: "🔥" },
];

function generateShuffledCards() {
  const paired = [...CARDS_DATA, ...CARDS_DATA].map((card, index) => ({
    uid: `${card.id}-${index}`,
    id: card.id,
    name: card.name,
    emoji: card.emoji,
    isFlipped: false,
    isMatched: false,
  }));

  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paired[i], paired[j]] = [paired[j], paired[i]];
  }
  return paired;
}

export default function CricketMemoryGame() {
  const [cards, setCards] = useState(generateShuffledCards);
  const [flippedCards, setFlippedCards] = useState([]); // [card1, card2]
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  const handleCardClick = (card) => {
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    playCardFlipSound();

    const newCards = cards.map(c => c.uid === card.uid ? { ...c, isFlipped: true } : c);
    const newFlipped = [...flippedCards, card];

    setCards(newCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);

      if (newFlipped[0].id === newFlipped[1].id) {
        // MATCH!
        playCorrectSound();
        setCards(prev => prev.map(c => (c.id === newFlipped[0].id ? { ...c, isMatched: true } : c)));
        setMatches(m => {
          const nextMatches = m + 1;
          if (nextMatches === CARDS_DATA.length) {
            setIsWon(true);
            playWinFanfare();
          }
          return nextMatches;
        });
        setFlippedCards([]);
      } else {
        // MISMATCH - Flip back after 0.8s
        setTimeout(() => {
          setCards(prev => prev.map(c => (c.uid === newFlipped[0].uid || c.uid === newFlipped[1].uid ? { ...c, isFlipped: false } : c)));
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  const restartGame = () => {
    setCards(generateShuffledCards());
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setIsWon(false);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>
      {/* Header Info */}
      <div style={{
        background: "linear-gradient(135deg, rgba(13,20,38,0.95), rgba(20,30,55,0.95))",
        border: "1px solid rgba(0,240,255,0.25)",
        borderRadius: 18,
        padding: "16px 22px",
        marginBottom: 20,
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12
      }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#00F0FF", background: "rgba(0,240,255,0.15)", padding: "3px 10px", borderRadius: 20 }}>
            🃏 CRICKET MEMORY PUZZLE
          </span>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginTop: 4 }}>
            Match Pairs: {matches} / {CARDS_DATA.length}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 800 }}>TIME</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>⏱️ {timer}s</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 800 }}>MOVES</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#FFD700" }}>{moves}</div>
          </div>
        </div>
      </div>

      {!isWon ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          background: "rgba(255,255,255,0.02)",
          padding: 16,
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          marginBottom: 20
        }}>
          {cards.map(card => {
            const isRevealed = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.uid}
                onClick={() => handleCardClick(card)}
                style={{
                  aspectRatio: "1/1",
                  borderRadius: 14,
                  cursor: isRevealed ? "default" : "pointer",
                  background: isRevealed ? "rgba(0,240,255,0.15)" : "linear-gradient(135deg, #1e293b, #0f172a)",
                  border: isRevealed ? "2px solid #00F0FF" : "1px solid rgba(255,255,255,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isRevealed ? 34 : 20,
                  color: "#fff",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                  transition: "all 0.25s",
                  transform: isRevealed ? "rotateY(180deg)" : "none"
                }}
              >
                {isRevealed ? (
                  <div style={{ transform: "rotateY(180deg)", textAlign: "center" }}>
                    <div>{card.emoji}</div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: "var(--text2)", marginTop: 2 }}>{card.name.split(" ")[0]}</div>
                  </div>
                ) : (
                  <span style={{ opacity: 0.6 }}>🏏</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px", textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>🎉🌟</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#FFD700", margin: "0 0 8px" }}>
            Memory Match Solved!
          </h2>
          <p style={{ fontSize: 15, color: "var(--text2)", margin: "0 0 20px" }}>
            Completed in <strong style={{ color: "#00F0FF" }}>{timer} seconds</strong> with <strong style={{ color: "#22c55e" }}>{moves} moves</strong>!
          </p>
          <button
            onClick={restartGame}
            style={{
              padding: "14px 32px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #00F0FF, #00B8D9)",
              border: "none",
              color: "#000",
              fontWeight: 900,
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            Play Again 🔄
          </button>
        </div>
      )}
    </div>
  );
}
