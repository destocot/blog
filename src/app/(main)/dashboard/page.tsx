import { Container } from '@/components/container'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { getSession } from '@/lib/session'
import { cn } from '@/lib/utils'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <Container className='pb-12 pt-8'>
      <div className='space-y-8'>
        <h1
          className={cn(
            'w-fit rounded-sm bg-secondary px-1 py-0.5 text-3xl font-bold text-secondary-foreground',
            {
              'bg-primary text-primary-foreground':
                session.user.role === 'ADMIN',
            },
          )}
        >
          Dashboard
        </h1>

        <div className='overflow-x-auto'>
          <table className='w-full table-auto border-collapse border border-border text-left'>
            <thead className='border border-border'>
              <tr>
                <th className='px-4 py-2'>Key</th>
                <th className='px-4 py-2'>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(session.user).map(([key, value]) => (
                <tr key={key}>
                  <td className='px-4 py-2'>{key}</td>
                  <td className='px-4 py-2'>{String(value)}</td>
                </tr>
              ))}
              <tr>
                <td className='px-4 py-2'>expires</td>
                <td className='px-4 py-2'>{String(session.expires)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <LogoutButton />
      </div>
    </Container>
  )
}
