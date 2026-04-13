import React, { useState } from "react";

export default function StreamDisclaimer() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div style={{
      borderRadius: 16, overflow: "hidden", marginBottom: 24,
      border: "1px solid rgba(245,158,11,0.3)",
      background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(8,14,26,0.98) 100%)",
    }}>

      {/* ── TOP BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px",
        background: "rgba(245,158,11,0.1)",
        borderBottom: "1px solid rgba(245,158,11,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15 }}>📋</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#fde047" }}>
            How to Watch Live Stream
          </span>
          <span style={{
            fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
            background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)",
            color: "#fb7185", textTransform: "uppercase", letterSpacing: 0.5,
          }}>Read Before Watching</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: "none", border: "none", color: "rgba(255,255,255,0.35)",
            fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 4px",
          }}
          title="Dismiss"
        >×</button>
      </div>

      <div style={{ padding: "18px 18px 20px" }}>

        {/* ── STEPS ROW ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 10, marginBottom: 16,
        }}>
          {[
            { n: "1", color: "#818cf8", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)",  icon: "🌐", title: "Use Chrome",          desc: "Open this page in Google Chrome for best stream experience." },
            { n: "2", color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)", icon: "🏏", title: "Click Live Match",    desc: "Tap any live match card and click the Watch button." },
            { n: "3", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)", icon: "⏱️", title: "5-sec Countdown",    desc: "Wait 5 seconds — stream opens automatically in a new tab." },
            { n: "4", color: "#fb7185", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",  icon: "📺", title: "Watch in New Tab",  desc: "Switch to the new tab. Stream plays — enjoy!" },
          ].map(s => (
            <div key={s.n} style={{
              padding: "12px 14px", borderRadius: 10,
              background: s.bg, border: `1px solid ${s.border}`,
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                background: s.bg, border: `1.5px solid ${s.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, color: s.color,
              }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", marginBottom: 3 }}>
                  {s.icon} {s.title}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TWO ALERT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>

          {/* Popup blocked */}
          <div style={{
            padding: "14px 16px", borderRadius: 10,
            background: "rgba(234,179,8,0.07)", border: "1px solid rgba(234,179,8,0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fde047" }}>
                Browser Blocked the Popup?
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {[
                "Look for 🚫 icon in address bar",
                'Click it → select "Always allow"',
                'Then click "🔁 Open Again" button',
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "#f59e0b", fontWeight: 900, fontSize: 11, flexShrink: 0, marginTop: 1 }}>→</span>
                  <span style={{ fontSize: 10, color: "rgba(253,224,71,0.7)", lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
            {/* Mock "Open Again" button */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.5)",
              borderRadius: 8, padding: "6px 14px",
              fontSize: 11, fontWeight: 800, color: "#fde047",
            }}>
              🔁 Open Again
            </div>
          </div>

          {/* New tab popup */}
          <div style={{
            padding: "14px 16px", borderRadius: 10,
            background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.3)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 14 }}>🔔</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fb7185" }}>
                Popup in New Tab? Click Cancel
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {[
                'A dialog says "Join Telegram" — click Cancel',
                'Never click "OK" or "Allow"',
                "Stream plays after you dismiss it",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "#ef4444", fontWeight: 900, fontSize: 11, flexShrink: 0, marginTop: 1 }}>→</span>
                  <span style={{ fontSize: 10, color: "rgba(251,113,133,0.7)", lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
            {/* Mock dialog */}
            <div style={{
              background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "8px 12px",
            }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                finallylivestream.pages.dev says:
              </div>
              <div style={{ fontSize: 10, color: "#fff", fontWeight: 600, marginBottom: 8 }}>
                Join Our Telegram Channel @Finallylive
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{
                  padding: "3px 12px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                  background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)",
                }}>OK</div>
                <div style={{
                  padding: "3px 12px", borderRadius: 20, fontSize: 10, fontWeight: 800,
                  background: "rgba(239,68,68,0.25)", border: "1px solid rgba(239,68,68,0.6)",
                  color: "#fb7185",
                }}>✓ Cancel ← Click this</div>
              </div>
            </div>
          </div>

        </div>

        {/* ── CHROME TIP ── */}
        <div style={{
          marginTop: 10, padding: "10px 14px", borderRadius: 10,
          background: "rgba(66,133,244,0.07)", border: "1px solid rgba(66,133,244,0.25)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r="10" fill="#fff"/>
            <circle cx="10" cy="10" r="4" fill="#4285F4"/>
            <path d="M10 6h8A10 10 0 0 0 2 6h8z" fill="#EA4335"/>
            <path d="M6 10A4 4 0 0 0 10 14L7 19A10 10 0 0 1 .5 10H6z" fill="#34A853"/>
            <path d="M14 10A4 4 0 0 1 10 14l3 5A10 10 0 0 0 19.5 10H14z" fill="#FBBC05"/>
          </svg>
          <span style={{ fontSize: 11, color: "rgba(147,197,253,0.8)", lineHeight: 1.5 }}>
            <strong style={{ color: "#93c5fd" }}>💡 Use Google Chrome</strong> — best browser for live streams. Allows popups reliably and plays HD streams without issues.
            Download free at <strong style={{ color: "#93c5fd" }}>google.com/chrome</strong>
          </span>
        </div>

      </div>
    </div>
  );
}
