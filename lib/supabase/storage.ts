"use server"

import { createServerSupabaseClient } from "./server"
import { v4 as uuidv4 } from "uuid"

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function uploadModelImage(file: File): Promise<string> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the 5MB limit")
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed")
    }

    const supabase = createServerSupabaseClient()

    // Generate a unique file name to prevent collisions
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `models/${fileName}`

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from("model-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading image:", error)
      throw new Error("Failed to upload image")
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("model-images").getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error("Error in uploadModelImage:", error)
    throw error
  }
}

export async function deleteModelImage(imageUrl: string): Promise<void> {
  try {
    // Extract the path from the URL
    const supabase = createServerSupabaseClient()
    const url = new URL(imageUrl)
    const pathMatch = url.pathname.match(/\/model-images\/(.+)/)

    if (!pathMatch || !pathMatch[1]) {
      console.warn("Could not extract path from URL:", imageUrl)
      return
    }

    const path = pathMatch[1]

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage.from("model-images").remove([path])

    if (error) {
      console.error("Error deleting image:", error)
      throw new Error("Failed to delete image")
    }
  } catch (error) {
    console.error("Error in deleteModelImage:", error)
    throw error
  }
}

