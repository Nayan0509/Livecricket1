const axios = require("axios");

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
};

async function checkHTML() {
  try {
    const { data: html } = await axios.get("https://www.cricbuzz.com/live-cricket-scorecard/148459", { headers, timeout: 10000 });
    
    console.log("HTML length:", html.length);
    console.log("\nSearching for various keys:");
    console.log("- scoreCard:", html.includes("scoreCard"));
    console.log("- batTeamDetails:", html.includes("batTeamDetails"));
    console.log("- batsmenData:", html.includes("batsmenData"));
    console.log("- bowlersData:", html.includes("bowlersData"));
    console.log("- innings:", html.includes("innings"));
    console.log("- matchId:", html.includes("matchId"));
    console.log("- 148459:", html.includes("148459"));
    
    // Find a sample of what's in the HTML
    const sampleIdx = html.indexOf("148459");
    if (sampleIdx !== -1) {
      console.log("\nSample around match ID:");
      console.log(html.substring(Math.max(0, sampleIdx - 100), sampleIdx + 200));
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkHTML();
