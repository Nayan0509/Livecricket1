const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

async function test() {
  const { data } = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const $ = cheerio.load(data);
  let count = 0;
  
  const seenIds = new Set();
  
  $("a[href^='/live-cricket-scores/']").each((i, elem) => {
    const $card = $(elem);
    const url = $card.attr("href");
    const id = url.split("/")[2];
    
    // Only looking at the first time we see it
    if (seenIds.has(id)) return;
    seenIds.add(id);
    
    count++;
    
    const allText = $card.text().trim();
    const parentText = $card.parent().parent().text().trim().replace(/\s+/g, ' ');
    
    if (count < 15) {
      console.log(`ID: ${id}`);
      console.log(`URL: ${url}`);
      console.log(`Card Text:  "${allText}"`);
      console.log(`GrandParent Text: "${parentText.substring(0, 80)}"`);
      console.log('---');
    }
  });
}
test();
