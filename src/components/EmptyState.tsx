import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MagnifyingGlass, Sparkle } from '@phosphor-icons/react'

interface EmptyStateProps {
  onNewSearch: () => void
}

export function EmptyState({ onNewSearch }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="p-6 rounded-full bg-primary/10">
              <MagnifyingGlass size={48} className="text-primary" weight="duotone" />
            </div>
            <div className="absolute -top-2 -right-2 p-2 rounded-full bg-secondary">
              <Sparkle size={20} className="text-secondary-foreground" weight="fill" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-3">
          Start Your First Search
        </h2>
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Search for music press reviews and let AI analyze sentiment, relevance, and key themes automatically.
        </p>

        <Button onClick={onNewSearch} size="lg" className="gap-2">
          <MagnifyingGlass size={20} weight="bold" />
          New Search
        </Button>

        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-sm font-medium mb-3 uppercase tracking-wide text-muted-foreground">
            Search Tips
          </h3>
          <ul className="text-sm text-left space-y-2 text-muted-foreground">
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
