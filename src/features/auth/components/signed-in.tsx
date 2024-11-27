import { getSession } from '@/lib/session'
import { ReadonlyChildren } from '@/types'

type SignedInProps = {
  children: ReadonlyChildren['children']
  asAdmin?: boolean
}

export const SignedIn = async ({ children, asAdmin }: SignedInProps) => {
  const session = await getSession()

  if (!session) return null

  if (asAdmin && session.user.role !== 'ADMIN') return null

  return <>{children}</>
}
