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
  page: (name: string, title: string, description: string = '') => `import { DashboardShell } from '@/components/dashboard/shell'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { ${name.toLowerCase()} } from '@/resources/${name.toLowerCase()}'

export const metadata = {
  title: '${title}',
  description: '${description}',
}

export default async function ${name}Page() {
  const data = await ${name.toLowerCase()}.actions.list()

  return (
    <DashboardShell
      title="${title}"
      description="${description}"
      actions={
        <Button asChild>
          <Link href="/dashboard/${name.toLowerCase()}/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      }
    >
      <${name}List data={data} />
    </DashboardShell>
  )
}

function ${name}List({ data }: { data: any[] }) {
  return (
    <DataTable
      columns={${name.toLowerCase()}.list.columns}
      data={data}
      searchKey="title"
      pageSize={10}
    />
  )
}`,

  newPage: (name: string, title: string) => `import { DashboardShell } from '@/components/dashboard/shell'
import { ${name}Form } from '@/resources/${name.toLowerCase()}/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ${name.toLowerCase()} } from '@/resources/${name.toLowerCase()}'

export default async function New${name}Page() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      published: formData.get('published') === 'true',
    }

    await ${name.toLowerCase()}.actions.create(data)
  }

  return (
    <DashboardShell
      title="Create ${title}"
      description="Create a new ${title.toLowerCase()}"
    >
      <${name}Form onSubmit={handleSubmit} />
    </DashboardShell>
  )
}`,

  detailPage: (name: string, title: string) => `import { DashboardShell } from '@/components/dashboard/shell'
import { ${name}Form } from '@/resources/${name.toLowerCase()}/components'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ${name.toLowerCase()} } from '@/resources/${name.toLowerCase()}'

type PageParams = Promise<{ ${name.toLowerCase()}Id: string }>

export default async function Edit${name}Page({ params }: { params: PageParams }) {
  const { ${name.toLowerCase()}Id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const item = await ${name.toLowerCase()}.actions.getById(${name.toLowerCase()}Id)

  async function handleSubmit(formData: FormData) {
    'use server'
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }
    
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      published: formData.get('published') === 'true',
    }

    await ${name.toLowerCase()}.actions.update(${name.toLowerCase()}Id, data)
  }

  return (
    <DashboardShell
      title="Edit ${title}"
      description="Edit your ${title.toLowerCase()}"
    >
      <${name}Form 
        defaultValues={item} 
        onSubmit={handleSubmit}
      />
    </DashboardShell>
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

    // Create new page
    const newDir = path.join(pageDir, 'new')
    createDirectoryIfNotExists(newDir)
    fs.writeFileSync(
      path.join(newDir, 'page.tsx'),
      templates.newPage(pageName, title)
    )

    // Create detail page
    const detailDir = path.join(pageDir, `[${name.toLowerCase()}Id]`)
    createDirectoryIfNotExists(detailDir)
    fs.writeFileSync(
      path.join(detailDir, 'page.tsx'),
      templates.detailPage(pageName, title)
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
    console.log(`- new/page.tsx`)
    console.log(`- [${name.toLowerCase()}Id]/page.tsx`)
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