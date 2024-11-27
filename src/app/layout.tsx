import type { Metadata } from 'next'
import { Inter_Tight as Inter } from 'next/font/google'
import './globals.css'

import type { ReadonlyChildren } from '@/types'
import { GlobalProviders } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://blog.khurramali.site'),
  keywords: ['blog', 'web development', 'programming', 'javascript'],
  title: {
    template: '%s | Blog',
    default: 'Blog',
  },
  openGraph: {
    images: ['opengraph-image.png'],
    description: 'My Journey to become a Full Stack Developer',
  },
}

export default function RootLayout({ children }: ReadonlyChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  )
}
