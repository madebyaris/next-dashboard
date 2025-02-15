interface DashboardShellProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
} 