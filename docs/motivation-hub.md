# Motivation Hub

Implemented `/motivation` in the existing AppShell with a daily original BodyBloom quote, five curated music recommendations, and a compact music mood guide. Both parent Stitch Motivation screenshots and corresponding HTML were inspected as read-only references before implementation.

The desktop layout uses an emerald quote card beside a white guide card, followed by the playlist grid. Mobile presents the quote, music picks, then the guide in one responsive component tree. Local gradients and Lucide icons provide the artwork. Unsupported Play All controls, BPM intensity targets, fake tracks, and third-party photos/album covers were not reproduced.

## Quote selection and sources

`motivation.data.ts` contains twelve short original lines written for BodyBloom, each explicitly attributed to BodyBloom and tagged Consistency, Growth, Recovery, or Focus. No famous-person attributions, third-party quotations, song lyrics, or external quote API are used.

The daily selector:

1. Gets the local calendar key through the existing `getTodayDateString()` helper.
2. Validates the key using the existing calendar-date validator.
3. Converts that already-local `YYYY-MM-DD` key to a day ordinal.
4. Selects `((ordinal % quoteCount) + quoteCount) % quoteCount` from the ordered dataset.

The same local calendar day always selects the same quote while the dataset remains unchanged. Consecutive days select consecutive entries, cycling every twelve days. The ordinal does not convert a UTC timestamp back into a local date, so DST and timezone offsets do not shift the selected calendar key. Invalid date input selects the first quote; an empty dataset has an original BodyBloom fallback.

`useMotivationDate()` keeps only local component state. It schedules the next local midnight and rechecks on window focus or tab visibility, so a page left open advances without a reload. Timers and listeners are cleaned up on unmount. There is no random selection, quote persistence, new Context, or backend.

## Playlist strategy and sources

The local typed playlist dataset stores public titles, editorial workout-phase suggestions, short original descriptions, optional genre/BPM, and external URLs. Playlist destinations were verified on Spotify on **2026-09-10**:

