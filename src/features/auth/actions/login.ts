'use server'

import { redirect } from 'next/navigation'

import { LoginSchema } from '@/features/auth/validators'
import { comparePasswords } from '@/lib/bcrypt'
import { validatedAction } from '@/features/middleware'
import { prisma } from '@/lib/prisma'
import { setSession } from '@/lib/session'

export const login = validatedAction(LoginSchema, async (data) => {
  const { email, password } = data

  const user = await prisma.user.findUnique({
    where: { email: email.toUpperCase() },
    select: { userId: true, role: true, passwordHash: true },
  })

  if (!user) {
    return { error: 'Invalid email or password. Please try again.' }
  }

  const isPasswordValid = await comparePasswords(password, user.passwordHash)
  if (!isPasswordValid) {
    return { error: 'Invalid email or password. Please try again.' }
  }

  await setSession({
    id: user.userId,
    role: user.role,
  })

  redirect('/')
})
