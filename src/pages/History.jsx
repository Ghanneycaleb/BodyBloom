import { useState, useMemo } from "react";
import useWorkouts from "../hooks/useWorkouts";
import HistoryList from "../components/history/HistoryList";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";

const History = () => {
  const { workouts, deleteWorkout, workoutsByDate, clearAllWorkouts } =
    useWorkouts();
  const [filter, setFilter] = useState("all"); // all, week, month
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredWorkouts = useMemo(() => {
    if (!workoutsByDate) return {};
    if (filter === "all") return workoutsByDate;

    const now = new Date();
    const filtered = {};

    Object.keys(workoutsByDate).forEach((date) => {
      const workoutsOnDate = workoutsByDate[date].filter((w) => {
        const workoutDate = new Date(w.date);
        const diffTime = Math.abs(now - workoutDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (filter === "week") return diffDays <= 7;
        if (filter === "month") return diffDays <= 30;
        return true;
      });

      if (workoutsOnDate.length > 0) filtered[date] = workoutsOnDate;
    });

    return filtered;
  }, [workoutsByDate, filter]);

  const workoutsThisWeek = useMemo(() => {
    return workouts.filter((w) => {
      const diffTime = Math.abs(new Date() - new Date(w.date));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;
  }, [workouts]);

  const handleClearAll = () => {
    clearAllWorkouts();
    setShowClearConfirm(false);
  };

  const filterOptions = [
    { key: "all", label: "All Time" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
  ];

  return (
    <div>
        {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Workout History
          </h1>
        <p className="text-gray-600">
            Review your past workouts and track your consistency.
          </p>
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
              <p className="text-4xl font-bold">{workoutsThisWeek}</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
              <p className="text-cyan-100 text-sm mb-1">Total Volume</p>
              <p className="text-4xl font-bold">
                {workouts
                  .reduce((sum, w) => sum + (w.totalVolume || 0), 0)
                  .toFixed(0)}{" "}
                kg
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        {workouts.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === option.key
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Button
              variant="danger"
              onClick={() => setShowClearConfirm(true)}
              className="text-sm"
            >
              Clear All History
            </Button>
          </div>
        )}

        {/* Workout List */}
        <HistoryList
          workoutsByDate={filteredWorkouts}
          onDelete={deleteWorkout}
        />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear All Workout History?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete all of your workout history? This
            action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowClearConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default History;
