import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured } from '../env'

export async function createClient() {
  const cookieStore = await cookies()

  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      throw new Error(
        'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
      )
    }

    const url = getSupabaseUrl()
    const key = getSupabaseAnonKey()

    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Invalid Supabase URL format. Must start with http:// or https://')
    }

    // Validate key format
    if (key.length < 50) {
      throw new Error('Invalid Supabase anon key format. Key appears to be too short.')
    }
    
    return createServerClient(
      url,
      key,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('Failed to create Supabase server client:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to initialize Supabase server client. Please check your configuration.')
  }
}
