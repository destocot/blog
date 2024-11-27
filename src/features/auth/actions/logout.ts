'use server'

import { redirect } from 'next/navigation'

import { getSession } from '@/lib/session'
import { cookies } from 'next/headers'

export const logout = async () => {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  ;(await cookies()).delete('session')
  redirect('/login')
}
