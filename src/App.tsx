import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  MagnifyingGlass, 
  Sparkle, 
  ChartBar,
  ClockCounterClockwise,
  Article,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react'

import { SearchDialog } from '@/components/SearchDialog'
import { ResultCard } from '@/components/ResultCard'
import { MetricDisplay } from '@/components/MetricDisplay'
import { SearchToolbar } from '@/components/SearchToolbar'
import { EmptyState } from '@/components/EmptyState'

import { performSearch, analyzeResult } from '@/lib/mock-data'
import type { SearchConfig, SearchResult, SearchHistory, Sentiment, ContentType, ExportFormat } from '@/lib/types'

function App() {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [currentResults, setCurrentResults] = useState<SearchResult[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSearching, setIsSearching] = useState(false)
  const [analyzingProgress, setAnalyzingProgress] = useState(0)
  const [searchHistory, setSearchHistory] = useKV<SearchHistory[]>('search-history', [])
  const [currentConfig, setCurrentConfig] = useState<SearchConfig | null>(null)
  
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'all'>('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentType | 'all'>('all')

  const filteredResults = currentResults.filter(result => {
    if (sentimentFilter !== 'all' && result.analysis?.sentiment !== sentimentFilter) {
      return false
    }
    if (contentTypeFilter !== 'all' && result.contentType !== contentTypeFilter) {
      return false
    }
    return true
  })

  const handleSearch = async (config: SearchConfig) => {
    setIsSearching(true)
    setCurrentConfig(config)
    setCurrentResults([])
    setSelectedIds(new Set())
    setSentimentFilter('all')
    setContentTypeFilter('all')
    setAnalyzingProgress(0)

    try {
      const results = await performSearch(config.query, config.maxResults)
      setCurrentResults(results)
      setIsSearching(false)

      toast.success(`Found ${results.length} results`, {
        description: 'Starting AI analysis...'
      })

      analyzeResults(results)

      const historyEntry: SearchHistory = {
        id: `search-${Date.now()}`,
        timestamp: new Date().toISOString(),
        config,
        resultCount: results.length,
        results
      }

      setSearchHistory(current => [historyEntry, ...(current || []).slice(0, 19)])
    } catch (error) {
      toast.error('Search failed', {
        description: 'Please try again with different parameters'
      })
      setIsSearching(false)
    }
  }

  const analyzeResults = async (results: SearchResult[]) => {
    const total = results.length
    let completed = 0

    for (const result of results) {
      setCurrentResults(current =>
        current.map(r => r.id === result.id ? { ...r, isAnalyzing: true } : r)
      )

      try {
        const analysis = await analyzeResult(result)
        
        setCurrentResults(current =>
          current.map(r =>
            r.id === result.id
              ? { ...r, analysis, isAnalyzing: false }
              : r
          )
        )

        completed++
        setAnalyzingProgress((completed / total) * 100)

        if (completed === total) {
          toast.success('Analysis complete', {
            description: `Processed ${total} articles with AI`
          })
        }
      } catch (error) {
        setCurrentResults(current =>
          current.map(r => r.id === result.id ? { ...r, isAnalyzing: false } : r)
        )
      }
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds(current => {
      const newSet = new Set(current)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    setSelectedIds(new Set(filteredResults.map(r => r.id)))
  }

  const handleDeselectAll = () => {
    setSelectedIds(new Set())
  }

  const handleExport = (format: ExportFormat) => {
    const selectedResults = currentResults.filter(r => selectedIds.has(r.id))
    const exportData = selectedResults.length > 0 ? selectedResults : currentResults

    switch (format) {
      case 'json':
        const jsonData = JSON.stringify(exportData, null, 2)
        downloadFile(jsonData, 'press-review-export.json', 'application/json')
        toast.success(`Exported ${exportData.length} results as JSON`)
        break
      case 'excel':
        toast.success(`Exported ${exportData.length} results as Excel`, {
          description: 'Feature simulated in demo'
        })
        break
      case 'pdf':
        toast.success(`Exported ${exportData.length} results as PDF`, {
          description: 'Feature simulated in demo'
        })
        break
    }
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const loadHistorySearch = (history: SearchHistory) => {
    if (history.results) {
      setCurrentResults(history.results)
      setCurrentConfig(history.config)
      setSelectedIds(new Set())
      toast.success('Search loaded from history')
    }
  }

  const analyzedCount = currentResults.filter(r => r.analysis).length
  const positiveCount = currentResults.filter(r => r.analysis?.sentiment === 'positive').length
  const avgRelevance = currentResults.length > 0
    ? Math.round(
        currentResults
          .filter(r => r.analysis)
          .reduce((sum, r) => sum + (r.analysis?.relevanceScore || 0), 0) / 
        analyzedCount
      )
    : 0

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Sparkle size={24} weight="fill" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Press Review Tool</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Music Press Analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ClockCounterClockwise size={18} />
                    <span className="hidden sm:inline">History</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Search History</SheetTitle>
                    <SheetDescription>
                      View and reload previous searches
                    </SheetDescription>
                  </SheetHeader>
                  
                  <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                    {!searchHistory || searchHistory.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <ClockCounterClockwise size={48} className="mx-auto mb-3 opacity-50" />
                        <p>No search history yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {searchHistory.map((history) => (
                          <div
                            key={history.id}
                            className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => loadHistorySearch(history)}
                          >
                            <div className="font-medium mb-1">{history.config.query}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(history.timestamp).toLocaleDateString()} • {history.resultCount} results
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {history.config.contentTypes.map(type => (
                                <span key={type} className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <Button onClick={() => setSearchDialogOpen(true)} className="gap-2">
                <MagnifyingGlass size={18} weight="bold" />
                New Search
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        {currentResults.length === 0 && !isSearching ? (
          <EmptyState onNewSearch={() => setSearchDialogOpen(true)} />
        ) : (
          <div className="space-y-6">
            {isSearching ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 mb-4">
                  <MagnifyingGlass size={32} className="animate-pulse text-primary" weight="duotone" />
                  <span className="text-lg font-medium">Searching...</span>
                </div>
                <Progress value={33} className="max-w-md mx-auto" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricDisplay
                    label="Total Results"
                    value={currentResults.length}
                    icon={<Article size={24} weight="duotone" />}
                  />
                  <MetricDisplay
                    label="Analyzed"
                    value={analyzedCount}
                    icon={<Sparkle size={24} weight="fill" />}
                  />
                  <MetricDisplay
                    label="Positive"
                    value={positiveCount}
                    icon={<CheckCircle size={24} weight="fill" />}
                  />
                  <MetricDisplay
                    label="Avg Relevance"
                    value={`${avgRelevance}%`}
                    icon={<ChartBar size={24} weight="duotone" />}
                  />
                </div>

                {analyzingProgress > 0 && analyzingProgress < 100 && (
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Sparkle size={16} className="text-secondary animate-pulse" weight="fill" />
                        AI Analysis in Progress
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(analyzingProgress)}%
                      </span>
                    </div>
                    <Progress value={analyzingProgress} />
                  </div>
                )}

                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <SearchToolbar
                    totalResults={filteredResults.length}
                    selectedCount={selectedIds.size}
                    onExport={handleExport}
                    sentimentFilter={sentimentFilter}
                    onSentimentFilterChange={setSentimentFilter}
                    contentTypeFilter={contentTypeFilter}
                    onContentTypeFilterChange={setContentTypeFilter}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                  />

                  <ScrollArea className="h-[600px]">
                    <div className="p-4 space-y-4">
                      {filteredResults.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <WarningCircle size={48} className="mx-auto mb-3 opacity-50" />
                          <p>No results match the current filters</p>
                        </div>
                      ) : (
                        filteredResults.map((result) => (
                          <ResultCard
                            key={result.id}
                            result={result}
                            selected={selectedIds.has(result.id)}
                            onToggleSelect={() => handleToggleSelect(result.id)}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <SearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onSearch={handleSearch}
      />
    </div>
  )
}

export default App