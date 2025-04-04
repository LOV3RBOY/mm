"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, Mail, MapPin, Phone, Trash2 } from "lucide-react"
import type { Model } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface ModelCardProps {
  model: Model
  onRemove: () => void
}

export default function ModelCard({ model, onRemove }: ModelCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Handle image loading errors
  const handleImageError = () => {
    console.error(`Failed to load image: ${model.image}`)
    setImageError(true)
    setImageLoading(false)
  }

  // Handle image load success
  const handleImageLoad = () => {
    setImageLoading(false)
  }

  // Use placeholder if the image URL is invalid or fails to load
  const imageUrl =
    imageError || !model.image || model.image.includes("null") ? "/placeholder.svg?height=400&width=300" : model.image

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden transition-all duration-300 group hover:shadow-md border border-neutral-200"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setExpanded(!expanded)
          e.preventDefault()
        }
      }}
      role="article"
      aria-label={`Model: ${model.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`Photo of ${model.name}`}
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          priority={false}
          unoptimized={true} // Add this to bypass image optimization which can cause CORS issues
        />
        <div className="absolute top-2 right-2">
          <div
            className={`h-2 w-2 rounded-full ${model.available ? "bg-green-500" : "bg-neutral-300"}`}
            title={model.available ? "Available" : "Unavailable"}
          >
            <span className="sr-only">{model.available ? "Available" : "Unavailable"}</span>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium text-sm tracking-tight">{model.name}</h3>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-neutral-400 hover:text-black transition-colors rounded-full hover:bg-neutral-100 h-6 w-6 flex items-center justify-center"
            aria-expanded={expanded}
            aria-label={expanded ? "Hide details" : "Show details"}
            aria-controls={`details-${model.id}`}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              id={`details-${model.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 pt-2 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-neutral-400" aria-hidden="true" />
                <span>{model.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-neutral-400" aria-hidden="true" />
                <span>{model.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-neutral-400" aria-hidden="true" />
                <span>{model.location}</span>
              </div>
              <div className="pt-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-auto text-xs"
                      aria-label={`Remove ${model.name}`}
                    >
                      <Trash2 size={12} className="mr-1" aria-hidden="true" />
                      <span>Remove</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md border border-neutral-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Model</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {model.name} from your roster? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-black text-black hover:bg-black hover:text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={onRemove} className="bg-black text-white hover:bg-neutral-800">
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

