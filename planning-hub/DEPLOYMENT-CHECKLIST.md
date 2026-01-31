# Deployment Checklist

## Pre-Deployment

- [x] Code complete and tested locally
- [ ] Parser tested with ALL sample FITR workouts
- [ ] Mobile viewport tested (375px, 414px widths)
- [ ] Tablet viewport tested (768px, 1024px widths)
- [ ] Desktop viewport tested (1440px+ widths)
- [ ] All components render without errors
- [ ] Firebase connection working
- [ ] Events load from Firebase
- [ ] Workouts save to Firebase
- [ ] No console errors

## Testing Plan

### 1. Parser Testing
```bash
cd planner-app/planning-hub-v2
node test-parser.js
```

Expected: All workouts parse with no errors

### 2. Mobile Testing (Chrome DevTools)
- [ ] Open http://localhost:5173
- [ ] Toggle device toolbar (Cmd+Shift+M)
- [ ] Test iPhone SE (375x667)
- [ ] Test iPhone 12 Pro (390x844)
- [ ] Test iPad (768x1024)
- [ ] Verify bottom navigation works
- [ ] Verify touch targets are large enough
- [ ] Verify no horizontal scroll
- [ ] Verify text is readable (no zoom needed)

### 3. Training View Testing
- [ ] Navigate to Training tab
- [ ] Verify FITR workout is parsed correctly
- [ ] Tap checkmark to complete a set
- [ ] Enter weight and reps for strength exercise
- [ ] Enter time for cardio exercise
- [ ] Add a new set
- [ ] Start/stop timer
- [ ] Click "Finish Workout"
- [ ] Verify workout saves to Firebase

### 4. Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Deployment Steps

### Option A: Netlify (Recommended)

1. **Build the app**
```bash
cd planner-app/planning-hub-v2
npm install
npm run build
```

2. **Deploy to Netlify**
- Login to Netlify dashboard
- Create new site from Git
- Point to your repo
- Set build command: `npm run build`
- Set publish directory: `dist`
- Set base directory: `planner-app/planning-hub-v2`
- Deploy!

3. **Configure domain (if needed)**
- Go to Site settings → Domain management
- Add custom domain or use Netlify subdomain

### Option B: Manual Deploy

1. **Build locally**
```bash
npm run build
```

2. **Upload dist/ folder to your hosting**
- Upload contents of `dist/` folder to server
- Ensure `netlify.toml` redirects are configured
- Or configure server to serve index.html for all routes

## Post-Deployment Verification

### On Live Site
- [ ] Site loads without errors
- [ ] Firebase connects and loads events
- [ ] Training tab shows FITR workouts
- [ ] Can complete sets and save workouts
- [ ] Mobile viewport looks good
- [ ] No console errors
- [ ] Bottom navigation works
- [ ] Date navigation works

### Test on Real Phone
- [ ] Open site on iPhone/Android
- [ ] Verify UI is professional and readable
- [ ] Verify touch targets are easy to tap
- [ ] Complete a workout end-to-end
- [ ] Verify data saves to Firebase

## Rollback Plan

If something goes wrong:

1. **Keep old version running** at current URL
2. **Deploy new version** to staging URL first (e.g., planner-v2.netlify.app)
3. **Test thoroughly** on staging
4. **Only then** deploy to production
5. **If issues occur:** Revert Netlify deployment to previous version

## Data Migration

The new version uses the same Firebase structure, so:
- ✅ All existing events are preserved
- ✅ All existing meals are preserved
- ✅ All existing tasks are preserved
- ⚠️ Workout tracking format may differ (workouts saved in new format)

No migration needed - just deploy!

## Success Criteria

After deployment, verify:
- [ ] Nathan can open site on phone
- [ ] Training section shows workouts correctly
- [ ] Monday workout parses with all exercises
- [ ] Tuesday workout parses with all exercises
- [ ] Wednesday workout parses with all exercises
- [ ] Can track sets and save workout
- [ ] UI looks professional
- [ ] Mobile UX is excellent (no complaints!)

## Emergency Contacts

- **Netlify Dashboard:** https://app.netlify.com
- **Firebase Console:** https://console.firebase.google.com
- **GitHub Repo:** [Your repo URL]

## Final Notes

- Test on staging first!
- Keep old version as backup
- Monitor for errors in first 24 hours
- Get Nathan's feedback ASAP

---

**Ready to deploy? Let's ship it! 🚀**
