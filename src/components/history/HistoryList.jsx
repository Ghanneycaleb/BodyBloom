import HistoryCard from './HistoryCard';

const HistoryList = ({ workoutsByDate, onDelete }) => {
  const dates = Object.keys(workoutsByDate).sort((a, b) => {
    return new Date(b) - new Date(a); // Most recent first
  });

  if (dates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Workouts Yet</h3>
        <p className="text-gray-600 mb-6">Log your workouts to see them here!</p>
        <a
          href="/log"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Your First Workout
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {dates.map((date) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900">{date}</h2>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
              {workoutsByDate[date].length} {workoutsByDate[date].length === 1 ? 'workout' : 'workouts'}
            </span>
          </div>
          <div className="space-y-4">
            {workoutsByDate[date].map((workout) => (
              <HistoryCard key={workout.id} workout={workout} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;