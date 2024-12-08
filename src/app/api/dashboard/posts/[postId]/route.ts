import { NextResponse } from "next/server"
import { withAuth, validateRequest } from "@/lib/api-middlewares"
import { db } from "@/lib/db"
import { postUpdateSchema } from "@/lib/validations/post"
import { getCurrentUser } from "@/lib/session"

// GET /api/dashboard/posts/[postId] - Get a single post
export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  return withAuth(async () => {
    try {
      const post = await db.post.findUnique({
        where: { id: params.postId },
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

      if (!post) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(post)
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch post" },
        { status: 500 }
      )
    }
  }, req)
}

// PATCH /api/dashboard/posts/[postId] - Update a post
export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  return withAuth(async () => {
    const result = await validateRequest(req, postUpdateSchema)
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
      const post = await db.post.findUnique({
        where: { id: params.postId },
      })

      if (!post) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        )
      }

      // Check if user is the author
      if (post.authorId !== user.id) {
        return NextResponse.json(
          { error: "Not authorized to update this post" },
          { status: 403 }
        )
      }

      const updatedPost = await db.post.update({
        where: { id: params.postId },
        data: result.data,
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

      return NextResponse.json(updatedPost)
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update post" },
        { status: 500 }
      )
    }
  }, req)
}

// DELETE /api/dashboard/posts/[postId] - Delete a post
export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  return withAuth(async () => {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    try {
      const post = await db.post.findUnique({
        where: { id: params.postId },
      })

      if (!post) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        )
      }

      // Check if user is the author
      if (post.authorId !== user.id) {
        return NextResponse.json(
          { error: "Not authorized to delete this post" },
          { status: 403 }
        )
      }

      await db.post.delete({
        where: { id: params.postId },
      })

      return NextResponse.json(
        { message: "Post deleted successfully" },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      )
    }
  }, req)
}
