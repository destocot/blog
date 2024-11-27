import { cn } from '@/lib/utils'

type MainProps = React.HTMLAttributes<HTMLElement>

export const Main = ({ className, children, ...props }: MainProps) => (
  <main className={cn('min-h-[calc(100vh-5rem-4rem)]', className)} {...props}>
    {children}
  </main>
)
