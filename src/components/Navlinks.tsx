'use client'

import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/create', label: 'Create' },
]

const Navlinks = () => {
  const pathname = usePathname()

  return (
    <ul className="flex gap-4 items-center">
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.label}
          className={cn('btn', {
            'opacity-50': pathname === link.href,
          })}
        >
          {link.label}
        </Link>
      ))}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </ul>
  )
}
export default Navlinks
