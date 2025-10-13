import { useState } from 'react';
import useWorkouts from '../hooks/useWorkouts';
import HistoryList from '../components/history/HistoryList';
import Button from '../components/common/Button';

const History = () => {
  const { workouts, deleteWorkout, getWorkoutsByDate, clearAllWorkouts } = useWorkouts();
  const [filter, setFilter] = useState('all'); // all, week, month

  const workoutsByDate = getWorkoutsByDate();

  const getFilteredWorkouts = () => {
    if (filter === 'all') return workoutsByDate;

    const now = new Date();
    const filtered = {};

    Object.keys(workoutsByDate).forEach((date) => {
      const workoutsOnDate = workoutsByDate[date].filter((workout) => {
        const workoutDate = new Date(workout.date);
        const diffTime = Math.abs(now - workoutDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (filter === 'week') return diffDays <= 7;
        if (filter === 'month') return diffDays <= 30;
        return true;
      });

      if (workoutsOnDate.length > 0) {
        filtered[date] = workoutsOnDate;
      }
    });

    return filtered;
  };

  const filteredWorkouts = getFilteredWorkouts();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout History</h1>
        <p className="text-gray-600">Review your past workouts and track your consistency</p>
      </div>

      {/* Stats Bar */}
      {workouts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
            <p className="text-primary-100 text-sm mb-1">Total Workouts</p>
            <p className="text-4xl font-bold">{workouts.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <p className="text-blue-100 text-sm mb-1">This Week</p>
            <p className="text-4xl font-bold">
              {workouts.filter((w) => {
                const diffTime = Math.abs(new Date() - new Date(w.date));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              }).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <p className="text-purple-100 text-sm mb-1">Total Volume</p>
            <p className="text-4xl font-bold">
              {workouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0).toFixed(0)} kg
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      {workouts.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'week'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              This Month
            </button>
          </div>

          <Button variant="danger" onClick={clearAllWorkouts} className="text-sm">
            Clear All History
          </Button>
        </div>
      )}

      {/* Workout List */}
      <HistoryList workoutsByDate={filteredWorkouts} onDelete={deleteWorkout} />
    </div>
  );
};

export default History;