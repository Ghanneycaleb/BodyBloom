# BodyBloom

### Track your progress. Feel your growth.

![BodyBloom dashboard showing a dark fitness tracking interface with a left sidebar, top navigation, a welcome banner, metric cards, and a recent workouts panel; text reads BodyBloom Dashboard, Good morning, athlete., Total Workouts, Current Streak, Total Volume, Most Performed, and Latest sessions; the overall tone is clean, focused, and motivating.](./bb-dashboard.png)

**BodyBloom** is a responsive fitness tracking web application for logging workouts, exploring exercises, monitoring training progress, and building consistency.


### [Launch BodyBloom →](https://body-bloom.vercel.app)

**Current Release:** `v1.0.0`

---

## Overview

BodyBloom was built around a simple goal: make fitness progress easy to record, understand, and revisit.

Users can log complete workout sessions, explore exercises through the WGER database, review and edit workout history, and turn their training data into meaningful progress insights.

The current release is a client-side MVP. Workout data is validated and stored locally in the browser, keeping the application lightweight and usable without requiring an account.

---

## Features

### Workout Tracking

- Log exercises, sets, repetitions, weight, date, and workout duration
- Add exercises manually or select them from WGER
- Automatically calculate training volume
- Edit and delete previously recorded workouts
- Persist workout history between browser sessions

### Exercise Explorer

- Search live exercise data from the WGER API
- Filter exercises by category, muscle group, and equipment
- View detailed exercise information
- Add WGER exercises directly to the workout logger
- Continue manual workout logging when WGER is unavailable

### Progress Analytics

- Total workouts
- Training volume
- Current workout streak
- Average workouts per week
- Active training days
- Workout frequency
- Exercise frequency
- Training-volume trends
- Consistency visualization
- 4 Weeks, 3 Months, 6 Months, and All Time analysis

### Workout History

- Browse previously completed workouts
- Filter history by All Time, This Week, or This Month
- Inspect individual exercises and sets
- Edit existing workout sessions
- Delete workouts with confirmation
- Automatically reflect changes across Dashboard and Progress analytics

### Motivation

- Daily BodyBloom motivation
- Training-phase guidance
- Curated Spotify playlists for different workout phases
- Safe outbound playlist links without requiring Spotify authentication

### Responsive Experience

- Desktop sidebar navigation
- Mobile bottom navigation
- System, Light, and Dark themes
- Persistent theme preferences
- Responsive forms, charts, cards, dialogs, and exercise grids

---

## Tech Stack

| Category | Technology |
| --- | --- |
| Frontend | React 19 |
| Language | TypeScript 6 — Strict Mode |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| Data Visualization | Recharts 3 |
| Icons | Lucide React |
| Exercise Data | WGER API |
| Persistence | Browser localStorage |
| Deployment | Vercel |
| Version Control | Git & GitHub |

No backend, authentication service, or additional state-management library is required for the current release.

---

## Architecture

BodyBloom follows a feature-oriented architecture that separates application infrastructure, reusable UI, and domain-specific functionality.

```text
src/
├── app/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── dashboard/
│   ├── workouts/
│   ├── history/
│   ├── exercises/
│   ├── progress/
│   ├── motivation/
│   └── theme/
└── lib/
```

Workout data flows through a centralized application layer:

```text
localStorage
     ↓
Validation & Storage
     ↓
WorkoutProvider
     ↓
useWorkouts()
     ↓
Dashboard · Workout Forms · History · Progress
```

Feature routes are code-split to reduce initial JavaScript loading, while external and persisted data are validated before being consumed by application features.

---

## Engineering Highlights

Beyond the core feature set, BodyBloom was built with attention to production-oriented frontend engineering.

- **Strict TypeScript** — strict mode is enabled across the application.
- **Defensive persistence** — stored workout data is parsed and validated before use.
- **Resilient API integration** — WGER failures, timeouts, malformed responses, stale requests, and unavailable images are handled gracefully.
- **Accessible interactions** — forms, dialogs, navigation, loading states, errors, and keyboard interactions use practical accessibility patterns.
- **Responsive design** — the application was verified across desktop, tablet, and mobile layouts.
- **Route-level code splitting** — non-critical features are loaded on demand to reduce initial JavaScript delivery.
- **Theme persistence** — System, Light, and Dark preferences persist between visits.

The production optimization pass reduced the initial empty-Dashboard JavaScript asset graph from approximately **769 kB to 315 kB raw**.

---

## Getting Started

### Prerequisites

- Node.js 20.19+ or another version supported by Vite 8
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/Ghanneycaleb/BodyBloom.git
cd BodyBloom
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Testing & Quality

Run lint and production build verification:

```bash
npm run lint
npm run build
```

Run the repeatable application tests:

```bash
node scripts/test-progress.mjs
node scripts/test-theme.mjs
node scripts/test-motivation.mjs
node scripts/test-workout-integration.mjs
node scripts/test-release-boundaries.mjs
```

BodyBloom `v1.0.0` passed **29 automated tests** covering progress calculations, themes, workout/WGER integration, storage boundaries, and release-critical behavior.

The production release was also verified across workout CRUD flows, responsive layouts, Light/Dark themes, WGER failure scenarios, route navigation, persistence, and practical keyboard interactions.

See [`docs/`](./docs/) for additional architecture, implementation, and release-audit documentation.

---

## Data & External Services

### Workout Data

BodyBloom `v1.0.0` does not require an account.

Workout data is stored using the browser's `localStorage` and is not uploaded to a BodyBloom server.

This means:

- Workouts remain specific to the current browser and origin
- Clearing site data removes locally stored workouts
- Workouts do not currently synchronize between devices
- Cloud backup and account-based recovery are not currently available

### WGER

WGER provides exercise data without stored credentials.

Exercise discovery requires a network connection, but manual workout logging remains available if WGER cannot be reached.

### Spotify

BodyBloom provides curated outbound Spotify playlist links. The application does not authenticate with Spotify or stream music directly.

---

## Deployment

BodyBloom is deployed on **Vercel**.

### [Live Application →](https://body-bloom.vercel.app)

The application includes SPA fallback configuration for direct navigation and refreshes across history-based routes.

For local production verification:

```bash
npm run build
npm run preview
```

Production output is generated in `dist/`.

---

## Roadmap

### v1.0.0

- [x] Workout logging
- [x] Workout history, editing, and deletion
- [x] WGER Exercise Explorer
- [x] WGER-to-workout integration
- [x] Progress analytics
- [x] Workout streak tracking
- [x] Training-volume visualization
- [x] Motivation Hub
- [x] Spotify playlist recommendations
- [x] Responsive desktop and mobile experience
- [x] System, Light, and Dark themes
- [x] Route-level code splitting
- [x] Production deployment

### Future

- [ ] User authentication
- [ ] Cloud workout storage
- [ ] Cross-device synchronization
- [ ] User profiles
- [ ] Cloud backup and recovery
- [ ] Expanded progress insights

The current release intentionally remains a lightweight client-side application. Cloud functionality will be evaluated as a separate evolution of the architecture.

---

## Release

**Version:** `v1.0.0`  
**Status:** Live  
**Deployment:** Vercel

### [Try BodyBloom →](https://body-bloom.vercel.app)

---

## Author

**Caleb Ghanney**

Computer Engineer and software developer focused on building practical, user-centered digital products.

[GitHub](https://github.com/Ghanneycaleb)

---

## License

This project is currently maintained as a portfolio and educational project.

