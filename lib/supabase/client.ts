"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database"

// Create a singleton Supabase client for client-side operations
let clientInstance: ReturnType<typeof createBrowserSupabaseClient> | null = null

export function createBrowserSupabaseClient() {
  // Use the environment variables from .env.local
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

export function getSupabaseBrowser() {
  if (!clientInstance) {
    clientInstance = createBrowserSupabaseClient()
  }
  return clientInstance
}

