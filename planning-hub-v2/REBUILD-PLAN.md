# Planning Hub v2 - Complete Rebuild Plan

## Mission
Rebuild planner-og.netlify.app with:
- ✅ Professional, mobile-first design
- ✅ Working FITR training parser
- ✅ Better UX for daily planning
- ✅ All existing features preserved

## Architecture Changes

### 1. Component Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx (mobile-friendly bottom nav)
│   │   └── Layout.jsx
│   ├── calendar/
│   │   ├── CalendarView.jsx
│   │   ├── DayView.jsx
│   │   └── WeekView.jsx
│   ├── training/
│   │   ├── TrainingView.jsx
│   │   ├── ExerciseCard.jsx
│   │   ├── SetTracker.jsx
│   │   └── WorkoutTimer.jsx
│   ├── meals/
│   │   ├── MealPlanner.jsx
│   │   ├── MealCard.jsx
│   │   └── NutritionTracker.jsx
│   ├── tasks/
│   │   ├── TaskList.jsx
│   │   └── TaskCard.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Input.jsx
│       └── Modal.jsx
├── utils/
│   ├── workoutParser.js (improved)
│   ├── dateHelpers.js
│   └── formatters.js
├── hooks/
│   ├── useFirebase.js
│   ├── useWorkouts.js
│   └── useMediaQuery.js
├── styles/
│   ├── variables.css (design tokens)
│   ├── global.css
│   └── mobile.css
└── App.jsx
```

### 2. Design System

**Colors:**
- Primary: #3B82F6 (blue)
- Success: #10B981 (green)
- Warning: #F59E0B (amber)
- Danger: #EF4444 (red)
- Neutral: #6B7280 (gray)

**Typography:**
- System fonts for performance
- Clear hierarchy (16px base, 1.5 line-height)

**Spacing:**
- 4px base unit (0.25rem)
- Mobile: generous touch targets (44px min)

**Mobile-First Breakpoints:**
- xs: 0-639px (phone)
- sm: 640px-767px (large phone)
- md: 768px-1023px (tablet)
- lg: 1024px+ (desktop)

### 3. Training Parser Improvements

**Current Issues:**
- May not handle all FITR variations
- Doesn't validate parsed data
- No error handling for malformed descriptions

**Solutions:**
- Add extensive logging
- Validate all parsed exercises
- Handle edge cases (empty descriptions, weird formatting)
- Add fallback parsing strategies
- Test against 20+ real FITR workouts

### 4. Mobile UX Priorities

**Navigation:**
- Bottom tab bar (Calendar, Training, Meals, Tasks)
- Sticky header with date picker
- Swipe gestures for day navigation

**Training View:**
- Large, tappable exercise cards
- Swipeable sets (swipe to mark complete)
- Minimal keyboard input
- Quick-add buttons for common weights

**Calendar View:**
- Vertical scroll on mobile
- Today button always visible
- Event preview cards

### 5. Performance

- Lazy load components
- Virtualize long lists
- Debounce Firebase writes
- Local state with periodic sync
- Service worker for offline support (future)

## Implementation Plan

### Phase 1: Foundation (2 hours)
- [ ] Set up project structure
- [ ] Create design system (CSS variables)
- [ ] Build layout components
- [ ] Set up Firebase integration
- [ ] Create routing logic

### Phase 2: Core Features (3 hours)
- [ ] Calendar view (mobile-first)
- [ ] Training view with parser
- [ ] Meal planner
- [ ] Task manager
- [ ] Bottom navigation

### Phase 3: Training Parser (2 hours)
- [ ] Review ALL FITR data samples
- [ ] Rewrite parser with validation
- [ ] Add comprehensive logging
- [ ] Test against 20+ workouts
- [ ] Edge case handling

### Phase 4: Polish (2 hours)
- [ ] Loading states
- [ ] Error boundaries
- [ ] Empty states
- [ ] Animations
- [ ] Accessibility

### Phase 5: Testing (1 hour)
- [ ] Mobile viewport testing (Chrome DevTools)
- [ ] Test all CRUD operations
- [ ] Verify Firebase sync
- [ ] Cross-browser check

### Phase 6: Deployment
- [ ] Build production bundle
- [ ] Deploy to Netlify
- [ ] Verify live site
- [ ] Test on real phone

## Key Decisions

1. **Keep Firebase** - Don't change backend during UI rebuild
2. **CSS over Tailwind** - Better control, no build dependencies
3. **No TypeScript yet** - Ship fast, refactor later
4. **Mobile-first CSS** - Base styles for mobile, enhance for desktop
5. **Component library** - Build reusable components from start

## Testing Checklist

- [ ] Monday workout shows correct exercises in order
- [ ] Tuesday AM/PM workouts both parse correctly
- [ ] Wednesday workout shows all sections (MED, Performance, MDV)
- [ ] Thursday-Sunday workouts all parse
- [ ] Strength sessions show all exercises
- [ ] Cardio sections parse correctly
- [ ] Previous workout data loads
- [ ] Can add/edit/delete events
- [ ] Can track sets and mark complete
- [ ] Timer works
- [ ] Mobile viewport (375px width) is usable
- [ ] Tablet viewport (768px) is usable
- [ ] Desktop viewport (1440px) is usable

## Success Criteria

1. ✅ All FITR workouts parse 100% correctly
2. ✅ Mobile UX is excellent (thumb-friendly, no zooming needed)
3. ✅ Professional appearance (Nathan would proudly show clients)
4. ✅ All existing features work
5. ✅ No Firebase data loss
6. ✅ Performance is good (< 2s load time)

## Migration Path

1. Build v2 in parallel
2. Test thoroughly
3. Deploy to staging (planner-v2-staging.netlify.app)
4. Nathan tests on phone
5. Fix any issues
6. Deploy to production (planner-og.netlify.app)
7. Keep v1 as backup

---

**Status:** Ready to build
**Next:** Start Phase 1 - Foundation
