// Tournament and format hub configuration, shared by TournamentPage.jsx and
// api/render.js. Everything here is format, structure and settled history.
// Deliberately absent: current captains, current standings, season fixtures
// and season-specific records, all of which go stale within months and were
// previously hard-coded (and wrong) on these pages. Live matches for each
// competition come from the live feed via `filterKeywords`.

const T = {};

T.ipl = {
  slug: "ipl",
  name: "Indian Premier League",
  shortName: "IPL",
  icon: "🏆",
  accentColor: "#00F0FF",
  filterKeywords: ["IPL", "Indian Premier League"],
  intro:
    "The Indian Premier League is the world's biggest T20 franchise competition. This page shows live IPL scores and fixtures while the season is on, and explains how the league works the rest of the year.",
  season: "Usually late March to late May or early June.",
  teams: [
    { name: "Chennai Super Kings", short: "CSK", home: "MA Chidambaram Stadium, Chennai" },
    { name: "Delhi Capitals", short: "DC", home: "Arun Jaitley Stadium, Delhi" },
    { name: "Gujarat Titans", short: "GT", home: "Narendra Modi Stadium, Ahmedabad" },
    { name: "Kolkata Knight Riders", short: "KKR", home: "Eden Gardens, Kolkata" },
    { name: "Lucknow Super Giants", short: "LSG", home: "Ekana Cricket Stadium, Lucknow" },
    { name: "Mumbai Indians", short: "MI", home: "Wankhede Stadium, Mumbai" },
    { name: "Punjab Kings", short: "PBKS", home: "Maharaja Yadavindra Singh Stadium, Mullanpur" },
    { name: "Rajasthan Royals", short: "RR", home: "Sawai Mansingh Stadium, Jaipur" },
    { name: "Royal Challengers Bengaluru", short: "RCB", home: "M. Chinnaswamy Stadium, Bengaluru" },
    { name: "Sunrisers Hyderabad", short: "SRH", home: "Rajiv Gandhi International Stadium, Hyderabad" },
  ],
  sections: [
    { type: "h2", text: "How the IPL works" },
    {
      type: "p",
      text: "Ten franchises play a league stage of 70 matches, each side meeting five opponents twice and four once, for 14 games apiece. A win is worth two points and a no-result one; teams level on points are separated first by the number of wins and then by net run rate. The top four go into the playoffs: first plays second in **Qualifier 1** for a direct place in the final, third plays fourth in the **Eliminator**, and the Qualifier 1 loser meets the Eliminator winner in **Qualifier 2**. That gives the two best league sides a second chance, which is why finishing in the top two matters so much. Seventy league games plus four playoff games make a 74-match season.",
    },
    {
      type: "p",
      text: "Squads are built through a player auction. Franchises retain a limited number of players before each auction and spend the rest of a fixed purse bidding for the others, with rules on how many overseas players a squad may hold and how many may play in an XI (four). Every few years a larger \"mega\" auction resets most squads. Our guide walks through [the auction, purse and retention rules](/guides/how-the-ipl-works).",
    },
    {
      type: "p",
      text: "Since 2023, and still in the 2026 season, the league has used the **Impact Player** rule: each side names five substitutes with its XI at the toss and may bring one of them in before an innings, at the end of an over, or when a wicket falls or a batter retires, replacing a player who then takes no further part. In practice it lets a team field an extra specialist batter or bowler, and it is one reason first-innings totals rose sharply after its introduction.",
    },
    { type: "h2", text: "A short history" },
    {
      type: "p",
      text: "The IPL began in 2008 with eight city franchises and has been played every year since, with the 2009 edition moved to South Africa and the opening stage of 2014, the whole of 2020 and the second half of 2021 staged in the United Arab Emirates. It expanded to ten teams in 2022 with the arrival of Gujarat Titans and Lucknow Super Giants. Mumbai Indians and Chennai Super Kings have been the most successful franchises, with five titles each. Chris Gayle's 175 not out for Royal Challengers Bangalore against Pune Warriors in 2013 was still the highest individual score in the competition's history after the 2026 season.",
    },
  ],
  faq: [
    {
      q: "How many teams qualify for the IPL playoffs?",
      a: "Four. The top two play Qualifier 1, with the winner going straight to the final. Third and fourth play the Eliminator, and the Eliminator winner meets the Qualifier 1 loser in Qualifier 2 for the other final place.",
    },
    {
      q: "How is the IPL points table ordered?",
      a: "By points first (two for a win, one for a no-result). Teams level on points are separated by the number of wins, and then by net run rate. Net run rate is explained in our [net run rate guide](/guides/net-run-rate-explained), and the [IPL guide](/guides/how-the-ipl-works) covers the playoff format.",
    },
    {
      q: "Is the IPL points table shown here when the league is not on?",
      a: "No. The table on this page comes from the live feed and appears only during a season. We do not show a previous season's table as if it were current.",
    },
  ],
};

