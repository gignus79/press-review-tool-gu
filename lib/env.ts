/**
 * Environment variable validation
 * Validates required environment variables at runtime
 */

export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file or Vercel environment variables'
    )
  }
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && url.trim() !== '' && key.trim() !== '')
}

/**
 * Get validated Supabase URL
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!url) {
    if (typeof window !== 'undefined') {
      // Client-side: show user-friendly error
      console.error('NEXT_PUBLIC_SUPABASE_URL is not configured. Please check your environment variables.')
    }
    // During build, return empty string to allow build to complete
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      return ''
    }
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set. Please configure it in your environment variables.')
  }
  return url
}

/**
 * Get validated Supabase anon key
 */
export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!key) {
    if (typeof window !== 'undefined') {
      // Client-side: show user-friendly error
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured. Please check your environment variables.')
    }
    // During build, return empty string to allow build to complete
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      return ''
    }
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please configure it in your environment variables.')
  }
  return key
}

