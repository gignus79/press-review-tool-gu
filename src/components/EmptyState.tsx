import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MagnifyingGlass, Sparkle } from '@phosphor-icons/react'

interface EmptyStateProps {
  onNewSearch: () => void
}

export function EmptyState({ onNewSearch }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] px-4">
      <Card className="max-w-md w-full p-8 sm:p-12 text-center">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative">
            <div className="p-4 sm:p-6 rounded-full bg-primary/10">
              <MagnifyingGlass size={40} className="sm:w-12 sm:h-12 text-primary" weight="duotone" />
            </div>
            <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 p-1.5 sm:p-2 rounded-full bg-secondary">
              <Sparkle size={16} className="sm:w-5 sm:h-5 text-secondary-foreground" weight="fill" />
            </div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
          Start Your First Search
        </h2>
        
        <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
          Search for music press reviews and let AI analyze sentiment, relevance, and key themes automatically.
        </p>

        <Button onClick={onNewSearch} size="lg" className="gap-2 w-full sm:w-auto">
          <MagnifyingGlass size={18} className="sm:w-5 sm:h-5" weight="bold" />
          New Search
        </Button>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border">
          <h3 className="text-xs sm:text-sm font-medium mb-3 uppercase tracking-wide text-muted-foreground">
            Search Tips
          </h3>
          <ul className="text-xs sm:text-sm text-left space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Use specific artist or album names for best results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Filter by date ranges to track coverage over time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Select content types to focus on reviews or interviews</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
