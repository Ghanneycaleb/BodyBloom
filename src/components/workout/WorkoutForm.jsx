import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ExerciseInput from './ExerciseInput';

const WorkoutForm = ({ onSave }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [notes, setNotes] = useState('');

  const handleAddExercise = (exercise) => {
    setExercises([...exercises, { ...exercise, id: Date.now().toString() }]);
  };

  const handleRemoveExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSaveWorkout = () => {
    if (!workoutName.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const workout = {
      name: workoutName,
      exercises,
      notes,
      duration: calculateDuration(),
      totalVolume: calculateTotalVolume(),
    };

    onSave(workout);

    // Reset form
    setWorkoutName('');
    setExercises([]);
    setNotes('');
  };

  const calculateDuration = () => {
    // Estimate: 2 minutes per set
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
    return totalSets * 2;
  };

  const calculateTotalVolume = () => {
    // Total volume = sum of (sets × reps × weight)
    return exercises.reduce((sum, ex) => {
      return sum + (ex.sets * ex.reps * (ex.weight || 0));
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Workout Name */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Name *
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Upper Body Strength"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you feel? Any achievements?"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
            />
          </div>
        </div>
      </Card>

      {/* Add Exercise */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Exercise</h3>
        <ExerciseInput onAdd={handleAddExercise} />
      </Card>

      {/* Exercise List */}
      {exercises.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Exercises ({exercises.length})
          </h3>
          <div className="space-y-3">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{ex.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {ex.sets} sets × {ex.reps} reps
                    {ex.weight > 0 && ` @ ${ex.weight} kg`}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveExercise(ex.id)}
                  className="ml-4 text-red-600 hover:text-red-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Workout Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Exercises</p>
                <p className="text-2xl font-bold text-primary-600">{exercises.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Est. Duration</p>
                <p className="text-2xl font-bold text-primary-600">{calculateDuration()} min</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-primary-600">{calculateTotalVolume()} kg</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Save Button */}
      {exercises.length > 0 && (
        <Button 
          onClick={handleSaveWorkout} 
          variant="primary" 
          className="w-full"
        >
          Save Workout
        </Button>
      )}
    </div>
  );
};

export default WorkoutForm;