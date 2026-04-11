const cheerio = require('cheerio');
const axios = require('axios');

async function test() {
  const { data } = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", { headers: {"User-Agent": "Mozilla/5.0"} });
  const $ = cheerio.load(data);
  const seenIds = new Set();
  
  $("a[href^='/live-cricket-scores/']").each((i, elem) => {
        const $card = $(elem);
        const url = $card.attr("href");
        if (!url) return;
        
        const id = url.split("/")[2];
        const allText = $card.text().trim();
        if (!allText || allText.includes("Live Score") || allText.includes("Scorecard") || allText.includes("Commentary")) return;
        
        if (seenIds.has(id)) return;
        seenIds.add(id);
        
        const matchSlug = url.split("/")[3] || "";
        const teamMatch = matchSlug.match(/([a-z0-9]+)-vs-([a-z0-9]+)/i);
        if (!teamMatch) return;
        
        let status = allText;
        const parts = allText.split(" - ");
        if (parts.length > 1) {
           status = parts[1].trim();
        }
        
        if (status === allText) {
           if (status.match(/won/i)) status = status;
           else if (url.includes('live')) status = "Live / Match Overview";
        }
  
        if (status === "Live Score" || status === "Scheduled") status = "Upcoming / Live";
        
        const statusLower = status.toLowerCase();
        let category = "live";
        
        if (statusLower.match(/won\s*(by|$|ov)/) || 
            statusLower.includes("drawn") || 
            statusLower.includes("tied") ||
            statusLower.includes("abandoned") ||
            statusLower.includes("no result") ||
            statusLower.includes("stumps")) {
          if (statusLower.includes("stumps")) category = "live";
          else category = "recent";
        } else if (statusLower.includes("preview") || statusLower.includes("upcoming") || (statusLower.includes("match") && !statusLower.match(/\d+\/\d+/) && !statusLower.includes("live") && !statusLower.includes("overview"))) {
          category = "upcoming";
        } else {
          category = "live";
        }
        
        console.log(`[${category.toUpperCase()}] ${allText} (Status: ${status})`);
  });
}
test();
