// Checks api/espnCricket.js against live ESPN data, real score strings and
// real scorepanel fragments captured on 24 Oct 2026, plus a real merge with
// the Cricbuzz list from api/scraper.js.
// Run: node scratch/test_espn_cricket.js   (needs network)
const assert = require("assert");
const path = require("path");
const espn = require("../api/espnCricket");

let passed = 0, failed = 0;
async function check(name, fn) {
  try { await fn(); passed++; console.log("ok    " + name); }
  catch (e) { failed++; console.log("FAIL  " + name + "\n      " + (e && e.message)); }
}
const line = m => `${m.dateTimeGMT} | ${m.name} | ${m.matchType || "-"} | ${m.series} | ${m.status} | ` +
  (m.score || []).map(s => `${s.inning} ${s.r}/${s.w} (${s.o})`).join(", ");

const MATCH_KEYS = ["id", "name", "matchType", "series", "seriesId", "status", "venue", "date", "dateTimeGMT",
  "teams", "teamInfo", "score", "matchStarted", "matchEnded", "source", "espn"].sort();

// ── Real scorepanel fragments (24 Oct 2026), trimmed to the fields the module reads ──
const FIX_TAS_VIC = {
  league: { id: "8626", name: "Australian Domestic One-Day Competition" },
  event: { id: "1544852", leagueId: "8626", date: "2026-10-23T23:30Z", competitions: [{
    class: { internationalClassId: "0", generalClassCard: "List A", name: "List A matches", eventType: "ODI" },
    venue: { fullName: "Bellerive Oval, Hobart", address: { city: "Hobart" } },
    status: { summary: "Victoria won by 138 runs (DLS)", type: { description: "Result", state: "post" } },
    competitors: [
      { order: 2, homeAway: "home", score: "137 (25.2/35 ov, target 276)",
        team: { displayName: "Tasmania", abbreviation: "TAS", logo: "https://a.espncdn.com/i/teamlogos/cricket/500/560.png" },
        linescores: [{ period: 1, isBatting: false, runs: 0, wickets: 0, overs: 50 }, { period: 2, isBatting: true, runs: 137, wickets: 10, overs: 25.2 }] },
      { order: 1, homeAway: "away", score: "304/7 (50 ov)",
        team: { displayName: "Victoria", abbreviation: "VIC", logo: "https://a.espncdn.com/i/teamlogos/cricket/500/584.png" },
        linescores: [{ period: 1, isBatting: true, runs: 304, wickets: 7, overs: 50 }, { period: 2, isBatting: false, runs: 0, wickets: 0, overs: 25.2 }] },
    ] }] },
};
const FIX_NZA_INDA = {
  league: { id: "24805", name: "India A tour of New Zealand 2026/27" },
  event: { id: "1552529", leagueId: "24805", date: "2026-10-23T22:00Z", competitions: [{
    class: { generalClassCard: "First-class", eventType: "Test" },
    venue: { fullName: "Bert Sutcliffe Oval, Lincoln", address: { city: "Lincoln" } },
    status: { summary: "NZ A lead by 22 runs", type: { description: "Stumps", state: "in" } },
    competitors: [
      { order: 2, homeAway: "home", score: "135/3 (41 ov)", team: { displayName: "New Zealand A", abbreviation: "NZ-A" },
        linescores: [{ period: 1, isBatting: false, runs: 0, wickets: 0, overs: 39.3 }, { period: 2, isBatting: true, runs: 135, wickets: 3, overs: 41 }] },
      { order: 1, homeAway: "away", score: "113", team: { displayName: "India A", abbreviation: "IND-A" },
        linescores: [{ period: 1, isBatting: true, runs: 113, wickets: 10, overs: 39.3 }, { period: 2, isBatting: false, runs: 0, wickets: 0, overs: 41 }] },
    ] }] },
};
const FIX_DEN_KUW = { // ESPN "in" with no ball-by-ball coverage
  league: { id: "19553", name: "CWC Challenge League Group A" },
  event: { id: "1559443", leagueId: "19553", date: "2026-10-24T06:45Z", competitions: [{
    class: { generalClassCard: "List A", eventType: "ODI" },
    venue: { fullName: "Gymkhana Club Ground, Nairobi", address: { city: "Nairobi" } },
    status: { summary: "Starts at 09:45 local time", type: { description: "Live", state: "in" } },
    competitors: [
      { homeAway: "home", score: "", team: { displayName: "Denmark", abbreviation: "DEN" }, linescores: [] },
      { homeAway: "away", score: "", team: { displayName: "Kuwait", abbreviation: "KUW" }, linescores: [] },
    ] }] },
};

