import Link from 'next/link'

import { ThemeToggler } from '@/components/providers/theme-toggler'
import { Container } from '@/components/container'
import { NavItems } from './nav-items'

export const Header = () => {
  return (
    <header className='h-20 border-b border-border/50'>
      <Container className='h-full'>
        <div className='flex h-full items-center justify-between'>
          <Link href='/' className='text-2xl font-bold'>
            Blog
          </Link>

          <nav className='flex gap-x-2'>
            <ul className='flex gap-x-2'>
              <NavItems />
            </ul>

            <ThemeToggler />
          </nav>
        </div>
      </Container>
    </header>
  )
}
