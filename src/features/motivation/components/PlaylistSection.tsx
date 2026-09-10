import { Headphones } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { normalizePlaylists } from '../motivation.utils'
import type { WorkoutPlaylist } from '../motivation.types'
import { PlaylistCard } from './PlaylistCard'

export function PlaylistSection({ playlists }: { playlists: readonly WorkoutPlaylist[] }) {
  const items = normalizePlaylists(playlists)
  return (
    <section aria-labelledby="workout-music-heading" className="space-y-5">
      <header>
        <h2 id="workout-music-heading" className="flex items-center gap-3 text-2xl font-bold tracking-tight"><Headphones size={24} className="shrink-0 text-primary" aria-hidden="true" />Your Workout Soundtrack</h2>
        <p className="mt-2 text-sm leading-6 text-secondary">A few playlists picked for different parts of your session. Choose your own pace.</p>
        <p className="mt-1 text-xs leading-5 text-secondary">Links open Spotify in a new tab. Listening happens there.</p>
      </header>
      {items.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}</div> : <Card><p className="text-sm text-secondary">There are no music picks available right now.</p></Card>}
    </section>
  )
}
