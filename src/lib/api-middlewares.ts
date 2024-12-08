import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { ZodError, ZodSchema } from "zod"

export async function withAuth(
  handler: (req: Request) => Promise<Response>,
  req: Request
) {
  const session = await getSession()

  if (!session) {
    return new NextResponse(
      JSON.stringify({
        error: "Unauthorized",
        message: "Please login to access this resource",
      }),
      { status: 401 }
    )
  }

  return handler(req)
}

export async function validateRequest<T>(
  req: Request,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const json = await req.json()
    const data = schema.parse(json)
    return { data, error: null }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        data: null,
        error: error.errors.map((e) => e.message).join(", "),
      }
    }
    return { data: null, error: "Invalid request data" }
  }
}
