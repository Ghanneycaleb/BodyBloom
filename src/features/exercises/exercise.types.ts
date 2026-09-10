export type ExerciseOption = { id: number; name: string }
export type ExerciseLicense = { id: number; name: string; url: string | null }

// WGER exerciseinfo embeds translations and related metadata, not a flat name.
// These DTO types describe decoded records after runtime normalization.
// Raw API input remains unknown; missing fields are handled by the mappers.
export type WgerTranslationDto = {
  language: number
  name: string
  description: string
  license: number | null
  license_author: string
}
export type WgerImageDto = {
  image: string
  is_main: boolean
  license: number | null
  license_author: string
}
export type WgerExerciseDto = {
  id: number
  translations: WgerTranslationDto[]
  category: ExerciseOption | null
  muscles: ExerciseOption[]
  muscles_secondary: ExerciseOption[]
  equipment: ExerciseOption[]
  images: WgerImageDto[]
}
export type WgerPageDto = { count: number; next: string | null; results: unknown[] }

export type Exercise = {
  source: 'wger'
  sourceId: number
  name: string
  description: string
  category: string
  muscles: string[]
  secondaryMuscles: string[]
  equipment: string[]
  image: { url: string; author: string; licenseId: number | null } | null
  author: string
  licenseId: number | null
}
export type ExerciseQuery = { search: string; category: string; muscle: string; equipment: string }
export type ExercisePage = { exercises: Exercise[]; count: number; next: string | null; skipped: number }
export type ExerciseMetadata = {
  categories: ExerciseOption[]
  muscles: ExerciseOption[]
  equipment: ExerciseOption[]
  licenses: ExerciseLicense[]
}
