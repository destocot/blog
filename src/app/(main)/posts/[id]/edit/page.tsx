import EditForm from '@/components/EditForm'
import Hero from '@/components/Hero'
import { connectToMongoDB } from '@/lib/mongodb'
import Post from '@/models/Post'

const getPostDetails = async (id: string) => {
  await connectToMongoDB()
  const doc = await Post.findById(id)
  return doc.toJSON()
}

const EditPostPage = async ({ params }: { params: { id: string } }) => {
  const post = await getPostDetails(params.id)
  return (
    <main>
      <Hero />
      <EditForm
        title={post.title}
        content={post.content}
        author={post.author}
        id={post._id.toString()}
      />
    </main>
  )
}
export default EditPostPage
