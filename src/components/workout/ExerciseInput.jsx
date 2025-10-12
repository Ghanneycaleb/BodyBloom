import { useState } from 'react';
import Button from '../common/Button';

const ExerciseInput = ({ onAdd }) => {
  const [exercise, setExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!exercise.name.trim()) {
      alert('Please enter exercise name');
      return;
    }
    
    if (!exercise.sets || !exercise.reps) {
      alert('Please enter sets and reps');
      return;
    }

    // Add exercise
    onAdd({
      ...exercise,
      sets: parseInt(exercise.sets),
      reps: parseInt(exercise.reps),
      weight: exercise.weight ? parseFloat(exercise.weight) : 0,
    });

    // Reset form
    setExercise({ name: '', sets: '', reps: '', weight: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exercise Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exercise Name *
          </label>
          <input
            type="text"
            value={exercise.name}
            onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
            placeholder="e.g., Bench Press"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
          />
        </div>

        {/* Sets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sets *
          </label>
          <input
            type="number"
            min="1"
            value={exercise.sets}
            onChange={(e) => setExercise({ ...exercise, sets: e.target.value })}
            placeholder="e.g., 3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
          />
        </div>

        {/* Reps */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reps *
          </label>
          <input
            type="number"
            min="1"
            value={exercise.reps}
            onChange={(e) => setExercise({ ...exercise, reps: e.target.value })}
            placeholder="e.g., 10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
          />
        </div>

        {/* Weight */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg) - Optional
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={exercise.weight}
            onChange={(e) => setExercise({ ...exercise, weight: e.target.value })}
            placeholder="e.g., 60"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
          />
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Add Exercise
      </Button>
    </form>
  );
};

export default ExerciseInput;