import { connectToMongoDB } from '@/lib/mongodb'
import Post from '@/models/Post'
import Link from 'next/link'

const getPosts = async () => {
  await connectToMongoDB()
  return await Post.find({})
}

const PostList = async () => {
  const posts = await getPosts()

  return (
    <>
      <h1 className="text-3xl my-4 font-semibold border-b-4">Posts</h1>
      <ul>
        {posts.map((post) => (
          <Link
            href={`/posts/${post.id}`}
            key={post._id}
            className="border-b-2 border-dashed p-2 transition-all hover:bg-stone-500/10 cursor-pointer flex justify-between"
          >
            <h2>{post.title}</h2>
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </Link>
        ))}
      </ul>
    </>
  )
}
export default PostList
