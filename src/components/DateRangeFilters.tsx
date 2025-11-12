import { Button } from '@/components/ui/button'
import { CalendarBlank } from '@phosphor-icons/react'

export type DateRangePreset = '1month' | '3months' | '1year' | 'all'

interface DateRangeFiltersProps {
  selected?: DateRangePreset
  onSelect: (preset: DateRangePreset) => void
}

export function DateRangeFilters({ selected, onSelect }: DateRangeFiltersProps) {
  const presets: { value: DateRangePreset; label: string }[] = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '1year', label: '1 Year' },
    { value: 'all', label: 'All Time' }
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <CalendarBlank size={16} />
        <span className="hidden sm:inline">Time Range:</span>
      </div>
      {presets.map((preset) => (
        <Button
          key={preset.value}
          variant={selected === preset.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(preset.value)}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  )
}

export function getDateRangeFromPreset(preset: DateRangePreset): { from?: string; to?: string } {
  const now = new Date()
  const to = now.toISOString().split('T')[0]
  
  switch (preset) {
    case '1month':
      const oneMonthAgo = new Date(now)
      oneMonthAgo.setMonth(now.getMonth() - 1)
      return { from: oneMonthAgo.toISOString().split('T')[0], to }
    
    case '3months':
      const threeMonthsAgo = new Date(now)
      threeMonthsAgo.setMonth(now.getMonth() - 3)
      return { from: threeMonthsAgo.toISOString().split('T')[0], to }
    
    case '1year':
      const oneYearAgo = new Date(now)
      oneYearAgo.setFullYear(now.getFullYear() - 1)
      return { from: oneYearAgo.toISOString().split('T')[0], to }
    
    case 'all':
    default:
      return {}
  }
}
