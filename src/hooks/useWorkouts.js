import useLocalStorage from "./useLocalStorage";

const useWorkouts = () => {
  const [workouts, setWorkouts] = useLocalStorage("workouts", []);

  const addWorkout = (workout) => {
    setWorkouts((prevWorkouts) => [
      ...prevWorkouts,
      { ...workout, id: Date.now().toString(), date: new Date().toISOString() },
    ]);
  };

  const deleteWorkout = (workoutId) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.filter((w) => w.id !== workoutId)
    );
  };

  const clearAllWorkouts = () => {
    setWorkouts([]);
  };

  const workoutsByDate = workouts.reduce((acc, workout) => {
    const date = new Date(workout.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {});

  return {
    workouts,
    addWorkout,
    deleteWorkout,
    clearAllWorkouts,
    workoutsByDate,
  };
};

export default useWorkouts;
