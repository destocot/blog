import { prisma } from '@/lib/prisma'
import { COMMENTS_PER_PAGE } from '@/features/comments/constants'

export async function findComments(postId: string) {
  return await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    take: COMMENTS_PER_PAGE,
    select: {
      commentId: true,
      content: true,
      createdAt: true,
      author: { select: { userId: true, name: true } },
    },
  })
}
