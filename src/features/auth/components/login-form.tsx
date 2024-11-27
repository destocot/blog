'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/features/auth/actions/login'
import { ActionState } from '@/features/middleware'
import { useActionState } from 'react'

export const LoginForm = () => {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    login,
    {},
  )

  return (
    <form action={formAction} className='space-y-4'>
      {state.error ? (
        <p className='text-sm text-red-500'>{state.error}</p>
      ) : null}

      <div>
        <Label htmlFor='email'>Email</Label>
        <Input type='email' id='email' name='email' />
      </div>

      <div>
        <Label htmlFor='password'>Password</Label>
        <Input type='password' id='password' name='password' />
      </div>

      <Button type='submit' className='w-full' disabled={isPending}>
        Login
      </Button>
    </form>
  )
}
