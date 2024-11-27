'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export const ThemeToggler = () => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const handleToggleTheme = () => {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button
      variant='outline'
      size='icon'
      className='size-9'
      onClick={handleToggleTheme}
    >
      <SunIcon className='rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <MoonIcon className='absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      {mounted && (
        <span className='sr-only'>
          {resolvedTheme === 'light'
            ? 'Switch to dark mode'
            : 'Switch to light mode'}
        </span>
      )}
    </Button>
  )
}
