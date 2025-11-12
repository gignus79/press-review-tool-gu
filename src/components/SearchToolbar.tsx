import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  FunnelSimple, 
  DownloadSimple, 
  FileText,
  FilePdf,
  FileXls,
  FileCode
} from '@phosphor-icons/react'
import type { Sentiment, ContentType, ExportFormat } from '@/lib/types'

interface SearchToolbarProps {
  totalResults: number
  selectedCount: number
  onExport: (format: ExportFormat) => void
  sentimentFilter: Sentiment | 'all'
  onSentimentFilterChange: (sentiment: Sentiment | 'all') => void
  contentTypeFilter: ContentType | 'all'
  onContentTypeFilterChange: (type: ContentType | 'all') => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function SearchToolbar({
  totalResults,
  selectedCount,
  onExport,
  sentimentFilter,
  onSentimentFilterChange,
  contentTypeFilter,
  onContentTypeFilterChange,
  onSelectAll,
  onDeselectAll
}: SearchToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-card border-b border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <FunnelSimple size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground" />
            <span className="text-xs sm:text-sm font-medium">Filters:</span>
          </div>

          <Select value={sentimentFilter} onValueChange={(v) => onSentimentFilterChange(v as Sentiment | 'all')}>
            <SelectTrigger className="w-[120px] sm:w-[140px] h-8 sm:h-9 text-xs sm:text-sm">
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiment</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={contentTypeFilter} onValueChange={(v) => onContentTypeFilterChange(v as ContentType | 'all')}>
            <SelectTrigger className="w-[120px] sm:w-[140px] h-8 sm:h-9 text-xs sm:text-sm">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="review">Reviews</SelectItem>
              <SelectItem value="interview">Interviews</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="feature">Features</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
            {selectedCount} of {totalResults}
          </Badge>

          <Select onValueChange={(v) => onExport(v as ExportFormat)}>
            <SelectTrigger className="w-[120px] sm:w-[140px] h-8 sm:h-9 text-xs sm:text-sm">
              <SelectValue placeholder="Export..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FilePdf size={16} />
                  <span>PDF</span>
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center gap-2">
                  <FileXls size={16} />
                  <span>Excel</span>
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileCode size={16} />
                  <span>JSON</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onSelectAll} className="text-xs sm:text-sm h-8">
          Select All
        </Button>
        <Button variant="ghost" size="sm" onClick={onDeselectAll} className="text-xs sm:text-sm h-8">
          Deselect All
        </Button>
      </div>
    </div>
  )
}
