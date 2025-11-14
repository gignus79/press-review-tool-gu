import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const testResults: any = {
      timestamp: new Date().toISOString(),
      tests: []
    }

    // Test 1: Bing API
    if (process.env.BING_API_KEY) {
      try {
        const endpoint = process.env.BING_ENDPOINT || 'https://api.bing.microsoft.com'
        const apiKey = process.env.BING_API_KEY
        const testEndpoint = endpoint.includes('/v7.0/search') 
          ? endpoint 
          : `${endpoint.replace(/\/$/, '')}/v7.0/search`
        
        const testUrl = `${testEndpoint}?q=${encodeURIComponent('test music')}&count=1`
        
        const response = await fetch(testUrl, {
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
          },
        })

        testResults.tests.push({
          name: 'Bing Search API',
          status: response.ok ? 'success' : 'failed',
          statusCode: response.status,
          message: response.ok 
            ? 'Bing API is working correctly' 
            : `Bing API error: ${response.status}`,
          details: response.ok ? await response.json().then(d => ({ resultCount: d.webPages?.value?.length || 0 })) : await response.text()
        })
      } catch (error: any) {
        testResults.tests.push({
          name: 'Bing Search API',
          status: 'error',
          message: error.message || 'Bing API test failed',
          error: error.toString()
        })
      }
    } else {
      testResults.tests.push({
        name: 'Bing Search API',
        status: 'skipped',
        message: 'BING_API_KEY not configured'
      })
    }

    // Test 2: NewsAPI
    if (process.env.NEXT_PUBLIC_NEWS_API_KEY) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY
        const url = `https://newsapi.org/v2/everything?q=test&apiKey=${apiKey}&pageSize=1`
        
        const response = await fetch(url)
        
        testResults.tests.push({
          name: 'NewsAPI.org',
          status: response.ok ? 'success' : 'failed',
          statusCode: response.status,
          message: response.ok 
            ? 'NewsAPI is working correctly' 
            : `NewsAPI error: ${response.status}`,
          details: response.ok ? await response.json().then(d => ({ resultCount: d.articles?.length || 0 })) : await response.text()
        })
      } catch (error: any) {
        testResults.tests.push({
          name: 'NewsAPI.org',
          status: 'error',
          message: error.message || 'NewsAPI test failed',
          error: error.toString()
        })
      }
    } else {
      testResults.tests.push({
        name: 'NewsAPI.org',
        status: 'skipped',
        message: 'NEXT_PUBLIC_NEWS_API_KEY not configured'
      })
    }

    // Test 3: OpenAI (if configured)
    if (process.env.OPENAI_API_KEY) {
      testResults.tests.push({
        name: 'OpenAI API',
        status: 'configured',
        message: 'OpenAI API key is configured (web search capability available)'
      })
    } else {
      testResults.tests.push({
        name: 'OpenAI API',
        status: 'skipped',
        message: 'OPENAI_API_KEY not configured'
      })
    }

    return NextResponse.json(testResults)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Test failed' },
      { status: 500 }
    )
  }
}

