const {
  getLiveMatchesWithFallback,
  scrapeCricbuzzScorecard,
  getScaledData
} = require("./utils/scraper");

async function testScrapers() {
  console.log("🏏 Testing Cricket Scrapers (Scale Up)...\n");

  console.log("1️⃣ Testing Live Matches (Fallback Strategy):");
  try {
    const matches = await getLiveMatchesWithFallback();
    console.log(`✅ Found ${matches.length} matches`);
    if (matches.length > 0) {
      console.log("Sample match structure:", JSON.stringify(matches[0], null, 2));
    }
  } catch (error) {
    console.log("❌ Live matches failed:", error.message);
  }

  console.log("\n2️⃣ Testing News (Scale Up):");
  try {
    const newsData = await getScaledData("news");
    console.log(`✅ Found ${newsData.data.length} news items`);
  } catch (error) {
    console.log("❌ News failed:", error.message);
  }

  console.log("\n✨ Testing complete!");
}

testScrapers();

