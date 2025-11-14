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

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
  }, [])
  
  if (configError) {
    return <ConfigError />
  }
  
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address')
      return
    }
    
    if (!password.trim()) {
      toast.error('Password is required')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        // Handle specific Supabase errors
        let errorMessage = 'Signup failed. Please try again.'
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'This email is already registered. Please sign in instead.'
        } else if (error.message.includes('Password')) {
          errorMessage = 'Password does not meet requirements. Please use a stronger password.'
        } else if (error.message.includes('Email')) {
          errorMessage = 'Invalid email address. Please check and try again.'
        } else {
          errorMessage = error.message || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      if (!data.user) {
        throw new Error('Signup failed. No user data received.')
      }

      toast.success('Account created!', {
        description: data.session 
          ? 'Redirecting to dashboard...' 
          : 'Please check your email to verify your account'
      })
      
      // If session exists, user is automatically signed in
      if (data.session) {
        await new Promise(resolve => setTimeout(resolve, 500))
        router.push('/dashboard')
        router.refresh()
      } else {
        // User needs to verify email
        await new Promise(resolve => setTimeout(resolve, 1500))
        router.push('/login')
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error('Signup failed', {
        description: error.message || 'Please try again'
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
          <CardTitle className="text-3xl font-bold tracking-tight">Create Account</CardTitle>
          <CardDescription className="text-base">
            Get started with AI-powered music press analysis
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
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
                minLength={6}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-primary hover:underline font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
