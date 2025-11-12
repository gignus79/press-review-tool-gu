import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchId } = await request.json()

    if (!searchId) {
      return NextResponse.json({ error: 'Search ID required' }, { status: 400 })
    }

    // Generate unique share token
    const shareToken = randomBytes(16).toString('hex')

    // Update search to make it shareable
    const { data, error } = await supabase
      .from('search_history')
      .update({
        shared: true,
        share_token: shareToken
      })
      .eq('id', searchId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shared/${shareToken}`

    return NextResponse.json({
      shareToken,
      shareUrl
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create share link' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const searchId = searchParams.get('id')

    if (!searchId) {
      return NextResponse.json({ error: 'Search ID required' }, { status: 400 })
    }

    // Remove share access
    const { error } = await supabase
      .from('search_history')
      .update({
        shared: false,
        share_token: null
      })
      .eq('id', searchId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to remove share link' },
      { status: 500 }
    )
  }
}
