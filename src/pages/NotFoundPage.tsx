import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'

export function NotFoundPage() {
  return <Card className="space-y-4 py-12 text-center">
    <h2 className="text-2xl font-bold">Page not found</h2>
    <p className="text-secondary">This page does not exist. Return to your dashboard to keep tracking your progress.</p>
    <Link to="/" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Back to Dashboard</Link>
  </Card>
}
