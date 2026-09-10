import { Quote, Sun } from 'lucide-react'
import { formatWorkoutDate } from '../../workouts/workout.dates'
import type { MotivationQuote } from '../motivation.types'

export function DailyQuoteCard({ quote, date }: { quote: MotivationQuote; date: string }) {
  return (
    <section aria-labelledby="daily-inspiration-heading" className="relative flex h-full min-h-80 min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-br from-brand-strong to-[#004b36] p-6 text-white shadow-soft md:min-h-96 md:p-8">
      <Quote size={160} strokeWidth={1} className="pointer-events-none absolute -right-4 -top-3 text-white/10" aria-hidden="true" />
      <div className="relative">
        <h2 id="daily-inspiration-heading" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-medium"><Sun size={17} aria-hidden="true" />Daily Inspiration</h2>
        <p className="mt-3 text-xs text-white/90"><time dateTime={date}>{formatWorkoutDate(date, { month: 'long', day: 'numeric', year: 'numeric' })}</time> · {quote.theme}</p>
      </div>
      <figure className="relative mt-8" aria-live="polite" aria-atomic="true">
        <blockquote className="break-words text-2xl font-semibold leading-snug tracking-tight md:text-3xl lg:text-4xl">“{quote.text}”</blockquote>
        <figcaption className="mt-5 text-sm text-white/90">— {quote.author} <span className="block pt-1 text-xs">An original note for your day</span></figcaption>
      </figure>
    </section>
  )
}
