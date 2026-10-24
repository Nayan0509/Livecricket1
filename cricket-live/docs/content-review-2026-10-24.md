# Content review sheet: 24 October 2026

The Editorial Policy (`/editorial-policy`) says every guide is reviewed and approved by the
site's editor. On 24 October 2026, research agents fact-checked the existing guides and the
tournament and sport pages, and wrote six new guides. This sheet lists what changed and the
source for each change, so the review can be done against sources rather than from scratch.

## How to use this sheet

1. Start with **Weakly sourced items** below. These are the claims most likely to be wrong.
2. Read the six new guides in full on the site (`/guides/<slug>`).
3. For corrected guides, check the corrected sentence against the source listed.
4. If a fact is wrong: fix it in the guide file, then add a dated note for that guide in
   `client/src/content/guides/corrections.js`. The guide's "Last reviewed" date updates by itself.
5. Before each cricket season, re-check the items under **Season-volatile facts**, then move
   `FACTS_CHECKED` in `client/src/content/tournaments.js` (and `sports.js`) to that date.

Main primary sources used throughout (ICC PDFs were downloaded and read in full):

| Key | Document |
|---|---|
| TEST | ICC Men's Test Playing Conditions, Oct 2026: https://images.icc-cricket.com/image/upload/prd/a8114zro5tkioifz0jqg.pdf |
| ODI | ICC Men's ODI Playing Conditions, Oct 2026: https://images.icc-cricket.com/image/upload/prd/bxkzkcyvfn6tvi70zh0w.pdf |
| T20I | ICC Men's T20I Playing Conditions, Oct 2026: https://images.icc-cricket.com/image/upload/prd/bsxcho7ufe2pjban0wjp.pdf |
| WTC | WTC 2025-27 Playing Conditions: https://images.icc-cricket.com/image/upload/prd/jrwhpcwk8mmpv0fx3lnd.pdf |
| T20WC | T20 World Cup 2026 Playing Conditions: https://images.icc-cricket.com/image/upload/prd/yyt7m8uh9c1uehrbvuwb.pdf |
| CLASS | ICC Classification of Official Cricket, 1 Jul 2026: https://images.icc-cricket.com/image/upload/prd/enzawp3xa8h4ahqonlpd.pdf |
| LAWS26 | MCC Laws of Cricket, 2017 Code 4th Edition (2026), read via web.archive.org (lords.org refused connections) |
| ICC22 | ICC release, 19 Sep 2022: https://www.icc-cricket.com/news/icc-makes-changes-to-playing-conditions |
| ICC25 | ICC release, 27 Jun 2025: https://www.icc-cricket.com/news/several-changes-made-to-icc-playing-conditions |

## Weakly sourced items (check these first)

| Where | Claim | Why it is weak |
|---|---|---|
| how-the-ipl-works, /ipl | Impact Player: five named substitutes | 2023 sources only (Wisden, KKR site); no current IPL rulebook text was available |
| how-the-ipl-works, /ipl | Tie-break: number of wins, then NRR | Rulebook clause 16.10.2 quoted by CricTracker; the IPL document itself would not load |
| ways-of-getting-out | Retired batter may resume only with the opposing captain's consent (Laws) | Laws read through secondary summaries |
| cricket-fielding-positions | Leg-side fielder limit "around 1960" | Sources give 1957 or 1960 |
| umpires-and-match-officials | Neutral umpires: which on-field umpires must be neutral today | Could not confirm; guide states the 2022 position |
| no-ball-wide-and-free-hit | Free hits since 2007 | Wikipedia citing a Cricinfo release that could not be opened |
| cricket-balls-red-white-pink | Origin of the white ball in World Series Cricket; which ball Bangladesh uses | Secondary sources; Bangladesh left out |
| /world-cup, /t20-world-cup | 2027 ODI and 2028 T20 World Cup formats | Wire reports (PTI, AAP) of the July 2026 ICC meeting; no ICC page found |
| /county-championship | 2026 draw points | Verified for 2025; ECB kept the format but no 2026 source states the points |

## Corrections to existing guides

All dated 24 October 2026 and shown at the foot of each guide.

