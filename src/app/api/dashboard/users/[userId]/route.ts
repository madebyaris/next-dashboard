import { NextResponse } from "next/server"
import { withAuth, validateRequest } from "@/lib/api-middlewares"
import { db } from "@/lib/db"
import { userUpdateSchema } from "@/lib/validations/user"
import bcrypt from "bcrypt"

// GET /api/dashboard/users/[userId] - Get a single user
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  return withAuth(async () => {
    try {
      const user = await db.user.findUnique({
        where: { id: params.userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(user)
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      )
    }
  }, req)
}

// PATCH /api/dashboard/users/[userId] - Update a user
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  return withAuth(async () => {
    const result = await validateRequest(req, userUpdateSchema)
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    const { data } = result
    try {
      // If password is being updated, hash it
      const updateData = {
        ...data,
        ...(data.password && {
          password: await bcrypt.hash(data.password, 10),
        }),
      }

      const user = await db.user.update({
        where: { id: params.userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return NextResponse.json(user)
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      )
    }
  }, req)
}

// DELETE /api/dashboard/users/[userId] - Delete a user
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  return withAuth(async () => {
    try {
      await db.user.delete({
        where: { id: params.userId },
      })

      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      )
    }
  }, req)
}
