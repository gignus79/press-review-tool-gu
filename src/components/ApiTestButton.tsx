'use client'
import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog'
import { Badge } from '@/src/components/ui/badge'
import { CheckCircle, XCircle, Loader, AlertCircle } from '@phosphor-icons/react'

interface ApiTestResult {
  name: string
  status: 'success' | 'failed' | 'error' | 'skipped' | 'configured'
  statusCode?: number
  message: string
  details?: any
  error?: string
}

export function ApiTestButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ApiTestResult[]>([])

  const testApis = async () => {
    setLoading(true)
    setResults([])
    
    try {
      const response = await fetch('/api/search/test')
      if (!response.ok) {
        throw new Error('Test failed')
      }
      
      const data = await response.json()
      setResults(data.tests || [])
    } catch (error: any) {
      setResults([{
        name: 'Test Request',
        status: 'error',
        message: error.message || 'Failed to run tests',
        error: error.toString()
      }])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={16} className="text-success" weight="fill" />
      case 'failed':
      case 'error':
        return <XCircle size={16} className="text-destructive" weight="fill" />
      case 'skipped':
        return <AlertCircle size={16} className="text-muted-foreground" weight="fill" />
      default:
        return <Loader size={16} className="animate-spin text-primary" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-success text-success-foreground">Success</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'skipped':
        return <Badge variant="secondary">Skipped</Badge>
      case 'configured':
        return <Badge className="bg-primary text-primary-foreground">Configured</Badge>
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={testApis}>
          Test APIs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>API Configuration Test</DialogTitle>
          <DialogDescription>
            Test all configured search APIs to verify they are working correctly
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader size={24} className="animate-spin text-primary" />
              <span className="ml-2">Testing APIs...</span>
            </div>
          )}
          
          {!loading && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Click "Test APIs" to run tests
            </div>
          )}
          
          {!loading && results.length > 0 && (
            <div className="space-y-3">
              {results.map((test, index) => (
                <div
                  key={index}
                  className="p-4 border border-border rounded-lg bg-card"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      {getStatusIcon(test.status)}
                      <span className="font-medium">{test.name}</span>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {test.message}
                  </p>
                  
                  {test.statusCode && (
                    <p className="text-xs text-muted-foreground">
                      Status Code: {test.statusCode}
                    </p>
                  )}
                  
                  {test.details && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {test.error && (
                    <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                      {test.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={testApis} disabled={loading}>
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                'Test Again'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

