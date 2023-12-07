'use client'

import Hero from '@/components/Hero'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CreatePostPage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('Khurram Ali')

  const router = useRouter()

  return (
    <main>
      <Hero />
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await fetch('/api/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, author }),
          })
          router.push('/')
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
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </main>
  )
}
export default CreatePostPage
