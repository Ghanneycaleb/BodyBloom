import { useState, useEffect, useRef } from "react";
import Card from "../common/Card";
import Modal from "../common/Modal";
import { fetchExerciseInfo } from "../../services/api";
import Loader from "../common/Loader";

const ExerciseCard = ({ exercise }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const abortRef = useRef(null);

  // Reset details state if the exercise prop changes
  useEffect(() => {
    // cancel any in-progress fetch for previous exercise
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setDetails(null);
    setDetailsLoading(false);
    setDetailsError(null);
  }, [exercise.id]);

  // Strip HTML tags from description
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleViewDetails = async () => {
    setShowDetails(true);
    setDetailsError(null);

    // If details already loaded and same exercise, just show modal
    if (details) return;

    setDetailsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const info = await fetchExerciseInfo(exercise.id, controller.signal);
      // ensure we still want to show the modal (component not unmounted)
      setDetails(info || null);
    } catch (error) {
      if (error.name === "AbortError") {
        // fetch was aborted — don't set error
        return;
      }
      console.error("Failed to load exercise details", error);
      setDetailsError("Failed to load details. Please try again.");
    } finally {
      setDetailsLoading(false);
      abortRef.current = null;
    }
  };

  // close handler: abort any in-progress fetch when closing modal
  const handleClose = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setShowDetails(false);
  };

  // Prefer detailed description if available
  const detailedDescription = details?.description ? stripHtml(details.description) : null;
  const fallbackDescription = exercise.description ? stripHtml(exercise.description) : "No description available.";
  const description = detailedDescription || fallbackDescription;

  const shortDescription =
    description.length > 120 ? description.substring(0, 120) + "..." : description;

  return (
    <>
      <Card className="h-full flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{exercise.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{shortDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {exercise.category && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
              Category {exercise.category}
            </span>
          )}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
              Equipment
            </span>
          )}
        </div>

        <button
          onClick={handleViewDetails}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 self-start"
        >
          View Details
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Card>

      {/* Details Modal */}
      <Modal isOpen={showDetails} onClose={handleClose} title={exercise.name} size="lg">
        {detailsLoading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <Loader text="Loading details..." />
          </div>
        ) : detailsError ? (
          <div className="min-h-[120px] flex items-center justify-center">
            <p className="text-red-600">{detailsError}</p>
          </div>
        ) : details ? (
          <div className="space-y-4">
            {/* Images */}
            {details.images && details.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {details.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt={exercise.name || "Exercise image"}
                    className="w-full h-auto rounded-lg object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-2">
              {details.category?.name && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-lg">
                  {details.category.name}
                </span>
              )}
              {details.equipment && details.equipment.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                  {details.equipment.map((e) => e.name).join(", ")}
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Muscles */}
            {details.muscles && details.muscles.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Target Muscles</h4>
                <div className="flex flex-wrap gap-2">
                  {details.muscles.map((muscle) => (
                    <span key={muscle.id} className="px-2 py-1 bg-purple-200 text-purple-800 text-sm rounded">
                      {muscle.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // No details but not loading: show fallback description
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ExerciseCard;
