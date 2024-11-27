'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { register } from '@/features/auth/actions/register'
import type { ActionState } from '@/features/middleware'
import { useActionState } from 'react'

export const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    register,
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

      <div>
        <Label htmlFor='confirmPassword'>Confirm Password</Label>
        <Input type='password' id='confirmPassword' name='confirmPassword' />
      </div>

      <Button type='submit' className='w-full' disabled={isPending}>
        Register
      </Button>
    </form>
  )
}
