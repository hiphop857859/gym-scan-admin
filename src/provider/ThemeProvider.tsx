'use client'

import type React from 'react'
import { createContext, useState, useContext, useEffect, useLayoutEffect } from 'react'
import { Theme } from 'src/types'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(Theme.DARK)
  const [isInitialized, setIsInitialized] = useState(false)

  useLayoutEffect(() => {
    // const savedTheme = localStorage.getItem('theme') as Theme | null
    const initialTheme = Theme.DARK // force use dark

    setTheme(initialTheme)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [theme, isInitialized])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
