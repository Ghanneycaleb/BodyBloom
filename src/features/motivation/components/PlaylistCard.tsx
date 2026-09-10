import { AudioLines, Dumbbell, ExternalLink, Footprints, Leaf, Sun } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Chip } from '../../../components/ui/Chip'
import { safeSpotifyUrl } from '../motivation.utils'
import type { MusicPhase, WorkoutPlaylist } from '../motivation.types'

const artwork = {
  'Warm Up': { icon: Sun, color: 'from-[#e9f5df] to-[#bae8cf] text-brand-strong' },
  Strength: { icon: Dumbbell, color: 'from-[#2a313d] to-[#006c49] text-primary-fixed' },
  Cardio: { icon: Footprints, color: 'from-[#006c49] to-[#138468] text-white' },
  Focus: { icon: AudioLines, color: 'from-[#e7eefe] to-[#cad6ed] text-[#384d66]' },
  'Cool Down': { icon: Leaf, color: 'from-[#e5f6ef] to-[#c5dcd4] text-brand-strong' },
} satisfies Record<MusicPhase, { icon: typeof Sun; color: string }>

export function PlaylistCard({ playlist }: { playlist: WorkoutPlaylist }) {
  const { icon: Icon, color } = artwork[playlist.phase]
  const href = safeSpotifyUrl(playlist.spotifyUrl)
  return (
    <article className="min-w-0" aria-labelledby={`playlist-${playlist.id}`}>
      <Card className="flex h-full min-w-0 flex-col gap-4 p-5">
        <div className="flex min-w-0 items-center gap-4">
          <span className={`relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br ${color}`} aria-hidden="true">
            <span className="absolute -right-5 -top-5 size-16 rounded-full border-8 border-current opacity-10" /><Icon size={28} strokeWidth={1.5} />
          </span>
          <div className="min-w-0"><h3 id={`playlist-${playlist.id}`} className="break-words text-lg font-bold tracking-tight">{playlist.title}</h3><p className="mt-1 text-xs text-secondary">Spotify playlist{playlist.genre ? ` · ${playlist.genre}` : ''}</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-2"><Chip selected>{playlist.phase}</Chip>{playlist.bpm !== undefined && <span className="text-xs text-secondary">Approx. {playlist.bpm} BPM</span>}</div>
        {playlist.description && <p className="text-sm leading-6 text-secondary">{playlist.description}</p>}
        <div className="mt-auto border-t border-outline-variant/30 pt-3">
          {href ? <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${playlist.title} on Spotify (opens in a new tab)`} className="inline-flex min-h-12 w-full items-center justify-between gap-2 rounded-lg px-2 py-3 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Open in Spotify<ExternalLink size={17} className="shrink-0" aria-hidden="true" /></a> : <p className="py-3 text-sm text-secondary">Spotify link unavailable</p>}
        </div>
      </Card>
    </article>
  )
}
