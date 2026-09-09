# Progress Analytics

Implemented `/progress` using canonical Workout records from `useWorkouts()`, shared workout/date helpers, existing UI primitives, Recharts, and AppShell. Both parent Stitch Progress screenshots and corresponding HTML were inspected as read-only references. The page translates their statistic cards, larger volume chart, frequency chart, and consistency map into one responsive component tree. Mock calories, goals, percentage gains, and milestones were not reproduced.

## Formulas and identity

- **Total Workouts:** number of workout records in the selected inclusive date range. Two workouts on one date count as two.
- **Training Volume:** sum of `weight × reps` across every set and exercise, using the existing `getWorkoutActivity()` → `getWorkoutVolume()` → `getExerciseVolume()` path. Units are kg × reps. Zero-weight sets contribute zero volume but still count toward workout/exercise frequency. Calculations retain JavaScript number precision; formatting is applied only for display.
- **Current Streak:** existing `getCurrentStreak(workouts, today)`, using all history. A streak must include today or yesterday. Multiple workouts on one day add one streak day. The metric is explicitly labelled as all-history and is not truncated by the selected range, preserving Dashboard semantics.
- **Average Workouts / Week:** `selected workout count / max(1, inclusive range days / 7)`. All Time starts at the earliest completed workout date and ends today, rather than dividing by a fixed number of weeks. A history shorter than seven days uses a one-week denominator to avoid extrapolating one workout into seven workouts/week.
- **Active days:** distinct workout dates in the selected range. Active percentage is `active days / inclusive range days × 100`; this is an observation, not a target.
- **Exercise frequency:** counts each logged exercise entry by exact stored `exerciseName`, independently of sets. Multiple entries with the same name count separately, including within one workout. Results sort by count descending, then the existing `localeCompare` name ordering; the first five appear. WGER IDs are not persisted by the workout schema, and per-entry exercise IDs are not reliable cross-workout identity. Spelling/case variations therefore remain separate, while different exercises with identical names are combined. No new normalization or storage model was introduced.

## Range and grouping rules

All boundaries are inclusive local calendar dates. Future-dated records are excluded from historical analytics until their date arrives; the range-empty explanation makes this explicit.

| Range | Start | End | Chart grouping |
| --- | --- | --- | --- |
| 4 Weeks | Today minus 27 calendar days | Today | Daily |
| 3 Months | First day of the month two months before this month | Today | Weekly |
| 6 Months | First day of the month five months before this month | Today | Weekly |
| All Time | Earliest workout date on/before today, or today when none exists | Today | Daily for up to 35 days; weekly for 36–185 days; monthly thereafter |

Weekly groups use Monday–Sunday, consistent with History. The first and last groups are clipped to the selected range; full dates appear in tooltips and data tables. Every intervening period is emitted, including zero-workout/zero-volume periods. Workouts are not compressed into consecutive active-only buckets.

Calendar iteration uses the existing local-noon parser and local calendar arithmetic. Inclusive day counts use calendar-component ordinals, avoiding 23/25-hour DST-day errors. UTC timestamps are never converted into stored workout date keys.

## Components and data flow

`WorkoutContext` → `useWorkouts()` → memoized `calculateProgress(workouts, range, today)` → typed analytics result → presentation components.

- **Training Volume:** Recharts linear area chart, avoiding smoothed invented peaks; a single point has a visible dot.
- **Workout Frequency:** Recharts bar chart with integer count ticks.
- **Chart alternatives:** text headline metrics, labelled chart sections, and keyboard-expandable tables containing every period and value. Tooltips show full dates and units. Recharts accessibility support remains enabled; animation is disabled.
- **Consistency Map:** at most the latest 28 days within the selected range, explicitly labelled with its date span. Monday-aligned cells show actual session counts, a dash for inactivity, and accessible date/count labels. The summary beneath it covers the full selected range.
- **Exercise Frequency:** compact ranked list with explicit entry counts.
- **Empty states:** separate no-history and no-workouts-in-range messages. No-history includes Log Workout; a range-empty state offers All Time. One-workout and zero-weight-only histories receive explanatory copy and still render real chart data.

