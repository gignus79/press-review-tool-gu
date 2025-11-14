import { useState, useEffect } from 'react'
import { useKV } from '@/src/hooks/use-kv'
import { Toaster } from '@/src/components/ui/sonner'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/src/components/ui/sheet'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { Separator } from '@/src/components/ui/separator'
import { toast } from 'sonner'
import { 
  MagnifyingGlass, 
  Newspaper,
  ChartBar,
  ClockCounterClockwise,
  Article,
  CheckCircle,
  WarningCircle,
  Moon,
  Sun,
  SignOut,
  Sparkle
} from '@phosphor-icons/react'

import { LoginPage } from '@/src/components/LoginPage'
import { SearchDialog } from '@/src/components/SearchDialog'
import { ResultCard } from '@/src/components/ResultCard'
import { MetricDisplay } from '@/src/components/MetricDisplay'
import { SearchToolbar } from '@/src/components/SearchToolbar'
import { EmptyState } from '@/src/components/EmptyState'
import { useTheme } from '@/src/hooks/use-theme'
import { exportResults } from '@/src/lib/utils'

import { performSearch, analyzeResult } from '@/src/lib/mock-data'
import type { SearchConfig, SearchResult, SearchHistory, Sentiment, ContentType, ExportFormat } from '@/lib/types/database'

function App() {
  const [userEmail, setUserEmail] = useKV<string | null>('user-email', null)
  const { theme, toggleTheme } = useTheme()
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [currentResults, setCurrentResults] = useState<SearchResult[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSearching, setIsSearching] = useState(false)
  const [analyzingProgress, setAnalyzingProgress] = useState(0)
  const [searchHistory, setSearchHistory] = useKV<SearchHistory[]>('search-history', [])
  const [currentConfig, setCurrentConfig] = useState<SearchConfig | null>(null)
  
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'all'>('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentType | 'all'>('all')

  if (!userEmail) {
    return <LoginPage onLogin={setUserEmail} />
  }

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
        user_id: 'local-user', // Legacy App.tsx - not used in Next.js
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

    try {
      exportResults(exportData, format, 'press-review-export')
      toast.success(`Exported ${exportData.length} results as ${format.toUpperCase()}`, {
        description: `Downloaded ${format === 'excel' ? 'CSV' : format.toUpperCase()} file successfully`
      })
    } catch (error) {
      toast.error(`Export failed`, {
        description: `Could not export as ${format.toUpperCase()}`
      })
    }
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

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      setUserEmail(null)
      setCurrentResults([])
      setSelectedIds(new Set())
      setSearchHistory([])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                <Newspaper size={20} className="sm:w-6 sm:h-6" weight="fill" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight truncate">Press Review</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">AI-Powered Music Press Analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <Moon size={18} className="sm:w-5 sm:h-5" weight="fill" />
                ) : (
                  <Sun size={18} className="sm:w-5 sm:h-5" weight="fill" />
                )}
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ClockCounterClockwise size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden md:inline">History</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Search History</SheetTitle>
                    <SheetDescription>
                      View and reload previous searches
                    </SheetDescription>
                  </SheetHeader>
                  
                  <ScrollArea className="h-[calc(100vh-180px)] mt-6">
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
                            <div className="font-medium mb-1 line-clamp-2">{history.config.query}</div>
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

                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleLogout}
                    >
                      <SignOut size={18} />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button onClick={() => setSearchDialogOpen(true)} size="sm" className="gap-2">
                <MagnifyingGlass size={16} className="sm:w-[18px] sm:h-[18px]" weight="bold" />
                <span className="hidden sm:inline">New Search</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {currentResults.length === 0 && !isSearching ? (
          <EmptyState onNewSearch={() => setSearchDialogOpen(true)} />
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {isSearching ? (
              <div className="text-center py-12 sm:py-16">
                <div className="inline-flex items-center gap-3 mb-4">
                  <MagnifyingGlass size={28} className="sm:w-8 sm:h-8 animate-pulse text-primary" weight="duotone" />
                  <span className="text-base sm:text-lg font-medium">Searching...</span>
                </div>
                <Progress value={33} className="max-w-md mx-auto" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <MetricDisplay
                    label="Total Results"
                    value={currentResults.length}
                    icon={<Article size={20} className="sm:w-6 sm:h-6" weight="duotone" />}
                  />
                  <MetricDisplay
                    label="Analyzed"
                    value={analyzedCount}
                    icon={<Sparkle size={20} className="sm:w-6 sm:h-6" weight="fill" />}
                  />
                  <MetricDisplay
                    label="Positive"
                    value={positiveCount}
                    icon={<CheckCircle size={20} className="sm:w-6 sm:h-6" weight="fill" />}
                  />
                  <MetricDisplay
                    label="Avg Relevance"
                    value={`${avgRelevance}%`}
                    icon={<ChartBar size={20} className="sm:w-6 sm:h-6" weight="duotone" />}
                  />
                </div>

                {analyzingProgress > 0 && analyzingProgress < 100 && (
                  <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                        <Sparkle size={14} className="sm:w-4 sm:h-4 text-secondary animate-pulse" weight="fill" />
                        AI Analysis in Progress
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">
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

                  <ScrollArea className="h-[500px] sm:h-[600px]">
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                      {filteredResults.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <WarningCircle size={40} className="sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm sm:text-base">No results match the current filters</p>
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

      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary text-primary-foreground">
                <Newspaper size={16} weight="fill" />
              </div>
              <span className="text-sm font-medium">Press Review Tool</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Made with ❤️ by{' '}
              <span className="font-medium text-foreground">MediaMatter - Giorgio Lovecchio</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App