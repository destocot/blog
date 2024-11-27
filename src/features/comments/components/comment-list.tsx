'use client'

import type { Prisma, Post } from '@prisma/client'
import { useEffect, useOptimistic, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { createComment } from '@/features/comments/actions/create-comment'
import { format } from 'date-fns'
import { Session } from '@/lib/jose'
import { FindOneUser } from '@/features/users/queries'

type Comment = Prisma.CommentGetPayload<{
  select: {
    commentId: true
    content: true
    createdAt: true
    author: { select: { userId: true; name: true } }
  }
}>

type CommentsListProps = {
  initialData: Array<Comment>
  post: Prisma.PostGetPayload<{
    select: {
      postId: true
      createdAt: true
      updatedAt: true
      title: true
      content: true
      image: true
      author: {
        select: {
          userId: true
          name: true
        }
      }
    }
  }>
}

export const CommentList = ({ initialData, post }: CommentsListProps) => {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialData,
    (state, newComment: Pick<Comment, 'content' | 'author'>) => [
      {
        commentId: String(Date.now()),
        content: newComment.content,
        createdAt: new Date(),
        author: {
          name: newComment.author.name,
          userId: newComment.author.userId,
        },
      },
      ...state.slice(0, state.length - 1),
    ],
  )

  return (
    <>
      {optimisticComments.map((comment, i) => (
        <div
          key={comment.commentId}
          className='animate-fadeIn rounded-md bg-neutral-100 p-4 transition dark:bg-neutral-800'
          style={{ animationDelay: `${i * 200}ms` }}
        >
          <div className='flex items-center gap-x-4'>
            <div className='size-10 flex-shrink-0 rounded bg-primary' />

            <div className='space-y-1'>
              <p className='line-clamp-2 break-words text-sm text-muted-foreground'>
                {comment.content}
              </p>

              <div className='flex items-center gap-x-1 text-xs'>
                <span
                  className={cn('font-semibold', {
                    'rounded-sm bg-foreground px-1 text-background':
                      post.author.userId === comment.author.userId,
                  })}
                >
                  {comment.author.name}
                </span>
                <span>•</span>
                <time className='text-muted-foreground'>
                  {format(new Date(comment.createdAt), 'MMMM d, yyyy')}
                </time>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className='pt-2'>
        <CreateCommentForm
          postId={post.postId}
          addOptimisticComment={addOptimisticComment}
        />
      </div>
    </>
  )
}

type CreateCommentFormProps = {
  postId: Post['postId']
  addOptimisticComment: (comment: Pick<Comment, 'content' | 'author'>) => void
}

const CreateCommentForm = ({
  postId,
  addOptimisticComment,
}: CreateCommentFormProps) => {
  const [user, setUser] = useState<FindOneUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [content, setContent] = useState('')
  const maxLength = 140

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/\n/g, '')
    setContent(value)
  }

  useEffect(() => {
    ;(async function run() {
      const sessionRes = await fetch('/api/session')
      const { data: session } = (await sessionRes.json()) as { data: Session }

      if (!session?.user?.id) return

      const userRes = await fetch(`/api/users/${session.user.id}`)
      const { data: user } = (await userRes.json()) as { data: FindOneUser }
      setUser(user)
    })()
  }, [])

  async function action(formData: FormData) {
    setError(null)

    if (!user?.userId) {
      setError('Please log in to comment')
      return
    }

    addOptimisticComment({
      content: formData.get('content') as string,
      author: {
        name: String(user?.name),
        userId: String(user?.userId),
      },
    })

    try {
      const res = await createComment({}, formData)
      if (res.error) throw new Error(res.error)
      setContent('')
    } catch (err) {
      console.log((err as Error).message)
      setError((err as Error).message)
    }
  }

  return (
    <form action={action}>
      <input type='hidden' name='postId' defaultValue={postId} readOnly />
      <div>
        <Label htmlFor='content' className='sr-only'>
          Write a Comment
        </Label>
        <div className='custom-scrollbar flex flex-col rounded-md border border-input bg-background px-3 py-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
          <Textarea
            id='content'
            name='content'
            className='min-h-[40px] resize-none rounded-none border-0 focus-visible:ring-0'
            maxLength={maxLength}
            placeholder='Write a comment'
            value={content}
            onChange={handleContentChange}
          />
          <div className='flex items-end gap-x-4 self-end'>
            <span
              className={cn('text-xs text-muted-foreground', {
                'text-destructive': content.length >= maxLength,
              })}
            >
              {maxLength - content.length} characters remaining
            </span>
            <Button
              size='sm'
              variant='outline'
              type='submit'
              className='self-end'
            >
              Publish
            </Button>
          </div>
        </div>
        {error ? <p className='mt-2 text-sm text-red-500'>{error}</p> : null}
      </div>
    </form>
  )
}
