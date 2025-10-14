const WGER_BASE_URL = "https://wger.de/api/v2";

/**
 * Helper that normalizes JSON responses (paginated or not)
 */
const parseJson = async (response) => {
  const data = await response.json();
  // Many WGER endpoints return { results: [...] }
  return data.results || data;
};

/**
 * Fetch exercises from WGER API
 * @param {number} limit - Number of exercises to fetch
 * @param {number} offset - Pagination offset
 * @returns {Promise} Exercise data (normalized)
 */
export const fetchExercises = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(
      `${WGER_BASE_URL}/exercise/?language=2&limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      if (response.status === 429) throw new Error("Too many requests. Try again later.");
      throw new Error("Failed to fetch exercises");
    }

    return await parseJson(response);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

/**
 * Fetch exercise categories
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${WGER_BASE_URL}/exercisecategory/`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return await parseJson(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Fetch exercises by category
 */
export const fetchExercisesByCategory = async (categoryId) => {
  try {
    const response = await fetch(
      `${WGER_BASE_URL}/exercise/?language=2&category=${categoryId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exercises by category");
    }

    return await parseJson(response);
  } catch (error) {
    console.error("Error fetching exercises by category:", error);
    throw error;
  }
};

/**
 * Fetch equipment types
 */
export const fetchEquipment = async () => {
  try {
    const response = await fetch(`${WGER_BASE_URL}/equipment/`);

    if (!response.ok) {
      throw new Error("Failed to fetch equipment");
    }

    return await parseJson(response);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
};

/**
 * Search exercises by name and muscle
 * Accepts params object: { query, muscle }
 * Uses name__icontains for partial matching
 */
export const searchExercises = async ({ query, muscle } = {}) => {
  try {
    const url = new URL(`${WGER_BASE_URL}/exercise/`);
    url.searchParams.append("language", "2");

    if (query) {
      // WGER partial-match param
      url.searchParams.append("name__icontains", query);
    }
    if (muscle) {
      url.searchParams.append("muscles", muscle);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      if (response.status === 429) throw new Error("Too many requests. Try again later.");
      throw new Error("Failed to search exercises");
    }

    return await parseJson(response);
  } catch (error) {
    console.error("Error searching exercises:", error);
    throw error;
  }
};

/**
 * Fetch detailed information for a single exercise
 */
export const fetchExerciseInfo = async (exerciseId, signal) => {
  try {
    const response = await fetch(
      `${WGER_BASE_URL}/exerciseinfo/${exerciseId}/`,
      { signal }
    );

    if (!response.ok) {
      if (response.status === 429) throw new Error("Too many requests. Try again later.");
      throw new Error("Failed to fetch exercise info");
    }

    return await response.json(); // exerciseinfo returns a single object, not paginated
  } catch (error) {
    // If fetch was aborted, let the caller handle it (no console.error)
    if (error.name === "AbortError") throw error;
    console.error("Error fetching exercise info:", error);
    throw error;
  }
};

/**
 * Fetch all muscle groups
 */
export const fetchMuscles = async () => {
  try {
    const response = await fetch(`${WGER_BASE_URL}/muscle/`);

    if (!response.ok) {
      throw new Error("Failed to fetch muscles");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching muscles:", error);
    throw error;
  }
};
