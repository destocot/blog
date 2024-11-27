import Link from 'next/link'
import { ArrowRightFromLineIcon } from 'lucide-react'

import { Container } from '@/components/container'
import { findPosts } from '@/features/posts/queries'
import { Button } from '@/components/ui/button'
import { POSTS_PER_PAGE } from '@/features/posts/constants'
import { PostList } from '@/features/posts/components/post-list'

export default async function HomePage() {
  const posts = await findPosts({
    take: POSTS_PER_PAGE,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <Container className='pb-12 pt-8'>
      <section className='mb-16 mt-8 text-center'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
          Khurram Ali Blog
        </h1>
        <p className='mx-auto max-w-2xl text-xl text-muted-foreground'>
          My Journey to become a Full Stack Developer
        </p>
      </section>

      <section>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold'>Latest Posts</h2>

          {posts.length < POSTS_PER_PAGE ? (
            <Button variant='outline' disabled>
              Next
              <ArrowRightFromLineIcon className='h-4 w-4' />
            </Button>
          ) : (
            <Button variant='outline' asChild>
              <Link href='/posts?pg=2'>
                Next
                <ArrowRightFromLineIcon className='h-4 w-4' />
              </Link>
            </Button>
          )}
        </div>

        <PostList posts={posts} />
      </section>
    </Container>
  )
}
