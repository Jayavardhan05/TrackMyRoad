export interface Report {
  id: string
  title: string
  description: string
  location: {
    lat: number
    lng: number
    address: string
  }
  imageUrl: string
  severity: number // 1-5
  status: "pending" | "in-progress" | "resolved"
  reportedAt: Date
  reportedBy: string
}
