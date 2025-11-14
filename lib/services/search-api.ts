import type { SearchResult, SearchConfig, ContentType } from '@/lib/types/database'

interface NewsAPIResponse {
  articles: Array<{
    title: string
    url: string
    source: { name: string }
    publishedAt: string
    description: string
    content?: string
  }>
}

export async function performRealSearch(
  config: SearchConfig
): Promise<SearchResult[]> {
  try {
    // Option 1: NewsAPI.org (free tier available)
    if (process.env.NEXT_PUBLIC_NEWS_API_KEY) {
      return await searchNewsAPI(config)
    }
    
    // Option 2: Google News API (requires API key)
    if (process.env.NEXT_PUBLIC_GOOGLE_NEWS_API_KEY) {
      return await searchGoogleNews(config)
    }
    
    // Option 3: RSS feeds from music publications (fallback)
    return await searchRSSFeeds(config)
    
  } catch (error) {
    console.error('Search API error:', error)
    throw new Error('Failed to perform search. Please try again.')
  }
}

async function searchNewsAPI(config: SearchConfig): Promise<SearchResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY
  if (!apiKey) throw new Error('NewsAPI key not configured')
  
  const query = encodeURIComponent(config.query + ' music')
  const sources = 'pitchfork,rolling-stone,the-guardian,nme'
  const dateFrom = config.dateFrom ? `&from=${config.dateFrom}` : ''
  const dateTo = config.dateTo ? `&to=${config.dateTo}` : ''
  
  const url = `https://newsapi.org/v2/everything?q=${query}&sources=${sources}&apiKey=${apiKey}&sortBy=relevancy&pageSize=${config.maxResults}${dateFrom}${dateTo}`
  
  const response = await fetch(url)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'NewsAPI error')
  }
  
  const data: NewsAPIResponse = await response.json()
  
  return data.articles.map((article, index) => ({
    id: `result-${Date.now()}-${index}`,
    title: article.title,
    url: article.url,
    source: article.source.name,
    publishDate: article.publishedAt,
    snippet: article.description || article.content?.substring(0, 200) || '',
    contentType: determineContentType(article.title, article.description || ''),
    isAnalyzing: false,
    isDuplicate: false
  }))
}

async function searchGoogleNews(config: SearchConfig): Promise<SearchResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_NEWS_API_KEY
  if (!apiKey) throw new Error('Google News API key not configured')
  
  const query = encodeURIComponent(config.query)
  const dateFrom = config.dateFrom ? `&from=${config.dateFrom}` : ''
  const dateTo = config.dateTo ? `&to=${config.dateTo}` : ''
  
  const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&sortBy=relevancy&pageSize=${config.maxResults}${dateFrom}${dateTo}`
  
  const response = await fetch(url)
  if (!response.ok) throw new Error('Google News API error')
  
  const data: NewsAPIResponse = await response.json()
  
  return data.articles.map((article, index) => ({
    id: `result-${Date.now()}-${index}`,
    title: article.title,
    url: article.url,
    source: article.source.name,
    publishDate: article.publishedAt,
    snippet: article.description || article.content?.substring(0, 200) || '',
    contentType: determineContentType(article.title, article.description || ''),
    isAnalyzing: false,
    isDuplicate: false
  }))
}

async function searchRSSFeeds(config: SearchConfig): Promise<SearchResult[]> {
  // Fallback: Search RSS feeds from major music publications
  // This would require an RSS parser library
  console.warn('RSS feed search not yet implemented - using mock data')
  return []
}

function determineContentType(title: string, description: string): ContentType {
  const lowerTitle = title.toLowerCase()
  const lowerDesc = description.toLowerCase()
  
  if (lowerTitle.includes('review') || lowerDesc.includes('review')) return 'review'
  if (lowerTitle.includes('interview') || lowerTitle.includes('talks to') || lowerTitle.includes('in conversation')) return 'interview'
  if (lowerTitle.includes('announces') || lowerTitle.includes('releases') || lowerTitle.includes('breaking')) return 'news'
  if (lowerTitle.includes('feature') || lowerTitle.includes('deep dive')) return 'feature'
  return 'article'
}

