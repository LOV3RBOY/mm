"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DebugEnv() {
  const [showDebug, setShowDebug] = useState(false)

  const envVars = {
    SUPABASE_URL: process.env.SUPABASE_URL ? "✅" : "❌",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅" : "❌",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "✅" : "❌",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅" : "❌",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅" : "❌",
  }

  return (
    <div className="my-4">
      <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)}>
        {showDebug ? "Hide Debug Info" : "Show Debug Info"}
      </Button>

      {showDebug && (
        <Alert className="mt-2">
          <AlertTitle>Environment Variables Status</AlertTitle>
          <AlertDescription>
            <pre className="mt-2 p-2 bg-neutral-100 rounded text-xs overflow-auto">
              {JSON.stringify(envVars, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

