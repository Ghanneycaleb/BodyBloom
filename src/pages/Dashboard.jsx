import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useWorkouts from '../hooks/useWorkouts';
import StatsCard from '../components/dashboard/StatsCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { getWorkoutStreak, daysBetween } from '../utils/helpers';

const Dashboard = () => {
  const { workouts, getTotalWorkouts, getThisWeekWorkouts } = useWorkouts();

  // Calculate stats
  const stats = useMemo(() => {
    const totalWorkouts = getTotalWorkouts();
    const thisWeek = getThisWeekWorkouts();
    const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
    const totalExercises = workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);
    const streak = getWorkoutStreak(workouts);
    
    // Calculate average workout duration
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

    return {
      totalWorkouts,
      thisWeek,
      totalVolume,
      totalExercises,
      streak,
      avgDuration,
    };
  }, [workouts, getTotalWorkouts, getThisWeekWorkouts]);

  // Get recent workouts
  const recentWorkouts = useMemo(() => {
    return [...workouts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [workouts]);

  // Get most performed exercises
  const topExercises = useMemo(() => {
    const exerciseCounts = {};
    
    workouts.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        const name = exercise.name;
        exerciseCounts[name] = (exerciseCounts[name] || 0) + 1;
      });
    });

    return Object.entries(exerciseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [workouts]);

  if (workouts.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Progress Dashboard</h1>
        <Card className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Yet</h3>
          <p className="text-gray-600 mb-6">Start logging workouts to see your progress and analytics!</p>
          <Link to="/log">
            <Button variant="primary">Log Your First Workout</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Dashboard</h1>
        <p className="text-gray-600">Track your fitness journey and celebrate your achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          subtitle="All time"
          icon="💪"
          color="primary"
        />
        <StatsCard
          title="This Week"
          value={stats.thisWeek}
          subtitle={`${stats.thisWeek} ${stats.thisWeek === 1 ? 'workout' : 'workouts'}`}
          icon="🔥"
          color="blue"
        />
        <StatsCard
          title="Current Streak"
          value={`${stats.streak} ${stats.streak === 1 ? 'day' : 'days'}`}
          subtitle="Keep it up!"
          icon="⚡"
          color="purple"
        />
        <StatsCard
          title="Total Volume"
          value={`${stats.totalVolume.toFixed(0)} kg`}
          subtitle="Weight lifted"
          icon="🏋️"
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Exercises</p>
            <p className="text-3xl font-bold text-primary-600">{stats.totalExercises}</p>
            <p className="text-xs text-gray-500 mt-1">Logged exercises</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Avg. Duration</p>
            <p className="text-3xl font-bold text-primary-600">{stats.avgDuration} min</p>
            <p className="text-xs text-gray-500 mt-1">Per workout</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Last Workout</p>
            <p className="text-3xl font-bold text-primary-600">
              {workouts.length > 0 ? daysBetween(new Date(workouts[0].date), new Date()) : 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Days ago</p>
          </div>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Workouts</h2>
            <Link to="/history">
              <Button variant="outline" className="text-sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <h4 className="font-medium text-gray-900">{workout.name}</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span>{workout.exercises?.length} exercises</span>
                  <span>•</span>
                  <span>{workout.duration} min</span>
                  <span>•</span>
                  <span>{new Date(workout.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Exercises */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Most Performed Exercises</h2>
          {topExercises.length > 0 ? (
            <div className="space-y-3">
              {topExercises.map((exercise, index) => (
                <div
                  key={exercise.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{exercise.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {exercise.count} {exercise.count === 1 ? 'time' : 'times'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No exercise data yet</p>
          )}
        </Card>
      </div>

      {/* Motivational CTA */}
      <Card className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 border-none text-white">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Keep Up the Great Work! 🎉</h2>
          <p className="text-primary-100 mb-6">
            You've logged {stats.totalWorkouts} {stats.totalWorkouts === 1 ? 'workout' : 'workouts'} and 
            you're on a {stats.streak}-day streak. Stay consistent!
          </p>
          <Link to="/log">
            <Button variant="secondary" className="bg-white text-primary-700 hover:bg-gray-50">
              Log Another Workout
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;