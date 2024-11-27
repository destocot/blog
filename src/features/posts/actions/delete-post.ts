'use server'

import type { Post } from '@prisma/client'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { deletePostImage } from '@/features/posts/actions/delete-post-image'

export async function deletePost(postId: Post['postId']) {
  const session = await getSession()
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const post = await prisma.post.findUnique({
    where: {
      postId,
      authorId: session.user.id,
    },
  })

  if (!post) notFound()

  try {
    if (post.image) await deletePostImage(post.image)
    await prisma.post.delete({ where: { postId } })
    return true
  } catch (err) {
    console.error((err as Error).message)
    return false
  }
}
