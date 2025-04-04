import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database"

// Create a single supabase client for server-side operations
export function createServerSupabaseClient() {
  // Use the environment variables from .env.local
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}

