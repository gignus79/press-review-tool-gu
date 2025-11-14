import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseUrl, getSupabaseAnonKey } from '../env'

export function createClient() {
  try {
    const url = getSupabaseUrl()
    const key = getSupabaseAnonKey()
    return createBrowserClient(url, key)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }
}
