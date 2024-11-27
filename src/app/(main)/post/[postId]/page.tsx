import { notFound } from 'next/navigation'
import { ArrowLeftFromLineIcon, CalendarIcon, UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/container'
import { findOnePost } from '@/features/posts/queries'
import { EditPostButton } from '@/features/posts/components/edit-post-button'
import { Button } from '@/components/ui/button'
import { DeletePostButton } from '@/features/posts/components/delete-post-button'
import { SignedIn } from '@/features/auth/components/signed-in'
import { findComments } from '@/features/comments/queries'
import { CommentList } from '@/features/comments/components/comment-list'

type Params = Promise<{ postId: string }>

import type { Metadata, ResolvingMetadata } from 'next'
import { prisma } from '@/lib/prisma'
import { POSTS_PER_PAGE } from '@/features/posts/constants'

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const postId = (await params).postId

  const post = await prisma.post.findUnique({
    where: { postId },
    select: { title: true, image: true, content: true },
  })

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post?.title ? post.title : 'Not Found',
    openGraph: {
      description: post?.content
        ? post.content.length > 128
          ? `${post.content.slice(0, 128)}...`
          : post.content
        : 'The page you are looking for does not exist.',
      images: post?.image ? [post.image] : previousImages,
    },
  }
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { postId: true },
    orderBy: { createdAt: 'desc' },
    take: POSTS_PER_PAGE * 2,
  })

  const staticParams = posts.map((post) => ({
    postId: post.postId,
  }))

  return staticParams
}

type PostPageProps = { params: Params }

export default async function Page(props: PostPageProps) {
  const params = await props.params
  const post = await findOnePost(params.postId)
  if (!post) notFound()

  const comments = await findComments(post.postId)

  return (
    <Container className='pb-12 pt-8'>
      <article className='mx-auto max-w-2xl px-4 py-12'>
        <header className='mb-12 space-y-6'>
          <div className='flex flex-col-reverse items-start justify-between gap-2 md:flex-row'>
            <h1 className='text-4xl font-bold tracking-tight text-primary'>
              {post.title}
            </h1>
            <Button variant='outline' size='sm' asChild>
              <Link href='/posts'>
                <ArrowLeftFromLineIcon className='h-4 w-4' />
                Back
              </Link>
            </Button>
          </div>

          <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
            <div className='flex items-center'>
              <UserIcon className='mr-2 h-4 w-4' />
              <span>{post.author.name}</span>
            </div>
            <div className='flex items-center'>
              <CalendarIcon className='mr-2 h-4 w-4' />
              <time dateTime={post.createdAt.toISOString()}>
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </time>
            </div>
          </div>
        </header>

        {post.image && (
          <div className='relative mb-12 aspect-video overflow-hidden rounded-md bg-muted'>
            <Image
              src={post.image}
              alt={post.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              priority
              placeholder='blur'
              blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=='
            />
          </div>
        )}

        <div className='prose prose-neutral max-w-none dark:prose-invert prose-pre:dark:bg-neutral-900'>
          <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>

        <div className='mt-12 space-y-3 border-t border-border pt-6'>
          <h3 className='text-xl font-semibold'>Recent Comments</h3>

          <CommentList initialData={comments} post={post} />
        </div>

        <footer className='mt-12 border-t border-border pt-6'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-muted-foreground'>
              Last updated: {format(new Date(post.updatedAt), 'MMMM d, yyyy')}
            </div>
            <div className='flex gap-x-2'>
              <SignedIn asAdmin>
                <EditPostButton postId={post.postId} />
              </SignedIn>

              <SignedIn asAdmin>
                <DeletePostButton postId={post.postId} />
              </SignedIn>
            </div>
          </div>
        </footer>
      </article>
    </Container>
  )
}
