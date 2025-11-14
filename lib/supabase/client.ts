import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured } from '../env'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Return cached instance if available
  if (clientInstance) {
    return clientInstance
  }

  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      const error = new Error(
        'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
      )
      console.error('Supabase configuration error:', error.message)
      throw error
    }

    const url = getSupabaseUrl()
    const key = getSupabaseAnonKey()

    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Invalid Supabase URL format. Must start with http:// or https://')
    }

    // Validate key format (JWT tokens are long strings)
    if (key.length < 50) {
      throw new Error('Invalid Supabase anon key format. Key appears to be too short.')
    }

    clientInstance = createBrowserClient(url, key)
    return clientInstance
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to initialize Supabase client. Please check your configuration.')
  }
}
