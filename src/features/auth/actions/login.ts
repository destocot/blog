'use server'

import { redirect } from 'next/navigation'

import { LoginSchema } from '@/features/auth/validators'
import { comparePasswords } from '@/lib/bcrypt'
import { validatedAction } from '@/features/middleware'
import { prisma } from '@/lib/prisma'
import { setSession } from '@/lib/session'
import { getUserWithNormalizedEmail } from '@prisma/client/sql'

export const login = validatedAction(LoginSchema, async (data) => {
  const { email, password } = data

  const user = await prisma
    .$queryRawTyped(getUserWithNormalizedEmail(email))
    .then((res) => res[0] as getUserWithNormalizedEmail.Result)

  if (!user) {
    return { error: 'Invalid email or password. Please try again.' }
  }

  const isPasswordValid = await comparePasswords(password, user.password_hash)
  if (!isPasswordValid) {
    return { error: 'Invalid email or password. Please try again.' }
  }

  await setSession({
    id: user.user_id,
    role: user.role,
  })

  redirect('/')
})
