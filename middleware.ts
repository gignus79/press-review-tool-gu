import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run middleware on API routes and auth pages to avoid Edge Runtime issues
     */
    '/api/(.*)',
    '/(auth|dashboard|shared)/(.*)',
  ],
}
