// Hand-written content for the site's static pages, shared by the React pages
// and api/render.js. Block schema (see ContentBlocks.jsx / render.js):
//   { type: "h2" | "h3" | "p" | "callout", text }
//   { type: "ul" | "ol", items: [text] }
//   { type: "kv", items: [{ k, v }] }
//   { type: "table", head: [..], rows: [[..]] }
//   { type: "faq", items: [{ q, a }] }
// Inline markup inside `text`: **bold** and [label](/path).

const { SITE_NAME, CONTACT_EMAIL } = require("./site");

const LAST_REVIEWED = "17 September 2026";

// ─── Home ─────────────────────────────────────────────────────────────────────

const HOME = {
  h1: "Live Cricket Scores, Scorecards & Guides",
  intro: [
    "Live Cricket Zone shows what is happening in cricket right now: matches in progress, the day's results and the fixtures coming up, each with a full scorecard. Football, basketball and tennis scores sit alongside on their own pages.",
    "The part of the site we write ourselves is the [guides library](/guides): plain-English explanations of how the games actually work, from reading a scorecard and the DLS method to net run rate, DRS and the tie-break rules that decide close finishes. If a number on a scorecard ever puzzles you, there is a guide for it.",
  ],
  faq: [
    {
      q: "Where do the live scores come from?",
      a: "Scores, scorecards and fixtures are collected automatically from publicly available match-centre data and refreshed while play is on. They are factual match information, not our reporting, and can lag the ground by a minute or so. If a figure looks wrong, the official scorer's figure is the one that counts.",
    },
    {
      q: "Does the site stream matches or show live video?",
      a: "No. Live Cricket Zone does not host, stream or rebroadcast any match. The highlights page embeds official post-match clips from rights holders' own YouTube channels. To watch live, use the licensed broadcaster in your country.",
    },
    {
      q: "Which cricket competitions are covered?",
      a: "Anything with a public live scorecard: bilateral international series, ICC events, the World Test Championship, and franchise leagues such as the IPL, PSL, BBL, CPL and BPL, as well as women's internationals and leagues. Tournament pages show live matches when a competition is on and explain the format when it is not.",
    },
    {
      q: "What is in the guides section?",
      a: "Evergreen explainers written by the site's editorial team: how to read a scorecard, how DLS and net run rate are calculated, how DRS reviews work, the ten ways a batter can be out, how ICC rankings are weighted, and how the IPL auction and playoffs work, among others. Each guide carries a last-reviewed date.",
    },
    {
      q: "Is there any betting or fantasy money involved?",
      a: "No. The site carries no odds, no bookmaker links and no real-money games. The fantasy page is a strategy explainer only.",
    },
  ],
};

// ─── About ────────────────────────────────────────────────────────────────────

