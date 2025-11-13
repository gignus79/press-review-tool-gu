import { Card } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { Sparkle, Copy, ArrowSquareOut } from '@phosphor-icons/react'
import type { SearchResult } from '@/src/lib/types'
import { cn } from '@/src/lib/utils'

interface ResultCardProps {
  result: SearchResult
  selected: boolean
  onToggleSelect: () => void
}

export function ResultCard({ result, selected, onToggleSelect }: ResultCardProps) {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-success text-success-foreground'
      case 'negative':
        return 'bg-destructive text-destructive-foreground'
      case 'mixed':
        return 'bg-secondary text-secondary-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <Card
      className={cn(
        'p-4 sm:p-6 transition-all duration-200 hover:shadow-md',
        selected && 'border-primary bg-primary/5',
        result.isDuplicate && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggleSelect}
          className="mt-1 flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold leading-tight mb-1 line-clamp-2">
                {result.title}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="font-medium truncate max-w-[120px] sm:max-w-none">{result.source}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{formatDate(result.publishDate)}</span>
                {result.isDuplicate && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-accent">
                      <Copy size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wide">Duplicate</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => window.open(result.url, '_blank')}
            >
              <ArrowSquareOut size={16} className="sm:w-[18px] sm:h-[18px]" />
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {result.snippet}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Badge variant="outline" className="capitalize text-xs">
              {result.contentType}
            </Badge>

            {result.isAnalyzing ? (
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <Sparkle size={14} className="sm:w-4 sm:h-4 animate-pulse text-secondary" weight="fill" />
                <span>Analyzing...</span>
              </div>
            ) : result.analysis ? (
              <>
                <Badge className={getSentimentColor(result.analysis.sentiment) + ' text-xs'}>
                  {result.analysis.sentiment}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {result.analysis.relevanceScore}%
                </Badge>
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                  Authority: {result.analysis.authority}
                </Badge>
                {result.analysis.themes.slice(0, window.innerWidth < 640 ? 1 : 2).map((theme) => (
                  <Badge key={theme} variant="outline" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </>
            ) : null}
          </div>

          {result.analysis && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {result.analysis.summary}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