- **how-to-read-a-cricket-scorecard**: "elected to field" wording (ESPN scorecards); example line labelled as invented.
- **cricket-formats-explained-test-odi-t20**: ODI two-ball rule since July 2025 (ODI 4.3, ICC25); first T20Is 2004 (women) and 2005 (men) (Cricinfo scorecard, Hove 2004); The Hundred counts in T20 records, T10 not recognised (CLASS App. B); List A at least 40 overs (CLASS s.7); Tests "up to five days" (four-day Test conditions).
- **ways-of-getting-out-in-cricket**: catch lodged in helmet/clothing is fair (TEST 33.2.2.1); new batter to striker's end after a catch since 2022 (ICC22, TEST 18.11.1); timed out 2 min Tests/ODIs, 90 s T20Is (40.1.1); retired-out resumption (TEST 25.4.3-4); unsupported 2017 bails claim removed (TEST 29).
- **cricket-fielding-positions-explained**: example field had ten fielders; T20 circle rule (T20I 28.7.5); leg-side limit date.
- **bowling-types-swing-seam-spin-explained**: bouncers two per over Tests/ODIs, one T20Is (41.6.1.4); IPL two since 2024 (ESPN, Dec 2023).
- **cricket-glossary**: free hit adds hit wicket (ODI 21.18.2); sightscreen colours (TEST App. 2.3.1); death overs by format; day-night tea/dinner order.
- **dls-method-explained / net-run-rate-explained**: in DLS matches the side batting **first** is credited with one run fewer than the revised target (ODI 16.10.2; https://www.espn.com/cricket/story/_/id/19577040); par score if abandoned; wins usually rank above NRR (ODI/T20I 16.10.1).
- **drs-explained**: review counts three/two/two since the 2020 increase (App. D 3.6.1); umpire's call covers impact and wicket only (App. D 3.4.4-6); review can end in a different mode (App. D 3.3, 3.6.5); Hot Spot optional (App. D 1.1.3).
- **powerplay-and-fielding-restrictions-explained**: square-leg umpire calls (28.7.2.7 / 28.7.8); fielder movement rule and five penalty runs (28.5, 28.6.3, 41.4.2); shortened T20 powerplays counted in balls since 2025 (T20I 28.7.6); in-match over-rate penalty T20Is 2022, ODIs 2023, IPL 2023.
- **super-over-and-tie-breakers-explained**: Super Over rules (App. F); first men's T20I double Super Over India v Afghanistan, Jan 2024 (cricket.com.au); boundary count dropped Oct 2019; standings order varies (T20WC 16.10.4, ODI 16.10.1, WTC 16.12.2-4).
- **follow-on-and-declarations-explained**: no declaring or forfeiting the final innings (TEST 15.1-15.2, LAWS26); one-day matches are not first-class (CLASS s.5).
- **pitch-and-conditions-explained**: demerit points active five years, six points = 12-month suspension (ICC Pitch and Outfield Monitoring Process, May 2024).
- **icc-rankings-explained**: three descriptions reworded to the ICC's own (https://www.icc-cricket.com/news/mrf-tyres-icc-player-rankings).
- **world-test-championship-points-system**: percentage ranking began partway through cycle one; tie-breakers series won, away percentage, ranking (WTC 16.12.2-4).
- **how-the-ipl-works**: tie-break and Impact Player (see weakly sourced items).

## New guides (24 October 2026)

| Slug | Words | Main sources |
|---|---|---|
| lbw-rule-explained | 1,383 | LAWS26 Law 36; TEST App. D 3.2-3.6 |
| no-ball-wide-and-free-hit-explained | 1,343 | LAWS26 Laws 21, 22 (head-high ball now a wide, Law 22.1.3); ODI/T20I 21, 22, 41.6; ICC25 |
| run-rate-and-required-run-rate-explained | 1,068 | Laws 17, 21.16, 22.8; arithmetic in labelled examples |
| umpires-and-match-officials-explained | 1,377 | ICC playing conditions; Code of Conduct (Jun 2023); stop-clock and soft-signal releases |
| the-ashes-explained | 952 | MCC history pages; Wisden 1882 report; women's Ashes points format (ICC, 2013) |
| cricket-balls-red-white-pink-explained | 1,258 | LAWS26 Law 4; ODI 4.2-4.5 and 41.3; ICC25; Kookaburra |

## Tournament and sport pages (52 corrections)

Biggest changes, with sources:

- **PSL**: eight teams from 2026 (Hyderabad Kingsmen, Rawalpindiz added), groups format, auction replaced the draft, Peshawar Zalmi won 2026. https://en.wikipedia.org/wiki/2026_Pakistan_Super_League ; https://www.aljazeera.com/amp/sports/2026/5/4/all-round-hero-hardie-helps-babar-azams-peshawar-zalmi-win-psl-2026
- **T20 World Cup**: India beat New Zealand by 96 runs in the 2026 final; India first to win three times. https://www.skysports.com/cricket/news/12344/13502048/mens-t20-world-cup-2026-fixtures-england-india-pakistan-australia-scotland-ireland-west-indies-and-more
- **IPL**: tie-break wins then NRR; five Impact Player substitutes (see above).
- **CPL**: Barbados Royals renamed Barbados Tridents; Jamaica Kingsmen added; Antigua & Barbuda Falcons won 2026.
- **BBL**: four-team finals since 2023-24; X-Factor and Bash Boost dropped 2022; BBL|16 designated batter/fielder.
- **BPL**: six teams in 2025-26; Chattogram stadium renamed March 2025.
- **ODI / Test**: two-ball rule since July 2025; Super League discontinued; WTC per-match points.
- **World Cup / T20 World Cup**: 2027 and 2028 formats announced July 2026 (weakly sourced).
- **League 2**: USA clinched first place, October 2026.

## Season-volatile facts (re-check before each season)

PSL, CPL and BPL team lists and home grounds; BBL and PSL formats; the IPL Impact Player rule
(the BCCI was reported in August-October 2026 to be reviewing it); the WTC team count (a 12-team
cycle from 2027 was proposed but undecided); 2027 and 2028 ICC event formats.
