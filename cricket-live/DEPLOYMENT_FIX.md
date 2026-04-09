# Homepage Deployment Fix

## Issues Fixed

1. **Deprecated url.parse() warnings** - Replaced with modern URL constructor
2. **Vercel rewrite configuration** - Simplified API routing from `/api/:path*` to `/api/(.*)`
3. **Path extraction logic** - Cleaned up URL parsing in serverless function
4. **Enhanced logging** - Added detailed console logs for debugging

## Changes Made

### 1. vercel.json
- Changed rewrite from `/api/:path*` with query params to `/api/(.*)` direct routing
- This ensures all `/api/*` requests are properly routed to the serverless function

### 2. api/index.js
- Replaced deprecated `url.parse()` with `URL` constructor
- Simplified path extraction logic
- Added comprehensive logging for debugging
- Better error handling for news endpoint
- Enhanced scraper logging to track match extraction

## Deploy to Vercel

### Quick Deploy (Recommended)
```bash
cd cricket-live
git add .
git commit -m "fix: resolve homepage API routing and deprecation warnings"
git push origin main
```

Vercel will auto-deploy from your GitHub repository.

### Manual Deploy
```bash
cd cricket-live
vercel --prod
```

## Testing After Deployment

### 1. Test API Endpoints Directly

Open these URLs in your browser (replace `your-domain.vercel.app` with your actual domain):

```
https://your-domain.vercel.app/api/health
https://your-domain.vercel.app/api/matches/live
https://your-domain.vercel.app/api/news
https://your-domain.vercel.app/api/matches/upcoming
```

Expected responses:
- `/api/health` → `{"status":"ok","mode":"Scale Up Enterprise","dependencyFree":true}`
- `/api/matches/live` → `{"status":"success","data":[...]}`
- `/api/news` → `{"status":"success","data":[...]}`

### 2. Check Vercel Function Logs

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click latest deployment
4. Go to "Functions" tab
5. Click `api/index.js`
6. View real-time logs

Look for these log messages:
```
[API] Request: GET /api/matches/live -> path: matches/live
[Scraper] Fetching live matches from Cricbuzz...
[Scraper] Found X potential match links
[Scraper] Successfully scraped X live matches from Cricbuzz
[API] Live matches endpoint: X matches
```

### 3. Test Homepage

Visit your homepage and check:
- Live matches section should show matches (if any are live)
- News section should show cricket news from Google News
- No console errors in browser DevTools
- No deprecation warnings in Vercel logs

## Troubleshooting

### Issue: Still showing "No Live Coverage"

**Check:**
1. Are there actually live matches? Visit https://www.cricbuzz.com/cricket-match/live-scores
2. Check Vercel logs for scraping errors
3. Test API endpoint directly: `/api/matches/live`

**If API returns empty array:**
- Cricbuzz may have changed their HTML structure
- Vercel IP might be blocked (try using a proxy)
- No matches are currently live

### Issue: API returns 404

**Check:**
1. Verify `vercel.json` rewrites are correct
2. Ensure `api/index.js` exists in the repository
3. Check Vercel build logs for errors

### Issue: CORS errors in browser

**Solution:** Already handled in code:
```javascript
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
```

If still occurring, check browser console for specific error.

### Issue: Function timeout

**Symptoms:** Request takes >10 seconds and fails

**Solutions:**
1. Increase timeout in `vercel.json` (requires Pro plan):
   ```json
   "functions": {
     "api/index.js": { "memory": 256, "maxDuration": 30 }
   }
   ```
2. Optimize scraping code
3. Add caching (already implemented with 30s TTL)

## Local Testing

Test the serverless function locally before deploying:

```bash
cd cricket-live
vercel dev
```

Then visit:
- http://localhost:3000
- http://localhost:3000/api/matches/live
- http://localhost:3000/api/news

## Architecture

### Local Development
- Express server at `server/index.js`
- Runs on port 5000
- Uses `server/utils/scraper.js`

### Production (Vercel)
- Serverless function at `api/index.js`
- Self-contained (includes scraping logic)
- Runs on Vercel edge network
- 10s timeout (free tier)

## Next Steps

1. Deploy the changes
2. Monitor Vercel logs for 24 hours
3. If issues persist, consider:
   - Using a cricket API service (see `FREE_APIs.md`)
   - Implementing a proxy for Cricbuzz scraping
   - Adding fallback data sources

## Support

If homepage still fails after deployment:
1. Share Vercel function logs
2. Test API endpoints directly
3. Check if Cricbuzz HTML structure changed
4. Verify no IP blocking from Cricbuzz
