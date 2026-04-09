const { getScaledData } = require("./utils/scraper");

async function testScorecard() {
  console.log("Testing scorecard extraction for match 148459...\n");
  
  try {
    const result = await getScaledData("scorecard", { id: "148459" });
    console.log("Status:", result.status);
    console.log("Innings count:", result.data.innings.length);
    
    if (result.data.innings.length > 0) {
      console.log("\nFirst innings:");
      console.log("Team:", result.data.innings[0].team);
      console.log("Score:", result.data.innings[0].score);
      console.log("Batsmen count:", result.data.innings[0].batsmen.length);
      console.log("Bowlers count:", result.data.innings[0].bowlers.length);
      
      if (result.data.innings[0].batsmen.length > 0) {
        console.log("\nSample batsman:", result.data.innings[0].batsmen[0]);
      }
    } else {
      console.log("\nNo innings data found!");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testScorecard();
