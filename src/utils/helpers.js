/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'long') => {
  const d = new Date(date);
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    case 'long':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    case 'datetime':
      return `${formatDate(d, 'short')} at ${formatDate(d, 'time')}`;
    default:
      return d.toLocaleDateString();
  }
};

/**
 * Calculate days between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Days difference
 */
export const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  return Math.round(diffTime / oneDay);
};

/**
 * Calculate total workout volume
 * @param {Array} exercises - Array of exercises with sets, reps, weight
 * @returns {number} Total volume in kg
 */
export const calculateVolume = (exercises) => {
  return exercises.reduce((total, exercise) => {
    const volume = (exercise.sets || 0) * (exercise.reps || 0) * (exercise.weight || 0);
    return total + volume;
  }, 0);
};

/**
 * Calculate estimated workout duration
 * @param {Array} exercises - Array of exercises with sets
 * @returns {number} Duration in minutes
 */
export const calculateDuration = (exercises) => {
  const totalSets = exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
  // Estimate: 2 minutes per set (includes rest time)
  return totalSets * 2;
};

/**
 * Get workout streak (consecutive days)
 * @param {Array} workouts - Array of workout objects with date
 * @returns {number} Current streak
 */
export const getWorkoutStreak = (workouts) => {
  if (workouts.length === 0) return 0;

  // Sort workouts by date (most recent first)
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let workout of sortedWorkouts) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);

    const daysDiff = daysBetween(workoutDate, currentDate);

    if (daysDiff === 0 || daysDiff === 1) {
      streak++;
      currentDate = workoutDate;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Group array items by a key
 * @param {Array} array - Array to group
 * @param {Function} keyFn - Function to extract key
 * @returns {Object} Grouped object
 */
export const groupBy = (array, keyFn) => {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {});
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate workout form data
 * @param {Object} workout - Workout data to validate
 * @returns {Object} { isValid, errors }
 */
export const validateWorkout = (workout) => {
  const errors = [];

  if (!workout.name || workout.name.trim() === '') {
    errors.push('Workout name is required');
  }

  if (!workout.exercises || workout.exercises.length === 0) {
    errors.push('At least one exercise is required');
  }

  workout.exercises?.forEach((exercise, index) => {
    if (!exercise.name || exercise.name.trim() === '') {
      errors.push(`Exercise ${index + 1}: Name is required`);
    }
    if (!exercise.sets || exercise.sets < 1) {
      errors.push(`Exercise ${index + 1}: Sets must be at least 1`);
    }
    if (!exercise.reps || exercise.reps < 1) {
      errors.push(`Exercise ${index + 1}: Reps must be at least 1`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get percentage change between two numbers
 * @param {number} oldValue - Old value
 * @param {number} newValue - New value
 * @returns {number} Percentage change
 */
export const getPercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Strip HTML tags from string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};