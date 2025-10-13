const WGER_BASE_URL = 'https://wger.de/api/v2';

/**
 * Fetch exercises from WGER API
 * @param {number} limit - Number of exercises to fetch
 * @param {number} offset - Pagination offset
 * @returns {Promise} Exercise data
 */
export const fetchExercises = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(
      `${WGER_BASE_URL}/exercise/?language=2&limit=${limit}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

/**
 * Fetch exercise categories
 * @returns {Promise} Category data
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${WGER_BASE_URL}/exercisecategory/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch exercises by category
 * @param {number} categoryId - Category ID
 * @returns {Promise} Exercise data
 */
export const fetchExercisesByCategory = async (categoryId) => {
  try {
    const response = await fetch(
      `${WGER_BASE_URL}/exercise/?language=2&category=${categoryId}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises by category');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercises by category:', error);
    throw error;
  }
};

/**
 * Fetch equipment types
 * @returns {Promise} Equipment data
 */
export const fetchEquipment = async () => {
  try {
    const response = await fetch(`${WGER_BASE_URL}/equipment/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

/**
 * Search exercises by name
 * @param {string} query - Search query
 * @returns {Promise} Exercise data
 */
export const searchExercises = async (query) => {
  try {
    const response = await fetch(
      `${WGER_BASE_URL}/exercise/?language=2&name=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search exercises');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching exercises:', error);
    throw error;
  }
};