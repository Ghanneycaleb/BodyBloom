import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutForm from "../components/workout/WorkoutForm";
import useWorkouts from "../hooks/useWorkouts";
import Button from "../components/common/Button";

const LogWorkout = () => {
  const navigate = useNavigate();
  const { addWorkout } = useWorkouts();
  const [showSuccess, setShowSuccess] = useState(false);
  const timeoutRef = useRef(null);

  const handleSaveWorkout = (workout) => {
    addWorkout(workout);
    setShowSuccess(true);

    // Show success message then navigate
    timeoutRef.current = setTimeout(() => {
      navigate("/history");
    }, 1500);
  };

  const handleLogAnother = () => {
    setShowSuccess(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Log Workout
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Record your exercises, sets, reps, and weights.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-300">
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg text-center animate-fade-in">
              <div className="text-green-800 font-medium flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Workout saved successfully! Redirecting to history...
              </div>
              <Button variant="secondary" onClick={handleLogAnother}>
                Log Another Workout
              </Button>
            </div>
          )}

          {!showSuccess && <WorkoutForm onSave={handleSaveWorkout} />}
        </div>
      </div>
    </div>
  );
};

export default LogWorkout;
