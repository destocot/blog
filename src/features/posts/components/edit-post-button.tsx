import Link from 'next/link'
import { PencilIcon } from 'lucide-react'
import type { Post } from '@prisma/client'

import { Button } from '@/components/ui/button'

type EditPostButtonProps = { postId: Post['postId'] }

export const EditPostButton = ({ postId }: EditPostButtonProps) => {
  return (
    <Button variant='outline' size='sm' asChild>
      <Link href={`/post/${postId}/edit`}>
        <PencilIcon className='h-4 w-4' />
        Edit
      </Link>
    </Button>
  )
}
