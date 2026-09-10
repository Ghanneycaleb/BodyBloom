# WGER to Log Workout integration

## Implementation

`WorkoutExercise` now optionally carries `externalExercise: { source: 'wger'; sourceId: number }`. The existing local `exerciseId` is still generated on creation and preserved on edit. WGER references use the normalized Explorer exercise's base `sourceId`, never a translation ID. No migration is required.

Storage loading accepts only `wger` with a positive safe-integer source ID. Invalid optional references are omitted from the loaded exercise while the otherwise valid workout survives. Loading does not rewrite localStorage. Historical manual records stay manual; no identity is inferred from names. Existing required-field validation and save architecture remain intact.

The shared create/edit WorkoutFormPage owns picker visibility and its target row. Add Exercise opens the picker for a new row; Choose from WGER replaces the selection in an existing row. A row is added only after choosing an exercise or Enter manually. Selection preserves existing sets, UI row identity, and persisted local exercise identity. Muscle text uses normalized primary muscles, then category, then General.

ExercisePickerDialog directly reuses `useExerciseExplorer`, including the existing API, mapping, abort handling, search, pagination, and retry behavior. It also reuses ExerciseSearch, Dialog, Button, and semantic colors. There is no second WGER API implementation or query extraction. The compact result list shows names and category/muscle information with a decorative dumbbell icon; photography and instructions remain in Explorer. The existing hook also loads metadata, although the picker does not expose advanced filters.

Manual inputs and starter datalist suggestions remain available. Picker failure offers Retry search and Enter manually, without involving WorkoutContext or workout storage. Enter manually on an existing row returns focus to its name without silently altering the row.

## Identity and dirty rules

- Selecting or reselecting WGER writes the chosen source reference and preserves the row's sets.
- Any name change other than leading/trailing whitespace clears the external reference immediately. This includes case changes. Reverting text does not infer/restore a reference; selecting through the picker restores it.
- Editing muscle text, sets, date, or duration alone retains the reference.
- Picker open/close and search alone do not change form content or dirty state.
- Selection is meaningful content. External references participate in dirty comparison, including selecting a different source with the same name.
- Existing edit initialization preserves the reference, workout ID, createdAt, and local exercise IDs.

Explorer details provides a keyboard-accessible Log this exercise button. React Router navigation state carries a small `exerciseSelection` with source, sourceId, name, and muscleGroup. An unknown-input normalizer validates that shape and discards extra fields. Missing or malformed state falls back to the ordinary blank form. No temporary selection is saved globally or in localStorage.

Valid prefill initializes exactly one exercise against the ordinary blank baseline, retaining today's date, 45-minute duration, and the default set (10 reps, 0 weight). Prefill therefore counts as intentional unsaved content and Cancel asks for discard confirmation. It never autosaves. Browser refresh with preserved history state reapplies the validated prefill; a visit without state remains normal. Unsaved subsequent edits are not a persisted draft.

## Exact file changes

Created:

- `src/features/workouts/workout.external.ts`
- `src/features/workouts/components/ExercisePickerDialog.tsx`
- `scripts/test-workout-integration.mjs`
- `docs/workout-exercise-integration.md`

Modified:

- `src/features/workouts/workout.types.ts`
- `src/features/workouts/workout.storage.ts`
- `src/features/workouts/workout.form.ts`
- `src/features/workouts/WorkoutFormPage.tsx`
- `src/features/workouts/components/ExerciseFormCard.tsx`
- `src/features/exercises/components/ExerciseDetailsDialog.tsx`

## Verification

Commands:

- `node scripts/test-workout-integration.mjs`: 7 passed.
- `node scripts/test-progress.mjs`: 8 passed.
- `node scripts/test-theme.mjs`: 4 passed.
- `node scripts/test-motivation.mjs`: 5 passed.
- No separate pre-existing workout or Explorer test scripts were found. New tests cover workout form/storage compatibility and selection normalization.
- `npm run lint`: passed, including the new test script.
- `npm run build`: passed. Existing >500 kB chunk warning remains; bundle splitting was explicitly excluded.
- `npm run dev -- --host 127.0.0.1 --port 5188`: started successfully at 5190 because 5188/5189 were occupied.
- `git diff --check`: passed.

The seven pure tests cover valid serialization/loading, old/manual records, invalid optional metadata, independent local identity, edit timestamps, preserved sets, rename/reselection, malformed navigation state, dirty semantics, and normalized muscle fallback.

Browser verification used an isolated Chrome profile against production preview at 5189 with controlled WGER responses. The shared search request was checked for the actual `name__exact=Bench` parameter. A separate live read-only WGER search returned HTTP 200, 27 matches, and base IDs 73, 75, 76 in its first three results. This live endpoint check does not replace cross-browser network testing.

| Requested checks | Result / evidence |
| --- | --- |
| A–C: normal/manual/starter entry | Browser save succeeded without external metadata; starter datalist retained and used |
| D–G: picker/search/select/populate | Browser passed; selection also activated with Enter |
| H–I: source and local identity | Persisted source/sourceId checked; local identity remained independent |
| J–M: reload/edit/replacement/rename | Browser and pure tests passed; createdAt and local exerciseId preserved |
| N: cancel unchanged | Picker Escape restored focus; subsequent form Cancel left without discard prompt |
| O: failure/manual fallback | Simulated network rejection displayed error; manual entry and save succeeded |
| P–R: Explorer prefill/no autosave/malformed state | Browser passed, including refresh and prefill discard confirmation |
| S–T: History/Dashboard | Saved workouts displayed after context updates; existing shared calculation tests passed |
| U: Progress | Browser rendered new records; all 8 existing calculation/regression tests passed with name-based semantics unchanged |
| V: CRUD | Browser created, edited, replaced, renamed, and deleted workout records |
| W–X: themes | Light/Dark and System picker checks passed; representative screenshots reviewed |
| Y–AB: viewports | Picker tested at 1440, 768, 390x844, and 320 in all three preferences |
| AC: overflow | Picker and long-name form checks passed; save button stayed above mobile navigation |
| AD: keyboard | Tab containment, Escape, focus restoration, and Enter selection passed |
| AE: console | No runtime errors captured in responsive scenarios |

Twelve picker/theme/width combinations passed. Eight additional Light/Dark/width cases used twelve extremely long exercise names to verify dialog scrolling, wrapping, form width, and save-bar clearance. The shared dialog scrolls as one region so search/results/footer remain reachable within its viewport-constrained height. Tests did not alter real user workouts; fixtures existed only in the isolated browser profile.

Workspace artifacts: `../.bodybloom-integration-results.log`, `../.bodybloom-integration-extra.log`, and `../.bodybloom-integration-*-picker.png`. Browser harnesses are retained alongside these artifacts; the Node tests require only existing dependencies.

## Deferred / preserved scope

No changes to analytics frequency semantics, WGER endpoints/mappers, Context CRUD, Dashboard/History/Progress designs, themes, strict mode, dependencies, or the parent Stitch export. No migration framework, background rewrite, draft persistence, advanced picker filters, image gallery, or bundle splitting was added. Full cross-browser and assistive-technology audits remain outside this controlled integration pass.
