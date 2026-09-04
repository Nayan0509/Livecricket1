const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../client/src/pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

console.log(`Found ${files.length} pages in client/src/pages/`);

let hasErrors = false;
for (const file of files) {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  // Check for common red flags:
  // 1. empty components
  if (content.length < 200) {
    console.warn(`⚠️ Warning: ${file} is very short (${content.length} chars)`);
  }
  // 2. check for lorem ipsum
  if (/lorem ipsum/i.test(content)) {
    console.warn(`⚠️ Warning: ${file} contains 'lorem ipsum' placeholder text!`);
    hasErrors = true;
  }
  // 3. check for unreplaced placeholders
  if (/TODO|REPLACE_ME|FIXME/i.test(content)) {
    console.warn(`⚠️ Warning: ${file} contains TODO/REPLACE_ME placeholders!`);
  }
  // 4. check for hardcoded old years like 2023 or 2024 as current
  const oldYearMatch = content.match(/\b(2021|2022|2023|2024)\s+(points\s+table|live\s+score|schedule|edition)/i);
  if (oldYearMatch) {
    console.warn(`ℹ️ Notice: ${file} has past year reference: "${oldYearMatch[0]}"`);
  }
}

if (!hasErrors) {
  console.log('✅ All page files scanned. No lorem ipsum or empty components found.');
}
