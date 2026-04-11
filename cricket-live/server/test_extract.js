const cheerio = require('cheerio');
const axios = require('axios');

async function test() {
  const { data } = await axios.get("https://www.cricbuzz.com/cricket-match/live-scores", { headers: {"User-Agent": "Mozilla/5.0"} });
  
  const plainText = data.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  const typeMatchesIndex = plainText.indexOf('"typeMatches":[');
  
  if (typeMatchesIndex === -1) {
    console.log("No typeMatches found");
    return;
  }
  
  let brackets = 0;
  let startIdx = typeMatchesIndex + 14; 
  let endIdx = -1;
  const chars = plainText.split('');
  
  for (let i = startIdx; i < chars.length; i++) {
     if (chars[i] === '[') brackets++;
     if (chars[i] === ']') {
        brackets--;
        if (brackets === 0) {
            endIdx = i;
            break;
        }
     }
  }
  
  if (endIdx > -1) {
     const jsonStr = plainText.substring(startIdx, endIdx + 1);
     try {
       const typeMatches = JSON.parse(jsonStr);
       let matchesCount = 0;
       let hasScores = 0;
       
       typeMatches.forEach(typeMatch => {
          if (typeMatch.seriesMatches) {
             typeMatch.seriesMatches.forEach(series => {
                const s = series.seriesAdWrapper || series;
                if (s.matches) {
                   s.matches.forEach(matchObj => {
                      matchesCount++;
                      const info = matchObj.matchInfo;
                      const score = matchObj.matchScore;
                      if (score) hasScores++;
                   });
                }
             });
          }
       });
       console.log("Success! Total Matches:", matchesCount, "Matches with Score:", hasScores);
     } catch(e) {
       console.error("JSON PARSE ERROR", e.message);
     }
  }
}
test();
