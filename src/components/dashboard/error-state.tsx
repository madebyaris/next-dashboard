'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description?: string
  retry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'There was a problem with your request.',
  retry,
}: ErrorStateProps) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          {description}
        </p>
        {retry && (
          <Button onClick={retry}>
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}