T["t20-world-cup"] = {
  slug: "t20-world-cup",
  name: "ICC Men's T20 World Cup",
  shortName: "T20 World Cup",
  icon: "🌍",
  accentColor: "#FF1053",
  filterKeywords: ["T20 World Cup", "ICC Men's T20 World Cup", "T20 WC"],
  intro:
    "The ICC Men's T20 World Cup is the global championship of the shortest international format. Live scores appear here while the tournament is on; the format and history are explained below.",
  season: "Held roughly every two years; the 2026 edition was co-hosted by India and Sri Lanka, and the 2028 edition is scheduled for Australia and New Zealand.",
  sections: [
    { type: "h2", text: "Tournament format" },
    {
      type: "p",
      text: "The tournament expanded to 20 teams from the 2024 edition. In 2024 and 2026 the teams were drawn into four groups of five and played each other once. The top two in each group advanced to the **Super 8** stage, where eight teams were split into two groups of four and again played each other once, and the top two in each Super 8 group reached the semi-finals. For 2028 the ICC has announced five groups of four, with the top two in each going into a **Super 10** stage and an eliminator round before the semi-finals. A tied knockout match is settled by a Super Over.",
    },
    {
      type: "p",
      text: "Qualification blends automatic places for the hosts and the best-performing sides at the previous edition, places for the highest-ranked teams not otherwise qualified, and regional qualifying tournaments for the remaining spots. That mix is why Associate nations such as the USA, Nepal, Oman and Papua New Guinea have appeared alongside the Full Members.",
    },
    { type: "h2", text: "Past winners" },
    {
      type: "table",
      head: ["Year", "Host", "Winner", "Runner-up"],
      rows: [
        ["2007", "South Africa", "India", "Pakistan"],
        ["2009", "England", "Pakistan", "Sri Lanka"],
        ["2010", "West Indies", "England", "Australia"],
        ["2012", "Sri Lanka", "West Indies", "Sri Lanka"],
        ["2014", "Bangladesh", "Sri Lanka", "India"],
        ["2016", "India", "West Indies", "England"],
        ["2021", "UAE & Oman", "Australia", "New Zealand"],
        ["2022", "Australia", "England", "Pakistan"],
        ["2024", "West Indies & USA", "India", "South Africa"],
        ["2026", "India & Sri Lanka", "India", "New Zealand"],
      ],
    },
    {
      type: "p",
      text: "West Indies and England were the first sides to win the title twice, and India's 2024 victory in Barbados made them the third. In 2026, on home soil, India became the first side to win it three times, beating New Zealand by 96 runs in the final in Ahmedabad.",
    },
  ],
  faq: [
    {
      q: "How many teams play in the T20 World Cup?",
      a: "Twenty, since the 2024 edition. The 2024 and 2026 tournaments used four first-round groups of five, then a Super 8 of two groups of four, then semi-finals and a final; the ICC has announced a Super 10 stage for 2028.",
    },
    {
      q: "What happens if a T20 World Cup match is tied?",
      a: "A Super Over is played: one over each, and if that is tied too, further Super Overs until there is a winner. In group games a no-result shares the points.",
    },
  ],
};

T["world-cup"] = {
  slug: "world-cup",
  name: "ICC Men's Cricket World Cup",
  shortName: "World Cup",
  icon: "🏏",
  accentColor: "#B026FF",
  filterKeywords: ["Cricket World Cup", "ICC Cricket World Cup", "ODI World Cup", "CWC"],
  intro:
    "The 50-over ICC Cricket World Cup is the oldest and most prestigious limited-overs tournament. This page shows live scores during the event, and explains the format and history in between.",
  season: "Every four years; the next edition is scheduled for 2027 in South Africa, Zimbabwe and Namibia.",
  sections: [
    { type: "h2", text: "Format" },
    {
      type: "p",
      text: "The format has changed several times. The 2019 and 2023 editions used a ten-team single round-robin in which every side played every other side once, followed by semi-finals and a final. From 2027 the tournament returns to 14 teams. Under the format the ICC confirmed in July 2026, the three lowest-ranked qualifiers first play a round-robin **Super Series**, with only the winner going through; the other 12 are split into two groups of six, and the top three in each group plus the best fourth-placed side form a **Super 7** round-robin, whose top four reach the semi-finals. Qualification combines automatic places for hosts and top-ranked sides with a global qualifying tournament for the rest.",
    },
    {
      type: "p",
      text: "Because every league match can decide a semi-final place, net run rate is frequently decisive in the closing rounds. Our guide explains [how net run rate is calculated](/guides/net-run-rate-explained), and the [DLS guide](/guides/dls-method-explained) covers how rain-affected World Cup matches are decided.",
    },
    { type: "h2", text: "Past winners" },
    {
      type: "table",
      head: ["Year", "Host", "Winner", "Runner-up"],
      rows: [
        ["1975", "England", "West Indies", "Australia"],
        ["1979", "England", "West Indies", "England"],
        ["1983", "England", "India", "West Indies"],
        ["1987", "India & Pakistan", "Australia", "England"],
        ["1992", "Australia & New Zealand", "Pakistan", "England"],
        ["1996", "India, Pakistan & Sri Lanka", "Sri Lanka", "Australia"],
        ["1999", "England", "Australia", "Pakistan"],
        ["2003", "South Africa, Zimbabwe & Kenya", "Australia", "India"],
        ["2007", "West Indies", "Australia", "Sri Lanka"],
        ["2011", "India, Sri Lanka & Bangladesh", "India", "Sri Lanka"],
        ["2015", "Australia & New Zealand", "Australia", "New Zealand"],
        ["2019", "England & Wales", "England", "New Zealand"],
        ["2023", "India", "Australia", "India"],
      ],
    },
    {
      type: "p",
      text: "Australia have won the trophy six times, including three in a row from 1999 to 2007. The 2019 final at Lord's was tied after both the match and the Super Over, and England were awarded the title on boundaries scored, a rule the ICC later removed.",
    },
  ],
  faq: [
    {
      q: "How often is the Cricket World Cup held?",
      a: "Every four years. The 2023 edition was in India; the 2027 edition is scheduled for South Africa, Zimbabwe and Namibia with 14 teams.",
    },
    {
      q: "How many overs are in a World Cup match?",
      a: "Fifty per side, with the standard ODI powerplay and fielding restrictions. Rain-affected matches use the DLS method to reset targets.",
    },
  ],
};

