import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdBanner from "../components/AdBanner";
import SEO from "../components/SEO";

const STEPS = [
  {
    emoji: "🏏",
    heading: "Watch Live Cricket",
    sub: "Get instant access to live match streaming",
    btn: "Click Here to Watch Live Match",
    hint: "Free • No signup required",
  },
  {
    emoji: "📡",
    heading: "Connecting to Stream",
    sub: "Your live match is being prepared",
    btn: "Continue to Live Match →",
    hint: "HD quality available",
  },
  {
    emoji: "⚡",
    heading: "Almost There!",
    sub: "Stream is loading, just one more step",
    btn: "Load My Live Stream",
    hint: "Buffering complete — ready to play",
  },
  {
    emoji: "🔓",
    heading: "Unlock Your Stream",
    sub: "Verify you're not a robot to continue",
    btn: "Yes, Show Me the Match!",
    hint: "Secure & encrypted connection",
  },
  {
    emoji: "⏳",
    heading: "Try Again After Some Time",
    sub: "Too many requests. Please wait before trying again.",
    btn: null,
    hint: null,
    isFinal: true,
  },
];

const COUNTDOWN_SECS = 5;
const COOLDOWN_SECS = 60; // 1 min cooldown on final page

function CircleTimer({ seconds, total }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const progress = (seconds / total) * circ;

  return (
    <svg width={80} height={80} style={{ transform: "rotate(-90deg)", filter: "drop-shadow(0 4px 12px rgba(224, 45, 45, 0.3))" }}>
      <circle cx={40} cy={40} r={r} fill="none" stroke="var(--border)" strokeWidth={5} />
      <circle
        cx={40} cy={40} r={r} fill="none"
        stroke="url(#gradient)" strokeWidth={5}
        strokeDasharray={circ}
        strokeDashoffset={circ - progress}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e02d2d" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <text
        x={40} y={40}
        textAnchor="middle" dominantBaseline="central"
        fill="var(--text)" fontSize={20} fontWeight={800}
        style={{ transform: "rotate(90deg)", transformOrigin: "40px 40px", fontFamily: "'Poppins', sans-serif" }}
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
      <div style={{ fontSize: 72, marginBottom: 16 }}>⏳</div>
      <div style={{ 
        fontSize: 48, 
        fontWeight: 900, 
        background: "var(--gradient-primary)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 16,
        fontFamily: "'Poppins', sans-serif"
      }}>
        {mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`}
      </div>
      <div style={{ 
        width: "100%", 
        maxWidth: 400, 
        margin: "0 auto 20px", 
        height: 8,
        background: "var(--bg3)", 
        borderRadius: "var(--radius)", 
        overflow: "hidden",
        border: "1px solid var(--border)"
      }}>
        <div style={{
          height: "100%", 
          borderRadius: "var(--radius)",
          background: "var(--gradient-primary)",
          width: `${pct}%`,
          transition: "width 1s linear",
          boxShadow: "0 0 10px var(--live-glow)"
        }} />
      </div>
      <div style={{ color: "var(--text2)", fontSize: 15, fontWeight: 500 }}>
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
    <>
      <SEO 
        title="Watch Live Cricket Match Online Free - Live Cricket Streaming 2026"
        description="Watch live cricket match online free. Stream live cricket matches today with HD quality. Free cricket live streaming for IPL, T20 World Cup, ODI, Test matches. No signup required."
        keywords="watch live cricket, watch cricket live, live cricket streaming, watch live match, cricket live stream free, watch cricket online, live cricket match today, stream cricket live, watch ipl live, watch t20 world cup live, free cricket streaming, cricket live tv, watch cricket match online, live cricket video, cricket streaming sites"
        url="/watch-live"
      />
      
      <div style={{
      minHeight: "100vh", 
      background: "var(--bg)",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: 20
    }}>
      <div className="container" style={{ maxWidth: 600, textAlign: "center" }}>

        {/* Step Progress */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 32 : 10, 
              height: 10, 
              borderRadius: 5,
              background: i < step ? "var(--gradient-primary)" : i === step ? "var(--primary)" : "var(--border)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: i === step ? "0 0 20px var(--live-glow)" : "none"
            }} />
          ))}
        </div>

        {/* Icon with gradient background */}
        <div style={{
          width: 120,
          height: 120,
          margin: "0 auto 32px",
          background: "var(--gradient-primary)",
          borderRadius: "var(--radius-xl)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          boxShadow: "var(--shadow-2xl)",
          animation: "bounce 0.6s ease",
        }}>
          {current.emoji}
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 36, 
          fontWeight: 900, 
          color: "var(--text)",
          marginBottom: 16, 
          lineHeight: 1.2,
          fontFamily: "'Poppins', sans-serif",
          background: "var(--gradient-primary)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          {current.heading}
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 18, marginBottom: 48, lineHeight: 1.6 }}>
          {current.sub}
        </p>

        {/* Final step — cooldown */}
        {current.isFinal ? (
          <div className="card" style={{ padding: 40 }}>
            {!cooldownDone ? (
              <CooldownTimer seconds={cooldown} />
            ) : (
              <div>
                <div style={{ 
                  color: "var(--accent-green)", 
                  fontSize: 20, 
                  fontWeight: 700, 
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}>
                  <span style={{ fontSize: 28 }}>✅</span> You can try again now!
                </div>
                <button onClick={handleRetry} className="btn btn-primary" style={{
                  width: "100%",
                  padding: "18px",
                  fontSize: 16,
                  justifyContent: "center"
                }}>
                  🔄 Try Again
                </button>
              </div>
            )}
            <button onClick={() => navigate("/")} className="btn btn-outline" style={{
              marginTop: 16,
              width: "100%",
              padding: "14px",
              justifyContent: "center"
            }}>
              ← Back to Home
            </button>
          </div>
        ) : (
          /* Normal steps — countdown + button */
          <div>
            {/* Ad shown while user waits for countdown */}
            <div className="card" style={{ marginBottom: 32, padding: 20 }}>
              <AdBanner type="responsive" slot="1234567894" />
            </div>

            {/* Countdown ring */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              {!ready ? (
                <CircleTimer seconds={countdown} total={COUNTDOWN_SECS} />
              ) : (
                <div style={{
                  width: 80, 
                  height: 80, 
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.15)", 
                  border: "3px solid var(--accent-green)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: 32, 
                  animation: "pulse-ring 1s infinite",
                  boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)"
                }}>✓</div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleClick}
              disabled={!ready}
              className={ready ? "btn btn-primary" : ""}
              style={{
                background: ready ? "var(--gradient-primary)" : "var(--bg3)",
                color: ready ? "#fff" : "var(--text3)",
                border: ready ? "none" : "2px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 40px", 
                fontSize: 18, 
                fontWeight: 700,
                cursor: ready ? "pointer" : "not-allowed",
                width: "100%",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: ready ? "scale(1)" : "scale(0.98)",
                boxShadow: ready ? "var(--shadow-xl)" : "var(--shadow-sm)",
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {ready ? current.btn : `Wait ${countdown}s...`}
            </button>

            {current.hint && (
              <div style={{ 
                color: "var(--text3)", 
                fontSize: 13, 
                marginTop: 20,
                padding: "12px 20px",
                background: "var(--bg3)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)"
              }}>
                🔒 {current.hint}
              </div>
            )}

            {/* Skip to home */}
            <button onClick={() => navigate("/")} className="btn btn-outline" style={{
              marginTop: 24,
              width: "100%",
              padding: "12px",
              justifyContent: "center"
            }}>
              ← Back to Home
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0% { transform: scale(0.7) rotate(-5deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes pulse-ring {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 0 20px rgba(16, 185, 129, 0);
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}
