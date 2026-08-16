import React, { useState, useEffect } from "react";
import { playCorrectSound, playWicketSound, playWinFanfare } from "../../utils/gameAudio";

const TRIVIA_QUESTIONS = [
  {
    q: "Who is known as the 'Master Blaster' and has scored 100 international centuries?",
    options: ["Virat Kohli", "Sachin Tendulkar", "Brian Lara", "Ricky Ponting"],
    answer: 1,
    fact: "Sachin Tendulkar is the only cricketer in history to score 100 international centuries across Test and ODI cricket!"
  },
  {
    q: "How many players are on the field in a standard cricket team?",
    options: ["9 Players", "10 Players", "11 Players", "12 Players"],
    answer: 2,
    fact: "A cricket team consists of 11 players on the field during a match."
  },
  {
    q: "Which country won the inaugural ICC Men's T20 World Cup in 2007?",
    options: ["Pakistan", "India", "Australia", "West Indies"],
    answer: 1,
    fact: "India won the 2007 T20 World Cup in South Africa under the captaincy of MS Dhoni!"
  },
  {
    q: "What is the maximum number of overs a bowler can bowl in a standard 20-over T20 match?",
    options: ["3 Overs", "4 Overs", "5 Overs", "6 Overs"],
    answer: 1,
    fact: "In a 20-over T20 match, each bowler is restricted to a maximum of 4 overs (one-fifth of total overs)."
  },
  {
    q: "What is it called when a batsman scores 100 runs in a single innings?",
    options: ["Half-Century", "Hat-Trick", "Century", "Duck"],
    answer: 2,
    fact: "Scoring 100 runs is called a Century (or a Ton) in cricket!"
  },
  {
    q: "Which ground is universally known as the 'Home of Cricket'?",
    options: ["Melbourne Cricket Ground", "Eden Gardens", "Lord's Cricket Ground", "The Oval"],
    answer: 2,
    fact: "Lord's in London, England, founded in 1814, is known as the Home of Cricket."
  },
  {
    q: "What is it called when a bowler takes 3 wickets on 3 consecutive deliveries?",
    options: ["Super Over", "Hat-Trick", "Maiden Over", "Powerplay"],
    answer: 1,
    fact: "Taking 3 wickets in 3 back-to-back balls is celebrated as a Hat-Trick!"
  },
  {
    q: "Which team has won the most Indian Premier League (IPL) trophies?",
    options: ["CSK & MI (5 Titles each)", "KKR (4 Titles)", "RCB (3 Titles)", "SRH (3 Titles)"],
    answer: 0,
    fact: "Chennai Super Kings (CSK) and Mumbai Indians (MI) share the record with 5 IPL trophies each!"
  },
  {
    q: "How many runs are awarded if the batsman hits the ball over the boundary ropes on the full?",
    options: ["4 Runs", "5 Runs", "6 Runs", "8 Runs"],
    answer: 2,
    fact: "Hitting the ball over the boundary on the full without touching the grass awards a maximum of 6 Runs (a Sixer)!"
  },
  {
    q: "What is the highest individual score in Test cricket history (400 not out)?",
    options: ["Chris Gayle", "Don Bradman", "Brian Lara", "Matthew Hayden"],
    answer: 2,
    fact: "Brian Lara scored an unbeaten 400* for the West Indies against England in 2004."
  }
];

