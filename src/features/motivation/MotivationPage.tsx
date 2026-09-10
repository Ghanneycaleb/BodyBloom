import { workoutPlaylists } from './motivation.data'
import { getDailyQuote } from './motivation.utils'
import { useMotivationDate } from './useMotivationDate'
import { DailyQuoteCard } from './components/DailyQuoteCard'
import { PlaylistSection } from './components/PlaylistSection'
import { SessionGuide } from './components/SessionGuide'

export function MotivationPage() {
  const date = useMotivationDate()
  const quote = getDailyQuote(date)
  return (
    <div className="space-y-8">
      <header><h1 className="text-3xl font-bold tracking-tight md:text-4xl">Stay Motivated</h1><p className="mt-3 text-sm leading-6 text-secondary md:text-base">A little inspiration. A soundtrack for your next step.</p></header>
      <div className="grid min-w-0 gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2"><DailyQuoteCard quote={quote} date={date} /></div>
        <div className="order-2 min-w-0 xl:order-3 xl:col-span-3"><PlaylistSection playlists={workoutPlaylists} /></div>
        <div className="order-3 min-w-0 xl:order-2"><SessionGuide /></div>
      </div>
      <p className="text-xs leading-5 text-secondary">Words by BodyBloom. Playlist selections are editorial picks; Spotify may update their contents over time.</p>
    </div>
  )
}