const ABOUT = {
  h1: "About Live Cricket Zone",
  lede: "An independent sports site that puts live scores and clear explanations in the same place.",
  blocks: [
    { type: "h2", text: "What this site is" },
    {
      type: "p",
      text: `${SITE_NAME} is an independent, self-funded website. It started as a cricket live-score project and now also carries football, basketball and tennis scores. It is run by a small team of cricket followers and developers, not by a media company, and it has no affiliation with the ICC, any national board, league or broadcaster.`,
    },
    {
      type: "p",
      text: "The site has two halves. The **live half** shows matches in progress, results and fixtures with full scorecards. The **written half** is a library of [guides](/guides) that explain how the games work, aimed at people who follow the scores and want to understand what they are looking at.",
    },
    { type: "h2", text: "Where the data comes from" },
    {
      type: "p",
      text: "Live scores, scorecards, fixtures and rankings are collected automatically from publicly available match-centre data and public sports data feeds, and refreshed while play is on. We do not hold an official data licence from any board or league. For that reason we treat this data as what it is: factual match information that we display but did not create. It is labelled as live data, it is never rewritten into articles, and where a figure differs from the official scorer's, the official figure is correct.",
    },
    {
      type: "p",
      text: "News headlines on the [news page](/news) are a curated feed from established cricket publishers. Each headline links to the original report on the publisher's own site. We do not copy or paraphrase their articles.",
    },
    {
      type: "p",
      text: "Highlights on the [videos page](/videos) are official clips embedded from rights holders' YouTube channels using YouTube's standard embed player. Nothing is hosted here and no live match is ever streamed.",
    },
    { type: "h2", text: "What we write ourselves" },
    {
      type: "p",
      text: "Every guide on this site is original writing by the Live Cricket Zone editorial team. Guides are checked against the ICC playing conditions, the MCC Laws of Cricket and the published regulations of the competition concerned, and each one shows the date it was last reviewed. We keep guides evergreen on purpose: they explain rules, formats and calculations rather than reporting on individual matches, so they stay accurate between seasons. When a rule changes, the guide is updated and the review date moves. Our [editorial policy](/editorial-policy) sets out the process in full, including how to request a correction.",
    },
    { type: "h2", text: "What we deliberately do not do" },
    {
      type: "ul",
      items: [
        "We do not stream, host or link to live match video, official or otherwise.",
        "We do not publish odds, tips, bookmaker links or anything that promotes real-money gambling. The [fantasy page](/fantasy) is a strategy explainer with no money involved.",
        "We do not generate match reports or news articles automatically from score data.",
        "We do not invent statistics. If a guide gives a number, it is a rule, a fixed historical fact or a worked example that is labelled as one.",
      ],
    },
    { type: "h2", text: "Advertising" },
    {
      type: "p",
      text: "The site is funded by advertising served through Google AdSense. Ads are labelled and are kept visually separate from scores and guides. Advertisers have no influence over what we publish, and we do not accept paid placements inside guides. Our [privacy policy](/privacy-policy) explains what advertising cookies do and how to opt out of personalised ads.",
    },
    { type: "h2", text: "Get in touch" },
    {
      type: "p",
      text: `Corrections, questions and copyright notices all go to [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}). The [contact page](/contact) explains what to include so we can act quickly.`,
    },
  ],
};

// ─── Contact ──────────────────────────────────────────────────────────────────

const CONTACT = {
  h1: "Contact Live Cricket Zone",
  lede: "One address for everything. Tell us which of the cases below applies and we can act faster.",
  email: CONTACT_EMAIL,
  reasons: [
    {
      title: "A score or scorecard looks wrong",
      body: "Live data is collected automatically and can lag or, occasionally, mis-parse. Send the match name, the figure you think is wrong and, if you can, the official figure. We will check the feed and fix the parser if it is our error.",
      subject: "Score correction",
    },
    {
      title: "A correction to a guide",
      body: "If a rule we describe has changed, or we have simply got something wrong, tell us which guide and which sentence. Corrections are noted at the foot of the guide with the date they were made.",
      subject: "Guide correction",
    },
    {
      title: "Privacy or data request",
      body: "Requests under GDPR, UK GDPR or CCPA to access, correct or delete personal data. We hold very little: see the privacy policy for what is collected. We respond within the statutory period.",
      subject: "Privacy request",
    },
    {
      title: "Copyright or DMCA notice",
      body: "If you believe content on this site infringes your rights, follow the steps on the DMCA page so your notice is complete on the first attempt.",
      subject: "Copyright notice",
    },
    {
      title: "Anything else",
      body: "Suggestions for guides, broken links, accessibility problems or general feedback are all welcome.",
      subject: "Feedback",
    },
  ],
  note: "We are a small team and do not run a phone line or a postal helpdesk. Email is read every working day and we aim to reply within a few working days. Legal notices receive priority.",
};

// ─── Editorial policy ─────────────────────────────────────────────────────────

