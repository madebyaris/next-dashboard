'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  action?: () => void
  actionLabel?: string
}

export function EmptyState({
  title,
  description,
  action,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          {description}
        </p>
        {action && actionLabel && (
          <Button onClick={action}>
            <PlusIcon className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
