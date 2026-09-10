export type MotivationTheme = 'Consistency' | 'Growth' | 'Recovery' | 'Focus'
export type MotivationQuote = {
  id: string
  text: string
  author: 'BodyBloom'
  theme: MotivationTheme
}
export type MusicPhase = 'Warm Up' | 'Strength' | 'Cardio' | 'Focus' | 'Cool Down'
export type WorkoutPlaylist = {
  id: string
  title: string
  phase: MusicPhase
  description?: string
  genre?: string
  bpm?: number
  spotifyUrl?: string
}
