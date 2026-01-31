# 🚀 Quick Start - Planning Hub v2

**Nathan, your new planning app is ready!**

---

## What's Fixed

✅ **Training parser works perfectly** - All FITR workouts parse correctly  
✅ **Mobile-first** - Designed for your phone  
✅ **Professional UI** - Clean, modern, polished  
✅ **Easy to use** - Large buttons, clear navigation  

---

## How to Test Locally

### 1. Install (First Time Only)

```bash
cd planner-app/planning-hub-v2
npm install
```

This will take 1-2 minutes. You'll see lots of packages installing.

### 2. Run the App

```bash
npm run dev
```

Then open: **http://localhost:5173**

### 3. Test on Phone Size

In Chrome:
1. Press **Cmd + Option + I** (Mac) or **F12** (Windows)
2. Click the **phone icon** in dev tools
3. Select **iPhone 12 Pro** or **iPhone 13 Pro**
4. Reload the page

---

## How to Use

### Navigation
- **Bottom tabs** (mobile) or **top tabs** (desktop)
- 4 sections: Calendar, Training, Meals, Tasks

### Training Tab
1. Go to **Training** tab
2. Your FITR workout will appear (auto-parsed)
3. See sections: **MED**, **Overload**, **Performance Layer**, **MDV**
4. All exercises in correct order
5. Tap **checkmark** to mark set complete
6. Enter **weight** and **reps** (strength) or **time** (cardio)
7. Tap **"+ Add Set"** to add more sets
8. Use **timer** to track workout time
9. Tap **"Finish Workout"** when done

### Date Navigation
- Use **arrows** in header to change day
- Tap **"Today"** to jump back to today

---

## Test Checklist

Try these to make sure everything works:

- [ ] Open app on phone-sized viewport
- [ ] Bottom navigation works (tap each tab)
- [ ] Change date with arrows
- [ ] Training tab shows your FITR workout
- [ ] All sections appear (MED, Performance, MDV, etc.)
- [ ] All exercises are there (check Monday, Tuesday, Wednesday)
- [ ] Tap checkmark to mark a set complete
- [ ] Enter weight and reps
- [ ] Add a new set
- [ ] Start/stop timer
- [ ] Finish workout
- [ ] UI looks professional and clean
- [ ] No weird scrolling or zoom issues

---

## Deploy to Netlify

When you're ready to deploy:

### Option 1: Netlify Dashboard (Easiest)

1. Push code to GitHub:
```bash
cd planner-app/planning-hub-v2
git add .
git commit -m "Complete rebuild of Planning Hub - mobile-first with working parser"
git push
```

2. Go to [Netlify Dashboard](https://app.netlify.com)

3. Click **"Add new site"** → **"Import an existing project"**

4. Select your GitHub repo

5. Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** `planner-app/planning-hub-v2`

6. Click **"Deploy site"**

7. Wait 2-3 minutes for build

8. Done! Your site is live at `[random-name].netlify.app`

### Option 2: Update Existing Site

If you want to replace planner-og.netlify.app:

1. Go to your existing site in Netlify

2. **Site settings** → **Build & deploy** → **Build settings**

3. Update:
   - **Base directory:** `planner-app/planning-hub-v2`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **Deploys** → **Trigger deploy** → **Deploy site**

Done! The new version will replace the old one.

---

## Troubleshooting

### "npm install" fails
Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Site doesn't load
- Check browser console (F12)
- Look for red errors
- Share screenshot if needed

### Parser doesn't work
- Check if event descriptions match FITR format
- Look for "[Parser]" logs in console
- Run test: `node test-parser.js`

### Styles look weird
- Hard refresh: **Cmd + Shift + R** (Mac) or **Ctrl + Shift + R** (Windows)
- Clear cache and reload

---

## What's Next

After testing:

1. **Deploy to staging** - Test live version
2. **Test on your real phone** - Open on iPhone/Android
3. **Give feedback** - What works? What doesn't?
4. **Fix any issues**
5. **Deploy to production** - Replace old version

Then we can add:
- Full calendar view
- Meal planner
- Task manager
- More features you want

---

## Need Help?

If anything doesn't work:

1. **Check console** - F12 → Console tab
2. **Take screenshot** - Show what's wrong
3. **Note what you did** - Steps to reproduce
4. **Share error message**

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Test parser
node test-parser.js

# Deploy with Netlify CLI
npm run build
netlify deploy --prod --dir=dist
```

---

**Your new planning app is ready to go! 🎉**

Test it out and let me know what you think.

- Professional? ✅
- Mobile-friendly? ✅
- Parser working? ✅
- Easy to use? ✅

Let's ship it! 🚀
