# Quick Fixes Guide

This document provides step-by-step instructions to fix the critical and high-priority issues identified in the analysis.

## 🔴 Critical Fixes (Do First)

### 1. Consolidate Type Definitions

**Problem**: Two type definition locations causing confusion.

**Solution**:
1. Check which files use `@/src/lib/types`:
   ```bash
   grep -r "@/src/lib/types" src/
   ```

2. Update all imports in `src/components/SearchDialog.tsx`:
   ```typescript
   // Change from:
   import type { SearchConfig, ContentType } from '@/src/lib/types'
   
   // To:
   import type { SearchConfig, ContentType } from '@/lib/types/database'
   ```

3. Verify `src/lib/types.ts` and `lib/types/database.ts` have compatible types
4. Remove `src/lib/types.ts` if no longer needed

---

### 2. Add Share UI to Dashboard

**Problem**: Share API exists but no UI to use it.

**Solution**: Add share button to search history items in `app/dashboard/page.tsx`:

```typescript
// Add this function
const handleShare = async (searchId: string) => {
  try {
    const response = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchId })
    })
    
    if (!response.ok) throw new Error('Failed to create share link')
    
    const { shareUrl } = await response.json()
    
    // Copy to clipboard
    await navigator.clipboard.writeText(shareUrl)
    toast.success('Share link copied to clipboard!')
  } catch (error) {
    toast.error('Failed to create share link')
  }
}

// Add share button in history item (around line 336):
<div className="flex items-center gap-2 mt-2">
  <Button
    variant="ghost"
    size="sm"
    onClick={(e) => {
      e.stopPropagation()
      handleShare(history.id)
    }}
  >
    <ShareNetwork size={16} />
    Share
  </Button>
</div>
```

Don't forget to import `ShareNetwork` from `@phosphor-icons/react`.

---

### 3. Add Error Handling to Dashboard

**Problem**: Missing error handling in API calls.

**Solution**: Update `handleSearch` function in `app/dashboard/page.tsx`:

```typescript
const handleSearch = async (config: SearchConfig) => {
  setIsSearching(true)
  setCurrentConfig(config)
  setCurrentResults([])
  setSelectedIds(new Set())
  setSentimentFilter('all')
  setContentTypeFilter('all')
  setAnalyzingProgress(0)

  try {
    // Check usage limits with error handling
    const { data: limits, error: limitsError } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (limitsError) {
      console.error('Failed to fetch usage limits:', limitsError)
      toast.error('Failed to check usage limits', {
        description: 'Please try again'
      })
      setIsSearching(false)
      return
    }

    if (limits && limits.searches_this_month >= limits.max_searches) {
      toast.error('Search limit reached', {
        description: `You have reached your monthly search limit of ${limits.max_searches}`
      })
      setIsSearching(false)
      return
    }

    const results = await performSearch(config.query, config.maxResults)
    setCurrentResults(results)
    setIsSearching(false)

    toast.success(`Found ${results.length} results`, {
      description: 'Starting AI analysis...'
    })

    // Update usage limits with error handling
    if (limits) {
      const { error: updateError } = await supabase
        .from('usage_limits')
        .update({ searches_this_month: limits.searches_this_month + 1 })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Failed to update usage limits:', updateError)
        // Don't block the search, just log the error
      }
    }

    analyzeResults(results)

    // Save to history with error handling
    const { data: savedSearch, error: historyError } = await supabase
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

    if (historyError) {
      console.error('Failed to save search history:', historyError)
      toast.warning('Search completed but failed to save to history')
    } else if (savedSearch) {
      setSearchHistory(prev => [savedSearch, ...prev.slice(0, 19)])
    }
  } catch (error: any) {
    console.error('Search failed:', error)
    toast.error('Search failed', {
      description: error.message || 'Please try again with different parameters'
    })
    setIsSearching(false)
  }
}
```

---

### 4. Add Environment Variable Validation

**Problem**: Environment variables not validated at startup.

**Solution**: Create `lib/env.ts`:

```typescript
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file'
    )
  }
}

// Call this in app/layout.tsx or middleware
```

Update `lib/supabase/client.ts`:

