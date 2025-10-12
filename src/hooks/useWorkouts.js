import useLocalStorage from './useLocalStorage';

const useWorkouts = () => {
  const [workouts, setWorkouts] = useLocalStorage('workouts', []);

  const addWorkout = (workout) => {
    setWorkouts((prevWorkouts) => [
      ...prevWorkouts,
      { ...workout, id: Date.now().toString(), date: new Date().toISOString() },
    ]);
  };

  return { workouts, addWorkout };
};

export default useWorkouts;