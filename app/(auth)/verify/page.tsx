'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { WarningCircle, CheckCircle, Envelope } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { ConfigError } from '@/src/components/ConfigError'
import { isSupabaseConfigured } from '@/lib/env'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')
  const [configError, setConfigError] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setConfigError(true)
      return
    }

    try {
      const supabase = createClient()
      
      // Check for error parameters
      const error = searchParams.get('error')
      const errorCode = searchParams.get('error_code')
      const errorDescription = searchParams.get('error_description')

      if (error) {
        if (errorCode === 'otp_expired' || errorCode === 'access_denied') {
          setStatus('expired')
          setMessage(
            errorDescription 
              ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
              : 'The email verification link has expired or is invalid.'
          )
        } else {
          setStatus('error')
          setMessage(
            errorDescription 
              ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
              : 'An error occurred during email verification.'
          )
        }
        return
      }

      // Check for code parameter (successful verification)
      const code = searchParams.get('code')
      if (code) {
        // Exchange code for session
        supabase.auth.exchangeCodeForSession(code)
          .then(({ data, error }) => {
            if (error) {
              setStatus('error')
              setMessage(error.message || 'Failed to verify email address.')
            } else {
              setStatus('success')
              setMessage('Email verified successfully! Redirecting to dashboard...')
              
              // Get user email for display
              if (data.user?.email) {
                setEmail(data.user.email)
              }
              
              // Redirect after 2 seconds
              setTimeout(() => {
                router.push('/dashboard')
                router.refresh()
              }, 2000)
            }
          })
          .catch((error) => {
            console.error('Verification error:', error)
            setStatus('error')
            setMessage('An unexpected error occurred during verification.')
          })
      } else {
        // No code or error, show instructions
        setStatus('error')
        setMessage('No verification code found. Please check your email for the verification link.')
      }
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      setConfigError(true)
    }
  }, [searchParams, router])

  if (configError) {
    return <ConfigError />
  }

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Email not found', {
        description: 'Please sign up again to receive a new verification email.'
      })
      router.push('/signup')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error('Failed to resend email', {
          description: error.message || 'Please try again later.'
        })
      } else {
        toast.success('Verification email sent!', {
          description: 'Please check your inbox and click the verification link.'
        })
      }
    } catch (error: any) {
      console.error('Resend error:', error)
      toast.error('Failed to resend email', {
        description: 'Please try signing up again.'
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardHeader className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <div className="mx-auto mb-2 p-4 rounded-2xl bg-primary/10 text-primary w-fit">
                <Envelope size={40} weight="fill" className="animate-pulse" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">Verifying Email</CardTitle>
              <CardDescription className="text-base">
                Please wait while we verify your email address...
              </CardDescription>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="mx-auto mb-2 p-4 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 w-fit">
                <CheckCircle size={40} weight="fill" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-400">
                Email Verified!
              </CardTitle>
              <CardDescription className="text-base">
                {message}
              </CardDescription>
            </>
          )}
          
          {(status === 'error' || status === 'expired') && (
            <>
              <div className="mx-auto mb-2 p-4 rounded-2xl bg-destructive/10 text-destructive w-fit">
                <WarningCircle size={40} weight="fill" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-destructive">
                Verification Failed
              </CardTitle>
              <CardDescription className="text-base">
                {message}
              </CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === 'expired' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Email verification links expire after a certain time for security reasons.
              </p>
              <div className="flex flex-col gap-2">
                <Button onClick={handleResendEmail} className="w-full">
                  Resend Verification Email
                </Button>
                <Button variant="outline" onClick={() => router.push('/signup')} className="w-full">
                  Sign Up Again
                </Button>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you continue to experience issues, please try signing up again or contact support.
              </p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => router.push('/signup')} className="w-full">
                  Go to Sign Up
                </Button>
                <Button variant="outline" onClick={() => router.push('/login')} className="w-full">
                  Go to Login
                </Button>
              </div>
            </div>
          )}
          
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

