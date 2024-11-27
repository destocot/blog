'use client'

import { Button } from './ui/button'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Session } from '@/lib/jose'
import { useEffect, useState } from 'react'

export const NavItems = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    ;(async function run() {
      const res = await fetch('/api/session')
      const { data: session } = (await res.json()) as { data: Session }
      setSession(session)
    })()
  }, [])

  return (
    <>
      <li>
        <Button size='sm' asChild>
          <Link href='/'>Home</Link>
        </Button>
      </li>

      {!!session ? (
        <li>
          <Button size='sm' variant='outline' asChild>
            <Link href='/dashboard'>Dashboard</Link>
          </Button>
        </li>
      ) : null}

      {!session ? (
        <li>
          <Button size='sm' variant='outline' asChild>
            <Link href='/login'>Login</Link>
          </Button>
        </li>
      ) : null}

      {session?.user.role === 'ADMIN' ? (
        <li>
          <Button variant='secondary' size='sm' asChild>
            <Link href='/posts/new'>
              <PlusIcon className='h-4 w-4' />
              Create
            </Link>
          </Button>
        </li>
      ) : null}
    </>
  )
}
