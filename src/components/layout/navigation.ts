import {
  BarChart3,
  Dumbbell,
  History,
  LayoutDashboard,
  ListPlus,
  Trophy,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: LucideIcon
}

export const navigationItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Log Workout', path: '/log-workout', icon: ListPlus },
  { label: 'Workout History', path: '/history', icon: History },
  { label: 'Exercises', path: '/exercises', icon: Dumbbell },
  { label: 'Progress', path: '/progress', icon: BarChart3 },
  { label: 'Motivation', path: '/motivation', icon: Trophy },
]
