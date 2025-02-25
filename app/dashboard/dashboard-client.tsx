"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface DashboardData {
  totalContacts: number
  totalAppointments: number
  successfulAppointments: number
  successRate: number
}

interface DashboardClientProps {
  initialData: DashboardData | null
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(initialData)
  const supabase = createClientComponentClient()

  const refreshData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      const data = await response.json()
      if (response.ok) {
        setDashboardData(data)
      } else {
        console.error("Error fetching dashboard data:", data.error)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }

  if (!dashboardData) {
    return <div>No data available</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        onClick={refreshData}
      >
        Refresh Data
      </button>
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <p className="text-gray-700 text-sm font-bold mb-2">Total Contacts</p>
            <p className="text-3xl font-bold">{dashboardData.totalContacts}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700 text-sm font-bold mb-2">Total Appointments</p>
            <p className="text-3xl font-bold">{dashboardData.totalAppointments}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-700 text-sm font-bold mb-2">Successful Appointments</p>
            <p className="text-3xl font-bold">{dashboardData.successfulAppointments}</p>
          </div>
          <div>
            <p className="text-gray-700 text-sm font-bold mb-2">Success Rate</p>
            <p className="text-3xl font-bold">{dashboardData.successRate.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

