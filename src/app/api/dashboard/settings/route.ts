import { NextResponse } from "next/server"
import { withAuth, validateRequest } from "@/lib/api-middlewares"
import { db } from "@/lib/db"
import { settingCreateSchema } from "@/lib/validations/settings"
import { getCurrentUser } from "@/lib/session"

// GET /api/dashboard/settings - Get all settings for current user
export async function GET(req: Request) {
  return withAuth(async () => {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    try {
      const settings = await db.settings.findMany({
        where: { userId: user.id },
      })

      return NextResponse.json(settings)
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch settings" },
        { status: 500 }
      )
    }
  }, req)
}

// POST /api/dashboard/settings - Create a new setting
export async function POST(req: Request) {
  return withAuth(async () => {
    const result = await validateRequest(req, settingCreateSchema)
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
      // Check if setting with this key already exists
      const existingSetting = await db.settings.findFirst({
        where: {
          userId: user.id,
          key: result.data.key,
        },
      })

      if (existingSetting) {
        return NextResponse.json(
          { error: "Setting with this key already exists" },
          { status: 400 }
        )
      }

      const setting = await db.settings.create({
        data: {
          ...result.data,
          userId: user.id,
        },
      })

      return NextResponse.json(setting, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to create setting" },
        { status: 500 }
      )
    }
  }, req)
}
