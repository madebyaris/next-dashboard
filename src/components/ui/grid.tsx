import { cn } from '@/lib/utils'

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Grid({ children, className, ...props }: GridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 