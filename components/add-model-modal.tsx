"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, Loader2 } from "lucide-react"
import type { Model } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { createModel } from "@/app/actions/models"
import { useToast } from "@/components/ui/use-toast"
import { uploadImageClient } from "@/lib/supabase/client-upload"

interface AddModelModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (model: Omit<Model, "id">) => void
}

export default function AddModelModal({ isOpen, onClose, onAdd }: AddModelModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [available, setAvailable] = useState(true)
  const [image, setImage] = useState("/placeholder.svg?height=400&width=300")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Valid email is required"
    if (!phone.trim()) newErrors.phone = "Phone is required"
    if (!location.trim()) newErrors.location = "Location is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsSubmitting(true)

      // Upload the image if a new one was selected
      let imageUrl = image
      if (imageFile && image !== "/placeholder.svg?height=400&width=300") {
        try {
          setIsUploading(true)
          // Show upload progress
          setUploadProgress(10)
          imageUrl = await uploadImageClient(imageFile)
          setUploadProgress(100)
        } catch (error) {
          console.error("Failed to upload image:", error)
          toast({
            title: "Image Upload Failed",
            description: "Could not upload the image. Using placeholder instead.",
            variant: "destructive",
          })
          // Continue with placeholder image
          imageUrl = "/placeholder.svg?height=400&width=300"
        } finally {
          setIsUploading(false)
        }
      }

      // Create the model in the database
      const newModel = {
        name,
        email,
        phone,
        location,
        available,
        image: imageUrl,
      }

      try {
        await createModel(newModel)

        // Call the onAdd callback to update the UI
        onAdd(newModel)

        // Reset form
        setName("")
        setEmail("")
        setPhone("")
        setLocation("")
        setAvailable(true)
        setImage("/placeholder.svg?height=400&width=300")
        setImageFile(null)
        setUploadProgress(0)
        setErrors({})
      } catch (error) {
        console.error("Failed to create model:", error)
        toast({
          title: "Error",
          description: "Failed to add model. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Only image files are allowed",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)

    // Create a local preview
    const objectUrl = URL.createObjectURL(file)
    setImage(objectUrl)

    // Simulate upload progress for UI feedback only
    setIsUploading(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)
      }
    }, 100)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-md border border-neutral-200"
        aria-labelledby="add-model-title"
        aria-describedby="add-model-description"
      >
        <DialogHeader className="bg-black text-white p-4 -mx-6 -mt-6 rounded-t-lg">
          <DialogTitle id="add-model-title" className="text-xl font-light tracking-tight">
            Add New Model
          </DialogTitle>
          <DialogDescription id="add-model-description" className="text-neutral-400 text-sm">
            Fill in the details below to add a new model to your roster.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-40 mb-3 bg-neutral-100 rounded-md overflow-hidden border border-neutral-200">
              <Image
                src={image || "/placeholder.svg"}
                alt="Model preview"
                fill
                className="object-cover"
                unoptimized={true}
              />
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={isUploading || isSubmitting}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                aria-label="Upload model photo"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Upload className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="w-16 h-1 bg-white/30 rounded-full mt-2">
                      <div className="h-full bg-white rounded-full" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <Upload className="h-6 w-6 text-white" />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                aria-label="Upload model photo"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileInput}
              disabled={isUploading || isSubmitting}
              className="text-xs border-black text-black hover:bg-black hover:text-white"
            >
              {isUploading ? `Uploading... ${uploadProgress}%` : "Upload Photo"}
            </Button>
            <p className="text-xs text-neutral-500 mt-1">Max size: 5MB</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) {
                    const newErrors = { ...errors }
                    delete newErrors.name
                    setErrors(newErrors)
                  }
                }}
                className={
                  errors.name
                    ? "border-red-300 focus-visible:ring-red-200"
                    : "border-neutral-300 focus-visible:border-black"
                }
                placeholder="Enter full name"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.name && (
                <motion.p
                  id="name-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500"
                  role="alert"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) {
                    const newErrors = { ...errors }
                    delete newErrors.email
                    setErrors(newErrors)
                  }
                }}
                className={
                  errors.email
                    ? "border-red-300 focus-visible:ring-red-200"
                    : "border-neutral-300 focus-visible:border-black"
                }
                placeholder="email@example.com"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.email && (
                <motion.p
                  id="email-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500"
                  role="alert"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (errors.phone) {
                    const newErrors = { ...errors }
                    delete newErrors.phone
                    setErrors(newErrors)
                  }
                }}
                className={
                  errors.phone
                    ? "border-red-300 focus-visible:ring-red-200"
                    : "border-neutral-300 focus-visible:border-black"
                }
                placeholder="+1 (555) 123-4567"
                aria-required="true"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <motion.p
                  id="phone-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500"
                  role="alert"
                >
                  {errors.phone}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  if (errors.location) {
                    const newErrors = { ...errors }
                    delete newErrors.location
                    setErrors(newErrors)
                  }
                }}
                className={
                  errors.location
                    ? "border-red-300 focus-visible:ring-red-200"
                    : "border-neutral-300 focus-visible:border-black"
                }
                placeholder="City, Country"
                aria-required="true"
                aria-invalid={!!errors.location}
                aria-describedby={errors.location ? "location-error" : undefined}
                disabled={isSubmitting}
              />
              {errors.location && (
                <motion.p
                  id="location-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500"
                  role="alert"
                >
                  {errors.location}
                </motion.p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="available" className="cursor-pointer text-sm font-medium">
                Available for Booking
              </Label>
              <Switch id="available" checked={available} onCheckedChange={setAvailable} disabled={isSubmitting} />
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-black text-black hover:bg-black hover:text-white"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-neutral-800" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Model"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