T["champions-trophy"] = {
  slug: "champions-trophy",
  name: "ICC Champions Trophy",
  shortName: "Champions Trophy",
  icon: "🥇",
  accentColor: "#FF2E9A",
  filterKeywords: ["Champions Trophy"],
  intro:
    "The ICC Champions Trophy is a compact eight-team ODI tournament often described as the \"mini World Cup\". Live scores appear here when it is being played.",
  season: "Irregular; the 2025 edition was hosted by Pakistan with India's matches in the UAE, and the next is scheduled for India in 2029.",
  sections: [
    { type: "h2", text: "Format" },
    {
      type: "p",
      text: "Eight teams are split into two groups of four. Each side plays the other three in its group once, the top two from each group reach the semi-finals, and the semi-final winners meet in the final. With only 15 matches in total there is no room for a slow start, which is why the tournament tends to produce tight group finishes decided on net run rate.",
    },
    {
      type: "p",
      text: "Qualification has usually gone to the hosts plus the highest-ranked ODI sides at a cut-off date, or, for 2025, the top eight finishers at the preceding 50-over World Cup.",
    },
    { type: "h2", text: "History" },
    {
      type: "table",
      head: ["Year", "Host", "Winner"],
      rows: [
        ["1998", "Bangladesh", "South Africa"],
        ["2000", "Kenya", "New Zealand"],
        ["2002", "Sri Lanka", "India & Sri Lanka (shared, final washed out)"],
        ["2004", "England", "West Indies"],
        ["2006", "India", "Australia"],
        ["2009", "South Africa", "Australia"],
        ["2013", "England & Wales", "India"],
        ["2017", "England & Wales", "Pakistan"],
        ["2025", "Pakistan & UAE", "India"],
      ],
    },
    {
      type: "p",
      text: "The competition began in 1998 as the ICC KnockOut, was renamed the Champions Trophy in 2002, and was paused after 2017 before returning in 2025. India's 2025 win, achieved without losing a match, made them the first side to win the trophy three times, counting the shared 2002 title.",
    },
  ],
  faq: [
    {
      q: "How many teams play in the Champions Trophy?",
      a: "Eight, in two groups of four, followed by semi-finals and a final: 15 matches in all.",
    },
  ],
};

T["asia-cup"] = {
  slug: "asia-cup",
  name: "Asia Cup",
  shortName: "Asia Cup",
  icon: "🌏",
  accentColor: "#00F0FF",
  filterKeywords: ["Asia Cup"],
  intro:
    "The Asia Cup is the continental championship run by the Asian Cricket Council, best known for India-Pakistan meetings that are otherwise rare. Live scores appear here during the tournament.",
  season: "Roughly every two years, with recent editions played in August and September; the format matches the next ICC world event.",
  sections: [
    { type: "h2", text: "Format" },
    {
      type: "p",
      text: "Since 2016 the tournament has switched between the ODI and T20 formats to mirror whichever ICC world event comes next, so editions before a T20 World Cup are played as T20s. The usual structure is two groups, a Super Four stage in which the top two from each group play each other once, and a final between the top two in the Super Four. The five Full Members of the ACC (India, Pakistan, Sri Lanka, Bangladesh and Afghanistan) are joined by qualifiers from the region's Associate nations.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The first Asia Cup was played in Sharjah in 1984 with three teams. India have won the most titles, with Sri Lanka second; Pakistan have won it twice. The 2023 edition was staged across Pakistan and Sri Lanka under a hybrid model, and the 2025 edition was played as a T20 competition in the United Arab Emirates, where India beat Pakistan in the final for their ninth title.",
    },
  ],
  faq: [
    {
      q: "Is the Asia Cup played in ODI or T20 format?",
      a: "It alternates. The ACC picks the format of the next ICC world event, so an edition before a T20 World Cup is played as T20s and one before a 50-over World Cup as ODIs.",
    },
  ],
};

