import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/session'

export const DashboardButton = async () => {
  const session = await getSession()
  if (!session) return null

  return (
    <Button size='sm' variant='outline' asChild>
      <Link href='/dashboard'>Dashboard</Link>
    </Button>
  )
}
