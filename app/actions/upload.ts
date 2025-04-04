"use server"

import { uploadModelImage } from "@/lib/supabase/storage"

export async function uploadImage(formData: FormData): Promise<{ url: string }> {
  try {
    const file = formData.get("file") as File

    if (!file) {
      throw new Error("No file provided")
    }

    const url = await uploadModelImage(file)
    return { url }
  } catch (error) {
    console.error("Error in uploadImage action:", error)
    throw error
  }
}

