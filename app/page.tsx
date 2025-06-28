"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, AlertTriangle, CheckCircle, Users, BarChart3 } from "lucide-react"
import UploadForm from "@/components/upload-form"
import MapView from "@/components/map-view"
import AdminPanel from "@/components/admin-panel"
import type { Report } from "@/types/report"

// Mock data - replace with real API calls
const mockReports: Report[] = [
  {
    id: "1",
    title: "Large Pothole on Beach Road",
    description: "Deep pothole causing traffic issues near RTC Complex",
    location: { lat: 17.7231, lng: 83.3012, address: "Beach Road, RTC Complex, Visakhapatnam" },
    imageUrl: "/placeholder.svg?height=300&width=400",
    severity: 4,
    status: "pending",
    reportedAt: new Date("2024-01-15"),
    reportedBy: "citizen123",
  },
  {
    id: "2",
    title: "Road Crack near VUDA Park",
    description: "Multiple cracks developing on main road",
    location: { lat: 17.74, lng: 83.32, address: "VUDA Park Road, Visakhapatnam" },
    imageUrl: "/placeholder.svg?height=300&width=400",
    severity: 2,
    status: "resolved",
    reportedAt: new Date("2024-01-10"),
    reportedBy: "user456",
  },
  {
    id: "3",
    title: "Damaged Road Surface",
    description: "Uneven road surface causing vehicle damage",
    location: { lat: 17.71, lng: 83.29, address: "Dwaraka Nagar, Visakhapatnam" },
    imageUrl: "/placeholder.svg?height=300&width=400",
    severity: 3,
    status: "in-progress",
    reportedAt: new Date("2024-01-12"),
    reportedBy: "reporter789",
  },
]

export default function Home() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [activeTab, setActiveTab] = useState("report")

  const handleNewReport = (newReport: Omit<Report, "id" | "reportedAt">) => {
    const report: Report = {
      ...newReport,
      id: Date.now().toString(),
      reportedAt: new Date(),
    }
    setReports((prev) => [report, ...prev])
  }

  const handleStatusUpdate = (reportId: string, status: Report["status"]) => {
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, status } : report)))
  }

  const pendingCount = reports.filter((r) => r.status === "pending").length
  const resolvedCount = reports.filter((r) => r.status === "resolved").length
  const inProgressCount = reports.filter((r) => r.status === "in-progress").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RoadEye Vizag</h1>
                <p className="text-sm text-gray-600">Report & Track Road Issues</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{pendingCount} Pending</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>{resolvedCount} Resolved</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="report" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Report Issue</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>View Map</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Admin Panel</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Report a Road Issue</CardTitle>
                <CardDescription>
                  Help improve Vizag's roads by reporting potholes, cracks, and other road damage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadForm onSubmit={handleNewReport} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Road Issues Map</CardTitle>
                <CardDescription>View all reported road issues across Visakhapatnam</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <MapView reports={reports} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Manage and update the status of reported road issues</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminPanel reports={reports} onStatusUpdate={handleStatusUpdate} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
