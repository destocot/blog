import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CreatePostForm } from '@/features/posts/components/create-post-form'
import { getSession } from '@/lib/session'
import { ArrowLeftFromLineIcon } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/')

  return (
    <Container className='pb-12 pt-8'>
      <Card className='mx-auto w-full border-0 py-12 shadow-none md:max-w-2xl md:border md:px-4 md:shadow-sm md:dark:shadow-dark-sm'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold'>Create Post</CardTitle>
        </CardHeader>

        <CardContent>
          <CreatePostForm />
        </CardContent>

        <CardFooter className='justify-end'>
          <Button variant='outline' size='sm' asChild>
            <Link href='/'>
              <ArrowLeftFromLineIcon className='h-4 w-4' />
              Back
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </Container>
  )
}