const EDITORIAL = {
  h1: "Editorial Policy & Corrections",
  lede: `How content on ${SITE_NAME} is produced, labelled and corrected. Last reviewed ${LAST_REVIEWED}.`,
  blocks: [
    { type: "h2", text: "1. Three kinds of content, labelled differently" },
    {
      type: "kv",
      items: [
        {
          k: "Guides",
          v: "Original explanatory writing by our editorial team. These are the only pages on the site that we author, and the only pages that carry an author line and a last-reviewed date.",
        },
        {
          k: "Live data",
          v: "Scores, scorecards, fixtures, standings and rankings collected automatically from public sources. Displayed as received, never rewritten. Pages built from live data say so.",
        },
        {
          k: "Curated links",
          v: "News headlines and official video highlights from third parties. Each item names its source and links to the original. We do not summarise or republish the underlying article.",
        },
      ],
    },
    { type: "h2", text: "2. How guides are written and checked" },
    {
      type: "p",
      text: "Guides explain rules, formats, calculations and history. They are deliberately evergreen: we avoid predictions, form analysis and anything that would be out of date within a month. Before publication a guide is checked against the primary source for its subject: the MCC Laws of Cricket, the ICC Men's and Women's playing conditions, the published regulations of the league concerned (BCCI, PCB, Cricket Australia, ECB and so on), and for other sports the rulebooks of the IFAB, the ITF, the NBA and the NCAA. Worked examples are labelled as examples. Where a rule differs between competitions we say so rather than generalising.",
    },
    {
      type: "p",
      text: "We use software tools for drafting, spell-checking and consistency checks. Every guide is reviewed and approved by the site's editor before it is published, and nothing is published automatically.",
    },
    { type: "h2", text: "3. Numbers and records" },
    {
      type: "p",
      text: "A number in a guide is one of three things: a rule (six balls in an over), a fixed historical fact (the first T20 World Cup was played in 2007) or a worked example that says it is an example. We do not quote records that change from season to season unless the guide states the date they were correct, and we do not invent precise figures to make a point sound authoritative.",
    },
    { type: "h2", text: "4. Corrections" },
    {
      type: "p",
      text: `Anyone can request a correction by emailing [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) with the page and the sentence concerned. If we agree there is an error we fix the text, add a dated correction note at the foot of the guide describing what changed, and update the last-reviewed date. Live data errors are handled differently: we check the source and fix our parser, since the underlying figures are not ours to edit.`,
    },
    { type: "h2", text: "5. Independence and advertising" },
    {
      type: "p",
      text: "Advertising on the site is served by Google AdSense and is labelled. Advertisers do not see content before publication and cannot influence it. We do not accept sponsored guides, paid links or affiliate placements, and we do not publish betting content of any kind.",
    },
    { type: "h2", text: "6. What we do not publish" },
    {
      type: "ul",
      items: [
        "Live streams or links to live streams, licensed or otherwise.",
        "Odds, tips, bookmaker promotions or real-money fantasy.",
        "Automatically generated match reports or rewritten versions of other publishers' articles.",
        "Content attributed to people who did not write it.",
      ],
    },
  ],
};

// ─── Privacy policy ───────────────────────────────────────────────────────────

