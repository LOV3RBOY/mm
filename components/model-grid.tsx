"use client"

import { useState, useEffect } from "react"
import { PlusCircle, SlidersHorizontal, X, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ModelCard from "@/components/model-card"
import AddModelModal from "@/components/add-model-modal"
import { useSearch } from "@/components/search-provider"
import { useToast } from "@/components/ui/use-toast"
import type { Model } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getModels, deleteModel } from "@/app/actions/models"

export default function ModelGrid() {
  const [models, setModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { searchQuery, setSearchQuery } = useSearch()
  const [sortBy, setSortBy] = useState<"name" | "location" | "availability">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function loadModels() {
      try {
        setIsLoading(true)
        setError(null)

        const data = await getModels()

        // If we get an empty array, it might be due to an error
        if (data.length === 0) {
          console.warn("No models returned, might be due to a connection error")
        }

        setModels(data)
      } catch (error) {
        console.error("Failed to load models:", error)
        setError("Failed to load models. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load models. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadModels()
  }, [toast])

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedModels = [...filteredModels].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "location") {
      return sortOrder === "asc" ? a.location.localeCompare(b.location) : b.location.localeCompare(a.location)
    } else {
      // Sort by availability
      if (sortOrder === "asc") {
        return a.available === b.available ? 0 : a.available ? -1 : 1
      } else {
        return a.available === b.available ? 0 : a.available ? 1 : -1
      }
    }
  })

  const addModel = (model: Omit<Model, "id">) => {
    // The actual creation happens in the modal component
    // We'll just update our local state with the new model
    setIsAddModalOpen(false)

    // Refresh the models list
    getModels()
      .then((updatedModels) => {
        setModels(updatedModels)
        toast({
          title: "Model Added",
          description: `${model.name} has been added to your roster.`,
        })
      })
      .catch((error) => {
        console.error("Failed to refresh models:", error)
        toast({
          title: "Error",
          description: "Failed to refresh models. Please reload the page.",
          variant: "destructive",
        })
      })
  }

  const removeModel = async (id: string) => {
    const modelToRemove = models.find((model) => model.id === id)

    try {
      await deleteModel(id)

      // Update local state
      setModels(models.filter((model) => model.id !== id))

      if (modelToRemove) {
        toast({
          title: "Model Removed",
          description: `${modelToRemove.name} has been removed from your roster.`,
        })
      }
    } catch (error) {
      console.error("Failed to delete model:", error)
      toast({
        title: "Error",
        description: "Failed to remove model. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSort = (by: "name" | "location" | "availability") => {
    if (sortBy === by) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(by)
      setSortOrder("asc")
    }
  }

  return (
    <div>
      <div className="bg-black text-white p-4 rounded-lg mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-64 md:w-80">
            <Input
              type="text"
              placeholder="Search by name or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-800 border-none focus-visible:ring-neutral-700 pr-8 text-white placeholder:text-neutral-500 pl-8"
              aria-label="Search models"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                  aria-label="Sort models"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-black text-white border-neutral-800">
                <DropdownMenuItem onClick={() => handleSort("name")} className="hover:bg-neutral-800">
                  Sort by Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("location")} className="hover:bg-neutral-800">
                  Sort by Location {sortBy === "location" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("availability")} className="hover:bg-neutral-800">
                  Sort by Availability {sortBy === "availability" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white text-black hover:bg-neutral-200 transition-colors"
              aria-label="Add new model"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Model
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <p className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
          >
            Reload Page
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12" aria-live="polite">
          <Loader2 className="h-8 w-8 animate-spin text-black mb-4" />
          <p className="text-neutral-500">Loading models...</p>
        </div>
      ) : sortedModels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center" aria-live="polite">
          <p className="text-neutral-500 mb-4">
            {searchQuery ? "No models found matching your search criteria." : "No models found. Add your first model."}
          </p>
          {searchQuery ? (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Clear Search
            </Button>
          ) : (
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-black text-white hover:bg-neutral-800">
              Add Your First Model
            </Button>
          )}
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
          role="region"
          aria-label="Models grid"
        >
          {sortedModels.map((model) => (
            <ModelCard key={model.id} model={model} onRemove={() => removeModel(model.id)} />
          ))}
        </div>
      )}

      <AddModelModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addModel} />
    </div>
  )
}

