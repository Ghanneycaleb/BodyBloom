import { AudioLines, Leaf, Sun } from 'lucide-react'
import { Card } from '../../../components/ui/Card'

const suggestions = [
  { title: 'Ease into it', text: 'Start with a sound that makes you want to move.', icon: Sun },
  { title: 'Find your rhythm', text: 'Choose the energy and atmosphere you enjoy.', icon: AudioLines },
  { title: 'Leave room for calm', text: 'Give the end of your session a softer soundtrack.', icon: Leaf },
]

export function SessionGuide() {
  return (
    <Card className="min-w-0 p-6 md:p-8">
      <h2 className="text-xl font-bold tracking-tight">Music for your mood</h2>
      <p className="mt-2 text-sm leading-6 text-secondary">A little inspiration for choosing your soundtrack.</p>
      <ul className="mt-6 space-y-5">
        {suggestions.map(({ title, text, icon: Icon }) => (
          <li key={title} className="flex gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon size={21} aria-hidden="true" /></span>
            <div className="min-w-0"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-secondary">{text}</p></div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