T.psl = {
  slug: "psl",
  name: "Pakistan Super League",
  shortName: "PSL",
  icon: "🦁",
  accentColor: "#D896FF",
  filterKeywords: ["PSL", "Pakistan Super League", "HBL PSL"],
  intro:
    "The Pakistan Super League is Pakistan's franchise T20 competition, played mostly in Karachi, Lahore, Rawalpindi and Multan. Live scores appear here during the season.",
  season: "Traditionally February to March; the 2025 season ran from April to May and the 2026 season from late March to early May.",
  teams: [
    { name: "Hyderabad Kingsmen", short: "HYD", home: "Hyderabad" },
    { name: "Islamabad United", short: "ISL", home: "Islamabad" },
    { name: "Karachi Kings", short: "KAR", home: "National Stadium, Karachi" },
    { name: "Lahore Qalandars", short: "LAH", home: "Gaddafi Stadium, Lahore" },
    { name: "Multan Sultans", short: "MUL", home: "Multan Cricket Stadium" },
    { name: "Peshawar Zalmi", short: "PES", home: "Peshawar" },
    { name: "Quetta Gladiators", short: "QUE", home: "Quetta" },
    { name: "Rawalpindiz", short: "RWP", home: "Rawalpindi Cricket Stadium" },
  ],
  sections: [
    { type: "h2", text: "How the PSL works" },
    {
      type: "p",
      text: "Eight franchises took part in 2026, split into two groups of four: each side played the teams in its own group twice and those in the other group once, ten matches apiece and 40 in all. From 2018 to 2025 six franchises played a double round-robin of 30 matches. The top four reach the playoffs, which use the same structure as the IPL under different names: a Qualifier between first and second, Eliminator 1 between third and fourth, and Eliminator 2 between the Qualifier loser and the Eliminator 1 winner, before the final. Franchises represent cities, but matches are staged at a few central venues rather than home and away, and the whole 2026 season was played in Karachi and Lahore. Until 2025 squads were assembled through a draft in which players were grouped into categories (Platinum, Diamond, Gold and so on); from 2026 the league switched to a player auction.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The league began in 2016 with five teams. The first season was played entirely in the United Arab Emirates, and the 2017 final in Lahore began the return of matches to Pakistan. Multan Sultans joined as the sixth franchise in 2018, and the 2020 season was the first held entirely on home soil. The league expanded to eight teams in 2026: Hyderabad Kingsmen and Rawalpindiz played for the first time, and the Multan Sultans name passed to a new franchise after the original one was sold and moved to Rawalpindi. Islamabad United won the inaugural title and, with Lahore Qalandars, have been the competition's most successful sides, with three titles each to 2026; Peshawar Zalmi won the 2026 final.",
    },
  ],
  faq: [
    {
      q: "How many teams are in the PSL?",
      a: "Eight since the 2026 season: Hyderabad Kingsmen, Islamabad United, Karachi Kings, Lahore Qalandars, Multan Sultans, Peshawar Zalmi, Quetta Gladiators and Rawalpindiz. The league had five teams in 2016 and 2017 and six from 2018 to 2025.",
    },
    {
      q: "How do PSL teams sign players?",
      a: "Through a player auction since 2026, with a limit on how many players each franchise may retain beforehand and rules on how many overseas players a squad may hold. From 2016 to 2025 the PSL used a draft instead, in which players were placed in categories and franchises picked in turn.",
    },
  ],
};

