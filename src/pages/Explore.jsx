import { useState, useEffect, useCallback } from "react";
import { fetchExercises, searchExercises, fetchMuscles } from "../services/api";
import ExerciseCard from "../components/explore/ExerciseCard";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";

const Explore = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [muscles, setMuscles] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState("");

  const ITEMS_PER_PAGE = 20;

  const loadExercises = useCallback(async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExercises(ITEMS_PER_PAGE, offset);

      if (offset === 0) {
        setExercises(Array.isArray(data) ? data : data.results || []);
      } else {
        setExercises((prev) => [
          ...prev,
          ...(Array.isArray(data) ? data : data.results || []),
        ]);
      }

      setHasMore(
        data.next !== undefined
          ? data.next !== null
          : Array.isArray(data)
          ? data.length === ITEMS_PER_PAGE
          : (data.results || []).length === ITEMS_PER_PAGE
      );
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load exercises. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExercises(0);
  }, [loadExercises]);

  useEffect(() => {
    fetchMuscles()
      .then((data) => {
        const sorted = (data || [])
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name));
        setMuscles(sorted);
      })
      .catch((err) => {
        console.error("Failed to load muscles:", err);
      });
  }, []);

  const filterByMuscle = useCallback(
    (exercisesToFilter) => {
      if (!selectedMuscle) return exercisesToFilter;
      return exercisesToFilter.filter((exercise) => {
        const targetMuscles = exercise.muscles || [];
        return targetMuscles.includes(parseInt(selectedMuscle));
      });
    },
    [selectedMuscle]
  );

  const getMuscleNameById = useCallback(
    (muscleId) => {
      const muscle = muscles.find((m) => m.id === parseInt(muscleId));
      return muscle ? muscle.name : "selected muscle";
    },
    [muscles]
  );

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() && !selectedMuscle) {
      setLoading(true);
      setPage(0);
      loadExercises(0);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setPage(0);

      let results = [];

      if (searchQuery.trim()) {
        const data = await searchExercises(searchQuery.trim());
        results = Array.isArray(data) ? data : data.results || [];
      } else {
        const data = await fetchExercises(ITEMS_PER_PAGE, 0);
        results = Array.isArray(data) ? data : data.results || [];
      }

      const filtered = filterByMuscle(results);

      if (filtered.length === 0 && results.length > 0) {
        setError(
          `No exercises found for "${getMuscleNameById(selectedMuscle)}"${
            searchQuery ? ` matching "${searchQuery}"` : ""
          }`
        );
      }

      setExercises(filtered);
      setHasMore(results.length === ITEMS_PER_PAGE && filtered.length > 0);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
      setLoading(false);
    }
  }, [searchQuery, selectedMuscle, filterByMuscle, getMuscleNameById, loadExercises]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedMuscle("");
    setError(null);
    setLoading(true);
    setPage(0);
    loadExercises(0);
  };

  const handleRetry = () => {
    setPage(0);
    handleSearch();
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const offset = nextPage * ITEMS_PER_PAGE;
    setPage(nextPage);
    loadExercises(offset);
  };

  if (loading && page === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading exercises..." />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Explore Exercises
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover new exercises to add to your workout routine.
        </p>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search exercises (e.g., bench press, squats)..."
          className="sm:col-span-2 px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
        />
        <select
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
        >
          <option value="">All Muscle Groups</option>
          {muscles.map((muscle) => (
            <option key={muscle.id} value={muscle.id}>
              {muscle.name}
            </option>
          ))}
        </select>

        <div className="sm:col-span-3 flex gap-3">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading && page === 0 ? "Searching..." : "Search"}
          </Button>
          {(searchQuery || selectedMuscle) && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleClearSearch}
            >
              Clear All
            </Button>
          )}
        </div>
      </form>

      {(searchQuery || selectedMuscle) && (
        <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-500/30 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Active filters:</strong>
            {searchQuery && ` Search: "${searchQuery}"`}
            {searchQuery && selectedMuscle && " •"}
            {selectedMuscle && ` Muscle: ${getMuscleNameById(selectedMuscle)}`}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg">
          <p className="text-red-800 dark:text-red-200 font-semibold">
            {error}
          </p>
          <Button onClick={handleRetry} className="mt-3 text-sm">
            Try Again
          </Button>
        </div>
      )}

      {exercises && exercises.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Found <strong>{exercises.length}</strong> exercise
            {exercises.length !== 1 ? "s" : ""}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                onClick={handleLoadMore}
                variant="secondary"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More Exercises"}
              </Button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Exercises Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try a different search term or adjust your muscle group filter.
            </p>
            <Button onClick={handleClearSearch} variant="outline">
              Reset Search
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default Explore;