import { NextResponse } from "next/server"
import { withAuth } from "@/lib/api-middlewares"
import { db } from "@/lib/db"

// GET /api/dashboard/users - Get all users
export async function GET(req: Request) {
  return withAuth(async () => {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return NextResponse.json(users)
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      )
    }
  }, req)
}
