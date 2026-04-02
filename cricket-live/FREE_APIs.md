# Free Cricket & News APIs Integration Guide

This document lists all free APIs integrated into the Live Cricket Zone project and how to set them up.

## 🏏 Cricket APIs

### 1. CricketData.org (Primary)
- **Website**: https://cricketdata.org
- **Free Tier**: 100 requests/day
- **Features**: Live scores, match schedules, player stats
- **Setup**: 
  1. Sign up at cricketdata.org
  2. Get your API key
  3. Add to `.env`: `CRICAPI_KEY=your_key_here`

### 2. RapidAPI - Free Cricbuzz API
- **Website**: https://rapidapi.com/Creativesdev/api/free-cricbuzz-cricket-api
- **Free Tier**: Limited requests
- **Features**: Teams, rankings, schedules, series data
- **Setup**:
  1. Sign up at RapidAPI
  2. Subscribe to Free Cricbuzz Cricket API
  3. Add to `.env`: `RAPIDAPI_KEY=your_key_here`

## 📰 News APIs

### 1. NewsAPI Proxy (No API Key Required) ⭐ RECOMMENDED
- **Source**: https://github.com/SauravKanchan/NewsAPI
- **Endpoint**: `https://saurav.tech/NewsAPI/top-headlines/category/sports/in.json`
- **Free Tier**: Unlimited (no key needed)
- **Features**: Cricket news from Indian sports sources
- **Setup**: Already integrated, no configuration needed!

### 2. NewsAPI.org (Optional)
- **Website**: https://newsapi.org
- **Free Tier**: 100 requests/day
- **Features**: Global cricket news from 150,000+ sources
- **Setup**:
  1. Sign up at newsapi.org
  2. Get your API key
  3. Add to `.env`: `NEWSAPI_KEY=your_key_here` (optional)
- **Note**: If not configured, the app will use the free proxy above

### 3. TheNewsAPI (Alternative)
- **Website**: https://www.thenewsapi.com
- **Free Tier**: 150 requests/day
- **Features**: Worldwide news with cricket filtering
- **Setup**: Can be integrated if needed

## 🎥 Video APIs

### YouTube Data API v3
- **Website**: https://console.cloud.google.com
- **Free Tier**: 10,000 units/day (100 searches)
- **Features**: Cricket highlights, match videos
- **Setup**:
  1. Create Google Cloud project
  2. Enable YouTube Data API v3
  3. Create API key
  4. Add to `.env`: `YOUTUBE_API_KEY=your_key_here`

## 📊 Additional Free Cricket APIs (Not Yet Integrated)

### 1. Cricket Live Scores API
- **GitHub**: https://github.com/sudityashrivastav/free-cricket-live-score-api
- **Features**: Real-time live scores for ICC, IPL, BBL, CPL
- **Cost**: Free

### 2. Cricket Times API
- **Website**: https://crickettimes.com/cricket-news-api/
- **Features**: Cricket news, match previews, analysis
- **Cost**: Free tier available

### 3. Roanuz Cricket API
- **Website**: https://sports.roanuz.com/docs/guides/Free-APIs/
- **Features**: Free season and match keys for developers
- **Cost**: Free tier for development

## 🚀 Current Implementation

### News Route (`/api/news`)
The news endpoint uses a waterfall approach:

1. **First**: Try NewsAPI proxy (no key needed) ✅
2. **Second**: If NewsAPI.org key exists, fetch from there
3. **Fallback**: Show upcoming matches as news

### Benefits
- Works immediately without any API keys
- Automatically upgrades when keys are added
- Never fails - always shows content
- SEO-friendly with real cricket news

## 📝 Environment Variables

```env
# Required
CRICAPI_KEY=your_cricketdata_org_key
RAPIDAPI_KEY=your_rapidapi_key

# Optional (enhances features)
NEWSAPI_KEY=your_newsapi_org_key
YOUTUBE_API_KEY=your_youtube_key

PORT=5000
```

## 🔧 Testing

Test the news API:
```bash
curl http://localhost:5000/api/news
```

Expected response:
```json
{
  "status": "success",
  "data": [
    {
      "id": "article_url",
      "title": "Cricket News Title",
      "description": "Article description...",
      "date": "4/2/2026",
      "source": "ESPN Cricinfo",
      "url": "https://...",
      "image": "https://...",
      "author": "Author Name"
    }
  ],
  "sources": "live"
}
```

## 💡 Tips

1. **No API Keys Needed to Start**: The app works with the free proxy
2. **Add Keys for Better Coverage**: NewsAPI.org gives 100 more requests/day
3. **Monitor Usage**: Check your API dashboards regularly
4. **Rate Limiting**: Built-in rate limiting protects your quotas
5. **Caching**: Consider adding Redis for production to reduce API calls

## 🔗 Useful Links

- [NewsAPI Documentation](https://newsapi.org/docs)
- [CricketData.org Docs](https://cricketdata.org/documentation)
- [RapidAPI Hub](https://rapidapi.com/hub)
- [YouTube API Quotas](https://developers.google.com/youtube/v3/getting-started#quota)

---

**Last Updated**: April 2, 2026
**Maintained by**: Live Cricket Zone Team
