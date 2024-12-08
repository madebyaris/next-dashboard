import { NextResponse } from "next/server"
import { withAuth } from "@/lib/api-middlewares"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  return withAuth(async () => {
    try {
      const [
        totalUsers,
        totalPosts,
        totalSettings,
        recentUsers,
        recentPosts,
      ] = await Promise.all([
        db.user.count(),
        db.post.count(),
        db.settings.count(),
        db.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        }),
        db.post.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
      ])

      return NextResponse.json({
        stats: {
          totalUsers,
          totalPosts,
          totalSettings,
        },
        recentUsers,
        recentPosts,
      })
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch dashboard stats" },
        { status: 500 }
      )
    }
  }, req)
}
