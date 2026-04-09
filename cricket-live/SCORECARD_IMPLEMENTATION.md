# Scorecard Implementation & Routing Guide

## Overview
This document outlines the complete scorecard scraping implementation and routing structure for the cricket live score application.

## What Was Implemented

### 1. Scorecard Scraping (Vercel Serverless Function)

**File:** `api/index.js`

Added three new scraping functions:

#### `getMatchInfo(matchId)`
- Scrapes match details from Cricbuzz
- Returns: team names, scores, status, venue, toss info
- Cached for 30 seconds
- Endpoint: `/api/matches/{matchId}`

#### `getMatchScorecard(matchId)`
- Scrapes detailed scorecard with innings data
- Returns: batting stats, bowling stats, extras, fall of wickets
- Cached for 30 seconds
- Endpoint: `/api/matches/{matchId}/scorecard`

#### `getLiveMatches()`
- Already existed, now synchronized with server implementation
- Returns: list of live matches with scores

### 2. API Routes Added

```
GET /api/matches/live              → Live matches list
GET /api/matches/{id}              → Match info
GET /api/matches/{id}/scorecard    → Full scorecard
GET /api/news                      → News feed
GET /api/health                    → Health check
```

### 3. Frontend Pages Enhanced

#### **Scorecard.jsx**
- Full scorecard view with innings tabs
- Batting and bowling tables
- Fall of wickets display
- Auto-refresh every 30 seconds

#### **MatchDetail.jsx**
- Match overview with team logos
- Live score display
- Tabs: Insights, Scorecard, Teams
- Quick scorecard preview in insights tab
- Toss information

#### **LiveScore.jsx** (Enhanced)
- Real-time score updates (15s refresh)
- Quick scorecard preview
- Navigation buttons to full scorecard
- Latest batting stats preview

#### **BallByBall.jsx**
- Links to live matches
- Ball-by-ball commentary page
- SEO optimized

#### **LiveCricketScore.jsx**
- SEO landing page for "live cricket score"
- Auto-refresh every 15 seconds
- Feature highlights
- Links to all live matches

#### **CricketScoreToday.jsx**
- SEO landing page for "cricket score today"
- Today's matches display
- Date-specific content

### 4. Routing Structure

**App.jsx** now includes:

```javascript
// Main pages
/ → Home
/live → LiveMatches
/live-cricket-score → LiveCricketScore (SEO)
/cricket-score-today → CricketScoreToday (SEO)
/ball-by-ball → BallByBall

// Match pages
/match/:id → MatchDetail
/match/:id/scorecard → Scorecard
/match/:id/live-score → LiveScore

// League pages
/ipl → IPL
/t20-world-cup → T20WorldCup
/psl → PSL
/bbl → BBL
... (all other leagues)
```

### 5. Navigation Flow

```
Home Page
  ↓ Click on Match Card
Match Detail (/match/:id)
  ↓ Click "Full Scorecard" button
Scorecard Page (/match/:id/scorecard)
  ↓ Or click "Live Score" button
Live Score Page (/match/:id/live-score)
```

### 6. Data Flow

```
User Request
  ↓
React Component (useQuery)
  ↓
API Function (api.js)
  ↓
Vercel Serverless Function (api/index.js)
  ↓
Web Scraping (Cricbuzz)
  ↓
Cache (30s TTL)
  ↓
Response to User
```

## Key Features

### Auto-Refresh
- Live matches: 30 seconds
- Live score page: 15 seconds
- Scorecard: 30 seconds

### Caching
- NodeCache with 30-second TTL
- Reduces load on Cricbuzz
- Faster response times

### Error Handling
- Graceful fallbacks for missing data
- Console logging for debugging
- User-friendly error messages

### SEO Optimization
- Dedicated landing pages for high-traffic keywords
- Structured data (Schema.org)
- Meta tags for social sharing
- Semantic HTML

## Testing Checklist