T.bbl = {
  slug: "bbl",
  name: "Big Bash League",
  shortName: "BBL",
  icon: "🔥",
  accentColor: "#FF6B00",
  filterKeywords: ["BBL", "Big Bash"],
  intro:
    "The Big Bash League is Australia's franchise T20 competition, played through the Australian summer with eight city-based teams. Live scores appear here during the season.",
  season: "December to late January.",
  teams: [
    { name: "Adelaide Strikers", short: "STR", home: "Adelaide Oval" },
    { name: "Brisbane Heat", short: "HEA", home: "The Gabba, Brisbane" },
    { name: "Hobart Hurricanes", short: "HUR", home: "Bellerive Oval, Hobart" },
    { name: "Melbourne Renegades", short: "REN", home: "Marvel Stadium, Melbourne" },
    { name: "Melbourne Stars", short: "STA", home: "Melbourne Cricket Ground" },
    { name: "Perth Scorchers", short: "SCO", home: "Perth Stadium" },
    { name: "Sydney Sixers", short: "SIX", home: "Sydney Cricket Ground" },
    { name: "Sydney Thunder", short: "THU", home: "Sydney Showground Stadium" },
  ],
  sections: [
    { type: "h2", text: "How the BBL works" },
    {
      type: "p",
      text: "Eight teams play a 40-match league stage, ten games each, followed by a four-match finals series for the top four (the format since 2023-24; from 2019-20 to 2022-23 five teams made the finals). The finals reward the top two: first plays second in the **Qualifier**, with the winner going straight to the final. Third plays fourth in the **Knockout**, the Knockout winner meets the Qualifier loser in the **Challenger**, and the Challenger winner reaches the final. The league has also experimented with rule changes: the **Power Surge**, a two-over batting powerplay the batting side can call after the tenth over, is still used, while the X-Factor substitute and Bash Boost bonus point were trialled for two seasons and dropped in 2022. From BBL|16 in 2026-27, sides may also name a designated batter, who bats but does not field or bowl, and a designated fielder, who fields (and may keep wicket) but does not bowl.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The BBL replaced the state-based KFC Twenty20 Big Bash in 2011-12, splitting Sydney and Melbourne into two franchises each. Perth Scorchers have been the most successful side, with six titles to 2025-26, and the Sydney Sixers won the first title. Home grounds range from the 100,000-capacity Melbourne Cricket Ground to Hobart's compact Bellerive Oval, which makes venue a real factor in team strategy.",
    },
  ],
  faq: [
    {
      q: "What is the Power Surge in the BBL?",
      a: "A two-over period the batting side can choose to take at any point from the 11th over onwards, during which only two fielders may be outside the 30-yard circle. It replaces the last two overs of the traditional six-over powerplay, which is shortened to four.",
    },
    {
      q: "How many teams make the BBL finals?",
      a: "Four, since the 2023-24 season. The Qualifier, Knockout, Challenger and Final decide the champion, with the top two sides given a second chance. From 2019-20 to 2022-23 the finals series had five teams.",
    },
  ],
};

T.cpl = {
  slug: "cpl",
  name: "Caribbean Premier League",
  shortName: "CPL",
  icon: "🌴",
  accentColor: "#39FF14",
  filterKeywords: ["CPL", "Caribbean Premier League"],
  intro:
    "The Caribbean Premier League is the West Indies' franchise T20 competition, played across several Caribbean countries, usually in August and September. Live scores appear here during the season.",
  season: "Usually August and September; the 2026 season ran from 7 August to 20 September.",
  teams: [
    { name: "Antigua & Barbuda Falcons", short: "ABF", home: "Sir Vivian Richards Stadium, Antigua" },
    { name: "Barbados Tridents", short: "BT", home: "Kensington Oval, Bridgetown" },
    { name: "Guyana Amazon Warriors", short: "GAW", home: "Providence Stadium, Guyana" },
    { name: "Jamaica Kingsmen", short: "JK", home: "Sabina Park, Kingston" },
    { name: "St Kitts & Nevis Patriots", short: "SKN", home: "Warner Park, Basseterre" },
    { name: "Saint Lucia Kings", short: "SLK", home: "Daren Sammy Cricket Ground, Gros Islet" },
    { name: "Trinbago Knight Riders", short: "TKR", home: "Brian Lara Cricket Academy & Queen's Park Oval, Trinidad" },
  ],
  sections: [
    { type: "h2", text: "How the CPL works" },
    {
      type: "p",
      text: "In recent seasons each franchise has played ten league matches, a double round-robin when there were six teams, before the top four go into the playoffs. The playoff structure has varied between a straight semi-final format and the IPL-style Qualifier, Eliminator and Qualifier 2 sequence; the current regulations are published by the league each year. Matches are spread across the franchises' home countries, so travel and local conditions matter more than in leagues played in one country.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The CPL began in 2013 and Jamaica Tallawahs won the first title. Trinbago Knight Riders have been the most successful franchise, with five titles to 2025. Antigua & Barbuda Falcons joined for the 2024 season, replacing Jamaica Tallawahs, and won their first title in 2026, beating the new Jamaica Kingsmen franchise in the final. The 2026 season was the first with seven teams, and the Barbados franchise returned to the Barbados Tridents name it had used before 2021. A women's CPL has run alongside the men's tournament since 2022.",
    },
  ],
  faq: [
    {
      q: "When is the CPL played?",
      a: "Usually in August and September; the 2026 season ran from 7 August to the final on 20 September. The window falls between the IPL and the Australian summer, which lets many overseas players take part.",
    },
  ],
};

