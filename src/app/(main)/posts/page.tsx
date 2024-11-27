import { Container } from '@/components/container'
import { findPostCount, findPosts } from '@/features/posts/queries'
import { PostList } from '@/features/posts/components/post-list'
import { parsePage } from '@/lib/utils'
import { POSTS_PER_PAGE } from '@/features/posts/constants'
import { Pagination } from '@/features/posts/components/pagination'

type SearchParams = Promise<{ pg?: string }>

export default async function PostsPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const currentPage = parsePage(searchParams.pg)

  const [initialPosts, postCount] = await Promise.all([
    findPosts({
      take: POSTS_PER_PAGE,
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      orderBy: { createdAt: 'desc' },
    }),
    findPostCount(),
  ])

  const totalPages = Math.ceil(postCount / POSTS_PER_PAGE)

  return (
    <Container className='pb-12 pt-8'>
      <section className='mb-16 mt-8 text-center'>
        <h1 className='`text-4xl mb-4 font-bold tracking-tight sm:text-5xl md:text-6xl'>
          Khurram Ali Blog
        </h1>

        <p className='mx-auto max-w-2xl text-xl text-muted-foreground'>
          My Journey to become a Full Stack Developer
        </p>
      </section>

      <section>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold'>Posts</h2>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>

        <PostList posts={initialPosts} />
      </section>
    </Container>
  )
}
