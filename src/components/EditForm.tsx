'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CiEdit } from 'react-icons/ci'

const EditForm = (post: {
  title: string
  content: string
  author: string
  id: string
}) => {
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const router = useRouter()

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await fetch(`/api/posts/${post.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
          })
          router.push(`/posts/${post.id}`)
        }}
        className="mt-8 space-y-4"
      >
        <div className="flex flex-col">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label>Author</label>
          <input
            type="text"
            value={post.author}
            className="disabled:opacity-50"
            disabled
          />
        </div>
        <button
          type="submit"
          className="btn flex gap-4 items-center font-semibold text-2xl"
        >
          <CiEdit size="2rem" /> Edit
        </button>
      </form>
    </div>
  )
}
export default EditForm
