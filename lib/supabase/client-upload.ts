"use client"

export async function uploadImageClient(file: File): Promise<string> {
  try {
    if (!file) {
      throw new Error("No file provided")
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds the 5MB limit")
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed")
    }

    // Create form data for the file
    const formData = new FormData()
    formData.append("file", file)

    // Upload the file using our API route
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Error uploading image:", error)
      throw new Error(`Failed to upload image: ${error.error || "Unknown error"}`)
    }

    const { url } = await response.json()
    return url
  } catch (error) {
    console.error("Error in uploadImageClient:", error)
    // Return placeholder image on any error
    return "/placeholder.svg?height=400&width=300"
  }
}