| BodyBloom phase | Verified playlist |
| --- | --- |
| Warm Up | [Happy Hits!](https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC) |
| Strength | [Beast Mode](https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP) |
| Cardio | [Workout](https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh) |
| Focus | [Brain Food](https://open.spotify.com/playlist/37i9dQZF1DWXLeA8Omikj7) |
| Cool Down | [Peaceful Piano](https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO) |

Phase labels are BodyBloom editorial suggestions, not Spotify-provided workout classifications. Electronic/Piano descriptions are supported by the respective playlist pages. No playlist-wide BPM, track count, duration, popularity statistic, or artist roster is invented. BPM is omitted from the current dataset because a changing playlist has no single verified tempo.

The page does not fetch Spotify data, embed a player, authenticate, or require an account connection. Playback takes place on Spotify after the user follows a link; the external service controls its availability and playback requirements. No authenticated playback was tested.

## Defensive behavior and external links

`normalizePlaylists()` validates data at the presentation boundary, skips malformed required fields and duplicate IDs, and omits invalid optional fields. Missing genre, description, and BPM do not leave empty labels. A missing or invalid URL retains the informational card with “Spotify link unavailable” and no CTA. An entirely unusable dataset shows a simple local-data empty state.

`safeSpotifyUrl()` accepts only HTTPS URLs on exactly `open.spotify.com`, with a public `/playlist/` path and a 22-character alphanumeric ID. Credentials, unexpected ports, wrong hosts, unsafe schemes, and malformed paths are rejected. Query parameters and fragments are removed. Link safety is also checked at card rendering.

Links use `target="_blank"` and `rel="noopener noreferrer"`, with accessible names containing the playlist title, Spotify destination, and new-tab behavior. The section visibly explains that listening happens on Spotify. URL validation checks destination structure; it cannot guarantee a playlist will remain available forever.

## Accessibility and layout

- A semantic page heading, section headings, playlist headings, `blockquote`, and `figcaption` communicate hierarchy and attribution.
- The daily quote is a polite live region for date-driven updates.
- Decorative artwork and icons are hidden from assistive technology.
- Music cards are informational articles; only their actual links are interactive.
- Links have visible keyboard outlines and at least 48px touch targets.
- No image, iframe, audio, or video dependency exists in the feature.
- Existing More → Motivation navigation and safe-area spacing are preserved.

## Files

Created:

- `src/features/motivation/MotivationPage.tsx`
- `src/features/motivation/motivation.types.ts`
- `src/features/motivation/motivation.data.ts`
- `src/features/motivation/motivation.utils.ts`
- `src/features/motivation/useMotivationDate.ts`
- `src/features/motivation/components/DailyQuoteCard.tsx`
- `src/features/motivation/components/SessionGuide.tsx`
- `src/features/motivation/components/PlaylistSection.tsx`
- `src/features/motivation/components/PlaylistCard.tsx`
- `scripts/test-motivation.mjs`
- `docs/motivation-hub.md` — this report.

Modified:

- `src/app/router.tsx` — replaces the Motivation placeholder and removes its now-unused import.

Workout schema, Context, CRUD, WGER, Progress, History, navigation, and the parent Stitch export were not modified. No dependencies were installed.

Workspace screenshots outside the app: `.bodybloom-motivation-{1440,768,390,320}.png` and `.bodybloom-motivation-music-{1440,390}.png`.

## Verification

- `node scripts/test-motivation.mjs`: **5/5 tests passed** using Node's built-in test runner and the existing TypeScript dependency. Covers daily rotation, leap/year boundaries, timezone stability, original attribution/fallbacks, safe URLs, malformed records, duplicate IDs, and optional metadata.
- `npm run lint`: **passed**.
- `npm run build`: **passed**. Existing large-chunk warning remains: approximately 760 kB / 226 kB gzip.
- `npm run dev -- --host 127.0.0.1 --port 5186`: **started successfully**. Production browser checks used the build served on port 5187.

Browser checks used an isolated headless Chrome profile. Date changes were simulated in that profile; no user storage or production data was modified. A separate temporary React root on the dev server exercised malformed playlist props without changing the curated dataset.

| Requested checks | Result |
| --- | --- |
| A | Motivation route and page heading loaded successfully. |
| B–C | Same-day reload preserved the quote; advancing the local calendar day predictably changed it. Repeated focus preserved the current quote. The midnight timer also updated the quote without navigation. |
| D–E | All quotes use original BodyBloom attribution; source inspection found no `Math.random()` selection. |
| F–G | Five cards rendered. Optional metadata was omitted cleanly. Malformed entries and invalid/missing links rendered safely in an isolated fallback test. |
| H | All five destinations verified on Spotify. Rendered links use the expected HTTPS URLs, descriptive accessible names, new-tab targets, and safe rel attributes. Unsafe URL cases were rejected by tests. |
| I–J | Content/source review confirmed no lyrics or copied album artwork. No feature image/player elements or Spotify resource fetches occurred while loading the page. |
| K | Desktop screenshot reviewed against Stitch: emerald hero, white supporting guide, rounded cards, local artwork, and three-column music grid. |
| L–N | 768px, 390×844, and 320px checks passed with no document horizontal overflow. Quote/card layout and touch targets remained usable; footer cleared fixed navigation. |
| O–P | Existing More → Motivation route passed. Keyboard focus followed music links sequentially, with visible outlines at every tested viewport. |
| Q | No production or fallback-component runtime console errors were recorded in the successful checks. |

## Intentionally deferred

Spotify authentication, embedded playback, Play All, playlist editing, favorites, social sharing, coaching, an external quotes API, dark mode, and the other excluded product features remain out of scope. The optional additional quote collection was omitted to keep the page focused. Playlist availability and contents can change; links can be updated in the local dataset without changing the architecture.
