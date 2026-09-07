import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Dialog } from '../../components/ui/Dialog'
import { useWorkouts } from './useWorkouts'
import { ExerciseFormCard } from './components/ExerciseFormCard'
import { SaveWorkoutBar } from './components/SaveWorkoutBar'
import { WorkoutDetailsForm } from './components/WorkoutDetailsForm'
import { WorkoutSummary } from './components/WorkoutSummary'
import { buildWorkoutFromForm, calculateWorkoutSummary, createDefaultWorkoutForm, validateWorkoutForm, type WorkoutFormValues } from './workout.form'

export function LogWorkoutPage() {
  const navigate = useNavigate()
  const { addWorkout } = useWorkouts()
  const [form, setForm] = useState<WorkoutFormValues>(() => createDefaultWorkoutForm())
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const errors = useMemo(() => validateWorkoutForm(form), [form])
  const summary = useMemo(() => calculateWorkoutSummary(form), [form])
  const hasAnyInput = form.date !== '' || form.duration !== '45' || form.exercises.some((exercise) =>
    exercise.exerciseName.trim() !== '' || exercise.muscleGroup.trim() !== '' || exercise.sets.some((set) => set.reps !== '10' || set.weight !== '0'))

  const isFormValid = Object.keys(errors).length === 0

  const updateField = (field: 'date' | 'duration', value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setSuccessMessage('')
  }

  const updateExerciseName = (exerciseId: string, value: string) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, exerciseName: value } : exercise,
      ),
    }))
    setSuccessMessage('')
  }

  const updateExerciseMuscleGroup = (exerciseId: string, value: string) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, muscleGroup: value } : exercise,
      ),
    }))
    setSuccessMessage('')
  }

  const updateSetValue = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: string) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) => (set.id === setId ? { ...set, [field]: value } : set)),
        }
      }),
    }))
    setSuccessMessage('')
  }

  const addExercise = () => {
    setForm((current) => ({
      ...current,
      exercises: [...current.exercises, { id: crypto.randomUUID(), exerciseName: '', muscleGroup: '', sets: [{ id: crypto.randomUUID(), reps: '10', weight: '0' }] }],
    }))
    setSuccessMessage('')
  }

  const removeExercise = (exerciseId: string) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.filter((exercise) => exercise.id !== exerciseId),
    }))
    setSuccessMessage('')
  }

  const addSet = (exerciseId: string) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, sets: [...exercise.sets, { id: crypto.randomUUID(), reps: '10', weight: '0' }] } : exercise,
      ),
    }))
    setSuccessMessage('')
  }

  const removeSet = (exerciseId: string, setId: string) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise
        }

        return { ...exercise, sets: exercise.sets.length > 1 ? exercise.sets.filter((set) => set.id !== setId) : exercise.sets }
      }),
    }))
    setSuccessMessage('')
  }

  const handleSave = () => {
    const validationErrors = validateWorkoutForm(form)

    if (Object.keys(validationErrors).length > 0) {
      setSuccessMessage('')
      return
    }

    const workout = buildWorkoutFromForm(form)
    addWorkout(workout)
    setSuccessMessage('Workout saved successfully.')
    navigate('/')
  }

  const handleCancel = () => {
    if (!hasAnyInput) {
      navigate(-1)
      return
    }

    setShowDiscardDialog(true)
  }

  const confirmDiscard = () => {
    setShowDiscardDialog(false)
    navigate(-1)
  }

  const exerciseErrorMap = errors.exerciseErrors ?? {}

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Training log</p>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Log Workout</h1>
        <p className="max-w-2xl text-base leading-7 text-secondary">
          Capture the details of your training session and keep your momentum moving.
        </p>
      </header>

      {successMessage ? (
        <div className="rounded-xl border border-primary/20 bg-primary/8 px-4 py-3 text-sm font-medium text-primary">
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-5">
          <WorkoutDetailsForm
            date={form.date}
            duration={form.duration}
            errors={errors}
            onDateChange={(value) => updateField('date', value)}
            onDurationChange={(value) => updateField('duration', value)}
          />

          <section className="space-y-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-soft md:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-on-surface">Exercises</h2>
              <Button type="button" onClick={addExercise} className="min-h-11 px-4 py-2 text-sm">
                + Add Exercise
              </Button>
            </div>

            <div className="space-y-4">
              {form.exercises.map((exercise) => (
                <ExerciseFormCard
                  key={exercise.id}
                  exercise={exercise}
                  exerciseErrors={exerciseErrorMap[exercise.id]}
                  onExerciseNameChange={updateExerciseName}
                  onMuscleGroupChange={updateExerciseMuscleGroup}
                  onSetChange={updateSetValue}
                  onAddSet={addSet}
                  onRemoveSet={removeSet}
                  onRemoveExercise={removeExercise}
                />
              ))}
            </div>

            {errors.exercises ? <p className="text-sm text-error">{errors.exercises}</p> : null}
          </section>

          <SaveWorkoutBar
            isValid={isFormValid}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </div>

        <div className="xl:pt-2">
          <WorkoutSummary summary={summary} />
        </div>
      </div>

      <Dialog
        open={showDiscardDialog}
        title="Discard workout?"
        description="You have unsaved changes. Are you sure you want to leave this page?"
        confirmText="Discard"
        cancelText="Keep editing"
        onClose={() => setShowDiscardDialog(false)}
        onConfirm={confirmDiscard}
      />
    </div>
  )
}
