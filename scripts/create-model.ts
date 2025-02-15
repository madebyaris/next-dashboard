import fs from 'fs'
import path from 'path'
import { z } from 'zod'

const modelSchema = z.object({
  name: z.string().min(1, 'Model name is required'),
  fields: z.string().min(1, 'Fields are required'),
})

const templates = {
  types: (name: string, fields: string) => `import { z } from 'zod'

export const ${name}Schema = z.object({
  ${fields}
})

export type ${name} = z.infer<typeof ${name}Schema>
`,

  model: (name: string, fields: string) => `import { prisma } from '@/lib/prisma'
import { ${name}Schema, type ${name} } from './types'

export async function getAll${name}s(options: {
  page?: number
  limit?: number
  where?: any
  orderBy?: any
} = {}) {
  const { page = 1, limit = 10, where = {}, orderBy = { createdAt: 'desc' } } = options

  const skip = (page - 1) * limit

  const [total, items] = await Promise.all([
    prisma.${name.toLowerCase()}.count({ where }),
    prisma.${name.toLowerCase()}.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
  ])

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export async function get${name}ById(id: string) {
  return await prisma.${name.toLowerCase()}.findUnique({
    where: { id },
  })
}

export async function create${name}(data: Omit<${name}, 'id' | 'createdAt' | 'updatedAt'>) {
  const validated = ${name}Schema.parse(data)

  return await prisma.${name.toLowerCase()}.create({
    data: validated,
  })
}

export async function update${name}(id: string, data: Partial<${name}>) {
  const validated = ${name}Schema.partial().parse(data)

  return await prisma.${name.toLowerCase()}.update({
    where: { id },
    data: validated,
  })
}

export async function delete${name}(id: string) {
  return await prisma.${name.toLowerCase()}.delete({
    where: { id },
  })
}
`,

  api: (name: string) => `import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  getAll${name}s,
  get${name}ById,
  create${name},
  update${name},
  delete${name}
} from '@/models/${name.toLowerCase()}'
import { ${name}Schema } from '@/models/${name.toLowerCase()}/types'
import { 
  successResponse, 
  errorResponse, 
  AUTH_ERROR,
  FORBIDDEN_ERROR,
  VALIDATION_ERROR,
  NOT_FOUND_ERROR
} from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10

    const result = await getAll${name}s({ page, limit })
    return successResponse(result)
  } catch (error) {
    console.error('[${name.toUpperCase()}_GET]', error)
    return errorResponse('Failed to fetch ${name.toLowerCase()}s')
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)
    if (!['ADMIN', 'EDITOR'].includes(session.user.role || '')) {
      return errorResponse(FORBIDDEN_ERROR, 403)
    }

    const json = await request.json()
    const validatedData = ${name}Schema.parse(json)

    const item = await create${name}(validatedData)
    return successResponse(item, '${name} created successfully')
  } catch (error) {
    console.error('[${name.toUpperCase()}_POST]', error)
    return errorResponse('Failed to create ${name.toLowerCase()}')
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)
    if (!['ADMIN', 'EDITOR'].includes(session.user.role || '')) {
      return errorResponse(FORBIDDEN_ERROR, 403)
    }

    const json = await request.json()
    const { id, ...data } = json

    if (!id) return errorResponse('ID is required', 400)

    const existing = await get${name}ById(id)
    if (!existing) return errorResponse(NOT_FOUND_ERROR, 404)

    const validatedData = ${name}Schema.partial().parse(data)
    const updated = await update${name}(id, validatedData)

    return successResponse(updated, '${name} updated successfully')
  } catch (error) {
    console.error('[${name.toUpperCase()}_PUT]', error)
    return errorResponse('Failed to update ${name.toLowerCase()}')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse(AUTH_ERROR, 401)
    if (session.user.role !== 'ADMIN') {
      return errorResponse(FORBIDDEN_ERROR, 403)
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return errorResponse('ID is required', 400)

    const existing = await get${name}ById(id)
    if (!existing) return errorResponse(NOT_FOUND_ERROR, 404)

    await delete${name}(id)
    return successResponse(null, '${name} deleted successfully')
  } catch (error) {
    console.error('[${name.toUpperCase()}_DELETE]', error)
    return errorResponse('Failed to delete ${name.toLowerCase()}')
  }
}
`
}

function createDirectoryIfNotExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function createModel() {
  const args = process.argv.slice(2)
  const modelData: Record<string, string> = {}

  // Parse command line arguments
  args.forEach(arg => {
    const [key, value] = arg.split('=')
    if (key.startsWith('--')) {
      modelData[key.slice(2)] = value
    }
  })

  try {
    // Validate model data
    const validatedData = modelSchema.parse(modelData)
    const { name, fields } = validatedData

    // Create model directory
    const modelDir = path.join(process.cwd(), 'src', 'models', name.toLowerCase())
    createDirectoryIfNotExists(modelDir)

    // Create model files
    fs.writeFileSync(
      path.join(modelDir, 'types.ts'),
      templates.types(name, fields)
    )

    fs.writeFileSync(
      path.join(modelDir, 'index.ts'),
      templates.model(name, fields)
    )

    // Create API route
    const apiDir = path.join(process.cwd(), 'src', 'app', 'api', name.toLowerCase())
    createDirectoryIfNotExists(apiDir)
    fs.writeFileSync(
      path.join(apiDir, 'route.ts'),
      templates.api(name)
    )

    console.log('Model created successfully:')
    console.log(`Model files created in src/models/${name.toLowerCase()}/`)
    console.log(`API route created in src/app/api/${name.toLowerCase()}/route.ts`)
    console.log('\nFiles created:')
    console.log(`- types.ts`)
    console.log(`- index.ts`)
    console.log(`- route.ts`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
    } else {
      console.error('Error creating model:', error)
    }
    process.exit(1)
  }
}

createModel() 