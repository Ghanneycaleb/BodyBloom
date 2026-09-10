# TypeScript strict-mode hardening

## Baseline and configuration

Baseline `npm run lint` and `npm run build` both passed before changes. Adding explicit `strict: true` to both `tsconfig.app.json` and `tsconfig.node.json` produced **0 initial compiler errors**. The initial strict build completed successfully before source edits. Consequently, there were no compiler-error categories requiring remediation; the source changes below are small audit improvements.

The root project's references and browser/Node project separation are unchanged. Existing unused-variable, unused-parameter, lint, and compiler checks remain enabled. No strict subcheck was disabled. `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` were not added.

## Audit and changes

| Area | Finding and action |
| --- | --- |
| DOM, refs, React events | Existing typed refs, optional access, event inference, and focus restoration compile strictly; retained |
| Storage parsing | JSON enters as unknown and passes runtime validation; retained |
| Optional WGER fields | Unknown input is decoded with existing defaults and nullable fields; documented that DTO types represent decoded records, not unchecked wire input |
| API envelope | Made response JSON explicitly unknown; removed the pagination-link cast because the preceding runtime guard already narrows it |
| Router state | Made the form's local route-state boundary explicitly unknown before the existing normalizer |
| Context | Kept undefined context plus guarded useWorkouts; explicitly typed initial provider state instead of casting its empty array |
| Recharts payload | Replaced the ProgressPeriod assertion with unknown and guards for the label and numeric fields consumed by the tooltip |
| Timers | Existing ReturnType<typeof setTimeout> and browser timer calls are appropriate; retained |
| Unions and optional properties | Theme unions, form/error types, external source literals, and optional metadata remain precise |
| Index access | Reviewed quote bounds/modulo, default exercise initialization, progress loop bounds, mapper fallbacks, filter arrays, playlists, and chart optional access; no strict errors or new assertions required |

Workout, WorkoutExercise, WorkoutSet, storage keys, and externalExercise semantics did not change. Source IDs remain positive safe integers validated at runtime, independently of local exercise IDs. No migration or persistence changes were made. Analytics calculations and WGER requests/normalization are unchanged.

Three casts were removed: the Context empty workout array, validated WGER pagination link, and Recharts tooltip payload. No explicit TypeScript `any` types, double assertions, non-null assertions, suppression comments, or lint-disable additions were introduced.

Retained assertions:

- WGER `record()` casts to `Record<string, unknown>` only after checking for a non-null, non-array object. Values still require individual validation.
- Playlist normalization uses the same localized record assertion after equivalent object checks, then validates individual values.
- WGER metadata uses `as const` for a Map entry tuple; this preserves tuple inference and asserts no external data validity.

Normal application behavior and presentation are unchanged. The tooltip now returns no content for an unexpected malformed library payload instead of trusting the assertion; valid chart records render identically. During implementation, TypeScript correctly rejected indexing the narrowed unknown object with a union key; choosing the guarded volume/count property explicitly resolved that error without an assertion.

## Exact files

Modified:

- `tsconfig.app.json`
- `tsconfig.node.json`
- `src/features/exercises/exercise.api.ts`
- `src/features/exercises/exercise.mappers.ts`
- `src/features/exercises/exercise.types.ts` (documentation only)
- `src/features/workouts/WorkoutFormPage.tsx`
- `src/features/workouts/workout.context.tsx`
- `src/features/progress/components/ProgressTrendChart.tsx`

Created: `docs/typescript-strict-mode.md`.

## Verification

| Command | Result |
| --- | --- |
| node scripts/test-progress.mjs | 8 passed |
| node scripts/test-theme.mjs | 4 passed |
| node scripts/test-motivation.mjs | 5 passed |
| node scripts/test-workout-integration.mjs | 7 passed |
| npm run lint | Passed |
| npm run build | Passed with strict enabled in both projects |
| git diff --check | Passed |

All 24 existing tests passed unchanged. No additional project test scripts were found. The existing build warning for a JavaScript chunk over 500 kB remains.

Browser regression checks used the production build at the existing local preview server, in the isolated test browser profile. WGER responses were controlled fixtures for repeatable success/failure checks. No real user workout data was changed.

| Requested regression | Result |
| --- | --- |
| A. Dashboard loads | Passed after workout saves |
| B–C. Create/manual logging | Passed, including starter suggestions |
| D. WGER picker | Passed selection, field population, cancel, and offline/manual fallback |
| E. Explorer prefill | Passed, including refresh, malformed state, and no autosave |
| F. History loads | Passed with saved workout display |
| G. Edit | Passed, preserving identity and updating/clearing external references correctly |
| H. Delete | Passed with persisted count change |
| I. Progress | Passed; both volume and count tooltips tested in Light and Dark |
| J. Motivation | Passed |
| K–L. Theme switching/dark mode | Passed |
| M. Dialog focus | Picker Escape/restoration passed; existing discard, details, and delete flows exercised |
| N. Runtime console errors | None captured in final page/chart checks |

Browser evidence: `../.bodybloom-strict-results.log`; the workspace harness is `../.bodybloom-strict-check.py` and reuses the existing integration/theme browser helpers.

## Deferred

Additional indexed-access/optional-property flags, dependency declaration checking changes, bundle splitting, broad refactors, features, and visual redesigns are outside scope. No Stitch files were modified. This pass does not claim a full cross-browser or screen-reader audit.
