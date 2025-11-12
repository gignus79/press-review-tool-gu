import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Newspaper, Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from '@/hooks/use-theme'
import { toast } from 'sonner'

interface LoginPageProps {
  onLogin: (email: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error('Invalid email', {
        description: 'Please enter a valid email address'
      })
      return
    }

    onLogin(email)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 rounded-full"
        onClick={toggleTheme}
      >
        {theme === 'light' ? (
          <Moon size={20} weight="fill" />
        ) : (
          <Sun size={20} weight="fill" />
        )}
      </Button>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
            <Newspaper size={32} weight="fill" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Press Review Tool</CardTitle>
            <CardDescription className="text-base mt-2">
              AI-Powered Music Press Analysis
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-base"
                autoComplete="email"
                autoFocus
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our terms of service and privacy policy
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
