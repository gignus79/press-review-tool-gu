import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Separator } from '@/src/components/ui/separator'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { DateRangeFilters, getDateRangeFromPreset, type DateRangePreset } from '@/src/components/DateRangeFilters'
import type { SearchConfig, ContentType } from '@/src/lib/types'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSearch: (config: SearchConfig) => void
}

export function SearchDialog({ open, onOpenChange, onSearch }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [datePreset, setDatePreset] = useState<DateRangePreset>('all')
  const [maxResults, setMaxResults] = useState('50')
  const [contentTypes, setContentTypes] = useState<ContentType[]>(['all'])

  const handleDatePresetChange = (preset: DateRangePreset) => {
    setDatePreset(preset)
    const range = getDateRangeFromPreset(preset)
    setDateFrom(range.from || '')
    setDateTo(range.to || '')
  }

  useEffect(() => {
    if (dateFrom || dateTo) {
      setDatePreset(undefined as any)
    }
  }, [dateFrom, dateTo])

  const contentTypeOptions: { value: ContentType; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'article', label: 'Articles' },
    { value: 'review', label: 'Reviews' },
    { value: 'interview', label: 'Interviews' },
    { value: 'news', label: 'News' },
    { value: 'feature', label: 'Features' }
  ]

  const toggleContentType = (type: ContentType) => {
    if (type === 'all') {
      setContentTypes(['all'])
    } else {
      const filtered = contentTypes.filter(t => t !== 'all')
      if (filtered.includes(type)) {
        const newTypes = filtered.filter(t => t !== type)
        setContentTypes(newTypes.length === 0 ? ['all'] : newTypes)
      } else {
        setContentTypes([...filtered, type])
      }
    }
  }

  const handleSubmit = () => {
    if (!query.trim()) return

    const config: SearchConfig = {
      query: query.trim(),
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      contentTypes: contentTypes.includes('all') ? ['all'] : contentTypes,
      maxResults: parseInt(maxResults) || 50
    }

    onSearch(config)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold">New Search</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Configure your press review search with intelligent filters and AI analysis
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="query" className="text-sm font-medium">
              Artist or Topic *
            </Label>
            <Input
              id="query"
              placeholder="e.g., Taylor Swift, The 1975, new album reviews..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-sm font-medium">Date Range</Label>
            <DateRangeFilters
              selected={datePreset}
              onSelect={handleDatePresetChange}
            />
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date-from" className="text-xs font-medium text-muted-foreground">
                  Custom From
                </Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="date-to" className="text-xs font-medium text-muted-foreground">
                  Custom To
                </Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Content Types</Label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {contentTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`type-${option.value}`}
                    checked={contentTypes.includes(option.value)}
                    onCheckedChange={() => toggleContentType(option.value)}
                  />
                  <Label
                    htmlFor={`type-${option.value}`}
                    className="text-xs sm:text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="max-results" className="text-sm font-medium">
              Maximum Results
            </Label>
            <Select value={maxResults} onValueChange={setMaxResults}>
              <SelectTrigger id="max-results" className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 results</SelectItem>
                <SelectItem value="50">50 results</SelectItem>
                <SelectItem value="100">100 results</SelectItem>
                <SelectItem value="200">200 results</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!query.trim()} className="gap-2 w-full sm:w-auto">
            <MagnifyingGlass size={18} weight="bold" />
            Start Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
