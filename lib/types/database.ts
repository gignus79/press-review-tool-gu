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
  user_id: string
  timestamp: string
  config: SearchConfig
  resultCount: number
  results?: SearchResult[]
  shared?: boolean
  shareToken?: string
}

export type ExportFormat = 'pdf' | 'csv' | 'json'

export interface ExportOptions {
  format: ExportFormat
  selectedOnly: boolean
  includeAnalysis: boolean
}

export interface UsageLimits {
  id: string
  user_id: string
  searchesThisMonth: number
  exportsThisMonth: number
  lastReset: string
  maxSearches: number
  maxExports: number
}

// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          query: string
          config: SearchConfig
          result_count: number
          results: SearchResult[]
          shared: boolean
          share_token: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          query: string
          config: SearchConfig
          result_count: number
          results: SearchResult[]
          shared?: boolean
          share_token?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          query?: string
          config?: SearchConfig
          result_count?: number
          results?: SearchResult[]
          shared?: boolean
          share_token?: string | null
          created_at?: string
        }
      }
      usage_limits: {
        Row: {
          id: string
          user_id: string
          searches_this_month: number
          exports_this_month: number
          last_reset: string
          max_searches: number
          max_exports: number
        }
        Insert: {
          id?: string
          user_id: string
          searches_this_month?: number
          exports_this_month?: number
          last_reset?: string
          max_searches?: number
          max_exports?: number
        }
        Update: {
          id?: string
          user_id?: string
          searches_this_month?: number
          exports_this_month?: number
          last_reset?: string
          max_searches?: number
          max_exports?: number
        }
      }
    }
  }
}
