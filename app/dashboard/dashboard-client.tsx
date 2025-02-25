"use client"

import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface DashboardData {
  totalContacts: number
  totalAppointments: number
  successfulAppointments: number
  successRate: number
}

export default function DashboardClient() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard")
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!dashboardData) {
    return <div>No data available</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button onClick={fetchData} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Refresh
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Contacts</h2>
          <p className="text-3xl">{dashboardData.totalContacts}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Appointments</h2>
          <p className="text-3xl">{dashboardData.totalAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Successful Appointments</h2>
          <p className="text-3xl">{dashboardData.successfulAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Success Rate</h2>
          <p className="text-3xl">{dashboardData.successRate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  )
}

