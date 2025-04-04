import { NextResponse } from "next/server"
import { initializeStorage } from "@/lib/supabase/init-storage"

export async function GET() {
  try {
    const result = await initializeStorage()

    if (!result.success) {
      console.error("Failed to initialize storage:", result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error instanceof Error ? result.error.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: result.message })
  } catch (error) {
    console.error("Error in init-storage API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

