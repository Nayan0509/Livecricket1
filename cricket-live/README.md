# 🏏 CricLive — Live Cricket Scoring Platform

## Free APIs Used
| API | Free Tier | Sign Up | Status |
|-----|-----------|---------|--------|
| [CricketData.org](https://cricketdata.org) | 100 req/day | https://cricketdata.org | ✅ Required |
| [Free Cricbuzz via RapidAPI](https://rapidapi.com/Creativesdev/api/free-cricbuzz-cricket-api) | 500 req/month | https://rapidapi.com | ✅ Required |
| [NewsAPI Proxy](https://github.com/SauravKanchan/NewsAPI) | Unlimited | No signup needed | ✅ Auto-enabled |
| [NewsAPI.org](https://newsapi.org) | 100 req/day | https://newsapi.org | 🔵 Optional |
| YouTube IFrame API | Unlimited embeds | No key needed | ✅ Auto-enabled |

**New**: Cricket news now works automatically with no API key needed! Optionally add NewsAPI.org key for more sources.

## Setup

### 1. Get API Keys (Free)
- Go to https://cricketdata.org → Sign up → Copy your API key
- Go to https://rapidapi.com → Sign up → Subscribe to "Free Cricbuzz Cricket API" → Copy key
- **Optional**: Go to https://newsapi.org → Sign up → Get API key (for more news sources)

### 2. Configure Server
```bash
cd server
cp .env.example .env
# Edit .env and paste your keys
# NEWSAPI_KEY is optional - news works without it!
```

### 3. Install & Run
```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm start
```

App runs at http://localhost:3000

## Pages (22 total)
1. `/` — Home (live matches + videos + news)
2. `/live` — Live Matches (auto-refresh 30s)
3. `/match/:id` — Match Detail
4. `/match/:id/live-score` — Live Score (auto-refresh 15s)
5. `/match/:id/scorecard` — Full Scorecard
6. `/upcoming` — Upcoming Matches
7. `/results` — Recent Results
8. `/series` — All Series
9. `/series/:id` — Series Detail
10. `/teams` — Teams (ICC ranked)
11. `/teams/:id` — Team Detail
12. `/players` — Player Search
13. `/players/:id` — Player Profile + Stats
14. `/rankings` — ICC Rankings
15. `/news` — Cricket News (real-time from multiple sources)
16. `/news/:id` — News Article Detail
17. `/schedule` — Match Schedule (grouped by date)
18. `/videos` — Video Gallery (YouTube embeds)
19. `/stats` — Statistics + Charts
20. `/about` — About + API credits
21. `*` — 404 Not Found

## Tech Stack
- **Backend**: Node.js + Express + node-cache + axios
- **Frontend**: React 18 + React Query + Recharts + Framer Motion
- **APIs**: CricketData.org, Cricbuzz (RapidAPI), NewsAPI (free proxy), YouTube IFrame

## 📰 News Integration
The news feature uses a smart waterfall approach:
1. Free NewsAPI proxy (no key needed) - works immediately
2. NewsAPI.org (if key provided) - 100 extra requests/day
3. Match updates fallback - always shows content

See [FREE_APIs.md](./FREE_APIs.md) for detailed API documentation.
