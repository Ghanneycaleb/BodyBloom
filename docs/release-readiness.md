# BodyBloom release-readiness audit

Completed September 11, 2026.

**Recommendation: READY WITH MINOR LIMITATIONS.** No saved-workout data-loss, navigation, storage-recovery, build, or major keyboard-accessibility blocker was reproduced in the completed checks. This recommendation covers the tested MVP and environment, subject to the hosting and coverage limitations below. Nothing was deployed.

## Baseline

The repository was clean at the start. Baseline lint, production build, and all 24 existing tests passed. Route splitting was intact, with no >500 kB warning. Baseline entry: 305.93 kB raw / 96.95 kB gzip; largest shared chart chunk: 355.99 / 103.61 kB.

This remained an audit and stabilization pass. Workout types, storage semantics, analytics formulas, WGER requests/mappers, theme architecture, strict settings, dependencies, and lazy-route architecture were preserved.

## Findings and minimal fixes

| Finding | Resolution |
| --- | --- |
| Unknown URLs showed React Router's developer-oriented error page | Added a small not-found page inside the existing shell with a Dashboard recovery link |
| Dashboard logging links contained nested buttons | Converted each to one styled Link, preserving destination and visual treatment |
| Notification and Upgrade to Pro buttons had no action | Removed the inert controls; no notification or payment feature was implemented |
| README was the Vite template | Replaced it with concise setup, features, storage, tests, external services, and deployment notes |
| Confirmed unused starter assets/styles/placeholder pages remained | Removed only those unused artifacts |
| Static-host fallback configuration was absent | Added minimal Vercel and Netlify SPA fallback files |

Shell headings now distinguish unknown routes and preserve known-route titles with trailing slashes. No broad refactoring or redesign was performed.

One local verification problem occurred: Vite could not clean a Windows-locked generated chart file (`ENOTEMPTY`/`EPERM`). The audit preview processes were stopped, the pending file lock cleared, and the unchanged standard `npm run build` succeeded. No compiler/build setting was weakened and no alternate output directory was used to hide the failure.

## Exact files

Modified:

- `README.md`
- `src/app/router.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/TopBar.tsx`
- `src/features/dashboard/components/DashboardHeader.tsx`
- `src/features/dashboard/components/DashboardEmptyState.tsx`

Created:

- `src/pages/NotFoundPage.tsx`
- `public/_redirects`
- `vercel.json`
- `scripts/test-release-boundaries.mjs`
- `docs/release-readiness.md`

Removed after checking references:

- `src/pages/DashboardPage.tsx` (obsolete placeholder)
- `src/pages/PlaceholderPage.tsx`
- `src/App.css`
- `src/assets/hero.png`
- `src/assets/react.svg`
- `src/assets/vite.svg`
- `public/icons.svg` (unused starter sprite)

Existing documentation and repeatable tests were retained. Audit screenshots, browser harnesses, and logs remain in the parent workspace, outside the application source and production output. No Stitch files were changed.

## Workout lifecycle and storage

The production-browser lifecycle created a manual workout with 10 reps at 10 kg, verified Dashboard/History/Progress and reload, edited to 20 kg, verified the same views and reload, then deleted and verified empty views and reload. Displayed volume changed from 100 to 200 and then disappeared with deletion. Workout ID, local exercise ID, and createdAt stayed stable on edit; updatedAt changed.

The WGER lifecycle selected a picker exercise, saved it, reloaded, edited duration without changing the name, and verified retained external metadata. A manual rename cleared the reference; save and reload retained the manual result. Local exercise IDs remained independent of WGER IDs. Explorer prefill, malformed route state, no autosave, and normal manual/starter entry were also exercised in the regression checks.

| Storage scenario | Result |
| --- | --- |
| Unavailable storage / read exception | App and form rendered, understandable error appeared, input remained after failed save |
| Write exception | Save failure was visible and entered content remained in the form |
| Malformed top-level JSON / non-array data | Reads/mutations failed with feedback; original stored text was not overwritten |
| Partially invalid records | Existing defensive filtering retained valid records; reading did not rewrite storage |
| Invalid optional externalExercise | Existing integration tests retained the valid workout and dropped only the invalid reference |
| Theme write failure | Theme notice appeared; independent workout save still succeeded |

