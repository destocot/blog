import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from '@/features/auth/components/login-form'
import Link from 'next/link'

export default function Page() {
  return (
    <Card className='mx-auto border-0 shadow-none md:max-w-[480px] md:border md:shadow-sm md:dark:shadow-dark-sm'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold'>Login</CardTitle>
      </CardHeader>

      <CardContent>
        <LoginForm />
      </CardContent>

      <CardFooter className='justify-center'>
        <div className='text-sm'>
          Don&apos;t have an account? Register{' '}
          <Button variant='link' className='px-0 text-primary' asChild>
            <Link href='/register'>here</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
