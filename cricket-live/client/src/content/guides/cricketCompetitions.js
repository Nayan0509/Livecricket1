// Guides: competitions, rankings and statistics. Evergreen explainers of how
// the ICC rankings, the World Test Championship and the IPL are structured,
// and what the standard statistics measure. No current standings, records or
// squads: those go stale. Worked examples say they are examples. See
// guides/index.js for the shared shape.

module.exports = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "icc-rankings-explained",
    reviewed: "24 October 2026",
    title: "How the ICC Rankings Work: Player Ratings and Team Tables",
    category: "Competitions & rankings",
    description:
      "How the ICC calculates player ratings on its 0 to 1000 scale, why the quality of the opposition and the match result matter, how older matches fade out, and how the team rankings are built from results over a rolling window.",
    related: ["world-test-championship-points-system", "batting-average-strike-rate-economy-explained", "cricket-formats-explained-test-odi-t20"],
    blocks: [
      {
        type: "p",
        text: "The ICC publishes two separate kinds of ranking: **player rankings** for batters, bowlers and all-rounders, and **team rankings** for each format in men's and women's cricket. They use different methods. Player ratings are a weighted record of individual performances. Team ratings are built from match and series results. Both are widely quoted and both are often misread, mostly because people treat them as averages. They are not.",
      },
      { type: "h2", text: "Player ratings: the 0 to 1000 scale" },
      {
        type: "p",
        text: "Every player rating sits on a scale from 0 to 1000. There is a separate list for each discipline (batting, bowling, all-rounder) in each format (Test, ODI, T20I). A rating above 900 is exceptional and few players reach it. A rating in the 700s or 800s usually marks a player among the best in the world in that format at that moment. The number itself has no unit. It is not runs, wickets or an average, and two ratings can only be compared within the same list.",
      },
      {
        type: "p",
        text: "After each match, a player earns a performance score for that game, and their rating moves towards it. Because the rating is a weighted moving average of these match scores, one big innings lifts a rating but does not transform it. A long run of good scores does.",
      },
      { type: "h2", text: "What goes into a batter's match score" },
      {
        type: "ul",
        items: [
          "**Runs scored.** This is the starting point, but it is adjusted by everything below.",
          "**The quality of the bowling attack.** Runs made against highly rated bowlers are worth more than the same runs against a weak attack. The method uses the ratings of the bowlers the batter actually faced in the match.",
          "**The run-scoring context of the match.** A score of 60 in a game where both sides struggled to pass 200 is worth more than 60 in a match of 400-run totals.",
          "**Not-outs.** An unbeaten innings is credited with some allowance for the runs the batter might have gone on to make, so it is not treated the same as a dismissal for the same score.",
          "**The result.** Performances in a winning cause carry a bonus, which is larger when the win comes against a strong team.",
        ],
      },
      { type: "h2", text: "What goes into a bowler's match score" },
      {
        type: "ul",
        items: [
          "**Wickets, weighted by who was dismissed.** Dismissing a top-rated batter is worth more than dismissing a tail-ender.",
          "**Runs conceded**, judged against the run-scoring context of the match. Conceding three runs an over in a high-scoring T20 is very different from doing so on a slow pitch.",
          "**Workload.** Bowling a lot of overs in a match is credited, so a bowler cannot climb the table from a handful of short spells.",
          "**The result**, as with batters.",
        ],
      },
      {
        type: "p",
        text: "The **all-rounder** rating combines a player's batting and bowling ratings into a single number, so it rewards players who are strong at both rather than outstanding at one and absent from the other.",
      },
      { type: "h2", text: "Why recent form counts most" },
      {
        type: "p",
        text: "Older matches decay in weight. The most recent performances count in full, and each earlier match counts for a little less. That is why a player who has not played for a while can slide down the list without doing anything wrong, and why a player returning from injury needs a few matches to recover their position. New players are also held back: their ratings are scaled down until they have played enough matches for the number to be meaningful. A debutant who scores a century in their first Test does not jump straight into the top ten.",
      },
      { type: "h2", text: "Team rankings: a different method" },
      {
        type: "p",
        text: "Team ratings are built from results, not from individual performances. Each match (or, in Test cricket, each series) earns a team a number of ranking points, and the rating is simply the total points earned divided by the number of matches counted. Rounding it off gives the whole-number rating shown in the published table.",
      },
      {
        type: "p",
        text: "How many points a result is worth depends on the gap between the two teams' ratings beforehand. Beating a team rated close to your own earns points based on the opponent's rating plus a margin. Losing to a similar team earns the opponent's rating minus that margin. When the gap is large, the favourite gains little for an expected win and the underdog gains a lot for an upset. The effect is that a team cannot inflate its rating by playing many weaker opponents, and an upset moves the table more than a routine result.",
      },
      { type: "h2", text: "The rolling window" },
      {
        type: "p",
        text: "Team ratings cover results from roughly the last three to four years. The most recent part of that window counts in full and the older part counts at half weight. Once a year, usually around May, the ICC runs an annual update: the oldest year drops out and the remaining years are reweighted. This is why the team tables can change noticeably on a day when no cricket was played. Commentators sometimes describe it as a team \"losing\" points, but nothing has been taken away. Results that used to count have simply aged out of the window.",
      },
      { type: "h2", text: "When the rankings change" },
      {
        type: "p",
        text: "Player rankings are recalculated after matches and the ICC publishes updated tables regularly, usually weekly when there is international cricket to process. Team tables change after each series and at the annual update. Our [rankings page](/rankings) shows the latest published lists. When a number on our page differs from the ICC's own site, the ICC figure is correct and ours is waiting for the next refresh.",
      },
      { type: "h2", text: "Rankings and other tables" },
      {
        type: "p",
        text: "The ICC Test team ranking is not the same thing as the [World Test Championship](/guides/world-test-championship-points-system) table. The rankings measure results across all Test cricket over several years. The WTC is a two-year competition with its own points system and a final. A team can top one and sit lower in the other, and that happens often. The same goes for tournament points tables, which only count matches in that event and use [net run rate](/guides/net-run-rate-explained) to separate teams level on points.",
      },
      { type: "h2", text: "How to read them sensibly" },
      {
        type: "ul",
        items: [
          "Compare ratings, not just positions. A gap of three rating points between first and second is effectively a tie. A gap of eighty is not.",
          "Check the format. A player can be in the top five in T20Is and nowhere in Tests, and that is normal.",
          "Remember the decay. A player who is rested or injured will drift down even when nothing is wrong with their form.",
          "Use them alongside the raw numbers. Averages and strike rates tell you what happened. Ratings tell you how impressive it was given who it happened against. Our [guide to averages, strike rates and economy](/guides/batting-average-strike-rate-economy-explained) covers the raw numbers.",
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "world-test-championship-points-system",
    reviewed: "24 October 2026",
    title: "World Test Championship Points System Explained",
    category: "Competitions & rankings",
    description:
      "How the ICC World Test Championship works: the two-year cycle, 12 points for a win, 6 for a tie and 4 for a draw, why the table is ranked by percentage of points, over-rate deductions and how the two finalists are decided.",
    related: ["icc-rankings-explained", "follow-on-and-declarations-explained", "cricket-formats-explained-test-odi-t20"],
    blocks: [
      {
        type: "p",
        text: "For most of its history, Test cricket had no competition structure. Bilateral series were played for their own sake, and the only overall measure was the ICC ranking. The **World Test Championship**, first played over 2019 to 2021, changed that. It turns most bilateral Test series into one league that runs for two years and ends in a one-off final between the top two teams.",
      },
      { type: "h2", text: "Who takes part" },
      {
        type: "p",
        text: "Nine Full Member teams play in the Championship: Australia, Bangladesh, England, India, New Zealand, Pakistan, South Africa, Sri Lanka and West Indies. Other Test-playing nations still play Test matches, but those matches do not count towards the WTC table.",
      },
      { type: "h2", text: "The cycle" },
      {
        type: "p",
        text: "Each cycle lasts about two years. In that time every team plays six series, three at home and three away, against six of the other eight teams. Series can be anywhere from two to five Tests long, depending on what the two boards agree. So the teams do not all play each other, and they do not all play the same number of matches. That single fact explains most of how the points system is designed.",
      },
      { type: "h2", text: "Points per match" },
      {
        type: "table",
        head: ["Result", "Points for each team"],
        rows: [
          ["Win", "12"],
          ["Tie", "6"],
          ["Draw", "4"],
          ["Loss", "0"],
        ],
      },
      {
        type: "p",
        text: "A draw is worth a third of a win. That is deliberate: it rewards a team that saves a match, but it gives sides a reason to chase victory rather than settle for a draw. A tie, which is very rare in Tests, splits the winner's points evenly.",
      },
      { type: "h2", text: "Why the table is ranked by percentage" },
      {
        type: "p",
        text: "Teams play different numbers of matches, so raw points would favour whoever happened to play the most Tests. Instead the table is ordered by **percentage of points won**, often shown as PCT. It is the points a team has actually earned divided by the points it could have earned had it won every match, shown as a percentage.",
      },
      {
        type: "callout",
        text: "Percentage of points = points won ÷ (matches played × 12) × 100",
      },
      {
        type: "p",
        text: "**Example** (invented numbers): a team has played 10 Tests, winning 6, drawing 2 and losing 2. It has 6 × 12 + 2 × 4 = 80 points from a possible 10 × 12 = 120, so its percentage is 80 ÷ 120 × 100 = **66.67**. A second team has played only 4 Tests, winning 3 and losing 1: 36 points from 48, or **75.00**. The second team ranks higher despite having fewer points, because it has dropped a smaller share of what it played for.",
      },
      {
        type: "p",
        text: "This was not the original design. In the first cycle every series was worth the same 120 points regardless of length, so a match in a two-Test series was worth 60 points and a match in a five-Test series 24. That made individual Tests unequal in value. From the second cycle onwards the ICC switched to fixed points per match and ranking by percentage, which is the system described here.",
      },
      { type: "h2", text: "Over-rate deductions" },
      {
        type: "p",
        text: "Teams are expected to bowl their overs at a set rate. If a side finishes a match behind the required rate, after allowances for time lost to injuries, reviews and other stoppages, it loses Championship points: one point for every over it is short. The deduction comes off the team's points total, so it also lowers its percentage. These penalties are separate from any match fines on players, and over a full cycle they have been enough to change who reaches the final.",
      },
      { type: "h2", text: "The final" },
      {
        type: "p",
        text: "When the cycle ends, the two teams with the highest percentages play a single Test for the Championship. Every final so far has been played at a neutral venue in England, and a reserve day is set aside to make up time lost to weather. If the final ends in a draw or a tie, the two teams share the title. New Zealand won the first final in 2021, Australia the second in 2023 and South Africa the third in 2025.",
      },
      { type: "h2", text: "Reading the table during a cycle" },
      {
        type: "ul",
        items: [
          "Early in a cycle the percentages swing wildly, because one result is a large share of a small number of matches. A team at 100 after two Tests has not done anything a team at 50 after twelve cannot overtake.",
          "Look at matches remaining. A team with many home Tests still to play has more chances to move than one that has finished its fixtures.",
          "Draws hurt a percentage more than they appear to. Each draw earns a third of a win, so a run of draws pulls a team's percentage down towards 33.",
          "Teams level on percentage are separated by the tie-breakers in the competition's regulations, the first of which is the number of series won.",
        ],
      },
      { type: "h2", text: "How the WTC relates to the ICC rankings" },
      {
        type: "p",
        text: "The WTC table and the ICC Test team ranking measure different things. The ranking covers all Tests over several years, weights the opposition's strength and decays older results, as our [rankings guide](/guides/icc-rankings-explained) explains. The WTC counts only the current cycle's series and gives every match the same value whoever the opponent is. A team that plays a demanding schedule can rank highly in the ICC table while sitting lower in the WTC, and the reverse also happens.",
      },
      { type: "h2", text: "What it changed on the field" },
      {
        type: "p",
        text: "Because every match carries points, dead rubbers have largely disappeared. A team that has already won a series still has points to play for in the final Test. Captains have also become more willing to set up a result with declarations, since a win is worth three times a draw. Our guide to [the follow-on and declarations](/guides/follow-on-and-declarations-explained) shows how those decisions are made.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "how-the-ipl-works",
    reviewed: "24 October 2026",
    title: "How the IPL Works: League Stage, Playoffs, Auction and Impact Player",
    category: "Competitions & rankings",
    description:
      "A plain-English guide to the Indian Premier League: how the ten franchises play 14 league games each, how the points table and playoffs work, how squads are built through retention and the auction, and what the Impact Player and overseas rules mean.",
    related: ["net-run-rate-explained", "super-over-and-tie-breakers-explained", "powerplay-and-fielding-restrictions-explained"],
    blocks: [
      {
        type: "p",
        text: "The Indian Premier League is a T20 franchise competition run by the Board of Control for Cricket in India. It is held once a year, usually from late March to late May or early June. It has more rules than a normal T20 tournament because its teams are franchises with salary purses, not national sides, and because the league adds a few playing regulations of its own. This guide covers the format, the points table, the playoffs, squad-building and the rules that make an IPL match different from a T20 international. For live scores and the franchise list, see our [IPL page](/ipl).",
      },
      { type: "h2", text: "The league stage" },
      {
        type: "p",
        text: "Ten franchises take part. Each plays **14 league matches**, which means 70 league games in total. Ten teams cannot all play each other home and away in 14 games, so the schedule is balanced through groupings: each side plays five of the other teams twice, home and away, and the remaining four once. Which opponents fall into which category changes from season to season.",
      },
      {
        type: "p",
        text: "Every match is a standard 20-over game with the usual [powerplay and fielding restrictions](/guides/powerplay-and-fielding-restrictions-explained). If the scores are level, the match is decided by a [Super Over](/guides/super-over-and-tie-breakers-explained), and further Super Overs are played if that is tied too. So a league match cannot end as a tie.",
      },
      { type: "h2", text: "The points table" },
      {
        type: "table",
        head: ["Result", "Points"],
        rows: [
          ["Win (including via Super Over)", "2"],
          ["No result (abandoned)", "1 each"],
          ["Loss", "0"],
        ],
      },
      {
        type: "p",
        text: "Teams level on points are separated by [net run rate](/guides/net-run-rate-explained). A side's NRR is how fast it scored minus how fast it conceded, across all its matches. In the closing week of the league stage several teams are often level, so NRR decides who goes through. That is why teams sometimes chase targets faster than they need to.",
      },
      { type: "h2", text: "The playoffs" },
      {
        type: "p",
        text: "The top four after the league stage go into a four-match playoff that rewards the top two:",
      },
      {
        type: "ol",
        items: [
          "**Qualifier 1:** first plays second. The winner goes straight to the final.",
          "**Eliminator:** third plays fourth. The loser is out.",
          "**Qualifier 2:** the loser of Qualifier 1 plays the winner of the Eliminator for the other place in the final.",
          "**Final.**",
        ],
      },
      {
        type: "p",
        text: "A top-two finish therefore gives a team two chances to reach the final. Third or fourth means winning three knockout games in a row. Seventy league matches and four playoff matches make a 74-match season.",
      },
      { type: "h2", text: "How squads are built: retention, auction and purse" },
      {
        type: "p",
        text: "IPL squads are not chosen like national teams. Each franchise has a fixed **purse**, a salary budget set by the league, and builds a squad within minimum and maximum size limits. A squad may include only a limited number of overseas players, up to eight.",
      },
      {
        type: "p",
        text: "Before an auction, franchises may **retain** some players from their existing squad, and the cost of each retained player is taken from the purse. Every few years the league holds a **mega auction**, which caps retentions and sends most players back into the pool to reset the competition. In between there are smaller auctions, where franchises fill gaps left by released players. The exact number of retentions, the purse and the price each retention costs are set by the league before each cycle and have changed several times, so check the current regulations rather than an older article.",
      },
      {
        type: "p",
        text: "At the auction, players are offered in sets with a base price that they choose from a list of bands. Franchises bid upwards and the highest bidder signs the player for that amount. A player who attracts no bids goes unsold, though unsold players can be brought back later in the auction. Franchises can also trade players with each other between seasons, and they can sign replacements for injured players under the league's rules.",
      },
      { type: "h2", text: "The Impact Player rule" },
      {
        type: "p",
        text: "Since 2023 the IPL has used the **Impact Player** rule. Along with its playing XI, each team names a short list of substitutes at the toss. At any point in the match it may bring one of them in to replace a member of the XI. The replaced player takes no further part, and the Impact Player can bat and bowl in full, unlike a traditional substitute fielder.",
      },
      {
        type: "p",
        text: "In practice, a team that bats first can replace a batter with a bowler for the second innings, and a chasing team can do the reverse. Every side effectively plays with a twelfth specialist. That deepens batting orders, and it is one reason first-innings totals rose sharply after the rule came in. The rule was introduced by the BCCI for its own competitions. It does not apply in T20 internationals.",
      },
      { type: "h2", text: "The overseas limit" },
      {
        type: "p",
        text: "A team may field **at most four overseas players** in its XI. The Impact Player rule respects this limit: a team that starts with four overseas players can only bring in an Indian player as its Impact Player. Because of this limit, a franchise's overseas signings are among its most important decisions. Most teams use their four slots on match-winners and fill the rest of the side with Indian players.",
      },
      { type: "h2", text: "Other things that are specific to the IPL" },
      {
        type: "ul",
        items: [
          "**Strategic timeouts.** Each innings has two short timeouts, one taken by the fielding side and one by the batting side within set windows of overs.",
          "**Player reviews.** The [Decision Review System](/guides/drs-explained) is used in every match, and the league allows reviews of wides and no-balls in addition to dismissals.",
          "**Reserve days.** The final has a reserve day in case of rain. League matches do not, which is why no-results happen.",
          "**Home grounds.** Each franchise plays most of its home games at a fixed home ground, and pitch conditions vary a great deal between them. Our [pitch guide](/guides/pitch-and-conditions-explained) explains why that matters.",
        ],
      },
      { type: "h2", text: "Reading an IPL match on this site" },
      {
        type: "p",
        text: "During the season our [live scores page](/live) and [IPL page](/ipl) show each match as it happens, and the points table appears while the league is running. Our [scorecard guide](/guides/how-to-read-a-cricket-scorecard) explains the abbreviations. How a scorecard marks the Impact Player and the player replaced varies between scoring providers, so check the notes under the batting and bowling tables.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "batting-average-strike-rate-economy-explained",
    reviewed: "24 October 2026",
    title: "Batting Average, Strike Rate and Economy Explained",
    category: "Stats",
    description:
      "How cricket's core statistics are calculated, with worked examples: batting average and not-outs, batting strike rate, bowling average, economy rate and bowling strike rate, and what each one does and does not tell you across Tests, ODIs and T20s.",
    related: ["how-to-read-a-cricket-scorecard", "icc-rankings-explained", "cricket-formats-explained-test-odi-t20"],
    blocks: [
      {
        type: "p",
        text: "Five numbers do most of the work in describing a cricketer: batting average and strike rate for batters, and bowling average, economy rate and bowling strike rate for bowlers. Each is simple to calculate. Each also hides something, and which number matters most changes from format to format. This guide gives the formula for each one, works through an example, and explains what to read into it.",
      },
      { type: "h2", text: "Batting average" },
      {
        type: "callout",
        text: "Batting average = runs scored ÷ number of times dismissed",
      },
      {
        type: "p",
        text: "The key word is **dismissed**. The bottom of the formula is not the number of innings. An innings in which the batter is not out (marked with an asterisk, as in 45*) adds its runs to the total but does not count as a dismissal. Innings in which the player did not bat are ignored entirely.",
      },
      {
        type: "p",
        text: "**Example** (invented numbers): a batter plays eight innings and scores 12, 45*, 0, 88, 31*, 7, 102 and 15. That is 300 runs. Two innings were not out, so they were dismissed six times. Their average is 300 ÷ 6 = **50.00**. Dividing by all eight innings would have given 37.50, which understates what they typically make before getting out.",
      },
      {
        type: "p",
        text: "**What it tells you:** roughly how many runs a batter makes each time they lose their wicket. In Test cricket, where time is plentiful and occupying the crease matters, it is the most important batting number. **What it hides:** speed, and the effect of not-outs. A lower-order batter who often finishes unbeaten on small scores can have an inflated average. A batter who has not been dismissed at all has no average, because you cannot divide by zero. Statisticians also usually ignore averages from very few innings.",
      },
      { type: "h2", text: "Batting strike rate" },
      {
        type: "callout",
        text: "Batting strike rate = (runs scored ÷ balls faced) × 100",
      },
      {
        type: "p",
        text: "Strike rate is runs per hundred balls. **Example** (invented numbers): 48 runs from 32 balls is 48 ÷ 32 × 100 = **150.0**. Wides do not count as balls faced, because the batter cannot score off them in the usual way. No-balls do count as balls faced.",
      },
      {
        type: "p",
        text: "**What it tells you:** how fast a batter scores. In T20 it often matters more than average, because a side has only 120 balls. A batter who makes 30 from 30 balls may have used up deliveries a quicker teammate could have turned into more runs. **What it hides:** the match situation. A strike rate of 120 can be excellent on a slow pitch and poor on a flat one, and a batter rebuilding after early wickets is doing a different job from one sent in to hit from ball one. In Test cricket strike rate is a secondary number.",
      },
      { type: "h2", text: "Bowling average" },
      {
        type: "callout",
        text: "Bowling average = runs conceded ÷ wickets taken",
      },
      {
        type: "p",
        text: "Lower is better. The runs counted are the ones charged to the bowler: runs off the bat plus wides and no-balls. Byes and leg byes are not charged to the bowler. Run-outs are not credited to the bowler as wickets.",
      },
      {
        type: "p",
        text: "**Example** (invented numbers): a bowler concedes 420 runs and takes 15 wickets. Their average is 420 ÷ 15 = **28.00**, meaning each wicket cost 28 runs.",
      },
      {
        type: "p",
        text: "**What it tells you:** the price of a wicket. In Tests, where taking twenty wickets wins matches, it is the bowler's equivalent of the batting average. **What it hides:** who got out and when. Wickets of tail-enders count the same as wickets of top-order batters, and a bowler who takes several cheap wickets at the end of an innings can look better than a colleague who did the harder work earlier on. Our [rankings guide](/guides/icc-rankings-explained) explains how the ICC ratings correct for exactly this.",
      },
      { type: "h2", text: "Economy rate" },
      {
        type: "callout",
        text: "Economy rate = runs conceded ÷ overs bowled",
      },
      {
        type: "p",
        text: "Economy is runs per over. Overs are counted in balls, so 3.4 overs means three overs and four balls, or 22 balls. As a decimal that is 3.667 overs, not 3.4.",
      },
      {
        type: "p",
        text: "**Example** (invented numbers): a bowler concedes 29 runs from 3.4 overs. That is 29 ÷ 3.667 = **7.91** runs per over. Treating 3.4 as a decimal would have given 8.53, a noticeable error.",
      },
      {
        type: "p",
        text: "**What it tells you:** how hard a bowler is to score off. In T20 it is often the most important bowling number, because restricting runs wins matches even without wickets. **What it hides:** the phase of the innings. Bowling in the [powerplay](/guides/powerplay-and-fielding-restrictions-explained) or at the death is far more expensive than in the middle overs, so a death-overs specialist with an economy of 9 may be more valuable than a middle-overs bowler at 7.",
      },
      { type: "h2", text: "Bowling strike rate" },
      {
        type: "callout",
        text: "Bowling strike rate = balls bowled ÷ wickets taken",
      },
      {
        type: "p",
        text: "Bowling strike rate is the number of balls between wickets, and lower is better. **Example** (invented numbers): a bowler sends down 540 balls (90 overs) and takes 15 wickets, so their strike rate is 540 ÷ 15 = **36.0**: on average, a wicket every six overs.",
      },
      {
        type: "p",
        text: "**What it tells you:** how often a bowler breaks through. In Test cricket a low strike rate marks a genuine wicket-taker, the kind of bowler who wins matches rather than just containing. **What it hides:** cost. A bowler can take wickets quickly while also leaking runs, and that combination suits some match situations but not others.",
      },
      { type: "h2", text: "How the three bowling numbers fit together" },
      {
        type: "p",
        text: "The three bowling figures are linked by one identity: **bowling average = economy rate × bowling strike rate ÷ 6**. Using the examples above, a bowler with an economy of 4.67 and a strike rate of 36.0 has an average of 4.67 × 36 ÷ 6 = 28.0. So a bowler can achieve the same average by being very economical but slow to take wickets, or expensive but quick to take them. Looking at all three shows which kind of bowler you have.",
      },
      { type: "h2", text: "Which numbers matter in which format" },
      {
        type: "table",
        head: ["Format", "Batting", "Bowling"],
        rows: [
          ["Test", "Average first, strike rate second", "Average and strike rate; economy matters less"],
          ["ODI", "Average and strike rate together", "Average and economy together"],
          ["T20", "Strike rate first, average second", "Economy first, especially by phase"],
        ],
      },
      { type: "h2", text: "Cautions when comparing players" },
      {
        type: "ul",
        items: [
          "**Compare within a format.** A T20 average of 35 and a Test average of 35 describe very different achievements.",
          "**Mind the era.** Scoring rates in limited-overs cricket have risen a great deal over the decades, so an ODI strike rate that was outstanding in one era can be ordinary in another.",
          "**Mind the sample.** A handful of innings or spells can produce extreme numbers either way.",
          "**Mind the role.** An opening batter and a finisher, or a new-ball bowler and a death bowler, are judged against different standards.",
        ],
      },
      {
        type: "p",
        text: "For where these figures appear on a match card and what the surrounding abbreviations mean, see our [scorecard guide](/guides/how-to-read-a-cricket-scorecard). Player profiles on the [players page](/players) show each of these numbers by format.",
      },
    ],
  },
];
