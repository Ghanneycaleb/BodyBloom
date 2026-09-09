# Exercise Explorer implementation and verification

Implemented `/exercises` using the existing React/Tailwind shell and shared Dialog. The two Stitch Exercise Explorer screenshots and their HTML were inspected as read-only references. Desktop uses three image cards per row; mobile uses two cards from 360px and one below that. Category chips scroll on mobile, with muscle and equipment controls behind More filters. Mobile navigation keeps four items and exposes Exercises, Progress, and Motivation through More.

## API contract

Verified against the live public WGER API on 2026-09-09. No API key or authentication is required for these reads. The live API allowed browser requests from the local application origin.

Runtime endpoints, all under `https://wger.de/api/v2/`:

- `exerciseinfo/`: nested exercises, translations, categories, primary/secondary muscles, equipment, and images.
- `exercisecategory/`, `muscle/`, `equipment/`: real filter options.
- `license/`: source and image license names and links.
- `exerciseinfo/{id}/`: source-record link in the details dialog.

`language/` was inspected during implementation: English is language ID `2`. Runtime exercise requests use `language__code=en`; mapping independently selects English translations, so unexpected multilingual responses cannot render duplicate translations or substitute another language. Each base exercise is represented once by its stable `source: 'wger'` and `sourceId`.

Search is explicit (submit or Enter), using `name__exact`. Despite that parameter's name, WGER implements case-insensitive substring matching against exercise names and aliases. Filters use `category`, `muscles` (primary muscles), and `equipment` IDs. Requests use `ordering=id`, `limit=12`, and the returned `next` URL. Live checks confirmed English browsing, search, all three filter combinations, and pagination. At verification time, English browsing returned 900 exercises and searching for `bench` returned 27; these are observations, not application constants.

References: [WGER API documentation](https://wger.readthedocs.io/en/latest/api/api.html), [WGER filter implementation](https://github.com/wger-project/wger/blob/master/wger/exercises/api/filtersets.py).

## Data flow and failure handling

Native fetch → validated response envelope and DTO decoding → normalized Exercise model → feature-local hook state → presentation components. Workout types, calculations, Context, starter exercise list, and localStorage schema are unchanged. No packages were installed.

Descriptions are parsed into an inert DOM document, non-content nodes are removed, and only normalized plain text is rendered by React. HTML entities and paragraph separation are preserved; no HTML is injected. Missing English names/instructions and missing metadata have explicit fallbacks. Missing or failed images retain the card's image area and show a Lucide illustration. Details include available authors and licenses.

Load More appends results, deduplicating by WGER ID. New searches/filters reset the list and cancel the previous request. An in-flight guard prevents repeated Load More clicks; aborted/stale responses are ignored. Requests time out after 20 seconds. Pagination validates the origin, endpoint, filters, and increasing offset before following links. HTTP, network, timeout, invalid JSON/envelope, and wholly unreadable records show a retryable error. Partially invalid records are skipped with a visible count. An append failure preserves already loaded cards and retries the failed page. Metadata errors have a separate retry control.

The existing Dialog now supports optional confirmation and a wider informational layout. Exercise details open at the top with a close control. Escape, Tab containment, focus restoration, and background scroll locking are retained. Confirmation dialogs still initially focus their cancel action.

## Files

Created under `src/features/exercises/`:

- `ExerciseExplorerPage.tsx`
- `exercise.api.ts`
- `exercise.types.ts`
- `exercise.mappers.ts`
- `useExerciseExplorer.ts`
- `components/ExerciseSearch.tsx`
- `components/ExerciseFilters.tsx`
- `components/ExerciseCard.tsx`
- `components/ExerciseImage.tsx`
- `components/ExerciseGrid.tsx`
- `components/ExerciseDetailsDialog.tsx`

Modified:

- `src/app/router.tsx`: replaces the Exercises placeholder.
- `src/components/layout/BottomNav.tsx`: accessible More navigation.
- `src/components/layout/AppShell.tsx`: bottom-nav and safe-area clearance, including tablets.
- `src/components/ui/Dialog.tsx`: informational details, width option, top close control and initial scroll position.
- `src/index.css`: minimum body width respects available width when a scrollbar is present at 320px.

This report is `docs/exercise-explorer.md`. Browser screenshots were saved outside the application in the workspace as `.bodybloom-exercises-{1440,390,320,768}.png` and `.bodybloom-exercises-dialog-390.png`. Stitch files were not edited.

## Verification

`npm run lint`: passed. `npm run build`: passed, with Vite's large-chunk warning (approximately 713 kB before gzip). `npm run dev -- --host 127.0.0.1 --port 5182`: started successfully. Browser checks used the production preview and an isolated headless Chrome profile, without touching personal browser storage.

| Requested checks | Result and method |
| --- | --- |
| A–B: route and initial data | Passed with live WGER data; 12 initial cards and one exercise request. |
| C–F: search, clear, filters, empty results | Passed against live API; exercised category, primary muscle, and equipment filters and a nonexistent search term. |
| G–H: error and retry | Passed with isolated browser fetch fixtures for HTTP 503, network rejection, malformed envelope, invalid JSON, and timeout rejection; metadata retry also passed. |
| I–J: missing image/description | Passed with null/missing fields and a genuinely broken image URL; layout retained and readable fallbacks shown. |
| K–L: details and keyboard | Passed: click/Enter, initial close focus, initial scroll at top, Tab/Shift+Tab containment, Escape, and return to originating card. |
| M–N: English and translation deduplication | Passed with live English responses plus fixtures containing German and multiple English translations. Script contents were removed and entities decoded in the description fixture. |
| O–P: pagination and duplicates | Passed live 12→24 cards; duplicate-ID fixture deduplicated correctly after an append failure and retry. Untrusted pagination rejected; delayed stale search did not overwrite newer results. |
| Q: mobile navigation | Passed through More → Exercises; advanced mobile filters expand. |
| R–S: mobile layouts | Passed at 390×844 and 320×844; checked actual document client width, dialog bounds/scroll width, and footer clearance above fixed navigation. Also checked 768×1024. |
| T: desktop and Stitch intent | Visually reviewed desktop and mobile screenshots against the inspected Stitch variants: emerald controls, pale surfaces, rounded image cards, clear hierarchy, and responsive grid. |

Shared-dialog regression: Log Workout's Keep editing/Discard actions, safe initial focus, and preservation of entered duration when cancelling the dialog all passed.

## Deferred

Log Workout integration is intentionally deferred. A future change can accept a selected normalized WGER exercise and prefill the existing form's name/muscle fields, with an explicit decision about persisting the optional external source ID. The current canonical Workout model is not changed by this feature. Progress, Motivation, dark mode, and other excluded features remain out of scope.

WGER content and availability remain external dependencies. The current public language ID and filter contract are verified assumptions; a future API change may require mapper or parameter updates. Bundle splitting remains a separate performance follow-up.
