import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database"

// Create a hardcoded Supabase client for testing
export function createHardcodedSupabaseClient() {
  // These values are from the environment variables in v0
  const supabaseUrl = "https://qdxoqnfbxnbpbijmgwpj.supabase.co"
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeG9xbmZieG5icGJpam1nd3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NzQ0NzcsImV4cCI6MjAyODM1MDQ3N30.Nh83ebqzf9Yt_1GA6uWxMEAJjWD2Gf2QMaYjUQvqvlM"

  return createClient<Database>(supabaseUrl, supabaseKey)
}

