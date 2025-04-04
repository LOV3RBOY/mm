"use server"

import { revalidatePath } from "next/cache"
import type { Model } from "@/lib/types"

// Get all models
export async function getModels(): Promise<Model[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/models`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Error fetching models:", error)
      throw new Error("Failed to fetch models")
    }

    const { models } = await response.json()
    return models
  } catch (error) {
    console.error("Unexpected error:", error)
    return []
  }
}

// Create a new model
export async function createModel(model: Omit<Model, "id">): Promise<Model | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/models`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Error creating model:", error)
      throw new Error(`Failed to create model: ${error.error || "Unknown error"}`)
    }

    const { model: createdModel } = await response.json()

    revalidatePath("/models")
    return createdModel
  } catch (error) {
    console.error("Unexpected error:", error)
    throw error
  }
}

// Delete a model
export async function deleteModel(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/models?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Error deleting model:", error)
      throw new Error("Failed to delete model")
    }

    revalidatePath("/models")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error:", error)
    throw error
  }
}

