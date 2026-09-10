import type { Workout } from './workout.types'
import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ExercisePickerDialog } from './components/ExercisePickerDialog'
import { applyExerciseSelection, normalizeExerciseRouteState, renameWorkoutExercise, type ExerciseSelection } from './workout.external'
import { Button } from '../../components/ui/Button'
import { Dialog } from '../../components/ui/Dialog'
import { useWorkouts } from './useWorkouts'
import { ExerciseFormCard } from './components/ExerciseFormCard'
import { SaveWorkoutBar } from './components/SaveWorkoutBar'
import { WorkoutDetailsForm } from './components/WorkoutDetailsForm'
import { WorkoutSummary } from './components/WorkoutSummary'
import { buildWorkoutFromForm, calculateWorkoutSummary, createDefaultWorkoutForm, workoutToFormValues, createEmptyExercise, createEmptySet, isWorkoutFormDirty, validateWorkoutForm, type WorkoutFormErrors, type WorkoutFormValues } from './workout.form'

export function WorkoutFormPage({ workout }: { workout?: Workout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { addWorkout, updateWorkout } = useWorkouts()
  const isEditing = Boolean(workout)
  const [initialForm] = useState(() => workout ? workoutToFormValues(workout) : createDefaultWorkoutForm())
  const [form, setForm] = useState<WorkoutFormValues>(() => {
    const routeState: unknown = location.state
    const selection = !workout && normalizeExerciseRouteState(routeState)
    return selection ? { ...initialForm, exercises: [applyExerciseSelection(initialForm.exercises[0], selection)] } : initialForm
  })
  const [pickerTarget, setPickerTarget] = useState<string | null>(null)
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState<Set<string>>(() => new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const saving = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  const errors = useMemo(() => validateWorkoutForm(form), [form])
  const summary = useMemo(() => calculateWorkoutSummary(form), [form])
  const hasAnyInput = isWorkoutFormDirty(form, initialForm)
  const visibleErrors: WorkoutFormErrors = {
    date: submitted || touched.has('workout-date') ? errors.date : undefined,
    duration: submitted || touched.has('workout-duration') ? errors.duration : undefined,
    exercises: submitted || hasAnyInput ? errors.exercises : undefined,
    exerciseErrors: Object.fromEntries(form.exercises.map((exercise) => [exercise.id, {
      name: submitted || touched.has(`exercise-name-${exercise.id}`) ? errors.exerciseErrors?.[exercise.id]?.name : undefined,
      sets: Object.fromEntries(Object.entries(errors.exerciseErrors?.[exercise.id]?.sets ?? {}).filter(([setId]) =>
        submitted || touched.has(`exercise-${exercise.id}-set-${setId}-reps`) || touched.has(`exercise-${exercise.id}-set-${setId}-weight`))),
    }])),
  }

  const updateField = (field: 'date' | 'duration', value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setSaveError('')
  }

  const updateExerciseName = (exerciseId: string, value: string) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? renameWorkoutExercise(exercise, value) : exercise,
      ),
    }))
    setSaveError('')
  }

  const updateExerciseMuscleGroup = (exerciseId: string, value: string) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, muscleGroup: value } : exercise,
      ),
    }))
    setSaveError('')
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
    setSaveError('')
  }

  const addExercise = () => {
    setForm((current) => ({
      ...current,
      exercises: [...current.exercises, createEmptyExercise()],
    }))
    setSaveError('')
  }

  const selectExercise = (selection: ExerciseSelection) => {
    setForm((current) => ({ ...current, exercises: pickerTarget === 'new'
      ? [...current.exercises, applyExerciseSelection(createEmptyExercise(), selection)]
      : current.exercises.map((row) => row.id === pickerTarget ? applyExerciseSelection(row, selection) : row) }))
    setSaveError('')
    setPickerTarget(null)
  }

  const removeExercise = (exerciseId: string) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.filter((exercise) => exercise.id !== exerciseId),
    }))
    setSaveError('')
  }

  const addSet = (exerciseId: string) => {
    setForm((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, sets: [...exercise.sets, createEmptySet()] } : exercise,
      ),
    }))
    setSaveError('')
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
    setSaveError('')
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving.current) return
    setSubmitted(true)
    setSaveError('')
    if (Object.keys(validateWorkoutForm(form)).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    saving.current = true
    setIsSubmitting(true)
    // Allow the pending state to paint before synchronous browser persistence.
    await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)))
    try {
      const savedWorkout = buildWorkoutFromForm(form, workout)
      if (workout) {
        updateWorkout(workout.id, savedWorkout)
        await navigate('/history', { replace: true, state: { workoutUpdated: true } })
      } else {
        addWorkout(savedWorkout)
        await navigate('/', { replace: true, state: { workoutSaved: true } })
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Workout could not be saved. Please try again.')
      saving.current = false
      setIsSubmitting(false)
    }
  }

  const leaveForm = () => {
    if (isEditing) {
      navigate('/history', { replace: true })
      return
    }
    const historyState: unknown = window.history.state
    if (typeof historyState === 'object' && historyState !== null && 'idx' in historyState &&
        typeof historyState.idx === 'number' && historyState.idx > 0) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
  }

  const handleCancel = () => {
    if (!hasAnyInput) {
      leaveForm()
      return
    }

    setShowDiscardDialog(true)
  }

  const confirmDiscard = () => {
    setShowDiscardDialog(false)
    leaveForm()
  }

  const exerciseErrorMap = visibleErrors.exerciseErrors ?? {}

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Training log</p>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface md:text-4xl">{isEditing ? 'Edit Workout' : 'Log Workout'}</h2>
        <p className="max-w-2xl text-base leading-7 text-secondary">
          {isEditing ? 'Fine-tune your session details to keep your training record accurate.' : 'Capture the details of your training session and keep your momentum moving.'}
        </p>
      </header>

      {saveError ? (
        <div role="alert" className="rounded-xl border border-error/30 bg-surface-container-lowest px-4 py-3 text-sm font-medium text-error">
          {saveError}
        </div>
      ) : null}

      <form ref={formRef} noValidate onSubmit={handleSave} aria-busy={isSubmitting}
        onBlurCapture={(event) => {
          const id = event.target.id
          if (id) setTouched((current) => new Set(current).add(id))
        }}>
      <fieldset disabled={isSubmitting} className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <WorkoutDetailsForm
            date={form.date}
            duration={form.duration}
            errors={visibleErrors}
            onDateChange={(value) => updateField('date', value)}
            onDurationChange={(value) => updateField('duration', value)}
          />

          <section className="space-y-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-soft md:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-on-surface">Exercises</h2>
              <Button type="button" onClick={() => setPickerTarget('new')} className="min-h-11 px-4 py-2 text-sm">
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
                  onChooseExercise={(id) => setPickerTarget(id)}
                />
              ))}
            </div>

            {visibleErrors.exercises ? <p role="alert" className="text-sm text-error">{visibleErrors.exercises}</p> : null}
          </section>

          <SaveWorkoutBar
            isSubmitting={isSubmitting}
            submitLabel={isEditing ? 'Save Changes' : 'Save Workout'}
            onCancel={handleCancel}
          />
        </div>

        <div className="xl:pt-2">
          <WorkoutSummary summary={summary} />
        </div>
      </fieldset>
      </form>

      {pickerTarget !== null && <ExercisePickerDialog onClose={() => setPickerTarget(null)} onSelect={selectExercise}
        onManual={() => {
          if (pickerTarget === 'new') addExercise()
          const target = pickerTarget
          setPickerTarget(null)
          if (target !== 'new') requestAnimationFrame(() => document.getElementById(`exercise-name-${target}`)?.focus())
        }} />}

      <Dialog
        open={showDiscardDialog}
        title={isEditing ? 'Discard changes?' : 'Discard workout?'}
        description="You have unsaved changes. Are you sure you want to leave this page?"
        confirmText="Discard"
        cancelText="Keep editing"
        onClose={() => setShowDiscardDialog(false)}
        onConfirm={confirmDiscard}
      />
    </div>
  )
}
