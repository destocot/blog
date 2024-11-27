'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function findPosts(args?: Prisma.PostFindManyArgs) {
  return await prisma.post.findMany({
    ...args,
  })
}

export async function findPostCount() {
  return await prisma.post.count()
}

export async function findOnePost(postId: string) {
  return await prisma.post.findUnique({
    where: { postId },
    select: {
      postId: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      content: true,
      image: true,
      author: {
        select: {
          userId: true,
          name: true,
        },
      },
    },
  })
}
