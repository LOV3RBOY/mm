"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DirectEnvCheck() {
  const [showDebug, setShowDebug] = useState(false)

  // Client-side environment variables
  const clientEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Available" : "Missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Available" : "Missing",
  }

  return (
    <div className="my-4">
      <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)}>
        {showDebug ? "Hide Client Env" : "Show Client Env"}
      </Button>

      {showDebug && (
        <Alert className="mt-2">
          <AlertTitle>Client-Side Environment Variables</AlertTitle>
          <AlertDescription>
            <pre className="mt-2 p-2 bg-neutral-100 rounded text-xs overflow-auto">
              {JSON.stringify(clientEnvVars, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

