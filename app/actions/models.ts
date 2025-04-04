"use server"

import { revalidatePath } from "next/cache"

// Define the Model type (replace with your actual type definition if different)
interface Model {
  id: string;
  name: string;
  description?: string;
  // Add other properties as needed
}

// Set the base API URL directly
const API_BASE_URL = "https://v0-modern-model-management.vercel.app";

// Get all models
export async function getModels(): Promise<Model[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/models`, {
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
    const response = await fetch(`${API_BASE_URL}/api/models`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
    })

    if (!response.ok) {
      let errorMessage = "Unknown error";
      try {
        const error = await response.json();
        errorMessage = error.error || JSON.stringify(error);
      } catch (parseError) {
        errorMessage = response.statusText;
      }
      console.error("Error creating model:", errorMessage);
      throw new Error(`Failed to create model: ${errorMessage}`);
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
    const response = await fetch(`${API_BASE_URL}/api/models?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      let errorMessage = "Unknown error";
      try {
        const error = await response.json();
        errorMessage = error.error || JSON.stringify(error);
      } catch (parseError) {
        errorMessage = response.statusText;
      }
      console.error("Error deleting model:", errorMessage);
      throw new Error(`Failed to delete model: ${errorMessage}`);
    }

    revalidatePath("/models")
    const responseBody = await response.text();
    if (responseBody) {
      return JSON.parse(responseBody);
    }
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error)
    throw error
  }
}

