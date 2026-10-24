// Guides: laws, officials and equipment in depth. Evergreen explainers of LBW,
// no-balls and wides, run rates, match officials, the Ashes and the ball.
// Checked against the MCC Laws of Cricket (2017 Code, 4th edition, in force
// from 1 October 2026) and the ICC men's and women's playing conditions
// effective October 2026. Every number is a rule, a fixed historical fact or
// a worked example that says it is one. See guides/index.js for the shape.

module.exports = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "lbw-rule-explained",
    reviewed: "24 October 2026",
    title: "The LBW Rule Explained: How Leg Before Wicket Is Decided",
    category: "Rules & calculations",
    description:
      "How Law 36 decides leg before wicket, covering where the ball landed, where it hit the batter, the no-shot exception, why bat first means not out, and how DRS ball-tracking and umpire's call are applied.",
    related: ["drs-explained", "ways-of-getting-out-in-cricket", "no-ball-wide-and-free-hit-explained", "umpires-and-match-officials-explained"],
    blocks: [
      {
        type: "p",
        text: "Leg before wicket, written LBW, causes more arguments than any other dismissal, yet it is one of the most tightly defined. Law 36 of the MCC Laws of Cricket lists five conditions, and a batter is out only if every one of them is met. This guide takes them in the order an umpire does, then explains how the Decision Review System tests the same conditions with ball-tracking. It follows the 2026 edition of the Laws and the ICC playing conditions current at the date of review.",
      },
      { type: "h2", text: "The five conditions" },
      {
        type: "ol",
        items: [
          "**The delivery is legal.** Nobody can be out LBW off a no-ball, however straight the ball was going.",
          "**The ball did not first land outside leg stump.** It must first land in line between wicket and wicket, or on the off side. A ball that lands outside the line of leg stump cannot produce an LBW, wherever it goes next. A full toss that hits the batter before landing meets this condition automatically.",
          "**It hit the batter before the bat.** The ball must strike some part of the batter's person, such as the pad, body or helmet, without having touched the bat first.",
          "**The impact was in line, unless no shot was offered.** The point where the ball first hits the batter must be between wicket and wicket, even if it is above the height of the bails. If the batter made no genuine attempt to play the ball with the bat, an impact outside the line of off stump also counts. An impact outside the line of leg stump is never out.",
          "**The ball would have hit the wicket.** The umpire assumes that, but for the batter, the ball would have carried on along the path it was already on, whether or not it would have bounced before reaching the stumps.",
        ],
      },
      {
        type: "p",
        text: "LBW appeals are answered by the bowler's end umpire, and as with every dismissal a batter can only be given out if the fielding side appeals. If an umpire is still in doubt after consulting their colleague, the Laws say the decision is not out.",
      },
      { type: "h2", text: "Bat first, pad first" },
      {
        type: "p",
        text: "If the ball touches the bat before it hits the pad, the batter cannot be out LBW, though they can still be caught off the deflection. If the ball hits bat and pad at the same instant, Law 36 treats it as having hit the bat first. Only the first contact with the batter counts, so a ball that hits the pad, then the bat, is judged on where it struck the pad.",
      },
      {
        type: "p",
        text: "Gloves are a frequent source of confusion. A glove on a hand that is holding the bat counts as part of the bat, so a ball that hits it first cannot be LBW. A hand that has come off the handle is part of the batter's person, so a ball that hits that hand first can be.",
      },
      { type: "h2", text: "The no-shot exception" },
      {
        type: "p",
        text: "Most close LBW decisions turn on whether the batter played a shot. A batter who makes a genuine attempt to play the ball with the bat can only be out if the impact was in line with the stumps. A batter who does not, by padding the ball away or leaving it, can be out even when struck outside the line of off stump, provided the ball would have gone on to hit the wicket. Whether an attempt was genuine is the umpire's judgement.",
      },
      {
        type: "p",
        text: "The clause exists to stop pad-play: batters kicking away balls outside off stump instead of playing them, knowing they could not be given out. LBW itself has been in the Laws since 1774. Balls landing outside off stump were brought within it by an experiment in 1935 that became Law in 1937, and the no-shot wording was trialled from the 1969-70 season and written into the Laws in 1980.",
      },
      { type: "h3", text: "Which side is the off side?" },
      {
        type: "p",
        text: "Off and leg are fixed by the batter's position at the moment the ball comes into play, which is when the bowler starts their run-up. A right-hander who switches to a left-handed grip during the run-up, or plays a reverse sweep, is still judged as a right-hander, so their original leg stump still marks the line for outside leg.",
      },
      { type: "h2", text: "What the umpire has to judge" },
      {
        type: "p",
        text: "Without technology, the bowler's end umpire has a second or two to settle all five conditions. The hardest is the last: a projection that must allow for bounce, swing, spin and the distance from the point of impact to the stumps. The further from the stumps the batter is hit, the less certain any projection becomes, and the review rules below build that uncertainty in.",
      },
      { type: "h2", text: "How DRS tests an LBW" },
      {
        type: "p",
        text: "When an LBW decision is reviewed, the TV umpire first checks that the delivery was legal, then whether the ball touched the bat before the pad, using replays and edge detection. If the batter is still eligible to be out, ball-tracking (Hawk-Eye is the best-known system) reports three things: where the ball landed, where it first hit the batter, and whether it would have hit the wicket.",
      },
      {
        type: "kv",
        items: [
          {
            k: "Landing",
            v: "Judged by the centre of the ball against a zone the width of the stumps running between the two sets. The reading is in line, outside off or outside leg. Outside leg is not out; the other two can be. There is no umpire's call on where the ball landed.",
          },
          {
            k: "Impact",
            v: "In line if the centre of the ball was inside the line of the stumps when it hit the batter; umpire's call if part of the ball was in line but its centre was not; outside if no part of it was in line. When the umpire has judged that no shot was offered, an impact outside off stump still counts.",
          },
          {
            k: "Wicket",
            v: "Hitting if the ball would have hit the wicket with its centre inside the outline of the stumps and bails; umpire's call if it would have clipped the wicket with its centre outside that outline; missing otherwise.",
          },
        ],
      },
      { type: "h2", text: "Umpire's call" },
      {
        type: "p",
        text: "Umpire's call exists because ball-tracking is a projection with a margin of error, so marginal readings defer to the decision made on the field: out stays out and not out stays not out. That is why two deliveries that look identical on screen can end differently. To turn not out into out, the ball must not have landed outside leg, the impact must be in line (or outside off with no shot offered) and the ball must be shown hitting. To turn out into not out, the ball must have landed outside leg, hit the batter wholly outside the line of the stumps (wholly outside leg, where no shot was offered) or be shown missing.",
      },
      {
        type: "p",
        text: "A review that fails only because of umpire's call does not count against the reviewing side's allowance of unsuccessful reviews, which is three per innings in Tests and two in ODIs and T20Is. If a review shows the delivery was a no-ball, the batter is not out.",
      },
      { type: "h3", text: "Less obvious review rules" },
      {
        type: "ul",
        items: [
          "**Long distances.** If tracking shows the ball hitting but the batter was struck 300 cm (about ten feet) or more from the stumps, a not-out decision stands. The same applies between 250 and 300 cm if the ball travelled less than 40 cm between landing and hitting the batter.",
          "**Full tosses.** If the ball hits the batter on the full but would have bounced before the stumps, ball-tracking shows only its projected line. How high it would have bounced remains the on-field umpire's judgement.",
          "**Caught or LBW.** If a batter is given out caught and the review shows the ball hit the pad rather than the bat, the TV umpire can check LBW instead, and that check starts from the original decision of out, so an umpire's-call reading keeps the batter out.",
          "**The no-shot question.** Before deciding whether to review, players may ask the umpire whether the decision was based on no shot being offered. Unless the umpire says so, the TV umpire assumes a genuine shot was played.",
        ],
      },
      {
        type: "p",
        text: "If a batter is hit and given not out, leg byes may be run only if they attempted a shot or tried to avoid the ball. For the other ways of being dismissed, see [the ten ways of getting out](/guides/ways-of-getting-out-in-cricket); for review allowances and the technology, see the [DRS guide](/guides/drs-explained).",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "no-ball-wide-and-free-hit-explained",
    reviewed: "24 October 2026",
    title: "No-Balls, Wides and the Free Hit Explained",
    category: "Rules & calculations",
    description:
      "Every way a delivery becomes a no-ball or a wide under the Laws and the ICC playing conditions, the bouncer limit in each format, what each costs the bowling side, and how the free hit works in limited-overs internationals.",
    related: ["lbw-rule-explained", "powerplay-and-fielding-restrictions-explained", "how-to-read-a-cricket-scorecard", "umpires-and-match-officials-explained"],
    blocks: [
      {
        type: "p",
        text: "No-balls and wides are the two kinds of illegal delivery. Neither counts as one of the six balls in an over, each costs a penalty run, and each limits how a batter can be dismissed. This guide follows Laws 21 and 22 of the MCC Laws (2026 edition) and the extra rules the ICC applies in internationals, including the free hit.",
      },
      { type: "h2", text: "What a no-ball costs" },
      {
        type: "ul",
        items: [
          "**One penalty run**, recorded as a no-ball extra against the bowler. It stands even if a batter is then run out, and any runs the batters take are added on top: to the striker if the ball was hit with the bat, as byes or leg byes if not.",
          "**An extra delivery**, because a no-ball is not one of the six balls of the over.",
          "**Limited dismissals.** Off a no-ball neither batter can be out except run out, hit the ball twice or obstructing the field.",
          "**A free hit** next ball in ODIs and T20Is, explained below.",
        ],
      },
      { type: "h2", text: "The bowler's feet" },
      {
        type: "p",
        text: "In the delivery stride the **back foot** must land within, and not touching, the return crease on the side the bowler said they would bowl from. The **front foot** must land with some part of it, grounded or raised, behind the popping crease, and on the same side of the middle-stump line as that return crease. Because the popping crease is the back edge of the painted line, a front foot on the line is legal if part of it is behind that edge.",
      },
      {
        type: "p",
        text: "In international cricket the TV umpire checks the front foot on every delivery and tells the bowler's end umpire, who calls the no-ball. A bowler who oversteps on purpose is treated as acting unfairly: they are suspended from bowling immediately and may not bowl again in the match.",
      },
      { type: "h2", text: "Height: full tosses and bouncers" },
      { type: "h3", text: "Full tosses above the waist" },
      {
        type: "p",
        text: "Any delivery that passes, or would have passed, above the waist of the batter standing upright at the crease without bouncing is a no-ball. If the umpire also judges it dangerous, the bowler gets a first and final warning, and a second dangerous one in the innings means removal from the attack for the rest of the innings. A deliberate beamer means immediate removal: for the rest of the match under the 2026 Laws, for the rest of the innings under the ICC's international playing conditions.",
      },
      { type: "h3", text: "Bouncers" },
      {
        type: "p",
        text: "The Laws leave short-pitched bowling to the umpire's judgement of what is dangerous or unfair. International cricket adds a fixed limit on **fast short deliveries**, balls that pass or would have passed above the shoulder of the batter standing upright at the crease:",
      },
      {
        type: "table",
        head: ["Format", "Fast short deliveries allowed per over"],
        rows: [
          ["Test", "2"],
          ["ODI", "2"],
          ["T20I", "1"],
        ],
      },
      {
        type: "p",
        text: "Each one over the limit is a no-ball. The first such breach in an innings also brings a caution, the second a final warning and the third removal from the attack for the rest of the innings. Under the ICC playing conditions, a ball that bounces over the batter's head, out of reach of a normal shot, is a wide rather than a no-ball, and it still counts towards the over's allowance. The Laws have treated it the same way since 1 October 2026; before that edition, a ball bouncing over head height was a no-ball under the Laws. Head-high bouncers bowled repeatedly can still be called no-ball as unfair bowling.",
      },
      { type: "h2", text: "The other kinds of no-ball" },
      {
        type: "ul",
        items: [
          "**Throwing**: straightening the elbow once the bowling arm reaches shoulder height. In internationals an action is illegal if the elbow extends by more than 15 degrees.",
          "**Changing arm, or switching between over and round the wicket**, without telling the umpire.",
          "**Underarm bowling**, unless agreed before the match; never in internationals.",
          "**Breaking the wicket in delivery**: the bowler, or anything falling from them, hitting the stumps at their end between the start of the run-up and the stride after delivery, unless they were running out the non-striker.",
          "**The ball bouncing more than once or rolling** before it reaches the popping crease, or landing wholly or partly off the pitch.",
          "**The ball stopping in front of the striker**, or passing so wide that the striker would have to leave the pitch to reach it.",
          "**A fielder touching the ball** before it reaches the batter or passes the stumps.",
          "**The wicket-keeper** not being wholly behind the stumps from release until the ball reaches the batter, passes the stumps or the striker sets off for a run. Since October 2026 the keeper's gloves may be in front of the stumps during the run-up.",
          "**More than two fielders behind square on the leg side**, not counting the keeper.",
          "**A fielder on or over the pitch** before the ball reaches the batter.",
          "**Fielding-restriction breaches** in limited-overs cricket; see the [powerplay guide](/guides/powerplay-and-fielding-restrictions-explained).",
        ],
      },
      { type: "h2", text: "Wides" },
      {
        type: "p",
        text: "A wide is a delivery the batter could not reach with a normal cricket stroke. The umpire judges it against where the batter is standing (and, under the Laws, anywhere they have stood since the bowler began the run-up) and against a normal batting position, and it is a wide only if it is out of reach on both. It is not a wide if the batter's own movement brings the ball within reach or takes them out of reach of it, or if it touches the bat or the batter's body.",
      },
      {
        type: "p",
        text: "The penalty is one run, and all runs taken off a wide, including a boundary, are recorded as wides and charged to the bowler. A wide is not one of the six balls of the over. Off a wide the striker can still be stumped or out hit wicket, and either batter can be run out or out obstructing the field.",
      },
      { type: "h3", text: "Stricter in limited-overs cricket" },
      {
        type: "p",
        text: "In ODIs and T20Is the ICC instructs umpires to apply a very strict and consistent interpretation of the wide law, to stop negative bowling out of the batter's reach, and guide lines may be painted on the crease. Deliveries drifting down the leg side or well outside off stump are therefore called wide more readily than in a Test, although Test umpires apply the same strict standard to negative leg-side bowling and to bowlers aiming at the rough outside leg stump.",
      },
      {
        type: "p",
        text: "ODIs and T20Is also judge leg-side wides against the position of the batter's legs at the moment of delivery, a rule trialled from October 2025 and made permanent in October 2026 to give bowlers some leeway when a batter moves around the crease.",
      },
      { type: "h2", text: "The free hit" },
      {
        type: "p",
        text: "In ODIs and T20Is the delivery after any no-ball is a **free hit**. Off it the striker can be out only in the ways that apply to a no-ball, **run out, hit the ball twice or obstructing the field**, even if the free-hit delivery is itself a wide. If the free-hit delivery is a no-ball or a wide, the next ball is a free hit too.",
      },
      {
        type: "ul",
        items: [
          "**No field changes** unless a different batter is now on strike, or the no-ball was for a fielding-restriction breach, which may then be corrected.",
          "**The bowler may change mode**, for example to round the wicket, if the umpire is told.",
          "**The signal** is one arm raised straight up and moved in a circle, after the no-ball signal.",
          "**Hitting the stumps** does not end a free hit: the striker is not out, the ball stays live and the batters may run.",
        ],
      },
      {
        type: "p",
        text: "Free hits came into one-day internationals in October 2007, at first only after front-foot no-balls. Since 5 July 2015 every kind of no-ball in ODIs and T20Is has been followed by one. There is no free hit in Test cricket.",
      },
      { type: "h2", text: "Common questions" },
      {
        type: "faq",
        items: [
          {
            q: "Can a delivery be both a no-ball and a wide?",
            a: "No. If both apply, the no-ball call overrides the wide, and the delivery is scored as a no-ball.",
          },
          {
            q: "Why do some overs have more than six deliveries?",
            a: "Because wides and no-balls are not counted among the six legal balls. An over containing two wides and a no-ball has nine deliveries.",
          },
        ],
      },
      {
        type: "p",
        text: "On a scorecard, wides and no-balls appear under extras as **w** and **nb**; the [scorecard guide](/guides/how-to-read-a-cricket-scorecard) explains the notation.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "run-rate-and-required-run-rate-explained",
    reviewed: "24 October 2026",
    title: "Run Rate and Required Run Rate Explained, With Worked Examples",
    category: "Rules & calculations",
    description:
      "How the current and required run rates are calculated, why 19.4 overs means 19 overs and four balls, how to work in balls remaining, and how to read the numbers during a run chase.",
    related: ["net-run-rate-explained", "dls-method-explained", "how-to-read-a-cricket-scorecard", "batting-average-strike-rate-economy-explained"],
    blocks: [
      {
        type: "p",
        text: "Every live scorecard of a limited-overs chase shows two numbers: the current run rate (CRR) and the required run rate (RRR). Both are runs per over and both are short calculations, provided one piece of notation is handled correctly. This guide explains that notation, works through both rates with examples and shows how to use them to follow a chase. If you only need an answer, the [required run rate calculator](/tools/required-run-rate-calculator) does the arithmetic and shows its working.",
      },
      { type: "h2", text: "How overs are written" },
      {
        type: "p",
        text: "An over is six legal deliveries. Scorecards write overs as **completed overs, a dot, then balls**, so **19.4 overs means 19 overs and 4 balls**, not nineteen and four-tenths. In balls that is 19 × 6 + 4 = 118, and as a number of overs it is 118 ÷ 6 = 19.667. The figure after the dot only ever runs from 0 to 5: the ball after 19.5 completes the over and the count becomes 20.0. Wides and no-balls are not legal deliveries, so they add runs without moving the overs figure on.",
      },
      {
        type: "table",
        head: ["Written after the dot", "Balls", "Fraction of an over"],
        rows: [
          [".1", "1", "0.167"],
          [".2", "2", "0.333"],
          [".3", "3", "0.5"],
          [".4", "4", "0.667"],
          [".5", "5", "0.833"],
        ],
      },
      {
        type: "p",
        text: "The safest habit is to convert everything to balls before dividing. It avoids the decimal trap entirely and turns balls remaining into a simple subtraction.",
      },
      { type: "h2", text: "Current run rate" },
      {
        type: "callout",
        text: "Current run rate = runs scored ÷ overs faced, with the overs as a true number. In balls: runs ÷ balls faced × 6.",
      },
      {
        type: "p",
        text: "Worked example (invented figures): a side is 172 for 4 after 31.4 overs. That is 31 × 6 + 4 = 190 balls, so the run rate is 172 ÷ 190 × 6 = **5.43** an over. Dividing by 31.4 as if it were a decimal gives 5.48, which is wrong. The same calculation applied to a bowler's runs conceded gives their economy rate.",
      },
      { type: "h2", text: "Required run rate" },
      {
        type: "callout",
        text: "Required run rate = runs still needed ÷ overs remaining. Runs needed = target − current score. Overs remaining = balls remaining ÷ 6.",
      },
      {
        type: "p",
        text: "The target is one run more than the side batting first scored, or a revised target if rain has shortened the match. Balls remaining are the innings' full allocation (300 in an ODI, 120 in a T20) minus the legal balls already bowled.",
      },
      { type: "h3", text: "Worked example: a 50-over chase" },
      {
        type: "p",
        text: "Example with invented figures: the side batting first makes 285, so the target is 286 from 50 overs. The chasing side is 172 for 4 after 31.4 overs.",
      },
      {
        type: "ol",
        items: [
          "Runs needed: 286 − 172 = **114**.",
          "Balls bowled: 31 × 6 + 4 = 190. Balls remaining: 300 − 190 = **110**, which a scorecard would show as 18.2 overs.",
          "Overs remaining as a number: 110 ÷ 6 = **18.333**.",
          "Required run rate: 114 ÷ 18.333 = **6.22** an over, the same as 114 ÷ 110 × 6.",
        ],
      },
      {
        type: "p",
        text: "The usual slip is to divide by 18.2, which gives 6.26. The error looks small here but grows as the overs run down. Needing 20 from 2.4 overs (16 balls), the correct rate is 20 ÷ 16 × 6 = 7.50; dividing by 2.4 gives 8.33.",
      },
      { type: "h3", text: "Worked example: the end of a T20 chase" },
      {
        type: "p",
        text: "Example with invented figures: chasing 181 in a T20, a side is 98 for 3 after 12.3 overs, which is 75 balls. It needs 83 more from the remaining 45 balls.",
      },
      {
        type: "ul",
        items: [
          "Current rate: 98 ÷ 75 × 6 = **7.84**.",
          "Required rate: 83 ÷ 45 × 6 = **11.07**.",
          "Per ball: 83 ÷ 45 = 1.84 runs a ball, a batting strike rate of about 184.",
        ],
      },
      {
        type: "p",
        text: "Late in a T20 innings commentators often skip rates altogether and say \"83 off 45\", because balls are easier to picture than fractions of an over.",
      },
      { type: "h2", text: "Reading a chase" },
      {
        type: "ul",
        items: [
          "**Compare the two rates.** If the required rate is above the current rate, the chasing side needs to score faster from here than it has so far. That is arithmetic, not a forecast: sides often plan to accelerate later.",
          "**Watch which way the requirement moves.** An over that yields more than the required rate pulls the requirement down; one that yields less pushes it up, and the push grows as overs run out. Needing 60 from 10 overs (6.00 an over), a maiden leaves 60 from 9, or 6.67. Needing 12 from 2 overs (also 6.00), a maiden leaves 12 from 1.",
          "**Count wickets as well as runs.** Neither rate knows how many wickets are left, and a side needing 9 an over with eight wickets in hand can take risks that a side with two left cannot. The [DLS method](/guides/dls-method-explained) is built on that point, which is why the DLS par score is a better guide than the run rate when rain may cut a match short.",
          "**Treat projected scores as extrapolations.** A projected total is normally the current run rate multiplied out to the end of the innings, sometimes shown alongside a few faster rates. It assumes the rest of the innings goes the way the first part did.",
          "**Extras help the chasing side twice.** A wide or no-ball adds a run without using up a legal ball, and in limited-overs internationals a no-ball also brings a free hit. The [no-ball and wide guide](/guides/no-ball-wide-and-free-hit-explained) has the details.",
        ],
      },
      { type: "h2", text: "When rain changes the target" },
      {
        type: "p",
        text: "If overs are lost, both the target and the balls remaining change, and the required rate has to be recalculated from the revised figures. Using the illustrative numbers from our [DLS guide](/guides/dls-method-explained): a side that is 90 for 2 after 20 overs is given a revised target of 201 from 35 overs. It now needs 111 from the 15 overs left, a required rate of 7.40, whatever the rate was before the rain.",
      },
      { type: "h2", text: "Run rates in Test cricket" },
      {
        type: "p",
        text: "Tests show run rates too, but with no fixed number of overs in an innings they mean something different. A side's rate mainly tells you how much time it is leaving its bowlers to take twenty wickets. The required rate matters in a fourth-innings chase, when the time left in the match can be turned into an approximate number of overs and a captain weighs whether to go for the target. The [follow-on and declarations guide](/guides/follow-on-and-declarations-explained) covers that calculation.",
      },
      { type: "h2", text: "Related numbers" },
      {
        type: "ul",
        items: [
          "**Net run rate**, the tournament tie-breaker, is built from run rates scored and conceded across all of a side's matches. See [net run rate explained](/guides/net-run-rate-explained) or the [net run rate calculator](/tools/net-run-rate-calculator).",
          "**Strike rate** is a batter's runs per 100 balls and **economy rate** a bowler's runs conceded per over. Both are explained in [batting average, strike rate and economy](/guides/batting-average-strike-rate-economy-explained), and the [batting and bowling average calculator](/tools/batting-and-bowling-average-calculator) works them out from a player's figures.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "umpires-and-match-officials-explained",
    reviewed: "24 October 2026",
    title: "Umpires and Match Officials in Cricket: Who Decides What",
    category: "Rules & calculations",
    description:
      "What the two on-field umpires, the third umpire, the fourth umpire and the match referee each decide in international cricket, how neutral umpires came about, why the soft signal was dropped, and how slow over-rates and misconduct are penalised.",
    related: ["drs-explained", "lbw-rule-explained", "powerplay-and-fielding-restrictions-explained", "world-test-championship-points-system"],
    blocks: [
      {
        type: "p",
        text: "A televised international has five officials: two umpires on the field, a third umpire watching replays, a fourth umpire in reserve and a match referee. The Laws of Cricket require only the first two; the ICC's playing conditions add the rest. This guide sets out what each decides, using the 2026 edition of the Laws and the ICC playing conditions current at the date of review.",
      },
      { type: "h2", text: "The two on-field umpires" },
      {
        type: "p",
        text: "One umpire stands at the bowler's end and the other at the striker's end, usually at square leg. Under the Laws they control the match with absolute impartiality, they are the sole judges of fair and unfair play, and together they decide whether the ground, weather and light are fit for play. Neither can give a batter out unless the fielding side appeals.",
      },
      {
        type: "kv",
        items: [
          {
            k: "Bowler's end umpire",
            v: "Answers almost every appeal, including bowled, caught and LBW, and calls and signals wides, most no-balls (front foot, high full tosses, short-pitched bowling), boundaries, byes and leg byes.",
          },
          {
            k: "Striker's end umpire",
            v: "Answers appeals for stumpings, hit wicket and run-outs at the wicket-keeper's end. Calls no-ball if more than two fielders are behind square on the leg side or the keeper comes in front of the stumps too soon, has the main responsibility for judging whether the bowler's arm action is legal, and in limited-overs cricket calls no-ball when too many fielders are outside the circle.",
          },
        ],
      },
      {
        type: "p",
        text: "If an umpire is unsure about a point the colleague was better placed to see, they consult, and if doubt remains the decision is not out. An umpire may change a decision, but only if they do so promptly.",
      },
      { type: "h2", text: "The third umpire" },
      {
        type: "p",
        text: "The third or TV umpire sits in a room with the replay feeds and the review technology. In internationals the third umpire:",
      },
      {
        type: "ul",
        items: [
          "runs **player reviews** under the [Decision Review System](/guides/drs-explained), working through replays, edge detection and, for LBW, ball-tracking;",
          "decides the **umpire reviews** that the on-field umpires refer: run-outs, stumpings, bowled and hit wicket, whether a catch was clean, whether the ball reached the boundary and for four or six, and which batter made their ground when both run to the same end;",
          "checks every call of **short run** automatically;",
          "watches the bowler's **front foot on every delivery**, tells the bowler's end umpire to call a no-ball, and checks other kinds of no-ball when asked;",
          "starts the 60-second **stop clock** between overs.",
        ],
      },
      {
        type: "p",
        text: "The third umpire is also the stand-by if an on-field umpire is ill or injured, except in ODIs that use DRS, where the fourth umpire takes that role.",
      },
      { type: "h3", text: "Why the soft signal was dropped" },
      {
        type: "p",
        text: "Until 2023, an on-field umpire who referred a catch had first to give a soft signal: a provisional out or not out that stood unless the replays showed conclusively that it was wrong. The ICC's cricket committee concluded the signal was unnecessary and at times confusing, because replays of low catches are often inconclusive, and it was abolished from 1 June 2023. The on-field umpires now consult the third umpire, who decides from the evidence.",
      },
      { type: "h2", text: "The fourth umpire" },
      {
        type: "p",
        text: "The fourth or reserve umpire, appointed by the home board, handles the match balls and access to the pitch: supervising the fielding captain's choice of match ball from a box of new ones, controlling who may walk on the pitch before play and during intervals, and supervising work on neighbouring pitches. In Tests and T20Is the fourth umpire is also the stand-by third umpire.",
      },
      { type: "h2", text: "The match referee" },
      {
        type: "p",
        text: "The match referee is appointed by the ICC for every international and makes no decisions on the field. The referee supervises the toss, approves concussion replacements, rules on disputes about the pitch, including whether a damaged pitch can be repaired, and can award the match to the other side if a team refuses to play. After the match the referee confirms with the umpires whether each side met the minimum over-rate, rates the pitch and outfield, and hears most disciplinary charges.",
      },
      { type: "h2", text: "Neutral umpires" },
      {
        type: "p",
        text: "For most of Test history both umpires came from the home country. The ICC began appointing a neutral umpire to every Test in the early 1990s, and from 2002 both on-field umpires in a Test came from countries not involved in the match. The requirement was suspended in 2020, when pandemic travel restrictions made it impractical. Neutral officials returned to Tests in 2022, when the match referee, the third umpire and one of the two on-field umpires again had to be neutral.",
      },
      {
        type: "p",
        text: "Under the current playing conditions the ICC appoints the match referee, both on-field umpires and the third umpire for a Test. In ODIs it appoints the referee, one on-field umpire and, where DRS is used, the third umpire, while the home board appoints the other on-field umpire. In T20Is the home board appoints both on-field umpires.",
      },
      { type: "h2", text: "Slow over-rates" },
      {
        type: "p",
        text: "Fielding sides must bowl at a minimum rate of 15 overs an hour in Tests, 14.28 in ODIs and 14.11 in T20Is, with allowances for time lost to things outside their control, such as reviews and injuries. Falling short is punished in several ways:",
      },
      {
        type: "ul",
        items: [
          "**Fines.** Every player in the fielding side loses 5% of the match fee for each over the side is short, up to a maximum of 50%. Over-rate offences carry no demerit points.",
          "**World Test Championship points.** In a WTC Test the side also loses one championship point for every over it is short; see the [WTC guide](/guides/world-test-championship-points-system).",
          "**The in-match fielding penalty (ODIs and T20Is).** Each innings has a scheduled finishing time. If the fielding side is not ready to bowl the first ball of the final over by then, only four fielders instead of five may stand outside the 30-yard circle in every over that starts after that time. It applied first in T20Is from January 2022 and has since been extended to ODIs; the [powerplay guide](/guides/powerplay-and-fielding-restrictions-explained) explains the circle.",
          "**The stop clock.** The fielding side must start each over within 60 seconds of the previous one ending. The first two breaches in an innings bring warnings, and the third and each later one costs five penalty runs. Permanent in ODIs and T20Is since June 2024, the clock was extended to Tests in June 2025, where the warnings reset every 80 overs. It is not used when a new batter arrives between overs, at drinks or during approved injury treatment.",
        ],
      },
      {
        type: "p",
        text: "Batters are held to a similar standard. A striker must be ready when the bowler is, and an incoming batter must be ready within two minutes of a wicket falling in Tests and ODIs, or 90 seconds in T20Is. Since October 2026 a batter who delays play gets a warning, then a final warning, and from the third offence in an innings the fielding side is awarded five penalty runs.",
      },
      { type: "h2", text: "The code of conduct" },
      {
        type: "p",
        text: "Behaviour in internationals is governed by the ICC Code of Conduct for Players and Player Support Personnel. Offences are graded from Level 1, the least serious (excessive appealing is one example), to Level 4, the most serious. A report can be lodged by the match umpires, by the chief executive of either board or by the ICC. Level 1 to 3 cases are heard by the match referee, and Level 4 cases by an independent judicial commissioner.",
      },
      {
        type: "p",
        text: "Sanctions run from a warning or a fine, set as a percentage of the match fee, up to suspension, and each one adds demerit points that stay on the player's record for 24 months. Four or more demerit points in that period convert into suspension points, a Test counting as two and an ODI or T20I as one, so the first threshold means a ban from one Test or two white-ball internationals, applied to the matches the player is next likely to play.",
      },
      { type: "h3", text: "Signals worth knowing" },
      {
        type: "table",
        head: ["Signal", "Meaning"],
        rows: [
          ["Index finger raised above the head", "Out"],
          ["One arm held out horizontally", "No-ball"],
          ["Both arms held out horizontally", "Wide"],
          ["Arm waved side to side, finishing across the chest", "Four"],
          ["Both arms raised above the head", "Six"],
          ["Open hand raised above the head", "Bye"],
          ["Hand touching a raised knee", "Leg bye"],
          ["Wrists crossed and re-crossed below the waist", "Dead ball"],
          ["One arm raised and circled after the no-ball signal", "Free hit (ODIs and T20Is)"],
          ["Hands drawing the shape of a TV screen", "Decision referred to the third umpire"],
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "the-ashes-explained",
    reviewed: "24 October 2026",
    title: "The Ashes Explained: The Urn, the Replica and How the Series Works",
    category: "Competitions & rankings",
    description:
      "Where the Ashes came from, from the 1882 mock obituary and Ivo Bligh's tour to the urn at Lord's and its crystal replica, and how drawn series, scheduling and the women's multi-format points system work.",
    related: ["world-test-championship-points-system", "cricket-formats-explained-test-odi-t20", "follow-on-and-declarations-explained"],
    blocks: [
      {
        type: "p",
        text: "The Ashes is the Test series between England and Australia. The two countries played the first Test match, at Melbourne in March 1877, and the Ashes name and the small urn that represents it both come from a newspaper joke five years later. This guide sets out that history, separates what is known from what is not, and explains how the series is decided for men and women. The account of the urn follows MCC, which owns it.",
      },
      { type: "h2", text: "The mock obituary" },
      {
        type: "p",
        text: "On 29 August 1882, at The Oval, Australia beat England by seven runs, England's first defeat by Australia on home soil. Set 85 to win, England were bowled out for 77, with the fast bowler Fred Spofforth taking 14 wickets in the match. Days later the Sporting Times printed a mock obituary for English cricket, which had died at The Oval, ending with the line that \"the body will be cremated and the ashes taken to Australia\". MCC notes that the joke also played on the debate then going on about legalising cremation in Britain.",
      },
      { type: "h2", text: "Ivo Bligh's tour and the urn" },
      {
        type: "p",
        text: "England toured Australia that winter, 1882-83, under Ivo Bligh, who declared he would recover the Ashes; Australia's captain Billy Murdoch said he would defend them. Before the Tests began, Bligh and the amateurs in his side visited Rupertswood, the estate of Sir William Clarke near Sunbury in Victoria, and on Christmas Eve 1882 they won a scratch match against a team of estate workers. In the spirit of the joke, Lady Janet Clarke decided Bligh had earned the Ashes: a bail from the match was burned, the ashes were put in a small terracotta urn, and the urn was given to him.",
      },
      {
        type: "p",
        text: "Some of the story is uncertain, and MCC says so. Nobody knows where the urn itself came from; it may have been a perfume bottle or cosmetic jar picked up on the spot. Bligh's team went on to win the scheduled three-match series 2-1, and the urn may have been refilled or presented again after the third Test, when Bligh was also given a velvet bag to keep it in and a printed verse was pasted onto it. A fourth match was then arranged, which Australia won.",
      },
      {
        type: "p",
        text: "At Rupertswood Bligh also met Florence Morphy, the Clarke family's governess, whom he later married. The couple kept the urn until Bligh's death in 1927, by which time he was the Earl of Darnley, and Florence then presented it to MCC. The phrase \"the Ashes\" itself was largely forgotten for about 20 years after the 1882-83 tour, until Pelham Warner's account of his side's 1903-04 tour of Australia revived it.",
      },
      { type: "h2", text: "Why the urn stays at Lord's" },
      {
        type: "p",
        text: "The urn is 10.5 centimetres tall, weighs about 125 grams and is more than 140 years old. It is on permanent display in the MCC Museum at Lord's, whichever side holds the Ashes. MCC regards it as the personal memento it was to the Darnleys and states plainly that it is not, and never has been, a trophy. It has travelled to Australia only three times: for less than a week during the 1988 Bicentennial, on a tour of six cities during the 2006-07 series, and for an exhibition at State Library Victoria in Melbourne over 2019-20.",
      },
      { type: "h3", text: "The trophy the winners lift" },
      {
        type: "p",
        text: "So that the winning side has something to hold, MCC commissioned a larger replica of the urn in Waterford Crystal. It was first presented to Australia after they won the 1998-99 series, and it has been presented to the winning captain at the end of every series since.",
      },
      { type: "h2", text: "How the series works" },
      {
        type: "ul",
        items: [
          "**Holding and retaining.** The Ashes belong to whichever side won the last series. A drawn series leaves them with the holders, so the challengers must win outright to take them back. That is why the holders are said to have **retained** the Ashes as soon as the challengers can no longer win the series, even with Tests still to play.",
          "**Length.** Modern series are five Tests. There have been four-Test and six-Test series in the past.",
          "**Hosting.** Series alternate between England and Australia, roughly every two years, although the gap has varied.",
          "**Other tables.** Since 2019, Ashes Tests have also counted towards the [World Test Championship](/guides/world-test-championship-points-system). Neither the WTC table nor the ICC rankings has any bearing on who holds the Ashes.",
        ],
      },
      {
        type: "callout",
        text: "Dated note: the most recent men's series before this guide's review date, played in Australia in 2025-26, was won 4-1 by Australia, who therefore hold the Ashes until the next series is decided.",
      },
      { type: "h2", text: "The women's Ashes" },
      {
        type: "p",
        text: "England and Australia played the first women's Test series, in Australia, in 1934-35. It had no trophy until 1998, when Norma Izard, then president of the Women's Cricket Association, organised a ceremony at Lord's in which a miniature bat signed by both teams and a copy of the association's constitution were burned. The ashes were sealed in a hollow wooden ball carved from a 300-year-old yew.",
      },
      {
        type: "p",
        text: "Since 2013 the women's Ashes has been decided on points across all three formats. A typical series is one Test, three ODIs and three T20Is, worth 16 points in all:",
      },
      {
        type: "table",
        head: ["Result", "Points"],
        rows: [
          ["Test win", "4"],
          ["Test draw", "2 each"],
          ["ODI or T20I win", "2"],
          ["ODI or T20I tie or no result", "1 each"],
        ],
      },
      {
        type: "p",
        text: "A Test win was originally worth six points; it is now four. As in the men's series, the holders keep the trophy if the points finish level. That happened in 2023, when the series in England ended 8-8 and Australia retained the Ashes even though England had won four of the seven matches to Australia's three.",
      },
      {
        type: "p",
        text: "For live scores when a series is on, see the [Test cricket page](/test) and the [women's cricket page](/womens-cricket).",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "cricket-balls-red-white-pink-explained",
    reviewed: "24 October 2026",
    title: "Red, White and Pink Cricket Balls Explained",
    category: "Cricket basics",
    description:
      "Why Tests use red balls, limited-overs cricket white and day-night Tests pink, how Kookaburra, Dukes and SG balls differ and where each is used, how a ball ages, the saliva ban, when the ball is changed, and the current ODI new-ball rule.",
    related: ["bowling-types-swing-seam-spin-explained", "pitch-and-conditions-explained", "cricket-formats-explained-test-odi-t20"],
    blocks: [
      {
        type: "p",
        text: "The ball affects a cricket match more than any other piece of equipment. Its colour is chosen for visibility, its make differs from country to country, and its condition changes over the course of an innings. This guide explains those differences and the rules on when and how a ball may be changed, using the 2026 edition of the Laws and the ICC playing conditions current at the date of review.",
      },
      { type: "h2", text: "Size and weight" },
      {
        type: "p",
        text: "The Laws define three sizes. A **Size 1** ball, the one used in men's cricket, weighs 156 to 163 grams (5.5 to 5.75 ounces) when new and measures 22.4 to 22.9 centimetres round. A **Size 2** ball, used in women's international cricket, weighs 142 to 149 grams and measures 21.5 to 22 centimetres. A **Size 3** ball, for junior cricket, weighs 133 to 140 grams and measures 20.5 to 21 centimetres. Each competition's governing body decides which size it uses. The size labels replaced the old men's, women's and junior descriptions in the 2026 edition.",
      },
      { type: "h2", text: "Why three colours" },
      {
        type: "kv",
        items: [
          {
            k: "Red",
            v: "The traditional ball, used in Tests and most first-class cricket. It stands out against white clothing and a white sightscreen in daylight, but is hard to pick out under floodlights once the sky darkens.",
          },
          {
            k: "White",
            v: "Used in ODIs and T20Is. White balls arrived with floodlit one-day cricket in Australia in the late 1970s, when Kookaburra made them for World Series Cricket. A white ball shows up well under lights and against the coloured clothing worn in limited-overs cricket, but it would not stand out against white Test clothing, and it does not hold its condition as long as a Test ball needs to.",
          },
          {
            k: "Pink",
            v: "Developed for day-night Tests, where players still wear white and a ball has to last 80 overs before a new one is due. The first day-night Test, at Adelaide in November 2015, used a pink Kookaburra ball. Since October 2026 the ICC has also allowed two teams to agree, before a Test starts, to use a pink ball in daytime, a trial intended to reduce play lost to bad light. The choice cannot be changed once the match is under way.",
          },
        ],
      },
      { type: "h2", text: "Kookaburra, Dukes and SG" },
      {
        type: "p",
        text: "Three manufacturers make the balls used in Test cricket. The home board supplies balls of an approved standard and must tell the visiting board which brand it will use at least 30 days before the series, so touring sides regularly face a different ball from the one they use at home. The usual pattern is:",
      },
      {
        type: "kv",
        items: [
          {
            k: "Kookaburra (Australia)",
            v: "Used for Tests in most Test-playing countries, including Australia, New Zealand and South Africa, and the white ball generally used in ODIs and T20Is. Its seam is lower and flatter than the other two, and it is generally regarded as swinging mainly while it is new.",
          },
          {
            k: "Dukes (England)",
            v: "Used for Tests in England and the West Indies. Hand-stitched with a pronounced seam that stays raised for longer, and generally regarded as swinging for longer than a Kookaburra.",
          },
          {
            k: "SG (India)",
            v: "Used for Tests in India. Hand-stitched with a thicker seam that holds its shape on dry, abrasive pitches, which helps spinners grip the ball.",
          },
        ],
      },
      {
        type: "p",
        text: "All three makers also produce pink balls for day-night Tests. In internationals the fielding captain chooses each new match ball from a box of new ones, with the fourth umpire supervising.",
      },
      { type: "h2", text: "How a ball ages" },
      {
        type: "ul",
        items: [
          "**Shine.** Fielders polish one side on their clothing so it stays smooth while the other side roughens through use. With the seam held upright, the difference between the two sides makes the ball swing in the air. This conventional swing is strongest while the ball is new.",
          "**Seam.** A proud seam grips the pitch and makes the ball deviate off the surface. As the stitching flattens and the ball softens, seam movement declines and the ball comes off the bat more slowly.",
          "**Reverse swing.** Once one side is very rough and the other has been kept smooth and dry, a ball bowled fast can swing towards the shiny side, the opposite of conventional swing, and often late. It needs an old, dry ball, so it tends to appear later in an innings, and abrasive pitches and dry outfields speed up the wear that produces it.",
        ],
      },
      {
        type: "p",
        text: "The [bowling guide](/guides/bowling-types-swing-seam-spin-explained) explains how bowlers use each of these, and the [pitch and conditions guide](/guides/pitch-and-conditions-explained) covers how the surface and the weather change what the ball does.",
      },
      { type: "h2", text: "The saliva ban" },
      {
        type: "p",
        text: "Bowlers traditionally used saliva as well as sweat to polish the ball. Saliva was banned as an interim measure when international cricket resumed during the Covid-19 pandemic in 2020, and the ICC made the ban permanent from 1 October 2022, the date the matching change to the Laws took effect. Under the Laws a fielder may polish the ball on their clothing provided no artificial substance is used and the only natural substance used is sweat.",
      },
      {
        type: "p",
        text: "In internationals, if the umpires believe saliva has been applied, the batting side is awarded five penalty runs and the ball is replaced, unless the umpires believe the fielding side applied it deliberately to get the ball changed, in which case it is not replaced. Competitions outside international cricket can set their own playing conditions on this.",
      },
      { type: "h2", text: "When the ball is changed" },
      {
        type: "ul",
        items: [
          "**New ball.** A new ball is used at the start of each innings. In Tests and other matches of more than one day, the fielding captain may take another new ball once 80 overs have been bowled with the old one.",
          "**Lost or unfit ball.** If the ball is lost, or the umpires agree it has become unfit through normal use, they replace it with one that has had comparable wear, not with a new one. In Tests, a ball that has to be replaced after 110 overs is replaced with a new ball.",
          "**Unfair change of condition.** If the umpires decide a player has changed the condition of the ball, for example with an artificial substance, the opposing side is awarded five penalty runs and may have the ball replaced. In internationals, when the fielding side is responsible, the batter chooses the replacement from a selection of balls of different ages, including a new one.",
          "**Inspections.** Umpires inspect the ball frequently and at irregular intervals, and take charge of it at every fall of a wicket and every interval.",
        ],
      },
      { type: "h2", text: "The ODI new-ball rule" },
      {
        type: "p",
        text: "One-day internationals have changed their ball rules more than once:",
      },
      {
        type: "ul",
        items: [
          "**Before October 2011**, each innings began with a single new ball.",
          "**From 1 October 2011**, each innings used two new balls, one from each end, so neither ball was more than 25 overs old by the end of a full innings.",
          "**Since July 2025 in men's ODIs**, two new balls are used, one from each end, for overs 1 to 34. At the end of the 34th over the fielding side chooses one of the two to use at both ends for the rest of the innings, and the other joins the stock of replacement balls. If a match is cut to 25 overs a side or fewer before it starts, each side uses a single new ball.",
        ],
      },
      {
        type: "p",
        text: "The ICC said the 2025 change was meant to readdress the balance between bat and ball, and its cricket committee wanted an older ball in the last 16 overs to bring reverse swing back into play. Women's ODIs still use two new balls, one from each end, for the whole innings, and every T20I innings starts with one new ball. For how the formats differ in other ways, see [Test, ODI and T20 formats explained](/guides/cricket-formats-explained-test-odi-t20).",
      },
    ],
  },
];
