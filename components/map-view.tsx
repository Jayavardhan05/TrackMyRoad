"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import type { Report } from "@/types/report"

// Dynamically import the map to avoid SSR issues
const InteractiveMap = dynamic(() => import("./interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  ),
})

interface MapViewProps {
  reports: Report[]
}

export default function MapView({ reports }: MapViewProps) {
  return (
    <div className="w-full">
      <InteractiveMap reports={reports} />
    </div>
  )
}
