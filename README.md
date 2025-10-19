# BodyBloom

Track your progress. Feel your growth.

BodyBloom is a comprehensive fitness tracking web application designed to help users log workouts, monitor progress, explore exercises, and stay motivated throughout their fitness journey. The application combines intuitive workout logging, real-time exercise data, progress visualization, and daily motivation to create a complete fitness companion.

## Overview

BodyBloom goes beyond simple workout tracking. It provides users with a complete ecosystem for managing their fitness including workout logging, historical analysis, exercise discovery, progress analytics, and daily motivation through curated content.

## Key Features

### Workout Logging
Record exercises with detailed metrics including sets, reps, and weight lifted. The application calculates workout statistics automatically, including total volume and estimated duration.

### Workout History
View all past workouts organized by date. Filter workouts by time period (all time, this week, this month), view detailed exercise breakdowns, and manage your workout records with edit and delete functionality.

### Exercise Exploration
Browse a comprehensive exercise database sourced from the WGER API. Search exercises by name, filter by muscle group, and view detailed information about proper form and muscle targeting.

### Progress Dashboard
Visualize your fitness journey through interactive charts showing workout frequency and total volume over time. View statistics including total workouts, current streak, and most performed exercises.

### Motivation Hub
Access daily motivational quotes and a curated playlist of workout songs with direct Spotify integration. Each song includes genre and BPM information for matching your workout intensity.

### Dark Mode
Toggle between light and dark themes with persistent preference storage. The application respects system dark mode preferences and remembers user choices.

## Technology Stack

Frontend Framework: React 18
Routing: React Router v6
Styling: Tailwind CSS v4 (with OKLCH color palette)
Build Tool: Vite
State Management: React Hooks (useState, useEffect, useCallback, useContext)
Data Visualization: Recharts
Icons: Lucide React
Data Storage: Browser LocalStorage (Phase 1)
API Integration: WGER Exercise API
Deployment: Vercel or Netlify

## Project Structure

BodyBloom Project Structure

Root Directory

src folder
public folder
Configuration files
Documentation files

src Folder

components subfolder
pages subfolder
hooks subfolder
services subfolder
utils subfolder
data subfolder
context subfolder
App.jsx
main.jsx
index.css

components Subfolder

common subfolder

Button.jsx
Card.jsx
Modal.jsx
Loader.jsx
ErrorBoundary.jsx
DarkModeToggle.jsx


layout subfolder

Navbar.jsx
Layout.jsx


explore subfolder

ExerciseCard.jsx
ExerciseDetail.jsx


dashboard subfolder

StatsCard.jsx
ProgressChart.jsx
WorkoutStreak.jsx


workout subfolder

WorkoutForm.jsx
ExerciseInput.jsx
WorkoutCard.jsx


history subfolder

HistoryCard.jsx
HistoryList.jsx


motivation subfolder

MotivationCard.jsx


providers subfolder

DarkModeProvider.jsx



pages Subfolder

Home.jsx
LogWorkout.jsx
History.jsx
Explore.jsx
Motivation.jsx
Dashboard.jsx

hooks Subfolder

useLocalStorage.jsx
useWorkouts.jsx
useDarkMode.jsx

services Subfolder

api.js

utils Subfolder

helpers.js
constants.js

data Subfolder

quotes.js
songs.js

context Subfolder

DarkModeContext.jsx

public Folder

index.html
favicon.ico
logo.png

Root Configuration Files

.gitignore
package.json
package-lock.json
vite.config.js
tailwind.config.js
vercel.json
netlify.toml
.env.example

Documentation

README.md

## Installation

### Prerequisites
Node.js (v16 or higher)
npm or yarn
Git

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/bodybloom.git
cd bodybloom
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:5173

## Usage

### Logging a Workout
1. Navigate to "Log Workout"
2. Enter a name for your workout session
3. Add exercises by entering the exercise name, sets, reps, and weight
4. Add optional notes about the workout
5. Review the calculated statistics (duration and total volume)
6. Save the workout

### Viewing History
1. Go to "History" to see all logged workouts
2. Workouts are grouped by date with summary statistics
3. Use filters to view workouts from specific time periods
4. Click "View Details" on any workout to see full exercise information
5. Delete workouts using the delete button

