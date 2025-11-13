"use client"

import { useState, useEffect } from 'react'

export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(defaultValue)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Only access localStorage after mounting (client-side)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key)
        if (stored !== null) {
          const parsed = JSON.parse(stored)
          setValue(parsed)
        }
      } catch (error) {
        console.warn(`Failed to parse stored value for key "${key}":`, error)
      }
    }
  }, [key])

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(value)
        : newValue
      
      setValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Failed to store value for key "${key}":`, error)
    }
  }

  // Return default value during SSR, actual value after hydration
  return [mounted ? value : defaultValue, setStoredValue]
}