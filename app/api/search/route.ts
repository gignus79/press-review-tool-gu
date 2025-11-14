import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { performSearch, analyzeResult } from '@/lib/utils/mock-search'
import type { SearchConfig } from '@/lib/types/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const config: SearchConfig = await request.json()

    // Check usage limits
    const { data: limits } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (limits && limits.searches_this_month >= limits.max_searches) {
      return NextResponse.json(
        { error: 'Search limit reached', limit: limits.max_searches },
        { status: 429 }
      )
    }

    // Perform search
    const results = await performSearch(config)

    // Update usage limits
    if (limits) {
      await supabase
        .from('usage_limits')
        .update({ searches_this_month: limits.searches_this_month + 1 })
        .eq('user_id', user.id)
    }

    // Save to history
    const { data: savedSearch } = await supabase
      .from('search_history')
      .insert({
        user_id: user.id,
        query: config.query,
        config: config,
        result_count: results.length,
        results: results
      })
      .select()
      .single()

    return NextResponse.json({
      results,
      searchId: savedSearch?.id
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    )
  }
}