const PRIVACY = {
  h1: "Privacy Policy",
  lede: `Last updated ${LAST_REVIEWED}. Questions to [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}).`,
  blocks: [
    {
      type: "callout",
      text: `This policy explains what information ${SITE_NAME} (www.livecricketzone.com) collects when you use the site, why, and the choices you have. We collect as little as we can: the site has no accounts, no logins and no payment system.`,
    },
    { type: "h2", text: "1. Information we collect" },
    {
      type: "ul",
      items: [
        "**Technical log data.** When you load a page our hosting provider records the request: IP address, browser type, device type, referring page and time. This is standard web-server logging used for security and to keep the site running.",
        "**Analytics.** We use Google Analytics 4 to understand which pages are read and how the site performs. Google Analytics sets cookies and receives your IP address (which it anonymises), pages viewed and approximate location.",
        "**Advertising cookies.** Google AdSense sets cookies to serve and measure ads. See section 2.",
        "**Local preferences.** A small amount of data such as your cookie-banner choice and game scores is stored in your own browser (localStorage) and never sent to us.",
        "**Email.** If you email us we keep the message and your address for as long as needed to deal with it.",
      ],
    },
    { type: "h2", text: "2. Google AdSense and advertising cookies" },
    {
      type: "p",
      text: "Google is a third-party vendor that serves advertisements on this site. Google uses cookies, including the DoubleClick cookie, to show ads based on your visits to this and other websites, and to measure whether ads are seen or clicked.",
    },
    {
      type: "ul",
      items: [
        "Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.",
        "You can opt out of personalised advertising by visiting [Google's Ads Settings](https://www.google.com/settings/ads).",
        "You can opt out of some third-party vendors' use of cookies for personalised advertising at [aboutads.info](https://optout.aboutads.info) or [youronlinechoices.com](https://www.youronlinechoices.com).",
        "Visitors in the European Economic Area and the United Kingdom are shown a consent notice before advertising cookies are used, in line with Google's EU User Consent Policy.",
      ],
    },
    { type: "h2", text: "3. Other third parties" },
    {
      type: "p",
      text: "Highlights are embedded from YouTube using YouTube's embed player, which may set cookies and collect data under [Google's privacy policy](https://policies.google.com/privacy). Fonts are loaded from Google Fonts. Team badges and other images may be loaded from the public content servers of the data sources named on the relevant pages. We have no control over cookies set by these providers.",
    },
    { type: "h2", text: "4. How we use information" },
    {
      type: "ul",
      items: [
        "To operate, secure and improve the site.",
        "To measure which content is useful so we can write better guides.",
        "To serve and measure advertising, which funds the site.",
        "To respond to your emails.",
      ],
    },
    {
      type: "p",
      text: "We do not sell personal information, and we do not build user profiles ourselves.",
    },
    { type: "h2", text: "5. Your rights (GDPR, UK GDPR and CCPA)" },
    {
      type: "p",
      text: "If you are in the EEA or the UK you have the right to access, correct or erase personal data we hold about you, to object to or restrict processing, and to withdraw consent at any time. If you are a California resident you have the right to know what personal information is collected, to request its deletion and to opt out of its sale; we do not sell personal information. To exercise any right email us at the address above. We respond within the statutory period.",
    },
    { type: "h2", text: "6. Cookies you can control" },
    {
      type: "p",
      text: "You can delete or block cookies in your browser settings; the site will still work, although ad personalisation and analytics will stop. The cookie notice shown on first visit lets you decline non-essential cookies.",
    },
    { type: "h2", text: "7. Children" },
    {
      type: "p",
      text: "The site is not directed at children under 13 and we do not knowingly collect personal information from them. If you believe a child has sent us personal data, email us and we will delete it.",
    },
    { type: "h2", text: "8. Changes" },
    {
      type: "p",
      text: "When this policy changes we update the date at the top. Substantive changes will be highlighted on this page for 30 days.",
    },
  ],
};

// ─── Terms of use ─────────────────────────────────────────────────────────────

