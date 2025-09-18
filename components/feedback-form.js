"use client"

import { useState } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useToast } from "../hooks/use-toast"
import StarRating from "./star-rating"

export default function FeedbackForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    rating: 0,
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length > 80) {
      newErrors.title = "Title must be 80 characters or less"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.length > 600) {
      newErrors.message = "Message must be 600 characters or less"
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating"
    }

    if (!formData.image) {
      newErrors.image = "Please select an image"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

    if (file.size > maxSize) {
      setErrors({ ...errors, image: "File size must be less than 5MB" })
      return
    }

    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, image: "Only JPG, PNG, and WebP files are allowed" })
      return
    }

    setFormData({ ...formData, image: file })
    setErrors({ ...errors, image: null })

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setFormData({ ...formData, image: null })
    setImagePreview(null)
    setErrors({ ...errors, image: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors and try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("message", formData.message)
      submitData.append("rating", formData.rating.toString())
      submitData.append("image", formData.image)

      const response = await fetch("/api/feedback", {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit feedback")
      }

      const result = await response.json()

      toast({
        title: "Success!",
        description: "Your feedback has been submitted successfully.",
      })

      // Reset form
      setFormData({ title: "", message: "", rating: 0, image: null })
      setImagePreview(null)
      setErrors({})

      if (onSuccess) onSuccess(result)
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Share Your Inspiration</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Give your inspiration a title..."
              maxLength={80}
              className={`text-sm sm:text-base ${errors.title ? "border-destructive" : ""}`}
            />
            <div className="flex justify-between mt-1">
              {errors.title && <span className="text-xs sm:text-sm text-destructive">{errors.title}</span>}
              <span className="text-xs sm:text-sm text-muted-foreground ml-auto">{formData.title.length}/80</span>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message *
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what inspires you about this..."
              maxLength={600}
              rows={3}
              className={`text-sm sm:text-base sm:rows-4 ${errors.message ? "border-destructive" : ""}`}
            />
            <div className="flex justify-between mt-1">
              {errors.message && <span className="text-xs sm:text-sm text-destructive">{errors.message}</span>}
              <span className="text-xs sm:text-sm text-muted-foreground ml-auto">{formData.message.length}/600</span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <StarRating
              value={formData.rating}
              onChange={(rating) => setFormData({ ...formData, rating })}
              size={20}
              className="sm:hidden"
            />
            <StarRating
              value={formData.rating}
              onChange={(rating) => setFormData({ ...formData, rating })}
              size={24}
              className="hidden sm:flex"
            />
            {errors.rating && <span className="text-xs sm:text-sm text-destructive mt-1 block">{errors.rating}</span>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Image *</label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 sm:p-8 text-center hover:border-muted-foreground/50 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, or WebP (max 5MB)</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-32 sm:h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 sm:h-10 sm:w-10"
                  onClick={removeImage}
                >
                  <X size={14} className="sm:hidden" />
                  <X size={16} className="hidden sm:block" />
                </Button>
              </div>
            )}

            {errors.image && <span className="text-xs sm:text-sm text-destructive mt-1 block">{errors.image}</span>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full text-sm sm:text-base py-2 sm:py-3" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
