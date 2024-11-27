'use server'

import { validatedAction } from '@/features/middleware'
import { UpdatePostSchema } from '../validators'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { deletePostImage } from './delete-post-image'

export const updatePost = validatedAction(UpdatePostSchema, async (data) => {
  const session = await getSession()
  if (!session || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' }
  }

  const { postId, image, ...values } = data

  const post = await prisma.post.findUnique({
    where: { postId, authorId: session.user.id },
    select: { image: true },
  })

  if (!post) notFound()

  if (image && post.image && post.image !== image) {
    await deletePostImage(post.image)
  }

  const updatedPost = await prisma.post.update({
    where: { postId },
    data: {
      ...values,
      image: image ? image : null,
    },
    select: { postId: true },
  })

  revalidatePath(`/post/${updatedPost.postId}`)
  redirect(`/post/${updatedPost.postId}`)
})
