import { prisma } from '@/lib/prisma'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = 'https://blog.khurramali.site'

  const posts = await prisma.post.findMany({})

  // Switch to slugs in the future
  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/post/${post.postId}`,
    lastModified: post.updatedAt,
  }))

  return [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date(),
    },
    ...postUrls,
  ]
}
