import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdBanner from "../components/AdBanner";

const STEPS = [
  {
    emoji: "🏏",
    heading: "Watch Live Cricket",
    sub: "Get instant access to live match streaming",
    btn: "Click Here to Watch Live Match",
    btnColor: "var(--green)",
    bg: "linear-gradient(135deg, #0a2e14, #0f1a0d)",
    hint: "Free • No signup required",
  },
  {
    emoji: "📡",
    heading: "Connecting to Stream",
    sub: "Your live match is being prepared",
    btn: "Continue to Live Match →",
    btnColor: "#2196f3",
    bg: "linear-gradient(135deg, #0a1929, #0d1b2a)",
    hint: "HD quality available",
  },
  {
    emoji: "⚡",
    heading: "Almost There!",
    sub: "Stream is loading, just one more step",
    btn: "Load My Live Stream",
    btnColor: "#ff9800",
    bg: "linear-gradient(135deg, #1a1200, #2a1f00)",
    hint: "Buffering complete — ready to play",
  },
  {
    emoji: "🔓",
    heading: "Unlock Your Stream",
    sub: "Verify you're not a robot to continue",
    btn: "Yes, Show Me the Match!",
    btnColor: "#9c27b0",
    bg: "linear-gradient(135deg, #1a0029, #120020)",
    hint: "Secure & encrypted connection",
  },
  {
    emoji: "⏳",
    heading: "Try Again After Some Time",
    sub: "Too many requests. Please wait before trying again.",
    btn: null, // no button — shows cooldown
    btnColor: null,
    bg: "linear-gradient(135deg, #1a0000, #2a0000)",
    hint: null,
    isFinal: true,
  },
];

const COUNTDOWN_SECS = 5;
const COOLDOWN_SECS = 60; // 1 min cooldown on final page

function CircleTimer({ seconds, total }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const progress = (seconds / total) * circ;

  return (
    <svg width={70} height={70} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={35} cy={35} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={4} />
      <circle
        cx={35} cy={35} r={r} fill="none"
        stroke="var(--green)" strokeWidth={4}
        strokeDasharray={circ}
        strokeDashoffset={circ - progress}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      <text
        x={35} y={35}
        textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize={16} fontWeight={700}
        style={{ transform: "rotate(90deg)", transformOrigin: "35px 35px" }}
      >
        {seconds}
      </text>
    </svg>
  );
}

function CooldownTimer({ seconds }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pct = (seconds / COOLDOWN_SECS) * 100;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>⏳</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: "var(--red)", marginBottom: 8 }}>
        {mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`}
      </div>
      <div style={{ width: "100%", maxWidth: 300, margin: "0 auto 16px", height: 6,
        background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          background: "var(--red)",
          width: `${pct}%`,
          transition: "width 1s linear"
        }} />
      </div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
        Please wait before trying again
      </div>
    </div>
  );
}

export default function WatchLive() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const [ready, setReady] = useState(false);
  const [cooldown, setCooldown] = useState(COOLDOWN_SECS);
  const [cooldownDone, setCooldownDone] = useState(false);

  const current = STEPS[step];

  // Countdown timer — resets on each step change
  useEffect(() => {
    setReady(false);
    setCountdown(COUNTDOWN_SECS);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Cooldown timer on final step
  useEffect(() => {
    if (!current.isFinal) return;
    setCooldown(COOLDOWN_SECS);
    setCooldownDone(false);
    const interval = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCooldownDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [current.isFinal]);

  const handleClick = useCallback(() => {
    if (!ready) return;
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    }
  }, [ready, step]);

  const handleRetry = () => {
    setStep(0);
    setCooldownDone(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: current.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, transition: "background 0.6s ease"
    }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>

        {/* Step dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 4,
              background: i < step ? "var(--green)" : i === step ? "white" : "rgba(255,255,255,0.2)",
              transition: "all 0.3s"
            }} />
          ))}
        </div>

        {/* Emoji */}
        <div style={{
          fontSize: 72, marginBottom: 24,
          animation: "bounce 0.5s ease",
        }}>
          {current.emoji}
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 28, fontWeight: 800, color: "white",
          marginBottom: 12, lineHeight: 1.3
        }}>
          {current.heading}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 40 }}>
          {current.sub}
        </p>

        {/* Final step — cooldown */}
        {current.isFinal ? (
          <div>
            {!cooldownDone ? (
              <CooldownTimer seconds={cooldown} />
            ) : (
              <div>
                <div style={{ color: "var(--green)", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
                  ✅ You can try again now!
                </div>
                <button onClick={handleRetry} style={{
                  background: "var(--green)", color: "#000",
                  border: "none", borderRadius: 12, padding: "16px 40px",
                  fontSize: 16, fontWeight: 700, cursor: "pointer",
                  width: "100%", maxWidth: 360
                }}>
                  🔄 Try Again
                </button>
              </div>
            )}
            <button onClick={() => navigate("/")} style={{
              background: "transparent", color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
              padding: "10px 24px", fontSize: 13, cursor: "pointer",
              marginTop: 20, width: "100%", maxWidth: 360
            }}>
              ← Back to Home
            </button>
          </div>
        ) : (
          /* Normal steps — countdown + button */
          <div>
        {/* Ad shown while user waits for countdown */}
        <div style={{ marginBottom: 28, width: "100%", maxWidth: 480 }}>
          <AdBanner type="responsive" slot="1234567894" />
        </div>

        {/* Countdown ring */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              {!ready ? (
                <CircleTimer seconds={countdown} total={COUNTDOWN_SECS} />
              ) : (
                <div style={{
                  width: 70, height: 70, borderRadius: "50%",
                  background: "rgba(0,200,83,0.15)", border: "2px solid var(--green)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, animation: "pulse-ring 1s infinite"
                }}>✓</div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleClick}
              disabled={!ready}
              style={{
                background: ready ? current.btnColor : "rgba(255,255,255,0.1)",
                color: ready ? "#fff" : "rgba(255,255,255,0.3)",
                border: "none", borderRadius: 12,
                padding: "18px 32px", fontSize: 16, fontWeight: 700,
                cursor: ready ? "pointer" : "not-allowed",
                width: "100%", maxWidth: 380,
                transition: "all 0.3s",
                transform: ready ? "scale(1)" : "scale(0.97)",
                boxShadow: ready ? `0 8px 32px ${current.btnColor}44` : "none",
              }}
            >
              {ready ? current.btn : `Wait ${countdown}s...`}
            </button>

            {current.hint && (
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 16 }}>
                🔒 {current.hint}
              </div>
            )}

            {/* Skip to home */}
            <button onClick={() => navigate("/")} style={{
              background: "transparent", color: "rgba(255,255,255,0.3)",
              border: "none", fontSize: 12, cursor: "pointer", marginTop: 24,
              textDecoration: "underline"
            }}>
              ← Back to Home
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,200,83,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(0,200,83,0); }
        }
      `}</style>
    </div>
  );
}
