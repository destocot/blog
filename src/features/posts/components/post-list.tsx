import { format } from 'date-fns'
import type { Post } from '@prisma/client'
import Link from 'next/link'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type PostListProps = { posts: Array<Post> }

export const PostList = ({ posts }: PostListProps) => {
  return (
    <>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <Card
            key={post.postId}
            className='overflow-hidden transition-shadow hover:shadow-lg hover:dark:shadow-dark-lg'
          >
            <Link
              href={`/post/${post.postId}`}
              className='block h-full transition-transform hover:scale-[1.01]'
            >
              <CardHeader>
                <CardDescription className='mt-2 flex items-center justify-between'>
                  <time className='text-xs text-muted-foreground'>
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </time>
                </CardDescription>
                <CardTitle className='line-clamp-2'>{post.title}</CardTitle>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </>
  )
}
