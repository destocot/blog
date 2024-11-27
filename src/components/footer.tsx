import Link from 'next/link'

import { Container } from '@/components/container'

export const Footer = () => {
  return (
    <footer className='h-16 border-t border-border/50'>
      <Container className='h-full'>
        <div className='flex h-full flex-col items-center justify-center md:flex-row md:justify-between'>
          <p className='text-sm text-foreground/50'>
            <Link href='/' className='font-bold'>
              Blog
            </Link>{' '}
            &copy; {new Date().getFullYear()}
          </p>

          <p className='text-sm text-foreground/50'>
            Created by Khurram Ali with Next.js 15, Tailwind, and shadcn/ui
          </p>
        </div>
      </Container>
    </footer>
  )
}
