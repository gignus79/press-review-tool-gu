"use client"

import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Card, CardContent } from '@/src/components/ui/card'
import { 
  MagnifyingGlass, 
  Newspaper,
  ChartBar,
  Article,
  CheckCircle,
  Moon,
  Sun,
  Sparkle,
  Calendar
} from '@phosphor-icons/react'
import { useTheme } from '@/src/hooks/use-theme'

export default function UIPreviewPage() {
  const { theme, toggleTheme } = useTheme()

  const mockResults = [
    {
      id: '1',
      title: 'Taylor Swift\'s Midnights: A Sonic Journey Through Sleepless Thoughts',
      source: 'Pitchfork',
      publishedDate: '2024-10-21',
      snippet: 'Swift\'s latest album showcases her introspective songwriting at its finest, weaving midnight musings into pop perfection.',
      sentiment: 'positive',
      relevanceScore: 92,
      themes: ['songwriting', 'introspection', 'pop music']
    },
    {
      id: '2',
      title: 'The Rise of Indie Rock: A New Generation Takes the Stage',
      source: 'Rolling Stone',
      publishedDate: '2024-11-10',
      snippet: 'Independent artists are reshaping the music landscape with authentic sounds and grassroots marketing strategies.',
      sentiment: 'neutral',
      relevanceScore: 87,
      themes: ['indie rock', 'emerging artists', 'music industry']
    },
    {
      id: '3',
      title: 'Concert Review: Arctic Monkeys Deliver Electrifying Performance',
      source: 'NME',
      publishedDate: '2024-11-08',
      snippet: 'The Sheffield band proved they still have what it takes to captivate audiences with their signature sound.',
      sentiment: 'positive',
      relevanceScore: 89,
      themes: ['live performance', 'rock music', 'audience engagement']
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Newspaper size={24} weight="fill" />
              </div>
              <div>
                <h1 className="font-bold text-lg sm:text-xl text-foreground">Press Review</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">AI-Powered Music Press Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'dark' ? 
                  <Sun size={18} className="text-foreground" /> : 
                  <Moon size={18} className="text-foreground" />
                }
              </Button>
              
              <Button variant="outline" size="sm" className="text-xs">
                UI Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">Music Press Analysis</h2>
            <p className="text-muted-foreground text-sm">Search and analyze music press coverage with AI-powered insights</p>
          </div>
          
          <Button className="flex items-center gap-2 whitespace-nowrap">
            <MagnifyingGlass size={18} weight="bold" />
            New Search
          </Button>
        </div>

        {/* Demo Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <Sparkle size={24} className="text-blue-600 dark:text-blue-400" weight="fill" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">Beautiful UI Preview! ✨</h3>
              <p className="text-blue-700 dark:text-blue-200 mb-3">
                This is your beautiful Press Review interface! The full application includes authentication, real-time search, AI analysis, and much more.
              </p>
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="bg-white dark:bg-blue-900 border-blue-300 dark:border-blue-700">
                  <a href="/login">Try Full App</a>
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <a href="/signup">Get Started</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Article size={24} className="text-primary" weight="duotone" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground font-medium">Total Results</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <Sparkle size={24} className="text-purple-600 dark:text-purple-400" weight="fill" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground font-medium">Analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle size={24} className="text-green-600 dark:text-green-400" weight="fill" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">2</p>
                  <p className="text-sm text-muted-foreground font-medium">Positive</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                  <ChartBar size={24} className="text-orange-600 dark:text-orange-400" weight="duotone" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">89%</p>
                  <p className="text-sm text-muted-foreground font-medium">Avg Relevance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Toolbar */}
        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">Filters & Tools:</span>
                <Badge variant="secondary" className="font-medium">All Sentiment</Badge>
                <Badge variant="secondary" className="font-medium">All Content Types</Badge>
                <Badge variant="outline">3 Selected</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="font-medium">
                  📊 Export Results
                </Button>
                <Button variant="outline" size="sm" className="font-medium">
                  ✅ Select All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Search Results</h3>
          {mockResults.map((result, index) => (
            <Card key={result.id} className="hover:shadow-lg transition-all duration-300 hover:border-primary/30 group">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-foreground group-hover:text-primary cursor-pointer line-clamp-2 transition-colors">
                        {result.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">{result.source}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(result.publishedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground leading-relaxed">
                    {result.snippet}
                  </p>

                  {/* Analysis Badges */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Badge 
                      className={
                        result.sentiment === 'positive' 
                          ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 font-medium' 
                          : result.sentiment === 'negative'
                          ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 font-medium'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 font-medium'
                      }
                    >
                      😊 {result.sentiment}
                    </Badge>
                    <Badge variant="secondary" className="font-medium">
                      🎯 {result.relevanceScore}% relevance
                    </Badge>
                    {result.themes.slice(0, 3).map((theme) => (
                      <Badge key={theme} variant="outline" className="font-medium">
                        #{theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to dive deeper? 🚀</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              This beautiful interface is just the beginning. The full application includes real-time search, advanced AI analysis, user authentication, and much more!
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="font-semibold px-8">
                <a href="/login">🔓 Sign In</a>
              </Button>
              <Button variant="outline" size="lg" className="font-semibold px-8">
                <a href="/signup">✨ Create Account</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}