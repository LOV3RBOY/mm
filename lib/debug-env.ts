"use server"

export async function debugEnvironmentVariables() {
  return {
    // Server-side variables
    SUPABASE_URL: process.env.SUPABASE_URL ? "Available" : "Missing",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "Available" : "Missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Available" : "Missing",
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET ? "Available" : "Missing",

    // Client-side variables
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Available" : "Missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Available" : "Missing",
  }
}

