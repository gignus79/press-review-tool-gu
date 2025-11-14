import type { SearchResult, AnalysisResult, ContentType, Sentiment, SearchConfig } from '../types/database'
import { performRealSearch } from '../services/search-api'

export async function performSearch(
  config: SearchConfig
): Promise<SearchResult[]> {
  // Try real API first, fallback to mock
  try {
    if (process.env.BING_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_NEWS_API_KEY) {
      const results = await performRealSearch(config)
      if (results.length > 0) {
        return results
      }
    }
  } catch (error) {
    console.warn('Real API failed, using mock data:', error)
  }
  
  // Fallback to mock data
  return await performMockSearch(config)
}

async function performMockSearch(config: SearchConfig): Promise<SearchResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const sources = ['Pitchfork', 'Rolling Stone', 'NME', 'The Guardian', 'Stereogum', 'Consequence', 'Brooklyn Vegan', 'DIY Magazine']
  const contentTypes: ContentType[] = ['article', 'review', 'interview', 'news', 'feature']
  
  const results: SearchResult[] = []
  const count = Math.min(config.maxResults, Math.floor(Math.random() * 15) + 10)
  
  for (let i = 0; i < count; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)]
    const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)]
    const daysAgo = Math.floor(Math.random() * 60)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    
    results.push({
      id: `result-${Date.now()}-${i}`,
      title: generateTitle(config.query, contentType),
      url: `https://example.com/article-${i}`,
      source,
      publishDate: date.toISOString(),
      snippet: generateSnippet(config.query),
      contentType,
      isAnalyzing: false,
      isDuplicate: false
    })
  }
  
  return results
}

export async function analyzeResult(result: SearchResult): Promise<AnalysisResult> {
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000))
  
  const sentiments: Sentiment[] = ['positive', 'neutral', 'negative', 'mixed']
  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)]
  
  const themeOptions = [
    'sonic evolution', 'production quality', 'lyrical depth', 
    'genre-bending', 'vocal performance', 'instrumentation',
    'commercial appeal', 'artistic growth', 'cultural impact',
    'live performance', 'collaboration', 'innovation'
  ]
  
  const themes = Array.from(
    { length: Math.floor(Math.random() * 3) + 2 },
    () => themeOptions[Math.floor(Math.random() * themeOptions.length)]
  ).filter((v, i, a) => a.indexOf(v) === i)
  
  return {
    sentiment,
    relevanceScore: Math.floor(Math.random() * 30) + 70,
    authority: Math.floor(Math.random() * 40) + 60,
    themes,
    summary: generateSummary(sentiment)
  }
}

function generateTitle(query: string, contentType: ContentType): string {
  const templates = {
    review: [
      `${query} Album Review: A Bold New Direction`,
      `${query} - [Album Title] Review`,
      `Review: ${query} Returns With Ambitious New Work`,
      `${query}'s Latest: A Track-by-Track Review`
    ],
    interview: [
      `${query} Talks New Album and Creative Process`,
      `In Conversation: ${query}`,
      `${query} Opens Up About Their Musical Journey`,
      `Interview: ${query} on Innovation and Inspiration`
    ],
    article: [
      `${query}: The Artist Redefining Modern Music`,
      `How ${query} Changed the Game`,
      `${query}'s Impact on Contemporary Sound`,
      `The Evolution of ${query}: A Deep Dive`
    ],
    news: [
      `${query} Announces New Album Release`,
      `${query} Wins Major Industry Award`,
      `${query} to Headline Festival`,
      `Breaking: ${query} Signs Major Deal`
    ],
    feature: [
      `${query}: A Rising Star's Story`,
      `The Genius of ${query}`,
      `${query} and the Future of Music`,
      `Why ${query} Matters Now More Than Ever`
    ],
    all: []
  }
  
  const options = templates[contentType] || templates.article
  return options[Math.floor(Math.random() * options.length)]
}

function generateSnippet(query: string): string {
  const snippets = [
    `An in-depth look at ${query}'s latest work reveals a fascinating blend of influences and innovation. The production showcases remarkable attention to detail...`,
    `${query} continues to push boundaries with their unique approach to songwriting and performance. Critics are calling this their most mature work yet...`,
    `What sets ${query} apart is their unwavering commitment to authenticity. This latest release demonstrates both technical prowess and emotional depth...`,
    `${query}'s evolution as an artist has been remarkable to witness. The new material represents a significant departure from earlier work while maintaining...`,
    `With this release, ${query} solidifies their position as one of the most important voices in contemporary music. The critical response has been overwhelmingly...`
  ]
  
  return snippets[Math.floor(Math.random() * snippets.length)]
}

function generateSummary(sentiment: Sentiment): string {
  const summaries = {
    positive: 'Highly favorable coverage emphasizing artistic merit and innovation. Strong recommendation from the publication.',
    negative: 'Critical assessment pointing out weaknesses in execution and artistic direction. Mixed reception noted.',
    neutral: 'Balanced coverage presenting both strengths and areas for improvement. Objective analysis provided.',
    mixed: 'Divided opinions with notable praise for certain aspects while critiquing others. Complex reception.'
  }
  
  return summaries[sentiment]
}
