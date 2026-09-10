# Dark mode and design consistency

Implemented September 10, 2026. Existing routes, Workout schema/context/storage, WGER architecture, and analytics calculations are preserved. No dependencies were added. The parent Stitch export was not modified.

## Architecture and persistence

The shared TopBar mounts one ThemeControl using a small useTheme hook. Its accessible dialog offers System, Light, and Dark; selected choices expose aria-pressed and a visible check. No additional Context or state library is needed. The hook applies data-theme and color-scheme to the document root. System mode follows live prefers-color-scheme changes; explicit selections override them. Storage events synchronize other tabs.

Explicit preferences use the separate localStorage key `bodybloom.theme`. Choosing System removes this override. Invalid values fall back to System. Storage exceptions are caught; theme changes still work for the current visit and a status message explains a failed save. Workout persistence is not involved.

The small blocking `public/theme-init.js` runs in the document head before React, using the same preference rules. An early canvas style also prevents an obviously light background before application CSS arrives. The script URL respects Vite's base path.

## Visual changes

Existing semantic tokens now resolve to charcoal/navy backgrounds, elevated dark surfaces, off-white text, softer emerald actions, readable errors, and subtle shadows in dark mode. Light defaults retain the existing appearance. Added tokens cover the overlay, chart grid/stroke/fill, exercise image surface, fixed brand foreground/background, and the previously undefined on-primary-container color.

Shared chartTheme values reference CSS variables for Recharts axes, grids, fills, strokes, cursors, and tooltips. Changes propagate through CSS without changing chart data or semantics. Actual exercise illustrations retain a pale backing so black line art stays readable; missing-image fallbacks follow the themed surface. Motivation hero and playlist artwork keep their intentional brand colors.

Small accessibility corrections include stronger input boundaries, readable disabled styles, a non-color selected-state underline in mobile navigation, corrected sidebar text tokens, descriptive theme-control labeling, decorative icon hiding, and preserved dialog focus handling. Tested foreground/surface token pairs meet a 4.5:1 text contrast ratio; this is not a claim of a complete accessibility certification.

## Files created

- `public/theme-init.js`
- `src/features/theme/theme.types.ts`
- `src/features/theme/theme.storage.ts`
- `src/features/theme/useTheme.ts`
- `src/features/theme/ThemeControl.tsx`
- `src/components/ui/chartTheme.ts`
- `scripts/test-theme.mjs`
- `docs/dark-mode.md`

## Files modified

- `index.html`
- `src/index.css`
- `src/components/layout/TopBar.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Dialog.tsx`
- `src/features/dashboard/components/WorkoutActivityChart.tsx`
- `src/features/exercises/components/ExerciseCard.tsx`
- `src/features/exercises/components/ExerciseFilters.tsx`
- `src/features/exercises/components/ExerciseGrid.tsx`
- `src/features/exercises/components/ExerciseImage.tsx`
- `src/features/progress/ProgressPage.tsx`
- `src/features/progress/components/ConsistencyCard.tsx`
- `src/features/progress/components/ProgressFilters.tsx`
- `src/features/progress/components/ProgressTrendChart.tsx`
- `src/features/motivation/components/DailyQuoteCard.tsx`
- `src/features/motivation/components/PlaylistCard.tsx`
- `src/features/workouts/components/ExerciseFormCard.tsx`
- `src/features/workouts/components/ExerciseSetTable.tsx`

## Verification

- `node scripts/test-theme.mjs`: 4 tests passed (startup combinations, native color scheme, storage isolation/failure, token text contrast).
- `npm run lint`: passed.
- `npm run build`: passed. Existing warning about the JavaScript chunk exceeding 500 kB remains.
- `npm run dev -- --host 127.0.0.1 --port 5188`: started successfully.
- Production preview tested in isolated headless Chrome at port 5189.
- All 48 combinations of six routes, two themes, and four widths passed theme, horizontal overflow, shell-control placement, mobile navigation clearance, and runtime error checks. Widths: 1440, 768, 390, 320; 390 tested at height 844.
- All 24 combinations of discard/delete/exercise dialogs, two themes, and four widths fit the viewport, retained keyboard focus, closed with Escape, and restored focus. Form validation text appeared in both themes at every width.
- Dashboard and Progress keyboard-triggered tooltips and computed axis colors passed in both themes. Representative screenshots were visually reviewed for page hierarchy, illustration handling, focus, dialogs, and chart readability.
- System changes, persistent explicit overrides, switching without reload, real cross-tab storage changes, and blocked storage were checked in the browser. Blocking the React bundle still produced the correct dark document background.

| Requested check | Result |
| --- | --- |
| A. Default follows system | Passed, including live system changes |
| B. Explicit light persists | Passed against a dark system preference |
| C. Explicit dark persists | Passed against a light system preference |
| D. Switch without reload | Passed; time origin unchanged |
| E. Storage failure | Passed; app and in-memory selection remain usable |
| F. Dashboard | Passed in both themes |
| G. Log Workout | Passed in both themes |
| H. History | Passed in both themes |
| I. Exercise Explorer | Passed in both themes |
| J. Progress | Passed in both themes |
| K. Motivation | Passed in both themes |
| L. Dialog readability | Passed; viewport and keyboard checks also passed |
| M. Validation errors | Passed in both themes |
| N. Chart axes/tooltips | Passed in both themes |
| O. Selected navigation | Preserved desktop marker and added mobile underline |
| P. 1440 px | All routes passed in both themes |
| Q. 768 px | All routes passed in both themes |
| R. 390 x 844 | All routes passed in both themes |
| S. 320 px | All routes passed in both themes |
| T. Runtime console errors | None captured in these test scenarios |

Browser fixtures were restricted to the isolated test profile. Workout data came from the existing progress fixtures. WGER responses were controlled browser fixtures, with an actual illustration and missing-image examples; this pass does not establish live API reliability. No mock records were added to application data or source.

Workspace verification artifacts are `.bodybloom-theme-matrix.json`, `.bodybloom-theme-dialogs.log`, and `.bodybloom-theme-*.png` in the parent workspace. The committed Node test is repeatable without adding a browser dependency.

## Intentionally deferred

Bundle splitting, broad component rewrites, product additions, full CRUD/API regression testing, and a cross-browser/screen-reader accessibility audit are outside this controlled appearance pass. Existing functionality and calculations were retained. No separate mobile pages, theme library, or changes to Stitch were introduced.
