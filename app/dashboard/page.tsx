'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/src/components/ui/button'
import { Progress } from '@/src/components/ui/progress'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/src/components/ui/sheet'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { Badge } from '@/src/components/ui/badge'
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
  Sparkle,
  ShareNetwork,
  Trash
} from '@phosphor-icons/react'
import type { User } from '@supabase/supabase-js'

import { SearchDialog } from '@/src/components/SearchDialog'
import { ResultCard } from '@/src/components/ResultCard'
import { MetricDisplay } from '@/src/components/MetricDisplay'
import { SearchToolbar } from '@/src/components/SearchToolbar'
import { EmptyState } from '@/src/components/EmptyState'
import { useTheme } from '@/src/hooks/use-theme'

import { performSearch, analyzeResult } from '@/lib/utils/mock-search'
import { exportResults } from '@/lib/utils/export'
import type { SearchConfig, SearchResult, SearchHistory, Sentiment, ContentType, ExportFormat } from '@/lib/types/database'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { theme, toggleTheme } = useTheme()
  
  const [user, setUser] = useState<User | null>(null)
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [currentResults, setCurrentResults] = useState<SearchResult[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSearching, setIsSearching] = useState(false)
  const [analyzingProgress, setAnalyzingProgress] = useState(0)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [currentConfig, setCurrentConfig] = useState<SearchConfig | null>(null)
  const [usageLimits, setUsageLimits] = useState<{
    searches: number
    maxSearches: number
    exports: number
    maxExports: number
  } | null>(null)
  
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'all'>('all')
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentType | 'all'>('all')

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        
        if (!user) {
          router.push('/login')
        } else {
          setUser(user)
          loadSearchHistory(user.id)
          loadUsageLimits(user.id)
        }
      } catch (error) {
        console.error('Failed to check user:', error)
        router.push('/login')
      }
    }
    checkUser()
  }, [supabase, router])

  const loadUsageLimits = async (userId: string) => {
    try {
      const response = await fetch('/api/usage')
      if (!response.ok) throw new Error('Failed to fetch usage limits')
      
      const { limits } = await response.json()
      if (limits) {
        setUsageLimits({
          searches: limits.searches_this_month,
          maxSearches: limits.max_searches,
          exports: limits.exports_this_month,
          maxExports: limits.max_exports
        })
      }
    } catch (error) {
      console.error('Failed to load usage limits:', error)
    }
  }

  const loadSearchHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Failed to load search history:', error)
        toast.error('Failed to load search history')
        return
      }

      if (data) {
        setSearchHistory(data.map(item => ({
          id: item.id,
          user_id: item.user_id,
          timestamp: item.created_at,
          config: item.config,
          resultCount: item.result_count,
          results: item.results,
          shared: item.shared,
          shareToken: item.share_token
        })))
      }
    } catch (error) {
      console.error('Error loading search history:', error)
      toast.error('Failed to load search history')
    }
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
    if (!user) {
      toast.error('Please log in to perform searches')
      return
    }

    setIsSearching(true)
    setCurrentConfig(config)
    setCurrentResults([])
    setSelectedIds(new Set())
    setSentimentFilter('all')
    setContentTypeFilter('all')
    setAnalyzingProgress(0)

    try {
      // Check usage limits with error handling
      const { data: limits, error: limitsError } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (limitsError) {
        console.error('Failed to fetch usage limits:', limitsError)
        toast.error('Failed to check usage limits', {
          description: 'Please try again'
        })
        setIsSearching(false)
        return
      }

      if (limits && limits.searches_this_month >= limits.max_searches) {
        toast.error('Search limit reached', {
          description: `You have reached your monthly search limit of ${limits.max_searches}`
        })
        setIsSearching(false)
        return
      }

      const results = await performSearch(config.query, config.maxResults)
      setCurrentResults(results)
      setIsSearching(false)

      toast.success(`Found ${results.length} results`, {
        description: 'Starting AI analysis...'
      })

      // Update usage limits with error handling
      if (limits) {
        const { error: updateError } = await supabase
          .from('usage_limits')
          .update({ searches_this_month: limits.searches_this_month + 1 })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('Failed to update usage limits:', updateError)
          // Don't block the search, just log the error
        } else {
          // Refresh usage limits display
          loadUsageLimits(user.id)
        }
      }

      analyzeResults(results)

      // Save to history with error handling
      const { data: savedSearch, error: historyError } = await supabase
        .from('search_history')
        .insert({
          user_id: user.id,
          query: config.query,
          config: config,
          result_count: results.length,
          results: results
        })
        .select()
        .single()

      if (historyError) {
        console.error('Failed to save search history:', historyError)
        toast.warning('Search completed but failed to save to history')
      } else if (savedSearch) {
        setSearchHistory(prev => [savedSearch, ...prev.slice(0, 19)])
      }
    } catch (error: any) {
      console.error('Search failed:', error)
      toast.error('Search failed', {
        description: error.message || 'Please try again with different parameters'
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

  const handleExport = async (format: ExportFormat) => {
    if (!user) {
      toast.error('Please log in to export results')
      return
    }

    try {
      // Check usage limits with error handling
      const { data: limits, error: limitsError } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (limitsError) {
        console.error('Failed to fetch usage limits:', limitsError)
        toast.error('Failed to check export limits')
        return
      }

      if (limits && limits.exports_this_month >= limits.max_exports) {
        toast.error('Export limit reached', {
          description: `You have reached your monthly export limit of ${limits.max_exports}`
        })
        return
      }

      const selectedResults = currentResults.filter(r => selectedIds.has(r.id))
      const exportData = selectedResults.length > 0 ? selectedResults : currentResults

      if (exportData.length === 0) {
        toast.error('No results to export')
        return
      }

      exportResults(exportData, format)
      toast.success(`Exported ${exportData.length} results as ${format.toUpperCase()}`)

      // Update usage limits with error handling
      if (limits) {
        const { error: updateError } = await supabase
          .from('usage_limits')
          .update({ exports_this_month: limits.exports_this_month + 1 })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('Failed to update usage limits:', updateError)
        } else {
          // Refresh usage limits display
          loadUsageLimits(user.id)
        }
      }
    } catch (error: any) {
      console.error('Export failed:', error)
      toast.error('Export failed', {
        description: error.message || 'Please try again'
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

  const handleShare = async (searchId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchId })
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to create share link')
      }

      const { shareUrl } = await response.json()
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard!', {
        description: 'Anyone with this link can view the search results'
      })

      // Refresh history to show share status
      if (user) {
        loadSearchHistory(user.id)
      }
    } catch (error: any) {
      console.error('Failed to create share link:', error)
      toast.error('Failed to create share link', {
        description: error.message || 'Please try again'
      })
    }
  }

  const handleDeleteHistory = async (searchId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this search?')) return

    try {
      const response = await fetch(`/api/history?id=${searchId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to delete search')
      }

      setSearchHistory(prev => prev.filter(h => h.id !== searchId))
      toast.success('Search deleted')
    } catch (error: any) {
      console.error('Failed to delete search:', error)
      toast.error('Failed to delete search', {
        description: error.message || 'Please try again'
      })
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
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
              {usageLimits && (
                <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-muted">
                    Searches: {usageLimits.searches}/{usageLimits.maxSearches}
                  </span>
                  <span className="px-2 py-1 rounded bg-muted">
                    Exports: {usageLimits.exports}/{usageLimits.maxExports}
                  </span>
                </div>
              )}
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
                    {searchHistory.length === 0 ? (
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
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="font-medium line-clamp-2 flex-1">{history.config.query}</div>
                              {history.shared && (
                                <Badge variant="secondary" className="text-xs flex-shrink-0">
                                  Shared
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {new Date(history.timestamp).toLocaleDateString()} • {history.resultCount} results
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {history.config.contentTypes.map(type => (
                                <span key={type} className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                                  {type}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={(e) => handleShare(history.id, e)}
                              >
                                <ShareNetwork size={14} className="mr-1" />
                                Share
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-destructive hover:text-destructive"
                                onClick={(e) => handleDeleteHistory(history.id, e)}
                              >
                                <Trash size={14} className="mr-1" />
                                Delete
                              </Button>
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
    </div>
  )
}
