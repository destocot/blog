import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'

export async function findOneUser(userId: User['userId']) {
  return await prisma.user.findUnique({
    where: { userId },
    select: { userId: true, role: true, name: true },
  })
}

export type FindOneUser = Awaited<ReturnType<typeof findOneUser>>
