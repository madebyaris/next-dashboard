'use client'

import { Loader2 } from "lucide-react"

export function DashboardLoading() {
  return (
    <div className="flex h-[450px] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}