### Exploring Exercises
1. Navigate to "Explore Exercises"
2. Use the search box to find exercises by name
3. Select a muscle group from the dropdown to filter results
4. Browse exercise cards showing basic information
5. Click on any exercise to view detailed information

### Checking Progress
1. Go to the "Dashboard" to see your fitness analytics
2. View key statistics: total workouts, this week's count, current streak, total volume
3. Toggle between "Workouts" and "Volume" charts to analyze your progress
4. See your most frequently performed exercises
5. Check recent workout summaries

### Staying Motivated
1. Visit the "Motivation" page daily
2. Click "New Quote" to get a fresh motivational quote
3. Browse the workout playlist with Spotify links
4. Read quick fitness tips at the bottom of the page

### Theme Preference
1. Click the sun/moon icon in the navigation bar to toggle dark mode
2. Your preference is automatically saved and persists across sessions
3. The app respects your system dark mode preference on first visit

## Data Management

### LocalStorage
All user data including workouts is stored in the browser's LocalStorage. This data persists between sessions and works offline. Clear your browser cache to delete all stored data.

### Exported Data Structure
Workouts are stored with the following structure:
- Workout ID (timestamp-based)
- Date created
- Workout name
- Array of exercises with sets, reps, and weight
- Optional notes
- Calculated metrics (duration, total volume)

## Development Roadmap

### Phase 1: Foundation (Completed)
Project initialization, folder structure, basic routing, and component library

### Phase 2: Core Features (Completed)
Workout logging, LocalStorage integration, API integration, history management, and motivation hub

### Phase 3: Polish (Completed)
Progress charts, animations, error handling, dark mode, and responsive refinements

### Future Enhancements
User authentication with Firebase
Cloud synchronization across devices
Workout streak tracking and personal goals
AI-powered workout recommendations
Social features and challenge mode
PWA support for mobile app installation
Export data as PDF or CSV
Workout templates and quick-start routines
Rest timer and interval training support
Body measurements tracking

## Performance Considerations

The application is optimized for performance with:
- Lazy loading of components
- Efficient re-renders through proper React Hook usage
- Debounced search to reduce API calls
- Pagination for large exercise lists
- Optimized Tailwind CSS with v4
- Smooth animations without compromising performance

## Browser Compatibility

Modern browsers with support for:
- ES6+ JavaScript
- LocalStorage API
- CSS Grid and Flexbox
- CSS transitions and animations

Tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit vercel.com and sign in with GitHub
3. Click "Add New Project" and select your repository
4. Vercel auto-detects Vite configuration
5. Click "Deploy"

Configuration is included in vercel.json for proper routing.


## Environment Variables

Currently, BodyBloom uses only public APIs (WGER) and requires no environment variables. For future Firebase integration, create a .env.local file with:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## Git Workflow

The project uses a professional Git workflow:
- main branch: Stable, production-ready code
- dev branch: Active development
- Feature branches: Individual feature development

Commit frequently with descriptive messages following conventional commits format.

## Code Quality

The project maintains code quality through:
- ESLint configuration for code standards
- React best practices and hooks patterns
- Component composition and reusability
- Proper error handling and loading states
- Accessibility considerations

## Known Limitations

- Data is stored locally in the browser (no cloud sync in Phase 1)
- Exercise data comes from WGER API which may have inconsistent muscle group tagging
- Search results depend on API response quality
- No user authentication (all data is device-specific)
- Offline functionality limited to cached data

## Support and Contributing

For questions or issues, refer to the GitHub Issues section. For future enhancements, create a feature branch and submit a pull request.

## License

This project is open source and available under the MIT License.

## Version History

Version 1.0.0 - Initial Release
Core functionality including workout logging, history, exercise exploration, progress analytics, and motivation hub. Dark mode support and responsive design for all devices.

## Credits

Exercise data sourced from WGER API (https://wger.de/)
Motivation quotes from fitness and wellness sources
Song playlist curated for workout intensity and energy
Icons from Lucide React
UI components built with React and Tailwind CSS