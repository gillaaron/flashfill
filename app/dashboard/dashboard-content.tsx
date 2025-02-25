"use client"

import { useState, useEffect, useCallback } from "react"
import { withAuth } from "@/components/withAuth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface DashboardData {
  totalContacts: number
  totalAppointments: number
  successfulAppointments: number
  successRate: number
}

function DashboardContent() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  const fetchDashboardData = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role, business_id, outlet_id")
        .eq("user_id", user.id)
        .single()

      if (!userRole) return

      let query = supabase.from("appointments").select("id, status, appointment_slots(outlet_id, outlets(business_id))")

      if (userRole.role === "outlet_manager") {
        query = query.eq("appointment_slots.outlet_id", userRole.outlet_id)
      } else if (userRole.role === "brand_manager") {
        query = query.eq("appointment_slots.outlets.business_id", userRole.business_id)
      }

      const [{ count: totalContacts }, { data: appointments }] = await Promise.all([
        supabase.from("contacts").select("count", { count: "exact" }),
        query,
      ])

      if (appointments) {
        const totalAppointments = appointments.length
        const successfulAppointments = appointments.filter((a) => a.status === "confirmed").length

        setDashboardData({
          totalContacts: totalContacts || 0,
          totalAppointments,
          successfulAppointments,
          successRate: totalAppointments > 0 ? (successfulAppointments / totalAppointments) * 100 : 0,
        })
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading data...</div>
  }

  if (!dashboardData) {
    return <div className="flex items-center justify-center min-h-screen">No data available</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        onClick={fetchDashboardData}
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

export default withAuth(DashboardContent, ["admin", "brand_manager", "outlet_manager"])

