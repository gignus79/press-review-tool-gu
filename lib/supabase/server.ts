import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseUrl, getSupabaseAnonKey } from '../env'

export async function createClient() {
  const cookieStore = await cookies()

  try {
    const url = getSupabaseUrl()
    const key = getSupabaseAnonKey()
    
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
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }
}
