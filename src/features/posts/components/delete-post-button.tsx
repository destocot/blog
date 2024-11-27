'use client'

import { Trash2Icon } from 'lucide-react'
import type { Post } from '@prisma/client'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { deletePost } from '@/features/posts/actions/delete-post'

type DeletePostButtonProps = { postId: Post['postId'] }

export const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const router = useRouter()
  const handleClick = async () => {
    const success = await deletePost(postId)
    if (success) router.replace('/')
  }

  return (
    <Button variant='destructive' size='sm' onClick={handleClick}>
      <Trash2Icon className='h-4 w-4' />
      Delete
    </Button>
  )
}
