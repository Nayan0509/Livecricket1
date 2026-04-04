# 🔄 How to See the New News Integration

## The Problem
You don't see the new news integration because the server needs to be restarted to load the updated code.

## Quick Steps to See Changes

### Step 1: Test the News API (Optional)
```bash
cd cricket-live/server
node test-news.js
```

This will show you if the free news API is working.

### Step 2: Restart Your Server
```bash
# Stop your current server (Ctrl+C in the terminal)

# Then restart it:
cd cricket-live/server
npm run dev
```

### Step 3: Clear Browser Cache & Reload
```bash
# In your browser:
# - Press Ctrl+Shift+R (Windows/Linux)
# - Or Cmd+Shift+R (Mac)
# - Or open DevTools (F12) → Network tab → Check "Disable cache"
```

### Step 4: Visit the News Page
Open: http://localhost:3000/news

## What You Should See

### Before (Old):
- Match updates displayed as news cards
- Team logos and match information
- "Match Updates" as the source

### After (New):
- Real cricket news articles with images
- News from ESPN, Cricinfo, Times of India, etc.
- Article descriptions and author names
- External links to full articles
- Published dates
- Source attribution

## How to Verify It's Working

1. **Check Server Logs**: You should see:
   ```
   ✓ Fetched X cricket news from proxy
   ```

2. **Check News Cards**: They should have:
   - News article images (not team logos)
   - Longer descriptions
   - Source names like "ESPN Cricinfo", "Times of India"
   - External links (clicking opens in new tab)

3. **Check API Response**: Visit http://localhost:5000/api/news
   - Should show `"sources": "live"` (not "fallback")
   - Articles should have `url`, `image`, `author` fields

## Troubleshooting

### If you still see match updates:
1. Make sure you restarted the server
2. Check server logs for errors
3. Try: `curl http://localhost:5000/api/news` to see raw API response

### If you see errors:
1. Check that axios is installed: `npm list axios`
2. Check internet connection (needs to fetch from external API)
3. Look at server console for error messages

### If images don't load:
- This is normal - some news sources block external image loading
- The news will still work, just without images

## Files That Changed

1. ✅ `server/routes/news.js` - Now fetches real cricket news
2. ✅ `client/src/pages/News.jsx` - Displays news articles properly
3. ✅ `server/.env.example` - Added optional NewsAPI key
4. ✅ `README.md` - Updated with news API info
5. ✅ `FREE_APIs.md` - Complete API documentation

## Optional: Add NewsAPI.org Key

For even more news sources (100 extra requests/day):

1. Sign up at https://newsapi.org (free)
2. Get your API key
3. Add to `server/.env`:
   ```
   NEWSAPI_KEY=your_key_here
   ```
4. Restart server

## Need Help?

If it's still not working:
1. Share your server console output
2. Share what you see at http://localhost:5000/api/news
3. Check if the test script works: `node test-news.js`

---

**Remember**: Always restart the server after changing backend code!
