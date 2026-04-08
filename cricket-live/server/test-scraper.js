const {
  scrapeCricbuzzLiveMatches,
  scrapeEspnLiveMatches,
  scrapeCricbuzzScorecard,
  getLiveMatchesWithFallback
} = require("./utils/scraper");

async function testScrapers() {
  console.log("🏏 Testing Cricket Scrapers...\n");

  // Test Cricbuzz live matches
  console.log("1️⃣ Testing Cricbuzz Live Matches:");
  try {
    const cricbuzzMatches = await scrapeCricbuzzLiveMatches();
    console.log(`✅ Found ${cricbuzzMatches.length} matches from Cricbuzz`);
    if (cricbuzzMatches.length > 0) {
      console.log("Sample match:", JSON.stringify(cricbuzzMatches[0], null, 2));
    }
  } catch (error) {
    console.log("❌ Cricbuzz failed:", error.message);
  }

  console.log("\n2️⃣ Testing ESPNcricinfo Live Matches:");
  try {
    const espnMatches = await scrapeEspnLiveMatches();
    console.log(`✅ Found ${espnMatches.length} matches from ESPNcricinfo`);
    if (espnMatches.length > 0) {
      console.log("Sample match:", JSON.stringify(espnMatches[0], null, 2));
    }
  } catch (error) {
    console.log("❌ ESPNcricinfo failed:", error.message);
  }

  console.log("\n3️⃣ Testing Fallback Strategy:");
  try {
    const matches = await getLiveMatchesWithFallback();
    console.log(`✅ Fallback returned ${matches.length} matches`);
    console.log(`Source: ${matches[0]?.source || "unknown"}`);
  } catch (error) {
    console.log("❌ All sources failed:", error.message);
  }

  console.log("\n✨ Testing complete!");
}

testScrapers();
