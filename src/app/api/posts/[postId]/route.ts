import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { postCreateSchema } from '@/lib/validations/post'

interface RouteParams {
  params: {
    postId: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: {
        id: params.postId,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!post) {
      return new NextResponse('Not Found', { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('[POST_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await request.json()
    const body = postCreateSchema.parse(json)

    const post = await prisma.post.update({
      where: {
        id: params.postId,
      },
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('[POST_PATCH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await prisma.post.delete({
      where: {
        id: params.postId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[POST_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
