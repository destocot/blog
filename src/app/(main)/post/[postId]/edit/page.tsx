import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EditPostForm } from '@/features/posts/components/edit-post-form'
import { findOnePost } from '@/features/posts/queries'
import { ArrowLeftFromLineIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Params = Promise<{ postId: string }>

export default async function Page(props: { params: Params }) {
  const params = await props.params
  const post = await findOnePost(params.postId)
  if (!post) notFound()

  return (
    <Container className='pb-12 pt-8'>
      <Card className='mx-auto w-full border-0 py-12 shadow-none md:max-w-2xl md:border md:px-4 md:shadow-sm md:dark:shadow-dark-sm'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold'>Edit Post</CardTitle>
        </CardHeader>

        <CardContent>
          <EditPostForm post={post} />
        </CardContent>

        <CardFooter className='justify-end'>
          <Button variant='outline' size='sm' asChild>
            <Link href={`/post/${post.postId}`}>
              <ArrowLeftFromLineIcon className='h-4 w-4' />
              Back
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </Container>
  )
}
