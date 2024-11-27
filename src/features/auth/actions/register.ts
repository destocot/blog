'use server'

import { redirect } from 'next/navigation'

import { hashPassword } from '@/lib/bcrypt'
import { validatedAction } from '@/features/middleware'
import { prisma } from '@/lib/prisma'
import { RegisterSchema } from '@/features/auth/validators'
import { setSession } from '@/lib/session'

function generateName(email: string) {
  return email
    .split('@')[0]
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
}

export const register = validatedAction(RegisterSchema, async (data) => {
  const { email, password } = data

  const passwordHash = await hashPassword(password)
  const name = generateName(email)

  const newUser = await prisma.user.create({
    data: { email: email.toUpperCase(), passwordHash, name },
    select: { userId: true, role: true },
  })

  await setSession({
    id: newUser.userId,
    role: newUser.role,
  })

  redirect('/')
})
