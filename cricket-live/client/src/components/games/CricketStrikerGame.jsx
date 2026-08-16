import React, { useState, useEffect, useRef } from "react";
import { playBatHitSound, playSixSound, playWicketSound, playWinFanfare } from "../../utils/gameAudio";

const BALL_TYPES = [
  { name: "Fast Yorker", speed: 1.2, bounce: 0.2, color: "#ef4444" },
  { name: "Outswing Good Length", speed: 1.0, bounce: 0.5, color: "#3b82f6" },
  { name: "Bouncer", speed: 1.3, bounce: 0.9, color: "#f59e0b" },
  { name: "Off-Cutter Slower Ball", speed: 0.75, bounce: 0.4, color: "#10b981" },
  { name: "Sharp Leg-Break", speed: 0.85, bounce: 0.6, color: "#8b5cf6" },
];

export default function CricketStrikerGame() {
  const [gameState, setGameState] = useState("ready"); // ready | bowling | in_play | match_won | match_lost
  const [target, setTarget] = useState(36);
  const [ballsTotal, setBallsTotal] = useState(12);
  const [runs, setRuns] = useState(0);
  const [ballsBowled, setBallsBowled] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [shotType, setShotType] = useState("loft"); // loft | drive | cut | helicopter
  const [commentary, setCommentary] = useState("Tap 'Bowl Delivery' to start the chase!");
  const [lastOutcome, setLastOutcome] = useState(null);
  const [ballPos, setBallPos] = useState({ x: 50, y: 15, visible: false });
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("lcz_cricket_high_score") || "0"));

  const ballAnimRef = useRef(null);
  const ballStartRef = useRef(0);
  const currentDeliveryRef = useRef(BALL_TYPES[0]);

  const startNewMatch = (targetRuns = 36, balls = 12) => {
    setTarget(targetRuns);
    setBallsTotal(balls);
    setRuns(0);
    setBallsBowled(0);
    setWickets(0);
    setCommentary(`Chase ${targetRuns} runs in ${balls} balls (2 Overs) to win!`);
    setLastOutcome(null);
    setGameState("ready");
    setBallPos({ x: 50, y: 15, visible: false });
  };

  const bowlBall = () => {
    if (gameState === "bowling" || gameState === "match_won" || gameState === "match_lost") return;

    const randomBall = BALL_TYPES[Math.floor(Math.random() * BALL_TYPES.length)];
    currentDeliveryRef.current = randomBall;
    setGameState("bowling");
    setLastOutcome(null);
    setCommentary(`Bowler running in... It's a ${randomBall.name}!`);

    const startTime = Date.now();
    ballStartRef.current = startTime;
    const duration = 1400 / randomBall.speed;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Parabolic pitch path from top (bowler) to bottom (batsman)
      const y = 15 + progress * 70; // 15% to 85%
      const swing = Math.sin(progress * Math.PI) * (randomBall.name.includes("Outswing") ? 8 : randomBall.name.includes("Leg-Break") ? -8 : 0);
      const x = 50 + swing;

      setBallPos({ x, y, visible: true });

      if (progress < 1) {
        ballAnimRef.current = requestAnimationFrame(animate);
      } else {
        // Missed shot / bowled
        handleMiss();
      }
    };

    ballAnimRef.current = requestAnimationFrame(animate);
  };

  const handleHit = () => {
    if (gameState !== "bowling") return;
    if (ballAnimRef.current) cancelAnimationFrame(ballAnimRef.current);

    const elapsed = Date.now() - ballStartRef.current;
    const duration = 1400 / currentDeliveryRef.current.speed;
    const timingRatio = elapsed / duration; // 0.85 to 0.98 is sweet spot

    playBatHitSound();

    let outcomeRuns = 0;
    let isOut = false;
    let outcomeText = "";

    // Timing evaluation
    if (timingRatio >= 0.82 && timingRatio <= 0.96) {
      // PERFECT TIMING
      if (shotType === "loft" || shotType === "helicopter") {
        outcomeRuns = 6;
        outcomeText = "🚀 MASSIVE SIX! Out of the ground!";
        playSixSound();
      } else {
        outcomeRuns = 4;
        outcomeText = "🏏 CRACKING FOUR! Beautiful timing through the covers!";
        playSixSound();
      }
    } else if (timingRatio >= 0.70 && timingRatio < 0.82) {
      // EARLY
      if (shotType === "loft" && Math.random() > 0.4) {
        isOut = true;
        outcomeText = "🔴 CAUGHT! Sliced high in the air to long-off!";
        playWicketSound();
      } else {
        outcomeRuns = Math.random() > 0.5 ? 2 : 1;
        outcomeText = `⚡ Driven into the gap for ${outcomeRuns} run${outcomeRuns > 1 ? "s" : ""}!`;
      }
    } else if (timingRatio > 0.96 && timingRatio <= 1.05) {
      // LATE
      if (shotType === "cut") {
        outcomeRuns = 4;
        outcomeText = "⚡ DELICATE LATE CUT! Races past third man for FOUR!";
        playSixSound();
      } else if (Math.random() > 0.45) {
        isOut = true;
        outcomeText = "🔴 EDGED & TAKEN! Keeper takes a sharp catch!";
        playWicketSound();
      } else {
        outcomeRuns = 1;
        outcomeText = "🏃 Pushed with soft hands for a quick single!";
      }
    } else {
      // BAD MISS / BOWLED
      isOut = true;
      outcomeText = "🎯 BOWLED HIM! Missed the line completely, stumps shattered!";
      playWicketSound();
    }

    processDelivery(outcomeRuns, isOut, outcomeText);
  };

  const handleMiss = () => {
    const isBowled = Math.random() > 0.35;
    const outcomeRuns = 0;
    const isOut = isBowled;
    const outcomeText = isBowled
      ? "🎯 BOWLED HIM! Beaten for pace and castles the middle stump!"
      : "🛡️ Beat the outside edge! Dot ball.";

    if (isBowled) playWicketSound();
    processDelivery(outcomeRuns, isOut, outcomeText);
  };

  const processDelivery = (scoredRuns, isOut, outcomeText) => {
    const nextRuns = runs + scoredRuns;
    const nextBalls = ballsBowled + 1;
    const nextWickets = wickets + (isOut ? 1 : 0);

    setRuns(nextRuns);
    setBallsBowled(nextBalls);
    setWickets(nextWickets);
    setLastOutcome(outcomeText);
    setCommentary(outcomeText);
    setBallPos(prev => ({ ...prev, visible: false }));

    if (nextRuns > highScore) {
      setHighScore(nextRuns);
      localStorage.setItem("lcz_cricket_high_score", nextRuns.toString());
    }

    // Check Win / Loss conditions
    if (nextRuns >= target) {
      setGameState("match_won");
      setCommentary(`🏆 INCREDIBLE VICTORY! You chased ${target} runs with ${ballsTotal - nextBalls} balls remaining!`);
      playWinFanfare();
    } else if (nextWickets >= 2) {
      setGameState("match_lost");
      setCommentary(`❌ ALL OUT! Lost 2 wickets. You scored ${nextRuns}/${nextWickets}. Better luck next time!`);
    } else if (nextBalls >= ballsTotal) {
      setGameState("match_lost");
      setCommentary(`❌ OVERS FINISHED! Needed ${target - nextRuns} more runs to win.`);
    } else {
      setGameState("ready");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "ready") bowlBall();
        else if (gameState === "bowling") handleHit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (ballAnimRef.current) cancelAnimationFrame(ballAnimRef.current);
    };
  }, [gameState, shotType]);

  const ballsLeft = ballsTotal - ballsBowled;
  const runsNeeded = Math.max(0, target - runs);
  const oversFormatted = `${Math.floor(ballsBowled / 6)}.${ballsBowled % 6}`;

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "0 16px" }}>
      {/* Scoreboard Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(13,20,38,0.95), rgba(20,30,55,0.95))",
        border: "1px solid rgba(0,240,255,0.25)",
        borderRadius: 18,
        padding: "18px 24px",
        marginBottom: 20,
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: 14,
        textAlign: "center"
      }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 800, textTransform: "uppercase" }}>Target</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#FFD700" }}>{target}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 800, textTransform: "uppercase" }}>Score</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#00F0FF" }}>{runs}/{wickets}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 800, textTransform: "uppercase" }}>Overs (Balls)</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{oversFormatted} <span style={{ fontSize: 13, color: "var(--text3)" }}>({ballsLeft} left)</span></div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 800, textTransform: "uppercase" }}>Needed</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: runsNeeded === 0 ? "#22c55e" : "#FF1053" }}>
            {runsNeeded === 0 ? "WON!" : `${runsNeeded} Runs`}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 800, textTransform: "uppercase" }}>High Score</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#D896FF" }}>👑 {highScore}</div>
        </div>
      </div>

      {/* 2D Stadium Pitch View */}
      <div style={{
        position: "relative",
        height: 380,
        borderRadius: 20,
        overflow: "hidden",
        background: "linear-gradient(180deg, #1e3a24 0%, #234d2c 40%, #2f683b 100%)",
        border: "2px solid rgba(255,255,255,0.15)",
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)",
        marginBottom: 20,
      }}>
        {/* Stadium Crowd Background */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 45, background: "repeating-linear-gradient(90deg, #18281a, #203523 10px, #152417 20px)", opacity: 0.6, borderBottom: "2px solid #fff" }}>
          <div style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", paddingTop: 12, letterSpacing: 2 }}>
            STADIUM CROWD
          </div>
        </div>

        {/* Pitch Area */}
        <div style={{
          position: "absolute",
          top: "14%",
          bottom: "8%",
          left: "35%",
          right: "35%",
          background: "linear-gradient(180deg, #c2a677 0%, #b89a69 50%, #ad8e5c 100%)",
          borderRadius: 8,
          border: "1px dashed rgba(255,255,255,0.4)",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}>
          {/* Bowling Crease (Top) */}
          <div style={{ position: "absolute", top: 18, left: 0, right: 0, height: 2, background: "#fff" }} />
          {/* Bowling Stumps */}
          <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", fontSize: 16 }}>
            🏏
          </div>

          {/* Batting Crease (Bottom) */}
          <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, height: 2, background: "#fff" }} />
          {/* Batting Stumps */}
          <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", fontSize: 16 }}>
            🏏
          </div>
        </div>

        {/* Bowler Avatar (Top) */}
        <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ fontSize: 24, animation: gameState === "bowling" ? "bounce 0.4s infinite" : "none" }}>🏃‍♂️</div>
          <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "1px 6px", borderRadius: 6 }}>Bowler</span>
        </div>

        {/* Batsman Avatar (Bottom) */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div style={{ fontSize: 32, transform: shotType === "helicopter" ? "scaleX(-1)" : "none" }}>
            {gameState === "bowling" ? "🏏" : "🧑‍🦱"}
          </div>
          <span style={{ fontSize: 9, fontWeight: 800, color: "#00F0FF", background: "rgba(0,0,0,0.7)", padding: "1px 6px", borderRadius: 6 }}>You (Batter)</span>
        </div>

        {/* Animated Cricket Ball */}
        {ballPos.visible && (
          <div style={{
            position: "absolute",
            top: `${ballPos.y}%`,
            left: `${ballPos.x}%`,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a, #800)",
            boxShadow: "0 0 10px #ff4444, 0 4px 6px rgba(0,0,0,0.4)",
            transform: "translate(-50%, -50%)",
            transition: "none",
            zIndex: 10,
          }} />
        )}

        {/* Last Outcome Banner Overlay */}
        {lastOutcome && (
          <div style={{
            position: "absolute",
            top: "42%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: lastOutcome.includes("SIX") || lastOutcome.includes("FOUR") ? "rgba(34,197,94,0.95)" : lastOutcome.includes("BOWLED") || lastOutcome.includes("CAUGHT") ? "rgba(239,68,68,0.95)" : "rgba(13,20,38,0.9)",
            color: "#fff",
            padding: "10px 22px",
            borderRadius: 14,
            fontWeight: 900,
            fontSize: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
            textAlign: "center",
            border: "2px solid #fff",
            animation: "popIn 0.3s ease-out",
            zIndex: 20,
          }}>
            {lastOutcome}
          </div>
        )}

        {/* Game Finished Overlay */}
        {(gameState === "match_won" || gameState === "match_lost") && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(9,12,25,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 30,
          }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{gameState === "match_won" ? "🏆" : "💔"}</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: gameState === "match_won" ? "#22c55e" : "#ef4444", margin: "0 0 8px" }}>
              {gameState === "match_won" ? "MATCH WON!" : "MATCH LOST"}
            </h2>
            <p style={{ fontSize: 14, color: "var(--text2)", maxWidth: 450, textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>
              {commentary}
            </p>
            <button
              onClick={() => startNewMatch(36, 12)}
              style={{
                padding: "14px 32px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #00F0FF, #00B8D9)",
                border: "none",
                color: "#000",
                fontWeight: 900,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(0,240,255,0.4)"
              }}
            >
              Play Again 🏏
            </button>
          </div>
        )}
      </div>

      {/* Commentary Box */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "12px 18px",
        fontSize: 13,
        color: "var(--text2)",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>🎙️</span>
        <strong style={{ color: "#00F0FF" }}>Live Commentary:</strong> {commentary}
      </div>

      {/* Shot Selector & Action Controls */}
      <div style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "20px",
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text)", textTransform: "uppercase", marginBottom: 10 }}>
          1. Select Your Batting Shot:
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 18 }}>
          {[
            { id: "loft",        label: "🚀 Lofted Six",    desc: "Hits big 6s, high risk" },
            { id: "drive",       label: "🏏 Cover Drive",   desc: "Safe 4s along the carpet" },
            { id: "cut",         label: "⚡ Late Cut",      desc: "Great against fast pace" },
            { id: "helicopter",  label: "🚁 Helicopter",    desc: "Unleash maximum power" },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setShotType(s.id)}
              style={{
                padding: "12px",
                borderRadius: 12,
                cursor: "pointer",
                background: shotType === s.id ? "rgba(0,240,255,0.18)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${shotType === s.id ? "#00F0FF" : "rgba(255,255,255,0.08)"}`,
                color: shotType === s.id ? "#fff" : "var(--text3)",
                textAlign: "left",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 13, color: shotType === s.id ? "#00F0FF" : "#fff" }}>{s.label}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          {gameState === "ready" ? (
            <button
              onClick={bowlBall}
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #00F0FF, #00B8D9)",
                border: "none",
                color: "#000",
                fontWeight: 900,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(0,240,255,0.35)",
              }}
            >
              🎾 Bowl Delivery (Press Spacebar)
            </button>
          ) : gameState === "bowling" ? (
            <button
              onClick={handleHit}
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                border: "none",
                color: "#fff",
                fontWeight: 900,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "0 0 25px rgba(239,68,68,0.5)",
                animation: "pulse 0.6s infinite",
              }}
            >
              💥 HIT SHOT NOW! (Tap or Spacebar)
            </button>
          ) : (
            <button
              onClick={() => startNewMatch(36, 12)}
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              🔄 Start New Match
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
