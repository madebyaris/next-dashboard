import { NextResponse } from "next/server"
import { withAuth, validateRequest } from "@/lib/api-middlewares"
import { db } from "@/lib/db"
import { settingUpdateSchema } from "@/lib/validations/settings"
import { getCurrentUser } from "@/lib/session"

// GET /api/dashboard/settings/[key] - Get a single setting
export async function GET(
  req: Request,
  { params }: { params: { key: string } }
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
      const setting = await db.settings.findFirst({
        where: {
          userId: user.id,
          key: params.key,
        },
      })

      if (!setting) {
        return NextResponse.json(
          { error: "Setting not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(setting)
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch setting" },
        { status: 500 }
      )
    }
  }, req)
}

// PATCH /api/dashboard/settings/[key] - Update a setting
export async function PATCH(
  req: Request,
  { params }: { params: { key: string } }
) {
  return withAuth(async () => {
    const result = await validateRequest(req, settingUpdateSchema)
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
      const setting = await db.settings.findFirst({
        where: {
          userId: user.id,
          key: params.key,
        },
      })

      if (!setting) {
        return NextResponse.json(
          { error: "Setting not found" },
          { status: 404 }
        )
      }

      const updatedSetting = await db.settings.update({
        where: { id: setting.id },
        data: result.data,
      })

      return NextResponse.json(updatedSetting)
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update setting" },
        { status: 500 }
      )
    }
  }, req)
}

// DELETE /api/dashboard/settings/[key] - Delete a setting
export async function DELETE(
  req: Request,
  { params }: { params: { key: string } }
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
      const setting = await db.settings.findFirst({
        where: {
          userId: user.id,
          key: params.key,
        },
      })

      if (!setting) {
        return NextResponse.json(
          { error: "Setting not found" },
          { status: 404 }
        )
      }

      await db.settings.delete({
        where: { id: setting.id },
      })

      return NextResponse.json(
        { message: "Setting deleted successfully" },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete setting" },
        { status: 500 }
      )
    }
  }, req)
}
