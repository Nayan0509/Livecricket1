# Vercel Deployment Fix - Live Scores Not Showing

## Problem
Live cricket scores work locally but show "No Live Coverage" on Vercel deployment.

## Root Cause
The serverless function (`api/index.js`) had different web scraping selectors than the local server (`server/utils/scraper.js`), causing it to fail at extracting match data from Cricbuzz.

## What Was Fixed

### 1. Updated Web Scraping Selectors
Synchronized the Vercel serverless function with the working local server implementation:
- Added `cleanTeamAndScore()` helper function
- Added `parseScore()` helper function  
- Updated `getLiveMatches()` to use correct DOM selectors
- Changed from `$card.find("div.cb-hmscg-tm-nm")` to `$card.find("> div:nth-child(2) > div")`

### 2. Improved Error Handling
- Added console logging for debugging
- Increased timeout from 8s to 10s
- Better error messages

### 3. Enhanced News Fetching
- Updated RSS query to include "IPL T20 World Cup" for better results
- Added description extraction from RSS feed
- Added `publishedAt` timestamp

## Deploy the Fix

### Option 1: Automatic Deployment (Recommended)
```bash
# Commit and push changes
git add cricket-live/api/index.js
git commit -m "Fix: Sync Vercel scraper with local server implementation"
git push origin main
```

Vercel will automatically redeploy when you push to GitHub.

### Option 2: Manual Deployment via CLI
```bash
cd cricket-live
vercel --prod
```

## Verify the Fix

After deployment, test these endpoints:

1. **Health Check**
   ```
   https://your-domain.vercel.app/api/health
   ```
   Should return: `{"status":"ok","mode":"Scale Up Enterprise","dependencyFree":true}`

2. **Live Matches**
   ```
   https://your-domain.vercel.app/api/matches/live
   ```
   Should return: `{"status":"success","data":[...]}`

3. **News Feed**
   ```
   https://your-domain.vercel.app/api/news
   ```
   Should return: `{"status":"success","data":[...]}`

## Check Vercel Logs

If issues persist, check the logs:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click on the latest deployment
4. Click "Functions" tab
5. Click on `api/index.js`
6. View the logs for error messages

Look for:
- `Scraped X live matches from Cricbuzz` (success)
- `Live matches scrape failed: ...` (error with details)

## Common Issues

### Issue: Still showing "No Live Coverage"

**Possible causes:**
1. Cricbuzz changed their HTML structure
2. Vercel IP blocked by Cricbuzz
3. No live matches currently happening

**Debug steps:**
1. Check if there are actually live matches on https://www.cricbuzz.com/cricket-match/live-scores
2. Check Vercel function logs for scraping errors
3. Test the API endpoint directly in browser

### Issue: CORS errors

**Solution:** Already handled in the code with:
```javascript
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
```

### Issue: Function timeout

**Solution:** Vercel free tier has 10s timeout. If scraping takes longer:
1. Increase `maxDuration` in `vercel.json` (requires paid plan)
2. Or optimize scraping code further

## Architecture Notes

### Local Development
- Uses Express server (`server/index.js`)
- Routes in `server/routes/matches.js`
- Scraper in `server/utils/scraper.js`
- Runs on `localhost:5000`

### Production (Vercel)
- Uses serverless function (`api/index.js`)
- Single file handles all routes
- Must be self-contained (no external route files)
- Runs on Vercel edge network

### Key Difference
The local server and Vercel function must use the SAME scraping logic, but they're in separate files. This fix ensures they're synchronized.

## Testing Locally Before Deploy

You can test the serverless function locally:

```bash
cd cricket-live
vercel dev
```

Then visit:
- http://localhost:3000/api/matches/live
- http://localhost:3000/api/news

## Next Steps

1. Deploy the fix
2. Monitor Vercel logs for 24 hours
3. If Cricbuzz blocks Vercel IPs, consider:
   - Using a proxy service
   - Switching to a paid cricket API
   - Implementing a fallback data source

## Support

If issues persist after deploying this fix:
1. Check Vercel function logs
2. Verify Cricbuzz website structure hasn't changed
3. Test with different cricket matches (some may have different HTML)
