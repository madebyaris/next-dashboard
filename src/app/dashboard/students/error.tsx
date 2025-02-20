'use client'

import { ErrorState } from '@/components/dashboard/error-state'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorState
      title="Something went wrong!"
      description={error.message}
      retry={reset}
    />
  )
}