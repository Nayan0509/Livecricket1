// Guides: cricket rules and calculations. Evergreen explainers checked
// against the ICC playing conditions and MCC Laws current for the 2025-26
// season. Where competitions differ, the guide says so.

module.exports = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "dls-method-explained",
    title: "The DLS Method Explained: How Rain-Affected Targets Are Set",
    category: "Rules & calculations",
    description:
      "How the Duckworth-Lewis-Stern method works: the idea of resources, why wickets matter as much as overs, how a revised target is calculated, what the par score means, and the minimum overs needed for a result.",
    related: ["net-run-rate-explained", "cricket-formats-explained-test-odi-t20", "how-to-read-a-cricket-scorecard"],
    blocks: [
      {
        type: "p",
        text: "When rain interrupts a limited-overs match, the two sides rarely end up with the same number of overs. The Duckworth-Lewis-Stern method, universally shortened to DLS, is the way the target is adjusted so that the side batting second faces a fair equivalent of what the first side achieved. It has a reputation for being impenetrable. The underlying idea is simple, and this guide explains it without the mathematics.",
      },
      { type: "h2", text: "The core idea: resources" },
      {
        type: "p",
        text: "A batting side has two resources with which to score runs: overs remaining and wickets in hand. Both matter. Ten overs with all ten wickets standing is worth far more than ten overs with one wicket left, because the side with wickets can attack without fear. DLS turns every combination of overs left and wickets lost into a single percentage of the total resources a side has at the start of a full innings, which is defined as 100%. A side that has faced 20 of its 50 overs and lost two wickets has used only some of its resources, perhaps around 30%, because it still has plenty of overs and eight wickets.",
      },
      {
        type: "p",
        text: "The percentages come from a model of how teams actually score, built and periodically recalibrated from thousands of real matches. That is what Frank Duckworth and Tony Lewis originally created in the 1990s and what Steven Stern has maintained since 2014, when the method took his name as well. The professional edition used at international level runs as software; the published tables are a simplified version for lower levels.",
      },
      { type: "h2", text: "When the second innings is shortened" },
      {
        type: "p",
        text: "This is the common case. Team 1 completes its innings; rain then cuts Team 2's innings short, either before it starts or partway through. Team 2 has fewer resources than Team 1 had, so its target is scaled down in proportion: **target = Team 1's score × (Team 2's resources ÷ Team 1's resources)**, with the result rounded down and one added to make it a winning target rather than a tie. If a side loses wickets before the interruption, its remaining resources are lower than they would have been with wickets in hand, so a side that has collapsed gains less from a rain break than one that has batted well.",
      },
      {
        type: "callout",
        text: "Illustrative example. Team 1 scores 250 from a full 50 overs (100% of resources). Team 2 is 90 for 2 after 20 overs when rain takes away 15 overs, leaving it 15 more to bat instead of 30. Suppose the tables say that at the stoppage Team 2 had 60% of its resources left with 30 overs and 8 wickets, and will have 40% left with 15 overs and 8 wickets. It has lost 20% of its resources, so it plays the match with 80% of Team 1's resources. Its target becomes 250 × 0.80 = 200, plus one: 201 from 35 overs. The percentages here are round numbers chosen to show the mechanism; the real tables are more granular.",
      },
      { type: "h2", text: "When the first innings is shortened" },
      {
        type: "p",
        text: "If rain cuts Team 1's innings short, Team 1 has been denied resources it was entitled to, and Team 2 may end up with more resources than Team 1 had. The target is then scaled **up**. Because runs cannot simply be multiplied when the side batting second has more resources, the method adds an allowance based on an average score for the format rather than scaling Team 1's actual total. This is why a side whose innings is curtailed can end up defending a target higher than the score it actually made, which surprises spectators but is fair: Team 1 was batting to a 50-over plan when it lost its last overs.",
      },
      { type: "h2", text: "The par score" },
      {
        type: "p",
        text: "During a chase, broadcasters show a DLS **par score**: the score Team 2 would need to be on, with its current number of wickets lost, to be level with Team 1 if the match were abandoned at that moment. A side ahead of par would win if no more play were possible; a side behind it would lose. The par score rises with every ball and jumps when a wicket falls, because losing a wicket removes resources. If a match is called off, the result is decided by comparing Team 2's score with par: level is a tie, and in most competitions a tie stands as a tie rather than going to a Super Over when DLS has been applied.",
      },
      { type: "h2", text: "Minimum overs for a result" },
      {
        type: "p",
        text: "DLS can only produce a result if both sides have faced a minimum number of overs: **20 per side in an ODI** and **5 per side in a T20**, unless the side batting second has been bowled out or has already passed its target. If the minimum cannot be reached the match is a no-result and, in a tournament, the points are shared. Ground staff and umpires therefore work backwards from the scheduled close to decide how late play can restart.",
      },
      { type: "h2", text: "Common misunderstandings" },
      {
        type: "ul",
        items: [
          "**It is not just proportional to overs.** Halving the overs does not halve the target, because wickets in hand are worth a great deal and because a full-length innings involves a cautious start that a shortened one does not need.",
          "**The chasing side is not always favoured.** A side that has lost wickets cheaply before a break can find its target barely reduced.",
          "**Bowlers' over limits change too.** In a shortened innings each bowler's maximum is recalculated as one fifth of the new total, so a 35-over ODI innings allows seven overs per bowler.",
          "**Net run rate uses the revised figures.** In a DLS-affected match the side batting second is credited with the revised target minus one over the revised overs when NRR is calculated. See the [net run rate guide](/guides/net-run-rate-explained).",
        ],
      },
      {
        type: "p",
        text: "On a live scorecard a result decided this way is labelled **(DLS method)**, and the revised target and overs are usually shown beneath the result line. If you are following a rain-hit match on this site, the par score is the number to watch.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "net-run-rate-explained",
    title: "Net Run Rate Explained, With a Worked Example",
    category: "Rules & calculations",
    description:
      "How net run rate is calculated in cricket tournaments, why being bowled out counts as facing the full quota of overs, how DLS matches and no-results are handled, and a step-by-step worked example.",
    related: ["dls-method-explained", "how-to-read-a-cricket-scorecard", "how-the-ipl-works"],
    blocks: [
      {
        type: "p",
        text: "Net run rate, or NRR, is the tie-breaker used in almost every limited-overs league and tournament group when sides finish level on points. It is a measure of how much faster a team has scored than it has conceded across all its matches. The formula is short, but two details in how it is applied catch people out every tournament.",
      },
      { type: "h2", text: "The formula" },
      {
        type: "callout",
        text: "Net run rate = (total runs scored ÷ total overs faced) − (total runs conceded ÷ total overs bowled), calculated across every match the team has played in the competition.",
      },
      {
        type: "p",
        text: "Both halves are run rates, in runs per over. A positive NRR means a side has scored faster than its opponents scored against it; a negative NRR means the opposite. The totals are cumulative for the tournament, not an average of per-match figures, so a heavy defeat in one game can drag a side's NRR down for the rest of the group stage.",
      },
      { type: "h2", text: "Detail one: being bowled out" },
      {
        type: "p",
        text: "If a side is dismissed before its overs run out, it is treated as having faced its **full quota** of overs. A team bowled out for 150 in 35 overs of a 50-over match is recorded as scoring 150 from 50 overs, a run rate of 3.00, not 4.29. The same applies to the bowling side: the runs they conceded are divided by the full 50 overs. This rule prevents a side from being rewarded for a fast collapse and is the single most common cause of confusion when NRR is being calculated at the end of a group.",
      },
      { type: "h2", text: "Detail two: overs and balls" },
      {
        type: "p",
        text: "Overs are counted in balls, not as decimals. An innings of 47.3 overs is 47 overs and three balls, which is 47.5 overs for calculation purposes (47 plus 3⁄6). Forgetting this and treating 47.3 as a decimal introduces small errors that can matter when two sides are separated by a few thousandths.",
      },
      { type: "h2", text: "Rain, DLS and no-results" },
      {
        type: "ul",
        items: [
          "If a match is decided by the [DLS method](/guides/dls-method-explained), the side batting second is credited with a score of **one run fewer than its revised target** from its revised overs, and the side batting first is credited with the runs it actually made from the overs it actually faced.",
          "If the match is a **no-result**, it is excluded from both sides' NRR entirely; only the shared points count.",
          "If the chasing side wins, it is credited with the runs it actually scored from the overs it actually took, which is why chasing sides try to finish quickly when a group is tight.",
        ],
      },
      { type: "h2", text: "Worked example" },
      {
        type: "p",
        text: "Suppose a team plays three 50-over group matches with these results (the numbers are invented for the example):",
      },
      {
        type: "table",
        head: ["Match", "Runs scored", "Overs faced", "Runs conceded", "Overs bowled"],
        rows: [
          ["1", "280/6", "50", "245/9", "50"],
          ["2 (bowled out)", "180 all out", "41.3 (counts as 50)", "184/3", "38.2"],
          ["3 (won chasing)", "223/4", "44.4", "222/8", "50"],
        ],
      },
      {
        type: "ol",
        items: [
          "Total runs scored: 280 + 180 + 223 = **683**.",
          "Total overs faced: 50 + 50 (bowled out, so full quota) + 44.4 (= 44.667) = **144.667**.",
          "Runs scored per over: 683 ÷ 144.667 = **4.721**.",
          "Total runs conceded: 245 + 184 + 222 = **651**.",
          "Total overs bowled: 50 + 38.2 (= 38.333) + 50 = **138.333**.",
          "Runs conceded per over: 651 ÷ 138.333 = **4.706**.",
          "Net run rate: 4.721 − 4.706 = **+0.015**.",
        ],
      },
      {
        type: "p",
        text: "Notice how the bowled-out rule works against this side in match 2: its 180 runs are spread over 50 overs rather than the 41.3 it actually faced, cutting its scoring rate for that game from 4.34 to 3.60. Notice also that the opponents in match 2 chased 184 in 38.2 overs, and those 38.2 overs are what count against our side, not 50, because the chase finished early.",
      },
      { type: "h2", text: "Why teams talk about it before the last group game" },
      {
        type: "p",
        text: "Because NRR is cumulative, a team going into its final group match usually knows exactly what margin it needs. A side batting first may need to win by a certain number of runs; a side chasing may need to reach the target within a certain number of overs. Those targets are simple to calculate from the formula above, and commentators do so live. NRR is used in the IPL, the ICC World Cups, the Champions Trophy, the Asia Cup and nearly every franchise league; the [IPL guide](/guides/how-the-ipl-works) explains where it sits in the playoff qualification rules.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "drs-explained",
    title: "DRS Explained: How the Decision Review System Works",
    category: "Rules & calculations",
    description:
      "How player and umpire reviews work in cricket: how many reviews each side gets, the 15-second rule, what ball-tracking, UltraEdge and Hot Spot show, what 'umpire's call' means and why a review is not lost on it.",
    related: ["ways-of-getting-out-in-cricket", "cricket-glossary", "how-to-read-a-cricket-scorecard"],
    blocks: [
      {
        type: "p",
        text: "The Decision Review System lets players challenge an on-field umpire's decision and lets umpires check their own calls with television replays and tracking technology. It was introduced in Tests in 2008 and 2009 and is now used in almost all international cricket and the major franchise leagues. This guide explains who can review what, how many reviews are available and how the technology produces its verdicts.",
      },
      { type: "h2", text: "Player reviews" },
      {
        type: "p",
        text: "Either the batter given out or the fielding captain may challenge an umpire's decision on a dismissal by making a T sign with the arms within **15 seconds** of the decision. Each side has a fixed number of **unsuccessful** reviews per innings: **three in a Test innings** and **two in an ODI or T20I innings** under current ICC playing conditions (the T20I allowance rose from one to two in 2022). A successful review, one that overturns the decision, does not cost the side anything. Reviews are per innings, so a Test side gets a fresh three when the opposition bats again.",
      },
      {
        type: "p",
        text: "Players may review dismissals only: caught, LBW, bowled, stumped, run out and so on. They cannot review a wide or no-ball call on its own, though in some franchise competitions, including the IPL since 2023, sides may challenge wide and no-ball decisions using the same review allowance.",
      },
      { type: "h2", text: "Umpire reviews" },
      {
        type: "p",
        text: "The on-field umpires may refer some decisions to the TV umpire themselves without using a team's reviews: run-outs, stumpings, whether a catch was taken cleanly, whether a ball reached the boundary, and whether a delivery was a no-ball. Since 2020 the TV umpire also checks the front foot on **every delivery** in international cricket and calls no-balls directly, and since 2023 the on-field umpire's \"soft signal\" on catches has been abolished, so the TV umpire decides catches on the evidence alone.",
      },
      { type: "h2", text: "The technology" },
      {
        type: "ul",
        items: [
          "**Ball-tracking** (Hawk-Eye or a similar system) uses multiple high-speed cameras to record the ball's path and projects where it would have gone had it not hit the batter. It is used for LBW.",
          "**UltraEdge** or **Snickometer** synchronises a stump microphone's audio with slow-motion video. A spike in sound as the ball passes the bat indicates contact; its absence indicates none. It is the main tool for caught-behind and for the \"did it hit bat first\" question in LBW.",
          "**Hot Spot**, an infrared camera that shows heat from friction where the ball struck, is used in some countries as a second check on edges.",
          "**Slow-motion and ultra-motion replays** cover run-outs, stumpings, catches and boundaries.",
        ],
      },
      { type: "h2", text: "How an LBW review is decided" },
      {
        type: "p",
        text: "The TV umpire works through the [LBW conditions](/guides/ways-of-getting-out-in-cricket) in order. First, was it a legal delivery? Second, did the ball hit the bat before the pad (UltraEdge)? Third, where did it pitch: in line, or outside off, or outside leg stump (outside leg is not out)? Fourth, where did it strike the batter: in line with the stumps, or outside off with a shot offered (not out) or with no shot offered (can be out)? Fifth, ball-tracking: would it have hit the stumps?",
      },
      { type: "h2", text: "Umpire's call" },
      {
        type: "p",
        text: "Ball-tracking is precise but not perfect, and the umpire on the field had a real-time view the cameras do not. So for the questions of where the ball pitched, where it struck the batter and whether it would have hit the stumps, the system builds in a margin. If the projection shows less than **half the ball** within the relevant zone, or the centre of the ball outside a defined area of the stumps, the technology is not considered conclusive and the **on-field decision stands**, marked as \"umpire's call\". This means the same ball-tracking picture can be out if the umpire originally gave it out and not out if they did not.",
      },
      {
        type: "p",
        text: "A review that ends in umpire's call is **not** counted as unsuccessful: since 2017 the reviewing side keeps its review. That change removed the harshest feature of the early system, when a side could lose a review on a decision the technology said was too close to call.",
      },
      { type: "h2", text: "Things to know when watching" },
      {
        type: "ul",
        items: [
          "A batter cannot be given out on review for something that was not appealed for, and a review cannot introduce a new mode of dismissal that the umpire did not consider unless the evidence clearly shows it.",
          "If the TV umpire finds a no-ball during a review of a dismissal, the batter is not out and the no-ball is called, regardless of what the review was for.",
          "Reviews do not carry over from one innings to the next, and unused reviews are not banked.",
          "The final decision is displayed on the big screen as OUT or NOT OUT, and the on-field umpire then signals it.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "powerplay-and-fielding-restrictions-explained",
    title: "Powerplays and Fielding Restrictions in ODI and T20 Cricket",
    category: "Rules & calculations",
    description:
      "The fielding restrictions that shape limited-overs cricket: the three ODI powerplay phases, the six-over T20 powerplay, the 30-yard circle, the leg-side law, what happens in rain-shortened innings and the slow over-rate fielding penalty.",
    related: ["cricket-formats-explained-test-odi-t20", "cricket-fielding-positions-explained", "dls-method-explained"],
    blocks: [
      {
        type: "p",
        text: "Limited-overs cricket restricts how many fielders may stand far from the bat during defined parts of the innings. These powerplays are why the opening overs of an ODI or T20 are so lively, why the middle overs slow down and why captains save their best bowlers for particular moments. This guide explains the current rules and how they are applied when overs are lost to weather.",
      },
      { type: "h2", text: "The 30-yard circle" },
      {
        type: "p",
        text: "Two semicircles of 30-yard (27.4 m) radius are drawn from the centre of each set of stumps and joined by straight lines to form an oval around the pitch, marked by painted dots or a line. Fielding restrictions are expressed as the maximum number of fielders allowed **outside** this circle at the moment the ball is bowled. A breach is a no-ball, called by either umpire, and in most competitions results in a free hit.",
      },
      { type: "h2", text: "ODI: three phases" },
      {
        type: "table",
        head: ["Phase", "Overs", "Max fielders outside the circle"],
        rows: [
          ["Powerplay 1", "1 to 10", "2"],
          ["Powerplay 2", "11 to 40", "4"],
          ["Powerplay 3", "41 to 50", "5"],
        ],
      },
      {
        type: "p",
        text: "In the first ten overs only two fielders may be outside the circle, so a batting side can hit over the infield with less risk of a boundary catch. In the long middle phase four may be out, which lets the captain post sweepers on both sides and forces batters to rotate the strike with singles. In the last ten, five may be out, but with only five inside the circle the gaps for singles open up again, and this is where teams aim for their fastest scoring. Earlier versions of the ODI rules included a batting powerplay that the batting side chose when to take; that was abolished in 2015.",
      },
      { type: "h2", text: "T20: one powerplay" },
      {
        type: "p",
        text: "Overs 1 to 6 are the powerplay, with a maximum of **two** fielders outside the circle. From over 7 to 20 a maximum of **five** may be out. Some competitions add a variation: the Big Bash League's **Power Surge**, for example, shortens the opening powerplay to four overs and gives the batting side a two-over block, available from the 11th over, in which the two-fielder restriction returns. The ICC's international rules do not include a Power Surge.",
      },
      { type: "h2", text: "Restrictions that apply in every format" },
      {
        type: "ul",
        items: [
          "No more than **two fielders behind square on the leg side** at the moment of delivery. A third makes the ball a no-ball. This comes from the Laws and applies in Tests too.",
          "No fielder may stand **on or over the pitch** until the ball has left the bowler's hand.",
          "Fielders may not move significantly, or distract the batter, until the ball is delivered; doing so is a dead ball and in serious cases a penalty.",
        ],
      },
      { type: "h2", text: "When overs are lost to rain" },
      {
        type: "p",
        text: "If an innings is shortened before it begins, the powerplay overs are scaled down in proportion. In ODIs the ICC publishes a table: a 40-over innings, for example, has an eight-over first powerplay, a 24-over middle phase and an eight-over final phase. In T20s the powerplay is also reduced, to five overs for a 15-over innings, down to two overs for a five-over innings. Bowlers' maximum overs are recalculated as one fifth of the new total. If an innings is interrupted after it has started, the remaining powerplay overs are recalculated from the new total in a similar way.",
      },
      { type: "h2", text: "The slow over-rate fielding penalty" },
      {
        type: "p",
        text: "Since 2022 the ICC has enforced an in-match penalty for slow bowling in limited-overs internationals. Each innings has a scheduled finishing time, and if the fielding side has not begun the final over by that time, one fewer fielder is allowed outside the circle for the rest of the innings: four instead of five in a T20I or ODI final phase. The IPL and other leagues apply the same rule. It has made the closing overs noticeably faster and occasionally decided close finishes, since a side forced to bring a boundary fielder in with two overs left has fewer options against the batters.",
      },
      { type: "h2", text: "How captains and batters use the phases" },
      {
        type: "p",
        text: "Batting sides usually attack in the opening powerplay while the field is up and the ball is new and hard, consolidate through the middle overs with singles and twos when boundaries are harder to find, then attack again at the death. Bowling captains often hold back their most economical bowler for the middle overs and their best yorker bowler for the end. Understanding which phase a match is in tells you what both sides are trying to do, which is what makes a live scorecard readable without the pictures.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "super-over-and-tie-breakers-explained",
    title: "Super Overs and Tie-Breakers: How Tied Cricket Matches Are Decided",
    category: "Rules & calculations",
    description:
      "How a Super Over works, what happens if it is tied too, when a tie stands as a result, how the boundary-count rule was abolished, and how group standings are separated when points are level.",
    related: ["net-run-rate-explained", "dls-method-explained", "cricket-formats-explained-test-odi-t20"],
    blocks: [
      {
        type: "p",
        text: "A tie in cricket is rare: two sides finishing an entire limited-overs match on exactly the same score. When it happens in a match that needs a winner, the Super Over decides it. This guide explains how the Super Over is played, what has changed since the 2019 World Cup final, and how ties in the standings, rather than in a match, are resolved.",
      },
      { type: "h2", text: "When a tie is a tie" },
      {
        type: "p",
        text: "In a Test match a tie is a full result in its own right, and it has happened only twice in Test history, in 1960 and 1986. In group-stage limited-overs matches many competitions simply record a tie and share the points, while others, including the IPL and the ICC World Cups, play a Super Over in every match. Knockout matches always need a winner. The competition's playing conditions say which applies, and the scorecard result line will read either \"Match tied\" or name the Super Over winner.",
      },
      { type: "h2", text: "How a Super Over is played" },
      {
        type: "ol",
        items: [
          "The side that batted **second** in the match bats first in the Super Over.",
          "Each side nominates **three batters** and **one bowler**. The bowler may be anyone from the team, regardless of how many overs they bowled in the match.",
          "Each side faces **one over** of six legal deliveries. The innings ends early if the batting side loses **two wickets**.",
          "The fielding restrictions of the final phase of the match apply, so in a T20 five fielders may be outside the circle.",
          "The side with more runs in the Super Over wins. Wickets lost in the Super Over do not matter unless both sides are bowled out for the same score.",
        ],
      },
      {
        type: "p",
        text: "Runs scored in a Super Over count towards the match result but not towards any player's career statistics; a six in a Super Over is not added to a batter's tally for the tournament.",
      },
      { type: "h2", text: "If the Super Over is tied" },
      {
        type: "p",
        text: "Under ICC playing conditions since October 2019, a tied Super Over is followed by **another Super Over**, and so on until one side scores more. In each subsequent Super Over the side that batted second in the previous one bats first, a batter dismissed in an earlier Super Over may not bat again, and a bowler who bowled an earlier Super Over may not bowl again. The first double Super Over in international cricket came in a New Zealand v India T20I in January 2020.",
      },
      { type: "h2", text: "The boundary count, and why it was abolished" },
      {
        type: "p",
        text: "Before October 2019 a tied Super Over was settled by comparing the number of boundaries each side had hit in the match and Super Over combined. That rule decided the 2019 World Cup final at Lord's, where England and New Zealand tied both the match and the Super Over and England were awarded the trophy on boundaries. The rule was widely criticised for deciding a world final on a statistic unrelated to the result, and the ICC removed it weeks later in favour of repeated Super Overs.",
      },
      { type: "h2", text: "Ties in DLS-affected matches" },
      {
        type: "p",
        text: "If a match is decided by the [DLS method](/guides/dls-method-explained) and the chasing side finishes exactly on the par score, the match is a tie. Most competitions do not then play a Super Over, because there may be no time or conditions to do so, and the tie stands with points shared; knockout matches have separate provisions such as a reserve day or a bowl-out-free tiebreak based on group position.",
      },
      { type: "h2", text: "Ties in the standings" },
      {
        type: "p",
        text: "Sides level on points in a group or league are separated by a fixed sequence set out in the competition regulations. The usual order is: **most wins**, then **[net run rate](/guides/net-run-rate-explained)**, then **head-to-head result** between the tied sides, and finally a draw of lots or original seeding. The IPL, for instance, uses points, then wins, then NRR. In the World Test Championship, where percentage of points won is the primary measure, sides level on percentage are separated by series wins and then by runs per wicket ratio. When a competition's knockout stage needs a winner from a washed-out match with no reserve day, the higher-placed side in the group usually advances, which is another reason group position matters.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "follow-on-and-declarations-explained",
    title: "The Follow-On and Declarations in Test Cricket",
    category: "Rules & calculations",
    description:
      "How the follow-on works in Test and first-class cricket, the 200-run threshold and how it changes in shorter matches, why captains sometimes decline to enforce it, and how declarations are used to set up a result.",
    related: ["cricket-formats-explained-test-odi-t20", "world-test-championship-points-system", "pitch-and-conditions-explained"],
    blocks: [
      {
        type: "p",
        text: "Two decisions belong to timed cricket alone. The **follow-on** lets a side that has built a big first-innings lead make the opposition bat again straight away. A **declaration** lets a batting captain end their own innings early. Both are about time: in a match that can be drawn, runs are only useful if there are enough overs left to take twenty wickets.",
      },
      { type: "h2", text: "The follow-on rule" },
      {
        type: "p",
        text: "In a match scheduled for **five days**, if the side batting second finishes its first innings **200 or more runs** behind, the side batting first may require it to bat again immediately, instead of batting itself. This is enforcing the follow-on. The lead required falls with the length of the match: **150** in a match of three or four days, **100** in a two-day match and **75** in a one-day first-class match. If the first day of a match is lost entirely, the match is treated as one day shorter for this purpose, so a five-day Test that starts on day two needs only a 150-run lead.",
      },
      {
        type: "p",
        text: "The follow-on is an option, not an obligation. The captain of the fielding side chooses, and must tell the umpires and the opposing captain. If the deficit is less than the threshold, the side batting first must bat again in the normal order.",
      },
      { type: "h2", text: "Why enforce it" },
      {
        type: "p",
        text: "Enforcing the follow-on keeps the opposition under pressure while they are already struggling, keeps the pitch and the match moving in the fielding side's favour, and can produce an innings victory, in which the side batting first never needs to bat again. A side that has been dismissed cheaply once is often vulnerable to being dismissed cheaply again on the same pitch against the same bowlers.",
      },
      { type: "h2", text: "Why decline it" },
      {
        type: "p",
        text: "Captains increasingly decline to enforce the follow-on when there is plenty of time left. The reasons are practical. Bowlers who have just bowled a side out may be tired, and asking them to bowl another 100 overs immediately risks injury and a drop in quality. A pitch that is deteriorating can be used against the opposition at the end of the match, when it is hardest to bat, rather than in the middle of it. And there is the risk that a side following on bats well and leaves the side that enforced it chasing on a worn pitch in the fourth innings. India's win at Kolkata in 2001, after following on against Australia, is the most famous of the handful of times a side has followed on and won a Test, and it changed captains' attitudes for a generation.",
      },
      { type: "h2", text: "Declarations" },
      {
        type: "p",
        text: "A captain may declare an innings closed at any time the ball is dead, and may also **forfeit** an innings before it starts. The usual purpose is to leave enough time to bowl the opposition out: a side 400 ahead with a day and a half to play gains nothing from another 50 runs but loses the overs it takes to score them. Declarations are also used at the end of a day, so that a side's bowlers get a few overs at tired opening batters in poor light, and in rain-affected matches to manufacture a result from a game heading for a draw.",
      },
      { type: "h2", text: "The arithmetic of a declaration" },
      {
        type: "p",
        text: "A declaring captain weighs three things: how many runs the opposition would need, how many overs remain, and how many wickets the bowlers can realistically take in that time. Setting a target that is theoretically reachable at a high run rate can tempt the chasing side into risks, which is how declarations create results; setting one that is impossible invites a defensive draw. Weather forecasts and the number of overs likely to be lost to bad light are part of the calculation, as is the state of the pitch, which the [pitch and conditions guide](/guides/pitch-and-conditions-explained) explains.",
      },
      { type: "h2", text: "How it looks on the scorecard" },
      {
        type: "p",
        text: "A declared innings is shown with **dec** or **declared** after the total, for example 512/7 dec. When the follow-on has been enforced, the second and third innings of the match are by the same side, and the scorecard usually notes \"following on\" beside the innings heading. A side that wins after enforcing the follow-on and never bats again wins by **an innings and N runs**, where N is the difference between its first-innings total and the opposition's two innings combined.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "pitch-and-conditions-explained",
    title: "How Pitch and Conditions Change a Cricket Match",
    category: "Rules & calculations",
    description:
      "What a green, dry, cracked or flat pitch does to the ball, why the same surface changes over five days, how cloud, humidity, dew, heat and altitude alter play, and how all of it feeds into the decision at the toss.",
    related: ["bowling-types-swing-seam-spin-explained", "follow-on-and-declarations-explained", "cricket-formats-explained-test-odi-t20"],
    blocks: [
      {
        type: "p",
        text: "No other major sport is as dependent on the playing surface and the weather as cricket. The same two sides can produce a 600-run draw on one pitch and a two-day finish on another. This guide explains what commentators mean when they describe a pitch, how it evolves during a match and why captains agonise over the toss.",
      },
      { type: "h2", text: "Reading a pitch" },
      {
        type: "kv",
        items: [
          {
            k: "Green or grassy",
            v: "Live grass holds moisture and helps the seam grip, so the ball deviates off the surface. Favours seam bowlers, especially on the first morning. Typical of England and New Zealand early in the season.",
          },
          {
            k: "Hard and true",
            v: "Well-rolled, dry and firm. Consistent bounce and pace reward good batting and fast bowlers who hit the deck. Australian pitches such as Perth and Brisbane are the classic examples.",
          },
          {
            k: "Dry and dusty",
            v: "Little grass and a loose surface that scuffs up. Offers grip and turn to spinners from early in the match. Common across the subcontinent, particularly in matches prepared to suit home spinners.",
          },
          {
            k: "Cracked",
            v: "Dry pitches that open up in the heat. Balls landing on a crack can shoot low or rear up, making batting unpredictable late in a Test.",
          },
          {
            k: "Flat or road",
            v: "A batter's surface with little movement or turn and even bounce. Produces high scores and draws in Tests, and high-scoring limited-overs matches.",
          },
          {
            k: "Two-paced",
            v: "A surface where some balls come on quickly and others hold up, usually because it is drying unevenly or wearing. Difficult for timing, hence low totals.",
          },
        ],
      },
      { type: "h2", text: "How a pitch changes over five days" },
      {
        type: "p",
        text: "A Test pitch is usually at its best for batting on days two and three. On the first morning residual moisture helps the seamers and the batting side is cautious; as the sun dries the surface it flattens and quickens. From day three the surface begins to wear: footmarks appear outside the crease, the top dries and crumbles, cracks widen and the bounce becomes less predictable. Spinners get more turn from the rough, reverse swing appears as the outfield roughens the ball, and batting last becomes hardest. This progression is why a side batting first aims for a big total and why captains think so carefully about [the follow-on](/guides/follow-on-and-declarations-explained).",
      },
      { type: "h2", text: "Soil and preparation" },
      {
        type: "p",
        text: "The type of clay in a pitch and how it is prepared explain much of the difference between countries. Heavier clays that bind hard give pace and bounce; soils with less clay content stay softer and lower. In India, groundsmen often distinguish between red-soil pitches, which tend to offer more bounce and break up as the game goes on, and black-soil pitches, which hold together but are slower and lower. **Drop-in pitches**, grown in trays away from the stadium and lowered into place, are used at multi-sport venues such as the MCG and Perth Stadium and tend to be slower and flatter early in their life than traditional surfaces. Rolling, watering and the amount of grass left at cutting are the groundsman's main levers, within the limits set by the home board and the match referee.",
      },
      { type: "h2", text: "Weather and atmosphere" },
      {
        type: "ul",
        items: [
          "**Cloud and humidity** are associated with more swing, and heavy cloud also reduces light for batting. England's reputation for swing is a reputation for weather.",
          "**Heat** dries the pitch and the ball, bringing spin and reverse swing forward and tiring fielders and bowlers.",
          "**Dew** settles on the outfield in the evening in many parts of Asia, wetting the ball so it slides through spinners' fingers and skids onto the bat. It is the main reason captains chase in day-night limited-overs matches there, and why the toss is often described as decisive.",
          "**Altitude** at grounds such as Johannesburg thins the air so the ball travels further and swings less.",
          "**Wind** affects swing (a crosswind can help or kill it) and boundary sizes in practice, since a strong wind at one end turns a six into a catch.",
          "**Bad light** can stop play in Tests because a red ball is hard to see; pink balls in day-night Tests and white balls in limited-overs cricket were introduced partly to solve this.",
        ],
      },
      { type: "h2", text: "The toss" },
      {
        type: "p",
        text: "The captain who wins the toss chooses whether to bat or bowl, and the decision turns on everything above. Batting first is the default in Tests on a good pitch, because the surface will worsen. Bowling first is chosen when the pitch is green or damp or when the forecast is cloudy for the morning only. In limited-overs matches the calculation is different: teams often prefer to chase in day-night games because of dew and because knowing the target helps pace the innings, while in day games a side may bat first to post a total and use the scoreboard as pressure. The [DLS guide](/guides/dls-method-explained) explains how the weather that follows can change everything anyway.",
      },
      { type: "h2", text: "Why the ICC rates pitches" },
      {
        type: "p",
        text: "After every international match the referee rates the pitch and outfield on a scale from very good to unfit. Ratings of below average or worse earn demerit points for the venue, and accumulated demerits lead to suspensions from hosting internationals. The system exists to stop pitches being prepared that make a fair contest between bat and ball impossible in either direction, whether that is a surface that turns square from ball one or one on which nothing happens for five days.",
      },
    ],
  },
];
