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
      'Please check your .env.local file'
    )
  }
}

/**
 * Get validated Supabase URL
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    // During build, return empty string to allow build to complete
    // Runtime errors will be caught by the client/server code
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      return ''
    }
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  return url
}

/**
 * Get validated Supabase anon key
 */
export function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    // During build, return empty string to allow build to complete
    // Runtime errors will be caught by the client/server code
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      return ''
    }
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  }
  return key
}

