"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface SupabaseProviderProps {
  children: React.ReactNode
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function initStorage() {
      try {
        const response = await fetch("/api/init-storage")
        const data = await response.json()

        if (!data.success) {
          console.error("Failed to initialize storage:", data.error)
          setError(data.error || "Failed to initialize storage")
          toast({
            title: "Storage Initialization Failed",
            description: "There was an issue setting up storage. Some features may not work correctly.",
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Error initializing storage:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
        toast({
          title: "Storage Initialization Failed",
          description: "There was an issue setting up storage. Some features may not work correctly.",
          variant: "destructive",
        })
      } finally {
        setIsInitialized(true)
      }
    }

    initStorage()
  }, [toast])

  if (error) {
    console.warn("Storage initialization error:", error)
    // Continue rendering the app even with errors
  }

  return <>{children}</>
}

