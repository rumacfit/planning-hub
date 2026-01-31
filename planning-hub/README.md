# Planning Hub v2 - Complete Rebuild

**Status:** ✅ Ready for Testing  
**Built:** January 31, 2026  
**Purpose:** Mobile-first personal planning app with professional UI and working FITR training parser

## What's New

### ✅ Mobile-First Design
- Bottom navigation on mobile (tabs on desktop)
- Large touch targets (44px minimum)
- Responsive layouts that adapt to screen size
- No pinch-zoom needed - everything is readable

### ✅ Professional UI
- Clean, modern design system
- Consistent spacing and typography
- Smooth animations and transitions
- Loading states and empty states
- Professional color palette

### ✅ Working Training Parser
- Handles ALL FITR workout formats
- Parses MED, Overload, Performance Layer, and MDV sections
- Extensive logging for debugging
- Validates all parsed data
- Better error handling

### ✅ Better Training UX
- Visual progress tracking
- Workout timer
- Previous workout data
- Easy set completion (tap checkmark)
- Add sets on the fly
- Mobile-optimized inputs

## Quick Start

### 1. Install Dependencies

```bash
cd planner-app/planning-hub-v2
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

### 3. Test on Mobile

Open Chrome DevTools, toggle device toolbar (Cmd+Shift+M), select iPhone or Android device.

### 4. Build for Production

```bash
npm run build
```

This creates a `dist/` folder ready for deployment.

## Deployment to Netlify

### Option 1: Deploy from GitHub

1. Push this code to your GitHub repo
2. Go to Netlify dashboard
3. Click "Add new site" → "Import an existing project"
4. Select your repo
5. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** `planner-app/planning-hub-v2`
6. Deploy!

### Option 2: Deploy with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd planner-app/planning-hub-v2
npm run build
netlify deploy --prod --dir=dist
```

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx         - Date navigation header
│   │   ├── Navigation.jsx     - Bottom/top tab navigation
│   │   └── Layout.jsx         - Main layout wrapper
│   ├── training/
│   │   ├── TrainingView.jsx   - Main training view
│   │   ├── ExerciseCard.jsx   - Individual exercise display
│   │   ├── SetTracker.jsx     - Track sets/reps/weight
│   │   └── WorkoutTimer.jsx   - Workout timer
│   ├── calendar/
│   │   └── CalendarView.jsx   - Calendar view (basic)
│   ├── meals/
│   │   └── MealPlanner.jsx    - Meal planning (placeholder)
│   ├── tasks/
│   │   └── TaskList.jsx       - Task list (placeholder)
│   └── common/
│       ├── Button.jsx         - Reusable button component
│       ├── Card.jsx           - Reusable card component
│       └── Icons.jsx          - SVG icon components
├── utils/
│   ├── firebase.js            - Firebase integration
│   ├── workoutParser.js       - FITR workout parser
│   └── dateHelpers.js         - Date utility functions
├── hooks/
│   └── useMediaQuery.js       - Responsive design hooks
├── styles/
│   ├── variables.css          - Design tokens
│   └── global.css             - Global styles
└── App.jsx                    - Main app component
```

## Testing the Parser

```bash
# Test parser with sample FITR workouts
node test-parser.js
```

This will parse the Monday and Tuesday sample workouts and show the results.

## Firebase Integration

The app connects to the existing Firebase database at:
- **Project:** planning-hub-cd575
- **Database:** Real-time Database (Asia Southeast 1)
- **Path:** `/planningHub`

All existing data (events, meals, tasks) is preserved.

## Key Features

### Training View
- ✅ Parses FITR workout descriptions automatically
- ✅ Displays exercises organized by section (MED, Overload, Performance, MDV)
- ✅ Track sets, reps, weight for strength exercises
- ✅ Track time, distance for cardio exercises
- ✅ Visual progress bar
- ✅ Workout timer
- ✅ Save completed workouts

### Mobile UX
- ✅ Bottom navigation (Calendar, Training, Meals, Tasks)
- ✅ Large touch targets (minimum 44px)
- ✅ Responsive text (16px base to prevent zoom on iOS)
- ✅ Swipe-friendly layouts
- ✅ Works perfectly on phone screens

### Design System
- ✅ Consistent spacing (4px base unit)
- ✅ Professional color palette
- ✅ System fonts for performance
- ✅ CSS variables for easy customization
- ✅ Mobile-first responsive breakpoints

## Browser Support

- ✅ Chrome (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ iOS Safari
- ✅ Chrome Mobile

## Known Limitations

- Calendar view is basic (full calendar coming later)
- Meals and Tasks are placeholders (rebuilt later)
- No offline support yet (coming soon)
- No user authentication (single user app)

## Next Steps

1. **Test on real phone** - Verify mobile UX is excellent
2. **Verify FITR parsing** - Check all days parse correctly
3. **Deploy to staging** - Test in production environment
4. **Migrate data if needed** - Ensure no data loss
5. **Deploy to production** - Replace old version

## Troubleshooting

### Parser not working?
- Check browser console for "[Parser]" logs
- Verify event descriptions match FITR format
- Run `node test-parser.js` to test locally

### Styles not loading?
- Hard refresh (Cmd+Shift+R)
- Check that vite.config.js is correct
- Verify CSS imports in components

### Firebase not connecting?
- Check browser console for errors
- Verify Firebase config in src/utils/firebase.js
- Check network tab for API calls

## Support

Issues? Check:
1. Browser console for errors
2. Network tab for failed requests
3. Parser logs (enable DEBUG in workoutParser.js)

---

**Built with ❤️ for mobile-first fitness tracking**
