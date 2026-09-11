# BodyBloom

Track your progress. Feel your growth.

A responsive fitness-tracking MVP for logging workouts and seeing your progress.

## Features

- Manual or WGER-assisted workout entry with sets, reps, and weight
- Workout history, editing, and deletion
- Dashboard statistics, activity charts, streaks, and Progress analytics
- Searchable WGER Exercise Explorer with workout prefill
- Daily local motivation and curated outbound Spotify playlist links
- System, Light, and Dark themes; desktop and mobile navigation

## Stack

React 19, TypeScript 6 (strict), Vite 8, Tailwind CSS 4, React Router 7, Recharts 3, and Lucide React. No backend, authentication, or additional state library.

## Run locally

Use a Node.js version supported by Vite 8 (the project has been verified with Node 20.19.2).

```sh
npm ci
npm run dev
```

## Build and verify

```sh
npm run lint
npm run build
npm run preview
node scripts/test-progress.mjs
node scripts/test-theme.mjs
node scripts/test-motivation.mjs
node scripts/test-workout-integration.mjs
node scripts/test-release-boundaries.mjs
```

Production output is in `dist/`. See `docs/` for architecture and audit reports.

## Data and external services

Workouts are saved in this browser's localStorage, with a separate theme preference key. There is no account, cloud sync, or backup service. Clearing browser/site data removes saved workouts; different browsers and origins have separate data.

WGER supplies exercise data without stored credentials. Exercise search needs a network connection; manual logging remains usable if WGER fails. Spotify links open public playlists in a new tab; this app does not authenticate with Spotify or play music itself.

## Static deployment

Set the project/base directory to `bodybloom` if deploying from the parent workspace, run `npm run build`, and publish `dist` (relative to that directory). Deploy at the domain root with the current router/base configuration.

History-based routes require an SPA fallback for direct navigation and refresh. `vercel.json` supplies the Vercel rewrite; `public/_redirects` is copied into `dist` for Netlify. Existing files should be served normally and other paths should reach `index.html`. After deploying, check direct `/history`, `/progress`, and edit-route refreshes on the actual host.

Host guidance: [Vercel Vite SPA rewrites](https://vercel.com/docs/frameworks/frontend/vite), [Netlify SPA rewrites](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/).

No deployment is performed by the audit scripts. Deploying to a new origin does not transfer local workouts from localhost or another site.