const TERMS = {
  h1: "Terms of Use",
  lede: `Last updated ${LAST_REVIEWED}. Questions to [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}).`,
  blocks: [
    {
      type: "callout",
      text: `By using ${SITE_NAME} you agree to these terms. If you do not agree, please do not use the site.`,
    },
    { type: "h2", text: "1. The service" },
    {
      type: "p",
      text: "Live Cricket Zone provides sports scores, scorecards, fixtures and rankings collected from public sources; a curated feed of third-party news headlines; official highlight videos embedded from YouTube; browser games; and original written guides. The service is free and provided for personal, non-commercial use. We may change or withdraw any part of it at any time.",
    },
    { type: "h2", text: "2. Accuracy of live data" },
    {
      type: "p",
      text: "Scores and statistics are collected automatically and may be delayed, incomplete or occasionally wrong. They are provided for information only. Do not rely on them for any purpose where accuracy matters financially or legally; the official scorer's record is authoritative.",
    },
    { type: "h2", text: "3. Intellectual property" },
    {
      type: "ul",
      items: [
        "**Our content.** The guides, the site's design and its code are owned by Live Cricket Zone. You may quote short extracts with a link and attribution; you may not republish guides in full or use them to train or seed automated content.",
        "**Facts.** Match scores, results and statistics are facts and are not claimed as our property.",
        "**Third-party content.** News headlines belong to their publishers. Videos belong to the YouTube channels that uploaded them. Team names, logos and competition names are trademarks of their owners. Live Cricket Zone is not affiliated with or endorsed by the ICC, BCCI, ECB, PCB, Cricket Australia or any other governing body, league or broadcaster.",
      ],
    },
    { type: "h2", text: "4. Acceptable use" },
    {
      type: "ul",
      items: [
        "Do not use automated tools to extract data from the site at a rate that affects other users.",
        "Do not attempt to gain unauthorised access to any part of the site or its infrastructure.",
        "Do not use the site for any unlawful purpose or to transmit malicious code.",
        "Do not republish our guides without permission.",
      ],
    },
    { type: "h2", text: "5. Advertising and external links" },
    {
      type: "p",
      text: "The site shows advertisements served by Google AdSense; we are not responsible for the content of advertisements or of external sites we link to. Our [privacy policy](/privacy-policy) explains how advertising cookies work.",
    },
    { type: "h2", text: "6. Disclaimer and liability" },
    {
      type: "p",
      text: "The site is provided \"as is\" without warranty of any kind. To the fullest extent permitted by law, Live Cricket Zone is not liable for any loss arising from your use of, or inability to use, the site or from reliance on any information on it.",
    },
    { type: "h2", text: "7. Copyright complaints" },
    {
      type: "p",
      text: "If you believe content on the site infringes your rights, please follow the process on our [DMCA and copyright page](/dmca-copyright).",
    },
    { type: "h2", text: "8. Changes and governing law" },
    {
      type: "p",
      text: "We may update these terms; the date at the top shows the current version and continued use means acceptance. These terms are governed by the laws of the country in which the site's operator is established, and disputes are subject to the courts of that country.",
    },
  ],
};

// ─── DMCA / copyright ─────────────────────────────────────────────────────────

const DMCA = {
  h1: "DMCA & Copyright Policy",
  lede: `Last updated ${LAST_REVIEWED}. Send notices to [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) with the subject "Copyright notice".`,
  blocks: [
    {
      type: "callout",
      text: "Live Cricket Zone respects intellectual property rights and responds to valid notices promptly. Nothing on the site is hosted video: all clips are embedded from YouTube and remain on YouTube's servers.",
    },
    { type: "h2", text: "1. What is on the site and where it comes from" },
    {
      type: "ul",
      items: [
        "**Guides** are written by us and are our copyright.",
        "**Scores, scorecards and statistics** are facts collected from publicly available sources. Facts are not protected by copyright, but if you believe we are reproducing a protected database in a way that infringes your rights, tell us and we will review it.",
        "**News headlines** are shown with the publisher's name and link to the original article. We do not reproduce article text.",
        "**Videos** are embedded from YouTube using YouTube's official embed player. We do not host, download, re-upload or alter any video.",
        "**Team badges and images** may be loaded from the public image servers of the data sources named on the relevant page. If you own such an image and object, tell us and we will remove it.",
      ],
    },
    { type: "h2", text: "2. Embedded videos" },
    {
      type: "p",
      text: "Because videos remain on YouTube, the fastest way to have one removed everywhere is to use [YouTube's copyright complaint process](https://support.google.com/youtube/answer/2807622). Once YouTube removes a video it stops appearing here automatically. You can also ask us directly and we will remove the embed within two working days of a valid notice.",
    },
    { type: "h2", text: "3. How to send a valid notice" },
    {
      type: "p",
      text: "Email us with the subject \"Copyright notice\" and include:",
    },
    {
      type: "ol",
      items: [
        "Your full name and contact details (email address, and postal address or telephone number).",
        "Identification of the copyrighted work you say has been infringed.",
        "The exact URL on livecricketzone.com where the material appears.",
        "For a video, the YouTube URL of the embedded clip.",
        "A statement that you have a good-faith belief the use is not authorised by the copyright owner, its agent or the law.",
        "A statement, under penalty of perjury, that the information in the notice is accurate and that you are the owner or authorised to act for the owner.",
        "Your physical or electronic signature.",
      ],
    },
    {
      type: "p",
      text: "We acknowledge receipt within two working days and act on valid notices within two working days of acknowledgement.",
    },
    { type: "h2", text: "4. Counter-notice" },
    {
      type: "p",
      text: "If material you posted was removed and you believe that was a mistake, you may send a counter-notice containing your contact details, identification of the removed material and its former location, a statement under penalty of perjury that you believe the removal was a mistake, and your consent to the jurisdiction of the competent court.",
    },
    { type: "h2", text: "5. Repeat infringers" },
    {
      type: "p",
      text: "We will disable access for users or automated processes that repeatedly infringe intellectual property rights.",
    },
  ],
};

