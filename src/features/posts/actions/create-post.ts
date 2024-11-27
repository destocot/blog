'use server'

import { validatedAction } from '@/features/middleware'
import { CreatePostSchema } from '@/features/posts/validators'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const createPost = validatedAction(CreatePostSchema, async (values) => {
  const session = await getSession()
  if (!session || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const newPost = await prisma.post.create({
    data: {
      ...values,
      authorId: session.user.id,
    },
    select: { postId: true },
  })

  redirect(`/post/${newPost.postId}`)
})