export default function CricketTriviaGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(true);

  const currentQ = TRIVIA_QUESTIONS[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (!timerActive || gameOver || selectedOption !== null) return;
    if (timeLeft <= 0) {
      handleOptionClick(-1); // Timeout
      return;
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerActive, gameOver, selectedOption]);

  const handleOptionClick = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setTimerActive(false);

    if (idx === currentQ.answer) {
      const addedScore = 100 + (streak * 20) + (timeLeft * 5);
      setScore(prev => prev + addedScore);
      setStreak(prev => prev + 1);
      playCorrectSound();
    } else {
      setStreak(0);
      playWicketSound();
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < TRIVIA_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setTimeLeft(15);
      setTimerActive(true);
    } else {
      setGameOver(true);
      playWinFanfare();
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setTimeLeft(15);
    setTimerActive(true);
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px" }}>
      {/* Header bar */}
      <div style={{
        background: "linear-gradient(135deg, rgba(13,20,38,0.95), rgba(20,30,55,0.95))",
        border: "1px solid rgba(0,240,255,0.25)",
        borderRadius: 18,
        padding: "16px 24px",
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
            🧠 CRICKET TRIVIA MASTER
          </span>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginTop: 4 }}>
            Question {currentIdx + 1} / {TRIVIA_QUESTIONS.length}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 800 }}>TIMER</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: timeLeft <= 5 ? "#ef4444" : "#00F0FF" }}>
              ⏳ {timeLeft}s
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 800 }}>STREAK</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#FFD700" }}>
              🔥 {streak}x
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 800 }}>SCORE</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#22c55e" }}>
              {score}
            </div>
          </div>
        </div>
      </div>

      {!gameOver ? (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", lineHeight: 1.5, marginBottom: 24 }}>
            {currentQ.q}
          </h3>

          {/* Option Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {currentQ.options.map((opt, idx) => {
              let btnBg = "rgba(255,255,255,0.03)";
              let border = "1px solid rgba(255,255,255,0.1)";
              let textColor = "var(--text)";

              if (selectedOption !== null) {
                if (idx === currentQ.answer) {
                  btnBg = "rgba(34,197,94,0.2)";
                  border = "2px solid #22c55e";
                  textColor = "#22c55e";
                } else if (idx === selectedOption) {
                  btnBg = "rgba(239,68,68,0.2)";
                  border = "2px solid #ef4444";
                  textColor = "#ef4444";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={selectedOption !== null}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 14,
                    background: btnBg,
                    border: border,
                    color: textColor,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: selectedOption === null ? "pointer" : "default",
                    textAlign: "left",
                    transition: "all 0.15s",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                  {selectedOption !== null && idx === currentQ.answer && <span>✅</span>}
                  {selectedOption !== null && idx === selectedOption && idx !== currentQ.answer && <span>❌</span>}
                </button>
              );
            })}
          </div>

          {/* Fact card upon answering */}
          {selectedOption !== null && (
            <div style={{
              background: "rgba(0,240,255,0.08)",
              border: "1px solid rgba(0,240,255,0.2)",
              borderRadius: 14,
              padding: "16px 20px",
              marginBottom: 20,
              fontSize: 13,
              color: "var(--text2)",
              lineHeight: 1.7,
              animation: "fadeIn 0.3s ease"
            }}>
              <strong style={{ color: "#00F0FF" }}>💡 Cricket Fact:</strong> {currentQ.fact}
            </div>
          )}

          {selectedOption !== null && (
            <button
              onClick={handleNext}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #00F0FF, #00B8D9)",
                border: "none",
                color: "#000",
                fontWeight: 900,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 0 16px rgba(0,240,255,0.3)"
              }}
            >
              {currentIdx + 1 < TRIVIA_QUESTIONS.length ? "Next Question →" : "See Final Score 🏆"}
            </button>
          )}
        </div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px", textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>🏏🏆</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#FFD700", margin: "0 0 8px" }}>
            Quiz Completed!
          </h2>
          <p style={{ fontSize: 16, color: "var(--text2)", margin: "0 0 20px" }}>
            Your Final Score: <strong style={{ color: "#00F0FF", fontSize: 24 }}>{score} Points</strong>
          </p>
          <div style={{ fontSize: 14, color: "var(--text3)", marginBottom: 28 }}>
            {score >= 800 ? "🌟 Cricket Legend Rank! Outstanding cricket knowledge!" : score >= 500 ? "👏 Great Job! You know your cricket well!" : "👍 Good effort! Play again to boost your score!"}
          </div>
          <button
            onClick={restartQuiz}
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
