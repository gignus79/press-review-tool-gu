import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeResult } from '@/lib/utils/mock-search'
import type { SearchResult } from '@/lib/types/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { result }: { result: SearchResult } = await request.json()

    // Perform AI analysis
    const analysis = await analyzeResult(result)

    return NextResponse.json({ analysis })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}
