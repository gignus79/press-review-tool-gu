import { useEffect, useState } from 'react'
import { useKV } from '@/src/hooks/use-kv'

export type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setThemeKV] = useKV<Theme>('theme', 'light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setThemeKV(current => current === 'light' ? 'dark' : 'light')
  }

  return { theme, toggleTheme, mounted }
}
