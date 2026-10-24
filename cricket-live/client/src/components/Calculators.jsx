import React, { useState } from "react";
import { oversToBalls, ballsToOvers, chase, netRunRate, battingFigures, bowlingFigures, fmt } from "../utils/cricketMath";

// Interactive calculators for /tools/<slug>. All arithmetic lives in
// utils/cricketMath.js (tested by scratch/test_cricket_math.js).

const INPUT = {
  width: "100%", padding: "9px 12px", borderRadius: 10, boxSizing: "border-box",
  background: "var(--card)", border: "1px solid rgba(15,23,42,0.12)",
  color: "var(--text)", fontSize: 14,
};
const LABEL = { display: "block", fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 6 };
const PANEL = { padding: "18px 20px", borderRadius: 14, background: "var(--card)", border: "1px solid rgba(15,23,42,0.08)", marginBottom: 18 };
const GRID = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 };
const ERROR = { color: "#c81e28", fontSize: 13, margin: "10px 0 0" };

function Field({ label, value, onChange, placeholder, hint }) {
  return (
    <label style={{ display: "block" }}>
      <span style={LABEL}>{label}</span>
      <input inputMode="decimal" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={INPUT} />
      {hint && <span style={{ display: "block", fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{hint}</span>}
    </label>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text2)", cursor: "pointer", whiteSpace: "nowrap" }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function Result({ items }) {
  return (
    <div style={{ ...GRID, marginTop: 16 }}>
      {items.map(([label, value]) => (
        <div key={label} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(11,99,196,0.06)", border: "1px solid rgba(11,99,196,0.18)" }}>
          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", marginTop: 4 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

// Whole numbers only (runs, wickets, dismissals). "" stays empty.
const int = v => (/^\d+$/.test(String(v).trim()) ? Number(v) : null);

function QuotaSelect({ value, onChange }) {
  return (
    <label style={{ display: "block", maxWidth: 220 }}>
      <span style={LABEL}>Overs per innings</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={INPUT}>
        <option value="20">20 (T20)</option>
        <option value="50">50 (ODI)</option>
        <option value="10">10</option>
      </select>
    </label>
  );
}

const quotaToBalls = q => Number(q) * 6;

// ─── Net run rate ─────────────────────────────────────────────────────────────

const EMPTY_MATCH = { runsFor: "", oversFor: "", allOutFor: false, runsAgainst: "", oversAgainst: "", allOutAgainst: false };

function NetRunRateCalculator() {
  const [quota, setQuota] = useState("20");
  const [matches, setMatches] = useState([{ ...EMPTY_MATCH }, { ...EMPTY_MATCH }]);
  const quotaBalls = quotaToBalls(quota);

  const update = (i, key, value) => setMatches(ms => ms.map((m, j) => (j === i ? { ...m, [key]: value } : m)));

  const parsed = matches.map(m => ({
    runsFor: int(m.runsFor),
    ballsFaced: m.allOutFor ? quotaBalls : oversToBalls(m.oversFor),
    allOutBatting: m.allOutFor,
    runsAgainst: int(m.runsAgainst),
    ballsBowled: m.allOutAgainst ? quotaBalls : oversToBalls(m.oversAgainst),
    allOutBowling: m.allOutAgainst,
    quotaBalls,
  }));
  const filled = parsed.filter((p, i) => Object.entries(matches[i]).some(([k, v]) => typeof v === "string" && v.trim() !== ""));
  const invalid = filled.some(p => p.runsFor === null || p.runsAgainst === null || p.ballsFaced === null || p.ballsBowled === null
    || p.ballsFaced > quotaBalls || p.ballsBowled > quotaBalls);
  const result = filled.length > 0 && !invalid ? netRunRate(filled) : null;

  return (
    <div style={PANEL}>
      <QuotaSelect value={quota} onChange={setQuota} />
      {matches.map((m, i) => (
        <fieldset key={i} style={{ border: "1px solid rgba(15,23,42,0.08)", borderRadius: 12, padding: "12px 14px", margin: "14px 0 0" }}>
          <legend style={{ fontSize: 12, fontWeight: 800, color: "var(--text2)", padding: "0 6px" }}>Match {i + 1}</legend>
          <div style={GRID}>
            <Field label="Runs scored" value={m.runsFor} onChange={v => update(i, "runsFor", v)} placeholder="e.g. 172" />
            <Field label="Overs faced" value={m.oversFor} onChange={v => update(i, "oversFor", v)} placeholder="e.g. 19.4" />
            <Field label="Runs conceded" value={m.runsAgainst} onChange={v => update(i, "runsAgainst", v)} placeholder="e.g. 168" />
            <Field label="Overs bowled" value={m.oversAgainst} onChange={v => update(i, "oversAgainst", v)} placeholder="e.g. 20" />
          </div>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 10 }}>
            <Check label="We were bowled out" checked={m.allOutFor} onChange={v => update(i, "allOutFor", v)} />
            <Check label="We bowled them out" checked={m.allOutAgainst} onChange={v => update(i, "allOutAgainst", v)} />
            {matches.length > 1 && (
              <button type="button" onClick={() => setMatches(ms => ms.filter((_, j) => j !== i))}
                style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 12 }}>
                Remove match
              </button>
            )}
          </div>
        </fieldset>
      ))}
      <button type="button" className="btn btn-secondary" style={{ marginTop: 14 }}
        onClick={() => setMatches(ms => [...ms, { ...EMPTY_MATCH }])}>
        Add another match
      </button>

      {invalid && <p style={ERROR}>Check the figures: runs must be whole numbers, and overs must be in cricket notation (19.4 means 19 overs and 4 balls) and no more than the innings length.</p>}
      {result && (
        <>
          <Result items={[
            ["Net run rate", fmt(result.nrr, 3, true)],
            ["Scoring rate", fmt(result.forRate, 3)],
            ["Conceding rate", fmt(result.againstRate, 3)],
          ]} />
          <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.7, margin: "14px 0 0" }}>
            {result.runsFor} runs from {ballsToOvers(result.ballsFor)} overs = {fmt(result.forRate, 3)} per over;{" "}
            {result.runsAgainst} runs conceded from {ballsToOvers(result.ballsAgainst)} overs = {fmt(result.againstRate, 3)} per over.
          </p>
        </>
      )}
    </div>
  );
}

// ─── Required run rate ────────────────────────────────────────────────────────

function RequiredRunRateCalculator() {
  const [quota, setQuota] = useState("20");
  const [target, setTarget] = useState("");
  const [score, setScore] = useState("");
  const [overs, setOvers] = useState("");
  const totalBalls = quotaToBalls(quota);

  const t = int(target), s = int(score), b = oversToBalls(overs);
  const started = [target, score, overs].some(v => v.trim() !== "");
  const complete = t !== null && s !== null && b !== null;
  const invalid = started && (!complete || b > totalBalls || t < 1);
  const r = complete && !invalid ? chase({ target: t, score: s, ballsBowled: b, totalBalls }) : null;

  return (
    <div style={PANEL}>
      <QuotaSelect value={quota} onChange={setQuota} />
      <div style={{ ...GRID, marginTop: 14 }}>
        <Field label="Target" value={target} onChange={setTarget} placeholder="e.g. 181" hint="First-innings total + 1" />
        <Field label="Current score" value={score} onChange={setScore} placeholder="e.g. 120" />
        <Field label="Overs bowled" value={overs} onChange={setOvers} placeholder="e.g. 15.2" />
      </div>
      {invalid && complete === false && <p style={ERROR}>Enter whole numbers for the target and score, and overs in cricket notation (15.2 means 15 overs and 2 balls).</p>}
      {invalid && complete && <p style={ERROR}>The overs bowled cannot be more than the innings length, and the target must be at least 1.</p>}
      {r && r.won && <p style={{ ...ERROR, color: "#15803d" }}>The target has been reached.</p>}
      {r && r.impossible && <p style={ERROR}>No balls are left: the chasing side has fallen short.</p>}
      {r && !r.won && !r.impossible && (
        <Result items={[
          ["Runs needed", r.runsNeeded],
          ["Balls left", r.ballsLeft],
          ["Required rate", fmt(r.requiredRate)],
          ["Current rate", fmt(r.currentRate)],
        ]} />
      )}
    </div>
  );
}

// ─── Averages ─────────────────────────────────────────────────────────────────

function AverageCalculator() {
  const [bat, setBat] = useState({ runs: "", dismissals: "", balls: "" });
  const [bowl, setBowl] = useState({ runs: "", wickets: "", overs: "" });

  const batRuns = int(bat.runs), batOuts = int(bat.dismissals), batBalls = bat.balls.trim() === "" ? 0 : int(bat.balls);
  const batReady = batRuns !== null && batOuts !== null && batBalls !== null;
  const batting = batReady ? battingFigures({ runs: batRuns, dismissals: batOuts, balls: batBalls }) : null;

  const bowlRuns = int(bowl.runs), wkts = int(bowl.wickets), bowlBalls = oversToBalls(bowl.overs);
  const bowlReady = bowlRuns !== null && wkts !== null && bowlBalls !== null;
  const bowling = bowlReady ? bowlingFigures({ runsConceded: bowlRuns, wickets: wkts, balls: bowlBalls }) : null;

  return (
    <>
      <div style={PANEL}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", margin: "0 0 12px" }}>Batting</h2>
        <div style={GRID}>
          <Field label="Runs" value={bat.runs} onChange={v => setBat({ ...bat, runs: v })} placeholder="e.g. 4500" />
          <Field label="Times dismissed" value={bat.dismissals} onChange={v => setBat({ ...bat, dismissals: v })} placeholder="e.g. 100" hint="Innings minus not-outs" />
          <Field label="Balls faced (optional)" value={bat.balls} onChange={v => setBat({ ...bat, balls: v })} placeholder="e.g. 6000" />
        </div>
        {batting && (
          <Result items={[
            ["Average", batting.average === null ? "No dismissals yet" : fmt(batting.average)],
            ["Strike rate", fmt(batting.strikeRate)],
          ]} />
        )}
      </div>
      <div style={PANEL}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text)", margin: "0 0 12px" }}>Bowling</h2>
        <div style={GRID}>
          <Field label="Runs conceded" value={bowl.runs} onChange={v => setBowl({ ...bowl, runs: v })} placeholder="e.g. 2500" />
          <Field label="Wickets" value={bowl.wickets} onChange={v => setBowl({ ...bowl, wickets: v })} placeholder="e.g. 100" />
          <Field label="Overs bowled" value={bowl.overs} onChange={v => setBowl({ ...bowl, overs: v })} placeholder="e.g. 480.3" />
        </div>
        {bowl.overs.trim() !== "" && bowlBalls === null && <p style={ERROR}>Enter overs in cricket notation, for example 480.3 for 480 overs and 3 balls.</p>}
        {bowling && (
          <Result items={[
            ["Average", bowling.average === null ? "No wickets yet" : fmt(bowling.average)],
            ["Economy", fmt(bowling.economy)],
            ["Strike rate", bowling.strikeRate === null ? "No wickets yet" : fmt(bowling.strikeRate, 1)],
          ]} />
        )}
      </div>
    </>
  );
}

export const CALCULATORS = {
  "net-run-rate-calculator": NetRunRateCalculator,
  "required-run-rate-calculator": RequiredRunRateCalculator,
  "batting-and-bowling-average-calculator": AverageCalculator,
};