// ─── Short intros for data-driven pages ──────────────────────────────────────
// Rendered above the live data on both the server and the client so a page
// whose feed is empty (off-season, upstream outage) still says something
// honest and useful instead of a bare spinner.

const PAGE_INTROS = {
  "/live": {
    h1: "Live Cricket Scores",
    blocks: [
      {
        type: "p",
        text: "Every cricket match in progress right now, followed by the most recent results and the next fixtures. Scores refresh automatically while a match is on. Open a match for the full scorecard, fall of wickets and partnerships.",
      },
      {
        type: "p",
        text: "New to reading a scorecard? Our guides explain [what every column means](/guides/how-to-read-a-cricket-scorecard), [how a rain-affected target is set](/guides/dls-method-explained) and [how net run rate separates tied teams](/guides/net-run-rate-explained).",
      },
    ],
    empty: "No cricket match is in progress at the moment. Recent results and upcoming fixtures are listed below, and the schedule page shows the days ahead.",
  },
  "/upcoming": {
    h1: "Upcoming Cricket Matches",
    blocks: [
      {
        type: "p",
        text: "Fixtures that have not started yet, grouped by date, with venue and start time. The list covers international series, ICC events and the franchise leagues that publish a public schedule. Times are shown in your device's time zone.",
      },
    ],
    empty: "No upcoming fixtures are available from the data feed at the moment. This usually clears within a few minutes; the schedule page groups fixtures by day.",
  },
  "/results": {
    h1: "Recent Cricket Results",
    blocks: [
      {
        type: "p",
        text: "Matches that finished most recently, with the final scores and the result line. Open any match for the full scorecard. For how results are worded in cricket (won by runs, won by wickets, DLS, tie, no result) see the [scorecard guide](/guides/how-to-read-a-cricket-scorecard).",
      },
    ],
    empty: "No completed matches are in the current feed. Results appear here as soon as a match ends.",
  },
  "/schedule": {
    h1: "Cricket Schedule",
    blocks: [
      {
        type: "p",
        text: "The cricket calendar grouped by day and by series. International tours, ICC tournaments and franchise leagues are listed together so you can see what is on each day. Open a fixture for its match page, which fills with the scorecard once play begins.",
      },
    ],
    empty: "The schedule feed is empty at the moment. Please check back shortly.",
  },
  "/series": {
    h1: "Cricket Series & Tournaments",
    blocks: [
      {
        type: "p",
        text: "Current and upcoming series: bilateral tours, ICC events, and domestic and franchise competitions. Each series page shows its schedule, results, points table and leading performers. Use the search box to find a series by name.",
      },
    ],
    empty: "No series data is available right now.",
  },
  "/teams": {
    h1: "Cricket Teams",
    blocks: [
      {
        type: "p",
        text: "International sides, franchise teams, domestic teams and women's teams. Open a team for its recent and upcoming matches and player list.",
      },
    ],
    empty: "Team data is unavailable right now.",
  },
  "/players": {
    h1: "Cricket Players",
    blocks: [
      {
        type: "p",
        text: "Search for a player to open a profile with career batting and bowling figures across formats. Career statistics are collected from public sources and refreshed periodically. For what the numbers mean, read [batting average, strike rate and economy explained](/guides/batting-average-strike-rate-economy-explained).",
      },
    ],
    empty: "No players matched that search.",
  },
  "/rankings": {
    h1: "ICC Cricket Rankings",
    blocks: [
      {
        type: "p",
        text: "The ICC's official player and team rankings for men's and women's cricket, by format. Rankings are collected from public sources and refreshed daily; the ICC publishes updates after each series or, during dense periods, weekly.",
      },
      {
        type: "p",
        text: "Rating points are not averages. A batter's rating weights each innings by the quality of the bowling attack, the match result and the run total in the game; a bowler's by the quality of the batters dismissed and the runs conceded. Older matches decay in weight. Our guide explains [how ICC rankings are calculated](/guides/icc-rankings-explained).",
      },
    ],
    empty: "Ranking data is unavailable for this selection right now.",
  },
  "/stats": {
    h1: "Cricket Stats",
    blocks: [
      {
        type: "p",
        text: "Look up any cricketer's career figures and see who currently leads the ICC batting and bowling rankings in each format. Statistics are collected from public sources; where a figure is unavailable the section says so rather than showing an old snapshot.",
      },
    ],
    empty: "Statistics are unavailable right now.",
  },
  "/news": {
    h1: "Cricket News Headlines",
    blocks: [
      {
        type: "p",
        text: "A curated feed of the latest cricket headlines from established publishers. Every item names its source and links to the original report; we do not republish or rewrite articles. For explanations rather than news, see our [guides](/guides).",
      },
    ],
    empty: "The headline feed is empty right now. Please check back shortly.",
  },
  "/videos": {
    h1: "Cricket Highlights",
    blocks: [
      {
        type: "p",
        text: "Official post-match highlights embedded from rights holders' YouTube channels, such as the IPL, ICC, ECB and Cricket Australia. Live Cricket Zone does not host or stream any match; to watch live, use your licensed broadcaster. Clips that are live broadcasts are filtered out.",
      },
    ],
    empty: "No highlight clips are available for this selection right now.",
  },
  "/games": {
    h1: "Cricket Games",
    blocks: [
      {
        type: "p",
        text: "Four free browser games: a timing-based batting challenge, a cricket trivia quiz, a memory-match puzzle and Kachuful, the Indian trick-taking card game also known as Judgement, which you can play against the computer or with friends in a private room. No downloads, no accounts, no money.",
      },
    ],
  },
  "/fantasy": {
    h1: "Fantasy Cricket Strategy",
    blocks: [
      {
        type: "p",
        text: "How fantasy cricket scoring typically works and how experienced players think about captaincy, pitch conditions and player roles. This page is an explainer only: Live Cricket Zone does not operate or promote any real-money fantasy or betting product.",
      },
    ],
  },
};

const NOT_FOUND = {
  h1: "Page not found",
  text: "The page you asked for does not exist or has moved. Try the live scores, the schedule or the guides library.",
};

module.exports = {
  LAST_REVIEWED,
  HOME,
  ABOUT,
  CONTACT,
  EDITORIAL,
  PRIVACY,
  TERMS,
  DMCA,
  PAGE_INTROS,
  NOT_FOUND,
};
