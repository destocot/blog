import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = 'https://blog.khurramali.site'

  return {
    rules: {
      userAgent: '*',
      disallow: ['/posts/new', '/post/*/edit', '/dashboard'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
