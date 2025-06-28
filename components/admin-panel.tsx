"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Star, MapPin, Calendar, User, Filter } from "lucide-react"
import type { Report } from "@/types/report"

interface AdminPanelProps {
  reports: Report[]
  onStatusUpdate: (reportId: string, status: Report["status"]) => void
}

export default function AdminPanel({ reports, onStatusUpdate }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesSeverity = severityFilter === "all" || report.severity.toString() === severityFilter

    return matchesSearch && matchesStatus && matchesSeverity
  })

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

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "text-red-600"
    if (severity >= 3) return "text-orange-600"
    return "text-yellow-600"
  }

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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="1">Severity 1</SelectItem>
            <SelectItem value="2">Severity 2</SelectItem>
            <SelectItem value="3">Severity 3</SelectItem>
            <SelectItem value="4">Severity 4</SelectItem>
            <SelectItem value="5">Severity 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredReports.length} of {reports.length} reports
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Filter className="h-4 w-4" />
          <span>
            Filters active:{" "}
            {[statusFilter !== "all", severityFilter !== "all", searchTerm !== ""].filter(Boolean).length}
          </span>
        </div>
      </div>

      {/* Reports Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{report.title}</p>
                    {report.description && <p className="text-xs text-gray-500 line-clamp-1">{report.description}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="truncate max-w-32">{report.location.address}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {getSeverityStars(report.severity)}
                    <span className={`text-xs font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity}/5
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={report.status}
                    onValueChange={(value: Report["status"]) => onStatusUpdate(report.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace("-", " ")}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>{report.reportedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{report.reportedBy}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{selectedReport?.title}</DialogTitle>
                      </DialogHeader>
                      {selectedReport && (
                        <div className="space-y-4">
                          <img
                            src={selectedReport.imageUrl || "/placeholder.svg"}
                            alt={selectedReport.title}
                            className="w-full h-64 object-cover rounded-lg"
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-gray-900">Location</h4>
                              <p className="text-sm text-gray-600">{selectedReport.location.address}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-900">Severity</h4>
                              <div className="flex items-center space-x-1">
                                {getSeverityStars(selectedReport.severity)}
                                <span className="text-sm">{selectedReport.severity}/5</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-900">Status</h4>
                              <Badge className={getStatusColor(selectedReport.status)}>
                                {selectedReport.status.charAt(0).toUpperCase() +
                                  selectedReport.status.slice(1).replace("-", " ")}
                              </Badge>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-900">Reported By</h4>
                              <p className="text-sm text-gray-600">{selectedReport.reportedBy}</p>
                            </div>
                          </div>

                          {selectedReport.description && (
                            <div>
                              <h4 className="font-medium text-sm text-gray-900">Description</h4>
                              <p className="text-sm text-gray-600">{selectedReport.description}</p>
                            </div>
                          )}

                          <div className="flex justify-end space-x-2">
                            <Select
                              value={selectedReport.status}
                              onValueChange={(value: Report["status"]) => onStatusUpdate(selectedReport.id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Mark as Pending</SelectItem>
                                <SelectItem value="in-progress">Mark as In Progress</SelectItem>
                                <SelectItem value="resolved">Mark as Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No reports found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
