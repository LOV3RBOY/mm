import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { mapDatabaseModelToModel } from "@/lib/types"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("models").select("*").order("name")

    if (error) {
      console.error("Error fetching models:", error)
      return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 })
    }

    const models = data.map(mapDatabaseModelToModel)

    return NextResponse.json({ models })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Check if the image is a placeholder
    const imageUrl = body.image === "/placeholder.svg?height=400&width=300" ? null : body.image

    const { data, error } = await supabase
      .from("models")
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        location: body.location,
        image_url: imageUrl,
        available: body.available,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating model:", error)
      return NextResponse.json({ error: "Failed to create model" }, { status: 500 })
    }

    return NextResponse.json({ model: mapDatabaseModelToModel(data) })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Model ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("models").delete().eq("id", id)

    if (error) {
      console.error("Error deleting model:", error)
      return NextResponse.json({ error: "Failed to delete model" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