The only shared calculation refactor extracts `getExerciseFrequency()` from `getMostPerformedExercise()`. Dashboard now calls the extracted helper through its existing function; the counting, tie ordering, and empty fallback remain unchanged. There was no streak-definition conflict to correct. No broad Dashboard rewrite, schema change, Context change, navigation redesign, Explorer change, or dependency installation was needed.

## Files

Created:

- `src/features/progress/ProgressPage.tsx`
- `src/features/progress/progress.types.ts`
- `src/features/progress/progress.calculations.ts`
- `src/features/progress/components/ProgressFilters.tsx`
- `src/features/progress/components/ProgressStatGrid.tsx`
- `src/features/progress/components/ProgressTrendChart.tsx`
- `src/features/progress/components/ConsistencyCard.tsx`
- `src/features/progress/components/ExerciseFrequencyCard.tsx`
- `scripts/progress-fixtures.mjs` — verification data only, never imported by the app.
- `scripts/test-progress.mjs` — repeatable tests using Node's built-in test runner and the existing TypeScript dependency.
- `docs/progress-analytics.md` — this report.

Modified:

- `src/app/router.tsx` — replaces the Progress placeholder.
- `src/features/workouts/workout.calculations.ts` — shared exercise frequency extraction.

Workspace screenshots outside the application: `.bodybloom-progress-{1440,768,390,320}.png` and `.bodybloom-progress-charts-{1440,390}.png`. These contain isolated deterministic test workouts, not production seed data. The Stitch export was not modified.

## Verification

- `node scripts/test-progress.mjs`: **8/8 tests passed**. Tests compile only pure helpers into a temporary directory using the installed TypeScript package, then remove those temporary files.
- `npm run lint`: **passed**.
- `npm run build`: **passed**. The existing Vite large-chunk warning remains; the bundle is approximately 748 kB / 222 kB gzip (previously approximately 713 kB / 213 kB gzip). No bundle architecture changes were made for this feature.
- `npm run dev -- --host 127.0.0.1 --port 5182`: **started successfully**, selecting port **5184** because 5182 and 5183 were occupied.

Browser verification used an isolated headless Chrome profile, the production build, and deterministic workouts with the local calendar date fixed to September 9, 2026. Storage fixtures were confined to that test profile. Actual History edit/delete controls were used to verify Context updates without reloading.

| Requested checks | Result |
| --- | --- |
| A | No-workout empty state and Log Workout link passed. |
| B–F | Loaded saved workouts; verified 5 workouts, 1,322.5 kg × reps, a 3-day streak, and 1.25 workouts/week for the 4-week fixture. |
| G–J | All four ranges and selected control states passed. 3 Months: 6 workouts / 1,422.5 volume; 6 Months: 7 / 1,432.5; All Time: 8 / 1,482.5. |
| K–N | Verified zero-filled chart tables and plotted data, matching totals, 24 inactive days in the 28-day range, and two September 8 sessions aggregated to 572.5 volume. |
| O | Top exercise was Bench Press with 3 entries; pure tests also covered exact-name identity, duplicate entries, ties, and the five-item cap. |
| P–Q | Range-specific empty, one-workout, and bodyweight-only states passed. |
| R | Changed a set's weight through History Edit; Progress updated to 1,372.5 volume without reload. |
| S | Deleted that workout through History; Progress updated to 4 workouts / 972.5 volume without reload. |
| T | Reload preserved the resulting analytics. |
| U | Browser checks passed in Los Angeles and Kiritimati with the same local calendar date; pure tests additionally covered UTC, London, DST boundaries, and leap-day arithmetic. |
| V–Y | Inspected desktop/mobile screenshots against Stitch intent; 1440, 768, 390×844, and 320px layouts had no document horizontal overflow. Charts fit, and content cleared fixed navigation. |
| Z | Range buttons worked via keyboard at every viewport. Data tables expanded via keyboard, and arrow-key chart navigation exposed the tooltip with units. Existing More → Progress navigation passed. No browser runtime errors were recorded. |

## Intentionally deferred

Motivation, dark mode, goals/milestones, AI recommendations, authentication, backend work, WGER exercise identity persistence, and bundle splitting remain out of scope. The consistency map intentionally shows a labelled recent-day window rather than rendering an unlimited all-history heatmap. Current calendar date updates when Progress renders, consistent with Dashboard; no background midnight timer was added.
