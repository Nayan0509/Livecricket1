# Deployment Checklist

## Pre-Deployment

- [x] Scorecard scraping implemented in `api/index.js`
- [x] Match info scraping implemented
- [x] All routes added to `App.jsx`
- [x] All page components imported
- [x] Navigation flow tested locally
- [x] No TypeScript/JavaScript errors
- [x] API endpoints structured correctly

## Files Modified

### Backend (Vercel Serverless)
- ✅ `api/index.js` - Added scorecard & match info scraping

### Frontend (React)
- ✅ `client/src/App.jsx` - Added new routes
- ✅ `client/src/pages/LiveScore.jsx` - Enhanced with scorecard preview
- ✅ `client/src/pages/Scorecard.jsx` - Already exists
- ✅ `client/src/pages/MatchDetail.jsx` - Already exists
- ✅ `client/src/pages/BallByBall.jsx` - Already exists
- ✅ `client/src/pages/LiveCricketScore.jsx` - Already exists
- ✅ `client/src/pages/CricketScoreToday.jsx` - Already exists

## Deployment Steps

### 1. Commit & Push
```bash
cd cricket-live
git add .
git commit -m "feat: Add scorecard scraping, match info API, and enhanced routing"
git push origin main
```

### 2. Verify Vercel Auto-Deploy
- Go to https://vercel.com/dashboard
- Check deployment status
- Wait for build to complete

### 3. Test API Endpoints

**Health Check:**
```bash
curl https://your-domain.vercel.app/api/health
```
Expected: `{"status":"ok","mode":"Scale Up Enterprise","dependencyFree":true}`

**Live Matches:**
```bash
curl https://your-domain.vercel.app/api/matches/live
```
Expected: `{"status":"success","data":[...]}`

**Match Info (replace 12345 with real match ID):**
```bash
curl https://your-domain.vercel.app/api/matches/12345
```
Expected: Match details JSON

**Scorecard (replace 12345 with real match ID):**
```bash
curl https://your-domain.vercel.app/api/matches/12345/scorecard
```
Expected: Innings data JSON

### 4. Test Frontend Pages

Visit these URLs in browser:
- [ ] https://your-domain.vercel.app/
- [ ] https://your-domain.vercel.app/live
- [ ] https://your-domain.vercel.app/live-cricket-score
- [ ] https://your-domain.vercel.app/cricket-score-today
- [ ] https://your-domain.vercel.app/ball-by-ball
- [ ] https://your-domain.vercel.app/match/{id} (use real match ID)
- [ ] https://your-domain.vercel.app/match/{id}/scorecard
- [ ] https://your-domain.vercel.app/match/{id}/live-score

### 5. Test Navigation Flow

1. [ ] Home page → Click match card → Match detail page
2. [ ] Match detail → Click "Full Scorecard" → Scorecard page
3. [ ] Match detail → Click "Live Score" → Live score page
4. [ ] Live score → Click "Full Scorecard" → Scorecard page
5. [ ] All back buttons work correctly

### 6. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Click "Functions" tab
4. Click on `api/index.js`
5. Check logs for:
   - `Scraped X live matches from Cricbuzz`
   - `Scraped scorecard for {id}: X innings`
   - No error messages

### 7. Performance Check

- [ ] Pages load within 3 seconds
- [ ] Auto-refresh works (check network tab)
- [ ] No console errors
- [ ] Mobile responsive

### 8. SEO Check

- [ ] Meta tags present (view page source)
- [ ] Structured data present
- [ ] Social sharing works (test on Facebook/Twitter)
- [ ] Sitemap accessible

## Post-Deployment

### Monitor for 24 Hours

1. **Check Vercel Logs Daily**
   - Look for scraping errors
   - Monitor function execution time
   - Check for rate limiting

2. **Test During Live Matches**
   - Verify scores update correctly
   - Check scorecard accuracy
   - Test auto-refresh

3. **User Feedback**
   - Monitor for bug reports
   - Check analytics for errors
   - Review user behavior

### Common Issues & Solutions

**Issue: "No Live Coverage" on production**
- Check Vercel logs for scraping errors
- Verify Cricbuzz is accessible
- Check if match IDs are correct

**Issue: Scorecard not loading**
- Verify match ID is valid
- Check Cricbuzz HTML structure
- Review function logs

**Issue: Routes not working**
- Clear browser cache
- Check Vercel deployment completed
- Verify vercel.json rewrites

**Issue: Slow performance**
- Check function execution time
- Verify caching is working
- Consider increasing cache TTL

## Rollback Plan

If critical issues occur:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback in Vercel dashboard
# Go to Deployments → Previous deployment → Promote to Production
```

## Success Criteria

✅ All API endpoints return data
✅ All pages load without errors
✅ Navigation works correctly
✅ Scorecard displays properly
✅ Auto-refresh functions
✅ No console errors
✅ Mobile responsive
✅ SEO tags present

## Next Steps After Successful Deploy

1. Submit sitemap to Google Search Console
2. Monitor search rankings for target keywords
3. Set up analytics tracking
4. Plan next feature iteration
5. Gather user feedback

## Support Resources

- Vercel Docs: https://vercel.com/docs
- React Router: https://reactrouter.com
- Cricbuzz: https://www.cricbuzz.com
- Project Docs: See SCORECARD_IMPLEMENTATION.md

---

**Ready to Deploy?** Follow the steps above and check off each item!
