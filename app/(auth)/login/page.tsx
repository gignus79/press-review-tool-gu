'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Newspaper } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { ConfigError } from '@/src/components/ConfigError'
import { isSupabaseConfigured } from '@/lib/env'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [configError, setConfigError] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setConfigError(true)
      return
    }
    
    try {
      createClient()
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      setConfigError(true)
    }

    // Check for error messages from URL params (e.g., from email verification)
    const params = new URLSearchParams(window.location.search)
    const error = params.get('error')
    const message = params.get('message')
    const errorCode = params.get('error_code')

    if (error && message) {
      let errorMessage = decodeURIComponent(message)
      
      // Handle specific error codes
      if (errorCode === 'otp_expired') {
        errorMessage = 'The email verification link has expired. Please request a new verification email or sign up again.'
      } else if (errorCode === 'access_denied') {
        errorMessage = 'Email verification failed. The link may be invalid or expired.'
      }
      
      toast.error('Verification Error', {
        description: errorMessage,
        duration: 10000, // Show for 10 seconds
      })

      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])
  
  if (configError) {
    return <ConfigError />
  }
  
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }
    
    if (!password.trim()) {
      toast.error('Password is required')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        // Handle specific Supabase errors
        let errorMessage = 'Login failed. Please check your credentials.'
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please verify your email address before signing in.'
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please try again later.'
        } else {
          errorMessage = error.message || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      if (!data.user) {
        throw new Error('Login failed. No user data received.')
      }

      toast.success('Login successful!', {
        description: 'Redirecting to dashboard...'
      })
      
      // Small delay to show success message
      await new Promise(resolve => setTimeout(resolve, 500))
      
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto mb-2 p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground w-fit shadow-md">
            <Newspaper size={40} weight="fill" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Press Review</CardTitle>
          <CardDescription className="text-base">
            Sign in to access AI-powered music press analysis
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t have an account?{' '}
              <Link 
                href="/signup" 
                className="text-primary hover:underline font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
