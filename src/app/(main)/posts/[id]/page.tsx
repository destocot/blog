import DeletePostButton from '@/components/DeletePostButton'
import Hero from '@/components/Hero'
import { connectToMongoDB } from '@/lib/mongodb'
import Post from '@/models/Post'
import Link from 'next/link'
import { CiEdit } from 'react-icons/ci'

const getPostDetails = async (id: string) => {
  await connectToMongoDB()
  return await Post.findById(id)
}

const PostsDetailPage = async ({ params }: { params: { id: string } }) => {
  const post = await getPostDetails(params.id)
  return (
    <main>
      <Hero />
      <div className="flex justify-between border-b-4 items-center my-4">
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <Mutations id={params.id} />
      </div>
      <div>
        <p className="max-w-prose">{post.content}</p>
      </div>
    </main>
  )
}
export default PostsDetailPage

const Mutations = ({ id }: { id: string }) => {
  return (
    <div className="flex gap-4">
      <Link href={`/posts/${id}/edit`}>
        <CiEdit size="2rem" className="hover:scale-110 transition-all" />
      </Link>
      <DeletePostButton id={id} />
    </div>
  )
}
