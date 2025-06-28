"use client"

import { MapContainer, TileLayer, Marker } from "react-leaflet"
import { divIcon } from "leaflet"

interface MiniMapProps {
  center: [number, number]
  zoom?: number
  showMarker?: boolean
}

export default function MiniMap({ center, zoom = 13, showMarker = false }: MiniMapProps) {
  const markerIcon = divIcon({
    html: `
      <div style="
        background-color: #ef4444;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    className: "mini-map-marker",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "128px", width: "100%" }}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {showMarker && <Marker position={center} icon={markerIcon} />}
    </MapContainer>
  )
}
