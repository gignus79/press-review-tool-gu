import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Newspaper, CalendarBlank, Globe } from '@phosphor-icons/react/dist/ssr'
import type { SearchResult } from '@/lib/types/database'

export default async function SharedSearchPage({ params }: { params: { token: string } }) {
  const supabase = await createClient()
  
  const { data: search, error } = await supabase
    .from('search_history')
    .select('*')
    .eq('share_token', params.token)
    .eq('shared', true)
    .single()

  if (error || !search) {
    notFound()
  }

  const results: SearchResult[] = search.results || []

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Newspaper size={24} weight="fill" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Press Review - Shared Search</h1>
              <p className="text-sm text-muted-foreground">View-only access</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{search.query}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarBlank size={16} />
              {new Date(search.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Globe size={16} />
              {results.length} results
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {results.map((result) => (
            <Card key={result.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-2">
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {result.title}
                      </a>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 flex-wrap">
                      <span>{result.source}</span>
                      <span>•</span>
                      <span>{new Date(result.publishDate).toLocaleDateString()}</span>
                      <Badge variant="outline" className="capitalize">
                        {result.contentType}
                      </Badge>
                    </CardDescription>
                  </div>
                  {result.analysis && (
                    <Badge 
                      variant={
                        result.analysis.sentiment === 'positive' ? 'default' :
                        result.analysis.sentiment === 'negative' ? 'destructive' :
                        'secondary'
                      }
                      className="capitalize"
                    >
                      {result.analysis.sentiment}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{result.snippet}</p>
                {result.analysis && (
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Relevance:</span>{' '}
                      <span className="font-medium">{result.analysis.relevanceScore}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Authority:</span>{' '}
                      <span className="font-medium">{result.analysis.authority}%</span>
                    </div>
                  </div>
                )}
                {result.analysis?.themes && result.analysis.themes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.analysis.themes.map((theme) => (
                      <Badge key={theme} variant="outline" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
