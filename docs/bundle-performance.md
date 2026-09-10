# Bundle splitting and performance

## Measured build comparison

The baseline production build passed before edits, with one JavaScript bundle at **769.00 kB raw / 228.20 kB gzip** and Vite's >500 kB warning. Every route was eagerly imported from the router, including Recharts through Dashboard and Progress. CSS was 49.14 kB raw / 8.65 kB gzip.

All sizes below use the same Vite build reporter, in decimal kB. Gzip estimates can differ from hosting compression settings.

| Measurement | Before raw / gzip | After raw / gzip |
| --- | --- | --- |
| Entry JavaScript chunk | 769.00 / 228.20 | 305.93 / 96.95 |
| Largest JavaScript chunk | 769.00 / 228.20 | 355.99 / 103.61 |
| Initial empty-Dashboard asset graph | 769.00 / 228.20 | 314.66 / 100.32 |
| CSS | 49.14 / 8.65 | 49.14 / 8.65 |
| >500 kB warning | Present | Removed |

The entry chunk is approximately 60% smaller raw and 58% smaller gzipped. The empty Dashboard's initial JavaScript asset graph is approximately 59% smaller raw and 56% smaller gzipped, including its shared core chunk. This is a measured transfer/code-loading improvement, not a claim of measured LCP or interaction-speed gains. The existing small theme bootstrap is unchanged and excluded from both asset-graph totals.

Final chunks (hashes omitted for readability):

| Chunk | Raw kB | Gzip kB |
| --- | ---: | ---: |
| index | 305.93 | 96.95 |
| Card (automatically grouped shared core) | 8.73 | 3.37 |
| chartTheme (shared chart code and Recharts dependencies) | 355.99 | 103.61 |
| WorkoutActivityChart | 2.10 | 0.94 |
| WorkoutHistoryPage | 11.68 | 3.88 |
| ExerciseExplorerPage | 12.48 | 3.81 |
| ProgressPage | 34.64 | 11.57 |
| MotivationPage | 12.25 | 4.42 |
| LogWorkoutPage | 0.15 | 0.15 |
| EditWorkoutPage | 0.84 | 0.48 |
| WorkoutFormPage (shared create/edit implementation) | 20.87 | 6.03 |
| useExerciseExplorer (shared Explorer/picker implementation) | 8.03 | 3.18 |
| chevron-down | 0.11 | 0.13 |
| weight | 0.24 | 0.21 |
| trash-2 | 0.31 | 0.20 |

Route chunks are not standalone route download totals: they also import already-loaded core and applicable shared chunks. Recharts and its dependency tree dominate the largest remaining chunk. The generated `chartTheme` filename reflects automatic grouping, not the size of the tiny chartTheme source helper itself. Splitting redistributes code and adds a little loading machinery; it does not remove the cost of visiting every feature.

## Architecture

`lazyRoutes.tsx` declares React.lazy imports for History, Explorer, Progress, Motivation, Log Workout, and Edit Workout. The router retains the same paths and layout. Lazy declarations live in a component-only module to preserve the existing Fast Refresh lint rule; this is not an eager barrel importing the actual feature implementations.

AppShell wraps its Outlet with Suspense keyed by pathname. Only the content region shows the shared, theme-aware `role="status"` loading card. Sidebar, top bar, theme control, and mobile navigation remain mounted and usable. Path changes can show the new loading state instead of displaying stale content from another route.

Dashboard remains eager. Its populated activity chart has its own lazy boundary and a fallback with the same heading, padding, and 256px plotting region. Statistics and recent workouts do not suspend with the chart. The empty Dashboard does not render or download Recharts. A populated Dashboard still loads the chart immediately after mounting; splitting defers this cost rather than removing it. The tested desktop card remained 470px tall before and after loading.

Vite automatically shares Recharts between the Dashboard chart and Progress, the form between create/edit, and the WGER query implementation between Explorer and the workout picker. WGER code loads with the routes that need it; no global WGER fetching or duplicate API implementation was added. Motivation data remains in its feature chunk.

No manualChunks, package-name heuristics, prefetching, new dependencies, source-map changes, global caches, or mechanical memoization were used. Application-level boundaries were sufficient to eliminate the warning. Vite configuration, strictness, schemas, storage, calculations, WGER request semantics, and Stitch files are unchanged.

## Exact files

Modified:

- `src/app/router.tsx`
- `src/components/layout/AppShell.tsx`
- `src/features/dashboard/DashboardPage.tsx`

Created:

- `src/app/lazyRoutes.tsx`
- `src/components/ui/RouteLoading.tsx`
- `docs/bundle-performance.md`

## Verification

- `npm run lint`: passed with no rule suppressions.
- `npm run build`: passed with strict mode retained, no oversized-chunk warning.
- `node scripts/test-progress.mjs`: 8 passed.
- `node scripts/test-theme.mjs`: 4 passed.
- `node scripts/test-motivation.mjs`: 5 passed.
- `node scripts/test-workout-integration.mjs`: 7 passed.
- All 24 tests were unchanged; no additional project test suites were found.
- `git diff --check`: passed.

Production-browser checks ran in the isolated test profile against local preview at port 5189, with controlled WGER fixtures and test-only workout data. Browser harness waits were adjusted to wait for lazy route content instead of assuming that a changed URL means rendering is complete.

| Requested regression | Result |
| --- | --- |
| A–F. Direct navigation to all six routes | Passed |
| G. Refresh every route | Passed |
| H. Navigation between lazy routes | Passed with desktop links and mobile More navigation |
| I–J. Loading state/no blank page | Passed with cold cache and simulated 1000ms network latency; shell stayed visible |
| K. WGER picker | Passed selection, cancel, manual fallback, and save |
| L. Explorer to Log | Passed prefill, reload, invalid state fallback, and no autosave |
| M. History CRUD | Passed create, edit, identity preservation, rename, and delete |
| N. Progress charts | Both charts and keyboard-triggered tooltips passed in Light and Dark |
| O. Motivation | Direct, refreshed, and client-navigated page loads passed |
| P–Q. Theme switching/dark mode | Passed |
| R. Dialogs | Picker Escape/restoration, discard, details, and delete flows passed |
| S. Runtime errors | None captured in the final route/chart checks |
| T. Horizontal layout | Representative lazy routes passed at 1440px and 390x844 in Light and Dark |

Browser resource inspection on a fresh empty Dashboard found only `index-CLrsRENK.js` and `Card-CN87Jzvg.js` among generated JavaScript asset requests. No chart, WGER, form, Progress, or Motivation chunk loaded there. Loading screenshots were reviewed; the chart test measured matching fallback/final card heights.

Workspace evidence: `../.bodybloom-performance-results.log`, `../.bodybloom-performance-charts.log`, and `../.bodybloom-performance-*.png`. The two browser harnesses are retained alongside those artifacts.

## Intentionally deferred

Further vendor grouping, intent prefetching, finer picker splitting, caching, dependencies for bundle analysis, and broader performance tuning were unnecessary for this goal. Real-device timing metrics and production-host cache/deployment behavior were not benchmarked. Existing SPA deep-link hosting requirements remain unchanged.
