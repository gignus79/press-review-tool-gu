# Migration Guide: Vite/React to Next.js 14

This document explains the changes made to migrate the Press Review application from Vite/React to Next.js 14 with Supabase.

## Key Changes

### 1. Framework Migration

**Before (Vite/React):**
- Client-side only application
- React Router for routing
- Local storage for data persistence
- Mock authentication

**After (Next.js 14):**
- Server and client components
- App Router (file-based routing)
- Supabase for data persistence
- Real authentication with Supabase Auth

### 2. Project Structure

**Old Structure:**
```
src/
├── App.tsx          # Main app component
├── components/      # All components
├── lib/            # Types and utilities
└── main.tsx        # Entry point
```

**New Structure:**
```
app/                # Next.js App Router
├── (auth)/         # Auth routes group
├── api/            # API routes
├── dashboard/      # Dashboard page
└── shared/         # Shared search pages

lib/                # Shared libraries
├── supabase/       # Supabase config
├── types/          # TypeScript types
└── utils/          # Utility functions

src/                # UI components (kept)
├── components/     # React components
└── hooks/          # Custom hooks
```

### 3. Authentication

**Before:**
```tsx
// Local storage based
const [userEmail, setUserEmail] = useKV<string | null>('user-email', null)
```

**After:**
```tsx
// Supabase Auth
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
```

### 4. Data Persistence

**Before:**
```tsx
// Local storage with @github/spark hooks
const [searchHistory, setSearchHistory] = useKV<SearchHistory[]>('search-history', [])
```

**After:**
```tsx
// Supabase database
const { data } = await supabase
  .from('search_history')
  .select('*')
  .eq('user_id', user.id)
```

### 5. API Routes

**Before:**
- All logic in client components
- Mock data functions imported directly

**After:**
- Dedicated API routes in `app/api/`
- Server-side processing
- Protected by authentication middleware

### 6. Component Updates

Most components remain similar, but with these changes:

#### Server Components
- Can fetch data directly
- Use `async/await` with Supabase
- No client-side state needed for initial data

#### Client Components
- Use `'use client'` directive
- Call API routes for data mutations
- Use Supabase client for real-time features

### 7. Environment Variables

**Before:**
```
# No external services
```

**After:**
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 8. Routing

**Before:**
```tsx
// Manual routing in App.tsx
if (!userEmail) {
  return <LoginPage onLogin={setUserEmail} />
}
```

**After:**
```tsx
// File-based routing
app/
├── (auth)/login/page.tsx
├── (auth)/signup/page.tsx
└── dashboard/page.tsx

// Protected by middleware.ts
```

### 9. Theme Management

**Before:**
- Used local storage hooks
- Applied in client only

**After:**
- Still uses local storage
- Works with Next.js themes
- Hydration-safe implementation

### 10. Export Functionality

**Before:**
```tsx
// Client-side only
const jsonData = JSON.stringify(results)
downloadFile(jsonData, 'export.json', 'application/json')
```

**After:**
```tsx
// Client-side with usage tracking
import { exportResults } from '@/lib/utils/export'
exportResults(data, 'json')
// Updates usage limits in database
```

## New Features

### 1. Real Authentication
- Email/password signup and login
- Session management
- Password reset capability
- Protected routes

### 2. Data Persistence
- Search history saved to database
- Results persist across devices
- User profiles

### 3. Usage Limits
- Track searches per month
- Track exports per month
- Auto-reset monthly
- Enforced via API

### 4. Sharing
- Generate public share links
- Token-based access
- Revocable shares
- View-only mode

### 5. API Integration Points
Ready for integration with:
- Real music press APIs
- OpenAI for sentiment analysis
- Third-party export services

## Database Schema

New tables created:

1. **profiles**: User profiles linked to auth.users
2. **search_history**: All searches with full results
3. **usage_limits**: Monthly quotas per user

All with Row Level Security (RLS) policies.

## Migration Checklist

If migrating from the Vite version:

- [ ] Set up Supabase project
- [ ] Run database migrations
- [ ] Configure environment variables
- [ ] Update authentication flow
- [ ] Test all features
- [ ] Migrate any user data (if applicable)
- [ ] Update deployment configuration
- [ ] Test in production environment

## Breaking Changes

1. **No local storage for searches**: All data now in Supabase
2. **Authentication required**: No guest mode
3. **Usage limits**: Enforced monthly quotas
4. **Component paths**: Some imports changed (use `@/` prefix)

## Backwards Compatibility

The following remain compatible:

- All UI components in `src/components/`
- Theme system and colors
- Export format logic
- Search result types

## Testing

Test these critical paths:

1. **Authentication Flow**
   - [ ] Sign up new user
   - [ ] Log in existing user
   - [ ] Log out
   - [ ] Protected route access

2. **Search Functionality**
   - [ ] Perform search
   - [ ] View results
   - [ ] Filter results
   - [ ] Export results

3. **History & Sharing**
   - [ ] Save search to history
   - [ ] Load from history
   - [ ] Create share link
   - [ ] Access shared search
   - [ ] Revoke share

4. **Usage Limits**
   - [ ] Track searches
   - [ ] Track exports
   - [ ] Enforce limits
   - [ ] Monthly reset

## Common Issues

### Issue: Hydration Errors
**Solution**: Ensure theme loading doesn't cause mismatch between server and client HTML.

### Issue: Auth Not Persisting
**Solution**: Check middleware.ts is properly configured and cookies are enabled.

### Issue: API Routes 401
**Solution**: Verify Supabase credentials and that user session is valid.

### Issue: Build Errors
**Solution**: Use `--legacy-peer-deps` flag with npm install.

## Performance Improvements

Next.js 14 provides:
- Server-side rendering for faster initial loads
- Automatic code splitting
- Image optimization
- Static generation where possible
- Better caching strategies

## Future Enhancements

Consider adding:
- Real-time collaboration
- Advanced analytics
- Custom AI model training
- Bulk operations
- Team accounts
- API webhooks

## Support

For migration assistance:
1. Review this guide thoroughly
2. Check the NEXTJS_README.md
3. Examine the code comments
4. Test in development first
5. Create GitHub issues for problems

---

Migration completed on 2025-11-12
