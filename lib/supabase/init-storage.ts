"use server"

import { createServerSupabaseClient } from "./server"

export async function initializeStorage() {
  try {
    console.log("Initializing storage...")

    // Try to create the Supabase client
    let supabase
    try {
      supabase = createServerSupabaseClient()
    } catch (error) {
      console.error("Failed to create Supabase client:", error)
      return false
    }

    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return false
    }

    // If the model-images bucket doesn't exist, create it
    const bucketExists = buckets.some((bucket) => bucket.name === "model-images")

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket("model-images", {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      })

      if (createError) {
        // Check if the error is because the bucket already exists
        if (createError.message.includes("already exists")) {
          console.log("Bucket 'model-images' already exists")
          return true
        }

        console.error("Error creating bucket:", createError)
        return false
      }

      console.log("Created model-images bucket")
    } else {
      console.log("Bucket 'model-images' already exists")
    }

    return true
  } catch (error) {
    console.error("Error initializing storage:", error)
    return false
  }
}

