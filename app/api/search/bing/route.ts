import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SearchResult, SearchConfig, ContentType } from '@/lib/types/database'

interface BingSearchResponse {
  webPages: {
    value: Array<{
      name: string
      url: string
      snippet: string
      datePublished?: string
      displayUrl: string
    }>
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const config: SearchConfig = await request.json()

    const apiKey = process.env.BING_API_KEY
    let endpoint = process.env.BING_ENDPOINT || 'https://api.bing.microsoft.com'
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Bing API key not configured' }, { status: 500 })
    }
    
    // Ensure endpoint has the correct path for v7 API
    if (!endpoint.includes('/v7.0/search')) {
      endpoint = endpoint.replace(/\/$/, '') // Remove trailing slash
      endpoint = `${endpoint}/v7.0/search`
    }
    
    // Build query with music-related terms
    const query = encodeURIComponent(`${config.query} music press review article`)
    
    // Build date filter if provided
    let freshness = ''
    if (config.dateFrom || config.dateTo) {
      // Bing supports: Day, Week, Month
      // For simplicity, we'll use Month if date range is provided
      freshness = '&freshness=Month'
    }
    
    const url = `${endpoint}?q=${query}&count=${config.maxResults}&responseFilter=WebPages${freshness}`
    
    const response = await fetch(url, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
      },
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('Bing API error:', error)
      return NextResponse.json(
        { error: `Bing API error: ${response.status}` },
        { status: response.status }
      )
    }
    
    const data: BingSearchResponse = await response.json()
    
    if (!data.webPages || !data.webPages.value) {
      return NextResponse.json({ results: [] })
    }
    
    const results: SearchResult[] = data.webPages.value.map((item, index) => {
      // Extract source from URL (e.g., "pitchfork" from "https://pitchfork.com/reviews/...")
      let source = 'Unknown'
      try {
        const urlObj = new URL(item.url)
        const hostname = urlObj.hostname.replace('www.', '')
        // Extract domain name (e.g., "pitchfork" from "pitchfork.com")
        const domainParts = hostname.split('.')
        if (domainParts.length > 0) {
          source = domainParts[0]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        }
      } catch (e) {
        // If URL parsing fails, use displayUrl
        source = item.displayUrl.split('/')[0] || 'Unknown'
      }
      
      // Parse date if available
      let publishDate = new Date().toISOString()
      if (item.datePublished) {
        publishDate = new Date(item.datePublished).toISOString()
      }
      
      return {
        id: `result-${Date.now()}-${index}`,
        title: item.name,
        url: item.url,
        source: source,
        publishDate: publishDate,
        snippet: item.snippet || '',
        contentType: determineContentType(item.name, item.snippet),
        isAnalyzing: false,
        isDuplicate: false
      }
    })
    
    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('Bing search error:', error)
    return NextResponse.json(
      { error: error.message || 'Bing search failed' },
      { status: 500 }
    )
  }
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