const cb = (name, iso, extra = {}) => {
  const teams = name.split(" vs ");
  return { id: "cb-" + name, name, teams, teamInfo: teams.map(t => ({ name: t })), dateTimeGMT: iso, score: [], source: "cricbuzz", ...extra };
};
const es = (name, iso) => {
  const teams = name.split(" v ");
  return { id: "espn-" + name, name: teams.join(" vs "), teams, teamInfo: teams.map(t => ({ name: t })), dateTimeGMT: iso, score: [], source: "espn" };
};

(async () => {
  // ── 1. Score-string parser on strings seen in real responses ──
  console.log("\n== Score-string parser");
  const cases = [
    ["137 (25.2/35 ov, target 276)", [[137, 10, 25.2]]],
    ["304/7 (50 ov)", [[304, 7, 50]]],
    ["135/3 (41 ov)", [[135, 3, 41]]],
    ["113", [[113, 10, null]]],
    ["90/3 (16/50 ov, target 372)", [[90, 3, 16]]],
    ["371/8", [[371, 8, null]]],
    ["181/6 (19.5/20 ov, target 181)", [[181, 6, 19.5]]],
    ["318/6 (49.4/50 ov)", [[318, 6, 49.4]]],
    ["23/0 (0.5/20 ov, target 20)", [[23, 0, 0.5]]],
    ["19", [[19, 10, null]]],
    ["5/0 (1/20 ov)", [[5, 0, 1]]],
    ["11/2 (2.4/14 ov)", [[11, 2, 2.4]]],
    ["440/6d & 262/5d", [[440, 6, null], [262, 5, null]]],
    ["99 & 295 (107.1 ov) (f/o)", [[99, 10, null], [295, 10, 107.1]]],
    ["339 & 244/9 (111 ov, target 364)", [[339, 10, null], [244, 9, 111]]],
    ["207 & 266 (85 ov, target 271)", [[207, 10, null], [266, 10, 85]]],
    ["", []],
  ];
  for (const [str, want] of cases) {
    await check(`parse ${JSON.stringify(str)}`, () => {
      const got = espn.parseEspnScoreString(str).map(x => [x.r, x.w, x.o]);
      assert.deepStrictEqual(got, want);
    });
  }
  await check("declared flag on 440/6d", () => assert.strictEqual(espn.parseEspnScoreString("440/6d")[0].declared, true));

  // ── 2. Event normalisation on real fragments ──
  console.log("\n== Event normalisation (real fragments)");
  await check("Tasmania v Victoria: shape, chronological innings, ODI, result status", () => {
    const m = espn.normaliseEspnEvent(FIX_TAS_VIC.event, FIX_TAS_VIC.league);
    assert.deepStrictEqual(Object.keys(m).sort(), MATCH_KEYS);
    assert.ok(/^espn-\d+-1544852$/.test(m.id), m.id);
    assert.strictEqual(m.name, "Tasmania vs Victoria");
    assert.strictEqual(m.matchType, "List A"); // domestic: real class, not ESPN's eventType
    assert.strictEqual(m.series, "Australian Domestic One-Day Competition");
    assert.strictEqual(m.status, "Victoria won by 138 runs (DLS)");
    assert.strictEqual(m.venue, "Bellerive Oval, Hobart");
    assert.strictEqual(m.date, "10/23/2026");
    assert.strictEqual(m.dateTimeGMT, "2026-10-23T23:30:00.000Z");
    assert.deepStrictEqual(m.score, [
      { r: 304, w: 7, o: 50, inning: "VIC INN 1" },
      { r: 137, w: 10, o: 25.2, inning: "TAS INN 1" },
    ]);
    assert.strictEqual(m.teamInfo[0].img, "https://a.espncdn.com/combiner/i?img=/i/teamlogos/cricket/500/560.png&w=80&h=80");
    assert.deepStrictEqual([m.matchStarted, m.matchEnded], [true, true]);
    assert.deepStrictEqual(m.espn, { leagueId: "8626", eventId: "1544852" });
  });
  await check("NZ A v India A: all-out '113' gets overs 39.3 from linescores, TEST, Stumps status", () => {
    const m = espn.normaliseEspnEvent(FIX_NZA_INDA.event, FIX_NZA_INDA.league);
    assert.strictEqual(m.matchType, "TEST");
    assert.strictEqual(m.status, "Stumps - NZ A lead by 22 runs");
    assert.deepStrictEqual(m.score, [
      { r: 113, w: 10, o: 39.3, inning: "IND-A INN 1" },
      { r: 135, w: 3, o: 41, inning: "NZ-A INN 1" },
    ]);
    assert.deepStrictEqual([m.matchStarted, m.matchEnded], [true, false]);
  });
  await check("Denmark v Kuwait: live without coverage -> status 'Live', empty score", () => {
    const m = espn.normaliseEspnEvent(FIX_DEN_KUW.event, FIX_DEN_KUW.league);
    assert.strictEqual(m.status, "Live");
    assert.deepStrictEqual(m.score, []);
  });

  // ── 3. Live ESPN list ──
  console.log("\n== getEspnMatches() (live ESPN)");
  const t0 = Date.now();
  const lists = await espn.getEspnMatches();
  console.log(`fetched in ${Date.now() - t0} ms: live=${lists.live.length} recent=${lists.recent.length} upcoming=${lists.upcoming.length}`);
  const all = [...lists.live, ...lists.recent, ...lists.upcoming];
  await check("non-empty and every match has exactly the site shape", () => {
    assert.ok(all.length > 0, "no ESPN matches returned");
    for (const m of all) {
      assert.deepStrictEqual(Object.keys(m).sort(), MATCH_KEYS, m.id);
      assert.ok(/^espn-\d+-\d+$/.test(m.id), m.id);
      assert.ok(/^\d{2}\/\d{2}\/\d{4}$/.test(m.date), m.date);
      assert.ok(!isNaN(Date.parse(m.dateTimeGMT)), m.dateTimeGMT);
      assert.ok(["ODI", "T20", "TEST", "List A", "First-class", "One-day", ""].includes(m.matchType), m.matchType);
      assert.strictEqual(m.source, "espn");
      assert.strictEqual(m.seriesId, null);
      assert.strictEqual(m.teams.length, 2);
      assert.strictEqual(m.teamInfo.length, 2);
      for (const s of m.score) {
        assert.ok(Number.isFinite(s.r) && Number.isFinite(s.w) && Number.isFinite(s.o), JSON.stringify(s));
        assert.ok(/ INN \d$/.test(s.inning), s.inning);
      }
    }
  });
  await check("no duplicate ids; buckets agree with flags", () => {
    assert.strictEqual(new Set(all.map(m => m.id)).size, all.length);
    lists.live.forEach(m => assert.deepStrictEqual([m.matchStarted, m.matchEnded], [true, false], m.id));
    lists.recent.forEach(m => assert.strictEqual(m.matchEnded, true, m.id));
    lists.upcoming.forEach(m => assert.strictEqual(m.matchStarted, false, m.id));
  });
  await check("second call is served from cache (same object contents, fast)", async () => {
    const t1 = Date.now();
    const again = await espn.getEspnMatches();
    assert.ok(Date.now() - t1 < 50, "cache miss");
    assert.strictEqual(again.live.length + again.recent.length + again.upcoming.length, all.length);
  });
  const samples = [...lists.live.slice(0, 2), ...lists.recent.slice(0, 2), ...lists.upcoming.slice(0, 1)];
  console.log("\n5 sample normalised matches:");
  samples.forEach(m => console.log(JSON.stringify(m)));
  const types = {};
  all.forEach(m => { types[m.matchType || "(blank)"] = (types[m.matchType || "(blank)"] || 0) + 1; });
  console.log("matchType counts:", JSON.stringify(types));

  // ── 4. mergeMatchLists on crafted lists ──
  console.log("\n== mergeMatchLists (crafted)");
  await check("duplicate dropped, non-duplicates kept, primary kept", () => {
    const primary = { live: [cb("New Zealand A vs India A", "2026-10-23T22:00:00.000Z")], recent: [], upcoming: [] };
    const secondary = { live: [
      es("New Zealand A v India A", "2026-10-23T22:00:00.000Z"),    // same match
      es("New Zealand v India", "2026-10-24T07:00:00.000Z"),        // senior sides, same day: different match
      es("Denmark v Kuwait", "2026-10-24T06:45:00.000Z"),           // not in primary
    ], recent: [], upcoming: [] };
    const out = espn.mergeMatchLists(primary, secondary);
    assert.deepStrictEqual(out.live.map(m => m.id), ["cb-New Zealand A vs India A", "espn-New Zealand v India", "espn-Denmark v Kuwait"]);
  });
  await check("abbreviations, reversed order, Women/W, U19, sponsor suffix, '(NPL)' all match", () => {
    const primary = { live: [], recent: [
      cb("NZ vs Ind", "2026-10-24T07:00:00.000Z"),
      cb("Zimbabwe Women vs India W", "2026-10-23T08:30:00.000Z"),
      cb("Bangladesh U19 vs Afghanistan Under-19", "2026-10-23T05:30:00.000Z"),
    ], upcoming: [
      cb("Knights vs Mpumalanga Rhinos", "2026-10-24T16:00:00.000Z"),
      cb("Eastern Storm vs South Africa Emerging Players", "2026-10-25T11:00:00.000Z"),
      cb("Lumbini Lions vs Sudur Paschim Royals", "2026-10-26T10:45:00.000Z"),
    ] };
    const secondary = { live: [], recent: [
      es("New Zealand v India", "2026-10-24T07:00:00.000Z"),
      es("India Women v Zimbabwe Women", "2026-10-23T08:30:00.000Z"),
      es("Afghanistan Under-19s v Bangladesh Under-19s", "2026-10-23T05:30:00.000Z"),
    ], upcoming: [
      es("Knights v Mpumalanga", "2026-10-24T16:00:00.000Z"),
      es("Easterns v South Africa Emerging Players", "2026-10-25T11:00:00.000Z"),
      es("Lumbini Lions (NPL) v Sudur Paschim Royals (NPL)", "2026-10-26T10:45:00.000Z"),
    ] };
    const out = espn.mergeMatchLists(primary, secondary);
    assert.strictEqual(out.recent.length, 3);
    assert.strictEqual(out.upcoming.length, 3);
    assert.ok(out.recent.concat(out.upcoming).every(m => m.source === "cricbuzz"));
  });
  await check("cross-bucket: Cricbuzz 'upcoming' vs ESPN 'live' is one match", () => {
    const out = espn.mergeMatchLists(
      { live: [], recent: [], upcoming: [cb("Border vs Warriors", "2026-10-24T11:00:00.000Z")] },
      { live: [es("Border v Warriors", "2026-10-24T11:00:00.000Z")], recent: [], upcoming: [] });
    assert.strictEqual(out.live.length + out.recent.length + out.upcoming.length, 1);
    assert.strictEqual(out.upcoming[0].source, "cricbuzz");
  });
  await check("non-duplicates: Women vs men, A vs senior, XI vs senior, >1 day apart, double header", () => {
    const primary = { live: [], recent: [
      cb("India vs Zimbabwe", "2026-10-23T08:30:00.000Z"),
      cb("India vs New Zealand", "2026-10-23T22:00:00.000Z"),
      cb("Bangladesh vs West Indies", "2026-10-22T04:00:00.000Z"),
      cb("Mozambique vs Uganda", "2026-10-20T09:00:00.000Z"),
    ], upcoming: [cb("Mexico Women vs Argentina Women", "2026-10-24T14:00:00.000Z")] };
    const secondary = { live: [], recent: [
      es("India Women v Zimbabwe Women", "2026-10-23T08:30:00.000Z"),
      es("New Zealand A v India A", "2026-10-23T22:00:00.000Z"),
      es("Bangladesh Cricket Board XI v West Indies", "2026-10-22T04:00:00.000Z"),
      es("Mozambique v Uganda", "2026-10-24T09:00:00.000Z"),
    ], upcoming: [
      es("Mexico Women v Argentina Women", "2026-10-24T14:00:00.000Z"),
      es("Mexico Women v Argentina Women", "2026-10-24T19:00:00.000Z"),
    ] };
    secondary.upcoming[1].id = "espn-second-game";
    const out = espn.mergeMatchLists(primary, secondary);
    assert.strictEqual(out.recent.length, 8, out.recent.map(m => m.id).join(", "));
    assert.deepStrictEqual(out.upcoming.map(m => m.id), ["cb-Mexico Women vs Argentina Women", "espn-second-game"]);
  });
  await check("bad input never throws", () => {
    assert.deepStrictEqual(espn.mergeMatchLists(null, undefined), { live: [], recent: [], upcoming: [] });
    const out = espn.mergeMatchLists({ live: [{}], recent: "x" }, { live: [null, { name: "x" }] });
    assert.strictEqual(out.live.length, 3);
  });

  // ── 5. Real merge: Cricbuzz (api/scraper.js) + ESPN ──
  console.log("\n== Real merge: Cricbuzz + ESPN");
  const scraper = require("../api/scraper.js");
  const cbLists = await scraper.getAllMatches();
  const merged = espn.mergeMatchLists(cbLists, lists);
  for (const b of ["live", "recent", "upcoming"]) {
    const added = merged[b].filter(m => m.source === "espn");
    console.log(`${b}: cricbuzz=${cbLists[b].length} espn=${lists[b].length} merged=${merged[b].length} (espn added ${added.length}, dropped as duplicate ${lists[b].length - added.length})`);
  }
  const addedIds = new Set([...merged.live, ...merged.recent, ...merged.upcoming].filter(m => m.source === "espn").map(m => m.id));
  console.log("ESPN entries dropped as duplicates of Cricbuzz:");
  all.filter(m => !addedIds.has(m.id)).forEach(m => console.log("   - " + m.name + " | " + m.dateTimeGMT));
  console.log("ESPN entries added for today and live (others omitted):");
  [...merged.live, ...merged.recent, ...merged.upcoming]
    .filter(m => m.source === "espn" && m.dateTimeGMT.startsWith("2026-10-24"))
    .forEach(m => console.log("   + " + line(m)));
  await check("real merge keeps every Cricbuzz entry", () => {
    for (const b of ["live", "recent", "upcoming"]) {
      assert.strictEqual(merged[b].filter(m => m.source !== "espn").length, cbLists[b].length);
    }
  });

  // ── 6. Match summary ──
  console.log("\n== getEspnMatchSummary()");
  const pickPost = lists.recent.find(m => /-1539433$/.test(m.id)) || lists.recent.find(m => m.score.length >= 2);
  const pickLive = lists.live.find(m => m.score.length >= 1);
  for (const m of [pickPost, pickLive].filter(Boolean)) {
    const s = await espn.getEspnMatchSummary(m.espn.leagueId, m.espn.eventId);
    console.log(`\n-- ${m.id} ${m.name} [${m.status}]`);
    if (!s) { console.log("   summary: null"); }
    else {
      console.log("   keys:", Object.keys(s).join(","));
      console.log("   ", JSON.stringify({ state: s.state, status: s.status, session: s.session, matchType: s.matchType, venue: s.venue, toss: s.toss, playerOfMatch: s.playerOfMatch }));
      for (const inn of s.innings) {
        console.log(`   innings ${inn.number} ${inn.teamShort}: ${inn.runs}/${inn.wickets} (${inn.overs} ov) score="${inn.score || ""}" extras=${inn.extras} rr=${inn.runRate}` +
          ` batting=${(inn.batting || []).length} bowling=${(inn.bowling || []).length} fow=${(inn.fallOfWickets || []).length}`);
        (inn.batting || []).slice(0, 2).forEach(b => console.log("      bat ", JSON.stringify(b)));
        (inn.bowling || []).slice(0, 2).forEach(b => console.log("      bowl", JSON.stringify(b)));
      }
      (s.commentary || []).slice(0, 3).forEach(c => console.log("   ball", JSON.stringify(c).slice(0, 300)));
      console.log(`   commentary entries: ${(s.commentary || []).length}`);
    }
    await check(`${m.id}: summary innings agree with scorepanel score`, () => {
      assert.ok(s, "summary null");
      assert.ok(s.innings.length >= m.score.length, "fewer innings than scorepanel");
      for (const sc of m.score) {
        const hit = s.innings.find(i => i.runs === sc.r && i.wickets === sc.w);
        // a live innings can move on between the two calls; only finished games must match exactly
        if (m.matchEnded) assert.ok(hit, `no innings ${sc.r}/${sc.w} in summary`);
      }
    });
    await check(`${m.id}: batting runs + extras = total; bowling conceded + byes + legbyes = total`, () => {
      assert.ok(s && s.innings.length, "no innings");
      for (const inn of s.innings) {
        if (!inn.batting || !inn.bowling) continue;
        const bat = inn.batting.reduce((a, b) => a + b.runs, 0);
        const bowl = inn.bowling.reduce((a, b) => a + b.runs, 0);
        const bw = inn.bowling.reduce((a, b) => a + b.wickets, 0);
        console.log(`      inn ${inn.number}: bat ${bat} + extras ${inn.extras} = ${bat + inn.extras} vs ${inn.runs}; bowl ${bowl} + b ${inn.byes} + lb ${inn.legbyes} = ${bowl + inn.byes + inn.legbyes}; bowler wkts ${bw} <= ${inn.wickets}`);
        assert.strictEqual(bat + inn.extras, inn.runs, "batting + extras");
        assert.strictEqual(bowl + inn.byes + inn.legbyes, inn.runs, "bowling + byes + legbyes");
        assert.ok(bw <= inn.wickets, "bowler wickets");
      }
    });
  }
  await check("summary text is clean: dismissals trimmed, no HTML entities; commentary score is runs/wkts", async () => {
    const s = await espn.getEspnMatchSummary(pickPost.espn.leagueId, pickPost.espn.eventId);
    for (const inn of s.innings) for (const b of inn.batting || []) {
      assert.strictEqual(b.dismissal, b.dismissal.trim(), JSON.stringify(b.dismissal));
      assert.ok(!/&[a-z#0-9]+;/i.test(b.dismissal), b.dismissal);
    }
    for (const c of s.commentary || []) assert.ok(/^\d+\/\d+$/.test(c.score), JSON.stringify(c.score));
    if (s.state === "post" && s.commentary) {
      const last = s.innings[s.innings.length - 1];
      assert.strictEqual(s.commentary[0].score, `${last.runs}/${last.wickets}`, "latest ball score vs final innings");
    }
  });
  await check("summary: invalid ids -> null without a request; unknown event (HTTP 404) -> null", async () => {
    assert.strictEqual(await espn.getEspnMatchSummary("abc", "xyz"), null);
    assert.strictEqual(await espn.getEspnMatchSummary(8626, 999999999), null);
  });

  // ── 7. Network failure: fresh module instance, every ESPN request rejected ──
  console.log("\n== Forced network failure");
  await check("getEspnMatches -> empty buckets, getEspnMatchSummary -> null, no throw", async () => {
    // same axios instance api/espnCricket.js loads
    const axios = require(require.resolve("axios", { paths: [path.join(__dirname, "../api")] }));
    const id = axios.interceptors.request.use(cfg => {
      if (/espn\.com/.test(cfg.url || "")) return Promise.reject(new Error("simulated network failure"));
      return cfg;
    });
    try {
      const modPath = require.resolve("../api/espnCricket");
      delete require.cache[modPath];
      const fresh = require("../api/espnCricket");
      assert.deepStrictEqual(await fresh.getEspnMatches(), { live: [], recent: [], upcoming: [] });
      assert.strictEqual(await fresh.getEspnMatchSummary(24469, 1539433), null);
    } finally {
      axios.interceptors.request.eject(id);
    }
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0); // api/scraper.js keeps timers alive
})().catch(e => { console.error("test crashed:", e); process.exit(1); });
