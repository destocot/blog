import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Main } from '@/components/main'
import type { ReadonlyChildren } from '@/types'

export default function MainLayout({ children }: ReadonlyChildren) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  )
}
