import type { Category } from '@/common/mocks/categories'
import { Link } from '@tanstack/react-router'
import { Layers, LayoutGrid } from 'lucide-react'

type IconComponent = React.ComponentType<{ className?: string }>

type CategoryConfig = {
  Icon: IconComponent
  accentBar: string
  iconWrap: string
  iconColor: string
  badge: string
}

const categoryConfig: Record<string, CategoryConfig> = {
  education: {
    Icon: LayoutGrid,
    accentBar: 'bg-blue-500',
    iconWrap: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-600',
  },
  'community-support': {
    Icon: LayoutGrid,
    accentBar: 'bg-blue-500',
    iconWrap: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-600',
  },
  'health-access': {
    Icon: LayoutGrid,
    accentBar: 'bg-blue-500',
    iconWrap: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-600',
  },
  'youth-development': {
    Icon: LayoutGrid,
    accentBar: 'bg-blue-500',
    iconWrap: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-600',
  },
  'family-services': {
    Icon: LayoutGrid,
    accentBar: 'bg-blue-500',
    iconWrap: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-600',
  },
}

const avatarColors = ['bg-accent']

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function CategoryCard({ category }: { category: Category }) {
  const config = categoryConfig[category.id] ?? {
    Icon: Layers,
    accentBar: 'bg-primary',
    iconWrap: 'bg-secondary',
    iconColor: 'text-primary',
    badge: 'bg-secondary text-primary',
  }
  const { Icon, accentBar, iconWrap, iconColor, badge } = config
  const visiblePeople = category.assignedPeople.slice(0, 3)
  const overflow = category.assignedPeople.length - visiblePeople.length

  return (
    <Link
      to="/category/$id"
      params={{ id: category.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`h-1.5 w-full ${accentBar}`} />

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className={`rounded-xl p-2.5 ${iconWrap}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <h3 className="flex-1 pt-1 text-base font-semibold leading-snug text-foreground">
            {category.name}
          </h3>
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-center justify-between gap-2">
          <div className="flex -space-x-2">
            {visiblePeople.map((person, i) => (
              <div
                key={person.id}
                title={person.name}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-xs font-semibold text-white ${avatarColors[i % avatarColors.length]}`}
              >
                {getInitials(person.name)}
              </div>
            ))}
            {overflow > 0 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-semibold text-muted-foreground">
                +{overflow}
              </div>
            )}
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
            {category.assignedPeople.length}{' '}
            {category.assignedPeople.length === 1 ? 'person' : 'people'}
          </span>
        </div>
      </div>
    </Link>
  )
}