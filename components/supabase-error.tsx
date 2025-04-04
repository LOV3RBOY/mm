"use client"

import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface SupabaseErrorProps {
  message?: string
  retry?: () => void
}

export function SupabaseError({ message, retry }: SupabaseErrorProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Database Connection Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          {message ||
            "There was an issue connecting to the database. This could be due to missing environment variables or network issues."}
        </p>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry} className="w-fit">
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

