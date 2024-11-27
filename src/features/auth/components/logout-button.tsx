'use client'

import { Button } from '@/components/ui/button'
import { logout } from '../actions/logout'

export const LogoutButton = () => {
  const clickHandler = async () => void (await logout())

  return (
    <Button onClick={clickHandler} size='sm' variant='destructive'>
      Log Out
    </Button>
  )
}
