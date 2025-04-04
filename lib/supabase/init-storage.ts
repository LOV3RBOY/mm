"use server"

import { createServerSupabaseClient } from "./server"

interface InitializeStorageResult {
  success: boolean
  message?: string
  error?: string | Error
}

export async function initializeStorage(): Promise<InitializeStorageResult> {
  try {
    console.log("Initializing storage...")

    // Try to create the Supabase client
    let supabase
    try {
      supabase = createServerSupabaseClient()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error creating client"
      console.error("Failed to create Supabase client:", errorMessage)
      return { success: false, error: errorMessage }
    }

    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      const errorMessage = bucketsError.message || "Unknown error listing buckets"
      console.error("Error listing buckets:", errorMessage)
      return { success: false, error: errorMessage }
    }

    // If the model-images bucket doesn't exist, create it
    const bucketExists = buckets.some((bucket) => bucket.name === "model-images")
    const bucketName = "model-images"

    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' does not exist. Creating...`)
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      })

      if (createError) {
        // Check if the error is because the bucket already exists (race condition?)
        if (createError.message.includes("already exists")) {
          const message = `Bucket '${bucketName}' already exists (likely created concurrently).`
          console.log(message)
          return { success: true, message }
        }

        const errorMessage = createError.message || `Unknown error creating bucket ${bucketName}`
        console.error(`Error creating bucket '${bucketName}':`, errorMessage)
        return { success: false, error: errorMessage }
      }

      const successMessage = `Successfully created bucket '${bucketName}'.`
      console.log(successMessage)
      return { success: true, message: successMessage }
    } else {
      const message = `Bucket '${bucketName}' already exists.`
      console.log(message)
      return { success: true, message }
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error during storage initialization"
    console.error("Error initializing storage:", errorMessage)
    return { success: false, error: errorMessage }
  }
}
