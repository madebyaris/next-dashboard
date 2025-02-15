import { cn } from '@/lib/utils'

interface WidgetLoadingProps {
  className?: string
}

export function WidgetLoading({ className }: WidgetLoadingProps) {
  return (
    <div className={cn('p-6 bg-card rounded-lg border animate-pulse', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-muted rounded-lg" />
          <div className="w-24 h-4 bg-muted rounded" />
        </div>
        <div className="w-16 h-4 bg-muted rounded" />
      </div>
      <div className="mt-3">
        <div className="w-32 h-8 bg-muted rounded" />
      </div>
    </div>
  )
}

export function ChartLoading({ className }: WidgetLoadingProps) {
  return (
    <div className={cn('p-6 bg-card rounded-lg border animate-pulse', className)}>
      <div className="w-32 h-6 bg-muted rounded" />
      <div className="mt-4 h-[300px] bg-muted rounded" />
    </div>
  )
}

export function ListLoading({ className }: WidgetLoadingProps) {
  return (
    <div className={cn('p-6 bg-card rounded-lg border animate-pulse', className)}>
      <div className="w-32 h-6 bg-muted rounded" />
      <div className="mt-4 space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg" />
              <div>
                <div className="w-24 h-4 bg-muted rounded" />
                <div className="w-32 h-4 bg-muted rounded mt-2" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-4 bg-muted rounded" />
              <div className="w-16 h-6 bg-muted rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 