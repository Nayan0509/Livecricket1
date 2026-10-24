// Guides: cricket basics. Evergreen explainers of how the game is scored,
// played and described. Every number below is a rule or a fixed historical
// fact; worked examples say they are examples. See guides/index.js for the
// shared shape.

module.exports = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "how-to-read-a-cricket-scorecard",
    title: "How to Read a Cricket Scorecard",
    category: "Cricket basics",
    description:
      "Every column, symbol and abbreviation on a cricket scorecard explained: batting and bowling figures, extras, fall of wickets, dismissal notation and how the result line is worded.",
    related: ["ways-of-getting-out-in-cricket", "batting-average-strike-rate-economy-explained", "cricket-glossary"],
    blocks: [
      {
        type: "p",
        text: "A cricket scorecard packs a whole match into a couple of tables, and once you know the conventions it reads faster than any commentary. This guide walks through a card from top to bottom: the innings total, the batting card, extras, the fall of wickets, the bowling card and the result line.",
      },
      { type: "h2", text: "The innings total" },
      {
        type: "p",
        text: "A total such as **287/6 (50 ov)** means the side scored 287 runs, lost six wickets and faced 50 overs. If all ten wickets fall the card usually reads **198 all out** or **198 (43.2 ov)** with no wicket figure. The overs figure counts complete overs and then balls, so 43.2 is 43 overs and two balls, not 43.2 overs in decimal. Australian scorecards reverse the order and write wickets first, so **6/287** in an Australian source is the same score as 287/6 elsewhere. In a Test or first-class match each side has up to two innings and the card shows all four, with **declared** (or **dec**) after a total the batting captain closed voluntarily.",
      },
      { type: "h2", text: "The batting card" },
      {
        type: "p",
        text: "Batters are listed in the order they came in. Each row shows how the batter was dismissed, then the columns **R** (runs), **B** (balls faced), **4s**, **6s** and **SR** (strike rate, runs per 100 balls). An asterisk or the word **not out** means the batter was still in when the innings ended; **retired hurt** means they left injured and could return; **retired out** means they left voluntarily and cannot. Batters who did not get to bat appear at the bottom as **did not bat** or **dnb**.",
      },
      {
        type: "p",
        text: "The dismissal column uses a compact notation. **b Anderson** means bowled by Anderson. **c Smith b Anderson** means caught by Smith off Anderson's bowling. **c & b Anderson** means the bowler took the catch himself. **lbw b Anderson** is leg before wicket. **st Foakes b Leach** is stumped by the wicketkeeper Foakes off Leach. **run out (Root/Foakes)** names the fielder who threw and the player who broke the stumps. **hit wicket b Wood** means the batter broke their own wicket while playing at Wood's delivery. The rarer methods, **obstructing the field**, **hit the ball twice** and **timed out**, are written out in full. Our guide to [the ten ways of getting out](/guides/ways-of-getting-out-in-cricket) explains each.",
      },
      { type: "h2", text: "Extras" },
      {
        type: "p",
        text: "Runs that are not credited to a batter are listed as extras: **b** (byes, runs taken when the ball passes the batter without contact), **lb** (leg byes, runs taken after the ball hits the batter's body), **w** (wides), **nb** (no-balls) and occasionally **pen** (five-run penalties). Wides and no-balls are debited to the bowler; byes and leg byes are not, which is why a bowler's runs conceded in the bowling card can be lower than the runs scored off their overs. Adding the batters' runs and the extras gives the innings total.",
      },
      { type: "h2", text: "Fall of wickets" },
      {
        type: "p",
        text: "The fall of wickets line, often abbreviated **FOW**, records the team score when each wicket fell and who was out, for example **1-23 (Duckett, 5.4 ov), 2-71 (Crawley, 15.1 ov)** and so on. Reading it shows the shape of an innings at a glance, whether a side collapsed in a heap or lost wickets at even intervals. Many cards also show **partnerships**, the runs added between each pair of batters, which tells you who did the damage together.",
      },
      { type: "h2", text: "The bowling card" },
      {
        type: "p",
        text: "Each bowler's row shows **O** (overs bowled), **M** (maidens: overs in which no runs were scored off the bat or as wides and no-balls), **R** (runs conceded), **W** (wickets), **Econ** (economy rate: runs conceded per over) and usually **wd** and **nb** counts. A bowler's figures are often quoted as wickets-for-runs, so **3-45** or **3/45** means three wickets for 45 runs. In a limited-overs match the overs column also tells you whether a bowler completed their allowance: ten in an ODI, four in a T20. Our guide to [batting average, strike rate and economy](/guides/batting-average-strike-rate-economy-explained) explains how the rate figures are calculated.",
      },
      { type: "h2", text: "The result line" },
      {
        type: "p",
        text: "The wording of the result tells you which side batted second. **India won by 45 runs** means India batted first and the chasing side fell 45 short. **England won by 4 wickets (with 11 balls remaining)** means England chased successfully with four wickets still in hand and 11 legal deliveries unused. In Test cricket a side that wins without needing to bat a second time **won by an innings and 63 runs**. A **tie** means the scores finished level, which in most limited-overs competitions is then settled by a [Super Over](/guides/super-over-and-tie-breakers-explained). **No result** means weather prevented the minimum overs, **abandoned** means no play was possible, and **match drawn** applies only to timed formats where the match ran out of time. A result marked **(DLS method)** means the target was revised for rain; see the [DLS guide](/guides/dls-method-explained).",
      },
      { type: "h2", text: "Other things you may see" },
      {
        type: "ul",
        items: [
          "**Toss:** which captain won and what they chose. Choosing to field is usually written as \"elected to field\".",
          "**Player of the Match:** the adjudicators' award, usually shown at the top of the card.",
          "**Umpires and referee:** the on-field umpires, the TV umpire and the match referee.",
          "**Current run rate (CRR)** and **required run rate (RRR)** appear on live cards: runs per over so far, and runs per over the chasing side needs from the remaining overs.",
          "**Projected score** on a live card is simply the current run rate extended to the end of the innings; it is a rough guide, not a prediction.",
        ],
      },
      {
        type: "callout",
        text: "Worked example (an invented line). A card reads: Kohli c Carey b Cummins 54 (63) 4x4 1x6 SR 85.71. Kohli scored 54 from 63 balls including four fours and one six, was caught by wicketkeeper Carey off the bowling of Cummins, and scored at 85.71 runs per 100 balls (54 ÷ 63 × 100).",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "cricket-formats-explained-test-odi-t20",
    title: "Cricket Formats Explained: Test, ODI, T20 and the Rest",
    category: "Cricket basics",
    description:
      "The differences between Test, ODI and T20 cricket, plus T10 and The Hundred: match length, overs, bowling limits, fielding restrictions, new-ball rules and how each format is classified.",
    related: ["powerplay-and-fielding-restrictions-explained", "follow-on-and-declarations-explained", "world-test-championship-points-system"],
    blocks: [
      {
        type: "p",
        text: "Cricket is unusual in having several formats that share the same laws but differ in length, and the differences change how the game is played far more than a newcomer might expect. This guide sets out what each format is, the rules that vary between them and how the statistics are kept separate.",
      },
      { type: "h2", text: "The three international formats at a glance" },
      {
        type: "table",
        head: ["", "Test", "One Day International", "Twenty20 International"],
        rows: [
          ["Scheduled length", "Up to 5 days", "1 day", "About 3 hours"],
          ["Overs per side", "Unlimited (two innings each)", "50 (one innings each)", "20 (one innings each)"],
          ["Max overs per bowler", "No limit", "10", "4"],
          ["Fielding restrictions", "None (leg-side limit only)", "Three powerplay phases", "Six-over powerplay"],
          ["Ball", "Red (pink for day-night), new ball available after 80 overs", "White, two new balls until over 34", "White, one new ball"],
          ["Result if time or weather runs out", "Draw", "DLS revision or no result", "DLS revision or no result"],
          ["Minimum for a result", "N/A", "20 overs per side", "5 overs per side"],
        ],
      },
      { type: "h2", text: "Test cricket" },
      {
        type: "p",
        text: "Test matches are played over five days, or occasionally four, between the twelve nations the ICC has granted Test status. Each side bats twice, there is no limit on overs or on how many a bowler may deliver, and the only fielding restriction is the general law that no more than two fielders may stand behind square on the leg side. Because a match can be drawn if time runs out, Test tactics revolve around time as well as runs: when to declare, whether to enforce the follow-on, how many overs remain in the day. Since 2019 most Tests count towards the [World Test Championship](/guides/world-test-championship-points-system). The [follow-on and declarations guide](/guides/follow-on-and-declarations-explained) covers the decisions unique to this format.",
      },
      { type: "h2", text: "One Day Internationals" },
      {
        type: "p",
        text: "ODIs give each side one innings of up to 50 overs. Bowlers are limited to ten overs each, so a captain needs at least five. Fielding restrictions come in three phases (overs 1 to 10, 11 to 40 and 41 to 50) and are explained in the [powerplay guide](/guides/powerplay-and-fielding-restrictions-explained). Two new white balls are used, one from each end, until the end of the 34th over; the fielding side then chooses one of them for overs 35 to 50, and a match cut to 25 overs a side or fewer before it starts uses one new ball per innings. Rain-affected games are decided by the [DLS method](/guides/dls-method-explained), and a result needs at least 20 overs per side. The ODI World Cup and the Champions Trophy are the format's global events.",
      },
      { type: "h2", text: "Twenty20" },
      {
        type: "p",
        text: "T20 gives each side 20 overs and limits bowlers to four each. The first six overs are a powerplay with only two fielders allowed outside the 30-yard circle. Ties are settled by a [Super Over](/guides/super-over-and-tie-breakers-explained), and a result needs five overs per side. T20 internationals and leagues such as the IPL also enforce an innings time limit with an in-match penalty for slow over-rates. T20 began in English county cricket in 2003, the first internationals followed in 2004 (women) and 2005 (men), and it now supports franchise leagues around the world; see the [IPL guide](/guides/how-the-ipl-works) for how the biggest of them is organised.",
      },
      { type: "h2", text: "Shorter formats: T10 and The Hundred" },
      {
        type: "p",
        text: "**T10** gives each side ten overs, with bowlers limited to two overs each; it is played in a handful of franchise leagues, most prominently in Abu Dhabi. **The Hundred**, England's domestic competition launched in 2021, gives each side 100 balls instead of overs. Bowlers deliver in blocks of five balls and may bowl ten consecutive balls if the captain chooses; each bowler is limited to 20 balls, the powerplay lasts 25 balls, and a strategic timeout is available to the fielding side. Neither is an international format. The ICC classifies The Hundred as Twenty20 cricket, so its matches count in players' T20 records; T10 does not appear on the ICC's list of recognised first-class, List A and Twenty20 competitions.",
      },
      { type: "h2", text: "How matches are classified for statistics" },
      {
        type: "p",
        text: "Statistics are kept in three pools. **First-class** cricket covers Tests and multi-day domestic competitions such as the County Championship, the Sheffield Shield and the Ranji Trophy, so a player's first-class runs include Tests. **List A** covers ODIs and domestic one-day competitions of at least 40 overs a side. **T20** covers all recognised Twenty20 cricket, international and domestic. Records are also kept separately at international level, which is why you will see a player's \"Test average\" and \"first-class average\" quoted as different numbers.",
      },
      { type: "h2", text: "Why the format changes the game" },
      {
        type: "p",
        text: "In Tests, batters can wait for bad balls and bowlers can attack with slips and short legs because a wicket matters more than a run. In ODIs the balance shifts through the innings: caution in the first ten overs when the field is up, accumulation in the middle, then acceleration. In T20s every ball is an attacking opportunity for the batter and every dot ball a small win for the bowler, so fielding sides use variation and change of pace rather than sustained pressure. A player who excels in one format is not guaranteed to excel in another, which is one reason selectors pick different squads for each.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "ways-of-getting-out-in-cricket",
    title: "The Ten Ways a Batter Can Be Out in Cricket",
    category: "Cricket basics",
    description:
      "All ten methods of dismissal under the Laws of Cricket, from bowled and caught to timed out and retired out, with the details that decide close calls such as LBW, stumpings and run-outs at the non-striker's end.",
    related: ["drs-explained", "how-to-read-a-cricket-scorecard", "cricket-glossary"],
    blocks: [
      {
        type: "p",
        text: "The Laws of Cricket, maintained by the MCC, list ten ways a batter can be dismissed. Five account for almost every wicket you will see; the other five are rare enough that a single instance makes headlines. This guide explains each one and the fine print that decides marginal decisions.",
      },
      { type: "h2", text: "The five common dismissals" },
      { type: "h3", text: "1. Bowled" },
      {
        type: "p",
        text: "The ball delivered by the bowler hits the stumps and dislodges at least one bail. It does not matter whether the ball touched the bat or the batter first, so a ball that deflects off the pad or the inside edge onto the stumps is still bowled. If the bails are not dislodged (the ball brushes the stumps but they stay put, or the ball lodges between them), the batter is not out. A bail that is only disturbed, even for a moment, does not count: at least one must be completely removed from the top of the stumps.",
      },
      { type: "h3", text: "2. Caught" },
      {
        type: "p",
        text: "The ball touches the bat (or a glove holding the bat) and is caught by a fielder before it touches the ground. The fielder must have control of the ball and of their own movement, and must be inside the boundary or, if airborne, must have last touched the ground inside it. A catch off the ball's second bounce is not a catch. A ball caught after it has struck only the pad or body is not out. A catch is still fair if the ball lodges in a fielder's helmet or accidentally in their clothing. Since 2022 the incoming batter goes to the striker's end after a catch, whether or not the batters crossed while the ball was in the air.",
      },
      { type: "h3", text: "3. Leg before wicket (LBW)" },
      {
        type: "p",
        text: "The most technical dismissal. A batter is out LBW when a ball that has not touched the bat hits their body and the umpire judges it **would have gone on to hit the stumps**, provided three further conditions are met. The ball must not have pitched outside the line of leg stump. It must have struck the batter in line between wicket and wicket, unless the batter was not attempting to play a shot, in which case an impact outside the line of off stump can still be out. And the ball must not have hit the bat first. A batter who offers no shot therefore takes on much more LBW risk. Ball-tracking technology used in the [Decision Review System](/guides/drs-explained) tests exactly these conditions.",
      },
      { type: "h3", text: "4. Run out" },
      {
        type: "p",
        text: "A batter is run out if, while the ball is in play and they are out of their ground, the fielding side breaks the wicket at the end they are running towards. Being out of the ground means no part of the bat or body is grounded behind the popping crease. Having the bat in the air over the line does not count, which is why batters slide the bat along the ground. A run-out at the non-striker's end before the bowler releases the ball, once called a \"Mankad\" and long treated as against the spirit of the game, was moved into the run-out law in 2022 and is a normal dismissal.",
      },
      { type: "h3", text: "5. Stumped" },
      {
        type: "p",
        text: "If the striker leaves the crease to play and misses, and the wicketkeeper breaks the wicket with the ball before the batter gets back, the batter is stumped. It is not stumped if the ball was a no-ball, but it can be stumped off a wide. If any fielder other than the keeper breaks the wicket it is a run out, not a stumping.",
      },
      { type: "h2", text: "The five rare dismissals" },
      { type: "h3", text: "6. Hit wicket" },
      {
        type: "p",
        text: "The striker breaks their own wicket with the bat or any part of their body or equipment while receiving a delivery or setting off for a first run. A helmet falling onto the stumps counts. It is not out if the batter was avoiding a run-out or if the delivery was a no-ball.",
      },
      { type: "h3", text: "7. Obstructing the field" },
      {
        type: "p",
        text: "A batter who wilfully obstructs or distracts the fielding side by word or action is out. This law now also covers what was until 2017 the separate dismissal of **handled the ball**: a batter who deliberately handles the ball without the fielding side's consent is out obstructing the field. Changing direction to block a throw at the stumps is the usual modern example.",
      },
      { type: "h3", text: "8. Hit the ball twice" },
      {
        type: "p",
        text: "A batter who deliberately strikes the ball a second time, other than to guard their wicket, is out. Batters may knock a ball away from the stumps after it has been played, which is why this dismissal is so rare.",
      },
      { type: "h3", text: "9. Timed out" },
      {
        type: "p",
        text: "After a wicket, the incoming batter must be ready to receive the next ball within three minutes under the Laws. ICC playing conditions cut this to two minutes in Tests and ODIs and 90 seconds in T20 internationals. If they are not, the fielding side may appeal and the batter is out without facing a ball. It had never happened in international cricket until the 2023 World Cup, when Angelo Mathews became the first player to be timed out.",
      },
      { type: "h3", text: "10. Retired out" },
      {
        type: "p",
        text: "A batter who retires for any reason other than injury, illness or another unavoidable cause is retired out. The Laws let them resume only with the opposing captain's consent, and ICC playing conditions do not let them resume at all. It has been used tactically in T20 cricket to bring in a faster scorer. A batter who leaves injured is **retired hurt**, is not out, and may return later in the innings.",
      },
      { type: "h2", text: "Dismissals that do not count against the bowler" },
      {
        type: "p",
        text: "Bowled, caught, LBW, stumped and hit wicket are credited to the bowler. Run out, obstructing the field, hit the ball twice, timed out and retired out are not, which is why a bowler's wicket tally can be lower than the number of batters dismissed during their overs. On the [scorecard](/guides/how-to-read-a-cricket-scorecard), the bowler's name is omitted from these dismissals.",
      },
      {
        type: "callout",
        text: "A batter cannot be given out bowled, LBW, caught, stumped or hit wicket off a no-ball; only run out, obstructing the field, hit the ball twice and retired out remain possible. Off a wide, a batter can still be stumped, run out, hit wicket or out obstructing the field.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "cricket-fielding-positions-explained",
    title: "Cricket Fielding Positions Explained",
    category: "Cricket basics",
    description:
      "A map of the cricket field in words: where slip, gully, point, cover, midwicket, square leg, fine leg, third man and the deep positions are, what 'silly', 'short', 'deep' and 'fine' mean, and how captains use them.",
    related: ["powerplay-and-fielding-restrictions-explained", "cricket-glossary", "bowling-types-swing-seam-spin-explained"],
    blocks: [
      {
        type: "p",
        text: "Fielding positions are named from the point of view of a right-handed batter facing the bowler. The **off side** is the side the batter faces (to their right, on the bowler's left as they run in); the **leg side** or **on side** is behind them. Positions are mirrored for a left-hander, so a fielder standing in the same physical spot changes name when the batters swap. Once you know a dozen base positions and four modifiers, you can place any fielder you hear mentioned.",
      },
      { type: "h2", text: "The modifiers" },
      {
        type: "ul",
        items: [
          "**Short** or **silly**: much closer to the batter than usual. Silly point and silly mid-off are only a few yards from the bat.",
          "**Deep** or **long**: near the boundary. Deep midwicket, long-on and long-off are boundary fielders.",
          "**Fine**: closer to the line of the pitch behind the batter. Fine leg is finer than square leg.",
          "**Square**: level with the batter, at right angles to the pitch. Square leg and point are square positions.",
          "**Wide**: further from the pitch line than usual, as in wide mid-off or wide long-on.",
        ],
      },
      { type: "h2", text: "Behind the batter" },
      {
        type: "p",
        text: "The **wicketkeeper** stands directly behind the stumps. The **slips** stand beside the keeper on the off side, numbered first, second and third slip moving away from the keeper, and catch edges from pace bowlers; a **fly slip** is a deeper slip halfway to the boundary. **Gully** is squarer than the slips, between slip and point, and takes thick edges and cut shots hit uppishly. On the leg side, **leg slip** mirrors first slip and is used against batters who flick off the pads. **Third man** is on the boundary behind square on the off side, saving runs from late cuts and edges that beat the slips. **Fine leg** and **long leg** are the boundary positions behind square on the leg side; **long stop**, directly behind the keeper, has all but disappeared from the modern game.",
      },
      { type: "h2", text: "Square of the wicket" },
      {
        type: "p",
        text: "**Point** is square on the off side, roughly level with the batter, and is often occupied by the side's best athlete because so many cut shots go there. **Backward point** is a little behind square, **silly point** very close in for the bat-pad catch off spin. On the leg side, **square leg** is the mirror of point; the square-leg umpire stands there. **Short leg** is the close catching position on the leg side, used against spinners, and **backward square leg** is a little behind square. **Deep point**, **deep square leg** and **deep backward square** are the corresponding boundary positions.",
      },
      { type: "h2", text: "In front of the batter" },
      {
        type: "p",
        text: "**Cover** is in front of square on the off side, between point and mid-off, and **extra cover** sits between cover and mid-off. **Mid-off** is beside the bowler's run-up on the off side and **mid-on** is its leg-side mirror; both are straight positions that save the drive. **Midwicket** is the leg-side equivalent of cover, in front of square. Close in front of the bat, **silly mid-off** and **silly mid-on** take bat-pad catches. On the boundary, **long-off** and **long-on** are straight, **deep cover** and **deep extra cover** are on the off side, and **deep midwicket** is on the leg side. **Cow corner**, an informal name for deep midwicket towards long-on, is where slogs across the line tend to land; a **sweeper** is any fielder patrolling a large section of boundary, usually at deep cover or deep midwicket.",
      },
      { type: "h2", text: "How captains use the positions" },
      {
        type: "p",
        text: "A Test captain with a new ball and a fast bowler might set three slips, a gully, point, cover, mid-off, mid-on and fine leg: nine fielders plus the keeper, seven of them in catching or run-saving positions on the off side, inviting the batter to drive at a ball that might swing away. A spinner on a turning pitch wants a slip, a short leg and a silly point for bat-pad chances, with the rest saving singles. In the closing overs of a T20 four fielders must stay inside the circle, and the captain will often post the other five on the boundary. The fielding restrictions that shape those choices are explained in the [powerplay guide](/guides/powerplay-and-fielding-restrictions-explained).",
      },
      { type: "h2", text: "Two positional laws worth knowing" },
      {
        type: "p",
        text: "No more than two fielders may stand behind square on the leg side at the moment of delivery; a third makes the ball a no-ball. This restriction dates from around 1960, when it was brought in to stop negative leg-side bowling; it also rules out Bodyline-style fields and still shapes leg-side fields today. And no fielder may stand on or over the pitch itself until the ball has been played, so even silly point stays off the cut strip. Beyond those, and the limited-overs circle rules, a captain may put fielders anywhere.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "bowling-types-swing-seam-spin-explained",
    title: "Bowling Explained: Swing, Seam, Pace Variations and Spin",
    category: "Cricket basics",
    description:
      "What makes a ball swing, seam or spin: conventional and reverse swing, seam movement, cutters, yorkers and slower balls, and the off-spinner's, leg-spinner's and left-armer's stock deliveries and variations.",
    related: ["pitch-and-conditions-explained", "cricket-fielding-positions-explained", "cricket-glossary"],
    blocks: [
      {
        type: "p",
        text: "Commentators talk about swing, seam and spin as if everyone knows the difference, and then add googlies, doosras and cutters on top. This guide sets out what each type of bowling is trying to do to the ball and to the batter, and what the named deliveries actually are.",
      },
      { type: "h2", text: "Pace bowling: movement in the air" },
      {
        type: "p",
        text: "**Conventional swing** is movement through the air caused by the seam and the two sides of the ball. A bowler holds the seam upright and angled slightly, keeps one side polished and lets the other roughen. Air flows differently over the shiny and rough halves and the ball drifts towards the rough side. An **outswinger** moves away from a right-handed batter towards the slips; an **inswinger** moves in towards the stumps and pads. Swing is strongest when the ball is new and the lacquer intact, in humid or overcast conditions, and with a good seam position out of the hand.",
      },
      {
        type: "p",
        text: "**Reverse swing** happens with an older ball, typically after 30 or 40 overs of a Test innings, when one side has become very rough and the other has been kept heavy and smooth. Bowled at high pace, the ball then swings towards the shiny side, the opposite of conventional swing, and often late in its flight. Because the batter reads the shiny side and expects it to go the other way, reverse swing is one of the most difficult things to face. It is legitimately produced by pace and ball maintenance; artificially roughening the ball to induce it is ball-tampering.",
      },
      { type: "h2", text: "Pace bowling: movement off the pitch" },
      {
        type: "p",
        text: "**Seam movement** happens when the ball lands on its seam and deviates as it grips the surface. Unlike swing it is largely random in direction, which is why seaming conditions (a green or damp pitch, a hard seam) are so difficult to bat on: even the bowler does not know which way it will go. A **cutter** is a deliberate version, in which the bowler drags the fingers down one side of the ball at release so that it spins slightly and grips off the pitch, and it doubles as a change of pace. A **leg-cutter** moves away from the right-hander like a leg-break; an **off-cutter** moves in.",
      },
      { type: "h2", text: "Pace bowling: lengths and variations" },
      {
        type: "ul",
        items: [
          "**Yorker:** pitched at or just before the batter's feet so it cannot be hit on the full or after the bounce. The main death-overs weapon in limited-overs cricket; a **wide yorker** aims outside off stump to take the leg side out of play.",
          "**Bouncer:** short-pitched to rise at chest or head height. ICC playing conditions allow two per over in Tests and ODIs and one in T20 internationals; some T20 leagues allow two, as the IPL has since 2024.",
          "**Slower ball:** delivered with the same action but less pace, using a change of grip (off-cutter, back-of-the-hand, knuckle ball, split-finger). The batter plays too early and lofts a catch or mistimes.",
          "**Slower bouncer:** a short ball at reduced pace that dies on the batter and is hard to pull.",
          "**Good length:** the area, roughly six to eight metres from the stumps, from which the batter cannot comfortably drive or pull. Bowling there consistently is the core skill in Tests.",
        ],
      },
      { type: "h2", text: "Spin bowling: finger spin" },
      {
        type: "p",
        text: "An **off-spinner** (right-arm) rolls the fingers over the ball so that it turns from the off side towards the leg side for a right-handed batter, that is, into the batter. Their variations are the **arm ball**, which does not turn and drifts on with the arm, the **top-spinner**, which dips and bounces more, and the **doosra**, which turns away from the right-hander despite an apparently identical action. A **left-arm orthodox** spinner is the mirror image: their stock ball turns away from the right-hander, from leg to off, like a leg-break, and their arm ball skids straight on.",
      },
      { type: "h2", text: "Spin bowling: wrist spin" },
      {
        type: "p",
        text: "A **leg-spinner** (right-arm) uses the wrist to spin the ball so that it turns from leg to off for a right-hander, away from the bat. Wrist spin generates more turn and more variety than finger spin but is harder to control. The **googly** (or **wrong'un**) turns the other way, into the right-hander, out of the back of the hand; the **flipper** is squeezed out to skid low and fast; the **top-spinner** bounces steeply; and the **slider** goes straight on. A **left-arm wrist spinner**, historically called a chinaman bowler, turns the ball into the right-hander with their stock delivery and away with their wrong'un.",
      },
      { type: "h2", text: "Newer variations" },
      {
        type: "p",
        text: "The **carrom ball** is flicked out between the thumb and a bent middle finger, like a carrom striker, and can be made to turn either way with a similar-looking action; it is associated with modern off-spinners and mystery spinners. The **knuckle ball**, borrowed from baseball, is a pace bowler's slower ball held on the knuckles so it leaves the hand with almost no revolutions and dips unpredictably. Both reward batters who watch the hand rather than the pitch.",
      },
      { type: "h2", text: "Why conditions decide which type prevails" },
      {
        type: "p",
        text: "Swing wants a new ball and cloud; seam wants grass and moisture; spin wants a dry, abrasive surface that grips the ball, which is why spinners come into their own later in a Test as the pitch wears. Reverse swing wants heat and an old, dry ball. A captain reads all of this at the toss and through the day, and the [pitch and conditions guide](/guides/pitch-and-conditions-explained) explains how.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "cricket-glossary",
    title: "Cricket Glossary: Terms Explained A to Z",
    category: "Cricket basics",
    description:
      "Plain definitions of the cricket terms you will hear in commentary and see on scorecards, from all-rounder and beamer to yorker and zooter.",
    related: ["how-to-read-a-cricket-scorecard", "ways-of-getting-out-in-cricket", "cricket-fielding-positions-explained"],
    blocks: [
      {
        type: "p",
        text: "Cricket has a vocabulary of its own, much of it a century or more old. The definitions below are short by design; where a term deserves a fuller explanation there is a link to the relevant guide.",
      },
      { type: "h2", text: "A to C" },
      {
        type: "kv",
        items: [
          { k: "All-rounder", v: "A player selected for both batting and bowling." },
          { k: "Appeal", v: "The fielding side asking the umpire for a decision, traditionally \"How's that?\". No dismissal is given without an appeal." },
          { k: "Arm ball", v: "A finger-spinner's delivery that does not turn and follows the line of the arm." },
          { k: "Ashes", v: "The Test series between England and Australia, played since 1882." },
          { k: "Average (batting)", v: "Runs scored divided by times dismissed. See the [stats guide](/guides/batting-average-strike-rate-economy-explained)." },
          { k: "Average (bowling)", v: "Runs conceded divided by wickets taken; lower is better." },
          { k: "Bail", v: "One of the two small pieces of wood resting on top of the three stumps. At least one must be dislodged for the wicket to be broken." },
          { k: "Beamer", v: "A full toss reaching the batter above waist height; a no-ball and, if repeated, grounds for the bowler's removal." },
          { k: "Bouncer", v: "A short-pitched ball that rises to chest or head height." },
          { k: "Boundary", v: "The edge of the field; a ball crossing it after bouncing scores four, without bouncing six." },
          { k: "Bye", v: "A run taken when the ball passes the batter without touching bat or body. Not debited to the bowler." },
          { k: "Carry", v: "Whether the ball reaches the keeper or slips without bouncing; \"it didn't carry\" means a catch was not clean." },
          { k: "Century", v: "A score of 100 or more by one batter in an innings. A double century is 200." },
          { k: "Chinaman", v: "Older term for a left-arm wrist spinner's stock ball; now usually called left-arm unorthodox." },
          { k: "Cow corner", v: "Informal name for the deep midwicket to long-on area where cross-batted slogs land." },
          { k: "Crease", v: "The painted lines at each end: the popping crease marks the batter's ground, the bowling crease the line of the stumps." },
        ],
      },
      { type: "h2", text: "D to H" },
      {
        type: "kv",
        items: [
          { k: "Dead ball", v: "A ball no longer in play; no runs can be scored and no batter dismissed." },
          { k: "Death overs", v: "The final overs of a limited-overs innings, usually the last four or five of a T20 and the last ten of an ODI." },
          { k: "Declaration", v: "A captain closing their side's innings before all ten wickets have fallen. See [follow-on and declarations](/guides/follow-on-and-declarations-explained)." },
          { k: "DLS", v: "The Duckworth-Lewis-Stern method for resetting targets in rain-affected matches. See the [DLS guide](/guides/dls-method-explained)." },
          { k: "Dot ball", v: "A delivery from which no run is scored." },
          { k: "Doosra", v: "An off-spinner's delivery that turns the opposite way to their stock ball." },
          { k: "DRS", v: "The Decision Review System for challenging umpiring decisions. See the [DRS guide](/guides/drs-explained)." },
          { k: "Duck", v: "A score of nought. A golden duck is out first ball; a diamond duck is out without facing a ball." },
          { k: "Economy rate", v: "Runs conceded per over bowled." },
          { k: "Extras", v: "Runs not scored off the bat: byes, leg byes, wides, no-balls and penalties." },
          { k: "Fifty", v: "A score of 50 or more; also called a half-century." },
          { k: "Follow-on", v: "Making a side that trails heavily after the first innings bat again immediately." },
          { k: "Free hit", v: "In limited-overs cricket, the delivery after a no-ball, from which the batter cannot be out bowled, caught, LBW, stumped or hit wicket." },
          { k: "Full toss", v: "A ball that reaches the batter without bouncing." },
          { k: "Gardening", v: "A batter patting down the pitch between deliveries." },
          { k: "Googly", v: "A leg-spinner's delivery that turns the opposite way to the stock ball; also called a wrong'un." },
          { k: "Half-volley", v: "A ball pitching just short of the batter's reach, easy to drive." },
          { k: "Hat-trick", v: "Three wickets in three consecutive deliveries by the same bowler, which may span overs or even innings." },
        ],
      },
      { type: "h2", text: "I to O" },
      {
        type: "kv",
        items: [
          { k: "Innings", v: "One side's turn to bat, or one batter's individual turn. The word is the same in singular and plural." },
          { k: "Jaffa", v: "Slang for an unplayably good delivery." },
          { k: "King pair", v: "Out first ball in both innings of a match." },
          { k: "LBW", v: "Leg before wicket. See [ways of getting out](/guides/ways-of-getting-out-in-cricket)." },
          { k: "Leg bye", v: "A run taken after the ball hits the batter's body (not the bat) while they were attempting a shot or avoiding the ball." },
          { k: "Length", v: "How far down the pitch the ball lands: short, good, full." },
          { k: "Line", v: "The direction of the ball relative to the stumps: off stump, middle, leg." },
          { k: "Maiden", v: "An over in which no runs are conceded off the bat or as wides and no-balls." },
          { k: "Mankad", v: "Informal name for running out the non-striker before the ball is bowled; a normal run out under the current Laws." },
          { k: "Nelson", v: "A score of 111, superstitiously considered unlucky in England; 87 plays the same role in Australia." },
          { k: "Net run rate", v: "Runs scored per over minus runs conceded per over across a tournament. See the [NRR guide](/guides/net-run-rate-explained)." },
          { k: "Nightwatchman", v: "A lower-order batter sent in late in the day to protect a better batter until the close." },
          { k: "No-ball", v: "An illegal delivery, usually for overstepping the crease or a high full toss; costs one run and must be re-bowled." },
          { k: "Over", v: "Six legal deliveries from one end." },
          { k: "Over-rate", v: "The speed at which a fielding side gets through its overs; slow rates draw fines and, in limited-overs cricket, fielding penalties." },
        ],
      },
      { type: "h2", text: "P to S" },
      {
        type: "kv",
        items: [
          { k: "Pair", v: "A duck in both innings of a match." },
          { k: "Partnership", v: "The runs added while two particular batters are together." },
          { k: "Pinch-hitter", v: "A lower-order batter promoted to hit quickly, usually in a powerplay." },
          { k: "Pitch", v: "The 22-yard strip between the stumps; also the point where the ball lands." },
          { k: "Powerplay", v: "A period of fielding restrictions in limited-overs cricket. See the [powerplay guide](/guides/powerplay-and-fielding-restrictions-explained)." },
          { k: "Required run rate", v: "Runs per over the chasing side needs from the remaining overs." },
          { k: "Reverse sweep", v: "A sweep shot played with the hands reversed so the ball goes to the off side." },
          { k: "Rough", v: "The scuffed area outside the crease created by bowlers' feet, which spinners aim for." },
          { k: "Run rate", v: "Runs scored per over." },
          { k: "Seam", v: "The stitched ridge around the ball; also movement off the pitch caused by landing on it." },
          { k: "Sightscreen", v: "The large screen behind the bowler that helps the batter see the ball: white for a red ball, black for a white ball, and either for a pink ball, as the home board decides." },
          { k: "Slog", v: "A hard, often cross-batted shot with little regard for technique." },
          { k: "Stance", v: "The batter's position while waiting for the ball." },
          { k: "Strike rate (batting)", v: "Runs per 100 balls faced." },
          { k: "Strike rate (bowling)", v: "Balls bowled per wicket taken." },
          { k: "Super Over", v: "A one-over-a-side eliminator used to settle ties. See the [tie-breakers guide](/guides/super-over-and-tie-breakers-explained)." },
          { k: "Sweep", v: "A shot played on one knee, hitting a ball on the leg side square or behind." },
        ],
      },
      { type: "h2", text: "T to Z" },
      {
        type: "kv",
        items: [
          { k: "Tail", v: "The lower-order batters, usually specialist bowlers." },
          { k: "Tea", v: "The second interval of the day in Test cricket, between the second and third sessions. In day-night Tests the order is reversed: tea comes after the first session and the longer dinner interval after the second." },
          { k: "Toss", v: "The coin toss before the match; the winner chooses to bat or bowl." },
          { k: "Twelfth man", v: "The named substitute fielder who may not bat or bowl." },
          { k: "Umpire's call", v: "A DRS outcome where the technology is too marginal to overturn the on-field decision." },
          { k: "Wagon wheel", v: "A diagram showing where a batter's scoring shots went." },
          { k: "Wicket", v: "The stumps and bails; a batter's dismissal; or the pitch itself, depending on context." },
          { k: "Wicketkeeper", v: "The fielder behind the stumps wearing gloves and pads." },
          { k: "Wide", v: "A delivery too far from the batter to be hit with a normal stroke; costs one run and must be re-bowled." },
          { k: "Yorker", v: "A ball pitched at the batter's feet." },
          { k: "Zooter", v: "A leg-spinner's variation that skids on with little bounce; Shane Warne's name for a version of the slider." },
        ],
      },
    ],
  },
];
