'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { WarningCircle } from '@phosphor-icons/react'

export function ConfigError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-lg bg-destructive/10 text-destructive w-fit">
            <WarningCircle size={32} weight="fill" />
          </div>
          <CardTitle className="text-xl font-bold text-destructive">Configuration Error</CardTitle>
          <CardDescription>
            Supabase is not properly configured
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p className="font-medium">Missing environment variables:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li><code className="bg-muted px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code></li>
              <li><code className="bg-muted px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
            </ul>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-medium">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
              <li>Create a <code className="bg-muted px-1 rounded">.env.local</code> file in the project root</li>
              <li>Add your Supabase credentials from your Supabase project settings</li>
              <li>Restart the development server</li>
            </ol>
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              For production deployments (Vercel), add these variables in your project settings under Environment Variables.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