T.bpl = {
  slug: "bpl",
  name: "Bangladesh Premier League",
  shortName: "BPL",
  icon: "🐯",
  accentColor: "#00B8D9",
  filterKeywords: ["BPL", "Bangladesh Premier League"],
  intro:
    "The Bangladesh Premier League is Bangladesh's franchise T20 competition, usually played in Dhaka, Sylhet and Chattogram. Live scores appear here during the season.",
  season: "Usually between late December and February; the 2025-26 season ran from 26 December to 23 January.",
  venues: [
    { name: "Sher-e-Bangla National Cricket Stadium", city: "Mirpur, Dhaka" },
    { name: "Sylhet International Cricket Stadium", city: "Sylhet" },
    { name: "Bir Shrestha Flight Lieutenant Matiur Rahman Cricket Stadium (formerly Zahur Ahmed Chowdhury Stadium)", city: "Chattogram" },
  ],
  sections: [
    { type: "h2", text: "How the BPL works" },
    {
      type: "p",
      text: "Six or seven franchises take part each season (six in 2025-26), playing a double round-robin league followed by playoffs in the Qualifier 1, Eliminator and Qualifier 2 format, with the final usually at the Sher-e-Bangla National Stadium in Mirpur. Franchise names and ownership have changed frequently since the league began, so team identities are best checked against the current season's fixtures rather than assumed from previous years.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The BPL was first played in 2012. It was suspended in 2014 after a corruption inquiry and returned in 2015 with new governance. Comilla Victorians, who won four titles between 2015 and 2023, have been the league's most successful franchise. The competition is a regular showcase for Bangladesh's international players alongside overseas T20 specialists.",
    },
  ],
  faq: [
    {
      q: "Where are BPL matches played?",
      a: "Usually at three venues: the Sher-e-Bangla National Stadium in Mirpur, Dhaka, the Sylhet International Cricket Stadium, and the Chattogram ground formerly called the Zahur Ahmed Chowdhury Stadium, renamed Bir Shrestha Flight Lieutenant Matiur Rahman Cricket Stadium in 2025. In 2025-26 every match was played in Sylhet or Dhaka after the Chattogram leg was dropped.",
    },
  ],
};

T["county-championship"] = {
  slug: "county-championship",
  name: "County Championship",
  shortName: "County Championship",
  icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  accentColor: "#00B8D9",
  filterKeywords: ["County Championship", "County Cricket", "Division One", "Division Two"],
  intro:
    "The County Championship is England and Wales's first-class competition and one of the oldest domestic competitions in the sport. Live scores appear here during the season, which runs through the English summer.",
  season: "April to late September.",
  teams: [
    { name: "Derbyshire", home: "County Ground, Derby" },
    { name: "Durham", home: "Riverside Ground, Chester-le-Street" },
    { name: "Essex", home: "County Ground, Chelmsford" },
    { name: "Glamorgan", home: "Sophia Gardens, Cardiff" },
    { name: "Gloucestershire", home: "County Ground, Bristol" },
    { name: "Hampshire", home: "Utilita Bowl, Southampton" },
    { name: "Kent", home: "St Lawrence Ground, Canterbury" },
    { name: "Lancashire", home: "Old Trafford, Manchester" },
    { name: "Leicestershire", home: "Grace Road, Leicester" },
    { name: "Middlesex", home: "Lord's, London" },
    { name: "Northamptonshire", home: "County Ground, Northampton" },
    { name: "Nottinghamshire", home: "Trent Bridge, Nottingham" },
    { name: "Somerset", home: "County Ground, Taunton" },
    { name: "Surrey", home: "The Oval, London" },
    { name: "Sussex", home: "County Ground, Hove" },
    { name: "Warwickshire", home: "Edgbaston, Birmingham" },
    { name: "Worcestershire", home: "New Road, Worcester" },
    { name: "Yorkshire", home: "Headingley, Leeds" },
  ],
  sections: [
    { type: "h2", text: "How the Championship works" },
    {
      type: "p",
      text: "The 18 first-class counties are split into two divisions, ten in Division One and eight in Division Two in 2026, with two counties promoted and two relegated each season. Matches last four days and are played with a red ball. Points are awarded for results and for first-innings performance: a win is worth 16 points, a draw 8 and a tie 8, and up to five batting bonus points and three bowling bonus points are available based on runs scored and wickets taken in the first 110 overs of each side's first innings. That bonus system is why a drawn match can still be worth very different amounts to the two sides.",
    },
    {
      type: "p",
      text: "The season is split around the white-ball competitions, with blocks of Championship cricket in April and May and again in late summer. Our guide to [Test cricket's follow-on and declarations](/guides/follow-on-and-declarations-explained) covers the tactics that apply to four-day cricket too.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The Championship was formally constituted in 1890, though counties had played each other for decades before that. The two-division structure dates from 2000. Yorkshire have won the title more often than any other county. Brian Lara's 501 not out for Warwickshire against Durham at Edgbaston in 1994 is still the highest individual score in all first-class cricket.",
    },
  ],
  faq: [
    {
      q: "How many counties are in the County Championship?",
      a: "Eighteen: ten in Division One and eight in Division Two in 2026, with two counties promoted and two relegated each season.",
    },
    {
      q: "How are County Championship points scored?",
      a: "Sixteen for a win, eight for a draw or tie, plus up to five batting and three bowling bonus points from the first 110 overs of each first innings.",
    },
  ],
};