No fake workout content or WGER identity was introduced. All browser mutations used the isolated audit profile, not a user's normal browser data.

## WGER and routing

Controlled browser responses exercised loading, search, clear search, filter interaction, pagination, details, picker selection, and Explorer-to-Log prefill. Failure cases included network rejection, TimeoutError, HTTP 503, invalid JSON, malformed envelopes, partial bad records, and broken images. Error messages and retry controls remained usable. Manual logging still saved after each primary failure case. A deliberately delayed old response did not replace newer search results, even when the test response ignored cancellation.

These were deterministic fixtures at the browser fetch boundary, using the real app query, mapping, cancellation, and rendering code. They verify failure handling, not continued availability or every possible response from the live WGER service. No request semantics changed.

Direct navigation and refresh passed on `/`, `/log-workout`, `/history`, `/exercises`, `/progress`, `/motivation`, and an existing `/history/:workoutId/edit`. Missing edit IDs showed the existing recovery view. Unknown URLs showed the new in-shell not-found page. Trailing-slash headings, Back/Forward, client navigation, malformed prefill, and cold lazy loading passed. The shell remained visible while delayed route chunks loaded.

## Responsive, theme, and accessibility checks

All **72 combinations** passed: six primary routes × Light/Dark × widths 1440, 1024, 768, 390, 360, and 320. The 390px case used 844px height. Checks included horizontal overflow, shell-control placement, mobile navigation clearance, chart rendering, and runtime errors. **36 dialog combinations** covered discard, delete, and exercise details at all six widths in both themes, with bounds, Tab containment, Escape, and focus restoration checks.

Long History exercise names and long Motivation quote/playlist titles were stress-tested at all widths in both themes. Prior picker/form long-name checks were retained as supporting evidence; the current full matrix also covered form layout. Representative release screenshots were visually inspected. Both themes retained readable surfaces, native controls, selected states, image fallbacks, and chart axes/tooltips. System preference and live system changes passed separately. Existing palette tests passed their 4.5:1 text-color checks.

DOM checks found no duplicate IDs, unnamed native inputs/selects, unnamed buttons, missing image alt attributes, or nested links/buttons after the Dashboard fix. Existing labels, validation descriptions, named dialogs, status/error regions, decorative icons, and safe external links were inspected.

Targeted keyboard checks passed for navigation, More, theme selection, form save, picker selection, History expansion, edit/delete, modal focus/restore, exercise cards, Progress ranges, and alternative chart tables. Spotify links have descriptive names and safe outbound attributes. Visible focus was checked. No runtime console crashes were captured in the completed route, failure, and chart scenarios.

This is a practical DOM/keyboard/visual baseline in Chrome, not a complete WCAG conformance claim or an assistive-technology audit.

## Analytics and dates

All existing deterministic Progress tests passed unchanged: totals, volume, streaks, average/week, active days, name-based exercise frequency, daily/weekly/monthly groups, zero-filled inactive periods, same-day workouts, All Time, zero-weight sets, mutation recomputation, and timezone/DST stability. Progress excludes future dates using its existing semantics; Dashboard continues to summarize stored workout records. No formula was altered to force the two views to share a different scope.

Five added release tests cover leap-day validation, month/year transitions, local-date round trips, History's inclusive Monday–Sunday weeks across New Year and DST, History leap-month bounds, malformed top-level storage, partially invalid records, and read/write failures. Date-sensitive source paths continue to use the existing local-calendar helpers. Quote selection and today/yesterday streak behavior remain covered by the existing tests.

## Final build and performance

Final standard production build passed with strict mode and **no >500 kB warning**. Sizes below are from Vite's reporter, raw/gzip decimal kB.

