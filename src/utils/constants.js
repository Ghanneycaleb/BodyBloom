// LocalStorage Keys
export const STORAGE_KEYS = {
  WORKOUTS: 'bodybloom_workouts',
  USER_PREFERENCES: 'bodybloom_preferences',
  THEME: 'bodybloom_theme',
};

// Exercise Categories (WGER API)
export const EXERCISE_CATEGORIES = {
  ABS: 10,
  ARMS: 8,
  BACK: 12,
  CALVES: 14,
  CHEST: 11,
  LEGS: 9,
  SHOULDERS: 13,
};

// Workout Intensity Levels
export const INTENSITY_LEVELS = {
  LIGHT: 'light',
  MODERATE: 'moderate',
  INTENSE: 'intense',
  EXTREME: 'extreme',
};

// Workout Goals
export const WORKOUT_GOALS = {
  STRENGTH: 'strength',
  HYPERTROPHY: 'hypertrophy',
  ENDURANCE: 'endurance',
  WEIGHT_LOSS: 'weight_loss',
  GENERAL_FITNESS: 'general_fitness',
};

// Common Exercise Equipment
export const EQUIPMENT_TYPES = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Resistance Bands',
  'Cable Machine',
  'Bodyweight',
  'Medicine Ball',
  'TRX',
  'Pull-up Bar',
  'Bench',
];

// Muscle Groups
export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Forearms',
  'Abs',
  'Obliques',
  'Quadriceps',
  'Hamstrings',
  'Glutes',
  'Calves',
];

// Time Periods for Filtering
export const TIME_PERIODS = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL: 'all',
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#16a34a',
  SECONDARY: '#3b82f6',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
};

// API Configuration
export const API_CONFIG = {
  WGER_BASE_URL: 'https://wger.de/api/v2',
  DEFAULT_LANGUAGE: 2, // English
  ITEMS_PER_PAGE: 20,
};

// App Metadata
export const APP_INFO = {
  NAME: 'BodyBloom',
  TAGLINE: 'Track your progress. Feel your growth.',
  VERSION: '1.0.0',
  DESCRIPTION: 'A fitness tracking web app that motivates and empowers users.',
};

// Navigation Links
export const NAV_LINKS = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/log', label: 'Log Workout', icon: 'plus' },
  { path: '/history', label: 'History', icon: 'clock' },
  { path: '/explore', label: 'Explore', icon: 'search' },
  { path: '/motivation', label: 'Motivation', icon: 'heart' },
  { path: '/dashboard', label: 'Dashboard', icon: 'chart' },
];

// Success Messages
export const SUCCESS_MESSAGES = {
  WORKOUT_SAVED: 'Workout saved successfully!',
  WORKOUT_DELETED: 'Workout deleted successfully!',
  DATA_CLEARED: 'All data has been cleared!',
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  API_FAILED: 'Failed to fetch data from the server.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  NO_DATA: 'No data available.',
};