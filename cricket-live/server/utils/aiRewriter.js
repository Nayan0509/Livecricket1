const NodeCache = require("node-cache");

// Cache generated articles for 24 hours
const articleCache = new NodeCache({ stdTTL: 86400 });

/**
 * Generates an SEO-optimised cricket article from headline + description.
 * Zero external API dependencies — uses smart template expansion.
 */
async function generateArticle(title, description, source) {
  const cacheKey = `article:${title}`;
  const cached = articleCache.get(cacheKey);
  if (cached) return cached;

  const article = buildArticle(title, description, source);
  articleCache.set(cacheKey, article);
  return article;
}

function buildArticle(title, description, source) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const topic = detectTopic(title);
  const players = extractPlayers(title + " " + description);

  const intro = description
    ? `<p>${description}</p>`
    : `<p>In one of the most anticipated ${topic} matches, cricket fans across the globe are keeping a close eye on the latest developments as the action unfolds live.</p>`;

  const context = buildContextBlock(topic, title);
  const analysis = buildAnalysisBlock(topic, players, title);
  const outlook = buildOutlookBlock(topic);

  const content = [intro, context, analysis, outlook].join("\n\n");

  return {
    title: title.length > 80 ? title : enhanceHeadline(title),
    content,
    tags: buildTags(topic, title, players),
    source,
    datePublished: now.toISOString(),
    isGenerated: true,
    wordCount: content.replace(/<[^>]+>/g, " ").split(/\s+/).length,
  };
}

function detectTopic(text) {
  const t = text.toLowerCase();
  if (t.includes("ipl")) return "IPL";
  if (t.includes("t20 world cup") || t.includes("t20wc")) return "T20 World Cup";
  if (t.includes("champions trophy")) return "Champions Trophy";
  if (t.includes("world cup") || t.includes("cwc")) return "ODI World Cup";
  if (t.includes("ashes")) return "The Ashes";
  if (t.includes("psl")) return "PSL";
  if (t.includes("bbl")) return "BBL";
  if (t.includes("t20")) return "T20";
  if (t.includes("test match") || t.includes("test cricket")) return "Test Cricket";
  if (t.includes("odi")) return "ODI Cricket";
  return "Cricket";
}

function extractPlayers(text) {
  const known = [
    "Virat Kohli", "Rohit Sharma", "Hardik Pandya", "MS Dhoni",
    "Rishabh Pant", "Shubman Gill", "Yashasvi Jaiswal", "KL Rahul",
    "Jasprit Bumrah", "Ravindra Jadeja", "Axar Patel",
    "Pat Cummins", "Steve Smith", "David Warner", "Travis Head",
    "Jos Buttler", "Ben Stokes", "Joe Root", "Jonny Bairstow",
    "Babar Azam", "Mohammad Rizwan", "Shaheen Afridi",
    "Heinrich Klaasen", "Kagiso Rabada", "Quinton de Kock",
    "Mitchell Marsh", "Glenn Maxwell", "Kane Williamson",
    "Sunil Narine", "Andre Russell",
  ];
  return known.filter(p => text.toLowerCase().includes(p.toLowerCase()));
}

function buildContextBlock(topic, title) {
  const contexts = {
    IPL: `<p>The Indian Premier League continues to captivate the cricketing world with its unique blend of international stars and emerging talent. As one of the most-watched sporting leagues globally, the IPL 2026 season has already delivered extraordinary moments of skill, drama, and fierce competition. With ten franchises battling for supremacy across 84 matches, every game carries enormous weight in the points table standings.</p>`,
    "T20 World Cup": `<p>The T20 World Cup is the pinnacle of franchise-free T20 cricket, bringing together nations in a sprint-format tournament where any team can triumph on any given day. Rapid scoring rates, death bowling innovations and match-defining moments in the powerplay have made this format a global spectacle.</p>`,
    "Champions Trophy": `<p>The ICC Champions Trophy is elite ODI cricket at its finest — featuring the world's top eight ranked nations competing for one of cricket's most prestigious trophies. With limited overs and high stakes, tactical masterclasses from captains and pivotal individual performances often decide the tournament's outcome.</p>`,
    "Test Cricket": `<p>Test cricket remains the ultimate examination of cricketing skill and character. Spanning five days across up to 450 overs of play, Test matches challenge batsmen's technique and bowlers' endurance in ways no other format can. The ebb and flow of a Test match — sessions lost and won, weathered comebacks, and last-wicket defiances — gives the format an emotional depth unmatched in sport.</p>`,
    "ODI Cricket": `<p>One Day Internationals represent cricket's most complete format — balanced between the patience of Test batting and the explosiveness of T20 — offering 50-over battles where momentum shifts are common and match-winning performances demand all-round excellence from the competing nations.</p>`,
    PSL: `<p>The Pakistan Super League has grown into one of world cricket's premier T20 competitions, showcasing Pakistani talent alongside international stars in stadium atmospheres that generate enormous passion. The league has played a significant role in reviving international cricket in Pakistan and developing the next generation of fast bowlers and big-hitting batsmen.</p>`,
    Cricket: `<p>Cricket, the sport played in over 100 nations and followed by over two billion fans globally, continues to produce moments of genius, heartbreak, and brilliance. From the precision of a yorker to the elegance of a cover drive, every match writes new chapters in the sport's rich history.</p>`,
  };
  return contexts[topic] || contexts["Cricket"];
}

function buildAnalysisBlock(topic, players, title) {
  const playerMentions = players.length > 0
    ? `<p>Key performers to watch include ${players.slice(0, 3).join(", ")} ${players.length > 3 ? `and ${players.length - 3} other star ${players.length - 3 === 1 ? "player" : "players"}` : ""} who have been in exceptional form this season. Their contributions with both bat and ball will likely be decisive as the match progresses.</p>`
    : `<p>Both sides boast match-winners capable of turning the game on its head — the battle between bat and ball promises to be highly competitive, with conditions likely playing a significant role in the final outcome.</p>`;

  const titleContext = `<p>This latest development — ${title.toLowerCase().replace(/[.!?]$/, "")} — adds another compelling chapter to what has already been an action-packed season. Fans following the live score on Live Cricket Zone can track every ball, every run, and every wicket as it happens, with updates refreshed every 15 seconds.</p>`;

  return [playerMentions, titleContext].join("\n\n");
}

function buildOutlookBlock(topic) {
  return `<p>Cricket fans can follow all the live action, ball-by-ball commentary, scorecard, and match analysis exclusively on Live Cricket Zone — completely free, with no sign-up required. For ${topic} fixtures, schedules, points tables, and player statistics, navigate to the relevant section from our homepage. Whether you're watching from India, Pakistan, England, Australia, or anywhere in the cricket-following world, Live Cricket Zone has you covered in real time.</p>`;
}

function enhanceHeadline(title) {
  if (title.endsWith("?") || title.endsWith("!")) return title;
  if (title.toLowerCase().includes("vs")) return title + " — Live Score & Match Preview";
  if (title.toLowerCase().includes("wins") || title.toLowerCase().includes("won")) return title + " — Match Report";
  return title + " — Analysis & Updates";
}

function buildTags(topic, title, players) {
  const base = ["Cricket", "Live Cricket", topic];
  const titleWords = title.split(" ").filter(w => w.length > 5 && /^[A-Z]/.test(w));
  const playerTags = players.slice(0, 3);
  return [...new Set([...base, ...playerTags, ...titleWords.slice(0, 3)])].slice(0, 8);
}

module.exports = { generateArticle };
