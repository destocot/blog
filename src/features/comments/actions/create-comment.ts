'use server'

import { validatedAction } from '@/features/middleware'
import { CreateCommentSchema } from '@/features/comments/validators'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export const createComment = validatedAction(
  CreateCommentSchema,
  async (values) => {
    const session = await getSession()
    if (!session) {
      return { error: 'Please log in to comment' }
    }

    await prisma.comment.create({
      data: {
        ...values,
        authorId: session.user.id,
      },
      select: { postId: true },
    })

    return {}
  },
)
