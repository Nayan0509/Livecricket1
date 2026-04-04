// Quick test script for news API
const axios = require("axios");

async function testNewsAPI() {
  console.log("🧪 Testing News API Integration...\n");

  try {
    // Test 1: Free NewsAPI Proxy
    console.log("1️⃣ Testing Free NewsAPI Proxy (no key needed)...");
    const proxyResponse = await axios.get(
      "https://saurav.tech/NewsAPI/top-headlines/category/sports/in.json",
      { timeout: 5000 }
    );
    
    if (proxyResponse.data && proxyResponse.data.articles) {
      const cricketNews = proxyResponse.data.articles.filter(article => {
        const text = `${article.title} ${article.description || ""}`.toLowerCase();
        return text.includes("cricket") || text.includes("ipl") || 
               text.includes("t20") || text.includes("odi");
      });
      
      console.log(`✅ Success! Found ${cricketNews.length} cricket articles`);
      console.log("\nSample articles:");
      cricketNews.slice(0, 3).forEach((article, i) => {
        console.log(`\n${i + 1}. ${article.title}`);
        console.log(`   Source: ${article.source?.name}`);
        console.log(`   URL: ${article.url}`);
      });
    }
  } catch (error) {
    console.log("❌ Failed:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n✅ Test complete! Now restart your server:");
  console.log("   cd server");
  console.log("   npm run dev");
  console.log("\nThen visit: http://localhost:3000/news\n");
}

testNewsAPI();
