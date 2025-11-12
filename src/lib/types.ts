export type ContentType = 'article' | 'review' | 'interview' | 'news' | 'feature' | 'all'

export type Sentiment = 'positive' | 'neutral' | 'negative' | 'mixed'

export interface SearchConfig {
  query: string
  dateFrom?: string
  dateTo?: string
  sources?: string[]
  contentTypes: ContentType[]
  maxResults: number
}

export interface AnalysisResult {
  sentiment: Sentiment
  relevanceScore: number
  authority: number
  themes: string[]
  summary: string
}

export interface SearchResult {
  id: string
  title: string
  url: string
  source: string
  publishDate: string
  snippet: string
  contentType: ContentType
  analysis?: AnalysisResult
  isAnalyzing?: boolean
  isDuplicate?: boolean
}

export interface SearchHistory {
  id: string
  timestamp: string
  config: SearchConfig
  resultCount: number
  results?: SearchResult[]
}

export type ExportFormat = 'pdf' | 'excel' | 'json'

export interface ExportOptions {
  format: ExportFormat
  selectedOnly: boolean
  includeAnalysis: boolean
}
