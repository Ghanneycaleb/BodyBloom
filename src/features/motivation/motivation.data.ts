import type { MotivationQuote, WorkoutPlaylist } from './motivation.types'

// Original BodyBloom copy written for this app; no third-party quotations or lyrics.
// Keep order stable: calendar-day selection cycles through this list.
export const motivationQuotes: readonly MotivationQuote[] = [
  { id: 'small-start', text: 'A small start today gives your next step somewhere to begin.', author: 'BodyBloom', theme: 'Growth' },
  { id: 'return', text: 'Consistency is the practice of returning, one day at a time.', author: 'BodyBloom', theme: 'Consistency' },
  { id: 'room-to-rest', text: 'Make room for rest in the routine you want to keep.', author: 'BodyBloom', theme: 'Recovery' },
  { id: 'next-step', text: 'Give this moment your attention. Let the next one wait.', author: 'BodyBloom', theme: 'Focus' },
  { id: 'your-pace', text: 'Your pace can change without changing your direction.', author: 'BodyBloom', theme: 'Growth' },
  { id: 'repeatable', text: 'Build a routine you can return to, not a moment you must repeat perfectly.', author: 'BodyBloom', theme: 'Consistency' },
  { id: 'pause', text: 'A pause can belong in a story of progress.', author: 'BodyBloom', theme: 'Recovery' },
  { id: 'present', text: 'Let this session be about where you are today.', author: 'BodyBloom', theme: 'Focus' },
  { id: 'notice', text: 'Notice the small changes. They are part of your growth, too.', author: 'BodyBloom', theme: 'Growth' },
  { id: 'ordinary-days', text: 'Give your ordinary training days a place in your progress story.', author: 'BodyBloom', theme: 'Consistency' },
  { id: 'listen', text: 'There is space for both effort and ease in your week.', author: 'BodyBloom', theme: 'Recovery' },
  { id: 'one-thing', text: 'Choose one thing to give your attention to, then begin there.', author: 'BodyBloom', theme: 'Focus' },
]

// Public playlist titles/URLs checked on Spotify on 2026-09-10.
// Phase labels and descriptions are BodyBloom editorial suggestions, not Spotify metadata.
// BPM is deliberately omitted: a changing playlist has no single verified tempo.
export const workoutPlaylists: readonly WorkoutPlaylist[] = [
  { id: 'happy-hits', title: 'Happy Hits!', phase: 'Warm Up', description: 'A bright soundtrack for easing into your session.', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC' },
  { id: 'beast-mode', title: 'Beast Mode', phase: 'Strength', description: 'Bring some extra musical energy to your lifting playlist.', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP' },
  { id: 'workout', title: 'Workout', phase: 'Cardio', description: 'A workout mix to accompany your next moving session.', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh' },
  { id: 'brain-food', title: 'Brain Food', phase: 'Focus', genre: 'Electronic', description: 'Electronic textures for a more focused atmosphere.', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWXLeA8Omikj7' },
  { id: 'peaceful-piano', title: 'Peaceful Piano', phase: 'Cool Down', genre: 'Piano', description: 'A softer musical finish when you are ready to wind down.', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
]
