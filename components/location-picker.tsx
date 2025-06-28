"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "lucide-react"

const MiniMap = dynamic(() => import("./mini-map"), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse" />,
})

interface LocationPickerProps {
  value: string
  onChange: (address: string, coordinates?: { lat: number; lng: number }) => void
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const getCurrentLocation = async () => {
    setIsGettingLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setCoordinates({ lat: latitude, lng: longitude })

          // Reverse geocoding (in a real app, you'd use a proper service)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            )
            const data = await response.json()
            const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            onChange(address, { lat: latitude, lng: longitude })
          } catch (error) {
            // Fallback to coordinates
            const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            onChange(address, { lat: latitude, lng: longitude })
          }

          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
        },
      )
    }
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="address">Location *</Label>
      <div className="flex space-x-2">
        <Input
          id="address"
          placeholder="Enter address or landmark"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center space-x-2 bg-transparent"
        >
          {isGettingLocation ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{isGettingLocation ? "Getting..." : "Current"}</span>
        </Button>
      </div>

      {coordinates && (
        <div className="border rounded-lg overflow-hidden">
          <MiniMap center={[coordinates.lat, coordinates.lng]} zoom={15} showMarker={true} />
        </div>
      )}
    </div>
  )
}