```typescript
import { validateEnv } from './env'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient(url, key)
}
```

---

### 5. Fix Type Safety Issues

**Problem**: Using `any` type for user.

**Solution**: Update `app/dashboard/page.tsx`:

```typescript
import type { User } from '@supabase/supabase-js'

// Change line 41 from:
const [user, setUser] = useState<any>(null)

// To:
const [user, setUser] = useState<User | null>(null)
```

---

### 6. Add Usage Limits Display

**Problem**: Users can't see their remaining quota.

**Solution**: Add usage display component in dashboard header:

```typescript
// Add state
const [usageLimits, setUsageLimits] = useState<{
  searches: number
  maxSearches: number
  exports: number
  maxExports: number
} | null>(null)

// Add useEffect to fetch limits
useEffect(() => {
  if (user) {
    fetch('/api/usage')
      .then(res => res.json())
      .then(data => {
        if (data.limits) {
          setUsageLimits({
            searches: data.limits.searches_this_month,
            maxSearches: data.limits.max_searches,
            exports: data.limits.exports_this_month,
            maxExports: data.limits.max_exports
          })
        }
      })
      .catch(console.error)
  }
}, [user])

// Add display in header (around line 298):
{usageLimits && (
  <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
    <span>
      Searches: {usageLimits.searches}/{usageLimits.maxSearches}
    </span>
    <span>
      Exports: {usageLimits.exports}/{usageLimits.maxExports}
    </span>
  </div>
)}
```

---

## ⚠️ High Priority Fixes

### 7. Add Input Validation

**Solution**: Create `lib/validations/search.ts`:

```typescript
import { z } from 'zod'

export const searchConfigSchema = z.object({
  query: z.string().min(1, 'Query is required').max(500, 'Query too long'),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  contentTypes: z.array(z.enum(['article', 'review', 'interview', 'news', 'feature', 'all'])),
  maxResults: z.number().min(1).max(200)
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo)
    }
    return true
  },
  { message: 'Start date must be before end date' }
)

export type SearchConfigInput = z.infer<typeof searchConfigSchema>
```

Use in `SearchDialog.tsx`:

```typescript
import { searchConfigSchema } from '@/lib/validations/search'

const handleSubmit = () => {
  if (!query.trim()) return

  const config = {
    query: query.trim(),
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    contentTypes: contentTypes.includes('all') ? ['all'] : contentTypes,
    maxResults: parseInt(maxResults) || 50
  }

  try {
    const validated = searchConfigSchema.parse(config)
    onSearch(validated)
    onOpenChange(false)
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.error('Validation error', {
        description: error.errors[0].message
      })
    }
  }
}
```

---

### 8. Add Search History Delete

**Solution**: Add delete function and button:

```typescript
const handleDeleteHistory = async (searchId: string, e: React.MouseEvent) => {
  e.stopPropagation()
  
  if (!confirm('Are you sure you want to delete this search?')) return

  try {
    const response = await fetch(`/api/history?id=${searchId}`, {
      method: 'DELETE'
    })

    if (!response.ok) throw new Error('Failed to delete')

    setSearchHistory(prev => prev.filter(h => h.id !== searchId))
    toast.success('Search deleted')
  } catch (error) {
    toast.error('Failed to delete search')
  }
}

// Add delete button in history item:
<Button
  variant="ghost"
  size="sm"
  onClick={(e) => handleDeleteHistory(history.id, e)}
>
  <Trash size={16} />
</Button>
```

---

## 📝 Testing Checklist

After applying fixes, test:

- [ ] Type checking passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`
- [ ] Login/signup works
- [ ] Search executes successfully
- [ ] Results display correctly
- [ ] Filters work
- [ ] Export works (all formats)
- [ ] History loads and displays
- [ ] Share link generation works
- [ ] Usage limits display correctly
- [ ] Error messages appear for failures
- [ ] No console errors

---

## 🚀 Next Steps

1. Apply critical fixes (1-6)
2. Test thoroughly
3. Apply high priority fixes (7-8)
4. Review ANALYSIS_REPORT.md for medium/low priority items
5. Set up testing infrastructure
6. Add monitoring/analytics