### Local Testing
```bash
# Terminal 1 - Start server
cd cricket-live/server
npm run dev

# Terminal 2 - Start client
cd cricket-live/client
npm start
```

Test these URLs:
- http://localhost:3000/
- http://localhost:3000/live
- http://localhost:3000/match/{id}
- http://localhost:3000/match/{id}/scorecard
- http://localhost:3000/match/{id}/live-score

### Production Testing (After Deploy)

1. **Live Matches**
   ```
   https://your-domain.com/api/matches/live
   ```
   Should return: `{"status":"success","data":[...]}`

2. **Match Info**
   ```
   https://your-domain.com/api/matches/12345
   ```
   Should return match details

3. **Scorecard**
   ```
   https://your-domain.com/api/matches/12345/scorecard
   ```
   Should return innings data

4. **Frontend Pages**
   - https://your-domain.com/live
   - https://your-domain.com/match/12345
   - https://your-domain.com/match/12345/scorecard
   - https://your-domain.com/live-cricket-score
   - https://your-domain.com/cricket-score-today

## Deployment Steps

### 1. Commit Changes
```bash
cd cricket-live
git add .
git commit -m "Add scorecard scraping and enhanced routing"
git push origin main
```

### 2. Vercel Auto-Deploy
Vercel will automatically deploy when you push to GitHub.

### 3. Verify Deployment
Check Vercel dashboard for deployment status and logs.

### 4. Test Endpoints
Use the testing checklist above.

## Troubleshooting

### Issue: Scorecard not loading

**Check:**
1. Vercel function logs for errors
2. Match ID is valid (from Cricbuzz)
3. Cricbuzz HTML structure hasn't changed

**Debug:**
```bash
# Check Vercel logs
vercel logs

# Test API endpoint directly
curl https://your-domain.com/api/matches/12345/scorecard
```

### Issue: Navigation not working

**Check:**
1. All routes are defined in App.jsx
2. All page components are imported
3. React Router is working

### Issue: Data not refreshing

**Check:**
1. useQuery refetchInterval is set
2. Cache TTL is appropriate
3. Network tab shows API calls

## Performance Optimization

### Current Setup
- Cache: 30 seconds
- Auto-refresh: 15-30 seconds
- Timeout: 10 seconds

### Recommendations
1. Increase cache for static data (teams, players)
2. Decrease refresh for live matches
3. Add loading skeletons
4. Implement service worker for offline support

## SEO Strategy

### High-Traffic Keywords
- "live cricket score" → /live-cricket-score
- "cricket score today" → /cricket-score-today
- "ball by ball cricket" → /ball-by-ball
- "IPL live score" → /ipl
- "T20 World Cup live" → /t20-world-cup

### Meta Tags
All pages include:
- Title (optimized for keywords)
- Description (compelling, keyword-rich)
- Keywords (relevant search terms)
- Open Graph tags (social sharing)
- Structured data (Schema.org)

### Internal Linking
- Home page links to all major sections
- Match cards link to match details
- Match details link to scorecard
- Breadcrumb navigation

## Future Enhancements

### Planned Features
1. Ball-by-ball commentary scraping
2. Player statistics
3. Team comparisons
4. Match predictions
5. Live chat/comments
6. Push notifications
7. PWA support
8. Dark/light theme toggle

### API Improvements
1. Add more data sources (fallbacks)
2. Implement rate limiting
3. Add authentication for premium features
4. WebSocket for real-time updates
5. GraphQL API

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify Cricbuzz website structure
3. Test API endpoints directly
4. Check browser console for errors
5. Review this documentation

## Summary

✅ Scorecard scraping implemented
✅ Match info scraping implemented
✅ All routes configured
✅ Navigation flow complete
✅ SEO pages created
✅ Auto-refresh enabled
✅ Error handling added
✅ Caching implemented
✅ Ready for deployment

Deploy and test!
