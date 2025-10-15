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

  // Load initial exercises and muscles
  useEffect(() => {
    loadExercises(0);
    // fetch muscles only once
    if (muscles.length === 0) {
      fetchMuscles()
        .then((data) => {
          // Sort muscles alphabetically by name
          const sorted = (data || [])
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name));
          setMuscles(sorted);
        })
        .catch((err) => {
          console.error("Failed to load muscles:", err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExercises = async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExercises(ITEMS_PER_PAGE, offset);

      // parseJson in API returns results array already if paginated
      if (offset === 0) {
        setExercises(Array.isArray(data) ? data : data.results || []);
      } else {
        setExercises((prev) => [
          ...prev,
          ...(Array.isArray(data) ? data : data.results || []),
        ]);
      }

      // If API returns { next: ... } we detect hasMore, otherwise fallback to whether results length == page size
      setHasMore(
        data.next !== undefined
          ? data.next !== null
          : Array.isArray(data)
          ? data.length === ITEMS_PER_PAGE
          : (data.results || []).length === ITEMS_PER_PAGE
      );
      setLoading(false);
    } catch (err) {
      const message =
        err.message || "Failed to load exercises. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  // Using useCallback to memoize the search function
  const handleSearch = useCallback(async () => {
    // if no query and no muscle selected, reload initial list
    if (!searchQuery.trim() && !selectedMuscle) {
      setLoading(true);
      setPage(0);
      loadExercises(0);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setPage(0); // Reset page for new search
      // call searchExercises with the proper param object
      const data = await searchExercises({
        search: searchQuery.trim() || undefined,
        muscle: selectedMuscle || undefined,
      });

      const results = Array.isArray(data) ? data : data.results || [];
      setExercises(results);

      // If the search returns paginated results, allow 'load more' accordingly
      setHasMore(
        data.next !== undefined
          ? data.next !== null
          : results.length === ITEMS_PER_PAGE
      );

      setLoading(false);
    } catch (err) {
      const message = err.message || "Search failed. Please try again.";
      setError(message);
      setLoading(false);
    }
  }, [searchQuery, selectedMuscle]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Immediately trigger search on form submit (e.g., pressing Enter)
    // This cancels any pending debounced search
    handleSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedMuscle("");
    setLoading(true);
    setPage(0);
    loadExercises(0);
  };

  const handleRetry = () => {
    setPage(0);
    loadExercises(0);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const offset = nextPage * ITEMS_PER_PAGE;
    setPage(nextPage);

    if (searchQuery.trim() || selectedMuscle) {
      // If searching, load more search results
      loadMoreSearchResults(offset);
    } else {
      loadExercises(offset);
    }
  };

  if (loading && page === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading exercises..." />
      </div>
    );
  }

  const loadMoreSearchResults = async (offset) => {
    setLoading(true);
    try {
      const data = await searchExercises({
        search: searchQuery.trim() || undefined,
        muscle: selectedMuscle || undefined,
        offset: offset,
      });
      const newExercises = Array.isArray(data) ? data : data.results || [];
      setExercises((prev) => [...prev, ...newExercises]);
      setHasMore(
        data.next !== undefined
          ? data.next !== null
          : newExercises.length === ITEMS_PER_PAGE
      );
    } catch (err) {
      const message = err.message || "Failed to load more results.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Explore Exercises
        </h1>
        <p className="text-gray-600">
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
          className="sm:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
        />
        <select
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-white"
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
              Clear
            </Button>
          )}
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">An error occurred:</p>
          <p className="text-red-700 mt-1">{error}</p>
          <Button onClick={handleRetry} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {/* Exercise Grid / Loading / Empty */}
      {exercises && exercises.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>

          {/* Load More Button */}
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
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Exercises Found
            </h3>
            <p className="text-gray-600">
              Try a different search term or clear your search.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default Explore;
