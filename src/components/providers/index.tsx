'use client'

import { ThemeProvider } from './theme-provider'
import type { ReadonlyChildren } from '@/types'

export const GlobalProviders = ({ children }: ReadonlyChildren) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
