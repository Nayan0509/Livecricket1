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
      text: "Ten franchises play a league stage of 70 matches, each side meeting five opponents twice and four once, for 14 games apiece. A win is worth two points, a no-result one, and ties in the table are broken by net run rate. The top four go into the playoffs: first plays second in **Qualifier 1** for a direct place in the final, third plays fourth in the **Eliminator**, and the Qualifier 1 loser meets the Eliminator winner in **Qualifier 2**. That gives the two best league sides a second chance, which is why finishing in the top two matters so much. Seventy league games plus four playoff games make a 74-match season.",
    },
    {
      type: "p",
      text: "Squads are built through a player auction. Franchises retain a limited number of players before each auction and spend the rest of a fixed purse bidding for the others, with rules on how many overseas players a squad may hold and how many may play in an XI (four). Every few years a larger \"mega\" auction resets most squads. Our guide walks through [the auction, purse and retention rules](/guides/how-the-ipl-works).",
    },
    {
      type: "p",
      text: "Since 2023 the league has used the **Impact Player** rule: each side names a short list of substitutes at the toss and may bring one of them into the game at any point, replacing a player who then takes no further part. In practice it lets a team field an extra specialist batter or bowler, and it is one reason first-innings totals rose sharply after its introduction.",
    },
    { type: "h2", text: "A short history" },
    {
      type: "p",
      text: "The IPL began in 2008 with eight city franchises and has been played every year since, with the 2009 edition moved to South Africa and the 2020 and part of the 2021 season staged in the United Arab Emirates. It expanded to ten teams in 2022 with the arrival of Gujarat Titans and Lucknow Super Giants. Mumbai Indians and Chennai Super Kings have historically been the most successful franchises. Chris Gayle's 175 not out for Royal Challengers Bangalore against Pune Warriors in 2013 remains the highest individual score in the competition's history.",
    },
  ],
  faq: [
    {
      q: "How many teams qualify for the IPL playoffs?",
      a: "Four. The top two play Qualifier 1, with the winner going straight to the final. Third and fourth play the Eliminator, and the Eliminator winner meets the Qualifier 1 loser in Qualifier 2 for the other final place.",
    },
    {
      q: "How is the IPL points table ordered?",
      a: "By points first (two for a win, one for a no-result), then by net run rate. Net run rate is explained in our [net run rate guide](/guides/net-run-rate-explained), and the [IPL guide](/guides/how-the-ipl-works) covers the playoff format.",
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
    "The ICC Men's T20 World Cup is the global championship of the shortest international format. Live scores appear here while the tournament is on; the format and history below apply every edition.",
  season: "Held roughly every two years; the 2026 edition was co-hosted by India and Sri Lanka.",
  sections: [
    { type: "h2", text: "Tournament format" },
    {
      type: "p",
      text: "The tournament expanded to 20 teams from the 2024 edition. Teams are drawn into four groups of five and play each other once. The top two in each group advance to the **Super 8** stage, where eight teams are split into two groups of four and again play each other once. The top two in each Super 8 group reach the semi-finals, and the semi-final winners contest the final. A tied knockout match is settled by a Super Over.",
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
      ],
    },
    {
      type: "p",
      text: "West Indies and England are the only sides to have won the title twice before 2024; India's 2024 victory in Barbados made them the first side to win the competition twice as well. The 2026 edition, co-hosted by India and Sri Lanka, followed the same 20-team format.",
    },
  ],
  faq: [
    {
      q: "How many teams play in the T20 World Cup?",
      a: "Twenty, since the 2024 edition: four first-round groups of five, then a Super 8 of two groups of four, then semi-finals and a final.",
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
      text: "The format has changed several times. The 2019 and 2023 editions used a ten-team single round-robin in which every side played every other side once, followed by semi-finals and a final. From 2027 the tournament returns to 14 teams: two groups of seven, a Super Six stage for the top three in each group, then semi-finals and a final. Qualification combines automatic places for hosts and top-ranked sides with a global qualifying tournament for the rest.",
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
        ["2003", "South Africa", "Australia", "India"],
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
  season: "Irregular; the 2025 edition was hosted by Pakistan with India's matches in the UAE, and the next is scheduled for 2029.",
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
  season: "Roughly every two years, usually in August or September; the format matches the next ICC world event.",
  sections: [
    { type: "h2", text: "Format" },
    {
      type: "p",
      text: "Since 2016 the tournament has switched between the ODI and T20 formats to mirror whichever ICC world event comes next, so editions before a T20 World Cup are played as T20s. The usual structure is two groups, a Super Four stage in which the top two from each group play each other once, and a final between the top two in the Super Four. The five Full Members of the ACC (India, Pakistan, Sri Lanka, Bangladesh and Afghanistan) are joined by qualifiers from the region's Associate nations.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The first Asia Cup was played in Sharjah in 1984 with three teams. India have won the most titles, with Sri Lanka second; Pakistan have won it twice. The 2023 edition was staged across Pakistan and Sri Lanka under a hybrid model, and the 2025 edition was played as a T20 competition in the United Arab Emirates.",
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
  season: "Typically February to March, though the window has moved in some years.",
  teams: [
    { name: "Islamabad United", short: "ISL", home: "Rawalpindi Cricket Stadium" },
    { name: "Karachi Kings", short: "KAR", home: "National Bank Stadium, Karachi" },
    { name: "Lahore Qalandars", short: "LAH", home: "Gaddafi Stadium, Lahore" },
    { name: "Multan Sultans", short: "MUL", home: "Multan Cricket Stadium" },
    { name: "Peshawar Zalmi", short: "PES", home: "Rawalpindi Cricket Stadium" },
    { name: "Quetta Gladiators", short: "QUE", home: "National Bank Stadium, Karachi" },
  ],
  sections: [
    { type: "h2", text: "How the PSL works" },
    {
      type: "p",
      text: "Six franchises play a double round-robin league of 30 matches, each side meeting every other twice. The top four reach the playoffs, which use the same structure as the IPL: Qualifier 1 between first and second, an Eliminator between third and fourth, and Qualifier 2 between the Qualifier 1 loser and the Eliminator winner, before the final. Squads are assembled through a draft in which players are grouped into categories (Platinum, Diamond, Gold and so on) rather than sold at an open auction.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The league began in 2016 with five teams and was played entirely in the United Arab Emirates for its first two seasons before matches began returning to Pakistan. Multan Sultans joined as the sixth franchise in 2018, and the 2019 season was the first held entirely on home soil. Islamabad United won the inaugural title and, with Lahore Qalandars, have been the competition's most successful sides.",
    },
  ],
  faq: [
    {
      q: "How many teams are in the PSL?",
      a: "Six: Islamabad United, Karachi Kings, Lahore Qalandars, Multan Sultans, Peshawar Zalmi and Quetta Gladiators.",
    },
    {
      q: "How do PSL teams sign players?",
      a: "Through a draft. Players are placed in categories and franchises pick in turn, with rules on how many overseas players each squad may hold.",
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
      text: "Eight teams play a league stage followed by a five-match finals series. The finals reward the top two: first plays second in the **Qualifier**, with the winner going straight to the final. Third plays fourth in the **Knockout**, the Knockout winner meets the Qualifier loser in the **Challenger**, and the Challenger winner reaches the final. The league has also experimented with rule changes: the **Power Surge**, a two-over batting powerplay the batting side can call after the tenth over, is still used, while the X-Factor substitute and Bash Boost bonus point were trialled and later dropped.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The BBL replaced the state-based KFC Twenty20 Big Bash in 2011-12, splitting Sydney and Melbourne into two franchises each. Perth Scorchers have been the most successful side, and the Sydney Sixers won the first title. Home grounds range from the 100,000-capacity Melbourne Cricket Ground to Hobart's compact Bellerive Oval, which makes venue a real factor in team strategy.",
    },
  ],
  faq: [
    {
      q: "What is the Power Surge in the BBL?",
      a: "A two-over period the batting side can choose to take at any point from the 11th over onwards, during which only two fielders may be outside the 30-yard circle. It replaces the last two overs of the traditional six-over powerplay, which is shortened to four.",
    },
    {
      q: "How many teams make the BBL finals?",
      a: "Five. The Qualifier, Knockout, Challenger and Final decide the champion, with the top two sides given a second chance.",
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
    "The Caribbean Premier League is the West Indies' franchise T20 competition, played across several islands each northern-hemisphere autumn. Live scores appear here during the season.",
  season: "Late August to early October.",
  teams: [
    { name: "Antigua & Barbuda Falcons", short: "ABF", home: "Sir Vivian Richards Stadium, Antigua" },
    { name: "Barbados Royals", short: "BR", home: "Kensington Oval, Bridgetown" },
    { name: "Guyana Amazon Warriors", short: "GAW", home: "Providence Stadium, Guyana" },
    { name: "St Kitts & Nevis Patriots", short: "SKN", home: "Warner Park, Basseterre" },
    { name: "Saint Lucia Kings", short: "SLK", home: "Daren Sammy Cricket Ground, Gros Islet" },
    { name: "Trinbago Knight Riders", short: "TKR", home: "Brian Lara Cricket Academy & Queen's Park Oval, Trinidad" },
  ],
  sections: [
    { type: "h2", text: "How the CPL works" },
    {
      type: "p",
      text: "Six franchises play a double round-robin league followed by playoffs. The playoff structure has varied between a straight semi-final format and the IPL-style Qualifier, Eliminator and Qualifier 2 sequence; the current regulations are published by the league each year. Matches are spread across the home islands of the franchises, so travel and local conditions matter more than in leagues played in one country.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The CPL began in 2013 and Jamaica Tallawahs won the first title. Trinbago Knight Riders have been the most successful franchise. Antigua & Barbuda Falcons joined for the 2024 season, replacing Jamaica Tallawahs. A women's CPL has run alongside the men's tournament since 2022.",
    },
  ],
  faq: [
    {
      q: "When is the CPL played?",
      a: "Usually from late August to early October, after the English season and before the Australian one, which lets many overseas players take part.",
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
    "The Bangladesh Premier League is Bangladesh's franchise T20 competition, played in Dhaka, Sylhet and Chattogram. Live scores appear here during the season.",
  season: "Usually January to February.",
  venues: [
    { name: "Sher-e-Bangla National Cricket Stadium", city: "Mirpur, Dhaka" },
    { name: "Sylhet International Cricket Stadium", city: "Sylhet" },
    { name: "Zahur Ahmed Chowdhury Stadium", city: "Chattogram" },
  ],
  sections: [
    { type: "h2", text: "How the BPL works" },
    {
      type: "p",
      text: "Seven franchises typically take part, playing a double round-robin league followed by playoffs in the Qualifier, Eliminator and Qualifier 2 format, with the final at the Sher-e-Bangla National Stadium in Mirpur. Franchise names and ownership have changed frequently since the league began, so team identities are best checked against the current season's fixtures rather than assumed from previous years.",
    },
    { type: "h2", text: "History" },
    {
      type: "p",
      text: "The BPL was first played in 2012. It was suspended in 2014 after a corruption inquiry and returned in 2015 with new governance. Comilla Victorians have been the league's most successful franchise. The competition is a regular showcase for Bangladesh's international players alongside overseas T20 specialists.",
    },
  ],
  faq: [
    {
      q: "Where are BPL matches played?",
      a: "At three venues: the Sher-e-Bangla National Stadium in Mirpur, Dhaka, the Sylhet International Cricket Stadium and the Zahur Ahmed Chowdhury Stadium in Chattogram.",
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
    "The County Championship is England and Wales's first-class competition and the oldest domestic tournament in the sport. Live scores appear here during the season, which runs through the English summer.",
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
      text: "The 18 first-class counties are split into two divisions, with promotion and relegation between them. Matches last four days and are played with a red ball. Points are awarded for results and for first-innings performance: a win is worth 16 points, a draw 8 and a tie 8, and up to five batting bonus points and three bowling bonus points are available based on runs scored and wickets taken in the first 110 overs of each side's first innings. That bonus system is why a drawn match can still be worth very different amounts to the two sides.",
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
      a: "Eighteen, split into Division One and Division Two, with promotion and relegation between them each season.",
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
  season: "Year-round; the WPL is played in February and March and the WBBL in October and November.",
  sections: [
    { type: "h2", text: "International competitions" },
    {
      type: "p",
      text: "The ICC runs two global events for women: the **Women's Cricket World Cup**, played over 50 overs and held every four years since 1973 (two years before the men's tournament began), and the **Women's T20 World Cup**, first held in 2009 and played roughly every two years. Bilateral series run between them, and the **Women's Ashes** between England and Australia is decided on a points system across Tests, ODIs and T20Is rather than any single format. An ICC Women's Championship league of ODI series determines automatic qualification for the 50-over World Cup.",
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
      a: "On points across the whole multi-format series: a set number of points for the Test (with a win worth more than a draw), and points for each ODI and T20I. The side with more points at the end holds the Ashes.",
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
      text: "Twenty20 began as an English county competition in 2003 and became an international format in 2005. Today it is played at international level, at the ICC Men's and Women's T20 World Cups, and in franchise leagues on every continent, including the [IPL](/ipl), [PSL](/psl), [BBL](/bbl), [CPL](/cpl) and [BPL](/bpl).",
    },
  ],
  faq: [
    {
      q: "How many overs can one bowler bowl in a T20?",
      a: "Four, which is one fifth of the innings. In a rain-shortened game the limit is one fifth of the reduced overs, rounded so that no bowler exceeds the share.",
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
      text: "Each side bats for up to 50 overs. Fielding restrictions run in three phases: in overs 1 to 10 only two fielders may be outside the 30-yard circle, in overs 11 to 40 four may be, and in overs 41 to 50 five may be. A bowler may bowl a maximum of ten overs. Two new balls are used, one from each end, so the ball is 25 overs old at the finish rather than 50, which reduces reverse swing late in the innings.",
    },
    {
      type: "p",
      text: "Rain-affected matches are decided by the **DLS method**, which resets the chasing side's target according to how many overs and wickets the two sides had in hand. A result requires at least 20 overs per side. Our guides cover [the three ODI powerplays](/guides/powerplay-and-fielding-restrictions-explained) and [how DLS targets are set](/guides/dls-method-explained).",
    },
    { type: "h2", text: "Where ODIs are played" },
    {
      type: "p",
      text: "The first ODI was played in Melbourne in 1971. The format's showpiece is the [ICC Cricket World Cup](/world-cup), and the [Champions Trophy](/champions-trophy) is its other global event. Bilateral series usually consist of three or five matches, and the ICC Cricket World Cup Super League and [League 2](/icc-cwc-league-2) give context to ODIs between world events.",
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
      text: "A Test match is scheduled for five days, each of at least 90 overs split into three sessions. Both sides bat twice, and the winner is the side that scores more runs across its two innings while dismissing the opposition twice. If time runs out first, the match is drawn. A side leading by a large margin after the first innings may enforce the **follow-on**, making the opposition bat again immediately, and a batting side may **declare** its innings closed to leave time to bowl the other side out. There are no fielding restrictions and no limit on a bowler's overs; the ball is changed only after 80 overs, when the fielding side may take a new one.",
    },
    {
      type: "p",
      text: "The **World Test Championship** puts bilateral Test series into a two-year league. Each series counts equally, sides are ranked by the percentage of available points they win, and the top two meet in a one-off final. Our guides explain [the follow-on and declarations](/guides/follow-on-and-declarations-explained) and [how the WTC points system works](/guides/world-test-championship-points-system).",
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
  season: "Tri-series are spread across the cycle, from 2024 to 2027.",
  sections: [
    { type: "h2", text: "How League 2 works" },
    {
      type: "p",
      text: "Eight Associate teams hold ODI status for the length of the cycle and play a long league of tri-series, each side meeting every other several times at home, away and at neutral venues. The 2024 to 2027 cycle features Canada, Namibia, Nepal, the Netherlands, Oman, Scotland, the United Arab Emirates and the United States, each scheduled to play 36 ODIs. The top four at the end of the league advance to the **Cricket World Cup Qualifier**, where they meet Full Members who missed automatic qualification; the bottom four drop into a play-off against the leading Challenge League sides.",
    },
    {
      type: "p",
      text: "Because points are pooled across the whole cycle, a single tri-series rarely decides anything on its own, but results carry ODI status and ranking points, which makes them matter far beyond the league itself.",
    },
  ],
  faq: [
    {
      q: "Which teams are in CWC League 2?",
      a: "For the 2024 to 2027 cycle: Canada, Namibia, Nepal, the Netherlands, Oman, Scotland, the UAE and the USA.",
    },
  ],
};

const TOURNAMENTS = T;
const TOURNAMENT_SLUGS = Object.keys(T);

module.exports = { TOURNAMENTS, TOURNAMENT_SLUGS };
