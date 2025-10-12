import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutForm from '../components/workout/WorkoutForm';
import useWorkouts from '../hooks/useWorkouts';

const LogWorkout = () => {
  const navigate = useNavigate();
  const { addWorkout } = useWorkouts();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveWorkout = (workout) => {
    addWorkout(workout);
    setShowSuccess(true);
    
    // Show success message then navigate
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Log Workout</h1>
        <p className="text-gray-600">Record your exercises, sets, reps, and weights</p>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-primary-800 font-medium">
            ✅ Workout saved successfully! Redirecting to history...
          </p>
        </div>
      )}

      <WorkoutForm onSave={handleSaveWorkout} />
    </div>
  );
};

export default LogWorkout;