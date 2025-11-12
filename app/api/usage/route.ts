import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: limits, error } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    // Check if we need to reset monthly limits
    const lastReset = new Date(limits.last_reset)
    const now = new Date()
    
    if (
      lastReset.getMonth() !== now.getMonth() ||
      lastReset.getFullYear() !== now.getFullYear()
    ) {
      // Reset limits for new month
      const { data: updatedLimits } = await supabase
        .from('usage_limits')
        .update({
          searches_this_month: 0,
          exports_this_month: 0,
          last_reset: now.toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single()

      return NextResponse.json({ limits: updatedLimits })
    }

    return NextResponse.json({ limits })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch usage limits' },
      { status: 500 }
    )
  }
}
