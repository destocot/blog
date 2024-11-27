import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { ThemeToggler } from '@/components/providers/theme-toggler'
import type { ReadonlyChildren } from '@/types'

export default function AuthLayout({ children }: ReadonlyChildren) {
  return (
    <>
      <main className='relative flex h-full min-h-[calc(100vh-4rem)] items-center justify-center'>
        <Container className='h-full pb-12 pt-8'>
          <div className='grid h-full grid-cols-4 md:gap-x-8 lg:gap-x-16'>
            <div className='col-span-4 md:col-span-3 lg:col-span-2'>
              {children}
            </div>
            <div className='hidden md:block' />
          </div>
        </Container>
        <div className='absolute bottom-4 right-4'>
          <ThemeToggler />
        </div>
      </main>
      <Footer />
    </>
  )
}
