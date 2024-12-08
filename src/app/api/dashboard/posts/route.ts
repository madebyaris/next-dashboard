import { NextResponse } from "next/server"
import { withAuth, validateRequest } from "@/lib/api-middlewares"
import { db } from "@/lib/db"
import { postCreateSchema } from "@/lib/validations/post"
import { getCurrentUser } from "@/lib/session"

// GET /api/dashboard/posts - Get all posts
export async function GET(req: Request) {
  return withAuth(async () => {
    try {
      const posts = await db.post.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return NextResponse.json(posts)
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: 500 }
      )
    }
  }, req)
}

// POST /api/dashboard/posts - Create a new post
export async function POST(req: Request) {
  return withAuth(async () => {
    const result = await validateRequest(req, postCreateSchema)
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    try {
      const post = await db.post.create({
        data: {
          ...result.data,
          authorId: user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json(post, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      )
    }
  }, req)
}
