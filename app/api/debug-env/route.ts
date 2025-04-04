import { NextResponse } from "next/server"
import { debugEnvironmentVariables } from "@/lib/debug-env"

export async function GET() {
  try {
    const envStatus = await debugEnvironmentVariables()

    return NextResponse.json({
      success: true,
      envStatus,
    })
  } catch (error) {
    console.error("Error in debug-env API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

