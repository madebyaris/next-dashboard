import fs from 'fs'
import path from 'path'
import { z } from 'zod'

const pageSchema = z.object({
  name: z.string().min(1, 'Page name is required'),
  route: z.string().min(1, 'Route is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

const templates = {
  page: (name: string, title: string, description: string = '') => `import { Suspense } from 'react'
import { PageHeader } from '@/components/dashboard/page-header'
import { EmptyState } from '@/components/dashboard/empty-state'
import { DashboardLoading } from '@/components/dashboard/loading'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export const metadata = {
  title: '${title}',
  description: '${description}',
}

export default async function ${name}Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="${title}"
        text="${description}"
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </PageHeader>

      <Suspense fallback={<DashboardLoading />}>
        <EmptyState
          title="No items found"
          description="Get started by creating a new item."
          icon={PlusCircle}
        />
      </Suspense>
    </div>
  )
}`,

  loading: `import { DashboardLoading } from '@/components/dashboard/loading'

export default function Loading() {
  return <DashboardLoading />
}`,

  error: `'use client'

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
}`,
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function createDirectoryIfNotExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function createPage() {
  const args = process.argv.slice(2)
  const pageData: Record<string, string> = {}

  // Parse command line arguments
  args.forEach(arg => {
    const [key, value] = arg.split('=')
    if (key.startsWith('--')) {
      pageData[key.slice(2)] = value
    }
  })

  try {
    // Validate page data
    const validatedData = pageSchema.parse(pageData)
    const { name, route, title, description = '' } = validatedData

    // Create page directory
    const pageDir = path.join(process.cwd(), 'src', 'app', 'dashboard', route)
    createDirectoryIfNotExists(pageDir)

    // Create page files
    const pageName = capitalizeFirstLetter(name)
    
    // Create page.tsx
    fs.writeFileSync(
      path.join(pageDir, 'page.tsx'),
      templates.page(pageName, title, description)
    )

    // Create loading.tsx
    fs.writeFileSync(
      path.join(pageDir, 'loading.tsx'),
      templates.loading
    )

    // Create error.tsx
    fs.writeFileSync(
      path.join(pageDir, 'error.tsx'),
      templates.error
    )

    console.log('Page created successfully:')
    console.log(`Route: /dashboard/${route}`)
    console.log(`Files created:`)
    console.log(`- page.tsx`)
    console.log(`- loading.tsx`)
    console.log(`- error.tsx`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
    } else {
      console.error('Error creating page:', error)
    }
    process.exit(1)
  }
}

createPage() 