T["womens-cricket"] = {
  slug: "womens-cricket",
  name: "Women's Cricket",
  shortName: "Women's",
  icon: "🏏",
  accentColor: "#FF36AB",
  filterKeywords: ["Women", "Women's", "WPL", "WBBL", "WT20", "WODI"],
  intro:
    "Live scores from women's international cricket and the major women's T20 leagues, with an overview of how the women's game is organised.",
  season: "Year-round; the WPL is played early in the year (9 January to 5 February in 2026) and the WBBL from late October or November into December.",
  sections: [
    { type: "h2", text: "International competitions" },
    {
      type: "p",
      text: "The ICC runs two global events for women: the **Women's Cricket World Cup**, first held in 1973 (two years before the men's tournament began) and now a 50-over event held every four years, and the **Women's T20 World Cup**, first held in 2009 and played roughly every two years. Bilateral series run between them, and the **Women's Ashes** between England and Australia is decided on a points system across Tests, ODIs and T20Is rather than any single format. An ICC Women's Championship league of ODI series determines automatic qualification for the 50-over World Cup.",
    },
    { type: "h2", text: "Franchise leagues" },
    {
      type: "p",
      text: "The **Women's Big Bash League** in Australia, running since 2015, was the first major women's franchise competition. The **Women's Premier League** in India began in 2023 with five franchises and quickly became the most valuable. England's **The Hundred** runs a women's competition alongside the men's, and the Caribbean Premier League has had a women's tournament since 2022. These leagues have raised professional standards and pay across the women's game.",
    },
    {
      type: "p",
      text: "Playing conditions are largely the same as in men's cricket, with a slightly smaller and lighter ball and, in most competitions, a shorter boundary. Australia have been the dominant force in women's cricket for most of its history, with England, India and New Zealand their most frequent challengers.",
    },
  ],
  faq: [
    {
      q: "How is the Women's Ashes decided?",
      a: "On points across the whole multi-format series: a set number of points for the Test (with a win worth more than a draw), and points for each ODI and T20I. The side with more points at the end holds the Ashes; if the points finish level, the holders keep them, as Australia did after the 8-8 series in 2023.",
    },
  ],
};

T.t20 = {
  slug: "t20",
  name: "T20 Cricket",
  shortName: "T20",
  icon: "⚡",
  accentColor: "#B026FF",
  filterKeywords: ["T20", "Twenty20", "T20I"],
  intro:
    "Live scores from every T20 match in the feed, international and franchise, plus a short guide to how the 20-over format works.",
  sections: [
    { type: "h2", text: "How T20 cricket works" },
    {
      type: "p",
      text: "Each side bats for a maximum of 20 overs. The first six overs are the **powerplay**, during which only two fielders may stand outside the 30-yard circle; after that, five may. No bowler may bowl more than four overs, so a captain needs at least five bowlers. Wides and no-balls cost a run and must be re-bowled, and a no-ball also gives the batter a free hit on the next delivery. Most competitions now cap the time an innings may take and apply a fielding penalty (an extra fielder inside the circle) for slow over-rates.",
    },
    {
      type: "p",
      text: "A tied match is decided by a **Super Over**: each side faces one over with three batters available, and the higher score wins; if the Super Over is tied, another is played. Rain-affected games use the DLS method, and a result needs at least five overs per side. Our guides explain [powerplays and fielding restrictions](/guides/powerplay-and-fielding-restrictions-explained), [Super Overs and tie-breakers](/guides/super-over-and-tie-breakers-explained) and [the DLS method](/guides/dls-method-explained).",
    },
    { type: "h2", text: "Where T20 is played" },
    {
      type: "p",
      text: "Twenty20 began as an English county competition in 2003. The first international was a women's match between England and New Zealand at Hove in 2004, and the first men's international followed in 2005. Today it is played at international level, at the ICC Men's and Women's T20 World Cups, and in franchise leagues on every continent, including the [IPL](/ipl), [PSL](/psl), [BBL](/bbl), [CPL](/cpl) and [BPL](/bpl).",
    },
  ],
  faq: [
    {
      q: "How many overs can one bowler bowl in a T20?",
      a: "Four, which is one fifth of the innings. In a rain-shortened game the limit falls to one fifth of the reduced overs; when that is not a whole number, a few bowlers may bowl one extra over to make up the total, and in an innings of five to nine overs each bowler may bowl up to two.",
    },
  ],
};

