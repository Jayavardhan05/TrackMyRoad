"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Icon, divIcon } from "leaflet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Calendar, User } from "lucide-react"
import type { Report } from "@/types/report"

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface InteractiveMapProps {
  reports: Report[]
  onReportSelect?: (report: Report) => void
}

// Custom marker icons based on status
const createCustomIcon = (status: Report["status"], severity: number) => {
  const getColor = () => {
    switch (status) {
      case "pending":
        return "#f59e0b" // orange
      case "in-progress":
        return "#3b82f6" // blue
      case "resolved":
        return "#10b981" // green
      default:
        return "#6b7280" // gray
    }
  }

  const getSize = () => {
    if (severity >= 4) return 35
    if (severity >= 3) return 30
    return 25
  }

  const color = getColor()
  const size = getSize()

  return divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: ${size > 30 ? "14px" : "12px"};
      ">
        ${severity}
      </div>
    `,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// Component to handle map events and location
function MapController({ reports }: { reports: Report[] }) {
  const map = useMap()

  useEffect(() => {
    if (reports.length > 0) {
      // Fit map to show all markers
      const group = new (window as any).L.featureGroup(
        reports.map((report) => new (window as any).L.marker([report.location.lat, report.location.lng])),
      )
      map.fitBounds(group.getBounds().pad(0.1))
    }
  }, [map, reports])

  return null
}

export default function InteractiveMap({ reports, onReportSelect }: InteractiveMapProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Default center (Visakhapatnam)
  const defaultCenter: [number, number] = [17.7231, 83.3012]

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log("Location access denied:", error)
        },
      )
    }
  }, [])

  const getSeverityStars = (severity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < severity
            ? severity >= 4
              ? "fill-red-500 text-red-500"
              : "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))
  }

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleMarkerClick = (report: Report) => {
    setSelectedReport(report)
    if (onReportSelect) {
      onReportSelect(report)
    }
  }

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={userLocation || defaultCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController reports={reports} />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={divIcon({
              html: `
                <div style="
                  background-color: #3b82f6;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  animation: pulse 2s infinite;
                "></div>
              `,
              className: "user-location-marker",
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>
              <div className="text-center">
                <p className="font-medium">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Report markers */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            icon={createCustomIcon(report.status, report.severity)}
            eventHandlers={{
              click: () => handleMarkerClick(report),
            }}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="space-y-3 p-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm text-gray-900 pr-2">{report.title}</h3>
                  <Badge className={`${getStatusColor(report.status)} text-xs`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace("-", " ")}
                  </Badge>
                </div>

                <img
                  src={report.imageUrl || "/placeholder.svg"}
                  alt={report.title}
                  className="w-full h-32 object-cover rounded"
                />

                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    {getSeverityStars(report.severity)}
                    <span className="text-xs text-gray-600 ml-1">Severity {report.severity}/5</span>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{report.location.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{report.reportedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{report.reportedBy}</span>
                    </div>
                  </div>

                  {report.description && <p className="text-xs text-gray-600 line-clamp-2">{report.description}</p>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="font-medium text-sm text-gray-900 mb-2">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
              3
            </div>
            <span>Pending (number = severity)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
              2
            </div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
              1
            </div>
            <span>Resolved</span>
          </div>
          {userLocation && (
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
              <span>Your Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 z-10">
        <div className="flex flex-col space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  setUserLocation([position.coords.latitude, position.coords.longitude])
                })
              }
            }}
            className="text-xs"
          >
            <MapPin className="h-3 w-3 mr-1" />
            My Location
          </Button>

          <div className="text-xs text-gray-500 text-center">{reports.length} reports</div>
        </div>
      </div>

      {/* Selected Report Details (Mobile) */}
      {selectedReport && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10 md:hidden">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm">{selectedReport.title}</h4>
            <Button size="sm" variant="ghost" onClick={() => setSelectedReport(null)} className="h-6 w-6 p-0">
              ×
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-1">{getSeverityStars(selectedReport.severity)}</div>
            <p className="text-xs text-gray-600">{selectedReport.location.address}</p>
            <Badge className={getStatusColor(selectedReport.status)}>
              {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1).replace("-", " ")}
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}
