'use client'

import { useRouter } from 'next/navigation'
import { CiTrash } from 'react-icons/ci'

const DeletePostButton = ({ id }: { id: string }) => {
  const router = useRouter()

  return (
    <CiTrash
      size="2rem"
      className="hover:scale-110 transition-all"
      onClick={async () => {
        const confirmed = confirm(`Are you sure you want to delete post ${id}`)

        if (!confirmed) return

        await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        })
        router.push('/')
      }}
    />
  )
}
export default DeletePostButton