T.odi = {
  slug: "odi",
  name: "ODI Cricket",
  shortName: "ODI",
  icon: "🎯",
  accentColor: "#00F0FF",
  filterKeywords: ["ODI", "One Day", "One-Day"],
  intro:
    "Live scores from One Day Internationals and other 50-over matches in the feed, plus a guide to how the format works.",
  sections: [
    { type: "h2", text: "How ODI cricket works" },
    {
      type: "p",
      text: "Each side bats for up to 50 overs. Fielding restrictions run in three phases: in overs 1 to 10 only two fielders may be outside the 30-yard circle, in overs 11 to 40 four may be, and in overs 41 to 50 five may be. A bowler may bowl a maximum of ten overs. Two new balls are used, one from each end. Under the ICC's playing conditions for men's ODIs since July 2025, that lasts only until the end of the 34th over: the fielding side then picks one of the two balls for the rest of the innings, so the ball in use at the finish is about 33 overs old rather than 25, which gives bowlers a better chance of reverse swing.",
    },
    {
      type: "p",
      text: "Rain-affected matches are decided by the **DLS method**, which resets the chasing side's target according to how many overs and wickets the two sides had in hand. A result requires at least 20 overs per side. Our guides cover [the three ODI powerplays](/guides/powerplay-and-fielding-restrictions-explained) and [how DLS targets are set](/guides/dls-method-explained).",
    },
    { type: "h2", text: "Where ODIs are played" },
    {
      type: "p",
      text: "The first ODI was played in Melbourne in 1971. The format's showpiece is the [ICC Cricket World Cup](/world-cup), and the [Champions Trophy](/champions-trophy) is its other global event. Bilateral series usually consist of three or five matches. The ICC Cricket World Cup Super League gave ODIs between the leading sides league context from 2020 to 2023 before it was discontinued, and [League 2](/icc-cwc-league-2) does the same for the leading Associate nations.",
    },
  ],
  faq: [
    {
      q: "How many overs can one bowler bowl in an ODI?",
      a: "Ten, one fifth of the innings, the same proportion as the four-over limit in T20 cricket.",
    },
  ],
};

T.test = {
  slug: "test",
  name: "Test Cricket",
  shortName: "Test",
  icon: "🏛️",
  accentColor: "#9D00FF",
  filterKeywords: ["Test"],
  intro:
    "Live scores from Test matches and other first-class cricket in the feed, plus a guide to how the five-day format works.",
  sections: [
    { type: "h2", text: "How Test cricket works" },
    {
      type: "p",
      text: "A Test match is scheduled for five days, each of at least 90 overs split into three sessions. Both sides bat twice, and the winner is the side that scores more runs across its two innings while dismissing the opposition twice. If time runs out first, the match is drawn. A side leading by a large margin after the first innings may enforce the **follow-on**, making the opposition bat again immediately, and a batting side may **declare** its innings closed to leave time to bowl the other side out. There are no powerplays or fielding-circle restrictions and no limit on a bowler's overs, and the fielding side may take a new ball only after 80 overs.",
    },
    {
      type: "p",
      text: "The **World Test Championship** puts bilateral Test series between nine of the Test nations into a two-year league. Every Test is worth the same (12 points for a win, 6 for a tie, 4 for a draw), sides are ranked by the percentage of available points they win, and the top two meet in a one-off final. Our guides explain [the follow-on and declarations](/guides/follow-on-and-declarations-explained) and [how the WTC points system works](/guides/world-test-championship-points-system).",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The first Test was played between Australia and England in Melbourne in 1877. Twelve nations now hold Test status, the most recent being Ireland and Afghanistan in 2018. The Ashes between England and Australia is the oldest continuing contest, and Brian Lara's 400 not out for West Indies against England in Antigua in 2004 remains the highest individual Test score.",
    },
  ],
  faq: [
    {
      q: "How many overs are bowled in a day of Test cricket?",
      a: "A minimum of 90 in three sessions of roughly 30, with extra time available to make up overs lost to weather and slow play. The day ends earlier if the side batting last has won or the match is otherwise decided.",
    },
  ],
};

T["icc-cwc-league-2"] = {
  slug: "icc-cwc-league-2",
  name: "ICC Cricket World Cup League 2",
  shortName: "CWC League 2",
  icon: "🌐",
  accentColor: "#00FFA3",
  filterKeywords: ["League 2", "CWC League", "World Cup League"],
  intro:
    "ICC Cricket World Cup League 2 is the ODI competition through which Associate nations work towards the 50-over World Cup. Live scores appear here when a tri-series is being played.",
  season: "Tri-series are spread across a cycle of nearly three years; the 2023-27 cycle began in February 2024 and is scheduled to end in November 2026.",
  sections: [
    { type: "h2", text: "How League 2 works" },
    {
      type: "p",
      text: "Eight Associate teams hold ODI status for the length of the cycle and play a long league of tri-series, each side meeting every other several times at home, away and at neutral venues. The 2023-27 cycle, played from 2024 to 2026, features Canada, Namibia, Nepal, the Netherlands, Oman, Scotland, the United Arab Emirates and the United States, each scheduled to play 36 ODIs; the United States clinched first place in October 2026. The top four at the end of the league advance to the **Cricket World Cup Qualifier**, where they meet Full Members who missed automatic qualification; the bottom four drop into a play-off against the leading Challenge League sides.",
    },
    {
      type: "p",
      text: "Because points are pooled across the whole cycle, a single tri-series rarely decides anything on its own, but results carry ODI status and ranking points, which makes them matter far beyond the league itself.",
    },
  ],
  faq: [
    {
      q: "Which teams are in CWC League 2?",
      a: "For the 2023-27 cycle, played from 2024 to 2026: Canada, Namibia, Nepal, the Netherlands, Oman, Scotland, the UAE and the USA.",
    },
  ],
};

const TOURNAMENTS = T;
const TOURNAMENT_SLUGS = Object.keys(T);

module.exports = { TOURNAMENTS, TOURNAMENT_SLUGS };
