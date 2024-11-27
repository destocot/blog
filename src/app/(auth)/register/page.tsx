import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RegisterForm } from '@/features/auth/components/register-form'
import Link from 'next/link'

export default function Page() {
  return (
    <Card className='mx-auto border-0 shadow-none md:max-w-[480px] md:border md:shadow-sm md:dark:shadow-dark-sm'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold'>Register</CardTitle>
      </CardHeader>

      <CardContent>
        <RegisterForm />
      </CardContent>

      <CardFooter className='justify-center'>
        <div className='text-sm'>
          Already have an account? Login{' '}
          <Button variant='link' className='px-0 text-primary' asChild>
            <Link href='/login'>here</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
