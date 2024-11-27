'use client'

import { Button } from '@/components/ui/button'
import { usePathname, useSearchParams } from 'next/navigation'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

type PaginationProps = { totalPages: number; currentPage: number }

export const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('pg', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const hasPrev = currentPage !== 1
  const hasNext = currentPage !== totalPages
  return (
    <div className='flex justify-center gap-x-4'>
      {hasPrev ? (
        <Button variant='outline' asChild>
          <Link href={createPageURL(currentPage - 1)}>
            <ArrowLeftIcon className='h-4 w-4' />
            Prev
          </Link>
        </Button>
      ) : (
        <Button variant='outline' disabled>
          <ArrowLeftIcon className='h-4 w-4' />
          Prev
        </Button>
      )}

      {hasNext ? (
        <Button variant='outline' asChild>
          <Link href={createPageURL(currentPage + 1)}>
            Next
            <ArrowRightIcon className='h-4 w-4' />
          </Link>
        </Button>
      ) : (
        <Button variant='outline' disabled>
          Next
          <ArrowRightIcon className='h-4 w-4' />
        </Button>
      )}
    </div>
  )
}