| Chunk | Raw | Gzip |
| --- | ---: | ---: |
| index | 306.57 | 96.96 |
| shared Card/core | 8.73 | 3.37 |
| shared chartTheme/Recharts | 355.99 | 103.61 |
| WorkoutActivityChart | 2.10 | 0.94 |
| WorkoutHistoryPage | 11.68 | 3.88 |
| ExerciseExplorerPage | 12.48 | 3.81 |
| ProgressPage | 34.64 | 11.57 |
| MotivationPage | 12.25 | 4.42 |
| WorkoutFormPage | 20.87 | 6.03 |
| useExerciseExplorer | 8.03 | 3.19 |
| LogWorkoutPage | 0.15 | 0.15 |
| EditWorkoutPage | 0.84 | 0.48 |
| chevron-down / weight / trash-2 | 0.11 / 0.24 / 0.31 | 0.13 / 0.21 / 0.20 |
| CSS | 49.09 | 8.65 |

Final empty-Dashboard resource inspection requested only `index-S1Ou4SXY.js` and `Card-CN87Jzvg.js` among generated JavaScript assets: approximately 315.30 kB raw / 100.33 kB gzip combined. Recharts, WGER, Progress, Motivation, and form chunks were not downloaded there. Cold-cache delayed route loading showed the accessible status with the shell intact. No additional optimization was performed.

## Production and security sanity

No debug statements, broken placeholder links, inline HTML event handlers, production imports of audit fixtures, copied Stitch pages, or test screenshots were found in shipped source. Removed starter files were unreferenced. No environment files or obvious credential patterns were found in the inspected working tree; reviewed WGER requests use no stored secret. This does not audit every historical commit or constitute penetration testing.

Workout text is rendered through React text nodes. WGER descriptions remain plain text after the existing DOMParser normalization, with no dangerouslySetInnerHTML path. URL validation, unknown route-state normalization, defensive localStorage parsing, and outbound Spotify-only links remain in place. External links use noreferrer or noopener/noreferrer handling.

## Deployment requirements

Use `bodybloom` as project/base directory when deploying from the parent workspace, build with `npm run build`, and publish `dist`. The current router/base configuration expects deployment at the domain root. No backend or credentials are required.

History-based deep links require the host to serve index.html for application paths. `vercel.json` implements the minimal [Vercel Vite SPA rewrite](https://vercel.com/docs/frameworks/frontend/vite); `public/_redirects` supplies the [Netlify SPA fallback](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/) and was confirmed copied to dist. Actual static files should continue to be served normally. These configurations were inspected, not deployed. Verify deep links, edit links, assets, and refreshes on the chosen production host after deployment.

## Final command results

| Command | Result |
| --- | --- |
| npm run lint | Passed |
| npm run build | Passed after resolving the local generated-file lock |
| node scripts/test-progress.mjs | 8 passed |
| node scripts/test-theme.mjs | 4 passed |
| node scripts/test-motivation.mjs | 5 passed |
| node scripts/test-workout-integration.mjs | 7 passed |
| node scripts/test-release-boundaries.mjs | 5 passed |
| git diff --check | Passed |

**29 tests passed.** Existing tests were not rewritten. README lists the new repeatable test command.

Evidence in the parent workspace: `.bodybloom-release-matrix.log`, `.bodybloom-release-matrix.json`, `.bodybloom-release-failures.log`, `.bodybloom-release-lifecycle.log`, `.bodybloom-release-final.log`, `.bodybloom-release-*.png`, and corresponding Python browser harnesses. The harnesses reuse the existing local CDP helpers and require the isolated test browser/preview. They are not production code.

## Remaining limitations

- Browser checks used Chrome; Safari, Firefox, real mobile hardware, and screen readers were not comprehensively tested.
- Hosting rewrites are prepared, but the actual deployment and post-deploy smoke test remain intentionally unperformed.
- Workouts are local to a browser/origin, with no cloud backup or sync. Clearing site data removes them. Unsaved form drafts are not persisted across navigation or refresh; saving remains explicit.
- WGER and Spotify are external services. Controlled fixtures validate handling, not service availability. Spotify remains outbound links only.
- Existing recovery semantics skip invalid individual stored records while retaining valid ones; no recovery/migration framework was added.

Within that scope, the completed checks support **READY WITH MINOR LIMITATIONS**. No broad architectural change is needed for the tested release.
