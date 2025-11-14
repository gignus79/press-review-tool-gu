import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const errorCode = requestUrl.searchParams.get('error_code')

  // Handle errors from Supabase (e.g., expired link)
  if (error) {
    const errorMessage = errorDescription 
      ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
      : 'An error occurred during email verification'
    
    // Redirect to login with error message
    const loginUrl = new URL('/login', requestUrl.origin)
    loginUrl.searchParams.set('error', error)
    loginUrl.searchParams.set('message', errorMessage)
    if (errorCode) {
      loginUrl.searchParams.set('error_code', errorCode)
    }
    return redirect(loginUrl.toString())
  }

  // Handle successful email confirmation
  if (code) {
    try {
      const supabase = await createClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        const loginUrl = new URL('/login', requestUrl.origin)
        loginUrl.searchParams.set('error', 'verification_failed')
        loginUrl.searchParams.set('message', exchangeError.message || 'Failed to verify email')
        return redirect(loginUrl.toString())
      }

      // Success! Redirect to dashboard
      return redirect('/dashboard')
    } catch (error: any) {
      console.error('Unexpected error during email verification:', error)
      const loginUrl = new URL('/login', requestUrl.origin)
      loginUrl.searchParams.set('error', 'verification_failed')
      loginUrl.searchParams.set('message', error.message || 'An unexpected error occurred')
      return redirect(loginUrl.toString())
    }
  }

  // No code or error, redirect to login
  return redirect('/login')
}

