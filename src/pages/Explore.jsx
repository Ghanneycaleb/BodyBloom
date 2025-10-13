import { useState, useEffect } from "react";
import { fetchExercises, searchExercises } from "../services/api";
import ExerciseCard from "../components/explore/ExerciseCard";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";

const Explore = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 20;

  // Load initial exercises
  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async (offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExercises(ITEMS_PER_PAGE, offset);

      if (offset === 0) {
        setExercises(data.results);
      } else {
        setExercises((prev) => [...prev, ...data.results]);
      }

      setHasMore(data.next !== null);
      setLoading(false);
    } catch {
      setError("Failed to load exercises. Please try again.");
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      loadExercises();
      return;
    }

    try {
      setSearching(true);
      setError(null);
      const data = await searchExercises(searchQuery);
      setExercises(data.results);
      setHasMore(false); // Disable load more for search results
      setSearching(false);
    } catch {
      setError("Search failed. Please try again.");
      setSearching(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadExercises(nextPage * ITEMS_PER_PAGE);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(0);
    loadExercises(0);
  };

  if (loading && exercises.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading exercises..." />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Explore Exercises
        </h1>
        <p className="text-gray-600">
          Discover new exercises to add to your workout routine
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises (e.g., bench press, squats)..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
          />
          <Button type="submit" variant="primary" disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </Button>
          {searchQuery && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleClearSearch}
            >
              Clear
            </Button>
          )}
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Exercise Grid */}
      {exercises.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && !searchQuery && (
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
      )}
    </div>
  );
};

export default Explore;
