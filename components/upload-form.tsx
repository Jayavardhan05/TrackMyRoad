"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Camera, Star } from "lucide-react"
import type { Report } from "@/types/report"
import LocationPicker from "./location-picker"

interface UploadFormProps {
  onSubmit: (report: Omit<Report, "id" | "reportedAt">) => void
}

export default function UploadForm({ onSubmit }: UploadFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    severity: 1,
    imageFile: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          setFormData((prev) => ({
            ...prev,
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you'd upload the image to a service like Cloudinary
    const mockImageUrl = "/placeholder.svg?height=300&width=400"

    const report: Omit<Report, "id" | "reportedAt"> = {
      title: formData.title,
      description: formData.description,
      location: {
        lat: 17.7231 + (Math.random() - 0.5) * 0.1, // Mock coordinates around Vizag
        lng: 83.3012 + (Math.random() - 0.5) * 0.1,
        address: formData.address,
      },
      imageUrl: mockImageUrl,
      severity: formData.severity,
      status: "pending",
      reportedBy: "current-user",
    }

    onSubmit(report)

    // Reset form
    setFormData({
      title: "",
      description: "",
      address: "",
      severity: 1,
      imageFile: null,
    })
    setImagePreview(null)
    setIsSubmitting(false)

    // Show success message (you could use a toast here)
    alert("Report submitted successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Photo of Road Issue *</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          {imagePreview ? (
            <div className="space-y-4">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setImagePreview(null)
                  setFormData((prev) => ({ ...prev, imageFile: null }))
                }}
              >
                Change Photo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Camera className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <Label htmlFor="image" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">Click to upload</span>
                  <span className="text-gray-500"> or drag and drop</span>
                </Label>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          )}
          <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Issue Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Large pothole on Beach Road"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the road issue in detail..."
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      {/* Location */}
      <LocationPicker
        value={formData.address}
        onChange={(address, coords) => {
          setFormData((prev) => ({ ...prev, address }))
          // Store coordinates for later use
          if (coords) {
            // You can store coords in formData if needed
          }
        }}
      />

      {/* Severity */}
      <div className="space-y-2">
        <Label htmlFor="severity">Severity Level</Label>
        <Select
          value={formData.severity.toString()}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, severity: Number.parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <span>Minor - Small crack or wear</span>
              </div>
            </SelectItem>
            <SelectItem value="2">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <span>Low - Noticeable but manageable</span>
              </div>
            </SelectItem>
            <SelectItem value="3">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <span>Medium - Affects driving comfort</span>
              </div>
            </SelectItem>
            <SelectItem value="4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <span>High - Potential vehicle damage</span>
              </div>
            </SelectItem>
            <SelectItem value="5">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  <Star className="h-4 w-4 fill-red-500 text-red-500" />
                  <Star className="h-4 w-4 fill-red-500 text-red-500" />
                  <Star className="h-4 w-4 fill-red-500 text-red-500" />
                  <Star className="h-4 w-4 fill-red-500 text-red-500" />
                  <Star className="h-4 w-4 fill-red-500 text-red-500" />
                </div>
                <span>Critical - Safety hazard</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Submitting Report...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Submit Report</span>
          </div>
        )}
      </Button>
    </form>
  )
}
