"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function DebugEnvDisplay() {
  const [showDebug, setShowDebug] = useState(false)
  const [envStatus, setEnvStatus] = useState<Record<string, string> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkEnv = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/debug-env")
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch environment status")
      }

      setEnvStatus(data.envStatus)
    } catch (err) {
      console.error("Failed to check environment variables:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (showDebug && !envStatus && !isLoading) {
      checkEnv()
    }
  }, [showDebug, envStatus, isLoading])

  return (
    <div className="my-4">
      <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)}>
        {showDebug ? "Hide Debug Info" : "Show Debug Info"}
      </Button>

      {showDebug && (
        <Alert className="mt-2">
          <AlertTitle>Environment Variables Status</AlertTitle>
          <AlertDescription>
            {isLoading ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking environment variables...</span>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : envStatus ? (
              <pre className="mt-2 p-2 bg-neutral-100 rounded text-xs overflow-auto">
                {JSON.stringify(envStatus, null, 2)}
              </pre>
            ) : (
              <div>No environment data available</div>
            )}

            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={checkEnv} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

